import { ApiResponse, PaginatedResponse } from '@emma-project/types';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Clear token and redirect to main page
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('csrfToken');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

// Generic API methods with proper typing
export const apiClient = {
  // GET request with typed response
  get: <T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.get(url);
  },

  // POST request with typed response
  post: <T, D = unknown>(url: string, data?: D): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.post(url, data);
  },

  // PUT request with typed response
  put: <T, D = unknown>(url: string, data?: D): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.put(url, data);
  },

  // DELETE request with typed response
  delete: <T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.delete(url);
  },

  // PATCH request with typed response
  patch: <T, D = unknown>(url: string, data?: D): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.patch(url, data);
  },

  // GET paginated data
  getPaginated: <T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<PaginatedResponse<T>>> => {
    return api.get(url, { params });
  },
};

export default api;
