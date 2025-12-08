/**
 * Rate Limiting Service
 * Implements token bucket algorithm following Stripe/AWS API Gateway patterns
 */

import { logger } from '../../shared/utils/logger';
import { MS, LIST_LIMITS } from '../../shared/constants/numbers';
import { ERROR_MESSAGES, ERROR_NAME, LOG_MESSAGES, RATE_LIMITER_NAME } from '../../shared/constants';

// Rate limit configuration constants
// Note: Using literal values to avoid module initialization order issues
const RATE_LIMIT_CONFIG = {
  API_REQUESTS_PER_MIN: LIST_LIMITS.MAX_CACHE, // 100
  AUTH_ATTEMPTS_PER_MIN: 5,
  SEARCH_REQUESTS_PER_MIN: 30,
  HEAVY_OPS_PER_MIN: 10,
  ONE_MINUTE_MS: MS.MINUTE, // 60000
} as const;

// ============================================================================
// Types
// ============================================================================

export interface RateLimitOptions {
  tokensPerInterval: number;
  interval: number; // in milliseconds
  maxTokens?: number;
}

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number;
}

// ============================================================================
// Rate Limiter (Token Bucket Algorithm)
// ============================================================================

export class RateLimiter {
  private buckets = new Map<string, RateLimitBucket>();
  private options: Required<RateLimitOptions>;

  constructor(options: RateLimitOptions) {
    this.options = {
      tokensPerInterval: options.tokensPerInterval,
      interval: options.interval,
      maxTokens: options.maxTokens || options.tokensPerInterval,
    };
  }

  /**
   * Attempts to consume tokens from the bucket
   * Returns true if tokens are available, false if rate limited
   */
  async tryConsume(key: string, tokensNeeded: number = 1): Promise<boolean> {
    const bucket = this.getOrCreateBucket(key);

    // Refill tokens based on time passed
    this.refillBucket(bucket);

    // Check if enough tokens available
    if (bucket.tokens >= tokensNeeded) {
      bucket.tokens -= tokensNeeded;
      return true;
    }

    return false;
  }

  /**
   * Waits until tokens are available (blocking)
   */
  async consume(key: string, tokensNeeded: number = 1): Promise<void> {
    while (!(await this.tryConsume(key, tokensNeeded))) {
      // Calculate wait time
      const bucket = this.buckets.get(key);
      if (!bucket) {
        continue;
      }
      const tokensNeededToRefill = tokensNeeded - bucket.tokens;
      const timeToWait = (tokensNeededToRefill / this.options.refillRate) * MS.SECOND;

      logger.debug(LOG_MESSAGES.RATE_LIMIT.WAITING(timeToWait));
      await this.sleep(Math.min(timeToWait, this.options.interval));
    }
  }

