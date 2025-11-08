import { Role } from '@prisma/client';

export interface User {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  roles: Role[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}
