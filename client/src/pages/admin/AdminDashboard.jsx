import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getAdminUsers, approveUser, suspendUser } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([
        getStats(),
        getAdminUsers({ role: 'provider', approved: 'false' }),
      ]);
      setStats(sRes.data);
      setPendingProviders(uRes.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id, isApproved) => {
    await approveUser(id, isApproved);
    fetch();
  };

  if (loading) return <><Navbar /><Loader fullPage /></>;

  const STAT_CARDS = [
    { label: 'Total Providers', value: stats.totalProviders },
    { label: 'Pending Approval', value: stats.pendingProviders, accent: true },
    { label: 'Residents', value: stats.totalResidents },
    { label: 'Active Services', value: stats.totalServices },
    { label: 'Total Bookings', value: stats.totalBookings },
    { label: 'Completed', value: stats.completedBookings },
  ];

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div>
              <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Admin</p>
              <h1 style={{ fontStyle: 'italic' }}>Platform Dashboard</h1>
            </div>
            <Link to="/admin/providers" className="btn btn-outline">Manage Providers</Link>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-12)' }}>
            {STAT_CARDS.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-card__value" style={s.accent ? { color: 'var(--color-accent)' } : {}}>
                  {s.value}
                </div>
                <div className="stat-card__label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pending approvals */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontStyle: 'italic', fontSize: 'var(--text-xl)' }}>
                Pending Provider Approvals
                {pendingProviders.length > 0 && (
                  <span className="badge badge-pending" style={{ marginLeft: 'var(--space-3)', verticalAlign: 'middle' }}>
                    {pendingProviders.length}
                  </span>
                )}
              </h2>
            </div>

            {pendingProviders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
                <ShieldCheck size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
                <h2 className="empty-state__title">All caught up</h2>
                <p style={{ fontStyle: 'italic' }}>No providers pending approval.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {pendingProviders.map((u) => (
                  <div key={u._id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-4)', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-1)' }}>{u.name}</h3>
                      <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{u.email}</p>
                      <p style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                        {u.location?.village || '—'} · {u.location?.pinCode || '—'} · Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleApprove(u._id, true)}>Approve</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleApprove(u._id, false)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
