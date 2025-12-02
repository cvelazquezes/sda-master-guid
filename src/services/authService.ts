/**
 * Authentication Service
 * Handles user authentication with secure storage and validation
 */

import { Platform } from 'react-native';
import { apiService } from './api';
import { secureStorage } from '../utils/secureStorage';
import { logger } from '../utils/logger';
import { environment } from '../config/environment';
import {
  LoginCredentials,
  RegisterData,
  UpdateUserData,
  validateOrThrow,
  LoginSchema,
  RegisterSchema,
  UpdateUserSchema,
} from '../utils/validation';
import { AuthenticationError, ConflictError, NotFoundError } from '../utils/errors';
import { UserRole, ApprovalStatus, PathfinderClass } from '../types';
import { User } from '../types';
import { mockUsers, getUserByEmail } from './mockData';

// Constants
const MOCK_API_DELAY_MS = 500;

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private useMockData = environment.useMockData;

  /**
   * Authenticates user with credentials
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Validate input
    const credentials: LoginCredentials = validateOrThrow(LoginSchema, {
      email,
      password,
    });

    logger.info('Login attempt', { email: credentials.email });

    if (this.useMockData) {
      return await this.mockLogin(credentials);
    }

    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      await this.saveAuthData(response);
      logger.info('Login successful', { userId: response.user.id });
      return response;
    } catch (error) {
      logger.error('Login failed', error as Error, { email: credentials.email });
      throw error;
    }
  }

  /**
   * Mock login implementation
   */
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.sleep(MOCK_API_DELAY_MS);

    const user = getUserByEmail(credentials.email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // In mock mode, any password works for testing
    // In production, this would verify password hash
    const token = `mock_token_${user.id}`;

    await this.saveAuthData({ user, token });

    logger.info('Mock login successful', { userId: user.id });
    return { user, token };
  }

  /**
   * Registers new user
   */
  async register(
    email: string,
    password: string,
    name: string,
    whatsappNumber: string,
    clubId: string,
    classes?: string[],
    isClubAdmin?: boolean
  ): Promise<AuthResponse> {
    // Validate input
    const data: RegisterData = validateOrThrow(RegisterSchema, {
      email,
      password,
      name,
      whatsappNumber,
      clubId,
    });

    logger.info('Registration attempt', { email: data.email, isClubAdmin });

    if (this.useMockData) {
      return await this.mockRegister(data, classes, isClubAdmin);
    }

    try {
      const response = await apiService.post<AuthResponse>('/auth/register', { ...data, isClubAdmin });
      await this.saveAuthData(response);
      logger.info('Registration successful', { userId: response.user.id });
      return response;
    } catch (error) {
      logger.error('Registration failed', error as Error, { email: data.email });
      throw error;
    }
  }

  /**
   * Mock registration implementation
   */
  private async mockRegister(data: RegisterData, classes?: string[], isClubAdmin?: boolean): Promise<AuthResponse> {
    await this.sleep(MOCK_API_DELAY_MS);

    // Check if user already exists
    if (getUserByEmail(data.email)) {
      throw new ConflictError('User already exists');
    }

    // Determine role based on isClubAdmin flag
    const role = isClubAdmin ? UserRole.CLUB_ADMIN : UserRole.USER;

    // Create new user with pending approval status
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      whatsappNumber: data.whatsappNumber,
      role: role,
      clubId: data.clubId, // User gets hierarchy from their club
      isActive: false, // Inactive until approved
      approvalStatus: ApprovalStatus.PENDING, // Pending approval (admin for club_admin, club admin for regular users)
      classes: isClubAdmin ? [] : ((classes || ['Friend']) as PathfinderClass[]), // No classes for club admins
      timezone: 'America/New_York',
      language: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    const token = `mock_token_${newUser.id}`;
    await this.saveAuthData({ user: newUser, token });

    logger.info('Mock registration successful - pending approval', { userId: newUser.id, role });
    return { user: newUser, token };
  }

  /**
   * Logs out current user
   */
  async logout(): Promise<void> {
    logger.info('Logout initiated');

    try {
      await secureStorage.clearAuth();
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout error', error as Error);
      // Attempt to clear anyway
      try {
        await secureStorage.clearAuth();
      } catch (fallbackError) {
        logger.error('Fallback logout error', fallbackError as Error);
      }
    }
  }

  /**
   * Gets current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    if (this.useMockData) {
      return await this.mockGetCurrentUser();
    }

    try {
      const token = await secureStorage.getAccessToken();
      if (!token) {
        logger.debug('No auth token found');
        return null;
      }

      const user = await apiService.get<User>('/auth/me');
      logger.debug('Current user loaded', { userId: user.id });
      return user;
    } catch (error) {
      logger.error('Failed to get current user', error as Error);
      return null;
    }
  }

  /**
   * Mock get current user implementation
   */
  private async mockGetCurrentUser(): Promise<User | null> {
    try {
      const userId = await secureStorage.getUserId();
      const token = await secureStorage.getAccessToken();

      // Both must exist for user to be considered logged in
      if (!userId || !token) {
        logger.debug('No user ID or token found');
        return null;
      }

      const user = mockUsers.find((u) => u.id === userId);
      if (!user) {
        logger.warn('User not found in mock data', { userId });
        return null;
      }

      logger.debug('Current user loaded from mock', { userId: user.id });
      return user;
    } catch (error) {
      logger.error('Error getting current user from mock', error as Error);
      return null;
    }
  }

  /**
   * Updates current user data
   */
  async updateUser(userData: Partial<User>): Promise<User> {
    // Validate input
    const validatedData: UpdateUserData = validateOrThrow(UpdateUserSchema, userData);

    if (this.useMockData) {
      return await this.mockUpdateUser(validatedData);
    }

    try {
      const updatedUser = await apiService.patch<User>('/auth/me', validatedData);
      logger.info('User updated', { userId: updatedUser.id });
      return updatedUser;
    } catch (error) {
      logger.error('Failed to update user', error as Error);
      throw error;
    }
  }

  /**
   * Mock update user implementation
   */
  private async mockUpdateUser(userData: Partial<User>): Promise<User> {
    const userId = await secureStorage.getUserId();
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new NotFoundError('User not found');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    logger.info('Mock user updated', { userId });
    return mockUsers[userIndex];
  }

  /**
   * Saves auth data to secure storage
   */
  private async saveAuthData(authResponse: AuthResponse): Promise<void> {
    try {
      // Check platform before saving
      if (Platform.OS === 'web') {
        logger.warn('Web platform. Use server-side sessions with httpOnly cookies.');
        // For development/testing on web, we'll skip secure storage
        // In production, this should use server-side session management
        return;
      }

      await Promise.all([
        // Using same token for refresh in mock mode
        secureStorage.saveTokens(authResponse.token, authResponse.token),
        secureStorage.saveUserId(authResponse.user.id),
      ]);
    } catch (error) {
      logger.error('Failed to save auth data', error as Error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Sleep helper for mock delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();
