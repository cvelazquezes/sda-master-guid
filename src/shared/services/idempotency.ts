/**
 * Idempotency Service
 * Ensures operations can be safely retried following Stripe/PayPal patterns
 */

import { logger } from '../utils/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TIMING } from '../constants';

// ============================================================================
// Types
// ============================================================================

interface IdempotencyRecord<T = any> {
  key: string;
  result: T;
  timestamp: number;
  expiresAt: number;
}

// ============================================================================
// Idempotency Service
// ============================================================================

class IdempotencyService {
  private memoryCache = new Map<string, IdempotencyRecord>();
  private readonly STORAGE_KEY_PREFIX = '@idempotency:';
  private readonly DEFAULT_TTL = 3600; // 1 hour in seconds
  private readonly MAX_MEMORY_CACHE_SIZE = 100;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
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
    ttlSeconds: number = this.DEFAULT_TTL
  ): Promise<T> {
    // Validate key
    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      throw new Error('Idempotency key must be a non-empty string');
    }

    // Check memory cache first
    const cachedRecord = await this.get<T>(idempotencyKey);
    if (cachedRecord) {
      logger.debug(`Idempotency: Returning cached result for key: ${idempotencyKey}`);
      return cachedRecord.result;
    }

    // Execute operation
    logger.debug(`Idempotency: Executing operation for key: ${idempotencyKey}`);
    
    try {
      const result = await operation();

      // Store result
      await this.set(idempotencyKey, result, ttlSeconds);

      return result;
    } catch (error) {
      logger.error(`Idempotency: Operation failed for key: ${idempotencyKey}`, error as Error);
      throw error;
    }
  }

  /**
   * Stores a result with idempotency key
   */
  private async set<T>(
    key: string,
    result: T,
    ttlSeconds: number
  ): Promise<void> {
    const now = Date.now();
    const expiresAt = now + ttlSeconds * 1000;

    const record: IdempotencyRecord<T> = {
      key,
      result,
      timestamp: now,
      expiresAt,
    };

    // Store in memory cache
    this.memoryCache.set(key, record);

    // Limit memory cache size
    if (this.memoryCache.size > this.MAX_MEMORY_CACHE_SIZE) {
      this.evictOldest();
    }

    // Store in persistent storage
    try {
      await AsyncStorage.setItem(
        this.getStorageKey(key),
        JSON.stringify(record)
      );
    } catch (error) {
      logger.warn('Failed to store idempotency key in persistent storage', error as Error);
      // Continue anyway - memory cache will work
    }
  }

  /**
   * Retrieves a cached result
   */
  private async get<T>(key: string): Promise<IdempotencyRecord<T> | null> {
    const now = Date.now();

    // Check memory cache first
    const memoryRecord = this.memoryCache.get(key);
    if (memoryRecord) {
      if (memoryRecord.expiresAt > now) {
        return memoryRecord as IdempotencyRecord<T>;
      } else {
        // Expired - remove it
        this.memoryCache.delete(key);
      }
    }

    // Check persistent storage
    try {
      const stored = await AsyncStorage.getItem(this.getStorageKey(key));
      if (stored) {
        const record = JSON.parse(stored) as IdempotencyRecord<T>;
        
        if (record.expiresAt > now) {
          // Still valid - add to memory cache
          this.memoryCache.set(key, record);
          return record;
        } else {
          // Expired - remove it
          await AsyncStorage.removeItem(this.getStorageKey(key));
        }
      }
    } catch (error) {
      logger.warn('Failed to retrieve idempotency key from persistent storage', error as Error);
    }

    return null;
  }

  /**
   * Checks if a key exists (without returning the result)
   */
  async has(key: string): Promise<boolean> {
    const record = await this.get(key);
    return record !== null;
  }

  /**
   * Invalidates an idempotency key
   */
  async invalidate(key: string): Promise<void> {
    this.memoryCache.delete(key);

    try {
      await AsyncStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      logger.warn('Failed to remove idempotency key from persistent storage', error as Error);
    }
  }

  /**
   * Clears all idempotency records
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();

    try {
      const keys = await AsyncStorage.getAllKeys();
      const idempotencyKeys = keys.filter((k) =>
        k.startsWith(this.STORAGE_KEY_PREFIX)
      );
      await AsyncStorage.multiRemove(idempotencyKeys);
    } catch (error) {
      logger.warn('Failed to clear idempotency keys from persistent storage', error as Error);
    }
  }

  /**
   * Evicts oldest entries from memory cache
   */
  private evictOldest(): void {
    const entries = Array.from(this.memoryCache.entries());
    
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest 10%
    const toRemove = Math.floor(this.MAX_MEMORY_CACHE_SIZE * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.memoryCache.delete(entries[i][0]);
    }

    logger.debug(`Idempotency: Evicted ${toRemove} oldest entries`);
  }

  /**
   * Cleanup expired entries periodically
   */
  private startCleanupInterval(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, TIMING.CACHE.MEDIUM);
  }

  /**
   * Removes expired entries
   */
  private async cleanup(): Promise<void> {
    const now = Date.now();
    let removedCount = 0;

    // Clean memory cache
    for (const [key, record] of this.memoryCache.entries()) {
      if (record.expiresAt <= now) {
        this.memoryCache.delete(key);
        removedCount++;
      }
    }

    // Clean persistent storage
    try {
      const keys = await AsyncStorage.getAllKeys();
      const idempotencyKeys = keys.filter((k) =>
        k.startsWith(this.STORAGE_KEY_PREFIX)
      );

      for (const storageKey of idempotencyKeys) {
        try {
          const stored = await AsyncStorage.getItem(storageKey);
          if (stored) {
            const record = JSON.parse(stored) as IdempotencyRecord;
            if (record.expiresAt <= now) {
              await AsyncStorage.removeItem(storageKey);
              removedCount++;
            }
          }
        } catch {
          // Skip invalid entries
        }
      }
    } catch (error) {
      logger.warn('Failed to cleanup expired idempotency keys', error as Error);
    }

    if (removedCount > 0) {
      logger.debug(`Idempotency: Cleaned up ${removedCount} expired entries`);
    }
  }

  /**
   * Gets storage key for AsyncStorage
   */
  private getStorageKey(key: string): string {
    return `${this.STORAGE_KEY_PREFIX}${key}`;
  }

  /**
   * Gets statistics about the idempotency cache
   */
  getStats(): {
    memoryCacheSize: number;
    maxMemoryCacheSize: number;
  } {
    return {
      memoryCacheSize: this.memoryCache.size,
      maxMemoryCacheSize: this.MAX_MEMORY_CACHE_SIZE,
    };
  }

  /**
   * Stops the cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
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
export function generateIdempotencyKey(
  operation: string,
  ...params: any[]
): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 15);
  const paramString = params.map((p) => JSON.stringify(p)).join('-');
  
  return `${operation}-${paramString}-${timestamp}-${randomSuffix}`;
}

/**
 * Creates an idempotent wrapper for a function
 */
export function makeIdempotent<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttlSeconds?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    return await idempotencyService.execute(
      key,
      () => fn(...args),
      ttlSeconds
    );
  }) as T;
}

// ============================================================================
// Exports
// ============================================================================

export type { IdempotencyRecord };

