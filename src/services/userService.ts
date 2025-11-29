import api from './api';
import { User, UserRole } from '../types';
import { mockUsers } from './mockData';

const USE_MOCK_DATA = true;

export const userService = {
  async getAllUsers(): Promise<User[]> {
    if (USE_MOCK_DATA) {
      // Return immediately without delay for better UX
      return [...mockUsers];
    }
    const response = await api.get('/users');
    return response.data;
  },

  async getUser(userId: string): Promise<User> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const user = mockUsers.find((u) => u.id === userId);
      if (!user) throw new Error('User not found');
      return user;
    }
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const userIndex = mockUsers.findIndex((u) => u.id === userId);
      if (userIndex === -1) throw new Error('User not found');
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return mockUsers[userIndex];
    }
    const response = await api.patch(`/users/${userId}`, data);
    return response.data;
  },

  async deleteUser(userId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const userIndex = mockUsers.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
      }
      return;
    }
    await api.delete(`/users/${userId}`);
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return this.updateUser(userId, { role });
  },

  async pauseUser(userId: string): Promise<User> {
    return this.updateUser(userId, { isPaused: true });
  },

  async resumeUser(userId: string): Promise<User> {
    return this.updateUser(userId, { isPaused: false });
  },

  async approveUser(userId: string): Promise<User> {
    return this.updateUser(userId, {
      approvalStatus: 'approved',
      isActive: true,
    });
  },

  async rejectUser(userId: string): Promise<User> {
    return this.updateUser(userId, {
      approvalStatus: 'rejected',
      isActive: false,
    });
  },
};
