/**
 * CSRF Protection Utility
 * Following OWASP CSRF Prevention Cheat Sheet
 */

import crypto from 'crypto';
import { useState, useEffect, useCallback } from 'react';
import { secureStorage } from './secureStorage';
import { logger } from './logger';
import { CACHE } from '../constants/timing';
import { MATH, CRYPTO } from '../constants/numbers';
import {
  LOG_MESSAGES,
  STORAGE_KEYS,
  ENCODING,
  CSRF_COOKIE_NAME,
  STATE_CHANGING_METHODS_UPPER,
  HEADER,
} from '../constants';

// ============================================================================
// React Hook for CSRF Token
// ============================================================================

// ============================================================================
// Types
// ============================================================================

/**
 * CSRF token configuration
 */
interface CSRFConfig {
  /** Token expiration time in milliseconds */
  expirationTime: number;
  /** Token refresh threshold in milliseconds */
  refreshThreshold: number;
}

// ============================================================================
// CSRF Token Service
// ============================================================================

/**
 * CSRF Token Service
 * Manages CSRF tokens for state-changing operations
 */
export class CSRFTokenService {
  private static readonly TOKEN_KEY = STORAGE_KEYS.CSRF.TOKEN;
  private static readonly TOKEN_TIMESTAMP_KEY = STORAGE_KEYS.CSRF.TOKEN_TIMESTAMP;

  private static readonly config: CSRFConfig = {
    expirationTime: CACHE.VERY_LONG, // 1 hour
    refreshThreshold: CACHE.MEDIUM, // 5 minutes
  };

  /**
   * Generates a new CSRF token
   */
  static generateToken(): string {
    // Generate cryptographically secure random token
    const randomBytes = crypto.randomBytes(CRYPTO.TOKEN_BYTES);
    return randomBytes.toString(ENCODING.BASE64);
  }

  /**
   * Stores CSRF token securely
   */
  static async storeToken(token: string): Promise<void> {
    try {
      const timestamp = Date.now();
      await Promise.all([
        secureStorage.setItem(this.TOKEN_KEY, token),
        secureStorage.setItem(this.TOKEN_TIMESTAMP_KEY, timestamp.toString()),
      ]);
      logger.debug(LOG_MESSAGES.SECURITY.CSRF.TOKEN_STORED);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURITY.CSRF.STORE_FAILED, error as Error);
      throw new Error(LOG_MESSAGES.SECURITY.CSRF.FAILED_TO_STORE_TOKEN);
    }
  }

  /**
   * Gets current CSRF token
   */
  static async getToken(): Promise<string | null> {
    try {
      const token = await secureStorage.getItem(this.TOKEN_KEY);
      const timestampStr = await secureStorage.getItem(this.TOKEN_TIMESTAMP_KEY);

      if (!token || !timestampStr) {
        return null;
      }

      const timestamp = parseInt(timestampStr, MATH.DECIMAL_BASE);
      const now = Date.now();

      // Check if token is expired
      if (now - timestamp > this.config.expirationTime) {
        logger.debug(LOG_MESSAGES.SECURITY.CSRF.TOKEN_EXPIRED);
        await this.clearToken();
        return null;
      }

      return token;
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURITY.CSRF.RETRIEVE_FAILED, error as Error);
      return null;
    }
  }

  /**
   * Gets or generates CSRF token
   */
  static async getOrGenerateToken(): Promise<string> {
    let token = await this.getToken();

    if (!token) {
      token = this.generateToken();
      await this.storeToken(token);
    } else {
      // Check if token should be refreshed
      const timestampStr = await secureStorage.getItem(this.TOKEN_TIMESTAMP_KEY);
      if (timestampStr) {
        const timestamp = parseInt(timestampStr, MATH.DECIMAL_BASE);
        const age = Date.now() - timestamp;

        if (age > this.config.expirationTime - this.config.refreshThreshold) {
          logger.debug(LOG_MESSAGES.SECURITY.CSRF.TOKEN_REFRESHING);
          token = this.generateToken();
          await this.storeToken(token);
        }
      }
    }

    return token;
  }

  /**
   * Validates CSRF token
   */
  static async validateToken(token: string): Promise<boolean> {
    const storedToken = await this.getToken();

    if (!storedToken) {
      logger.warn(LOG_MESSAGES.SECURITY.CSRF.NO_TOKEN);
      return false;
    }

    // Use timing-safe comparison to prevent timing attacks
    return this.timingSafeEqual(token, storedToken);
  }

  /**
   * Clears CSRF token
   */
  static async clearToken(): Promise<void> {
    try {
      await Promise.all([
        secureStorage.removeItem(this.TOKEN_KEY),
        secureStorage.removeItem(this.TOKEN_TIMESTAMP_KEY),
      ]);
      logger.debug(LOG_MESSAGES.SECURITY.CSRF.TOKEN_CLEARED);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURITY.CSRF.CLEAR_FAILED, error as Error);
    }
  }

  /**
   * Timing-safe string comparison to prevent timing attacks
   */
  private static timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}

