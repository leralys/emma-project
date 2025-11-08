import { QueryClient } from '@tanstack/react-query';

// Query Client configuration with best practices
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: how long data stays in cache after component unmounts
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry configuration
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (
            axiosError.response?.status &&
            axiosError.response.status >= 400 &&
            axiosError.response.status < 500
          ) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch configuration
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
      refetchOnReconnect: true, // Refetch when reconnecting to internet
      refetchOnMount: true, // Refetch when component mounts
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,

      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Auth related queries
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Users related queries
  // users: {
  //   all: ['users'] as const,
  //   lists: () => [...queryKeys.users.all, 'list'] as const,
  //   list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), { filters }] as const,
  //   details: () => [...queryKeys.users.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.users.details(), id] as const,
  // },

  // Admin related queries
  // admin: {
  //   all: ['admin'] as const,
  //   features: () => [...queryKeys.admin.all, 'features'] as const,
  //   letters: () => [...queryKeys.admin.all, 'letters'] as const,
  // },
} as const;
