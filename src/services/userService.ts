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
import { LOG_MESSAGES, ERROR_MESSAGES, API_ENDPOINTS } from '../shared/constants';

// Constants
const MOCK_API_DELAY_MS = 300;

class UserService {
  private useMockData = environment.mock.useMockApi;

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    logger.debug(LOG_MESSAGES.USER.FETCHING_ALL);

    if (this.useMockData) {
      return this.mockGetAllUsers();
    }

    try {
      const users = await apiService.get<User[]>(API_ENDPOINTS.USERS.BASE);
      logger.debug(LOG_MESSAGES.USER.FETCHED_ALL, { count: users.length });
      return users;
    } catch (error) {
      logger.error(LOG_MESSAGES.USER.FETCH_FAILED, error as Error);
      throw error;
    }
  }

  /**
   * Mock get all users implementation
   */
  private async mockGetAllUsers(): Promise<User[]> {
    // Return immediately without delay for better UX
    logger.debug(LOG_MESSAGES.USER.MOCK_GETTING_ALL, { count: mockUsers.length });
    return [...mockUsers];
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User> {
    logger.debug(LOG_MESSAGES.USER.FETCHING_ONE, { userId });

    if (this.useMockData) {
      return this.mockGetUser(userId);
    }

    try {
      const user = await apiService.get<User>(API_ENDPOINTS.USERS.BY_ID(userId));
      logger.debug(LOG_MESSAGES.USER.FETCHED_ONE, { userId: user.id });
      return user;
    } catch (error) {
      logger.error(LOG_MESSAGES.USER.FETCH_ONE_FAILED, error as Error, { userId });
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
      logger.warn(LOG_MESSAGES.USER.MOCK_NOT_FOUND, { userId });
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.USER);
    }

    logger.debug(LOG_MESSAGES.USER.MOCK_FETCHED, { userId });
    return user;
  }

  /**
   * Update user
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    logger.info(LOG_MESSAGES.USER.UPDATING, { userId, fields: Object.keys(data) });

    if (this.useMockData) {
      return this.mockUpdateUser(userId, data);
    }

    try {
      const updatedUser = await apiService.patch<User>(API_ENDPOINTS.USERS.BY_ID(userId), data);
      logger.info(LOG_MESSAGES.USER.UPDATED, { userId: updatedUser.id });
      return updatedUser;
    } catch (error) {
      logger.error(LOG_MESSAGES.USER.UPDATE_FAILED, error as Error, { userId });
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
      logger.warn(LOG_MESSAGES.USER.MOCK_NOT_FOUND_UPDATE, { userId });
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.USER);
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    logger.info(LOG_MESSAGES.USER.MOCK_UPDATED, { userId });
    return mockUsers[userIndex];
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    logger.info(LOG_MESSAGES.USER.DELETING, { userId });

    if (this.useMockData) {
      return this.mockDeleteUser(userId);
    }

    try {
      await apiService.delete<void>(API_ENDPOINTS.USERS.BY_ID(userId));
      logger.info(LOG_MESSAGES.USER.DELETED, { userId });
    } catch (error) {
      logger.error(LOG_MESSAGES.USER.DELETE_FAILED, error as Error, { userId });
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
      logger.info(LOG_MESSAGES.USER.MOCK_DELETED, { userId });
    } else {
      logger.warn(LOG_MESSAGES.USER.MOCK_NOT_FOUND_DELETE, { userId });
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    logger.info(LOG_MESSAGES.USER.UPDATING_ROLE, { userId, role });
    return this.updateUser(userId, { role });
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<User> {
    logger.info(LOG_MESSAGES.USER.DEACTIVATING, { userId });
    return this.updateUser(userId, { isActive: false });
  }

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<User> {
    logger.info(LOG_MESSAGES.USER.ACTIVATING, { userId });
    return this.updateUser(userId, { isActive: true });
  }

  /**
   * Approve user
   */
  async approveUser(userId: string): Promise<User> {
    logger.info(LOG_MESSAGES.USER.APPROVING, { userId });
    return this.updateUser(userId, {
      approvalStatus: ApprovalStatus.APPROVED,
      isActive: true,
    });
  }

  /**
   * Reject user
   */
  async rejectUser(userId: string): Promise<User> {
    logger.info(LOG_MESSAGES.USER.REJECTING, { userId });
    return this.updateUser(userId, {
      approvalStatus: ApprovalStatus.REJECTED,
      isActive: false,
    });
  }

  /**
   * Update user active status
   */
  async updateUserActiveStatus(userId: string, isActive: boolean): Promise<User> {
    logger.debug(LOG_MESSAGES.USER.UPDATING_STATUS, { userId, isActive });
    return this.updateUser(userId, { isActive });
  }

  /**
   * Get users by club ID
   */
  async getUsersByClub(clubId: string): Promise<User[]> {
    logger.debug(LOG_MESSAGES.USER.FETCHING_BY_CLUB, { clubId });

    if (this.useMockData) {
      return this.mockGetUsersByClub(clubId);
    }

    try {
      const users = await apiService.get<User[]>(API_ENDPOINTS.CLUBS.USERS(clubId));
      logger.debug(LOG_MESSAGES.USER.FETCHED_BY_CLUB, { clubId, count: users.length });
      return users;
    } catch (error) {
      logger.error(LOG_MESSAGES.USER.FETCH_BY_CLUB_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get users by club implementation
   */
  private async mockGetUsersByClub(clubId: string): Promise<User[]> {
    await this.sleep(MOCK_API_DELAY_MS);

    const users = mockUsers.filter((u) => u.clubId === clubId);
    logger.debug(LOG_MESSAGES.USER.MOCK_FETCHED_BY_CLUB, { clubId, count: users.length });
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
