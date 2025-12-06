/**
 * Retry Policy with Exponential Backoff
 * Implements resilient API call retry logic
 */

import { logger } from '../logger';
import { NetworkError, TimeoutError } from '../errors';
import { RETRY_CONFIG } from '../../shared/constants/validation';
import { RETRYABLE_STATUS_CODES } from '../../shared/constants/http';
import { OPACITY_VALUE } from '../../shared/constants/numbers';

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableStatuses: readonly number[];
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: RETRY_CONFIG.MAX_ATTEMPTS,
  baseDelay: RETRY_CONFIG.INITIAL_DELAY_MS,
  maxDelay: RETRY_CONFIG.MAX_DELAY_MS,
  backoffMultiplier: RETRY_CONFIG.BACKOFF_MULTIPLIER,
  jitter: true,
  retryableStatuses: RETRYABLE_STATUS_CODES,
};

export class RetryPolicy {
  private options: RetryOptions;

  constructor(options: Partial<RetryOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Executes function with retry logic
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry if it's the last attempt
        if (attempt === this.options.maxRetries) {
          break;
        }

        // Check if error is retriable
        if (!this.isRetriable(error)) {
          throw error;
        }

        // Calculate delay and wait
        const delay = this.calculateDelay(attempt);
        logger.warn(`Retry attempt ${attempt + 1} after ${delay}ms`, { error });
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Checks if error is retriable
   */
  private isRetriable(error: unknown): boolean {
    // Network errors are retriable
    if (error instanceof NetworkError || error instanceof TimeoutError) {
      return true;
    }

    // Check HTTP status code
    if (this.isAxiosError(error)) {
      const status = error.response?.status;
      if (status && this.options.retryableStatuses.includes(status)) {
        return true;
      }
    }

    // ECONNRESET, ETIMEDOUT errors
    const errorCode = (error as { code?: string })?.code;
    if (errorCode === 'ECONNRESET' || errorCode === 'ETIMEDOUT') {
      return true;
    }

    return false;
  }

  /**
   * Calculates delay for retry with exponential backoff
   */
  private calculateDelay(attempt: number): number {
    const exponentialDelay = Math.min(
      this.options.baseDelay * Math.pow(this.options.backoffMultiplier, attempt),
      this.options.maxDelay
    );

    // Add jitter to prevent thundering herd (0.5 + 0-0.5 random)
    if (this.options.jitter) {
      return exponentialDelay * (OPACITY_VALUE.MEDIUM + Math.random() * OPACITY_VALUE.MEDIUM);
    }

    return exponentialDelay;
  }

  /**
   * Type guard for Axios errors
   */
  private isAxiosError(error: unknown): error is { response?: { status: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Global retry policy instance
export const retryPolicy = new RetryPolicy();