  /**
   * Gets or creates a bucket for a key
   */
  private getOrCreateBucket(key: string): RateLimitBucket {
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.options.maxTokens,
        lastRefill: Date.now(),
        maxTokens: this.options.maxTokens,
        refillRate: this.options.tokensPerInterval / this.options.interval,
      };
      this.buckets.set(key, bucket);
    }

    return bucket;
  }

  /**
   * Refills bucket based on time elapsed
   */
  private refillBucket(bucket: RateLimitBucket): void {
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;

    if (timePassed > 0) {
      const tokensToAdd = (timePassed / MS.SECOND) * bucket.refillRate;
      bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  /**
   * Gets remaining tokens for a key
   */
  getTokens(key: string): number {
    const bucket = this.buckets.get(key);
    if (!bucket) {
      return this.options.maxTokens;
    }

    this.refillBucket(bucket);
    return Math.floor(bucket.tokens);
  }

  /**
   * Resets rate limit for a key
   */
  reset(key: string): void {
    this.buckets.delete(key);
  }

  /**
   * Clears all rate limits
   */
  clear(): void {
    this.buckets.clear();
  }

  /**
   * Gets statistics
   */
  getStats(): {
    trackedKeys: number;
    options: Required<RateLimitOptions>;
  } {
    return {
      trackedKeys: this.buckets.size,
      options: this.options,
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// Rate Limit Service (Global Management)
// ============================================================================

class RateLimitService {
  private limiters = new Map<string, RateLimiter>();

  /**
   * Creates or gets a rate limiter
   */
  getLimiter(name: string, options?: RateLimitOptions): RateLimiter {
    let limiter = this.limiters.get(name);

    if (!limiter) {
      if (!options) {
        throw new Error(LOG_MESSAGES.RATE_LIMIT.NOT_FOUND_ERROR(name));
      }
      limiter = new RateLimiter(options);
      this.limiters.set(name, limiter);
    }

    return limiter;
  }

  /**
   * Tries to consume from a named limiter
   */
  async tryConsume(limiterName: string, key: string, tokensNeeded: number = 1): Promise<boolean> {
    const limiter = this.limiters.get(limiterName);
    if (!limiter) {
      logger.warn(LOG_MESSAGES.RATE_LIMIT.NOT_FOUND(limiterName));
      return true; // Allow if limiter not configured
    }

    return await limiter.tryConsume(key, tokensNeeded);
  }

  /**
   * Removes a rate limiter
   */
  removeLimiter(name: string): void {
    this.limiters.delete(name);
  }

  /**
   * Clears all rate limiters
   */
  clear(): void {
    this.limiters.clear();
  }
}

// ============================================================================
// Global Instance & Default Limiters
// ============================================================================

export const rateLimitService = new RateLimitService();

// API request limiter - 100 requests per minute
export const apiRateLimiter = rateLimitService.getLimiter(RATE_LIMITER_NAME.API, {
  tokensPerInterval: RATE_LIMIT_CONFIG.API_REQUESTS_PER_MIN,
  interval: RATE_LIMIT_CONFIG.ONE_MINUTE_MS,
  maxTokens: RATE_LIMIT_CONFIG.API_REQUESTS_PER_MIN,
});

// Auth limiter - 5 attempts per minute
export const authRateLimiter = rateLimitService.getLimiter(RATE_LIMITER_NAME.AUTH, {
  tokensPerInterval: RATE_LIMIT_CONFIG.AUTH_ATTEMPTS_PER_MIN,
  interval: RATE_LIMIT_CONFIG.ONE_MINUTE_MS,
  maxTokens: RATE_LIMIT_CONFIG.AUTH_ATTEMPTS_PER_MIN,
});

// Search limiter - 30 requests per minute
export const searchRateLimiter = rateLimitService.getLimiter(RATE_LIMITER_NAME.SEARCH, {
  tokensPerInterval: RATE_LIMIT_CONFIG.SEARCH_REQUESTS_PER_MIN,
  interval: RATE_LIMIT_CONFIG.ONE_MINUTE_MS,
  maxTokens: RATE_LIMIT_CONFIG.SEARCH_REQUESTS_PER_MIN,
});

// Heavy operations limiter - 10 per minute
export const heavyOperationsLimiter = rateLimitService.getLimiter(RATE_LIMITER_NAME.HEAVY, {
  tokensPerInterval: RATE_LIMIT_CONFIG.HEAVY_OPS_PER_MIN,
  interval: RATE_LIMIT_CONFIG.ONE_MINUTE_MS,
  maxTokens: RATE_LIMIT_CONFIG.HEAVY_OPS_PER_MIN,
});

// ============================================================================
// Decorator for Rate Limiting
// ============================================================================

/**
 * Decorator to add rate limiting to a method
 */
export function rateLimit(
  limiterName: string,
  keyExtractor: (...args: unknown[]) => string = () => RATE_LIMITER_NAME.DEFAULT
) {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const key = keyExtractor(...args);
      const allowed = await rateLimitService.tryConsume(limiterName, key);

      if (!allowed) {
        throw new RateLimitError(LOG_MESSAGES.RATE_LIMIT.EXCEEDED(propertyKey));
      }

      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// ============================================================================
// Errors
// ============================================================================

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ERROR_NAME.RATE_LIMIT_ERROR;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Wraps a function with rate limiting
 */
export function withRateLimit<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  limiter: RateLimiter,
  keyExtractor: (...args: Parameters<T>) => string = () => RATE_LIMITER_NAME.DEFAULT
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyExtractor(...args);
    const allowed = await limiter.tryConsume(key);

    if (!allowed) {
      throw new RateLimitError(ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS);
    }

    return await fn(...args);
  }) as T;
}

/**
 * Creates a per-user rate limiter
 */
export function createUserRateLimiter(
  requestsPerMinute: number
): (userId: string) => Promise<boolean> {
  const limiter = new RateLimiter({
    tokensPerInterval: requestsPerMinute,
    interval: RATE_LIMIT_CONFIG.ONE_MINUTE_MS,
  });

  return async (userId: string) => {
    return await limiter.tryConsume(userId);
  };
}

/**
 * Creates a per-IP rate limiter
 */
export function createIPRateLimiter(
  requestsPerMinute: number
): (ipAddress: string) => Promise<boolean> {
  const limiter = new RateLimiter({
    tokensPerInterval: requestsPerMinute,
    interval: RATE_LIMIT_CONFIG.ONE_MINUTE_MS,
  });

  return async (ipAddress: string) => {
    return await limiter.tryConsume(ipAddress);
  };
}
