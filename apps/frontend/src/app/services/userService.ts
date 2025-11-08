import { PaginatedResponse, User } from '@emma-project/types';
import { apiClient } from './api';

export const userService = {
  // Get all users with pagination
  getUsers: async (page = 1, pageSize = 10): Promise<PaginatedResponse<User>> => {
    try {
      const response = await apiClient.getPaginated<User>('/users', { page, pageSize });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};
