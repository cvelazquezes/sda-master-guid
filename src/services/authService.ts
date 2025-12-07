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
import {
  LOG_MESSAGES,
  ERROR_MESSAGES,
  TIMEZONES,
  LANGUAGES,
  generateMockToken,
  API_ENDPOINTS,
  PLATFORM_OS,
} from '../shared/constants';
import { UserRole, ApprovalStatus, PathfinderClass, User, PATHFINDER_CLASSES } from '../types';
import { mockUsers, getUserByEmail } from './mockData';

// Constants
const MOCK_API_DELAY_MS = 500;

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private useMockData = environment.mock.useMockApi;

  /**
   * Authenticates user with credentials
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Validate input
    const credentials: LoginCredentials = validateOrThrow(LoginSchema, {
      email,
      password,
    });

    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT, { email: credentials.email });

    if (this.useMockData) {
      return await this.mockLogin(credentials);
    }

    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      await this.saveAuthData(response);
      logger.info(LOG_MESSAGES.AUTH.LOGIN_SUCCESS, { userId: response.user.id });
      return response;
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.LOGIN_FAILED, error as Error, { email: credentials.email });
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
      throw new AuthenticationError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // In mock mode, any password works for testing
    // In production, this would verify password hash
    const token = generateMockToken(user.id);

    await this.saveAuthData({ user, token });

    logger.info(LOG_MESSAGES.AUTH.MOCK_LOGIN_SUCCESS, { userId: user.id });
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

    logger.info(LOG_MESSAGES.AUTH.REGISTRATION_ATTEMPT, { email: data.email, isClubAdmin });

    if (this.useMockData) {
      return await this.mockRegister(data, classes, isClubAdmin);
    }

    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
        ...data,
        isClubAdmin,
      });
      await this.saveAuthData(response);
      logger.info(LOG_MESSAGES.AUTH.REGISTRATION_SUCCESS, { userId: response.user.id });
      return response;
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.REGISTRATION_FAILED, error as Error, { email: data.email });
      throw error;
    }
  }

  /**
   * Mock registration implementation
   */
  private async mockRegister(
    data: RegisterData,
    classes?: string[],
    isClubAdmin?: boolean
  ): Promise<AuthResponse> {
    await this.sleep(MOCK_API_DELAY_MS);

    // Check if user already exists
    if (getUserByEmail(data.email)) {
      throw new ConflictError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
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
      // Pending approval (admin for club_admin, club admin for regular users)
      approvalStatus: ApprovalStatus.PENDING,
      classes: isClubAdmin ? [] : ((classes || [PATHFINDER_CLASSES[0]]) as PathfinderClass[]), // No classes for club admins
      timezone: TIMEZONES.DEFAULT,
      language: LANGUAGES.DEFAULT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    const token = generateMockToken(newUser.id);
    await this.saveAuthData({ user: newUser, token });

    logger.info(LOG_MESSAGES.AUTH.MOCK_REGISTRATION_SUCCESS, { userId: newUser.id, role });
    return { user: newUser, token };
  }

  /**
   * Logs out current user
   */
  async logout(): Promise<void> {
    logger.info(LOG_MESSAGES.AUTH.LOGOUT_INITIATED);

    try {
      await secureStorage.clearAuth();
      logger.info(LOG_MESSAGES.AUTH.LOGOUT_SUCCESS);
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.LOGOUT_ERROR, error as Error);
      // Attempt to clear anyway
      try {
        await secureStorage.clearAuth();
      } catch (fallbackError) {
        logger.error(LOG_MESSAGES.AUTH.LOGOUT_ERROR, fallbackError as Error);
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
        logger.debug(LOG_MESSAGES.AUTH.NO_TOKEN_FOUND);
        return null;
      }

      const user = await apiService.get<User>(API_ENDPOINTS.AUTH.ME);
      logger.debug(LOG_MESSAGES.AUTH.USER_VALIDATED, { userId: user.id });
      return user;
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.USER_VALIDATION_FAILED, error as Error);
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
        logger.debug(LOG_MESSAGES.AUTH.NO_TOKEN_FOUND);
        return null;
      }

      const user = mockUsers.find((u) => u.id === userId);
      if (!user) {
        logger.warn(LOG_MESSAGES.USER.NOT_FOUND, { userId });
        return null;
      }

      logger.debug(LOG_MESSAGES.AUTH.USER_VALIDATED, { userId: user.id });
      return user;
    } catch (error) {
      logger.error(LOG_MESSAGES.AUTH.USER_LOAD_ERROR, error as Error);
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
      const updatedUser = await apiService.patch<User>(API_ENDPOINTS.AUTH.ME, validatedData);
      logger.info(LOG_MESSAGES.USER.UPDATED, { userId: updatedUser.id });
      return updatedUser;
    } catch (error) {
      logger.error(LOG_MESSAGES.USER.UPDATE_FAILED, error as Error);
      throw error;
    }
  }

  /**
   * Mock update user implementation
   */
  private async mockUpdateUser(userData: Partial<User>): Promise<User> {
    const userId = await secureStorage.getUserId();
    if (!userId) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.USER);
    }

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.USER);
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    logger.info(LOG_MESSAGES.MOCK.USER_UPDATED, { userId });
    return mockUsers[userIndex];
  }

  /**
   * Saves auth data to secure storage
   */
  private async saveAuthData(authResponse: AuthResponse): Promise<void> {
    try {
      // Check platform before saving
      if (Platform.OS === PLATFORM_OS.WEB) {
        logger.warn(LOG_MESSAGES.AUTH.WEB_PLATFORM_WARNING);
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
      logger.error(LOG_MESSAGES.CONTEXTS.AUTH.FAILED_TO_SAVE_AUTH_DATA, error as Error);
      throw new Error(LOG_MESSAGES.CONTEXTS.AUTH.FAILED_TO_SAVE_AUTH_DATA);
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
