import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyReviews } from '../../api/me';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Star, MessageSquare } from 'lucide-react';

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyReviews();
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

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <MessageSquare size={28} className="muted" />
            <h1 style={{ fontStyle: 'italic' }}>My Reviews</h1>
          </div>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <Star size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <h2 className="empty-state__title">No reviews yet</h2>
              <p style={{ fontStyle: 'italic' }}>You haven't left any reviews for services.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {reviews.map((review) => (
                <div key={review._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <Link to={`/service/${review.serviceId?._id}`} style={{ fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none' }} className="hover-underline">
                      {review.serviceId?.title || 'Unknown Service'}
                    </Link>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-3)' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? 'var(--color-accent)' : 'transparent'} color={i < review.rating ? 'var(--color-accent)' : 'var(--color-border)'} />
                    ))}
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--color-muted)' }}>"{review.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
