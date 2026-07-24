import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, updateBookingStatus } from '../../api/bookings';
import { postReview, canReview } from '../../api/reviews';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import Skeleton from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { CalendarX, CalendarDays, User } from 'lucide-react';

const STATUSES = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [reviewModal, setReviewModal] = useState(null); // { booking }
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

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

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await updateBookingStatus(id, 'cancelled');
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to cancel booking');
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
                <div key={b._id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                      <div>
                        <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-1)' }}>{b.serviceId?.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
                          <User size={14} /> {b.providerId?.name}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600 }}>
                          <CalendarDays size={16} color="var(--color-accent)" />
                          {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-6)' }}>
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
                              backgroundColor: isCancelled ? 'var(--color-error)' : isPast ? 'var(--color-accent)' : 'var(--color-border)',
                              borderRadius: '2px',
                              opacity: isPast ? 1 : 0.3
                            }}></div>
                            <span style={{ 
                              fontSize: '10px', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.05em',
                              fontWeight: isCurrent ? 700 : 400,
                              color: isCancelled ? 'var(--color-error)' : isPast ? 'var(--color-text)' : 'var(--color-muted)' 
                            }}>
                              {isCancelled ? 'Cancelled' : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
                    {['pending', 'confirmed'].includes(b.status) && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleCancel(b._id)} style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                        Cancel
                      </button>
                    )}
                    {b.status === 'completed' && (
                      <button className="btn btn-primary btn-sm" onClick={() => openReview(b)}>
                        Leave review
                      </button>
                    )}
                    <Link to={`/services/${b.serviceId?._id}`} className="btn btn-ghost btn-sm">View service</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
