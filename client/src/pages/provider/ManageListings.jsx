import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyServices, createService, updateService, deleteService, getCategories } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { FolderOpen } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function emptyForm() {
  return {
    title: '', category: '', description: '',
    priceRange: { min: '', max: '' },
    availability: [],
    isActive: true,
  };
}

export default function ManageListings() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | service object
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([getMyServices(), getCategories()]);
      setServices(sRes.data.services);
      setCategories(cRes.data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(emptyForm()); setModal('create'); setMsg(''); };
  const openEdit = (s) => {
    setForm({
      title: s.title, category: s.category, description: s.description,
      priceRange: { min: s.priceRange.min, max: s.priceRange.max },
      availability: s.availability || [],
      isActive: s.isActive,
    });
    setModal(s);
    setMsg('');
  };

  const toggleDay = (day) => {
    const exists = form.availability.find((a) => a.day === day);
    if (exists) {
      setForm((f) => ({ ...f, availability: f.availability.filter((a) => a.day !== day) }));
    } else {
      setForm((f) => ({ ...f, availability: [...f.availability, { day, slots: DEFAULT_SLOTS }] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        priceRange: { min: Number(form.priceRange.min), max: Number(form.priceRange.max) },
      };
      if (modal === 'create') {
        await createService(payload);
      } else {
        await updateService(modal._id, payload);
      }
      setModal(null);
      fetch();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await deleteService(id);
    fetch();
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div>
              <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Provider Dashboard</p>
              <h1 style={{ fontStyle: 'italic' }}>My Service Listings</h1>
            </div>
            {user?.isApproved ? (
              <button className="btn btn-primary" onClick={openCreate}>+ Add listing</button>
            ) : (
              <div className="alert alert-info">Your account is pending admin approval. Listings are not yet visible.</div>
            )}
          </div>

          {/* Sidebar navigation for provider */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-rule)', paddingBottom: 'var(--space-4)' }}>
            <span className="btn btn-primary btn-sm">Listings</span>
            <Link to="/provider/bookings" className="btn btn-ghost btn-sm">Bookings</Link>
          </div>

          {loading ? (
            <Loader />
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <FolderOpen size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <h2 className="empty-state__title">No listings yet</h2>
              <p style={{ marginBottom: 'var(--space-6)' }}>Create your first service listing to start receiving bookings.</p>
              {user?.isApproved && <button className="btn btn-primary" onClick={openCreate}>Create listing</button>}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {services.map((s) => (
                <div key={s._id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                      <h3 style={{ fontStyle: 'italic', fontSize: 'var(--text-lg)' }}>{s.title}</h3>
                      <span className="label">{s.category}</span>
                      {!s.isActive && <span className="badge badge-cancelled">Inactive</span>}
                    </div>
                    <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{s.description.slice(0, 80)}…</p>
                    <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                      <span style={{ fontFamily: 'var(--font-outlier)', color: 'var(--color-accent)' }}>₹{s.priceRange?.min}–{s.priceRange?.max}</span>
                      <span className="muted">★ {s.averageRating?.toFixed(1) || '—'} ({s.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(s._id)} style={{ color: 'var(--color-error)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create / Edit modal */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2 style={{ fontStyle: 'italic', fontSize: 'var(--text-xl)' }}>
                  {modal === 'create' ? 'Add service listing' : `Edit — ${modal.title}`}
                </h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>✕</button>
              </div>

              {msg && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{msg}</div>}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="svc-title">Service title</label>
                  <input id="svc-title" type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="svc-cat">Category</label>
                  <select id="svc-cat" className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="svc-desc">Description</label>
                  <textarea id="svc-desc" className="form-textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="price-min">Min price (₹)</label>
                    <input id="price-min" type="number" className="form-input" value={form.priceRange.min} onChange={(e) => setForm({ ...form, priceRange: { ...form.priceRange, min: e.target.value } })} required min={0} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="price-max">Max price (₹)</label>
                    <input id="price-max" type="number" className="form-input" value={form.priceRange.max} onChange={(e) => setForm({ ...form, priceRange: { ...form.priceRange, max: e.target.value } })} required min={0} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Available days</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                    {DAYS.map((day) => {
                      const active = form.availability.some((a) => a.day === day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {modal !== 'create' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <input
                      type="checkbox"
                      id="active-toggle"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <label htmlFor="active-toggle" className="form-label" style={{ marginBottom: 0 }}>Listing is active</label>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                  {saving ? 'Saving…' : modal === 'create' ? 'Create listing' : 'Save changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
