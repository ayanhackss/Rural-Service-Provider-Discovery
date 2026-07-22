import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProviderBookings, updateBookingStatus } from '../../api/bookings';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Inbox, User, CalendarDays } from 'lucide-react';

const STATUSES = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

const ACTION_MAP = {
  pending:   [{ label: 'Confirm', status: 'confirmed', style: 'primary' }, { label: 'Decline', status: 'cancelled', style: 'error' }],
  confirmed: [{ label: 'Mark Complete', status: 'completed', style: 'success' }, { label: 'Cancel', status: 'cancelled', style: 'error' }],
  completed: [],
  cancelled: [],
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

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

  const handleAction = async (id, status) => {
    await updateBookingStatus(id, status);
    fetch();
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
            <Loader />
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <Inbox size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
              <p style={{ fontStyle: 'italic' }}>No bookings found for the selected status.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {bookings.map((b) => (
                <div key={b._id} className="card">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-4)', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <h3 style={{ fontStyle: 'italic', fontSize: 'var(--text-md)' }}>{b.serviceId?.title}</h3>
                        <span className={`badge badge-${b.status}`}>{b.status}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <User size={16} style={{ color: 'var(--color-muted)' }} />
                          <span className="label" style={{ fontWeight: 400 }}>{b.residentId?.name} {b.residentId?.phone && `(+91 ${b.residentId.phone})`}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <CalendarDays size={16} style={{ color: 'var(--color-muted)' }} />
                          <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                            {new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {b.timeSlot}
                          </span>
                        </div>
                      </div>
                      {b.notes && (
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-dim)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                          "{b.notes}"
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
                      {(ACTION_MAP[b.status] || []).map((action) => (
                        <button
                          key={action.status}
                          onClick={() => handleAction(b._id, action.status)}
                          className={`btn btn-sm ${action.style === 'primary' ? 'btn-primary' : action.style === 'success' ? 'btn-outline' : 'btn-ghost'}`}
                          style={action.style === 'error' ? { color: 'var(--color-error)', borderColor: 'var(--color-error)' } : action.style === 'success' ? { color: 'var(--color-success)', borderColor: 'var(--color-success)' } : {}}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
