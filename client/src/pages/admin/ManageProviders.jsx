import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminUsers, approveUser, suspendUser } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';

export default function ManageProviders() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: 'provider', approved: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { role: filter.role };
      if (filter.approved !== '') params.approved = filter.approved;
      const { data } = await getAdminUsers(params);
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [filter]);

  const handleApprove = async (id, isApproved) => {
    await approveUser(id, isApproved);
    fetch();
  };

  const handleSuspend = async (id, isSuspended) => {
    if (!window.confirm(isSuspended ? 'Suspend this user?' : 'Unsuspend this user?')) return;
    await suspendUser(id, isSuspended);
    fetch();
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div>
              <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Admin</p>
              <h1 style={{ fontStyle: 'italic' }}>Manage Providers</h1>
            </div>
            <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
            <select className="form-select" value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.target.value })} style={{ width: 'auto' }} aria-label="Filter by role">
              <option value="provider">Providers</option>
              <option value="resident">Residents</option>
            </select>
            <select className="form-select" value={filter.approved} onChange={(e) => setFilter({ ...filter, approved: e.target.value })} style={{ width: 'auto' }} aria-label="Approval status">
              <option value="">All</option>
              <option value="false">Pending</option>
              <option value="true">Approved</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-muted)' }}>No users found</td></tr>
                  )}
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 500, color: 'var(--color-ink)' }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.location?.village || '—'} {u.location?.pinCode && `(${u.location.pinCode})`}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          {u.role === 'provider' && (
                            <span className={`badge ${u.isApproved ? 'badge-confirmed' : 'badge-pending'}`}>
                              {u.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          )}
                          {u.isSuspended && <span className="badge badge-cancelled">Suspended</span>}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xs)' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          {u.role === 'provider' && !u.isApproved && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleApprove(u._id, true)}>Approve</button>
                          )}
                          {u.role === 'provider' && u.isApproved && (
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleApprove(u._id, false)}>Revoke</button>
                          )}
                          <button
                            className="btn btn-outline btn-sm"
                            style={u.isSuspended ? { color: 'var(--color-success)', borderColor: 'var(--color-success)' } : { color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
                            onClick={() => handleSuspend(u._id, !u.isSuspended)}
                          >
                            {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
