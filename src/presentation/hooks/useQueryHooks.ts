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
  useInfiniteQuery,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { queryKeys, optimisticUpdates, queryClient } from '../../infrastructure/http/queryClient';
import { authService } from '../../infrastructure/repositories/authService';
import { matchService } from '../../infrastructure/repositories/matchService';
import { QUERY_KEY, QUERY_SCOPE } from '../../shared/constants/errorMessages';
import { CACHE } from '../../shared/constants/timing';
import type { User, Match } from '../../types';

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
type UpdateUserContext = { previousUser: User | undefined };

export function useUpdateUser(): ReturnType<
  typeof useMutation<User, Error, Partial<User>, UpdateUserContext>
> {
  const queryClient = useQueryClient();

  return useMutation((userData: Partial<User>) => authService.updateUser(userData), {
    // Optimistic update
    onMutate: async (newData): Promise<UpdateUserContext> => {
      const queryKey = queryKeys.auth.currentUser();

      // Cancel outgoing refetches
      await queryClient.cancelQueries(queryKey);

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(queryKey);

      // Optimistically update
      if (previousUser) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Partial<User> spread is type-safe
        const updatedUser: User = {
          ...previousUser,
          ...newData,
        };
        queryClient.setQueryData<User>(queryKey, updatedUser);
      }

      // Return context with snapshot
      return { previousUser };
    },

    // Rollback on error
    onError: (_error: Error, _variables: Partial<User>, context: UpdateUserContext | undefined) => {
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
  return useQuery(
    queryKeys.matches.list({ scope: QUERY_SCOPE.MY }),
    () => matchService.getMyMatches(),
    {
      staleTime: CACHE.SHORT, // ~1 minute
      ...options,
    }
  );
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
type UpdateMatchVariables = { matchId: string; status?: string; [key: string]: unknown };
type UpdateMatchContext = { previousData: Match | undefined };

export function useUpdateMatch(): ReturnType<
  typeof useMutation<Match, Error, UpdateMatchVariables, UpdateMatchContext>
> {
  return useMutation(
    ({ matchId, ...data }: UpdateMatchVariables) =>
      matchService.updateMatchStatus(matchId, data.status as string | undefined),
    {
      // Optimistic update
      /* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment -- queryKey type is inferred correctly */
      onMutate: async ({ matchId, status }): Promise<UpdateMatchContext> => {
        const queryKey = queryKeys.matches.detail(matchId);
        const context = await optimisticUpdates.update<Match>(queryKey, (old) =>
          old ? { ...old, ...(status !== undefined ? { status } : {}) } : old
        );
        return context as UpdateMatchContext;
      },
      /* eslint-enable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */

      // Rollback on error
      onError: (
        _error: Error,
        { matchId }: UpdateMatchVariables,
        context: UpdateMatchContext | undefined
      ) => {
        if (context) {
          optimisticUpdates.rollback(queryKeys.matches.detail(matchId), context);
        }
      },

      // Invalidate related queries on success
      onSuccess: (_data: Match, { matchId }: UpdateMatchVariables) => {
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
export function useGenerateMatches(): ReturnType<typeof useMutation<Match[], Error, string>> {
  const queryClient = useQueryClient();

  return useMutation((clubId: string) => matchService.generateMatches(clubId), {
    onSuccess: (_data: Match[], clubId: string) => {
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
    [...queryKeys.matches.list({ clubId }), QUERY_KEY.INFINITE],
    async ({ pageParam: _pageParam = 1 }) => {
      // In real implementation, pass page to API
      const matches = await matchService.getMatches(clubId);
      return matches;
    },
    {
      enabled: !!clubId,
      getNextPageParam: (_lastPage: Match[], allPages: Match[][]) => {
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
    queryKey: queryKeys.matches.list({ scope: QUERY_SCOPE.MY }),
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
