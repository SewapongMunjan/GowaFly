// src/services/api.js
import axios from 'axios';

// Base API configuration 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Flight service
export const flightService = {
  getAllFlights: () => api.get('/flights'),
  searchFlights: (params) => api.get('/flights/search', { params }),
  getFlightById: (id) => api.get(`/flights/${id}`),
};

// Booking service
export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/user'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

// Payment service
export const paymentService = {
  processPayment: (paymentData) => api.post('/payments', paymentData),
  getPaymentByBookingId: (bookingId) => api.get(`/payments/booking/${bookingId}`),
};

// User service
export const userService = {
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Admin service
export const adminService = {
  // Users management
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Flights management
  createFlight: (flightData) => api.post('/admin/flights', flightData),
  updateFlight: (id, flightData) => api.put(`/admin/flights/${id}`, flightData),
  deleteFlight: (id) => api.delete(`/admin/flights/${id}`),
  
  // Bookings management
  getAllBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
  
  // Dashboard statistics
  getDashboardStats: () => api.get('/admin/dashboard'),
};

export default api;