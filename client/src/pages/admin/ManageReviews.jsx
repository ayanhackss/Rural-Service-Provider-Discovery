import { useState, useEffect } from 'react';
import { getAdminReviews, deleteAdminReview } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { MessageSquare, Trash2, Star } from 'lucide-react';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminReviews({ page, limit });
      setReviews(data.reviews);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await deleteAdminReview(id);
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  if (loading && reviews.length === 0) return <><Navbar /><Loader fullPage /></>;

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div className="page-header">
            <p className="page-header__eyebrow">Admin</p>
            <h1 style={{ fontStyle: 'italic' }}>Platform Reviews</h1>
          </div>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <MessageSquare size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <p style={{ fontStyle: 'italic' }}>No reviews found.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {reviews.map(r => (
                <div key={r._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div style={{ fontWeight: 600 }}>{r.residentId?.name || 'Anonymous User'}</div>
                    <button 
                      className="btn btn-ghost btn-sm" 
                      style={{ color: 'var(--color-error)', padding: '4px' }}
                      onClick={() => handleDelete(r._id)}
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-2)' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < r.rating ? 'var(--color-accent)' : 'transparent'} color={i < r.rating ? 'var(--color-accent)' : 'var(--color-border)'} />
                    ))}
                  </div>

                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 'var(--space-3)' }}>
                    Service: <strong>{r.serviceId?.title || 'Unknown'}</strong>
                    <br />
                    Date: {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>

                  <p style={{ fontStyle: 'italic', color: 'var(--color-text)', flex: 1 }}>
                    "{r.comment || 'No comment provided.'}"
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {total > limit && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', justifyContent: 'center' }}>
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>Page {page} of {Math.ceil(total / limit)}</span>
              <button className="btn btn-outline btn-sm" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
