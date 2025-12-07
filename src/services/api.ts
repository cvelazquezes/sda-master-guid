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
import {
  HTTP_STATUS,
  HEADER,
  CONTENT_TYPE,
  SECURITY_HEADER_VALUE,
  AUTH_CONSTANTS,
  STATE_CHANGING_METHODS,
} from '../shared/constants/http';
import { ERROR_MESSAGES, LOG_MESSAGES, APP_VERSION, AXIOS_ERROR_CODE } from '../shared/constants';
import { MATH, ID_GENERATION } from '../shared/constants/numbers';
import { TIMEOUT } from '../shared/constants/timing';

// Constants
const API_TIMEOUT_MS = TIMEOUT.API_DEFAULT;

// Security headers following OWASP best practices
const SECURITY_HEADERS = {
  [HEADER.X_CONTENT_TYPE_OPTIONS]: SECURITY_HEADER_VALUE.NOSNIFF,
  [HEADER.X_FRAME_OPTIONS]: SECURITY_HEADER_VALUE.DENY,
  [HEADER.X_XSS_PROTECTION]: SECURITY_HEADER_VALUE.XSS_MODE_BLOCK,
  [HEADER.STRICT_TRANSPORT_SECURITY]: SECURITY_HEADER_VALUE.HSTS_MAX_AGE,
  [HEADER.REFERRER_POLICY]: SECURITY_HEADER_VALUE.REFERRER_STRICT_ORIGIN,
};

/**
 * Creates configured axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: environment.api.base,
    timeout: API_TIMEOUT_MS,
    headers: {
      [HEADER.CONTENT_TYPE]: CONTENT_TYPE.JSON,
      [HEADER.X_APP_VERSION]: APP_VERSION,
      ...SECURITY_HEADERS,
    },
  });

  // Request interceptor - rate limiting, auth token, and CSRF token
  client.interceptors.request.use(
    async (config) => {
      try {
        // Rate limiting check
        const userId = await secureStorage.getUserId();
        const rateLimitKey = userId || AUTH_CONSTANTS.ANONYMOUS;
        const allowed = await apiRateLimiter.tryConsume(rateLimitKey);

        if (!allowed) {
          logger.warn(LOG_MESSAGES.API_CLIENT.RATE_LIMIT_EXCEEDED, {
            userId,
            endpoint: config.url,
          });
          throw new RateLimitError(ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS);
        }

        // Add auth token
        const token = await secureStorage.getAccessToken();
        if (token) {
          config.headers[HEADER.AUTHORIZATION] = `${AUTH_CONSTANTS.BEARER_PREFIX}${token}`;
        }

        // Add CSRF token for state-changing operations
        if (
          config.method &&
          STATE_CHANGING_METHODS.includes(
            config.method.toLowerCase() as (typeof STATE_CHANGING_METHODS)[number]
          )
        ) {
          const csrfToken = await secureStorage.getCsrfToken();
          if (csrfToken) {
            config.headers[HEADER.X_CSRF_TOKEN] = csrfToken;
          }
        }

        // Add request ID for tracing
        config.headers[HEADER.X_REQUEST_ID] =
          `req_${Date.now()}_${Math.random().toString(MATH.THIRTY_SIX).substring(MATH.HALF, ID_GENERATION.RANDOM_SUFFIX_LENGTH)}`;
      } catch (error) {
        if (error instanceof RateLimitError) {
          throw error;
        }
        logger.warn(LOG_MESSAGES.API_CLIENT.AUTH_TOKEN_FAILED, { error });
      }
      return config;
    },
    (error: AxiosError) => {
      logger.error(LOG_MESSAGES.API_CLIENT.REQUEST_INTERCEPTOR_ERROR, error);
      return Promise.reject(toAppError(error));
    }
  );

  // Response interceptor - handle errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
        // Unauthorized - clear tokens and let app handle redirect
        logger.warn(LOG_MESSAGES.API_CLIENT.UNAUTHORIZED);
        await secureStorage.clearAuth();
        throw new AuthenticationError(ERROR_MESSAGES.AUTH.SESSION_EXPIRED);
      }

      if (error.code === AXIOS_ERROR_CODE.ECONNABORTED) {
        throw new TimeoutError(ERROR_MESSAGES.TIMEOUT.REQUEST_TIMEOUT);
      }

      if (!error.response) {
        throw new NetworkError(ERROR_MESSAGES.NETWORK.REQUEST_FAILED, error.config?.url);
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
    logger.debug(LOG_MESSAGES.FORMATTED.HTTP_GET(url));
    const response = await makeRequest(() => api.get<T>(url, config));
    return response.data;
  },

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(LOG_MESSAGES.FORMATTED.HTTP_POST(url));
    const response = await makeRequest(() => api.post<T>(url, data, config));
    return response.data;
  },

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(LOG_MESSAGES.FORMATTED.HTTP_PUT(url));
    const response = await makeRequest(() => api.put<T>(url, data, config));
    return response.data;
  },

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(LOG_MESSAGES.FORMATTED.HTTP_PATCH(url));
    const response = await makeRequest(() => api.patch<T>(url, data, config));
    return response.data;
  },

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    logger.debug(LOG_MESSAGES.FORMATTED.HTTP_DELETE(url));
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
