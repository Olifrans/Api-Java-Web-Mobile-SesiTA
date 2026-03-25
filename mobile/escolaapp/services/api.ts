import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure base URL - change this to your computer's IP address
// Use your computer's local IP (e.g., 192.168.x.x) for physical device testing
const API_BASE_URL = 'http://192.168.1.100:8080'; // CHANGE THIS TO YOUR IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      AsyncStorage.removeItem('@auth_token');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (userData: any) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// Alunos endpoints
export const alunos = {
  list: () => api.get('/alunos'),
  getById: (id: number) => api.get(`/alunos/${id}`),
  create: (data: any) => api.post('/alunos', data),
  update: (id: number, data: any) => api.put(`/alunos/${id}`, data),
  delete: (id: number) => api.delete(`/alunos/${id}`),
};

// Dashboard endpoints
export const dashboard = {
  stats: () => api.get('/dashboard/stats'),
  recent: () => api.get('/dashboard/recent'),
};

export default api;