/**
 * Hook for managing CSRF tokens
 *
 * @returns CSRF token management utilities
 *
 * @example
 * ```typescript
 * const { token, refreshToken } = useCSRFToken();
 *
 * const submitForm = async () => {
 *   await api.post('/data', formData, {
 *     headers: { 'X-CSRF-Token': token }
 *   });
 * };
 * ```
 */
export function useCSRFToken(): {
  token: string | null;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
} {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentToken = await CSRFTokenService.getOrGenerateToken();
      setToken(currentToken);
    } catch (error) {
      logger.error(LOG_MESSAGES.SECURITY.CSRF.LOAD_FAILED, error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const newToken = CSRFTokenService.generateToken();
    await CSRFTokenService.storeToken(newToken);
    setToken(newToken);
  }, []);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  return {
    token,
    refreshToken,
    isLoading,
  };
}

// ============================================================================
// Double Submit Cookie Pattern
// ============================================================================

/**
 * Implements double submit cookie pattern for CSRF protection
 *
 * This should be used in conjunction with backend validation:
 * - Token is sent in both cookie and custom header
 * - Backend validates both match
 */
export class DoubleSubmitCookieService {
  private static readonly COOKIE_NAME = CSRF_COOKIE_NAME;

  /**
   * Sets CSRF token in cookie
   *
   * Note: Cookies are managed by the backend in React Native
   * This is a placeholder for web platform compatibility
   */
  static setCookie(token: string): void {
    if (__DEV__) {
      logger.debug(LOG_MESSAGES.SECURITY.CSRF.COOKIE_SET, { token });
    }
    // In React Native, cookies are managed by the HTTP client
    // This method is for documentation and web compatibility
  }

  /**
   * Gets CSRF token from cookie
   */
  static getCookie(): string | null {
    // In React Native, this would be handled by the HTTP client
    // This is a placeholder for web compatibility
    return null;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validates if a request requires CSRF protection
 */
export function requiresCSRFProtection(method: string): boolean {
  return STATE_CHANGING_METHODS_UPPER.includes(
    method.toUpperCase() as (typeof STATE_CHANGING_METHODS_UPPER)[number]
  );
}

/**
 * Adds CSRF token to request headers
 */
export async function addCSRFHeader(
  headers: Record<string, string>
): Promise<Record<string, string>> {
  const token = await CSRFTokenService.getOrGenerateToken();

  return {
    ...headers,
    [HEADER.X_CSRF_TOKEN]: token,
  };
}

/**
 * Validates CSRF token from request
 */
export async function validateCSRFToken(token: string | null): Promise<boolean> {
  if (!token) {
    logger.warn(LOG_MESSAGES.SECURITY.CSRF.MISSING_TOKEN);
    return false;
  }

  return await CSRFTokenService.validateToken(token);
}

// ============================================================================
// Example Usage
// ============================================================================

/**
 * Example: Using CSRF protection in API calls
 *
 * ```typescript
 * import { requiresCSRFProtection, addCSRFHeader } from './csrfProtection';
 *
 * // In API client interceptor
 * axios.interceptors.request.use(async (config) => {
 *   if (config.method && requiresCSRFProtection(config.method)) {
 *     config.headers = await addCSRFHeader(config.headers || {});
 *   }
 *   return config;
 * });
 *
 * // In React component
 * const MyForm = () => {
 *   const { token } = useCSRFToken();
 *
 *   const handleSubmit = async () => {
 *     await api.post('/data', formData, {
 *       headers: { 'X-CSRF-Token': token }
 *     });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * };
 * ```
 *
 * Example: Backend validation (Node.js/Express)
 *
 * ```typescript
 * app.use((req, res, next) => {
 *   if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
 *     const tokenFromHeader = req.headers['x-csrf-token'];
 *     const tokenFromCookie = req.cookies['__Host-csrf-token'];
 *
 *     if (!tokenFromHeader || !tokenFromCookie) {
 *       return res.status(403).json({ error: 'Missing CSRF token' });
 *     }
 *
 *     if (tokenFromHeader !== tokenFromCookie) {
 *       return res.status(403).json({ error: 'Invalid CSRF token' });
 *     }
 *   }
 *
 *   next();
 * });
 * ```
 */
