import axios from 'axios';

const API_BASE_URL = 'http://3.239.255.82:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs (will need to implement these in backend)
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

// Customer-specific APIs
export const customerAPI = {
  getMyProfile: () => api.get('/customers/me'),
  updateMyProfile: (data) => api.put('/customers/me', data),
  getMyDevices: () => api.get('/devices/my-devices'),
  getMyWorkOrders: () => api.get('/work-orders/my-orders'),
  createWorkOrder: (data) => api.post('/work-orders', data),
};

export default api;