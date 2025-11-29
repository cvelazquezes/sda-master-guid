/**
 * Request Batcher & Deduplication
 * Optimizes API calls by batching and deduplicating requests following DataLoader patterns
 */

import { logger } from '../utils/logger';

// ============================================================================
// Types
// ============================================================================

type BatchFunction<K, V> = (keys: readonly K[]) => Promise<V[]>;

interface BatchConfig {
  maxBatchSize?: number;
  batchWindowMs?: number;
}

interface PendingRequest<V> {
  resolve: (value: V) => void;
  reject: (error: Error) => void;
}

// ============================================================================
// Request Batcher (DataLoader Pattern)
// ============================================================================

export class RequestBatcher<K = string, V = any> {
  private queue: K[] = [];
  private pending = new Map<K, PendingRequest<V>[]>();
  private batchTimeout: NodeJS.Timeout | null = null;
  
  private readonly maxBatchSize: number;
  private readonly batchWindowMs: number;
  private readonly batchFn: BatchFunction<K, V>;

  constructor(
    batchFn: BatchFunction<K, V>,
    config: BatchConfig = {}
  ) {
    this.batchFn = batchFn;
    this.maxBatchSize = config.maxBatchSize || 100;
    this.batchWindowMs = config.batchWindowMs || 10;
  }

  /**
   * Loads a value for a key (batches automatically)
   */
  async load(key: K): Promise<V> {
    // Check if already pending
    const existing = this.pending.get(key);
    
    if (existing) {
      // Request already in flight, piggyback on it
      return new Promise<V>((resolve, reject) => {
        existing.push({ resolve, reject });
      });
    }

    // Add to queue
    return new Promise<V>((resolve, reject) => {
      this.queue.push(key);
      this.pending.set(key, [{ resolve, reject }]);

      // Schedule batch if not already scheduled
      if (!this.batchTimeout) {
        this.scheduleBatch();
      }

      // Execute immediately if batch is full
      if (this.queue.length >= this.maxBatchSize) {
        this.executeBatch();
      }
    });
  }

  /**
   * Loads multiple values (batches automatically)
   */
  async loadMany(keys: readonly K[]): Promise<V[]> {
    return Promise.all(keys.map((key) => this.load(key)));
  }

  /**
   * Schedules a batch execution
   */
  private scheduleBatch(): void {
    this.batchTimeout = setTimeout(() => {
      this.executeBatch();
    }, this.batchWindowMs);
  }

  /**
   * Executes the current batch
   */
  private async executeBatch(): Promise<void> {
    // Clear timeout
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    // Nothing to do
    if (this.queue.length === 0) {
      return;
    }

    // Get current batch
    const batchKeys = this.queue.splice(0, this.maxBatchSize);
    const batchPending = new Map<K, PendingRequest<V>[]>();

    // Collect pending requests
    for (const key of batchKeys) {
      const requests = this.pending.get(key);
      if (requests) {
        batchPending.set(key, requests);
        this.pending.delete(key);
      }
    }

    logger.debug(`Executing batch of ${batchKeys.length} requests`);

    try {
      // Execute batch function
      const results = await this.batchFn(batchKeys);

      // Validate results
      if (results.length !== batchKeys.length) {
        throw new Error(
          `Batch function returned ${results.length} results for ${batchKeys.length} keys`
        );
      }

      // Resolve all pending requests
      batchKeys.forEach((key, index) => {
        const requests = batchPending.get(key);
        if (requests) {
          const result = results[index];
          requests.forEach((req) => req.resolve(result));
        }
      });
    } catch (error) {
      logger.error('Batch execution failed', error as Error);

      // Reject all pending requests
      batchPending.forEach((requests) => {
        requests.forEach((req) => req.reject(error as Error));
      });
    }

    // Schedule next batch if queue not empty
    if (this.queue.length > 0 && !this.batchTimeout) {
      this.scheduleBatch();
    }
  }

  /**
   * Clears all pending requests
   */
  clear(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    
    this.queue = [];
    
    // Reject all pending
    this.pending.forEach((requests) => {
      requests.forEach((req) =>
        req.reject(new Error('Batch cleared'))
      );
    });
    
    this.pending.clear();
  }

  /**
   * Gets statistics
   */
  getStats(): {
    queueSize: number;
    pendingKeys: number;
  } {
    return {
      queueSize: this.queue.length,
      pendingKeys: this.pending.size,
    };
  }
}

// ============================================================================
// Request Deduplicator
// ============================================================================

export class RequestDeduplicator<T = any> {
  private inFlight = new Map<string, Promise<T>>();

  /**
   * Deduplicates requests with the same key
   * If a request is already in flight, returns the existing promise
   */
  async dedupe(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // Check if request already in flight
    const existing = this.inFlight.get(key);
    
    if (existing) {
      logger.debug(`Request deduplicated: ${key}`);
      return existing;
    }

    // Execute new request
    const promise = requestFn()
      .finally(() => {
        // Remove from in-flight once completed
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * Checks if a request is in flight
   */
  isInFlight(key: string): boolean {
    return this.inFlight.has(key);
  }

  /**
   * Clears a specific request
   */
  clear(key: string): void {
    this.inFlight.delete(key);
  }

  /**
   * Clears all requests
   */
  clearAll(): void {
    this.inFlight.clear();
  }

  /**
   * Gets statistics
   */
  getStats(): {
    inFlightCount: number;
  } {
    return {
      inFlightCount: this.inFlight.size,
    };
  }
}

// ============================================================================
// Global Instances
// ============================================================================

/**
 * Global request deduplicator
 */
export const requestDeduplicator = new RequestDeduplicator();

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a batched loader function
 */
export function createBatchLoader<K, V>(
  batchLoadFn: (keys: readonly K[]) => Promise<V[]>,
  config?: BatchConfig
): (key: K) => Promise<V> {
  const batcher = new RequestBatcher<K, V>(batchLoadFn, config);
  return (key: K) => batcher.load(key);
}

/**
 * Creates a deduplicated function
 */
export function createDedupedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyExtractor: (...args: Parameters<T>) => string
): T {
  const deduplicator = new RequestDeduplicator<ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyExtractor(...args);
    return deduplicator.dedupe(key, () => fn(...args));
  }) as T;
}

/**
 * Wraps a function with deduplication
 */
export function withDeduplication<T>(
  fn: () => Promise<T>,
  key: string
): Promise<T> {
  return requestDeduplicator.dedupe(key, fn);
}

// ============================================================================
// Examples & Patterns
// ============================================================================

/**
 * Example: Batch load users by IDs
 */
export function createUserBatchLoader(
  fetchUsers: (ids: string[]) => Promise<any[]>
): (id: string) => Promise<any> {
  return createBatchLoader(
    async (ids: readonly string[]) => {
      const users = await fetchUsers([...ids]);
      
      // Ensure order matches input
      const userMap = new Map(users.map((u) => [u.id, u]));
      return ids.map((id) => userMap.get(id)!);
    },
    {
      maxBatchSize: 50,
      batchWindowMs: 10,
    }
  );
}

/**
 * Example: Deduplicate API calls
 */
export async function fetchUserWithDedup(
  userId: string,
  apiFn: (id: string) => Promise<any>
): Promise<any> {
  return withDeduplication(
    () => apiFn(userId),
    `user:${userId}`
  );
}

