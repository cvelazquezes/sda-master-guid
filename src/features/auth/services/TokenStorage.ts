/**
 * TokenStorage - Secure Token Storage Implementation
 * 
 * Implements the ITokenStorage interface using platform-specific secure storage.
 * This is an adapter that wraps the secure storage utility.
 */

import { ITokenStorage } from '../types';
import { secureStorage } from '../../../shared/utils/secureStorage';
import { logger } from '../../../shared/utils/logger';

/**
 * SecureTokenStorage - Production implementation using expo-secure-store
 */
export class SecureTokenStorage implements ITokenStorage {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ID_KEY = 'auth_user_id';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';

  /**
   * Store authentication token securely
   * 
   * @param token - JWT token or access token
   */
  async setToken(token: string): Promise<void> {
    try {
      await secureStorage.setItem(this.TOKEN_KEY, token);
      logger.debug('Token stored successfully');
    } catch (error) {
      logger.error('Failed to store token', error instanceof Error ? error : undefined);
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
      logger.error('Failed to retrieve token', error instanceof Error ? error : undefined);
      return null;
    }
  }

  /**
   * Remove authentication token
   */
  async removeToken(): Promise<void> {
    try {
      await secureStorage.removeItem(this.TOKEN_KEY);
      logger.debug('Token removed successfully');
    } catch (error) {
      logger.error('Failed to remove token', error instanceof Error ? error : undefined);
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
      logger.debug('User ID stored successfully');
    } catch (error) {
      logger.error('Failed to store user ID', error instanceof Error ? error : undefined);
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
      logger.error('Failed to retrieve user ID', error instanceof Error ? error : undefined);
      return null;
    }
  }

  /**
   * Remove user ID
   */
  async removeUserId(): Promise<void> {
    try {
      await secureStorage.removeItem(this.USER_ID_KEY);
      logger.debug('User ID removed successfully');
    } catch (error) {
      logger.error('Failed to remove user ID', error instanceof Error ? error : undefined);
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
      logger.debug('Refresh token stored successfully');
    } catch (error) {
      logger.error('Failed to store refresh token', error instanceof Error ? error : undefined);
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
      logger.error('Failed to retrieve refresh token', error instanceof Error ? error : undefined);
      return null;
    }
  }

  /**
   * Remove refresh token
   */
  async removeRefreshToken(): Promise<void> {
    try {
      await secureStorage.removeItem(this.REFRESH_TOKEN_KEY);
      logger.debug('Refresh token removed successfully');
    } catch (error) {
      logger.error('Failed to remove refresh token', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.removeToken(),
        this.removeUserId(),
        this.removeRefreshToken(),
      ]);
      logger.info('All auth data cleared successfully');
    } catch (error) {
      logger.error('Failed to clear all auth data', error instanceof Error ? error : undefined);
      throw error;
    }
  }
}

// Singleton instance
export const tokenStorage = new SecureTokenStorage();

