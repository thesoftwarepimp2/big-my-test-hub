
import axios from 'axios';

const WORDPRESS_API_URL = import.meta.env.VITE_WORDPRESS_API_URL || 'https://school.nhaka.online/connect/wp-json';
const BGL_API_URL = import.meta.env.VITE_BGL_API_URL || 'https://school.nhaka.online/connect/wp-json/bgl/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: WORDPRESS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create BGL API instance
const bglApi = axios.create({
  baseURL: BGL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bgl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

bglApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('bgl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bgl_token');
      localStorage.removeItem('bgl_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

bglApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bgl_token');
      localStorage.removeItem('bgl_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export { api, bglApi };
export default api;
