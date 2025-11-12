import axios from 'axios';
import { SERVER_URL } from './server';

// SERVER_URL이 이미 /api를 포함하는지 확인하고, 없으면 추가
const getBaseURL = () => {
  const baseUrl = SERVER_URL || 'http://localhost:8000';
  // /api로 끝나지 않으면 /api 추가
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { user_id: string; user_pw: string }) => api.post('/auth/login', credentials),
  register: (userData: unknown) => api.post('/auth/register', userData),
  passwordReset: (data: unknown) => api.post('/auth/password-reset', data),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data: unknown) => api.put('/users/me', data),
  updateSettings: (settings: unknown) => api.put('/users/me/settings', settings),
};

// // Alarm API
// export const alarmAPI = {
//   getAlarms: () => api.get('/alarms/'),
//   getUnreadCount: () => api.get('/alarms/unread-count'),
//   markAsRead: (alarmId: string) => api.post(`/alarms/${alarmId}/read`),
//   markAllAsRead: () => api.post('/alarms/read-all'),
// };

// // Analysis API
// export const analysisAPI = {
//   getAnalyses: (limit?: number) => api.get('/analysis/', { params: { limit } }),
//   getAnalysis: (id: string) => api.get(`/analysis/${id}`),
//   createAnalysis: (data: unknown) => api.post('/analysis/', data),
//   getTypes: () => api.get('/analysis/types/'),
// };

// // Subscribe API
// export const subscribeAPI = {
//   getTypes: () => api.get('/subscribe/types'),
//   getCurrent: () => api.get('/subscribe/current'),
//   create: (data: unknown) => api.post('/subscribe/', data),
//   cancel: () => api.post('/subscribe/cancel'),
// };

// // Contact API
// export const contactAPI = {
//   send: (data: unknown) => api.post('/contact/', data),
// };

export default api;

