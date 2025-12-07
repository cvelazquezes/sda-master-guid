/**
 * TokenStorage - Secure Token Storage Implementation
 *
 * Implements the ITokenStorage interface using platform-specific secure storage.
 * This is an adapter that wraps the secure storage utility.
 */

import { ITokenStorage } from '../types';
import { secureStorage } from '../../../shared/utils/secureStorage';
import { logger } from '../../../shared/utils/logger';
import { LOG_MESSAGES, STORAGE_KEYS } from '../../../shared/constants';

/**
 * SecureTokenStorage - Production implementation using expo-secure-store
 */
export class SecureTokenStorage implements ITokenStorage {
  private readonly TOKEN_KEY = STORAGE_KEYS.AUTH.TOKEN;
  private readonly USER_ID_KEY = STORAGE_KEYS.AUTH.USER_ID;
  private readonly REFRESH_TOKEN_KEY = STORAGE_KEYS.AUTH.REFRESH_TOKEN;

  /**
   * Store authentication token securely
   *
   * @param token - JWT token or access token
   */
  async setToken(token: string): Promise<void> {
    try {
      await secureStorage.setItem(this.TOKEN_KEY, token);
      logger.debug(LOG_MESSAGES.TOKEN_STORAGE.TOKEN_STORED);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.TOKEN_STORE_FAILED,
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Retrieve authentication token
   *
   * @returns Token string or null if not found
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await secureStorage.getItem(this.TOKEN_KEY);
      return token;
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.TOKEN_RETRIEVE_FAILED,
        error instanceof Error ? error : undefined
      );
      return null;
    }
  }

  /**
   * Remove authentication token
   */
  async removeToken(): Promise<void> {
    try {
      await secureStorage.removeItem(this.TOKEN_KEY);
      logger.debug(LOG_MESSAGES.TOKEN_STORAGE.TOKEN_REMOVED);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.TOKEN_REMOVE_FAILED,
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Store user ID
   *
   * @param userId - User identifier
   */
  async setUserId(userId: string): Promise<void> {
    try {
      await secureStorage.setItem(this.USER_ID_KEY, userId);
      logger.debug(LOG_MESSAGES.TOKEN_STORAGE.USER_ID_STORED);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.USER_ID_STORE_FAILED,
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Retrieve user ID
   *
   * @returns User ID or null if not found
   */
  async getUserId(): Promise<string | null> {
    try {
      const userId = await secureStorage.getItem(this.USER_ID_KEY);
      return userId;
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.USER_ID_RETRIEVE_FAILED,
        error instanceof Error ? error : undefined
      );
      return null;
    }
  }

  /**
   * Remove user ID
   */
  async removeUserId(): Promise<void> {
    try {
      await secureStorage.removeItem(this.USER_ID_KEY);
      logger.debug(LOG_MESSAGES.TOKEN_STORAGE.USER_ID_REMOVED);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.USER_ID_REMOVE_FAILED,
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Store refresh token securely
   *
   * @param refreshToken - Refresh token for session renewal
   */
  async setRefreshToken(refreshToken: string): Promise<void> {
    try {
      await secureStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      logger.debug(LOG_MESSAGES.TOKEN_STORAGE.REFRESH_TOKEN_STORED);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.REFRESH_TOKEN_STORE_FAILED,
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Retrieve refresh token
   *
   * @returns Refresh token or null if not found
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      const refreshToken = await secureStorage.getItem(this.REFRESH_TOKEN_KEY);
      return refreshToken;
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.REFRESH_TOKEN_RETRIEVE_FAILED,
        error instanceof Error ? error : undefined
      );
      return null;
    }
  }

  /**
   * Remove refresh token
   */
  async removeRefreshToken(): Promise<void> {
    try {
      await secureStorage.removeItem(this.REFRESH_TOKEN_KEY);
      logger.debug(LOG_MESSAGES.TOKEN_STORAGE.REFRESH_TOKEN_REMOVED);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.REFRESH_TOKEN_REMOVE_FAILED,
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([this.removeToken(), this.removeUserId(), this.removeRefreshToken()]);
      logger.info(LOG_MESSAGES.TOKEN_STORAGE.ALL_DATA_CLEARED);
    } catch (error) {
      logger.error(
        LOG_MESSAGES.TOKEN_STORAGE.CLEAR_ALL_FAILED,
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }
}

// Singleton instance
export const tokenStorage = new SecureTokenStorage();
