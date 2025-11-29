/**
 * Secure Storage Utility
 * Provides secure storage for sensitive data (native only)
 * Web platform should use httpOnly cookies managed by backend
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { logger } from './logger';

export class SecureStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecureStorageError';
  }
}

class SecureStorage {
  private static readonly AUTH_TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_ID_KEY = 'auth_user_id';

  /**
   * Checks if secure storage is available (native platforms only)
   */
  private isAvailable(): boolean {
    return Platform.OS !== 'web';
  }

  /**
   * Throws error if running on web platform
   */
  private ensureNativePlatform(): void {
    if (!this.isAvailable()) {
      throw new SecureStorageError(
        'Secure storage is not available on web platform. ' +
        'Use server-side sessions with httpOnly cookies instead.'
      );
    }
  }

  /**
   * Saves auth tokens securely
   */
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    this.ensureNativePlatform();
    
    try {
      await Promise.all([
        SecureStore.setItemAsync(SecureStorage.AUTH_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(SecureStorage.REFRESH_TOKEN_KEY, refreshToken),
      ]);
      logger.debug('Tokens saved securely');
    } catch (error) {
      logger.error('Failed to save tokens', error as Error);
      throw new SecureStorageError('Failed to save authentication tokens');
    }
  }

  /**
   * Retrieves access token
   */
  async getAccessToken(): Promise<string | null> {
    this.ensureNativePlatform();
    
    try {
      return await SecureStore.getItemAsync(SecureStorage.AUTH_TOKEN_KEY);
    } catch (error) {
      logger.error('Failed to retrieve access token', error as Error);
      return null;
    }
  }

  /**
   * Retrieves refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    this.ensureNativePlatform();
    
    try {
      return await SecureStore.getItemAsync(SecureStorage.REFRESH_TOKEN_KEY);
    } catch (error) {
      logger.error('Failed to retrieve refresh token', error as Error);
      return null;
    }
  }

  /**
   * Saves user ID
   */
  async saveUserId(userId: string): Promise<void> {
    this.ensureNativePlatform();
    
    try {
      await SecureStore.setItemAsync(SecureStorage.USER_ID_KEY, userId);
    } catch (error) {
      logger.error('Failed to save user ID', error as Error);
      throw new SecureStorageError('Failed to save user ID');
    }
  }

  /**
   * Retrieves user ID
   */
  async getUserId(): Promise<string | null> {
    this.ensureNativePlatform();
    
    try {
      return await SecureStore.getItemAsync(SecureStorage.USER_ID_KEY);
    } catch (error) {
      logger.error('Failed to retrieve user ID', error as Error);
      return null;
    }
  }

  /**
   * Clears all auth data
   */
  async clearAuth(): Promise<void> {
    this.ensureNativePlatform();
    
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(SecureStorage.AUTH_TOKEN_KEY),
        SecureStore.deleteItemAsync(SecureStorage.REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(SecureStorage.USER_ID_KEY),
      ]);
      logger.debug('Auth data cleared');
    } catch (error) {
      logger.error('Failed to clear auth data', error as Error);
      // Don't throw - best effort to clear
    }
  }

  /**
   * Saves any secure value
   */
  async setItem(key: string, value: string): Promise<void> {
    this.ensureNativePlatform();
    
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error(`Failed to save item: ${key}`, error as Error);
      throw new SecureStorageError(`Failed to save item: ${key}`);
    }
  }

  /**
   * Retrieves any secure value
   */
  async getItem(key: string): Promise<string | null> {
    this.ensureNativePlatform();
    
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      logger.error(`Failed to retrieve item: ${key}`, error as Error);
      return null;
    }
  }

  /**
   * Removes any secure value
   */
  async removeItem(key: string): Promise<void> {
    this.ensureNativePlatform();
    
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error(`Failed to remove item: ${key}`, error as Error);
      // Don't throw - best effort to remove
    }
  }
}

export const secureStorage = new SecureStorage();

