/**
 * AuthService - Authentication Business Logic
 *
 * Implements the IAuthService interface, orchestrating authentication operations
 * using the repository pattern. This is the Use Case layer in Clean Architecture.
 */

import { IAuthService, IAuthRepository, ITokenStorage, User, AuthResponse } from '../types';
import { ApiAuthRepository, MockAuthRepository } from './AuthRepository';
import { tokenStorage } from './TokenStorage';
import { logger } from '../../../shared/utils/logger';
import { AuthError, AppError } from '../../../shared/utils/errors';
import { environment } from '../../../shared/config/environment';
import { HTTP_STATUS } from '../../../shared/constants/http';
import {
  LOG_MESSAGES,
  ERROR_MESSAGES,
  ERROR_CODES,
  SERVICE_NAMES,
  REPOSITORY_TYPES,
} from '../../../shared/constants';

/**
 * AuthService - Main authentication service implementation
 *
 * This service implements business logic for authentication,
 * orchestrating repository and storage operations.
 */
export class AuthService implements IAuthService {
  private repository: IAuthRepository;
  private storage: ITokenStorage;

  /**
   * Creates an instance of AuthService
   *
   * @param repository - Auth repository implementation (API or Mock)
   * @param storage - Token storage implementation
   */
  constructor(repository: IAuthRepository, storage: ITokenStorage) {
    this.repository = repository;
    this.storage = storage;
    logger.debug(LOG_MESSAGES.SERVICE.INITIALIZED);
  }

