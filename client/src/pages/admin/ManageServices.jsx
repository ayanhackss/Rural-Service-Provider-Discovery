import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAdminServices, toggleAdminService, deleteAdminService } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { Search, Power, Trash2, ExternalLink, Filter, Sparkles, MapPin, IndianRupee } from 'lucide-react';

const CATEGORIES = [
  'All', 'Plumber', 'Electrician', 'Carpenter', 'Tutor', 'Doctor',
  'Mechanic', 'Tailor', 'Mason', 'Painter', 'Agricultural', 'Cleaner', 'Other'
];

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';

      const res = await getAdminServices(params);
      setServices(res.data.services || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, statusFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleToggle = async (id, currentStatus) => {
    setProcessingId(id);
    try {
      await toggleAdminService(id, !currentStatus);
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`);
      setServices(services.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s));
    } catch (err) {
      toast.error('Failed to update service status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    setProcessingId(id);
    try {
      await deleteAdminService(id);
      toast.success('Service deleted');
      setServices(services.filter(s => s._id !== id));
      setTotal(t => t - 1);
    } catch (err) {
      toast.error('Failed to delete service');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div>
              <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Catalog Control</p>
              <h1 style={{ fontStyle: 'italic' }}>Manage All Services ({total})</h1>
            </div>
            <Link to="/services" target="_blank" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>View Public Directory</span>
              <ExternalLink size={16} />
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input
                  type="text"
                  placeholder="Search service title or description..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{ paddingLeft: '38px', width: '100%' }}
                />
              </div>

              {/* Category */}
              <div>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  style={{ width: '100%' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                </select>
              </div>

              {/* Status */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  style={{ width: '100%' }}
                >
                  <option value="all">All Statuses (Active & Inactive)</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Listings */}
          {loading ? (
            <Loader />
          ) : services.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-4)' }}>
              <p className="muted" style={{ fontStyle: 'italic', fontSize: 'var(--text-lg)' }}>No services found matching the criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {services.map((s) => (
                <div key={s._id} className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 'var(--space-4)', alignItems: 'center' }}>
                  {/* Photo thumbnail */}
                  <img
                    src={s.photos?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80'}
                    alt={s.title}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />

                  {/* Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-1)' }}>
                      <h3 style={{ fontStyle: 'italic', margin: 0, fontSize: 'var(--text-base)' }}>{s.title}</h3>
                      <span className={`badge ${s.isActive ? 'badge-provider' : 'badge-pending'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="badge" style={{ backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-ink)' }}>
                        {s.category}
                      </span>
                    </div>

                    <p className="muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {s.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', flexWrap: 'wrap' }}>
                      <span><strong>Provider:</strong> {s.providerId?.name || 'Unknown'}</span>
                      {s.providerId?.location && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={12} />
                          {s.providerId.location.village} ({s.providerId.location.pinCode})
                        </span>
                      )}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--color-accent)' }}>
                        <IndianRupee size={12} />
                        ₹{s.priceRange?.min} – ₹{s.priceRange?.max}
                      </span>
                      <span>⭐ {s.averageRating?.toFixed(1) || '0.0'} ({s.totalReviews || 0} reviews)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Link to={`/services/${s._id}`} target="_blank" className="btn btn-ghost btn-sm" title="View Listing Page">
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        className={`btn btn-sm ${s.isActive ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => handleToggle(s._id, s.isActive)}
                        disabled={processingId === s._id}
                        title={s.isActive ? 'Deactivate Service' : 'Activate Service'}
                      >
                        <Power size={14} style={{ marginRight: '4px' }} />
                        {s.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-error)' }}
                        onClick={() => handleDelete(s._id, s.title)}
                        disabled={processingId === s._id}
                        title="Delete Service"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 15 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-8)' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span style={{ alignSelf: 'center', fontSize: 'var(--text-sm)' }}>
                Page {page} of {Math.ceil(total / 15)}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page >= Math.ceil(total / 15)}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
