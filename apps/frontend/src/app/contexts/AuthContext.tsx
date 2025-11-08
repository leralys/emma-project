import { AuthenticatedUser } from '@emma-project/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.roles?.includes('admin') ?? false;
  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is already logged in on app start
    const initAuth = async () => {
      try {
        const tokens = authService.getStoredTokens();
        if (tokens.accessToken) {
          const userData = await authService.getMe();
          setUser(userData);
        }
      } catch {
        // Token might be expired, clear storage
        authService.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(password);

      // Store tokens
      authService.storeTokens(response.accessToken, response.refreshToken, response.csrfToken);

      // Get user data
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearTokens();
    setUser(null);
    window.location.href = '/';
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
