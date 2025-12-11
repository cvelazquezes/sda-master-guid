/**
 * Request Batcher & Deduplication
 * Optimizes API calls by batching and deduplicating requests following DataLoader patterns
 */

/* eslint-disable max-classes-per-file -- Batcher and Deduplicator are co-located */

import { LOG_MESSAGES, ERROR_MESSAGES, DEDUP_KEY_PREFIX } from '../../shared/constants';
import { BATCH } from '../../shared/constants/numbers';
import { logger } from '../../shared/utils/logger';

// ============================================================================
// Types
// ============================================================================

type BatchFunction<K, V> = (keys: readonly K[]) => Promise<V[]>;

type BatchConfig = {
  maxBatchSize?: number;
  batchWindowMs?: number;
};

type PendingRequest<V> = {
  resolve: (value: V) => void;
  reject: (error: Error) => void;
};

// ============================================================================
// Request Batcher (DataLoader Pattern)
// ============================================================================

export class RequestBatcher<K = string, V = unknown> {
  private _queue: K[] = [];
  private _pending: Map<K, Array<PendingRequest<V>>> = new Map<K, Array<PendingRequest<V>>>();
  private _batchTimeout: NodeJS.Timeout | null = null;

  private readonly _maxBatchSize: number;
  private readonly _batchWindowMs: number;
  private readonly _batchFn: BatchFunction<K, V>;

  constructor(batchFn: BatchFunction<K, V>, config: BatchConfig = {}) {
    this._batchFn = batchFn;
    this._maxBatchSize = config.maxBatchSize || BATCH.DEFAULT_SIZE;
    this._batchWindowMs = config.batchWindowMs || BATCH.WINDOW_MS;
  }

  /**
   * Loads a value for a key (batches automatically)
   */
  async load(key: K): Promise<V> {
    // Check if already pending
    const existing = this._pending.get(key);

    if (existing) {
      // Request already in flight, piggyback on it
      return new Promise<V>((resolve, reject) => {
        existing.push({ resolve, reject });
      });
    }

    // Add to queue
    return new Promise<V>((resolve, reject) => {
      this._queue.push(key);
      this._pending.set(key, [{ resolve, reject }]);

      // Schedule batch if not already scheduled
      if (!this._batchTimeout) {
        this._scheduleBatch();
      }

      // Execute immediately if batch is full
      if (this._queue.length >= this._maxBatchSize) {
        this._executeBatch();
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
  private _scheduleBatch(): void {
    this._batchTimeout = setTimeout(() => {
      this._executeBatch();
    }, this._batchWindowMs);
  }

  /**
   * Executes the current batch
   */
  private async _executeBatch(): Promise<void> {
    // Clear timeout
    if (this._batchTimeout) {
      clearTimeout(this._batchTimeout);
      this._batchTimeout = null;
    }

    // Nothing to do
    if (this._queue.length === 0) {
      return;
    }

    // Get current batch
    const batchKeys = this._queue.splice(0, this._maxBatchSize);
    const batchPending = new Map<K, Array<PendingRequest<V>>>();

    // Collect pending requests
    for (const key of batchKeys) {
      const requests = this._pending.get(key);
      if (requests) {
        batchPending.set(key, requests);
        this._pending.delete(key);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument -- LOG_MESSAGES function is properly typed
    logger.debug(LOG_MESSAGES.REQUEST_BATCHER.EXECUTING_BATCH(batchKeys.length));

    try {
      // Execute batch function
      const results = await this._batchFn(batchKeys);

      // Validate results
      if (results.length !== batchKeys.length) {
        throw new Error(
          ERROR_MESSAGES.REQUEST_BATCHER.BATCH_SIZE_MISMATCH(results.length, batchKeys.length)
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
      logger.error(LOG_MESSAGES.REQUEST_BATCHER.BATCH_FAILED, error as Error);

      // Reject all pending requests
      batchPending.forEach((requests) => {
        requests.forEach((req) => req.reject(error as Error));
      });
    }

    // Schedule next batch if queue not empty
    if (this._queue.length > 0 && !this._batchTimeout) {
      this._scheduleBatch();
    }
  }

  /**
   * Clears all pending requests
   */
  clear(): void {
    if (this._batchTimeout) {
      clearTimeout(this._batchTimeout);
      this._batchTimeout = null;
    }

    this._queue = [];

    // Reject all pending
    this._pending.forEach((requests) => {
      requests.forEach((req) =>
        req.reject(new Error(ERROR_MESSAGES.REQUEST_BATCHER.BATCH_CLEARED))
      );
    });

    this._pending.clear();
  }

  /**
   * Gets statistics
   */
  getStats(): {
    queueSize: number;
    pendingKeys: number;
  } {
    return {
      queueSize: this._queue.length,
      pendingKeys: this._pending.size,
    };
  }
}

// ============================================================================
// Request Deduplicator
// ============================================================================

export class RequestDeduplicator<T = unknown> {
  private _inFlight: Map<string, Promise<T>> = new Map<string, Promise<T>>();

  /**
   * Deduplicates requests with the same key
   * If a request is already in flight, returns the existing promise
   */
  async dedupe(key: string, requestFn: () => Promise<T>): Promise<T> {
    // Check if request already in flight
    const existing = this._inFlight.get(key);

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument -- LOG_MESSAGES function is properly typed
      logger.debug(LOG_MESSAGES.REQUEST_BATCHER.REQUEST_DEDUPLICATED(key));
      return existing;
    }

    // Execute new request
    const promise = requestFn().finally(() => {
      // Remove from in-flight once completed
      this._inFlight.delete(key);
    });

    this._inFlight.set(key, promise);
    return promise;
  }

  /**
   * Checks if a request is in flight
   */
  isInFlight(key: string): boolean {
    return this._inFlight.has(key);
  }

  /**
   * Clears a specific request
   */
  clear(key: string): void {
    this._inFlight.delete(key);
  }

  /**
   * Clears all requests
   */
  clearAll(): void {
    this._inFlight.clear();
  }

  /**
   * Gets statistics
   */
  getStats(): {
    inFlightCount: number;
  } {
    return {
      inFlightCount: this._inFlight.size,
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
export function createDedupedFunction<T extends (...args: unknown[]) => Promise<unknown>>(
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
export function withDeduplication<T>(fn: () => Promise<T>, key: string): Promise<T> {
  return requestDeduplicator.dedupe(key, fn);
}

// ============================================================================
// Examples & Patterns
// ============================================================================

/**
 * Example: Batch load users by IDs
 */
export function createUserBatchLoader<T extends { id: string }>(
  fetchUsers: (ids: string[]) => Promise<T[]>
): (id: string) => Promise<T | undefined> {
  return createBatchLoader(
    async (ids: readonly string[]) => {
      const users = await fetchUsers([...ids]);

      // Ensure order matches input
      const userMap = new Map(users.map((u) => [u.id, u]));
      return ids.map((id) => userMap.get(id)).filter((u): u is T => u !== undefined);
    },
    {
      maxBatchSize: BATCH.USER_BATCH_SIZE,
      batchWindowMs: BATCH.WINDOW_MS,
    }
  );
}

/**
 * Example: Deduplicate API calls
 */
export async function fetchUserWithDedup<T>(
  userId: string,
  apiFn: (id: string) => Promise<T>
): Promise<T> {
  return withDeduplication(() => apiFn(userId), `${DEDUP_KEY_PREFIX.USER}${userId}`);
}
