import { AuthenticatedUser } from '@emma-project/types';
import { API_ENDPOINTS } from '../config/api';
import api, { apiClient } from './api';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
}

export const authService = {
  // Admin login
  login: async (password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.adminLogin, {
        password,
      });

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }

      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid password');
    }
  },

  // Get current user
  getMe: async (): Promise<AuthenticatedUser> => {
    try {
      const response = await apiClient.get<AuthenticatedUser>(API_ENDPOINTS.adminGetMe);

      if (!response.data.data) {
        throw new Error('Failed to get user data');
      }

      return response.data.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Refresh tokens
  refreshTokens: async (): Promise<LoginResponse> => {
    try {
      const tokens = authService.getStoredTokens();

      if (!tokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(
        API_ENDPOINTS.adminRefresh,
        {},
        {
          headers: {
            'X-Refresh-Token': tokens.refreshToken,
          },
        }
      );

      if (!response.data.data) {
        throw new Error('Failed to refresh tokens');
      }

      return response.data.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      authService.clearTokens();
      throw error;
    }
  },

  // Token storage management
  storeTokens: (accessToken: string, refreshToken: string, csrfToken: string) => {
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

  clearTokens: () => {
    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('JWT_REFRESH_TOKEN');
    localStorage.removeItem('JWT_CSRF_TOKEN');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const tokens = authService.getStoredTokens();
    return !!tokens.accessToken;
  },

  // Get access token for API calls
  getAccessToken: (): string | null => {
    return localStorage.getItem('JWT_TOKEN');
  },

  // Get CSRF token for API calls
  getCsrfToken: (): string | null => {
    return localStorage.getItem('JWT_CSRF_TOKEN');
  },
};
