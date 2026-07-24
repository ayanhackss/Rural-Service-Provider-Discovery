import { useState, useEffect } from 'react';
import { getAdminUsers, suspendUser } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Users, Ban, CheckCircle2 } from 'lucide-react';

export default function ManageResidents() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUsers({ role: 'resident', page, limit });
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSuspend = async (id, currentStatus) => {
    const action = currentStatus ? 'Unsuspend' : 'Suspend';
    if (!window.confirm(`${action} this user?`)) return;
    try {
      await suspendUser(id, !currentStatus);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action.toLowerCase()} user`);
    }
  };

  if (loading && users.length === 0) return <><Navbar /><Loader fullPage /></>;

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div className="page-header">
            <p className="page-header__eyebrow">Admin</p>
            <h1 style={{ fontStyle: 'italic' }}>Manage Residents</h1>
          </div>

          {users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <Users size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <p style={{ fontStyle: 'italic' }}>No resident accounts found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-rule)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Name</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Email</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Phone</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Joined</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--color-rule)', backgroundColor: u.isSuspended ? 'var(--color-bg-alt)' : 'transparent' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 500 }}>{u.name}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--color-muted)' }}>{u.email}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>{u.phone || '—'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                        {u.isSuspended ? (
                          <span className="badge badge-error" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Ban size={12} /> Suspended</span>
                        ) : (
                          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Active</span>
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                        <button 
                          className={`btn btn-sm ${u.isSuspended ? 'btn-outline' : 'btn-ghost'}`} 
                          style={{ color: u.isSuspended ? 'var(--color-text)' : 'var(--color-error)' }}
                          onClick={() => handleSuspend(u._id, u.isSuspended)}
                        >
                          {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
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
