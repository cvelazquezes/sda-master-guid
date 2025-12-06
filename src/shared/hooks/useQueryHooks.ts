/**
 * React Query Custom Hooks
 *
 * Reusable hooks for data fetching with caching, automatic refetching,
 * and optimistic updates.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { queryKeys, optimisticUpdates, queryClient } from '../api/queryClient';
import { authService } from '../../features/auth/services/AuthService';
import { matchService } from '../../services/matchService';
import { User, Match } from '../../types';
import { CACHE } from '../constants/timing';

// ============================================================================
// Auth Hooks
// ============================================================================

/**
 * Hook to fetch current user
 *
 * @example
 * ```typescript
 * const { data: user, isLoading, error } = useCurrentUser();
 * ```
 */
export function useCurrentUser(
  options?: UseQueryOptions<User | null>
): ReturnType<typeof useQuery<User | null>> {
  return useQuery(queryKeys.auth.currentUser(), () => authService.getCurrentUser(), {
    staleTime: CACHE.LONG, // 10 minutes
    ...options,
  });
}

/**
 * Hook to update user profile with optimistic updates
 *
 * @example
 * ```typescript
 * const updateUser = useUpdateUser();
 * await updateUser.mutateAsync({ name: 'New Name' });
 * ```
 */
export function useUpdateUser(): ReturnType<typeof useMutation<User, Error, Partial<User>>> {
  const queryClient = useQueryClient();

  return useMutation((userData: Partial<User>) => authService.updateUser(userData), {
    // Optimistic update
    onMutate: async (newData) => {
      const queryKey = queryKeys.auth.currentUser();

      // Cancel outgoing refetches
      await queryClient.cancelQueries(queryKey);

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(queryKey);

      // Optimistically update
      if (previousUser) {
        queryClient.setQueryData<User>(queryKey, {
          ...previousUser,
          ...newData,
        });
      }

      // Return context with snapshot
      return { previousUser };
    },

    // Rollback on error
    onError: (_error, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.auth.currentUser(), context.previousUser);
      }
    },

    // Refetch on success (to ensure consistency)
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.auth.currentUser());
    },
  });
}

// ============================================================================
// Match Hooks
// ============================================================================

/**
 * Hook to fetch user's matches
 *
 * @example
 * ```typescript
 * const { data: matches, isLoading } = useMyMatches();
 * ```
 */
export function useMyMatches(
  options?: UseQueryOptions<Match[]>
): ReturnType<typeof useQuery<Match[]>> {
  return useQuery(queryKeys.matches.list({ scope: 'my' }), () => matchService.getMyMatches(), {
    staleTime: CACHE.SHORT, // ~1 minute
    ...options,
  });
}

/**
 * Hook to fetch club matches
 *
 * @param clubId - Club ID
 * @example
 * ```typescript
 * const { data: matches } = useClubMatches('club-123');
 * ```
 */
export function useClubMatches(
  clubId: string,
  options?: UseQueryOptions<Match[]>
): ReturnType<typeof useQuery<Match[]>> {
  return useQuery(queryKeys.matches.list({ clubId }), () => matchService.getMatches(clubId), {
    enabled: !!clubId,
    staleTime: CACHE.SHORT,
    ...options,
  });
}

/**
 * Hook to fetch single match
 *
 * @param matchId - Match ID
 * @example
 * ```typescript
 * const { data: match } = useMatch('match-123');
 * ```
 */
export function useMatch(
  matchId: string,
  options?: UseQueryOptions<Match>
): ReturnType<typeof useQuery<Match>> {
  return useQuery(queryKeys.matches.detail(matchId), () => matchService.getMatch(matchId), {
    enabled: !!matchId,
    staleTime: CACHE.MEDIUM,
    ...options,
  });
}

/**
 * Hook to update match with optimistic updates
 *
 * @example
 * ```typescript
 * const updateMatch = useUpdateMatch();
 * await updateMatch.mutateAsync({ matchId: '123', status: 'completed' });
 * ```
 */
export function useUpdateMatch(): ReturnType<typeof useMutation> {
  return useMutation(
    ({ matchId, ...data }: { matchId: string; status?: string; [key: string]: unknown }) =>
      matchService.updateMatchStatus(matchId, data.status),
    {
      // Optimistic update
      onMutate: async ({ matchId, ...newData }) => {
        const queryKey = queryKeys.matches.detail(matchId);
        const context = await optimisticUpdates.update<Match>(queryKey, (old) =>
          old ? { ...old, ...newData } : old
        );
        return context;
      },

      // Rollback on error
      onError: (_error, { matchId }, context) => {
        if (context) {
          optimisticUpdates.rollback(queryKeys.matches.detail(matchId), context);
        }
      },

      // Invalidate related queries on success
      onSuccess: (_data, { matchId }) => {
        optimisticUpdates.invalidate([
          queryKeys.matches.detail(matchId),
          queryKeys.matches.lists(),
        ]);
      },
    }
  );
}

/**
 * Hook to generate matches
 *
 * @example
 * ```typescript
 * const generateMatches = useGenerateMatches();
 * await generateMatches.mutateAsync('club-123');
 * ```
 */
export function useGenerateMatches(): ReturnType<typeof useMutation> {
  const queryClient = useQueryClient();

  return useMutation((clubId: string) => matchService.generateMatches(clubId), {
    onSuccess: (_data, clubId) => {
      // Invalidate all match queries for this club
      queryClient.invalidateQueries(queryKeys.matches.list({ clubId }));
      queryClient.invalidateQueries(queryKeys.matches.rounds(clubId));
    },
  });
}

// ============================================================================
// Infinite Query Hooks (for pagination)
// ============================================================================

/**
 * Hook for infinite scroll matches
 *
 * @param clubId - Club ID
 * @example
 * ```typescript
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage
 * } = useInfiniteMatches('club-123');
 * ```
 */
export function useInfiniteMatches(
  clubId: string,
  options?: UseInfiniteQueryOptions<Match[]>
): ReturnType<typeof useInfiniteQuery<Match[]>> {
  return useInfiniteQuery(
    [...queryKeys.matches.list({ clubId }), 'infinite'],
    async ({ pageParam: _pageParam = 1 }) => {
      // In real implementation, pass page to API
      const matches = await matchService.getMatches(clubId);
      return matches;
    },
    {
      enabled: !!clubId,
      getNextPageParam: (_lastPage, allPages) => {
        // Return next page number or undefined if no more pages
        return allPages.length + 1;
      },
      ...options,
    }
  );
}

// ============================================================================
// Prefetch Utilities
// ============================================================================

/**
 * Prefetch user matches
 *
 * @example
 * ```typescript
 * await prefetchMyMatches();
 * ```
 */
export async function prefetchMyMatches(): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.matches.list({ scope: 'my' }),
    queryFn: matchService.getMyMatches,
  });
}

/**
 * Prefetch match details
 *
 * @param matchId - Match ID
 * @example
 * ```typescript
 * await prefetchMatch('match-123');
 * ```
 */
export async function prefetchMatch(matchId: string): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.matches.detail(matchId),
    queryFn: () => matchService.getMatch(matchId),
  });
}

// ============================================================================
// Cache Invalidation Helpers
// ============================================================================

/**
 * Invalidate all match queries
 *
 * @example
 * ```typescript
 * invalidateMatches();
 * ```
 */
export function invalidateMatches(): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: queryKeys.matches.all });
}

/**
 * Invalidate auth queries (useful after login/logout)
 *
 * @example
 * ```typescript
 * invalidateAuth();
 * ```
 */
export function invalidateAuth(): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
}
