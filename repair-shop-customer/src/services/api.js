import axios from 'axios';

// Use environment variable, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
console.log('🔗 API URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authAPI = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),  // ✅ Added leading /
  
  register: (name, email, phone, password) =>
    api.post('/api/auth/register', { name, email, phone, password }),  // ✅ Added leading /
  
  getCurrentUser: () =>
    api.get('/api/auth/me'),  // ✅ Added leading /
};

// Customer endpoints
export const customerAPI = {
  getProfile: (id) => api.get(`/api/customers/${id}`),  // ✅ Added leading /
  updateProfile: (id, data) => api.put(`/api/customers/${id}`, data),  // ✅ Added leading /
};

// Device endpoints
export const deviceAPI = {
  getMyDevices: () => api.get('/api/devices'),  // ✅ Added leading /
  getDevice: (id) => api.get(`/api/devices/${id}`),  // ✅ Added leading /
  createDevice: (data) => api.post('/api/devices', data),  // ✅ Added leading /
};

// Work order endpoints
export const workOrderAPI = {
  getMyWorkOrders: () => api.get('/api/work-orders'),  // ✅ Added leading /
  getWorkOrder: (id) => api.get(`/api/work-orders/${id}`),  // ✅ Added leading /
  createWorkOrder: (data) => api.post('/api/work-orders', data),  // ✅ Added leading /
};

export default api;