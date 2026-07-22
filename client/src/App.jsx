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

// Provider pages
import ManageListings from './pages/provider/ManageListings';
import ManageBookings from './pages/provider/ManageBookings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProviders from './pages/admin/ManageProviders';

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
          <Route path="/resident/bookings" element={
            <ProtectedRoute roles={['resident']}>
              <MyBookings />
            </ProtectedRoute>
          } />

          {/* Provider */}
          <Route path="/provider/listings" element={
            <ProtectedRoute roles={['provider']}>
              <ManageListings />
            </ProtectedRoute>
          } />
          <Route path="/provider/bookings" element={
            <ProtectedRoute roles={['provider']}>
              <ManageBookings />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/providers" element={
            <ProtectedRoute roles={['admin']}>
              <ManageProviders />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
