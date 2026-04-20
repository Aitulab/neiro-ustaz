import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const currentLang = localStorage.getItem('neiroustaz_lang') || 'kk';
    config.headers['X-Lang'] = currentLang === 'kk' ? 'kz' : currentLang;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clean up local session on unauthorized
      Cookies.remove('token');
      localStorage.removeItem('neiroustaz_user');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
