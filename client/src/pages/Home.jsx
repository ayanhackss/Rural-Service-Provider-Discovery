import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';
import { getPublicStats, getServices } from '../api/services';
import { Wrench, Zap, BookOpen, Stethoscope, Hammer, Settings, Wheat, Paintbrush, Search, MapPin, Users, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';

const STEPS = [
  { n: '01', title: 'Search & Discover', body: 'Browse providers by service type, location, or rating. Every listing is from a verified local provider in your district.' },
  { n: '02', title: 'Book a Slot', body: 'Pick a date from the provider\'s calendar and choose an available time slot. No calls, no waiting.' },
  { n: '03', title: 'Get the Service', body: 'The provider confirms and shows up. All booking details are in your dashboard.' },
  { n: '04', title: 'Review & Trust', body: 'After the service, leave a rating. Your review helps your neighbours make better decisions.' },
];

const CATEGORIES = [
  { icon: Wrench, name: 'Plumber' }, { icon: Zap, name: 'Electrician' },
  { icon: BookOpen, name: 'Tutor' }, { icon: Stethoscope, name: 'Doctor' },
  { icon: Hammer, name: 'Carpenter' }, { icon: Settings, name: 'Mechanic' },
  { icon: Wheat, name: 'Agricultural' }, { icon: Paintbrush, name: 'Painter' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ totalProviders: 0, totalBookings: 0, activeVillages: 0 });
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    // Fetch stats
    getPublicStats().then(({ data }) => setStats(data)).catch(() => {});
    // Fetch top rated
    getServices({ sort: 'rating', limit: 4 }).then(({ data }) => setTopRated(data.services)).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO ── */}
        <section className="section" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-12)' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <p className="label fade-in-up" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)', animationDelay: '0.1s' }}>
                Rural Service Discovery
              </p>
              <h1 className="display fade-in-up" style={{ marginBottom: 'var(--space-6)', lineHeight: 1.1, animationDelay: '0.2s' }}>
                Trusted services,<br />found in your village.
              </h1>
              <p className="fade-in-up" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-ink-dim)', maxWidth: '55ch', lineHeight: 1.6, marginBottom: 'var(--space-8)', animationDelay: '0.3s' }}>
                GraamSeva connects rural residents with verified local providers — plumbers, electricians, tutors, and more — with real bookings and real reviews.
              </p>
              
              <div className="fade-in-up" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', animationDelay: '0.4s' }}>
                <Link to="/services" className="btn btn-primary">
                  Find a service
                </Link>
                {!user && (
                  <Link to="/register" className="btn btn-outline">
                    Register as Provider
                  </Link>
                )}
                {user?.role === 'provider' && (
                  <Link to="/provider/listings" className="btn btn-outline">
                    My Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── COMMUNITY IMPACT STATS ── */}
        <section style={{ background: 'var(--color-paper-2)', borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', padding: 'var(--space-8) 0', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-rule)' }}>
                  <Users size={24} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-2xl)', color: 'var(--color-ink)', lineHeight: 1 }}>{stats.totalProviders || '120'}+</div>
                  <div className="label" style={{ color: 'var(--color-muted)', marginTop: 'var(--space-1)' }}>Verified Providers</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-rule)' }}>
                  <CheckCircle size={24} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-2xl)', color: 'var(--color-ink)', lineHeight: 1 }}>{stats.totalBookings || '500'}+</div>
                  <div className="label" style={{ color: 'var(--color-muted)', marginTop: 'var(--space-1)' }}>Services Completed</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-rule)' }}>
                  <TrendingUp size={24} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-2xl)', color: 'var(--color-ink)', lineHeight: 1 }}>{stats.activeVillages || '15'}+</div>
                  <div className="label" style={{ color: 'var(--color-muted)', marginTop: 'var(--space-1)' }}>Active Villages</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section">
          <div className="container">
            <p className="label" style={{ marginBottom: 'var(--space-8)', color: 'var(--color-muted)' }}>How it works</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-8)' }}>
              {STEPS.map((step) => (
                <div key={step.n} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} className="hover-lift">
                  <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-3xl)', color: 'var(--color-rule)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {step.n}
                  </span>
                  <h3 style={{ fontStyle: 'italic', fontSize: 'var(--text-lg)' }}>{step.title}</h3>
                  <p style={{ color: 'var(--color-ink-dim)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="rule" />

        {/* ── FEATURED SEASONAL BANNER ── */}
        <section className="section" style={{ paddingBottom: 'var(--space-4)' }}>
          <div className="container">
            <Link to="/services?category=Agricultural" className="seasonal-banner hover-lift">
              <div>
                <span className="badge badge-pending" style={{ marginBottom: 'var(--space-3)', display: 'inline-block' }}>Seasonal Highlight</span>
                <h2 style={{ fontStyle: 'italic', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Prepare for the Harvest</h2>
                <p style={{ color: 'var(--color-ink-dim)' }}>Find verified tractor mechanics, harvesters, and agricultural laborers near you.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-accent)', fontWeight: 500 }}>
                Explore <ArrowRight size={18} />
              </div>
            </Link>
          </div>
        </section>

        {/* ── TOP RATED PROVIDERS ── */}
        {topRated.length > 0 && (
          <section className="section">
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                <h2 style={{ fontStyle: 'italic' }}>Top Rated Providers</h2>
                <Link to="/services" className="btn btn-ghost btn-sm">View all →</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
                {topRated.map(service => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            </div>
          </section>
        )}

        <hr className="rule" />

        {/* ── CATEGORIES ── */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
              <h2 style={{ fontStyle: 'italic' }}>Browse by category</h2>
              <Link to="/services" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/services?category=${cat.name}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-5)',
                    background: 'var(--color-paper-2)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-rule)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>
                    <cat.icon size={32} strokeWidth={1.5} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <hr className="rule" />

        {/* ── CTA STRIP ── */}
        {!user && (
          <section className="section">
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
                <div>
                  <h2 style={{ fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>Are you a service provider?</h2>
                  <p style={{ color: 'var(--color-ink-dim)', fontSize: 'var(--text-md)' }}>
                    List your services and reach more residents in your area.
                  </p>
                </div>
                <Link to="/register" className="btn btn-primary" style={{ flexShrink: 0 }}>
                  Register as Provider
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="container">
            <div className="footer__inner">
              <div className="footer__top">
                <div>
                  <div className="footer__brand">GraamSeva</div>
                  <p className="footer__tagline">Connecting rural communities with trusted local services.</p>
                </div>
                <div className="footer__links">
                  <Link to="/services">Find Services</Link>
                  <Link to="/register">Become a Provider</Link>
                  <Link to="/login">Sign in</Link>
                </div>
              </div>
              <div className="footer__bottom">
                <span className="footer__copy">© {new Date().getFullYear()} GraamSeva. Built with MERN stack.</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
