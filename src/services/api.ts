/**
 * API Client
 * Centralized HTTP client with retry logic, circuit breaker, and error handling
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { environment } from '../config/environment';
import { secureStorage } from '../utils/secureStorage';
import { logger } from '../utils/logger';
import { retryPolicy } from '../utils/api/retryPolicy';
import { apiCircuitBreaker } from '../utils/api/circuitBreaker';
import {
  NetworkError,
  TimeoutError,
  AuthenticationError,
  RateLimitError,
  toAppError,
} from '../utils/errors';
import { apiRateLimiter } from '../shared/services/rateLimit';
import { HTTP_STATUS } from '../shared/constants/http';
import { MATH, ID_GENERATION } from '../shared/constants/numbers';

// Constants - API_TIMEOUT_MS defined in shared config

// Security headers following OWASP best practices
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/**
 * Creates configured axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: environment.apiUrl,
    timeout: API_TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
      'X-App-Version': '1.0.0',
      ...SECURITY_HEADERS,
    },
  });

  // Request interceptor - rate limiting, auth token, and CSRF token
  client.interceptors.request.use(
    async (config) => {
      try {
        // Rate limiting check
        const userId = await secureStorage.getUserId();
        const rateLimitKey = userId || 'anonymous';
        const allowed = await apiRateLimiter.tryConsume(rateLimitKey);

        if (!allowed) {
          logger.warn('Rate limit exceeded', { userId, endpoint: config.url });
          throw new RateLimitError('Too many requests. Please try again later.');
        }

        // Add auth token
        const token = await secureStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for state-changing operations
        if (
          config.method &&
          ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())
        ) {
          const csrfToken = await secureStorage.getCsrfToken();
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
          }
        }

        // Add request ID for tracing
        config.headers['X-Request-ID'] =
          `req_${Date.now()}_${Math.random().toString(MATH.THIRTY_SIX).substring(MATH.HALF, ID_GENERATION.RANDOM_SUFFIX_LENGTH)}`;
      } catch (error) {
        if (error instanceof RateLimitError) {
          throw error;
        }
        logger.warn('Failed to get auth token', { error });
      }
      return config;
    },
    (error: AxiosError) => {
      logger.error('Request interceptor error', error);
      return Promise.reject(toAppError(error));
    }
  );

  // Response interceptor - handle errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
        // Unauthorized - clear tokens and let app handle redirect
        logger.warn('Unauthorized request - clearing auth tokens');
        await secureStorage.clearAuth();
        throw new AuthenticationError('Session expired. Please login again.');
      }

      if (error.code === 'ECONNABORTED') {
        throw new TimeoutError('Request timed out');
      }

      if (!error.response) {
        throw new NetworkError('Network request failed', error.config?.url);
      }

      throw toAppError(error);
    }
  );

  return client;
};

/**
 * API client instance
 */
const api = createApiClient();

/**
 * Makes HTTP request with retry logic and circuit breaker
 */
async function makeRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  return await apiCircuitBreaker.execute(async () => {
    return await retryPolicy.execute(requestFn);
  });
}

/**
 * API service with typed methods
 */
export const apiService = {
  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(`GET ${url}`);
    const response = await makeRequest(() => api.get<T>(url, config));
    return response.data;
  },

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(`POST ${url}`);
    const response = await makeRequest(() => api.post<T>(url, data, config));
    return response.data;
  },

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(`PUT ${url}`);
    const response = await makeRequest(() => api.put<T>(url, data, config));
    return response.data;
  },

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(`PATCH ${url}`);
    const response = await makeRequest(() => api.patch<T>(url, data, config));
    return response.data;
  },

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(`DELETE ${url}`);
    const response = await makeRequest(() => api.delete<T>(url, config));
    return response.data;
  },

  /**
   * Get circuit breaker stats
   */
  getStats() {
    return apiCircuitBreaker.getStats();
  },

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker() {
    apiCircuitBreaker.reset();
  },
};

export default api;
