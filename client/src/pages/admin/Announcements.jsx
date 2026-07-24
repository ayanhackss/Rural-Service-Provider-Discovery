import { useState, useEffect } from 'react';
import { getAdminAnnouncements, createAdminAnnouncement, deleteAdminAnnouncement } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Megaphone, Trash2 } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminAnnouncements();
      setAnnouncements(data.announcements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) return;
    setSaving(true);
    try {
      await createAdminAnnouncement({ title, body });
      setTitle('');
      setBody('');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert('Failed to create announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteAdminAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && announcements.length === 0) return <><Navbar /><Loader fullPage /></>;

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="page-header">
            <p className="page-header__eyebrow">Admin</p>
            <h1 style={{ fontStyle: 'italic' }}>Announcements</h1>
          </div>

          <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 'var(--space-8)' }}>
            <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Megaphone size={20} className="muted" /> Post New Announcement
            </h3>
            
            <div className="form-group">
              <label>Title</label>
              <input type="text" className="input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="E.g., Platform Maintenance This Weekend" />
            </div>

            <div className="form-group">
              <label>Message Body</label>
              <textarea className="input" rows="4" value={body} onChange={e => setBody(e.target.value)} required placeholder="Provide details here..." />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Posting...' : 'Post Announcement'}
            </button>
          </form>

          <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)' }}>Recent Announcements</h3>
          
          {announcements.length === 0 ? (
            <p className="muted">No announcements posted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {announcements.map(a => (
                <div key={a._id} className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)' }}>{a.title}</h3>
                    <button 
                      className="btn btn-ghost btn-sm" 
                      style={{ color: 'var(--color-error)', padding: '4px' }}
                      onClick={() => handleDelete(a._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                    Posted by {a.createdBy} on {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{a.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
