import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyFavourites, toggleFavourite } from '../../api/me';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Heart, MapPin, Star } from 'lucide-react';

export default function Favourites() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      const res = await getMyFavourites();
      setServices(res.data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleToggle = async (id, e) => {
    e.preventDefault();
    try {
      await toggleFavourite(id);
      // Remove from list instantly
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <><Navbar /><Loader fullPage /></>;

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <Heart size={28} color="var(--color-accent)" fill="var(--color-accent)" />
            <h1 style={{ fontStyle: 'italic' }}>Saved Services</h1>
          </div>

          {services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <Heart size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <h2 className="empty-state__title">No saved services</h2>
              <p style={{ fontStyle: 'italic', marginBottom: 'var(--space-6)' }}>Find services you love and save them for later.</p>
              <Link to="/search" className="btn btn-primary">Browse Services</Link>
            </div>
          ) : (
            <div className="service-grid">
              {services.map((service) => (
                <Link to={`/service/${service._id}`} key={service._id} className="service-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="service-card__image-wrapper">
                    <img 
                      src={service.images?.[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400'} 
                      alt={service.title} 
                      className="service-card__image" 
                    />
                    <button className="service-card__save-btn" onClick={(e) => handleToggle(service._id, e)}>
                      <Heart size={20} color="var(--color-accent)" fill="var(--color-accent)" />
                    </button>
                    <div className="service-card__price-badge">
                      ₹{service.priceRange.min} {service.priceRange.max > service.priceRange.min && `- ₹${service.priceRange.max}`}
                    </div>
                  </div>
                  <div className="service-card__content">
                    <div className="service-card__category">{service.category}</div>
                    <h3 className="service-card__title">{service.title}</h3>
                    
                    <div className="service-card__meta">
                      <div className="service-card__meta-item">
                        <MapPin size={14} /> {service.providerId?.location?.village || 'Various'}
                      </div>
                      <div className="service-card__meta-item">
                        <Star size={14} className="star-icon" fill="currentColor" /> 
                        {service.providerId?.averageRating > 0 ? service.providerId.averageRating.toFixed(1) : 'New'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
