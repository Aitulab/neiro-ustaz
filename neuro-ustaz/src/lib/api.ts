import axios from 'axios';
import Cookies from 'js-cookie';

// Fallback to production URL if we are in production but VITE_API_URL is missing
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  if (import.meta.env.PROD) {
    // If we are on Vercel but forgot the variable, try to point to the known Render URL
    return 'https://neiro-ustaz-backend.onrender.com/api';
  }
  
  return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();
if (typeof window !== 'undefined') {
  (window as any)._API_DEBUG_URL = API_URL;
}

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
