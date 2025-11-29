/**
 * React Query Configuration
 * Optimized caching, retry, and state management following Tanstack best practices
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { logger } from '../utils/logger';
import { captureError } from '../services/sentry';

// ============================================================================
// Configuration Constants
// ============================================================================

const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME_MS = 10 * 60 * 1000; // 10 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// ============================================================================
// Query Client Configuration
// ============================================================================

const defaultOptions: DefaultOptions = {
  queries: {
    // Caching
    staleTime: STALE_TIME_MS,
    gcTime: CACHE_TIME_MS,

    // Retries
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      // Retry up to MAX_RETRIES times for other errors
      return failureCount < MAX_RETRIES;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff with jitter
      const baseDelay = Math.min(RETRY_DELAY_MS * Math.pow(2, attemptIndex), 30000);
      const jitter = Math.random() * 1000;
      return baseDelay + jitter;
    },

    // Refetch behavior
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,

    // Network mode
    networkMode: 'online',

    // Error handling
    throwOnError: false,

    // Placeholders
    placeholderData: undefined,

    // Select function to transform data
    select: undefined,
  },

  mutations: {
    // Retries (more conservative for mutations)
    retry: (failureCount, error: any) => {
      // Never retry 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      // Only retry once for 5xx errors (idempotent operations only)
      return failureCount < 1;
    },
    retryDelay: RETRY_DELAY_MS,

    // Network mode
    networkMode: 'online',

    // Error handling
    throwOnError: false,
  },
};

// ============================================================================
// Query Client Instance
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions,
  
  // Global error handler
  queryCache: {
    onError: (error, query) => {
      logger.error('Query error', error as Error, {
        queryKey: query.queryKey,
        queryHash: query.queryHash,
      });

      // Report to Sentry
      captureError(error as Error, {
        level: 'error',
        tags: {
          errorType: 'query',
          queryKey: JSON.stringify(query.queryKey),
        },
      });
    },

    onSuccess: (data, query) => {
      logger.debug('Query success', {
        queryKey: query.queryKey,
        queryHash: query.queryHash,
      });
    },
  } as any,

  mutationCache: {
    onError: (error, variables, context, mutation) => {
      logger.error('Mutation error', error as Error, {
        mutationKey: mutation.options.mutationKey,
      });

      // Report to Sentry
      captureError(error as Error, {
        level: 'error',
        tags: {
          errorType: 'mutation',
          mutationKey: JSON.stringify(mutation.options.mutationKey),
        },
      });
    },

    onSuccess: (data, variables, context, mutation) => {
      logger.debug('Mutation success', {
        mutationKey: mutation.options.mutationKey,
      });
    },
  } as any,
});

// ============================================================================
// Query Keys Factory
// ============================================================================

/**
 * Centralized query keys for type safety and consistency
 * Following hierarchical structure: [feature, entity, operation, ...params]
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'current-user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Clubs
  clubs: {
    all: ['clubs'] as const,
    lists: () => [...queryKeys.clubs.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.clubs.lists(), filters] as const,
    details: () => [...queryKeys.clubs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.clubs.details(), id] as const,
    stats: (id: string) => [...queryKeys.clubs.detail(id), 'stats'] as const,
  },

  // Matches
  matches: {
    all: ['matches'] as const,
    lists: () => [...queryKeys.matches.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.matches.lists(), filters] as const,
    details: () => [...queryKeys.matches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.matches.details(), id] as const,
    upcoming: (clubId: string) => 
      [...queryKeys.matches.lists(), 'upcoming', clubId] as const,
  },
} as const;

// ============================================================================
// Mutation Keys Factory
// ============================================================================

export const mutationKeys = {
  // Auth
  auth: {
    login: ['auth', 'login'] as const,
    register: ['auth', 'register'] as const,
    logout: ['auth', 'logout'] as const,
    updateProfile: ['auth', 'update-profile'] as const,
    changePassword: ['auth', 'change-password'] as const,
  },

  // Users
  users: {
    create: ['users', 'create'] as const,
    update: (id: string) => ['users', 'update', id] as const,
    delete: (id: string) => ['users', 'delete', id] as const,
  },

  // Clubs
  clubs: {
    create: ['clubs', 'create'] as const,
    update: (id: string) => ['clubs', 'update', id] as const,
    delete: (id: string) => ['clubs', 'delete', id] as const,
  },

  // Matches
  matches: {
    create: ['matches', 'create'] as const,
    update: (id: string) => ['matches', 'update', id] as const,
    delete: (id: string) => ['matches', 'delete', id] as const,
    cancel: (id: string) => ['matches', 'cancel', id] as const,
  },
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Invalidates all queries for a feature
 */
export async function invalidateFeature(feature: keyof typeof queryKeys): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey: queryKeys[feature].all,
  });
}

/**
 * Prefetches a query
 */
export async function prefetchQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: STALE_TIME_MS,
  });
}

/**
 * Sets query data manually
 */
export function setQueryData<T>(queryKey: readonly unknown[], data: T): void {
  queryClient.setQueryData(queryKey, data);
}

/**
 * Gets cached query data
 */
export function getQueryData<T>(queryKey: readonly unknown[]): T | undefined {
  return queryClient.getQueryData(queryKey);
}

/**
 * Clears all queries
 */
export function clearAllQueries(): void {
  queryClient.clear();
}

/**
 * Removes specific queries
 */
export async function removeQueries(queryKey: readonly unknown[]): Promise<void> {
  await queryClient.removeQueries({ queryKey });
}

/**
 * Cancels ongoing queries
 */
export async function cancelQueries(queryKey: readonly unknown[]): Promise<void> {
  await queryClient.cancelQueries({ queryKey });
}

// ============================================================================
// Optimistic Updates Helper
// ============================================================================

interface OptimisticUpdateOptions<TData, TVariables> {
  queryKey: readonly unknown[];
  mutationFn: (variables: TVariables) => Promise<TData>;
  updater: (oldData: TData | undefined, variables: TVariables) => TData;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

/**
 * Helper for optimistic updates
 */
export async function optimisticUpdate<TData, TVariables>({
  queryKey,
  mutationFn,
  updater,
  onSuccess,
  onError,
}: OptimisticUpdateOptions<TData, TVariables>) {
  return {
    mutationFn,
    onMutate: async (variables: TVariables) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update
      if (previousData) {
        queryClient.setQueryData<TData>(queryKey, updater(previousData, variables));
      }

      return { previousData };
    },
    onError: (error: Error, variables: TVariables, context: any) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      onError?.(error);
    },
    onSuccess: (data: TData) => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.(data);
    },
  };
}

// ============================================================================
// Infinite Query Helpers
// ============================================================================

export function getNextPageParam<T extends { hasMore: boolean; nextCursor?: string }>(
  lastPage: T
): string | undefined {
  return lastPage.hasMore ? lastPage.nextCursor : undefined;
}

export function getPreviousPageParam<T extends { hasPrevious: boolean; prevCursor?: string }>(
  firstPage: T
): string | undefined {
  return firstPage.hasPrevious ? firstPage.prevCursor : undefined;
}

// ============================================================================
// Exports
// ============================================================================

export type { QueryClient, DefaultOptions };

