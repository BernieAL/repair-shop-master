import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
console.log('🔗 Admin Portal API URL:', API_BASE_URL);

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
  
  getCurrentUser: () =>
    api.get('/api/auth/me'),
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================
export const adminAPI = {
  // Customer Management
  getAllCustomers: (role) => 
    api.get('/api/admin/customers', { params: { role } }),
  
  getCustomer: (id) => 
    api.get(`/api/admin/customers/${id}`),
  
  createCustomer: (data) => 
    api.post('/api/admin/customers', data),
  
  updateCustomer: (id, data) => 
    api.put(`/api/admin/customers/${id}`, data),
  
  deleteCustomer: (id) => 
    api.delete(`/api/admin/customers/${id}`),
  
  // Device Management
  getAllDevices: (customerId) => 
    api.get('/api/admin/devices', { params: { customer_id: customerId } }),
  
  getDevice: (id) => 
    api.get(`/api/admin/devices/${id}`),
  
  createDevice: (data) => 
    api.post('/api/admin/devices', data),
  
  updateDevice: (id, data) => 
    api.put(`/api/admin/devices/${id}`, data),
  
  deleteDevice: (id) => 
    api.delete(`/api/admin/devices/${id}`),
  
  // Work Order Management
  getAllWorkOrders: (filters) => 
    api.get('/api/admin/work-orders', { params: filters }), // { customer_id, status }
  
  getWorkOrder: (id) => 
    api.get(`/api/admin/work-orders/${id}`),
  
  createWorkOrder: (data) => 
    api.post('/api/admin/work-orders', data),
  
  updateWorkOrder: (id, data) => 
    api.put(`/api/admin/work-orders/${id}`, data),
  
  updateWorkOrderStatus: (id, status, technician_notes) => 
    api.patch(`/api/admin/work-orders/${id}/status`, null, {
      params: { status, technician_notes }
    }),
  
  deleteWorkOrder: (id) => 
    api.delete(`/api/admin/work-orders/${id}`),
};

export default api;