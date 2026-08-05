import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAdminUsers, approveUser, suspendUser, resetUserPassword, deleteUser } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { KeyRound, Trash2, Search, Phone, Star } from 'lucide-react';

export default function ManageProviders() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ approved: '' });
  const [actionUserId, setActionUserId] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { role: 'provider' };
      if (filter.approved !== '') params.approved = filter.approved;
      const { data } = await getAdminUsers(params);
      setUsers(data.users);
    } catch (err) {
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleApprove = async (id, isApproved) => {
    try {
      await approveUser(id, isApproved);
      toast.success(isApproved ? 'Provider approved' : 'Approval revoked');
      fetch();
    } catch (err) {
      toast.error('Failed to update approval');
    }
  };

  const handleSuspend = async (id, isSuspended) => {
    if (!window.confirm(isSuspended ? 'Suspend this provider? This will deactivate their services.' : 'Unsuspend this provider?')) return;
    try {
      await suspendUser(id, isSuspended);
      toast.success(isSuspended ? 'Provider suspended' : 'Provider reactivated');
      fetch();
    } catch (err) {
      toast.error('Failed to update suspension');
    }
  };

  const handleResetPassword = async (id, name) => {
    const newPass = window.prompt(`Reset password for "${name}" to:`, 'password123');
    if (!newPass) return;
    setActionUserId(id);
    try {
      await resetUserPassword(id, newPass);
      toast.success(`Password for ${name} reset to "${newPass}"`);
    } catch (err) {
      toast.error('Failed to reset password');
    } finally {
      setActionUserId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete provider "${name}" and all their services?`)) return;
    setActionUserId(id);
    try {
      await deleteUser(id);
      toast.success(`Provider "${name}" deleted`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      toast.error('Failed to delete provider');
    } finally {
      setActionUserId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    !search.trim() || 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.location?.village?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div>
              <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Admin</p>
              <h1 style={{ fontStyle: 'italic' }}>Manage Service Providers ({filteredUsers.length})</h1>
            </div>
            <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
          </div>

          {/* Filters Bar */}
          <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search provider by name, email, village..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '42px', width: '100%' }}
                />
              </div>

              <select 
                className="form-select" 
                value={filter.approved} 
                onChange={(e) => setFilter({ ...filter, approved: e.target.value })} 
                style={{ width: 'auto', minWidth: '180px' }} 
                aria-label="Approval status"
              >
                <option value="">All Providers</option>
                <option value="false">Pending Approval Only</option>
                <option value="true">Approved Only</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Provider Name</th>
                    <th>Contact & Location</th>
                    <th>Performance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-muted)' }}>No providers found</td></tr>
                  )}
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{u.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{u.email}</div>
                      </td>
                      <td>
                        {u.phone && (
                          <div style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                            <Phone size={12} /> {u.phone}
                          </div>
                        )}
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                          {u.location?.village || '—'} {u.location?.pinCode && `(${u.location.pinCode})`}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)' }}>
                          <Star size={14} style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} />
                          <span>{u.averageRating ? u.averageRating.toFixed(1) : '—'}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>({u.totalBookings || 0} jobs)</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          <span className={`badge ${u.isApproved ? 'badge-confirmed' : 'badge-pending'}`}>
                            {u.isApproved ? 'Approved' : 'Pending'}
                          </span>
                          {u.isSuspended && <span className="badge badge-cancelled">Suspended</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          {!u.isApproved ? (
                            <button className="btn btn-primary btn-sm" onClick={() => handleApprove(u._id, true)}>Approve</button>
                          ) : (
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleApprove(u._id, false)}>Revoke</button>
                          )}
                          <button
                            className="btn btn-outline btn-sm"
                            style={u.isSuspended ? { color: 'var(--color-success)', borderColor: 'var(--color-success)' } : { color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
                            onClick={() => handleSuspend(u._id, !u.isSuspended)}
                          >
                            {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Reset Password"
                            onClick={() => handleResetPassword(u._id, u.name)}
                            disabled={actionUserId === u._id}
                          >
                            <KeyRound size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--color-error)' }}
                            title="Delete Provider"
                            onClick={() => handleDelete(u._id, u.name)}
                            disabled={actionUserId === u._id}
                          >
                            <Trash2 size={16} />
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

