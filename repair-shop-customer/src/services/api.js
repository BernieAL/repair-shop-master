import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
console.log('🔗 Customer Portal API URL:', API_BASE_URL);

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTHENTICATION
// ==========================================
export const authAPI = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  
  register: (name, email, phone, password) =>
    api.post('/api/auth/register', { name, email, phone, password }),
  
  getCurrentUser: () =>
    api.get('/api/auth/me'),
};

// ==========================================
// CUSTOMER ENDPOINTS (JWT-based)
// ==========================================
export const customerAPI = {
  // Profile
  getMyProfile: () => 
    api.get('/api/customers/profile/me'),
  
  updateMyProfile: (data) => 
    api.put('/api/customers/profile/me', data),
  
  deleteMyAccount: () => 
    api.delete('/api/customers/profile/me'),
  
  // Devices
  getMyDevices: () => 
    api.get('/api/customers/devices'),
  
  createMyDevice: (data) => 
    api.post('/api/customers/devices', data),
  
  getMyDevice: (id) => 
    api.get(`/api/customers/devices/${id}`),
  
  updateMyDevice: (id, data) => 
    api.put(`/api/customers/devices/${id}`, data),
  
  deleteMyDevice: (id) => 
    api.delete(`/api/customers/devices/${id}`),
  
  // Work Orders
  getMyWorkOrders: () => 
    api.get('/api/customers/work-orders'),
  
  createMyWorkOrder: (data) => 
    api.post('/api/customers/work-orders', data),
  
  getMyWorkOrder: (id) => 
    api.get(`/api/customers/work-orders/${id}`),
  
  cancelMyWorkOrder: (id) => 
    api.delete(`/api/customers/work-orders/${id}`),
};

export default api;