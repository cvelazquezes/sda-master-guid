/**
 * Offline Support Service
 * Handles offline queue and synchronization following Progressive Web App patterns
 */

import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../../shared/utils/logger';
import { addBreadcrumb } from './sentry';
import { POLLING } from '../../shared/constants/timing';
import { LIST_LIMITS, ID_GENERATION } from '../../shared/constants/numbers';
import {
  LOG_MESSAGES,
  STORAGE_KEYS,
  OFFLINE_OPERATIONS,
  NETWORK_STATUS,
  HTTP_METHOD,
  HEADER,
  BREADCRUMB_CATEGORY,
  BREADCRUMB_LEVEL,
} from '../../shared/constants';
import type { NetworkStatusType, HttpMethodType } from '../../shared/constants';

// ============================================================================
// React Hooks
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export interface QueuedRequest {
  id: string;
  url: string;
  method: HttpMethodType;
  data?: unknown;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export type NetworkStatus = NetworkStatusType;

export interface OfflineQueueStats {
  totalQueued: number;
  pendingSync: number;
  lastSyncAttempt: number | null;
  isOnline: boolean;
}

// ============================================================================
// Offline Queue Service
// ============================================================================

class OfflineService {
  private queue: QueuedRequest[] = [];
  private readonly STORAGE_KEY = STORAGE_KEYS.OFFLINE.QUEUE;
  private readonly MAX_QUEUE_SIZE = LIST_LIMITS.MAX_QUEUE;
  private isOnline = true;
  private isSyncing = false;
  private listeners = new Set<(status: NetworkStatus) => void>();
  private unsubscribeNetInfo: (() => void) | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initializes the offline service
   */
  private async initialize(): Promise<void> {
    // Load queue from storage
    await this.loadQueue();

    // Subscribe to network state
    this.unsubscribeNetInfo = NetInfo.addEventListener(this.handleNetworkChange);

    // Check initial network state
    const state = await NetInfo.fetch();
    this.handleNetworkChange(state);

    logger.info(LOG_MESSAGES.OFFLINE.INITIALIZED, {
      queueSize: this.queue.length,
      isOnline: this.isOnline,
    });
  }

  /**
   * Handles network state changes
   */
  private handleNetworkChange = (state: NetInfoState): void => {
    const wasOnline = this.isOnline;
    this.isOnline = state.isConnected ?? false;

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
    this.notifyListeners(status);

    // Attempt sync when coming online
    if (!wasOnline && this.isOnline && this.queue.length > 0) {
      logger.info(LOG_MESSAGES.OFFLINE.BACK_ONLINE);
      this.syncQueue();
    }
  };

  /**
   * Adds a request to the offline queue
   */
  async enqueue(request: Omit<QueuedRequest, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      logger.warn(LOG_MESSAGES.OFFLINE.QUEUE_FULL);
      this.queue.shift();
    }

    const queuedRequest: QueuedRequest = {
      ...request,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(queuedRequest);
    await this.saveQueue();

    logger.debug(LOG_MESSAGES.OFFLINE.REQUEST_QUEUED, {
      id: queuedRequest.id,
      method: queuedRequest.method,
      url: queuedRequest.url,
    });

    // Try to sync if online
    if (this.isOnline && !this.isSyncing) {
      this.syncQueue();
    }
  }

  /**
   * Syncs the offline queue
   */
  async syncQueue(): Promise<void> {
    if (this.isSyncing || !this.isOnline || this.queue.length === 0) {
      return;
    }

    this.isSyncing = true;
    logger.info(LOG_MESSAGES.OFFLINE.SYNC_STARTED, { queueSize: this.queue.length });

    const requestsToSync = [...this.queue];
    const failedRequests: QueuedRequest[] = [];

    for (const request of requestsToSync) {
      try {
        await this.executeRequest(request);

        // Remove from queue on success
        this.queue = this.queue.filter((r) => r.id !== request.id);

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
    this.queue = failedRequests;
    await this.saveQueue();

    this.isSyncing = false;
    logger.info(LOG_MESSAGES.OFFLINE.SYNC_COMPLETED, {
      remaining: this.queue.length,
      failed: failedRequests.length,
    });
  }

  /**
   * Executes a queued request
   */
  private async executeRequest(request: QueuedRequest): Promise<void> {
    const response = await fetch(request.url, {
      method: request.method,
      headers: {
        [HEADER.CONTENT_TYPE]: HEADER.APPLICATION_JSON,
        ...request.headers,
      },
      body: request.data ? JSON.stringify(request.data) : undefined,
    });

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
    return this.isOnline ? NETWORK_STATUS.ONLINE : NETWORK_STATUS.OFFLINE;
  }

  /**
   * Subscribes to network status changes
   */
  subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifies listeners of status change
   */
  private notifyListeners(status: NetworkStatus): void {
    this.listeners.forEach((listener) => {
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
      totalQueued: this.queue.length,
      pendingSync: this.queue.filter((r) => r.retryCount < r.maxRetries).length,
      lastSyncAttempt:
        this.queue.length > 0 ? Math.max(...this.queue.map((r) => r.timestamp)) : null,
      isOnline: this.isOnline,
    };
  }

  /**
   * Clears the offline queue
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
    logger.info(LOG_MESSAGES.OFFLINE.QUEUE_CLEARED);
  }

  /**
   * Saves queue to storage
   */
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      logger.error(LOG_MESSAGES.OFFLINE.SAVE_FAILED, error as Error);
    }
  }

  /**
   * Loads queue from storage
   */
  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        logger.debug(LOG_MESSAGES.OFFLINE.QUEUE_LOADED, { size: this.queue.length });
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.OFFLINE.LOAD_FAILED, error as Error);
      this.queue = [];
    }
  }

  /**
   * Generates unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(ID_GENERATION.RADIX).substring(ID_GENERATION.SUBSTRING_START, ID_GENERATION.SUFFIX_LENGTH)}`;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
      this.unsubscribeNetInfo = null;
    }
    this.listeners.clear();
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
