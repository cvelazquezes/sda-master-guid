/**
 * Auth Repository Implementations
 * 
 * Provides both API-based and mock-based implementations of IAuthRepository.
 * This follows the Repository Pattern and Dependency Inversion Principle.
 */

import {
  IAuthRepository,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  AuthToken,
} from '../types';
import { loginSchema, registerSchema, updateUserSchema } from '../utils/validation';
import { AuthError, AppError } from '../../../shared/utils/errors';
import { logger } from '../../../shared/utils/logger';
import api from '../../../shared/api/api';

// ============================================================================
// API Repository Implementation
// ============================================================================

/**
 * ApiAuthRepository - Production implementation using REST API
 * 
 * This adapter connects to the backend API for authentication operations.
 */
export class ApiAuthRepository implements IAuthRepository {
  /**
   * Authenticate user via API
   * 
   * @param credentials - User login credentials
   * @returns User data and authentication token
   * @throws AuthError if authentication fails
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validate input
    loginSchema.parse(credentials);

    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;

      logger.info(`User ${user.email} logged in successfully`);
      return { user, token };
    } catch (error: any) {
      logger.error('API login error:', error);
      
      if (error.response?.status === 401) {
        throw new AuthError('Invalid credentials', error);
      }
      
      throw new AuthError('Login failed', error);
    }
  }

  /**
   * Register new user via API
   * 
   * @param data - Registration data
   * @returns User data and authentication token
   * @throws AuthError if registration fails
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Validate input
    registerSchema.parse(data);

    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;

      logger.info(`User ${user.email} registered successfully`);
      return { user, token };
    } catch (error: any) {
      logger.error('API registration error:', error);
      
      if (error.response?.status === 409) {
        throw new AuthError('User already exists', error);
      }
      
      throw new AuthError('Registration failed', error);
    }
  }

  /**
   * Logout user (server-side session invalidation)
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('API logout error:', error instanceof Error ? error : undefined);
      // Don't throw - logout should succeed even if API call fails
    }
  }

  /**
   * Get current user from API
   * 
   * @returns Current user or null if not authenticated
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user;
      
      logger.debug(`Fetched current user: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Failed to fetch current user:', error instanceof Error ? error : undefined);
      return null;
    }
  }

  /**
   * Update user profile via API
   * 
   * @param userId - User identifier
   * @param data - User data to update
   * @returns Updated user data
   * @throws AppError if update fails
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    // Validate input
    updateUserSchema.parse(data);

    try {
      const response = await api.patch(`/auth/users/${userId}`, data);
      const user = response.data.user;
      
      logger.info(`User ${userId} updated successfully`);
      return user;
    } catch (error) {
      logger.error('API update user error:', error instanceof Error ? error : undefined);
      throw new AppError('Failed to update user', 'UPDATE_ERROR', 500, error);
    }
  }

  /**
   * Refresh authentication token
   * 
   * @param refreshToken - Refresh token
   * @returns New authentication token
   * @throws AuthError if refresh fails
   */
  async refreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      const { token, refreshToken: newRefreshToken, expiresAt } = response.data;
      
      logger.info('Token refreshed successfully');
      return { token, refreshToken: newRefreshToken, expiresAt };
    } catch (error) {
      logger.error('API refresh token error:', error instanceof Error ? error : undefined);
      throw new AuthError('Token refresh failed', error);
    }
  }
}

// ============================================================================
// Mock Repository Implementation (for development/testing)
// ============================================================================

/**
 * MockAuthRepository - Development implementation using local data
 * 
 * This adapter uses mock data for development and testing purposes.
 */
export class MockAuthRepository implements IAuthRepository {
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      clubId: 'club1',
      isActive: true,
      isPaused: false,
      timezone: 'America/New_York',
      language: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      clubId: 'club1',
      isActive: true,
      isPaused: false,
      timezone: 'America/New_York',
      language: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  /**
   * Mock login - accepts any password for existing users
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validate input
    loginSchema.parse(credentials);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = this.mockUsers.find((u) => u.email === credentials.email);
    
    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    logger.info(`Mock login: ${user.email}`);
    
    return { user, token };
  }

  /**
   * Mock registration
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Validate input
    registerSchema.parse(data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    if (this.mockUsers.find((u) => u.email === data.email)) {
      throw new AuthError('User already exists');
    }

    const newUser: User = {
      id: String(this.mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: 'user',
      clubId: data.clubId,
      isActive: true,
      isPaused: false,
      timezone: 'America/New_York',
      language: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockUsers.push(newUser);
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    
    logger.info(`Mock registration: ${newUser.email}`);
    return { user: newUser, token };
  }

  /**
   * Mock logout
   */
  async logout(): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    logger.info('Mock logout');
  }

  /**
   * Get mock current user
   */
  async getCurrentUser(): Promise<User | null> {
    // In a real mock, this would use stored user ID
    // For simplicity, return first user
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockUsers[0] || null;
  }

  /**
   * Update mock user
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    // Validate input
    updateUserSchema.parse(data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const userIndex = this.mockUsers.findIndex((u) => u.id === userId);
    
    if (userIndex === -1) {
      throw new AppError('User not found', 'USER_NOT_FOUND', 404);
    }

    this.mockUsers[userIndex] = {
      ...this.mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    logger.info(`Mock user ${userId} updated`);
    return this.mockUsers[userIndex];
  }

  /**
   * Mock token refresh
   */
  async refreshToken(refreshToken: string): Promise<AuthToken> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    const token = `mock_token_refreshed_${Date.now()}`;
    logger.info('Mock token refreshed');
    
    return {
      token,
      refreshToken: `mock_refresh_${Date.now()}`,
      expiresAt: Date.now() + 3600000, // 1 hour
    };
  }
}

