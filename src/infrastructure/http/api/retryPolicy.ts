/**
 * Retry Policy with Exponential Backoff
 * Implements resilient API call retry logic
 */

import { LOG_MESSAGES, TYPEOF, AXIOS_ERROR_CODE, OBJECT_PROPERTY } from '../../../shared/constants';
import { RETRYABLE_STATUS_CODES } from '../../../shared/constants/http';
import { OPACITY_VALUE } from '../../../shared/constants/numbers';
import { RETRY_CONFIG } from '../../../shared/constants/validation';
import { NetworkError, TimeoutError } from '../../../shared/utils/errors';
import { logger } from '../../../shared/utils/logger';

type RetryOptions = {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableStatuses: number[];
};

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: RETRY_CONFIG.MAX_ATTEMPTS,
  baseDelay: RETRY_CONFIG.INITIAL_DELAY_MS,
  maxDelay: RETRY_CONFIG.MAX_DELAY_MS,
  backoffMultiplier: RETRY_CONFIG.BACKOFF_MULTIPLIER,
  jitter: true,
  retryableStatuses: [...RETRYABLE_STATUS_CODES],
};

export class RetryPolicy {
  private _options: RetryOptions;

  constructor(options: Partial<RetryOptions> = {}) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Executes function with retry logic
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this._options.maxRetries; attempt++) {
      try {
        // eslint-disable-next-line no-await-in-loop -- Sequential retry attempts require awaiting each call before deciding to retry
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry if it's the last attempt
        if (attempt === this._options.maxRetries) {
          break;
        }

        // Check if error is retriable
        if (!this._isRetriable(error)) {
          throw error;
        }

        // Calculate delay and wait
        const delay = this._calculateDelay(attempt);
        logger.warn(LOG_MESSAGES.FORMATTED.RETRY_ATTEMPT(attempt + 1, this._options.maxRetries), {
          error,
          delay,
        });
        // eslint-disable-next-line no-await-in-loop -- Intentional delay between retry attempts
        await this._sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Checks if error is retriable
   */
  private _isRetriable(error: unknown): boolean {
    // Network errors are retriable
    if (error instanceof NetworkError || error instanceof TimeoutError) {
      return true;
    }

    // Check HTTP status code
    if (this._isAxiosError(error)) {
      const status = error.response?.status;
      if (status && this._options.retryableStatuses.includes(status)) {
        return true;
      }
    }

    // ECONNRESET, ETIMEDOUT errors
    const errorCode = (error as { code?: string })?.code;
    if (errorCode === AXIOS_ERROR_CODE.ECONNRESET || errorCode === AXIOS_ERROR_CODE.ETIMEDOUT) {
      return true;
    }

    return false;
  }

  /**
   * Calculates delay for retry with exponential backoff
   */
  private _calculateDelay(attempt: number): number {
    const exponentialDelay = Math.min(
      this._options.baseDelay * Math.pow(this._options.backoffMultiplier, attempt),
      this._options.maxDelay
    );

    // Add jitter to prevent thundering herd
    if (this._options.jitter) {
      return exponentialDelay * (OPACITY_VALUE.MEDIUM + Math.random() * OPACITY_VALUE.MEDIUM);
    }

    return exponentialDelay;
  }

  /**
   * Type guard for Axios errors
   */
  private _isAxiosError(error: unknown): error is { response?: { status: number } } {
    return typeof error === TYPEOF.OBJECT && error !== null && OBJECT_PROPERTY.RESPONSE in error;
  }

  /**
   * Sleep helper
   */
  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

// Global retry policy instance
export const retryPolicy = new RetryPolicy();
