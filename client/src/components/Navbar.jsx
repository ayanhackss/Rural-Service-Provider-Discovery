import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
            {user ? (
              <>
                <span className="label" style={{ color: 'var(--color-muted)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Sign out
                </button>
              </>
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
    </nav>
  );
}
