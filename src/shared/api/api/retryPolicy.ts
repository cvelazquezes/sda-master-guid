/**
 * Retry Policy with Exponential Backoff
 * Implements resilient API call retry logic
 */

import { logger } from '../../utils/logger';
import { NetworkError, TimeoutError } from '../../utils/errors';
import { BUSINESS_RULES } from '../../constants';
import { OPACITY_VALUE } from '../../constants/numbers';

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableStatuses: number[];
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: BUSINESS_RULES.MAX_RETRY_ATTEMPTS,
  baseDelay: BUSINESS_RULES.RETRY_BASE_DELAY_MS,
  maxDelay: BUSINESS_RULES.RETRY_MAX_DELAY_MS,
  backoffMultiplier: BUSINESS_RULES.RETRY_BACKOFF_MULTIPLIER,
  jitter: true,
  retryableStatuses: [...BUSINESS_RULES.RETRYABLE_HTTP_STATUSES],
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

    // Add jitter to prevent thundering herd
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