  /**
   * Authenticate user with email and password
   *
   * @param email - User email address
   * @param password - User password
   * @returns User data and authentication token
   * @throws AuthError if authentication fails
   *
   * @example
   * ```typescript
   * const { user, token } = await authService.login('user@example.com', 'SecurePass123!');
   * ```
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      logger.info(LOG_MESSAGES.FORMATTED.LOGIN_ATTEMPT(email));

      // Authenticate via repository
      const { user, token } = await this.repository.login({ email, password });

      // Store credentials securely
      await Promise.all([this.storage.setToken(token), this.storage.setUserId(user.id)]);

      logger.info(LOG_MESSAGES.FORMATTED.LOGIN_SUCCESS(email));
      return { user, token };
    } catch (error) {
      logger.error(
        LOG_MESSAGES.FORMATTED.LOGIN_FAILED(email),
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Register a new user account
   *
   * @param email - User email address
   * @param password - User password
   * @param name - User display name
   * @param clubId - Associated club ID
   * @returns User data and authentication token
   * @throws AuthError if registration fails
   *
   * @example
   * ```typescript
   * const { user, token } = await authService.register(
   *   'newuser@example.com',
   *   'SecurePass123!',
   *   'John Doe',
   *   'club-123'
   * );
   * ```
   */
  async register(
    email: string,
    password: string,
    name: string,
    clubId: string
  ): Promise<AuthResponse> {
    try {
      logger.info(LOG_MESSAGES.FORMATTED.REGISTRATION_ATTEMPT(email));

      // Register via repository
      const { user, token } = await this.repository.register({
        email,
        password,
        name,
        clubId,
      });

      // Store credentials securely
      await Promise.all([this.storage.setToken(token), this.storage.setUserId(user.id)]);

      logger.info(LOG_MESSAGES.FORMATTED.REGISTRATION_SUCCESS(email));
      return { user, token };
    } catch (error) {
      logger.error(
        LOG_MESSAGES.FORMATTED.REGISTRATION_FAILED(email),
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Sign out the current user
   *
   * Clears local authentication state and notifies the backend.
   *
   * @throws AppError if logout fails
   *
   * @example
   * ```typescript
   * await authService.logout();
   * ```
   */
  async logout(): Promise<void> {
    try {
      logger.info(LOG_MESSAGES.SERVICE.LOGOUT_STARTED);

      // Clear tokens first (before API call in case it fails)
      await this.storage.clearAll();

      // Notify backend (don't throw if this fails)
      await this.repository.logout();

      logger.info(LOG_MESSAGES.SERVICE.LOGOUT_COMPLETED);
    } catch (error) {
      logger.error(LOG_MESSAGES.SERVICE.LOGOUT_ERROR, error instanceof Error ? error : undefined);
      // Ensure local state is cleared even if API call fails
      await this.storage.clearAll();
      throw new AppError(
        ERROR_MESSAGES.APP.LOGOUT_FAILED,
        ERROR_CODES.GENERAL.LOGOUT_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  /**
   * Get the currently authenticated user
   *
   * @returns Current user or null if not authenticated
   *
   * @example
   * ```typescript
   * const user = await authService.getCurrentUser();
   * if (user) {
   *   console.log('Logged in as:', user.email);
   * }
   * ```
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Check if we have a token
      const token = await this.storage.getToken();
      if (!token) {
        logger.debug(LOG_MESSAGES.SERVICE.NO_TOKEN);
        return null;
      }

      // Fetch user from repository
      const user = await this.repository.getCurrentUser();

      if (user) {
        logger.debug(LOG_MESSAGES.FORMATTED.USER_FETCHED(user.email));
      } else {
        logger.debug(LOG_MESSAGES.SERVICE.USER_NOT_FOUND);
        // Clear invalid token
        await this.storage.clearAll();
      }

      return user;
    } catch (error) {
      logger.error(LOG_MESSAGES.SERVICE.GET_USER_ERROR, error instanceof Error ? error : undefined);
      // Clear potentially invalid tokens
      await this.storage.clearAll();
      return null;
    }
  }

  /**
   * Update user profile information
   *
   * @param userData - Partial user data to update
   * @returns Updated user data
   * @throws AppError if update fails
   *
   * @example
   * ```typescript
   * const updatedUser = await authService.updateUser({
   *   name: 'Jane Doe',
   *   timezone: 'America/Los_Angeles'
   * });
   * ```
   */
  async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const userId = await this.storage.getUserId();

      if (!userId) {
        throw new AuthError(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
      }

      logger.info(LOG_MESSAGES.USER.UPDATING, { userId });

      const updatedUser = await this.repository.updateUser(userId, userData);

      logger.info(LOG_MESSAGES.FORMATTED.USER_UPDATED_SUCCESS(userId));
      return updatedUser;
    } catch (error) {
      logger.error(
        LOG_MESSAGES.SERVICE.UPDATE_USER_ERROR,
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Refresh the authentication session
   *
   * Attempts to refresh the authentication token using a refresh token.
   * If refresh fails, the user will need to login again.
   *
   * @throws AuthError if refresh fails
   *
   * @example
   * ```typescript
   * try {
   *   await authService.refreshSession();
   * } catch (error) {
   *   // Redirect to login
   * }
   * ```
   */
  async refreshSession(): Promise<void> {
    try {
      const refreshToken = await this.storage.getRefreshToken();

      if (!refreshToken) {
        throw new AuthError(ERROR_MESSAGES.AUTH.TOKEN_REFRESH_FAILED);
      }

      logger.info(LOG_MESSAGES.SERVICE.REFRESHING_SESSION);

      const { token, refreshToken: newRefreshToken } =
        await this.repository.refreshToken(refreshToken);

      // Store new tokens
      await Promise.all([
        this.storage.setToken(token),
        newRefreshToken && this.storage.setRefreshToken(newRefreshToken),
      ]);

      logger.info(LOG_MESSAGES.SERVICE.SESSION_REFRESHED);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.SERVICE.SESSION_REFRESH_FAILED,
        error instanceof Error ? error : undefined
      );
      // Clear invalid tokens
      await this.storage.clearAll();
      throw new AuthError(ERROR_MESSAGES.AUTH.TOKEN_REFRESH_FAILED, error);
    }
  }

  /**
   * Check if user is currently authenticated
   *
   * @returns True if authenticated, false otherwise
   *
   * @example
   * ```typescript
   * if (await authService.isAuthenticated()) {
   *   // User is logged in
   * }
   * ```
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.storage.getToken();
      return token !== null;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// Factory Function - Creates the appropriate service instance
// ============================================================================

/**
 * Create AuthService instance with appropriate repository
 *
 * Based on environment configuration, creates either an API-based
 * or mock-based authentication service.
 *
 * @returns Configured AuthService instance
 *
 * @example
 * ```typescript
 * const authService = createAuthService();
 * ```
 */
export function createAuthService(): AuthService {
  const repository = environment.mock.useMockApi
    ? new MockAuthRepository()
    : new ApiAuthRepository();

  const repositoryType = environment.mock.useMockApi ? REPOSITORY_TYPES.MOCK : REPOSITORY_TYPES.API;
  logger.info(LOG_MESSAGES.FORMATTED.SERVICE_CREATED(SERVICE_NAMES.AUTH, repositoryType));

  return new AuthService(repository, tokenStorage);
}

// Export singleton instance
export const authService = createAuthService();
