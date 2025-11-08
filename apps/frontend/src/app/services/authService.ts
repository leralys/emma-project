import { AuthenticatedUser, LoginResponse } from '@emma-project/types';
import { API_ENDPOINTS } from '../config/api';
import api from './api';

export interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
}

// Pure API functions for TanStack Query
export const authAPI = {
  login: async (password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.adminLogin, {
      password,
    });

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  },

  getMe: async (): Promise<AuthenticatedUser> => {
    const response = await api.get<AuthenticatedUser>(API_ENDPOINTS.adminGetMe);

    if (!response.data) {
      throw new Error('Failed to get user data');
    }

    return response.data;
  },

  refreshTokens: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.adminRefresh,
      {},
      {
        headers: {
          'X-Refresh-Token': refreshToken,
        },
      }
    );

    if (!response.data) {
      throw new Error('Failed to refresh tokens');
    }

    return response.data;
  },
};

export const authService = {
  storeTokens: (accessToken: string, refreshToken: string, csrfToken: string): void => {
    localStorage.setItem('JWT_TOKEN', accessToken);
    localStorage.setItem('JWT_REFRESH_TOKEN', refreshToken);
    localStorage.setItem('JWT_CSRF_TOKEN', csrfToken);
  },

  getStoredTokens: (): StoredTokens => {
    return {
      accessToken: localStorage.getItem('JWT_TOKEN'),
      refreshToken: localStorage.getItem('JWT_REFRESH_TOKEN'),
      csrfToken: localStorage.getItem('JWT_CSRF_TOKEN'),
    };
  },

  clearTokens: (): void => {
    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('JWT_REFRESH_TOKEN');
    localStorage.removeItem('JWT_CSRF_TOKEN');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const tokens = authService.getStoredTokens();
    return !!tokens.accessToken;
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('JWT_TOKEN');
  },

  getCsrfToken: (): string | null => {
    return localStorage.getItem('JWT_CSRF_TOKEN');
  },
};
