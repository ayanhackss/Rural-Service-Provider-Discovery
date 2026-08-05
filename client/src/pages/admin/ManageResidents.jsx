import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAdminUsers, suspendUser, resetUserPassword, updateUserRole, deleteUser } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { Users, Ban, CheckCircle2, KeyRound, Trash2, Search, Shield, UserCog } from 'lucide-react';

export default function ManageResidents() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionUserId, setActionUserId] = useState(null);
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUsers({ role: 'resident', page, limit });
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load residents');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSuspend = async (id, currentStatus) => {
    const action = currentStatus ? 'Unsuspend' : 'Suspend';
    if (!window.confirm(`${action} this resident?`)) return;
    try {
      await suspendUser(id, !currentStatus);
      toast.success(`Resident ${!currentStatus ? 'suspended' : 'reactivated'}`);
      fetchUsers();
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} user`);
    }
  };

  const handleResetPassword = async (id, name) => {
    const newPass = window.prompt(`Reset password for resident "${name}" to:`, 'password123');
    if (!newPass) return;
    setActionUserId(id);
    try {
      await resetUserPassword(id, newPass);
      toast.success(`Password reset to "${newPass}"`);
    } catch (err) {
      toast.error('Failed to reset password');
    } finally {
      setActionUserId(null);
    }
  };

  const handleRoleChange = async (id, name, currentRole) => {
    const newRole = window.prompt(`Change role for "${name}" (resident, provider, admin):`, currentRole);
    if (!newRole || newRole === currentRole) return;
    if (!['resident', 'provider', 'admin'].includes(newRole.toLowerCase())) {
      toast.error('Invalid role. Choose resident, provider, or admin');
      return;
    }
    setActionUserId(id);
    try {
      await updateUserRole(id, newRole.toLowerCase());
      toast.success(`Updated role for ${name} to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    } finally {
      setActionUserId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete resident account "${name}"?`)) return;
    setActionUserId(id);
    try {
      await deleteUser(id);
      toast.success(`Resident "${name}" deleted`);
      setUsers(users.filter(u => u._id !== id));
      setTotal(t => t - 1);
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setActionUserId(null);
    }
  };

  const filteredUsers = users.filter(u =>
    !search.trim() ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div>
              <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Admin</p>
              <h1 style={{ fontStyle: 'italic' }}>Manage Residents ({total})</h1>
            </div>
            <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
          </div>

          {/* Search Bar */}
          <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search resident by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '42px', width: '100%' }}
              />
            </div>
          </div>

          {loading && users.length === 0 ? (
            <Loader />
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <Users size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <p style={{ fontStyle: 'italic' }}>No resident accounts found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Resident Name</th>
                    <th>Email & Contact</th>
                    <th>Location</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{u.name}</td>
                      <td>
                        <div>{u.email}</div>
                        {u.phone && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{u.phone}</div>}
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)' }}>
                        {u.location?.village || '—'} {u.location?.pinCode && `(${u.location.pinCode})`}
                      </td>
                      <td style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xs)' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        {u.isSuspended ? (
                          <span className="badge badge-cancelled" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Ban size={12} /> Suspended</span>
                        ) : (
                          <span className="badge badge-confirmed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Active</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          <button 
                            className={`btn btn-sm ${u.isSuspended ? 'btn-outline' : 'btn-ghost'}`} 
                            style={{ color: u.isSuspended ? 'var(--color-success)' : 'var(--color-warning)' }}
                            onClick={() => handleSuspend(u._id, u.isSuspended)}
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
                            title="Change Role"
                            onClick={() => handleRoleChange(u._id, u.name, u.role)}
                            disabled={actionUserId === u._id}
                          >
                            <UserCog size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--color-error)' }}
                            title="Delete Account"
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

