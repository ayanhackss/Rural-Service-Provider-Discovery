import api from './axiosInstance';

export const getMyProfile = () => api.get('/me/profile');
export const updateMyProfile = (data) => api.patch('/me/profile', data);

// Resident
export const getMyFavourites = () => api.get('/me/favourites');
export const toggleFavourite = (serviceId) => api.post(`/me/favourites/${serviceId}`);
export const getMyReviews = () => api.get('/me/reviews');

// Provider
export const getMyEarnings = () => api.get('/me/earnings');
export const getProviderReviews = () => api.get('/me/provider-reviews');
export const updateAvailability = (serviceId, availability) => api.patch(`/me/availability/${serviceId}`, { availability });
