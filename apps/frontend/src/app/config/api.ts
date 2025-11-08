// API Configuration
export const API_CONFIG = {
  baseURL: process.env['API_BASE_URL'] || 'http://localhost:3000/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Environment helpers
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API endpoints
export const API_ENDPOINTS = {
  adminLogin: '/api/auth/admin/login',
  adminRefresh: '/api/auth/admin/refresh',
  adminGetMe: '/api/auth/admin/me',
} as const;
