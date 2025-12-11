/**
 * Secure Storage Utility
 * Provides secure storage for sensitive data (native only)
 * Web platform should use httpOnly cookies managed by backend
 */

/* eslint-disable max-classes-per-file -- Error class and service are co-located */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { logger } from './logger';
import { ERROR_MESSAGES, ERROR_NAME, LOG_MESSAGES, PLATFORM_OS, STORAGE_KEYS } from '../constants';

export class SecureStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ERROR_NAME.SECURE_STORAGE_ERROR;
  }
}

class SecureStorage {
  private static readonly _authTokenKey: string = STORAGE_KEYS.AUTH.TOKEN;
  private static readonly _refreshTokenKey: string = STORAGE_KEYS.AUTH.REFRESH_TOKEN;
  private static readonly _userIdKey: string = STORAGE_KEYS.AUTH.USER_ID;

  /**
   * Checks if secure storage is available (native platforms only)
   */
  private _isAvailable(): boolean {
    return Platform.OS !== PLATFORM_OS.WEB;
  }

  /**
   * Throws error if running on web platform
   */
  private _ensureNativePlatform(): void {
    if (!this._isAvailable()) {
      throw new SecureStorageError(ERROR_MESSAGES.SECURE_STORAGE.NOT_AVAILABLE);
    }
  }

  /**
   * Saves auth tokens securely
   */
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    this._ensureNativePlatform();

    try {
      await Promise.all([
        SecureStore.setItemAsync(SecureStorage._authTokenKey, accessToken),
        SecureStore.setItemAsync(SecureStorage._refreshTokenKey, refreshToken),
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
    this._ensureNativePlatform();

    try {
      return await SecureStore.getItemAsync(SecureStorage._authTokenKey);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_RETRIEVE_FAILED, error as Error);
      return null;
    }
  }

  /**
   * Retrieves refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    this._ensureNativePlatform();

    try {
      return await SecureStore.getItemAsync(SecureStorage._refreshTokenKey);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_RETRIEVE_FAILED, error as Error);
      return null;
    }
  }

  /**
   * Saves user ID
   */
  async saveUserId(userId: string): Promise<void> {
    this._ensureNativePlatform();

    try {
      await SecureStore.setItemAsync(SecureStorage._userIdKey, userId);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_STORE_FAILED, error as Error);
      throw new SecureStorageError(ERROR_MESSAGES.SECURE_STORAGE.SAVE_USER_ID_FAILED);
    }
  }

  /**
   * Retrieves user ID
   */
  async getUserId(): Promise<string | null> {
    this._ensureNativePlatform();

    try {
      return await SecureStore.getItemAsync(SecureStorage._userIdKey);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURE_STORAGE.ITEM_RETRIEVE_FAILED, error as Error);
      return null;
    }
  }

  /**
   * Clears all auth data
   */
  async clearAuth(): Promise<void> {
    this._ensureNativePlatform();

    try {
      await Promise.all([
        SecureStore.deleteItemAsync(SecureStorage._authTokenKey),
        SecureStore.deleteItemAsync(SecureStorage._refreshTokenKey),
        SecureStore.deleteItemAsync(SecureStorage._userIdKey),
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
    this._ensureNativePlatform();

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
    this._ensureNativePlatform();

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
    this._ensureNativePlatform();

    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error(ERROR_MESSAGES.SECURE_STORAGE.REMOVE_ITEM_FAILED(key), error as Error);
      // Don't throw - best effort to remove
    }
  }
}

export const secureStorage = new SecureStorage();
