import { AuthenticatedUser } from '@emma-project/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext } from 'react';
import { queryKeys } from '../config/queryClient';
import { authAPI, authService } from '../services/authService';

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (password: string) => Promise<unknown>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  loginError: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Get current user data
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authAPI.getMe,
    enabled: authService.isAuthenticated(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // Store tokens
      authService.storeTokens(data.accessToken, data.refreshToken, data.csrfToken);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
    onError: () => {
      // Clear any existing tokens on login failure
      authService.clearTokens();
    },
  });

  // Logout function
  const logout = () => {
    authService.clearTokens();
    queryClient.clear();
    window.location.href = '/';
  };

  const value: AuthContextType = {
    user: user || null,
    loading: isLoading,
    login: loginMutation.mutateAsync,
    logout,
    isAdmin: user?.roles?.includes('admin') ?? false,
    isAuthenticated: !!user,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
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
