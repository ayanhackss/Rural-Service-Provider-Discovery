import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun } from 'lucide-react';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const dashboardPath = user?.role === 'provider'
    ? '/provider/listings'
    : user?.role === 'admin'
    ? '/admin'
    : '/resident/bookings';

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand">
            Graam<span>Seva</span>
          </Link>

          {/* Desktop nav */}
          <div className="navbar__links">
            <NavLink to="/services" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
              Find Services
            </NavLink>
            {user && (
              <NavLink to={dashboardPath} className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
                Dashboard
              </NavLink>
            )}
          </div>

          <div className="navbar__actions">
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => setIsDark(!isDark)}
              style={{ padding: 'var(--space-2)' }}
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Avatar name={user.name} size={32} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="label" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                      {user.name.split(' ')[0]}
                    </span>
                    <span className={`badge badge-${user.role}`} style={{ fontSize: '0.6rem', padding: '0px 4px' }}>{user.role}</span>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join free</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="navbar__menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`navbar__mobile-menu${menuOpen ? ' open' : ''}`}>
          <NavLink to="/services" className="navbar__link" onClick={() => setMenuOpen(false)}>
            Find Services
          </NavLink>
          {user && (
            <NavLink to={dashboardPath} className="navbar__link" onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {user ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ alignSelf: 'flex-start' }}>
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)} style={{ alignSelf: 'flex-start' }}>
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)} style={{ alignSelf: 'flex-start' }}>
                Join free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Secondary Sub-Navbar for Dashboards */}
      {user && location.pathname.startsWith(`/${user.role === 'resident' ? 'resident' : user.role}`) && (
        <div style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-rule)' }}>
          <div className="container" style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto', padding: 'var(--space-3) 0', whiteSpace: 'nowrap' }}>
            {user.role === 'admin' && (
              <>
                <NavLink to="/admin" end className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Overview</NavLink>
                <NavLink to="/admin/analytics" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Analytics</NavLink>
                <NavLink to="/admin/providers" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Providers</NavLink>
                <NavLink to="/admin/residents" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Residents</NavLink>
                <NavLink to="/admin/bookings" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Bookings</NavLink>
                <NavLink to="/admin/reviews" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Reviews</NavLink>
                <NavLink to="/admin/announcements" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Announcements</NavLink>
              </>
            )}
            {user.role === 'provider' && (
              <>
                <NavLink to="/provider/listings" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Services</NavLink>
                <NavLink to="/provider/bookings" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Bookings</NavLink>
                <NavLink to="/provider/availability" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Availability</NavLink>
                <NavLink to="/provider/earnings" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Earnings</NavLink>
                <NavLink to="/provider/reviews" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Reviews</NavLink>
                <NavLink to="/provider/profile" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Profile</NavLink>
              </>
            )}
            {user.role === 'resident' && (
              <>
                <NavLink to="/resident/bookings" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>My Bookings</NavLink>
                <NavLink to="/resident/favourites" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Favourites</NavLink>
                <NavLink to="/resident/reviews" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>My Reviews</NavLink>
                <NavLink to="/resident/profile" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>Profile</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
