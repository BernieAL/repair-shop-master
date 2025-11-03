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

  // ==========================================
  // USER MANAGEMENT (NEW)
  // ==========================================
  
  // Get all users with optional role filter
  getAllUsers: (role = null) => {
    const params = role ? { role } : {};
    return api.get('/api/admin/users/', { params });
  },

  // Get single user by ID
  getUserById: (id) => 
    api.get(`/api/admin/users/${id}`),

  // Create new user (admin can set role)
  createUser: (userData) => 
    api.post('/api/admin/users/', userData),

  // Update user (admin can change role)
  updateUser: (id, userData) => 
    api.put(`/api/admin/users/${id}`, userData),

  // Delete user
  deleteUser: (id) => 
    api.delete(`/api/admin/users/${id}`),

  // ==========================================
  // TECHNICIAN MANAGEMENT (NEW)
  // ==========================================
  
  // Get all technicians
  getTechnicians: () => 
    api.get('/api/admin/users/technicians/list'),

  // Create new technician directly
  createTechnician: (userData) => 
    api.post('/api/admin/users/technicians/create', userData),

  // Promote existing user to technician
  promoteToTechnician: (userId) => 
    api.post(`/api/admin/users/technicians/promote/${userId}`),

  // Remove technician (deletes account)
  removeTechnician: (techId) => 
    api.delete(`/api/admin/users/technicians/${techId}`),

  // ==========================================
  // WORK ORDER ACTIONS (NEW - if not already present)
  // ==========================================
  
  // Add technician note to work order
  addTechNote: (orderId, note) => 
    api.post(`/api/admin/work-orders/${orderId}/notes`, { note }),

  // Assign technician to work order
  assignTechnician: (orderId, technicianId) => 
    api.put(`/api/admin/work-orders/${orderId}/assign`, { technician_id: technicianId }),
};

export default api;