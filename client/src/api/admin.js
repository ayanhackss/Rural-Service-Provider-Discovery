import api from './axiosInstance';

export const getStats = () => api.get('/admin/stats');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const approveUser = (id, isApproved) => api.patch(`/admin/users/${id}/approve`, { isApproved });
export const suspendUser = (id, isSuspended) => api.patch(`/admin/users/${id}/suspend`, { isSuspended });
export const resetUserPassword = (id, newPassword) => api.patch(`/admin/users/${id}/reset-password`, { newPassword });
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getAdminServices = (params) => api.get('/admin/services', { params });
export const toggleAdminService = (id, isActive) => api.patch(`/admin/services/${id}/toggle`, { isActive });
export const deleteAdminService = (id) => api.delete(`/admin/services/${id}`);

export const getAdminBookings = (params) => api.get('/admin/bookings', { params });
export const cancelAdminBooking = (id) => api.patch(`/admin/bookings/${id}/cancel`);

export const getAdminReviews = (params) => api.get('/admin/reviews', { params });
export const deleteAdminReview = (id) => api.delete(`/admin/reviews/${id}`);

export const getAdminAnalytics = () => api.get('/admin/analytics');

export const getSystemHealth = () => api.get('/admin/system/health');
export const getExportData = (type) => api.get(`/admin/export/${type}`);

export const getAdminAnnouncements = () => api.get('/admin/announcements');
export const createAdminAnnouncement = (data) => api.post('/admin/announcements', data);
export const deleteAdminAnnouncement = (id) => api.delete(`/admin/announcements/${id}`);

