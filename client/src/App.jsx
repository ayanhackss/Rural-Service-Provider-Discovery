import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

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

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/services" element={<PageTransition><SearchServices /></PageTransition>} />
        <Route path="/services/:id" element={<PageTransition><ServiceDetail /></PageTransition>} />

        {/* Resident */}
        <Route path="/resident/bookings" element={<ProtectedRoute roles={['resident']}><PageTransition><MyBookings /></PageTransition></ProtectedRoute>} />
        <Route path="/resident/profile" element={<ProtectedRoute roles={['resident']}><PageTransition><ResidentProfile /></PageTransition></ProtectedRoute>} />
        <Route path="/resident/favourites" element={<ProtectedRoute roles={['resident']}><PageTransition><Favourites /></PageTransition></ProtectedRoute>} />
        <Route path="/resident/reviews" element={<ProtectedRoute roles={['resident']}><PageTransition><MyReviews /></PageTransition></ProtectedRoute>} />

        {/* Provider */}
        <Route path="/provider/listings" element={<ProtectedRoute roles={['provider']}><PageTransition><ManageListings /></PageTransition></ProtectedRoute>} />
        <Route path="/provider/bookings" element={<ProtectedRoute roles={['provider']}><PageTransition><ProviderBookings /></PageTransition></ProtectedRoute>} />
        <Route path="/provider/profile" element={<ProtectedRoute roles={['provider']}><PageTransition><ProviderProfile /></PageTransition></ProtectedRoute>} />
        <Route path="/provider/earnings" element={<ProtectedRoute roles={['provider']}><PageTransition><Earnings /></PageTransition></ProtectedRoute>} />
        <Route path="/provider/reviews" element={<ProtectedRoute roles={['provider']}><PageTransition><ReviewsReceived /></PageTransition></ProtectedRoute>} />
        <Route path="/provider/availability" element={<ProtectedRoute roles={['provider']}><PageTransition><Availability /></PageTransition></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/providers" element={<ProtectedRoute roles={['admin']}><PageTransition><ManageProviders /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><PageTransition><AdminBookings /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/residents" element={<ProtectedRoute roles={['admin']}><PageTransition><ManageResidents /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute roles={['admin']}><PageTransition><ManageReviews /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><PageTransition><Analytics /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute roles={['admin']}><PageTransition><Announcements /></PageTransition></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
        <Footer />
        <BottomNav />
        <Toaster position="bottom-right" toastOptions={{ className: 'card', style: { borderRadius: 'var(--radius-sm)', background: 'var(--color-paper-2)', color: 'var(--color-ink)', border: '1px solid var(--color-rule)' } }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
