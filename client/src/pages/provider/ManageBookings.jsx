import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProviderBookings, updateBookingStatus } from '../../api/bookings';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { Inbox, User, CalendarDays, KeyRound, XCircle, Phone, CheckCircle2, MessageCircle } from 'lucide-react';

const STATUSES = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

const PROVIDER_CANCEL_REASONS = [
  'Schedule conflict / Fully booked',
  'Location outside service area / too far',
  'Required tools or spare parts unavailable',
  'Emergency / Personal illness',
  'Customer requested cancellation via call',
  'Other reason'
];

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  // OTP Completion Modal state
  const [otpModalBooking, setOtpModalBooking] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Cancellation Modal state
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState(PROVIDER_CANCEL_REASONS[0]);
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = tab ? { status: tab } : {};
      const { data } = await getProviderBookings(params);
      setBookings(data.bookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [tab]);

  const handleActionClick = (booking, actionStatus) => {
    if (actionStatus === 'completed') {
      setOtpModalBooking(booking);
      setEnteredOtp('');
    } else if (actionStatus === 'cancelled') {
      setCancelModalBooking(booking);
      setCancelReason(PROVIDER_CANCEL_REASONS[0]);
      setCustomCancelReason('');
    } else {
      // Direct confirm
      executeStatusUpdate(booking._id, { status: actionStatus });
    }
  };

  const executeStatusUpdate = async (id, payload) => {
    try {
      await updateBookingStatus(id, payload);
      toast.success(`Booking updated successfully`);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleVerifyComplete = async (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length !== 4) {
      return toast.error('Please enter the 4-digit Completion OTP provided by customer');
    }

    setVerifyingOtp(true);
    try {
      await updateBookingStatus(otpModalBooking._id, {
        status: 'completed',
        otp: enteredOtp.trim(),
      });
      toast.success('Job verified and marked completed! 🎉');
      setOtpModalBooking(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Completion OTP. Please verify with resident.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      const finalReason = cancelReason === 'Other reason' && customCancelReason.trim()
        ? customCancelReason.trim()
        : cancelReason;

      await updateBookingStatus(cancelModalBooking._id, {
        status: 'cancelled',
        cancellationReason: finalReason,
      });
      toast.success('Booking cancelled');
      setCancelModalBooking(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Provider Dashboard</p>
            <h1 style={{ fontStyle: 'italic' }}>Manage Bookings</h1>
          </div>

          {/* Navigation tabs */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-rule)', paddingBottom: 'var(--space-4)' }}>
            <Link to="/provider/listings" className="btn btn-ghost btn-sm">Listings</Link>
            <span className="btn btn-primary btn-sm">Bookings</span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
            {STATUSES.map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setTab(s)}
                className={`btn btn-sm ${tab === s ? 'btn-primary' : 'btn-ghost'}`}
              >
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Skeleton height="100px" />
              <Skeleton height="100px" />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState 
              icon={Inbox} 
              title="No bookings" 
              description="No bookings found for the selected status." 
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {bookings.map((b) => (
                <div key={b._id} className="card booking-card">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <h3 className="booking-card__title" style={{ margin: 0 }}>{b.serviceId?.title}</h3>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', margin: 'var(--space-3) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <User size={16} style={{ color: 'var(--color-muted)' }} />
                          <span style={{ fontWeight: 500 }}>{b.residentId?.name}</span>
                          {b.residentId?.location?.village && (
                            <span style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-xs)' }}>
                              · {b.residentId.location.village}
                            </span>
                          )}
                        </div>

                        {b.residentId?.phone && (
                          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                            <a
                              href={`tel:${b.residentId.phone}`}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '2px 8px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Phone size={12} /> Call +91 {b.residentId.phone}
                            </a>
                            <a
                              href={`https://wa.me/91${b.residentId.phone}?text=${encodeURIComponent(`Namaste ${b.residentId.name}, I am contacting you regarding your booking for ${b.serviceId?.title || 'service'}.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '2px 8px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)' }}
                            >
                              <MessageCircle size={12} /> WhatsApp
                            </a>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <CalendarDays size={16} style={{ color: 'var(--color-muted)' }} />
                        <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                          {new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {b.timeSlot}
                        </span>
                      </div>
                    </div>

                    {b.notes && (
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-dim)', margin: 'var(--space-2) 0', fontStyle: 'italic', background: 'var(--color-paper-3)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                        Resident note: "{b.notes}"
                      </p>
                    )}

                    {/* Cancellation Reason Display */}
                    {b.status === 'cancelled' && (
                      <div style={{
                        margin: 'var(--space-3) 0',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'oklch(58% 0.20 25 / 0.08)',
                        borderLeft: '3px solid var(--color-error)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-ink)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600, color: 'var(--color-error)', marginBottom: '2px' }}>
                          <XCircle size={14} />
                          Cancelled by {b.cancelledBy ? b.cancelledBy.charAt(0).toUpperCase() + b.cancelledBy.slice(1) : 'User'}
                        </div>
                        <div style={{ color: 'var(--color-ink-dim)', fontStyle: 'italic' }}>
                          "{b.cancellationReason || 'No reason specified'}"
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="booking-card__actions">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleActionClick(b, 'confirmed')}
                          className="btn btn-sm btn-primary"
                        >
                          Confirm Booking
                        </button>
                        <button
                          onClick={() => handleActionClick(b, 'cancelled')}
                          className="btn btn-sm btn-outline"
                          style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {b.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleActionClick(b, 'completed')}
                          className="btn btn-sm"
                          style={{ background: 'var(--color-success)', color: '#fff', borderColor: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <KeyRound size={14} /> Mark Completed (Enter OTP)
                        </button>
                        <button
                          onClick={() => handleActionClick(b, 'cancelled')}
                          className="btn btn-sm btn-outline"
                          style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}

                    {b.status === 'completed' && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Service Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OTP Completion Modal */}
        {otpModalBooking && (
          <div className="modal-overlay" onClick={() => !verifyingOtp && setOtpModalBooking(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="modal__header">
                <h2 style={{ fontSize: 'var(--text-xl)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <KeyRound size={22} style={{ color: 'var(--color-success)' }} />
                  Verify Completion OTP
                </h2>
                <button className="btn btn-ghost btn-sm" disabled={verifyingOtp} onClick={() => setOtpModalBooking(null)}>✕</button>
              </div>

              <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                Ask <strong>{otpModalBooking.residentId?.name}</strong> for the 4-digit OTP shown on their booking card to verify service completion.
              </p>

              <form onSubmit={handleVerifyComplete}>
                <div className="form-group" style={{ marginBottom: 'var(--space-5)', textAlign: 'center' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    Customer 4-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    autoFocus
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • •"
                    className="form-input"
                    style={{
                      fontSize: '2rem',
                      fontFamily: 'var(--font-outlier)',
                      letterSpacing: '0.4em',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: 'var(--color-success)',
                      padding: 'var(--space-3)',
                      maxWidth: '240px',
                      margin: '0 auto'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={verifyingOtp} onClick={() => setOtpModalBooking(null)}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-sm"
                    disabled={verifyingOtp || enteredOtp.length !== 4}
                    style={{ background: 'var(--color-success)', color: '#fff', borderColor: 'var(--color-success)' }}
                  >
                    {verifyingOtp ? 'Verifying...' : 'Verify & Complete Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Provider Cancellation Modal */}
        {cancelModalBooking && (
          <div className="modal-overlay" onClick={() => !cancelling && setCancelModalBooking(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2 style={{ fontSize: 'var(--text-xl)', fontStyle: 'italic', color: 'var(--color-error)' }}>Cancel Booking</h2>
                <button className="btn btn-ghost btn-sm" disabled={cancelling} onClick={() => setCancelModalBooking(null)}>✕</button>
              </div>

              <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                Booking for <strong>{cancelModalBooking.residentId?.name}</strong> ({cancelModalBooking.serviceId?.title})
              </p>

              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
                  Reason for Cancellation
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {PROVIDER_CANCEL_REASONS.map((r) => (
                    <label key={r} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-2) var(--space-3)',
                      background: cancelReason === r ? 'oklch(58% 0.20 25 / 0.1)' : 'var(--color-paper-3)',
                      border: `1px solid ${cancelReason === r ? 'var(--color-error)' : 'var(--color-rule)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <input
                        type="radio"
                        name="cancelReason"
                        checked={cancelReason === r}
                        onChange={() => setCancelReason(r)}
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {cancelReason === 'Other reason' && (
                <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                  <label className="form-label">Please explain (optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                    placeholder="Tell us what happened..."
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" disabled={cancelling} onClick={() => setCancelModalBooking(null)}>
                  Keep Booking
                </button>
                <button 
                  className="btn btn-sm" 
                  disabled={cancelling}
                  onClick={handleConfirmCancel}
                  style={{ background: 'var(--color-error)', color: '#fff', borderColor: 'var(--color-error)' }}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
