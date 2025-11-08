// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: import.meta.env.DEV ? 120000 : 10000, // 2 minutes in dev for debugging, 10s in prod
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Environment helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API endpoints
export const API_ENDPOINTS = {
  adminLogin: '/auth/admin/login',
  adminRefresh: '/auth/admin/refresh',
  adminGetMe: '/auth/admin/me',
} as const;
