import { useState, useEffect } from 'react';
import { getMyEarnings } from '../../api/me';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { IndianRupee, TrendingUp, CheckCircle } from 'lucide-react';

export default function Earnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyEarnings();
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
            <p className="page-header__eyebrow">Provider</p>
            <h1 style={{ fontStyle: 'italic' }}>Earnings Summary</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div className="card" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-rule)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
              <IndianRupee size={32} color="var(--color-accent)" style={{ marginBottom: 'var(--space-3)' }} />
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, color: 'var(--color-accent)' }}>
                ₹{data?.total?.toLocaleString('en-IN') || 0}
              </div>
              <div className="label muted">Total Estimated Earnings</div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-rule)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
              <CheckCircle size={32} color="var(--color-success, #10b981)" style={{ marginBottom: 'var(--space-3)' }} />
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 600 }}>
                {data?.completedCount || 0}
              </div>
              <div className="label muted">Completed Bookings</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <TrendingUp size={20} className="muted" /> Monthly Breakdown
            </h3>
            
            {!data?.monthly || Object.keys(data.monthly).length === 0 ? (
              <p className="muted" style={{ fontStyle: 'italic' }}>No completed bookings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {Object.entries(data.monthly).map(([month, count]) => (
                  <div key={month} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-rule)' }}>
                    <span style={{ fontWeight: 500 }}>{month}</span>
                    <span className="muted">{count} bookings</span>
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
