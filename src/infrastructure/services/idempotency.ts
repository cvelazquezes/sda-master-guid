/**
 * Idempotency Service
 * Ensures operations can be safely retried following Stripe/PayPal patterns
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOG_MESSAGES, STORAGE_KEYS, TYPEOF } from '../../shared/constants';
import {
  TIME_UNIT,
  OPACITY_VALUE,
  ID_GENERATION,
  LIST_LIMITS,
} from '../../shared/constants/numbers';
import { CACHE } from '../../shared/constants/timing';
import { logger } from '../../shared/utils/logger';

// ============================================================================
// Types
// ============================================================================

type IdempotencyRecord<T = unknown> = {
  key: string;
  result: T;
  timestamp: number;
  expiresAt: number;
};

// ============================================================================
// Idempotency Service
// ============================================================================

class IdempotencyService {
  private _memoryCache: Map<string, IdempotencyRecord> = new Map<string, IdempotencyRecord>();
  private readonly _storageKeyPrefix: string = STORAGE_KEYS.IDEMPOTENCY.PREFIX;
  private readonly _defaultTtl: number = TIME_UNIT.SECONDS_PER_HOUR as number; // 1 hour in seconds
  private readonly _maxMemoryCacheSize: number = LIST_LIMITS.MAX_CACHE;
  private _cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this._startCleanupInterval();
  }

  /**
   * Executes an operation with idempotency guarantee
   *
   * If the operation was already executed with this key within the TTL,
   * returns the cached result instead of executing again.
   */
  async execute<T>(
    idempotencyKey: string,
    operation: () => Promise<T>,
    ttlSeconds: number = this._defaultTtl
  ): Promise<T> {
    // Validate key
    if (!idempotencyKey || typeof idempotencyKey !== TYPEOF.STRING) {
      throw new Error(LOG_MESSAGES.VALIDATION.IDEMPOTENCY_KEY_REQUIRED);
    }

    // Check memory cache first
    const cachedRecord = await this._get<T>(idempotencyKey);
    if (cachedRecord) {
      logger.debug(LOG_MESSAGES.IDEMPOTENCY.CACHED_RESULT(idempotencyKey));
      return cachedRecord.result;
    }

    // Execute operation
    logger.debug(LOG_MESSAGES.IDEMPOTENCY.EXECUTING(idempotencyKey));

    try {
      const result = await operation();

      // Store result
      await this._set(idempotencyKey, result, ttlSeconds);

      return result;
    } catch (error) {
      logger.error(LOG_MESSAGES.IDEMPOTENCY.OPERATION_FAILED(idempotencyKey), error as Error);
      throw error;
    }
  }

  /**
   * Stores a result with idempotency key
   */
  private async _set<T>(key: string, result: T, ttlSeconds: number): Promise<void> {
    const now = Date.now();
    const expiresAt = now + ttlSeconds * TIME_UNIT.MS_PER_SECOND;

    const record: IdempotencyRecord<T> = {
      key,
      result,
      timestamp: now,
      expiresAt,
    };

    // Store in memory cache
    this._memoryCache.set(key, record);

    // Limit memory cache size
    if (this._memoryCache.size > this._maxMemoryCacheSize) {
      this._evictOldest();
    }

    // Store in persistent storage
    try {
      await AsyncStorage.setItem(this._getStorageKey(key), JSON.stringify(record));
    } catch (error) {
      logger.warn(LOG_MESSAGES.IDEMPOTENCY.STORE_FAILED, error as Error);
      // Continue anyway - memory cache will work
    }
  }

  /**
   * Retrieves a cached result
   */
  private async _get<T>(key: string): Promise<IdempotencyRecord<T> | null> {
    const now = Date.now();

    // Check memory cache first
    const memoryRecord = this._memoryCache.get(key);
    if (memoryRecord) {
      if (memoryRecord.expiresAt > now) {
        return memoryRecord as IdempotencyRecord<T>;
      }
      // Expired - remove it
      this._memoryCache.delete(key);
    }

    // Check persistent storage
    try {
      const stored = await AsyncStorage.getItem(this._getStorageKey(key));
      if (stored) {
        const record = JSON.parse(stored) as IdempotencyRecord<T>;

        if (record.expiresAt > now) {
          // Still valid - add to memory cache
          this._memoryCache.set(key, record);
          return record;
        }
        // Expired - remove it
        await AsyncStorage.removeItem(this._getStorageKey(key));
      }
    } catch (error) {
      logger.warn(LOG_MESSAGES.IDEMPOTENCY.RETRIEVE_FAILED, error as Error);
    }

    return null;
  }

  /**
   * Checks if a key exists (without returning the result)
   */
  async has(key: string): Promise<boolean> {
    const record = await this._get(key);
    return record !== null;
  }

  /**
   * Invalidates an idempotency key
   */
  async invalidate(key: string): Promise<void> {
    this._memoryCache.delete(key);

    try {
      await AsyncStorage.removeItem(this._getStorageKey(key));
    } catch (error) {
      logger.warn(LOG_MESSAGES.IDEMPOTENCY.REMOVE_FAILED, error as Error);
    }
  }

  /**
   * Clears all idempotency records
   */
  async clear(): Promise<void> {
    this._memoryCache.clear();

    try {
      const keys = await AsyncStorage.getAllKeys();
      const idempotencyKeys = keys.filter((k) => k.startsWith(this._storageKeyPrefix));
      await AsyncStorage.multiRemove(idempotencyKeys);
    } catch (error) {
      logger.warn(LOG_MESSAGES.IDEMPOTENCY.CLEAR_FAILED, error as Error);
    }
  }

  /**
   * Evicts oldest entries from memory cache
   */
  private _evictOldest(): void {
    const entries = Array.from(this._memoryCache.entries());

    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest 10%
    const toRemove = Math.floor(this._maxMemoryCacheSize * OPACITY_VALUE.SUBTLE);
    for (let i = 0; i < toRemove; i++) {
      this._memoryCache.delete(entries[i][0]);
    }

    logger.debug(LOG_MESSAGES.IDEMPOTENCY.EVICTED(toRemove));
  }

  /**
   * Cleanup expired entries periodically
   */
  private _startCleanupInterval(): void {
    // Run cleanup every 5 minutes
    this._cleanupInterval = setInterval(() => {
      this._cleanup();
    }, CACHE.MEDIUM);
  }

  /**
   * Removes expired entries
   */
  private async _cleanup(): Promise<void> {
    const now = Date.now();
    let removedCount = 0;

    // Clean memory cache
    for (const [key, record] of this._memoryCache.entries()) {
      if (record.expiresAt <= now) {
        this._memoryCache.delete(key);
        removedCount++;
      }
    }

    // Clean persistent storage
    try {
      const keys = await AsyncStorage.getAllKeys();
      const idempotencyKeys = keys.filter((k) => k.startsWith(this._storageKeyPrefix));

      // Using Promise.all for parallel cleanup instead of sequential processing
      const results = await Promise.all(
        idempotencyKeys.map((storageKey) => this._cleanExpiredStorageKey(storageKey, now))
      );
      removedCount += results.filter(Boolean).length;
    } catch (error) {
      logger.warn(LOG_MESSAGES.IDEMPOTENCY.CLEANUP_FAILED, error as Error);
    }

    if (removedCount > 0) {
      logger.debug(LOG_MESSAGES.IDEMPOTENCY.CLEANED_UP(removedCount));
    }
  }

  /**
   * Cleans an expired storage key if applicable
   */
  private async _cleanExpiredStorageKey(storageKey: string, now: number): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (!stored) {
        return false;
      }

      const record = JSON.parse(stored) as IdempotencyRecord;
      if (record.expiresAt > now) {
        return false;
      }

      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch {
      // Skip invalid entries
      return false;
    }
  }

  /**
   * Gets storage key for AsyncStorage
   */
  private _getStorageKey(key: string): string {
    return `${this._storageKeyPrefix}${key}`;
  }

  /**
   * Gets statistics about the idempotency cache
   */
  getStats(): {
    memoryCacheSize: number;
    maxMemoryCacheSize: number;
  } {
    return {
      memoryCacheSize: this._memoryCache.size,
      maxMemoryCacheSize: this._maxMemoryCacheSize,
    };
  }

  /**
   * Stops the cleanup interval
   */
  destroy(): void {
    if (this._cleanupInterval) {
      clearInterval(this._cleanupInterval);
      this._cleanupInterval = null;
    }
  }
}

// ============================================================================
// Global Instance
// ============================================================================

export const idempotencyService = new IdempotencyService();

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generates a unique idempotency key
 */
export function generateIdempotencyKey(operation: string, ...params: unknown[]): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random()
    .toString(ID_GENERATION.RADIX)
    .substring(ID_GENERATION.SUBSTRING_START, ID_GENERATION.SUFFIX_LENGTH);
  const paramString = params.map((p) => JSON.stringify(p)).join('-');

  return `${operation}-${paramString}-${timestamp}-${randomSuffix}`;
}

/**
 * Creates an idempotent wrapper for a function
 */
export function makeIdempotent<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttlSeconds?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    return await idempotencyService.execute(key, () => fn(...args), ttlSeconds);
  }) as T;
}

// ============================================================================
// Exports
// ============================================================================

export type { IdempotencyRecord };
