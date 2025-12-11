/**
 * Offline Support Service
 * Handles offline queue and synchronization following Progressive Web App patterns
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { addBreadcrumb } from './sentry';
import {
  LOG_MESSAGES,
  STORAGE_KEYS,
  OFFLINE_OPERATIONS,
  NETWORK_STATUS,
  HTTP_METHOD,
  HEADER,
  BREADCRUMB_CATEGORY,
  BREADCRUMB_LEVEL,
  type NetworkStatusType,
  type HttpMethodType,
} from '../../shared/constants';
import { LIST_LIMITS, ID_GENERATION } from '../../shared/constants/numbers';
import { POLLING } from '../../shared/constants/timing';
import { logger } from '../../shared/utils/logger';

// ============================================================================
// React Hooks
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type QueuedRequest = {
  id: string;
  url: string;
  method: HttpMethodType;
  data?: unknown;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
};

export type NetworkStatus = NetworkStatusType;

export type OfflineQueueStats = {
  totalQueued: number;
  pendingSync: number;
  lastSyncAttempt: number | null;
  isOnline: boolean;
};

// ============================================================================
// Offline Queue Service
// ============================================================================

class OfflineService {
  private _queue: QueuedRequest[] = [];
  private readonly _storageKey: string = STORAGE_KEYS.OFFLINE.QUEUE;
  private readonly _maxQueueSize: number = LIST_LIMITS.MAX_QUEUE;
  private _isOnline: boolean = true;
  private _isSyncing: boolean = false;
  private _listeners: Set<(status: NetworkStatus) => void> = new Set<
    (status: NetworkStatus) => void
  >();
  private _unsubscribeNetInfo: (() => void) | null = null;

  constructor() {
    this._initialize();
  }

  /**
   * Initializes the offline service
   */
  private async _initialize(): Promise<void> {
    // Load queue from storage
    await this._loadQueue();

    // Subscribe to network state
    this._unsubscribeNetInfo = NetInfo.addEventListener(this._handleNetworkChange);

    // Check initial network state
    const state = await NetInfo.fetch();
    this._handleNetworkChange(state);

    logger.info(LOG_MESSAGES.OFFLINE.INITIALIZED, {
      queueSize: this._queue.length,
      isOnline: this._isOnline,
    });
  }

  /**
   * Handles network state changes
   */
  // eslint-disable-next-line @typescript-eslint/typedef -- Arrow function has inline return type
  private _handleNetworkChange = (state: NetInfoState): void => {
    const wasOnline = this._isOnline;
    this._isOnline = state.isConnected ?? false;

    const status: NetworkStatus = state.isConnected
      ? NETWORK_STATUS.ONLINE
      : state.isConnected === false
        ? NETWORK_STATUS.OFFLINE
        : NETWORK_STATUS.UNKNOWN;

    logger.info(LOG_MESSAGES.OFFLINE.NETWORK_STATUS_CHANGED, {
      status,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
    });

    addBreadcrumb(
      LOG_MESSAGES.OFFLINE.NETWORK_CHANGED,
      BREADCRUMB_CATEGORY.NETWORK,
      BREADCRUMB_LEVEL.INFO,
      {
        status,
        type: state.type,
      }
    );

    // Notify listeners
    this._notifyListeners(status);

    // Attempt sync when coming online
    if (!wasOnline && this._isOnline && this._queue.length > 0) {
      logger.info(LOG_MESSAGES.OFFLINE.BACK_ONLINE);
      this.syncQueue();
    }
  };

  /**
   * Adds a request to the offline queue
   */
  async enqueue(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    if (this._queue.length >= this._maxQueueSize) {
      logger.warn(LOG_MESSAGES.OFFLINE.QUEUE_FULL);
      this._queue.shift();
    }

    const queuedRequest: QueuedRequest = {
      ...request,
      id: this._generateId(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    this._queue.push(queuedRequest);
    await this._saveQueue();

    logger.debug(LOG_MESSAGES.OFFLINE.REQUEST_QUEUED, {
      id: queuedRequest.id,
      method: queuedRequest.method,
      url: queuedRequest.url,
    });

    // Try to sync if online
    if (this._isOnline && !this._isSyncing) {
      this.syncQueue();
    }
  }

  /**
   * Syncs the offline queue
   */
  async syncQueue(): Promise<void> {
    if (this._isSyncing || !this._isOnline || this._queue.length === 0) {
      return;
    }

    this._isSyncing = true;
    logger.info(LOG_MESSAGES.OFFLINE.SYNC_STARTED, { queueSize: this._queue.length });

    const requestsToSync = [...this._queue];
    const failedRequests: QueuedRequest[] = [];

    for (const request of requestsToSync) {
      try {
        // eslint-disable-next-line no-await-in-loop -- Sequential request processing to maintain order and handle failures individually
        await this._executeRequest(request);

        // Remove from queue on success
        this._queue = this._queue.filter((r) => r.id !== request.id);

        logger.debug(LOG_MESSAGES.OFFLINE.REQUEST_SYNCED, { id: request.id });
      } catch (error) {
        logger.error(LOG_MESSAGES.OFFLINE.SYNC_FAILED, error as Error, { id: request.id });

        // Increment retry count
        request.retryCount++;

        if (request.retryCount < request.maxRetries) {
          // Keep in queue for retry
          failedRequests.push(request);
        } else {
          // Max retries reached, remove from queue
          logger.warn(LOG_MESSAGES.OFFLINE.MAX_RETRIES, { id: request.id });
        }
      }
    }

    // Update queue with failed requests
    this._queue = failedRequests;
    await this._saveQueue();

    this._isSyncing = false;
    logger.info(LOG_MESSAGES.OFFLINE.SYNC_COMPLETED, {
      remaining: this._queue.length,
      failed: failedRequests.length,
    });
  }

  /**
   * Executes a queued request
   */
  private async _executeRequest(request: QueuedRequest): Promise<void> {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment -- HEADER constants are properly typed strings */
    const response = await fetch(request.url, {
      method: request.method,
      headers: {
        [HEADER.CONTENT_TYPE]: HEADER.APPLICATION_JSON,
        ...request.headers,
      },
      body: request.data ? JSON.stringify(request.data) : undefined,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Checks if device is online
   */
  async isDeviceOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  /**
   * Gets current network status
   */
  getNetworkStatus(): NetworkStatus {
    return this._isOnline ? NETWORK_STATUS.ONLINE : NETWORK_STATUS.OFFLINE;
  }

  /**
   * Subscribes to network status changes
   */
  subscribe(listener: (status: NetworkStatus) => void): () => void {
    this._listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this._listeners.delete(listener);
    };
  }

  /**
   * Notifies listeners of status change
   */
  private _notifyListeners(status: NetworkStatus): void {
    this._listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (error) {
        logger.error(LOG_MESSAGES.OFFLINE.LISTENER_ERROR, error as Error);
      }
    });
  }

  /**
   * Gets queue statistics
   */
  getStats(): OfflineQueueStats {
    return {
      totalQueued: this._queue.length,
      pendingSync: this._queue.filter((r) => r.retryCount < r.maxRetries).length,
      lastSyncAttempt:
        this._queue.length > 0 ? Math.max(...this._queue.map((r) => r.timestamp)) : null,
      isOnline: this._isOnline,
    };
  }

  /**
   * Clears the offline queue
   */
  async clearQueue(): Promise<void> {
    this._queue = [];
    await this._saveQueue();
    logger.info(LOG_MESSAGES.OFFLINE.QUEUE_CLEARED);
  }

  /**
   * Saves queue to storage
   */
  private async _saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this._storageKey, JSON.stringify(this._queue));
    } catch (error) {
      logger.error(LOG_MESSAGES.OFFLINE.SAVE_FAILED, error as Error);
    }
  }

  /**
   * Loads queue from storage
   */
  private async _loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this._storageKey);
      if (stored) {
        this._queue = JSON.parse(stored) as QueuedRequest[];
        logger.debug(LOG_MESSAGES.OFFLINE.QUEUE_LOADED, { size: this._queue.length });
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.OFFLINE.LOAD_FAILED, error as Error);
      this._queue = [];
    }
  }

  /**
   * Generates unique ID
   */
  private _generateId(): string {
    return `${Date.now()}-${Math.random().toString(ID_GENERATION.RADIX).substring(ID_GENERATION.SUBSTRING_START, ID_GENERATION.SUFFIX_LENGTH)}`;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this._unsubscribeNetInfo) {
      this._unsubscribeNetInfo();
      this._unsubscribeNetInfo = null;
    }
    this._listeners.clear();
  }
}

