import { useState, useEffect } from 'react';
import { getAdminBookings, cancelAdminBooking } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { CalendarX, Search } from 'lucide-react';

const STATUSES = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (tab) params.status = tab;
      const { data } = await getAdminBookings(params);
      setBookings(data.bookings);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [tab, page]);

  const handleCancel = async (id) => {
    if (!window.confirm('As an admin, are you sure you want to cancel this booking?')) return;
    try {
      await cancelAdminBooking(id);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    }
  };

  if (loading && bookings.length === 0) return <><Navbar /><Loader fullPage /></>;

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div className="page-header">
            <p className="page-header__eyebrow">Admin</p>
            <h1 style={{ fontStyle: 'italic' }}>Platform Bookings</h1>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
            {STATUSES.map((s) => (
              <button
                key={s || 'all'}
                onClick={() => { setTab(s); setPage(1); }}
                className={`btn btn-sm ${tab === s ? 'btn-primary' : 'btn-ghost'}`}
              >
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}
              </button>
            ))}
          </div>

          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <CalendarX size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <p style={{ fontStyle: 'italic' }}>No bookings found for this filter.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-rule)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Service</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Provider</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Resident</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--color-rule)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', whiteSpace: 'nowrap' }}>
                        {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>{b.serviceId?.title || '—'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>{b.providerId?.name || '—'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>{b.residentId?.name || '—'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                        <span className={`badge ${
                          b.status === 'completed' ? 'badge-success' : 
                          b.status === 'cancelled' ? 'badge-error' : 
                          b.status === 'confirmed' ? 'badge-primary' : 'badge-pending'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                        {['pending', 'confirmed'].includes(b.status) && (
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)', padding: '2px 8px', fontSize: '12px' }}
                            onClick={() => handleCancel(b._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Simple pagination */}
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
