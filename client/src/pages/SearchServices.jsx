import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices, getCategories } from '../api/services';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';
import Loader from '../components/Loader';
import { Search } from 'lucide-react';

export default function SearchServices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minRating: searchParams.get('minRating') || '',
    location: searchParams.get('location') || '',
    sort: searchParams.get('sort') || 'rating',
  });

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.categories)).catch(() => {});
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await getServices(params);
      setServices(data.services);
      setTotal(data.total);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const applyFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const params = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setSearchParams(params);
  };

  const clearFilters = () => {
    const reset = { q: '', category: '', minRating: '', location: '', sort: 'rating' };
    setFilters(reset);
    setSearchParams({});
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container">
          <div className="page-header">
            <p className="page-header__eyebrow">All Services</p>
            <h1 style={{ fontStyle: 'italic' }}>Find a service provider</h1>
          </div>

          {/* Search + filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-3)', alignItems: 'end', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="search"
                className="form-input"
                placeholder="Search services… (e.g. plumber, tutor)"
                value={filters.q}
                onChange={(e) => applyFilter('q', e.target.value)}
                id="service-search"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', alignItems: 'center' }}>
            <select className="form-select" value={filters.category} onChange={(e) => applyFilter('category', e.target.value)} style={{ width: 'auto' }} aria-label="Filter by category">
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select className="form-select" value={filters.minRating} onChange={(e) => applyFilter('minRating', e.target.value)} style={{ width: 'auto' }} aria-label="Minimum rating">
              <option value="">Any rating</option>
              <option value="4">4+ ★</option>
              <option value="3">3+ ★</option>
            </select>

            <input
              type="text"
              className="form-input"
              placeholder="Village or PIN code"
              value={filters.location}
              onChange={(e) => applyFilter('location', e.target.value)}
              style={{ width: '180px' }}
              aria-label="Location filter"
            />

            <select className="form-select" value={filters.sort} onChange={(e) => applyFilter('sort', e.target.value)} style={{ width: 'auto' }} aria-label="Sort by">
              <option value="rating">Top rated</option>
              <option value="price">Lowest price</option>
              <option value="newest">Newest</option>
            </select>

            {Object.values(filters).some(Boolean) && filters.sort !== 'rating' || filters.q || filters.category || filters.minRating || filters.location ? (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm">Clear filters</button>
            ) : null}
          </div>

          {/* Results count */}
          {!loading && (
            <p className="label" style={{ marginBottom: 'var(--space-6)', color: 'var(--color-muted)' }}>
              {total} service{total !== 1 ? 's' : ''} found
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <Loader />
          ) : services.length === 0 ? (
            <div style={{ padding: 'var(--space-12) 0', textAlign: 'center', color: 'var(--color-muted)' }}>
              <Search size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
              <h2 className="empty-state__title">No services found</h2>
              <p>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid-3" style={{ marginBottom: 'var(--space-3xl)' }}>
              {services.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
