/**
 * User Service
 * Handles user management with mock/backend toggle
 */

import { apiService } from './api';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';
import { User, UserRole, ApprovalStatus } from '../types';
import { mockUsers } from './mockData';
import { NotFoundError } from '../utils/errors';

// Constants
const MOCK_API_DELAY_MS = 300;

class UserService {
  private useMockData = environment.mock.useMockApi;

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    logger.debug('Fetching all users');

    if (this.useMockData) {
      return this.mockGetAllUsers();
    }

    try {
      const users = await apiService.get<User[]>('/users');
      logger.debug('Users fetched', { count: users.length });
      return users;
    } catch (error) {
      logger.error('Failed to fetch users', error as Error);
      throw error;
    }
  }

  /**
   * Mock get all users implementation
   */
  private async mockGetAllUsers(): Promise<User[]> {
    // Return immediately without delay for better UX
    logger.debug('Mock: Getting all users', { count: mockUsers.length });
    return [...mockUsers];
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User> {
    logger.debug('Fetching user', { userId });

    if (this.useMockData) {
      return this.mockGetUser(userId);
    }

    try {
      const user = await apiService.get<User>(`/users/${userId}`);
      logger.debug('User fetched', { userId: user.id });
      return user;
    } catch (error) {
      logger.error('Failed to fetch user', error as Error, { userId });
      throw error;
    }
  }

  /**
   * Mock get user implementation
   */
  private async mockGetUser(userId: string): Promise<User> {
    await this.sleep(MOCK_API_DELAY_MS);

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      logger.warn('Mock: User not found', { userId });
      throw new NotFoundError('User not found');
    }

    logger.debug('Mock: User fetched', { userId });
    return user;
  }

  /**
   * Update user
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    logger.info('Updating user', { userId, fields: Object.keys(data) });

    if (this.useMockData) {
      return this.mockUpdateUser(userId, data);
    }

    try {
      const updatedUser = await apiService.patch<User>(`/users/${userId}`, data);
      logger.info('User updated', { userId: updatedUser.id });
      return updatedUser;
    } catch (error) {
      logger.error('Failed to update user', error as Error, { userId });
      throw error;
    }
  }

  /**
   * Mock update user implementation
   */
  private async mockUpdateUser(userId: string, data: Partial<User>): Promise<User> {
    await this.sleep(MOCK_API_DELAY_MS);

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      logger.warn('Mock: User not found for update', { userId });
      throw new NotFoundError('User not found');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    logger.info('Mock: User updated', { userId });
    return mockUsers[userIndex];
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    logger.info('Deleting user', { userId });

    if (this.useMockData) {
      return this.mockDeleteUser(userId);
    }

    try {
      await apiService.delete<void>(`/users/${userId}`);
      logger.info('User deleted', { userId });
    } catch (error) {
      logger.error('Failed to delete user', error as Error, { userId });
      throw error;
    }
  }

  /**
   * Mock delete user implementation
   */
  private async mockDeleteUser(userId: string): Promise<void> {
    await this.sleep(MOCK_API_DELAY_MS);

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
      logger.info('Mock: User deleted', { userId });
    } else {
      logger.warn('Mock: User not found for deletion', { userId });
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    logger.info('Updating user role', { userId, role });
    return this.updateUser(userId, { role });
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<User> {
    logger.info('Deactivating user', { userId });
    return this.updateUser(userId, { isActive: false });
  }

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<User> {
    logger.info('Activating user', { userId });
    return this.updateUser(userId, { isActive: true });
  }

  /**
   * Approve user
   */
  async approveUser(userId: string): Promise<User> {
    logger.info('Approving user', { userId });
    return this.updateUser(userId, {
      approvalStatus: ApprovalStatus.APPROVED,
      isActive: true,
    });
  }

  /**
   * Reject user
   */
  async rejectUser(userId: string): Promise<User> {
    logger.info('Rejecting user', { userId });
    return this.updateUser(userId, {
      approvalStatus: ApprovalStatus.REJECTED,
      isActive: false,
    });
  }

  /**
   * Update user active status
   */
  async updateUserActiveStatus(userId: string, isActive: boolean): Promise<User> {
    logger.debug('Updating user active status', { userId, isActive });
    return this.updateUser(userId, { isActive });
  }

  /**
   * Get users by club ID
   */
  async getUsersByClub(clubId: string): Promise<User[]> {
    logger.debug('Fetching users by club', { clubId });

    if (this.useMockData) {
      return this.mockGetUsersByClub(clubId);
    }

    try {
      const users = await apiService.get<User[]>(`/clubs/${clubId}/users`);
      logger.debug('Users fetched for club', { clubId, count: users.length });
      return users;
    } catch (error) {
      logger.error('Failed to fetch users for club', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get users by club implementation
   */
  private async mockGetUsersByClub(clubId: string): Promise<User[]> {
    await this.sleep(MOCK_API_DELAY_MS);

    const users = mockUsers.filter((u) => u.clubId === clubId);
    logger.debug('Mock: Users fetched for club', { clubId, count: users.length });
    return users;
  }

  /**
   * Sleep helper for mock delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const userService = new UserService();
