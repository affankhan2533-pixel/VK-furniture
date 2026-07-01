import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to append authorization token if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vk_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/api/admin/login', { username, password });
    return response.data;
  },
};

export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/api/products');
    return response.data;
  },
  getOne: async (pid) => {
    const response = await api.get(`/api/products/${pid}`);
    return response.data;
  },
  create: async (productData) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },
  update: async (pid, productData) => {
    const response = await api.put(`/api/products/${pid}`, productData);
    return response.data;
  },
  delete: async (pid) => {
    const response = await api.delete(`/api/products/${pid}`);
    return response.data;
  },
};

export const galleryAPI = {
  getAll: async () => {
    const response = await api.get('/api/gallery');
    return response.data;
  },
  create: async (itemData) => {
    const response = await api.post('/api/gallery', itemData);
    return response.data;
  },
  delete: async (gid) => {
    const response = await api.delete(`/api/gallery/${gid}`);
    return response.data;
  },
};

export const enquiriesAPI = {
  getAll: async () => {
    const response = await api.get('/api/admin/enquiries');
    return response.data;
  },
  updateStatus: async (eid, status) => {
    const response = await api.put(`/api/admin/enquiries/${eid}`, { status });
    return response.data;
  },
  delete: async (eid) => {
    const response = await api.delete(`/api/admin/enquiries/${eid}`);
    return response.data;
  },
};

export const analyticsAPI = {
  getStats: async () => {
    const response = await api.get('/api/analytics/stats');
    return response.data;
  },
};

export default api;
