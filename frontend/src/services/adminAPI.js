import axios from 'axios';

const adminAPI = axios.create({
  baseURL: 'http://localhost:3000/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
adminAPI.interceptors.request.use(
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

// Response interceptor
adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Admin API methods
export const adminAPIService = {
  // Dashboard overview
  getOverview: () => adminAPI.get('/overview'),

  // User management
  getAllUsers: (params) => adminAPI.get('/users', { params }),
  updateUserRole: (userId, role) => adminAPI.put(`/users/${userId}/role`, { role }),

  // Customer management
  getAllCustomers: (params) => adminAPI.get('/customers', { params }),
  getCustomerById: (customerId) => adminAPI.get(`/customers/${customerId}`),
};

export default adminAPI;

