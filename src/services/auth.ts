import axios from 'axios';
import { LoginFormData, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
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
  login: async (credentials: LoginFormData): Promise<{ user: User; token: string }> => {
    // Mock implementation - replace with actual API call
    const mockUsers = [
      {
        id: '1',
        email: 'admin@company.com',
        name: 'IT Admin',
        role: 'IT Admin' as const,
        department: 'IT',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'manager@company.com',
        name: 'John Manager',
        role: 'Manager' as const,
        department: 'Engineering',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'hr@company.com',
        name: 'Jane HR',
        role: 'HR' as const,
        department: 'Human Resources',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        email: 'employee@company.com',
        name: 'Bob Employee',
        role: 'Employee' as const,
        department: 'Engineering',
        managerId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const user = mockUsers.find((u) => u.email === credentials.email);
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid credentials');
    }

    const token = `mock-jwt-token-${user.id}`;

    return { user, token };
  },

  logout: async (): Promise<void> => {
    // Mock implementation
    return Promise.resolve();
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Extract user ID from mock token
    const userId = token.split('-').pop();

    const mockUsers = [
      {
        id: '1',
        email: 'admin@company.com',
        name: 'IT Admin',
        role: 'IT Admin' as const,
        department: 'IT',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'manager@company.com',
        name: 'John Manager',
        role: 'Manager' as const,
        department: 'Engineering',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'hr@company.com',
        name: 'Jane HR',
        role: 'HR' as const,
        department: 'Human Resources',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        email: 'employee@company.com',
        name: 'Bob Employee',
        role: 'Employee' as const,
        department: 'Engineering',
        managerId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
};

export default api;
