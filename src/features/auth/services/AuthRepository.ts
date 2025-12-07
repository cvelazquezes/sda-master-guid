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
import { HTTP_STATUS } from '../../../shared/constants/http';
import { MOCK_DELAY, CACHE } from '../../../shared/constants/timing';
import {
  LOG_MESSAGES,
  ERROR_MESSAGES,
  ERROR_CODES,
  TIMEZONES,
  LANGUAGES,
  API_ENDPOINTS,
  MOCK_DATA,
  generateMockToken,
  generateMockRefreshToken,
  generateRefreshedMockToken,
} from '../../../shared/constants';
import { UserRole } from '../../../types';

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
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const { user, token } = response.data;

      logger.info(LOG_MESSAGES.FORMATTED.USER_LOGIN_SUCCESS(user.email));
      return { user, token };
    } catch (error: unknown) {
      logger.error(LOG_MESSAGES.API_REPOSITORY.LOGIN_ERROR, error);

      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === HTTP_STATUS.UNAUTHORIZED) {
        throw new AuthError(
          ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
          error instanceof Error ? error : undefined
        );
      }

      throw new AuthError(
        ERROR_MESSAGES.AUTH.LOGIN_FAILED,
        error instanceof Error ? error : undefined
      );
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
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
      const { user, token } = response.data;

      logger.info(LOG_MESSAGES.FORMATTED.USER_REGISTERED_SUCCESS(user.email));
      return { user, token };
    } catch (error: unknown) {
      logger.error(LOG_MESSAGES.API_REPOSITORY.REGISTRATION_ERROR, error);

      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === HTTP_STATUS.CONFLICT) {
        throw new AuthError(
          ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS,
          error instanceof Error ? error : undefined
        );
      }

      throw new AuthError(
        ERROR_MESSAGES.AUTH.REGISTRATION_FAILED,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Logout user (server-side session invalidation)
   */
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      logger.info(LOG_MESSAGES.AUTH.LOGOUT_SUCCESS);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.API_REPOSITORY.LOGOUT_ERROR,
        error instanceof Error ? error : undefined
      );
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
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      const user = response.data.user;

      logger.debug(LOG_MESSAGES.FORMATTED.USER_FETCHED(user.email));
      return user;
    } catch (error) {
      logger.error(
        LOG_MESSAGES.API_REPOSITORY.FETCH_USER_FAILED,
        error instanceof Error ? error : undefined
      );
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
      const response = await api.patch(API_ENDPOINTS.AUTH.USERS(userId), data);
      const user = response.data.user;

      logger.info(LOG_MESSAGES.FORMATTED.USER_UPDATED_SUCCESS(userId));
      return user;
    } catch (error) {
      logger.error(
        LOG_MESSAGES.API_REPOSITORY.UPDATE_USER_ERROR,
        error instanceof Error ? error : undefined
      );
      throw new AppError(
        ERROR_MESSAGES.USER.UPDATE_FAILED,
        ERROR_CODES.CRUD.UPDATE_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      );
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
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
      const { token, refreshToken: newRefreshToken, expiresAt } = response.data;

      logger.info(LOG_MESSAGES.AUTH.TOKEN_REFRESH_SUCCESS);
      return { token, refreshToken: newRefreshToken, expiresAt };
    } catch (error) {
      logger.error(
        LOG_MESSAGES.API_REPOSITORY.REFRESH_TOKEN_ERROR,
        error instanceof Error ? error : undefined
      );
      throw new AuthError(ERROR_MESSAGES.AUTH.TOKEN_REFRESH_FAILED, error);
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
      id: MOCK_DATA.USERS.ADMIN.ID,
      email: MOCK_DATA.USERS.ADMIN.EMAIL,
      name: MOCK_DATA.USERS.ADMIN.NAME,
      role: UserRole.ADMIN,
      clubId: MOCK_DATA.CLUBS.DEFAULT.ID,
      isActive: true,
      isPaused: false,
      timezone: TIMEZONES.DEFAULT,
      language: LANGUAGES.DEFAULT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: MOCK_DATA.USERS.REGULAR.ID,
      email: MOCK_DATA.USERS.REGULAR.EMAIL,
      name: MOCK_DATA.USERS.REGULAR.NAME,
      role: UserRole.USER,
      clubId: MOCK_DATA.CLUBS.DEFAULT.ID,
      isActive: true,
      isPaused: false,
      timezone: TIMEZONES.DEFAULT,
      language: LANGUAGES.DEFAULT,
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
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY.NORMAL));

    const user = this.mockUsers.find((u) => u.email === credentials.email);

    if (!user) {
      throw new AuthError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const token = generateMockToken(user.id);
    logger.info(LOG_MESSAGES.FORMATTED.MOCK_LOGIN(user.email));

    return { user, token };
  }

  /**
   * Mock registration
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Validate input
    registerSchema.parse(data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY.NORMAL));

    // Check if user already exists
    if (this.mockUsers.find((u) => u.email === data.email)) {
      throw new AuthError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    const newUser: User = {
      id: String(this.mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: UserRole.USER,
      clubId: data.clubId,
      isActive: true,
      isPaused: false,
      timezone: TIMEZONES.DEFAULT,
      language: LANGUAGES.DEFAULT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockUsers.push(newUser);
    const token = generateMockToken(newUser.id);

    logger.info(LOG_MESSAGES.FORMATTED.MOCK_REGISTRATION(newUser.email));
    return { user: newUser, token };
  }

  /**
   * Mock logout
   */
  async logout(): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY.FAST));
    logger.info(LOG_MESSAGES.MOCK.LOGOUT);
  }

  /**
   * Get mock current user
   */
  async getCurrentUser(): Promise<User | null> {
    // In a real mock, this would use stored user ID
    // For simplicity, return first user
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY.FAST));
    return this.mockUsers[0] || null;
  }

  /**
   * Update mock user
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    // Validate input
    updateUserSchema.parse(data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY.FAST));

    const userIndex = this.mockUsers.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new AppError(
        ERROR_MESSAGES.NOT_FOUND.USER,
        ERROR_CODES.RESOURCE.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    this.mockUsers[userIndex] = {
      ...this.mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    logger.info(LOG_MESSAGES.FORMATTED.MOCK_USER_UPDATED(userId));
    return this.mockUsers[userIndex];
  }

  /**
   * Mock token refresh
   */
  async refreshToken(_refreshToken: string): Promise<AuthToken> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY.FAST));

    const token = generateRefreshedMockToken();
    logger.info(LOG_MESSAGES.MOCK.TOKEN_REFRESHED);

    return {
      token,
      refreshToken: generateMockRefreshToken(),
      expiresAt: Date.now() + CACHE.VERY_LONG, // 1 hour
    };
  }
}
