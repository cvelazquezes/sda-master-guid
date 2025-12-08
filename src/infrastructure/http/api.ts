/**
 * API Client
 * Centralized HTTP client with retry logic, circuit breaker, and error handling
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { environment } from '../config/environment';
import { secureStorage } from '../../shared/utils/secureStorage';
import { logger } from '../../shared/utils/logger';
import { retryPolicy } from './api/retryPolicy';
import { apiCircuitBreaker } from './api/circuitBreaker';
import { NetworkError, TimeoutError, AuthenticationError, toAppError } from '../../shared/utils/errors';
import { TIMEOUT } from '../../shared/constants/timing';
import { HTTP_STATUS, HEADER, CONTENT_TYPE, AUTH_CONSTANTS } from '../../shared/constants/http';
import { LOG_MESSAGES, ERROR_MESSAGES, APP_VERSION, AXIOS_ERROR_CODE } from '../../shared/constants';

// Constants
const API_TIMEOUT_MS = TIMEOUT.API_DEFAULT;

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
    },
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    async (config) => {
      try {
        const token = await secureStorage.getAccessToken();
        if (token) {
          config.headers[HEADER.AUTHORIZATION] = `${AUTH_CONSTANTS.BEARER_PREFIX}${token}`;
        }
      } catch (error) {
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
