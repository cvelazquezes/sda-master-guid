/**
 * React Query Configuration
 *
 * Centralized configuration for React Query (TanStack Query)
 * Provides caching, automatic refetching, and optimistic updates.
 *
 * Based on best practices from:
 * - TanStack Query documentation
 * - Airbnb's data fetching patterns
 * - Netflix's caching strategies
 */

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

/**
 * Default query options
 */
const defaultQueryOptions = {
  queries: {
    // Stale time: how long data is considered fresh (5 minutes)
    staleTime: 5 * 60 * 1000,

    // Cache time: how long unused data stays in cache (10 minutes)
    cacheTime: 10 * 60 * 1000,

    // Retry failed requests (3 times with exponential backoff)
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on window focus (user returns to tab)
    refetchOnWindowFocus: true,

    // Refetch on reconnect (network restored)
    refetchOnReconnect: true,

    // Refetch on mount if data is stale
    refetchOnMount: true,

    // Keep previous data while fetching new data
    keepPreviousData: true,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    retryDelay: 1000,
  },
};

/**
 * Query cache configuration
 *
 * Handles global query events (errors, success, etc.)
 */
const queryCache = new QueryCache({
  onError: (error, query) => {
    logger.error(`Query error [${query.queryHash}]:`, error);

    // Don't log user-initiated cancellations
    if (error instanceof Error && error.name === 'CanceledError') {
      return;
    }

    // Report to error tracking service
    if (error instanceof AppError && !error.isOperational) {
      // Non-operational errors should be reported
      // reportToSentry(error, { context: 'query', queryKey: query.queryKey });
    }
  },

  onSuccess: (data, query) => {
    logger.debug(`Query success [${query.queryHash}]`);
  },
});

/**
 * Mutation cache configuration
 *
 * Handles global mutation events
 */
const mutationCache = new MutationCache({
  onError: (error, _variables, _context, mutation) => {
    logger.error(`Mutation error [${mutation.mutationId}]:`, error);

    // Report non-operational errors
    if (error instanceof AppError && !error.isOperational) {
      // reportToSentry(error, { context: 'mutation' });
    }
  },

  onSuccess: (_data, _variables, _context, mutation) => {
    logger.debug(`Mutation success [${mutation.mutationId}]`);
  },
});

/**
 * Create Query Client instance
 *
 * This is the main React Query client used throughout the app.
 */
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
  queryCache,
  mutationCache,
});

/**
 * Query keys factory
 *
 * Centralized query key management following best practices.
 * Makes it easy to invalidate related queries.
 *
 * @example
 * ```typescript
 * // Use in useQuery
 * useQuery(queryKeys.users.list({ status: 'active' }), fetchUsers);
 *
 * // Invalidate all user queries
 * queryClient.invalidateQueries(queryKeys.users.all);
 *
 * // Invalidate specific user
 * queryClient.invalidateQueries(queryKeys.users.detail(userId));
 * ```
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'current-user'] as const,
  },

  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Match queries
  matches: {
    all: ['matches'] as const,
    lists: () => [...queryKeys.matches.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.matches.lists(), filters] as const,
    details: () => [...queryKeys.matches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.matches.details(), id] as const,
    rounds: (clubId: string) => [...queryKeys.matches.all, 'rounds', clubId] as const,
  },

  // Club queries
  clubs: {
    all: ['clubs'] as const,
    lists: () => [...queryKeys.clubs.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.clubs.lists(), filters] as const,
    details: () => [...queryKeys.clubs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.clubs.details(), id] as const,
    members: (id: string) => [...queryKeys.clubs.detail(id), 'members'] as const,
  },
} as const;

/**
 * Cache utilities
 */
