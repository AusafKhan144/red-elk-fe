import axios from 'axios';
import { LoginResponse, Assessment, DashboardData, AssessmentSubmission } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const assessmentService = {
  getAll: async (): Promise<Assessment[]> => {
    const response = await api.get('/assessments/');
    return response.data;
  },

  getById: async (id: string): Promise<Assessment> => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },

  submit: async (
    id: string,
    data: {
      company_name?: string;
      responses: Record<string, any>;
      tier_used: 'free' | 'basic' | 'premium';
    }
  ): Promise<AssessmentSubmission> => {
    const response = await api.post(`/assessments/${id}/submit`, data);
    return response.data;
  },
};

export const userService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/users/me/dashboard');
    return response.data;
  },

  getSubmissions: async (): Promise<AssessmentSubmission[]> => {
    const response = await api.get('/users/me/submissions');
    return response.data;
  },
};

export default api;