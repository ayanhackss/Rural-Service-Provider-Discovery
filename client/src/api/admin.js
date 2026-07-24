import api from './axiosInstance';

export const getStats = () => api.get('/admin/stats');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const approveUser = (id, isApproved) => api.patch(`/admin/users/${id}/approve`, { isApproved });
export const suspendUser = (id, isSuspended) => api.patch(`/admin/users/${id}/suspend`, { isSuspended });
export const getAdminBookings = (params) => api.get('/admin/bookings', { params });
export const cancelAdminBooking = (id) => api.patch(`/admin/bookings/${id}/cancel`);

export const getAdminReviews = (params) => api.get('/admin/reviews', { params });
export const deleteAdminReview = (id) => api.delete(`/admin/reviews/${id}`);

export const getAdminAnalytics = () => api.get('/admin/analytics');

export const getAdminAnnouncements = () => api.get('/admin/announcements');
export const createAdminAnnouncement = (data) => api.post('/admin/announcements', data);
export const deleteAdminAnnouncement = (id) => api.delete(`/admin/announcements/${id}`);