// ============================================================================
// Global Instance
// ============================================================================

export const offlineService = new OfflineService();

/**
 * Hook to check if device is online
 */
export function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Get initial status
    offlineService.isDeviceOnline().then(setIsOnline);

    // Subscribe to changes
    const unsubscribe = offlineService.subscribe((status) => {
      setIsOnline(status === NETWORK_STATUS.ONLINE);
    });

    return unsubscribe;
  }, []);

  return isOnline;
}

/**
 * Hook to get network status
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(NETWORK_STATUS.ONLINE);

  useEffect(() => {
    // Get initial status
    setStatus(offlineService.getNetworkStatus());

    // Subscribe to changes
    const unsubscribe = offlineService.subscribe(setStatus);

    return unsubscribe;
  }, []);

  return status;
}

/**
 * Hook to get offline queue stats
 */
export function useOfflineStats(): OfflineQueueStats {
  const [stats, setStats] = useState<OfflineQueueStats>(() => offlineService.getStats());

  useEffect(() => {
    // Update stats when network changes
    const unsubscribe = offlineService.subscribe(() => {
      setStats(offlineService.getStats());
    });

    // Periodic updates
    const interval = setInterval(() => {
      setStats(offlineService.getStats());
    }, POLLING.FAST);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return stats;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Wraps a fetch call with offline support
 */
export async function offlineFetch(
  url: string,
  options: RequestInit & { maxRetries?: number } = {}
): Promise<Response> {
  const isOnline = await offlineService.isDeviceOnline();

  if (!isOnline) {
    // Queue for later
    await offlineService.enqueue({
      url,
      method: (options.method as HttpMethodType) || HTTP_METHOD.GET,
      data: options.body ? JSON.parse(options.body as string) : undefined,
      headers: options.headers as Record<string, string>,
      maxRetries: options.maxRetries || LIST_LIMITS.MAX_RETRIES,
    });

    throw new Error(LOG_MESSAGES.OFFLINE.REQUEST_QUEUED_FOR_SYNC);
  }

  // Execute normally if online
  return fetch(url, options);
}

/**
 * Checks if operation should work offline
 */
export function shouldWorkOffline(operation: string): boolean {
  return OFFLINE_OPERATIONS.some((op) => operation.toLowerCase().includes(op));
}
