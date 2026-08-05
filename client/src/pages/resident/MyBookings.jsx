import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, updateBookingStatus } from '../../api/bookings';
import { postReview, canReview } from '../../api/reviews';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { CalendarX, CalendarDays, User, KeyRound, AlertCircle, XCircle } from 'lucide-react';

const STATUSES = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

const RESIDENT_CANCEL_REASONS = [
  'Found another provider / alternative',
  'Changed mind / No longer needed',
  'Emergency / Need to reschedule date',
  'Provider not responsive',
  'Price or service terms issue',
  'Other reason'
];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [reviewModal, setReviewModal] = useState(null); // { booking }
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // Cancellation Modal state
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState(RESIDENT_CANCEL_REASONS[0]);
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = tab ? { status: tab } : {};
      const { data } = await getMyBookings(params);
      setBookings(data.bookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [tab]);

  const openCancelModal = (booking) => {
    setCancelModalBooking(booking);
    setCancelReason(RESIDENT_CANCEL_REASONS[0]);
    setCustomCancelReason('');
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
      toast.success('Booking cancelled successfully');
      setCancelModalBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const openReview = async (booking) => {
    const { data } = await canReview(booking._id);
    if (!data.canReview) {
      toast.error('You can only review a completed booking once.');
      return;
    }
    setReviewModal(booking);
    setReviewRating(0);
    setReviewComment('');
  };

  const submitReview = async () => {
    if (!reviewRating) return toast.error('Please select a rating');
    try {
      await postReview({ bookingId: reviewModal._id, rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div className="page-header">
            <p className="page-header__eyebrow">Resident</p>
            <h1 style={{ fontStyle: 'italic' }}>My Bookings</h1>
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-rule)', paddingBottom: 'var(--space-4)' }}>
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
              <Skeleton height="120px" />
              <Skeleton height="120px" />
              <Skeleton height="120px" />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState 
              icon={CalendarX} 
              title="No bookings yet" 
              description="You haven't made any bookings matching this status." 
              action={<Link to="/services" className="btn btn-primary">Find a Service</Link>} 
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {bookings.map((b) => (
                <div key={b._id} className="card booking-card">
                  <div>
                    {/* Header meta: Category & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <span className="label" style={{ color: 'var(--color-accent)', fontSize: 'var(--text-xs)' }}>
                        {b.serviceId?.category || 'Service'}
                      </span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontFamily: 'var(--font-outlier)' }}>
                        <CalendarDays size={14} style={{ color: 'var(--color-accent)' }} />
                        {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {b.timeSlot && ` · ${b.timeSlot}`}
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3 className="booking-card__title">
                      {b.serviceId?.title}
                    </h3>

                    {/* Provider Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                      <User size={14} />
                      <span>{b.providerId?.name || 'Local Provider'}</span>
                      {b.providerId?.location?.village && (
                        <span style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-xs)' }}>
                          · {b.providerId.location.village}
                        </span>
                      )}
                    </div>

                    {/* 4-Digit Job Completion OTP for Active/Confirmed Bookings */}
                    {['pending', 'confirmed'].includes(b.status) && (
                      <div style={{
                        margin: 'var(--space-3) 0',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'oklch(65% 0.14 145 / 0.08)',
                        border: '1px dashed oklch(65% 0.14 145 / 0.45)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 'var(--space-3)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <KeyRound size={20} style={{ color: 'var(--color-success)' }} />
                          <div>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink)' }}>
                              Job Completion OTP
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                              Share this 4-digit code with the provider only after service is completed
                            </div>
                          </div>
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-outlier)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          letterSpacing: '0.25em',
                          padding: '4px 14px',
                          background: 'var(--color-paper)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-rule)',
                          color: 'var(--color-success)'
                        }}>
                          {b.completionOtp || '••••'}
                        </div>
                      </div>
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
                          "{b.cancellationReason || 'No reason provided'}"
                        </div>
                      </div>
                    )}

                    {/* Status Timeline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-2)' }}>
                      {['pending', 'confirmed', 'completed'].map((step, idx) => {
                        const statuses = ['pending', 'confirmed', 'completed'];
                        const currentIdx = statuses.indexOf(b.status === 'cancelled' ? 'pending' : b.status);
                        const isPast = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        const isCancelled = b.status === 'cancelled' && idx === 0;

                        return (
                          <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <div style={{ 
                              height: '4px', 
                              backgroundColor: isCancelled ? 'var(--color-error)' : isPast ? 'var(--color-accent)' : 'var(--color-rule)',
                              borderRadius: '2px',
                              opacity: isPast ? 1 : 0.3
                            }}></div>
                            <span style={{ 
                              fontSize: '10px', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.05em',
                              fontWeight: isCurrent ? 700 : 400,
                              color: isCancelled ? 'var(--color-error)' : isPast ? 'var(--color-ink)' : 'var(--color-muted)' 
                            }}>
                              {isCancelled ? 'Cancelled' : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="booking-card__actions">
                    {['pending', 'confirmed'].includes(b.status) && (
                      <button className="btn btn-outline btn-sm" onClick={() => openCancelModal(b)} style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                        Cancel Booking
                      </button>
                    )}
                    {b.status === 'completed' && (
                      <button className="btn btn-primary btn-sm" onClick={() => openReview(b)}>
                        Leave Review
                      </button>
                    )}
                    <Link to={`/services/${b.serviceId?._id}`} className="btn btn-ghost btn-sm">
                      View Service Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancellation Modal */}
        {cancelModalBooking && (
          <div className="modal-overlay" onClick={() => !cancelling && setCancelModalBooking(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2 style={{ fontSize: 'var(--text-xl)', fontStyle: 'italic', color: 'var(--color-error)' }}>Cancel Booking</h2>
                <button className="btn btn-ghost btn-sm" disabled={cancelling} onClick={() => setCancelModalBooking(null)}>✕</button>
              </div>
              
              <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                {cancelModalBooking.serviceId?.title} with {cancelModalBooking.providerId?.name}
              </p>

              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
                  Reason for Cancellation
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {RESIDENT_CANCEL_REASONS.map((r) => (
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

        {/* Review modal */}
        {reviewModal && (
          <div className="modal-overlay" onClick={() => setReviewModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2 style={{ fontSize: 'var(--text-xl)', fontStyle: 'italic' }}>Review your experience</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setReviewModal(null)}>✕</button>
              </div>
              <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>
                {reviewModal.serviceId?.title} — {reviewModal.providerId?.name}
              </p>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>Rating</label>
                <StarRating rating={reviewRating} interactive onChange={setReviewRating} size="lg" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label" htmlFor="review-comment">Comment (optional)</label>
                <textarea
                  id="review-comment"
                  className="form-textarea"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the service?"
                  rows={3}
                />
              </div>
              <button className="btn btn-primary btn-full" onClick={submitReview}>Submit review</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
