/**
 * Secure Storage Utility
 * Provides secure storage for sensitive data (native only)
 * Web platform should use httpOnly cookies managed by backend
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { logger } from './logger';
import {
  ERROR_MESSAGES,
  ERROR_NAME,
  LOG_MESSAGES,
  PLATFORM_OS,
  STORAGE_KEYS,
} from '../shared/constants';

export class SecureStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ERROR_NAME.SECURE_STORAGE_ERROR;
  }
}

class SecureStorage {
  private static readonly AUTH_TOKEN_KEY = STORAGE_KEYS.AUTH.TOKEN;
  private static readonly REFRESH_TOKEN_KEY = STORAGE_KEYS.AUTH.REFRESH_TOKEN;
  private static readonly USER_ID_KEY = STORAGE_KEYS.AUTH.USER_ID;
  private static readonly CSRF_TOKEN_KEY = STORAGE_KEYS.CSRF.TOKEN;

  /**
   * Checks if secure storage is available (native platforms only)
   */
  private isAvailable(): boolean {
    return Platform.OS !== PLATFORM_OS.WEB;
  }

  /**
   * Throws error if running on web platform
   */
  private ensureNativePlatform(): void {
    if (!this.isAvailable()) {
      throw new SecureStorageError(ERROR_MESSAGES.SECURE_STORAGE.NOT_AVAILABLE);
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
      logger.debug(LOG_MESSAGES.SECURE_STORAGE.ITEM_STORED);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_STORE_FAILED, error as Error);
      throw new SecureStorageError(ERROR_MESSAGES.SECURE_STORAGE.SAVE_TOKENS_FAILED);
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
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_RETRIEVE_FAILED, error as Error);
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
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_RETRIEVE_FAILED, error as Error);
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
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_STORE_FAILED, error as Error);
      throw new SecureStorageError(ERROR_MESSAGES.SECURE_STORAGE.SAVE_USER_ID_FAILED);
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
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_RETRIEVE_FAILED, error as Error);
      return null;
    }
  }

  /**
   * Saves CSRF token
   */
  async saveCsrfToken(csrfToken: string): Promise<void> {
    this.ensureNativePlatform();

    try {
      await SecureStore.setItemAsync(SecureStorage.CSRF_TOKEN_KEY, csrfToken);
      logger.debug(LOG_MESSAGES.SECURE_STORAGE.ITEM_STORED);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_STORE_FAILED, error as Error);
      throw new SecureStorageError(ERROR_MESSAGES.SECURE_STORAGE.SAVE_CSRF_TOKEN_FAILED);
    }
  }

  /**
   * Retrieves CSRF token
   */
  async getCsrfToken(): Promise<string | null> {
    this.ensureNativePlatform();

    try {
      return await SecureStore.getItemAsync(SecureStorage.CSRF_TOKEN_KEY);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_RETRIEVE_FAILED, error as Error);
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
        SecureStore.deleteItemAsync(SecureStorage.CSRF_TOKEN_KEY),
      ]);
      logger.debug(LOG_MESSAGES.SECURE_STORAGE.AUTH_CLEARED);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURE_STORAGE.STORAGE_CLEAR_FAILED, error as Error);
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
      logger.error(ERROR_MESSAGES.SECURE_STORAGE.SAVE_ITEM_FAILED(key), error as Error);
      throw new SecureStorageError(ERROR_MESSAGES.SECURE_STORAGE.SAVE_ITEM_FAILED(key));
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
      logger.error(ERROR_MESSAGES.SECURE_STORAGE.RETRIEVE_ITEM_FAILED(key), error as Error);
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
      logger.error(ERROR_MESSAGES.SECURE_STORAGE.REMOVE_ITEM_FAILED(key), error as Error);
      // Don't throw - best effort to remove
    }
  }
}

export const secureStorage = new SecureStorage();
