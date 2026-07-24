import { useState, useEffect } from 'react';
import { getProviderReviews } from '../../api/me';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Star, MessageSquare } from 'lucide-react';

export default function ReviewsReceived() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProviderReviews();
        setReviews(res.data.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <><Navbar /><Loader fullPage /></>;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="page-header">
            <p className="page-header__eyebrow">Provider</p>
            <h1 style={{ fontStyle: 'italic' }}>Reviews Received</h1>
          </div>

          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-accent)' }}>{avgRating}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(avgRating) ? 'var(--color-accent)' : 'transparent'} color={i < Math.round(avgRating) ? 'var(--color-accent)' : 'var(--color-border)'} />
                  ))}
                </div>
                <span className="muted" style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>Based on {reviews.length} reviews</span>
              </div>
            </div>
          )}

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <MessageSquare size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <h2 className="empty-state__title">No reviews yet</h2>
              <p style={{ fontStyle: 'italic' }}>When residents review your services, they will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {reviews.map((review) => (
                <div key={review._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div style={{ fontWeight: 600 }}>{review.residentId?.name || 'Anonymous User'}</div>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-3)' }}>
                    For service: {review.serviceId?.title}
                  </div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-3)' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? 'var(--color-accent)' : 'transparent'} color={i < review.rating ? 'var(--color-accent)' : 'var(--color-border)'} />
                    ))}
                  </div>
                  {review.comment && <p style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>"{review.comment}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
