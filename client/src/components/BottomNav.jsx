import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, LayoutDashboard, User } from 'lucide-react';

export default function BottomNav() {
  const { user } = useAuth();

  const dashboardPath = user?.role === 'provider'
    ? '/provider/listings'
    : user?.role === 'admin'
    ? '/admin'
    : '/resident/bookings';

  const profilePath = user?.role === 'provider' 
    ? '/provider/profile' 
    : user?.role === 'resident' 
    ? '/resident/profile' 
    : '/admin';

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      
      <NavLink to="/services" className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}>
        <Search size={24} />
        <span>Search</span>
      </NavLink>
      
      {user && (
        <>
          <NavLink to={dashboardPath} className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={24} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to={profilePath} className={({ isActive }) => `bottom-nav__item ${isActive ? 'active' : ''}`}>
            <User size={24} />
            <span>Profile</span>
          </NavLink>
        </>
      )}
    </nav>
  );
}
