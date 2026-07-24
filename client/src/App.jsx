import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchServices from './pages/SearchServices';
import ServiceDetail from './pages/ServiceDetail';

// Resident pages
import MyBookings from './pages/resident/MyBookings';
import ResidentProfile from './pages/resident/Profile';
import Favourites from './pages/resident/Favourites';
import MyReviews from './pages/resident/MyReviews';

// Provider pages
import ManageListings from './pages/provider/ManageListings';
import ProviderBookings from './pages/provider/ManageBookings';
import ProviderProfile from './pages/provider/Profile';
import Earnings from './pages/provider/Earnings';
import ReviewsReceived from './pages/provider/ReviewsReceived';
import Availability from './pages/provider/Availability';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProviders from './pages/admin/ManageProviders';
import AdminBookings from './pages/admin/ManageBookings';
import ManageResidents from './pages/admin/ManageResidents';
import ManageReviews from './pages/admin/ManageReviews';
import Analytics from './pages/admin/Analytics';
import Announcements from './pages/admin/Announcements';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<SearchServices />} />
          <Route path="/services/:id" element={<ServiceDetail />} />

          {/* Resident */}
          <Route path="/resident/bookings" element={<ProtectedRoute roles={['resident']}><MyBookings /></ProtectedRoute>} />
          <Route path="/resident/profile" element={<ProtectedRoute roles={['resident']}><ResidentProfile /></ProtectedRoute>} />
          <Route path="/resident/favourites" element={<ProtectedRoute roles={['resident']}><Favourites /></ProtectedRoute>} />
          <Route path="/resident/reviews" element={<ProtectedRoute roles={['resident']}><MyReviews /></ProtectedRoute>} />

          {/* Provider */}
          <Route path="/provider/listings" element={<ProtectedRoute roles={['provider']}><ManageListings /></ProtectedRoute>} />
          <Route path="/provider/bookings" element={<ProtectedRoute roles={['provider']}><ProviderBookings /></ProtectedRoute>} />
          <Route path="/provider/profile" element={<ProtectedRoute roles={['provider']}><ProviderProfile /></ProtectedRoute>} />
          <Route path="/provider/earnings" element={<ProtectedRoute roles={['provider']}><Earnings /></ProtectedRoute>} />
          <Route path="/provider/reviews" element={<ProtectedRoute roles={['provider']}><ReviewsReceived /></ProtectedRoute>} />
          <Route path="/provider/availability" element={<ProtectedRoute roles={['provider']}><Availability /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/providers" element={<ProtectedRoute roles={['admin']}><ManageProviders /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/residents" element={<ProtectedRoute roles={['admin']}><ManageResidents /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute roles={['admin']}><ManageReviews /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><Analytics /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute roles={['admin']}><Announcements /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
