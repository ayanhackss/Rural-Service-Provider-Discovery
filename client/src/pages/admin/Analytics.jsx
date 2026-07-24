import { useState, useEffect } from 'react';
import { getAdminAnalytics } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { PieChart, TrendingUp, Award, BarChart2 } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminAnalytics();
        setData(res.data);
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
        <div className="container section-sm">
          <div className="page-header">
            <p className="page-header__eyebrow">Admin</p>
            <h1 style={{ fontStyle: 'italic' }}>Platform Analytics</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-6)' }}>
              <TrendingUp size={32} color="var(--color-accent)" style={{ marginBottom: 'var(--space-3)' }} />
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 600 }}>{data?.recentBookings || 0}</div>
              <div className="label muted">Bookings (Last 7 Days)</div>
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-6)' }}>
              <PieChart size={32} color="var(--color-primary)" style={{ marginBottom: 'var(--space-3)' }} />
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 600 }}>{data?.byCategory?.length || 0}</div>
              <div className="label muted">Active Categories</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
            {/* Bookings by Category */}
            <div className="card">
              <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <BarChart2 size={20} className="muted" /> Bookings by Category
              </h3>
              {data?.byCategory?.length === 0 ? (
                <p className="muted">No data available.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {data?.byCategory?.map((item) => (
                    <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ width: '120px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item._id}
                      </div>
                      <div style={{ flex: 1, backgroundColor: 'var(--color-border)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          backgroundColor: 'var(--color-accent)', 
                          width: `${Math.min(100, (item.count / (data.byCategory[0]?.count || 1)) * 100)}%` 
                        }}></div>
                      </div>
                      <div style={{ width: '40px', textAlign: 'right', fontWeight: 600 }}>{item.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Providers */}
            <div className="card">
              <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Award size={20} className="muted" /> Top Providers (by bookings)
              </h3>
              {data?.topProviders?.length === 0 ? (
                <p className="muted">No top providers yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {data?.topProviders?.map((p, idx) => (
                    <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-rule)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '12px', backgroundColor: idx === 0 ? 'var(--color-accent)' : 'var(--color-bg-alt)', color: idx === 0 ? 'var(--color-bg)' : 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{p.location?.village || 'Unknown location'}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>{p.totalBookings}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>★ {p.averageRating?.toFixed(1) || '0.0'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