export const cacheUtils = {
  /**
   * Invalidate all queries for a specific entity type
   *
   * @param entityType - Entity type (users, matches, clubs, etc.)
   *
   * @example
   * ```typescript
   * cacheUtils.invalidateEntity('users');
   * ```
   */
  invalidateEntity(entityType: keyof typeof queryKeys) {
    return queryClient.invalidateQueries(queryKeys[entityType].all);
  },

  /**
   * Invalidate all queries
   *
   * @example
   * ```typescript
   * cacheUtils.invalidateAll();
   * ```
   */
  invalidateAll() {
    return queryClient.invalidateQueries();
  },

  /**
   * Clear all cached data
   *
   * @example
   * ```typescript
   * cacheUtils.clearAll();
   * ```
   */
  clearAll() {
    return queryClient.clear();
  },

  /**
   * Set query data manually (for optimistic updates)
   *
   * @param queryKey - Query key
   * @param data - Data to set
   *
   * @example
   * ```typescript
   * cacheUtils.setQueryData(queryKeys.users.detail('123'), updatedUser);
   * ```
   */
  setQueryData<T>(queryKey: readonly unknown[], data: T | ((old: T | undefined) => T)) {
    return queryClient.setQueryData(queryKey, data);
  },

  /**
   * Get query data from cache
   *
   * @param queryKey - Query key
   * @returns Cached data or undefined
   *
   * @example
   * ```typescript
   * const user = cacheUtils.getQueryData(queryKeys.users.detail('123'));
   * ```
   */
  getQueryData<T>(queryKey: readonly unknown[]): T | undefined {
    return queryClient.getQueryData<T>(queryKey);
  },

  /**
   * Prefetch query data
   *
   * @param queryKey - Query key
   * @param queryFn - Function to fetch data
   *
   * @example
   * ```typescript
   * await cacheUtils.prefetchQuery(
   *   queryKeys.users.detail('123'),
   *   () => fetchUser('123')
   * );
   * ```
   */
  prefetchQuery<T>(queryKey: readonly unknown[], queryFn: () => Promise<T>) {
    return queryClient.prefetchQuery(queryKey, queryFn);
  },
};

/**
 * Optimistic update utilities
 */
export const optimisticUpdates = {
  /**
   * Perform optimistic update
   *
   * @param queryKey - Query key to update
   * @param updateFn - Function to update data
   * @returns Context with previous data (for rollback)
   *
   * @example
   * ```typescript
   * const context = await optimisticUpdates.update(
   *   queryKeys.users.detail('123'),
   *   (old) => ({ ...old, name: 'New Name' })
   * );
   * ```
   */
  async update<T>(
    queryKey: readonly unknown[],
    updateFn: (old: T | undefined) => T
  ): Promise<{ previousData: T | undefined }> {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(queryKey);

    // Snapshot previous value
    const previousData = queryClient.getQueryData<T>(queryKey);

    // Optimistically update
    queryClient.setQueryData<T>(queryKey, updateFn);

    // Return context for rollback
    return { previousData };
  },

  /**
   * Rollback optimistic update on error
   *
   * @param queryKey - Query key
   * @param context - Context with previous data
   *
   * @example
   * ```typescript
   * optimisticUpdates.rollback(queryKeys.users.detail('123'), context);
   * ```
   */
  rollback<T>(queryKey: readonly unknown[], context: { previousData: T | undefined }) {
    if (context.previousData !== undefined) {
      queryClient.setQueryData<T>(queryKey, context.previousData);
    }
  },

  /**
   * Invalidate after mutation success
   *
   * @param queryKeys - Query keys to invalidate
   *
   * @example
   * ```typescript
   * await optimisticUpdates.invalidate([
   *   queryKeys.users.all,
   *   queryKeys.users.detail('123')
   * ]);
   * ```
   */
  async invalidate(queryKeys: readonly (readonly unknown[])[]) {
    await Promise.all(queryKeys.map((key) => queryClient.invalidateQueries(key)));
  },
};

/**
 * Deduplication utilities
 *
 * Prevent duplicate requests for the same data
 */
export const deduplication = {
  /**
   * Check if query is currently fetching
   *
   * @param queryKey - Query key
   * @returns True if fetching
   *
   * @example
   * ```typescript
   * if (deduplication.isFetching(queryKeys.users.detail('123'))) {
   *   console.log('Already fetching...');
   * }
   * ```
   */
  isFetching(queryKey: readonly unknown[]): boolean {
    return queryClient.isFetching(queryKey) > 0;
  },

  /**
   * Cancel ongoing queries
   *
   * @param queryKey - Query key
   *
   * @example
   * ```typescript
   * await deduplication.cancel(queryKeys.users.all);
   * ```
   */
  async cancel(queryKey: readonly unknown[]) {
    await queryClient.cancelQueries(queryKey);
  },
};

export default queryClient;
