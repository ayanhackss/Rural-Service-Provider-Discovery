import api from './axiosInstance';

export const postReview = (data) => api.post('/reviews', data);
export const getServiceReviews = (serviceId) => api.get(`/reviews/service/${serviceId}`);
export const canReview = (bookingId) => api.get(`/reviews/can-review/${bookingId}`);
