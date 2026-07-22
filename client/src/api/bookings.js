import api from './axiosInstance';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = (params) => api.get('/bookings/mine', { params });
export const getProviderBookings = (params) => api.get('/bookings/provider', { params });
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status });
export const getServiceSlots = (serviceId) => api.get(`/bookings/service/${serviceId}`);
export const getNotifications = () => api.get('/bookings/notifications');
