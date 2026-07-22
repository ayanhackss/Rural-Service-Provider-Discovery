import api from './axiosInstance';

export const getStats = () => api.get('/admin/stats');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const approveUser = (id, isApproved) => api.patch(`/admin/users/${id}/approve`, { isApproved });
export const suspendUser = (id, isSuspended) => api.patch(`/admin/users/${id}/suspend`, { isSuspended });
export const getAdminBookings = (params) => api.get('/admin/bookings', { params });
