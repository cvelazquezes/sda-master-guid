/* eslint-disable no-magic-numbers, max-lines-per-function, @typescript-eslint/no-explicit-any */
/**
 * Cursor-Based Pagination Utility
 * Following GitHub/Stripe API pagination patterns for scalability
 */

import { logger } from './logger';

// ============================================================================
// React Hook for Cursor Pagination
// ============================================================================

import { useState, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

/**
 * Cursor pagination parameters
 */
export interface CursorPaginationParams {
  /** Number of items to return */
  limit: number;
  /** Cursor for pagination (base64 encoded) */
  cursor?: string;
  /** Sort order */
  order?: 'asc' | 'desc';
}

/**
 * Cursor pagination response
 */
export interface CursorPaginationResponse<T> {
  /** Array of items */
  data: T[];
  /** Pagination metadata */
  pagination: {
    /** Cursor for next page */
    nextCursor: string | null;
    /** Cursor for previous page */
    prevCursor: string | null;
    /** Whether there are more items */
    hasMore: boolean;
    /** Number of items in current page */
    count: number;
  };
}

/**
 * Cursor data structure
 */
interface CursorData {
  /** Item ID */
  id: string;
  /** Timestamp for ordering */
  timestamp: string | number;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Paginated query options
 */
export interface PaginatedQueryOptions<T> extends CursorPaginationParams {
  /** Function to fetch items */
  fetcher: (params: any) => Promise<T[]>;
  /** Function to extract ID from item */
  getId: (item: T) => string;
  /** Function to extract timestamp from item */
  getTimestamp: (item: T) => string | number;
}

// ============================================================================
// Cursor Encoding/Decoding
// ============================================================================

/**
 * Encodes cursor data to base64 string
 */
export function encodeCursor(data: CursorData): string {
  try {
    const json = JSON.stringify(data);
    const base64 = Buffer.from(json).toString('base64');
    return base64;
  } catch (error) {
    logger.error('Failed to encode cursor', error as Error, { data });
    throw new Error('Invalid cursor data');
  }
}

/**
 * Decodes base64 cursor string to cursor data
 */
export function decodeCursor(cursor: string): CursorData {
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf-8');
    const data = JSON.parse(json) as CursorData;

    // Validate cursor data
    if (!data.id || !data.timestamp || !data.direction) {
      throw new Error('Invalid cursor structure');
    }

    return data;
  } catch (error) {
    logger.error('Failed to decode cursor', error as Error, { cursor });
    throw new Error('Invalid cursor');
  }
}

/**
 * Creates a cursor from an item
 */
export function createCursor<T>(
  item: T,
  getId: (item: T) => string,
  getTimestamp: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'desc'
): string {
  const cursorData: CursorData = {
    id: getId(item),
    timestamp: getTimestamp(item),
    direction,
  };

  return encodeCursor(cursorData);
}

// ============================================================================
// Pagination Service
// ============================================================================

/**
 * Cursor-based pagination service
 * Optimized for large datasets with consistent performance
 */
export class CursorPaginationService {
  /**
   * Default limit for pagination
   */
  private static readonly DEFAULT_LIMIT = 20;

  /**
   * Maximum limit allowed
   */
  private static readonly MAX_LIMIT = 100;

  /**
   * Executes a paginated query
   */
  static async paginate<T>(
    options: PaginatedQueryOptions<T>
  ): Promise<CursorPaginationResponse<T>> {
    const { limit: requestedLimit, cursor, order = 'desc', fetcher, getId, getTimestamp } = options;

    // Validate and normalize limit
    const limit = Math.min(Math.max(1, requestedLimit || this.DEFAULT_LIMIT), this.MAX_LIMIT);

    try {
      // Decode cursor if provided
      let cursorData: CursorData | null = null;
      if (cursor) {
        cursorData = decodeCursor(cursor);

        // Validate direction matches
        if (cursorData.direction !== order) {
          throw new Error('Cursor direction mismatch');
        }
      }

      // Fetch items (fetch one extra to determine if there are more)
      const items = await fetcher({
        limit: limit + 1,
        cursor: cursorData,
        order,
      });

      // Check if there are more items
      const hasMore = items.length > limit;

      // Remove extra item if present
      const data = hasMore ? items.slice(0, limit) : items;

      // Generate cursors
      const nextCursor =
        hasMore && data.length > 0
          ? createCursor(data[data.length - 1], getId, getTimestamp, order)
          : null;

      const prevCursor = cursor || null;

      return {
        data,
        pagination: {
          nextCursor,
          prevCursor,
          hasMore,
          count: data.length,
        },
      };
    } catch (error) {
      logger.error('Pagination failed', error as Error, {
        limit,
        cursor,
        order,
      });
      throw error;
    }
  }

  /**
   * Creates pagination query parameters for API requests
   */
  static createQueryParams(params: CursorPaginationParams): URLSearchParams {
    const queryParams = new URLSearchParams();

    queryParams.append('limit', params.limit.toString());

    if (params.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    if (params.order) {
      queryParams.append('order', params.order);
    }

    return queryParams;
  }

  /**
   * Extracts pagination parameters from URL
   */
  static parseQueryParams(url: string): CursorPaginationParams {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    return {
      limit: parseInt(params.get('limit') || `${this.DEFAULT_LIMIT}`, 10),
      cursor: params.get('cursor') || undefined,
      order: (params.get('order') as 'asc' | 'desc') || 'desc',
    };
  }
}

/**
 * Hook state
 */
interface UseCursorPaginationState<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  cursor: string | null;
}

/**
 * Hook result
 */
interface UseCursorPaginationResult<T> extends UseCursorPaginationState<T> {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

/**
 * React hook for cursor-based pagination
 */
export function useCursorPagination<T>(
  fetcher: (params: PaginatedQueryOptions<T>) => Promise<CursorPaginationResponse<T>>,
  getId: (item: T) => string,
  getTimestamp: (item: T) => string | number,
  limit: number = 20
): UseCursorPaginationResult<T> {
  const [state, setState] = useState<UseCursorPaginationState<T>>({
    data: [],
    isLoading: false,
    error: null,
    hasMore: true,
    cursor: null,
  });

  /**
   * Loads more items
   */
  const loadMore = useCallback(async () => {
    if (state.isLoading || !state.hasMore) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await fetcher({
        limit,
        cursor: state.cursor || undefined,
        order: 'desc',
        fetcher: async () => [], // Placeholder
        getId,
        getTimestamp,
      });

      setState((prev) => ({
        ...prev,
        data: [...prev.data, ...result.data],
        cursor: result.pagination.nextCursor,
        hasMore: result.pagination.hasMore,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
    }
  }, [state.cursor, state.hasMore, state.isLoading, limit, fetcher, getId, getTimestamp]);

  /**
   * Refreshes the list (resets to first page)
   */
  const refresh = useCallback(async () => {
    setState({
      data: [],
      isLoading: true,
      error: null,
      hasMore: true,
      cursor: null,
    });

    try {
      const result = await fetcher({
        limit,
        cursor: undefined,
        order: 'desc',
        fetcher: async () => [], // Placeholder
        getId,
        getTimestamp,
      });

      setState({
        data: result.data,
        cursor: result.pagination.nextCursor,
        hasMore: result.pagination.hasMore,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
    }
  }, [limit, fetcher, getId, getTimestamp]);

  return {
    ...state,
    loadMore,
    refresh,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validates cursor pagination parameters
 */
export function validatePaginationParams(params: Partial<CursorPaginationParams>): string | null {
  if (params.limit !== undefined) {
    if (params.limit < 1) {
      return 'Limit must be at least 1';
    }
    if (params.limit > CursorPaginationService['MAX_LIMIT']) {
      return `Limit cannot exceed ${CursorPaginationService['MAX_LIMIT']}`;
    }
  }

  if (params.cursor !== undefined && params.cursor !== '') {
    try {
      decodeCursor(params.cursor);
    } catch {
      return 'Invalid cursor';
    }
  }

  if (params.order !== undefined && !['asc', 'desc'].includes(params.order)) {
    return 'Order must be "asc" or "desc"';
  }

  return null;
}

/**
 * Creates HATEOAS links for pagination
 */
export function createPaginationLinks(
  baseUrl: string,
  params: CursorPaginationParams,
  pagination: CursorPaginationResponse<any>['pagination']
): {
  self: string;
  next: string | null;
  prev: string | null;
} {
  const selfParams = new URLSearchParams({
    limit: params.limit.toString(),
    order: params.order || 'desc',
  });
  if (params.cursor) {
    selfParams.append('cursor', params.cursor);
  }

  const links = {
    self: `${baseUrl}?${selfParams.toString()}`,
    next: null as string | null,
    prev: null as string | null,
  };

  // Next link
  if (pagination.nextCursor) {
    const nextParams = new URLSearchParams({
      limit: params.limit.toString(),
      order: params.order || 'desc',
      cursor: pagination.nextCursor,
    });
    links.next = `${baseUrl}?${nextParams.toString()}`;
  }

  // Previous link
  if (pagination.prevCursor) {
    const prevParams = new URLSearchParams({
      limit: params.limit.toString(),
      order: params.order === 'asc' ? 'desc' : 'asc',
      cursor: pagination.prevCursor,
    });
    links.prev = `${baseUrl}?${prevParams.toString()}`;
  }

  return links;
}

// ============================================================================
// Example Usage
// ============================================================================

/**
 * Example: Paginating users
 *
 * ```typescript
 * import { CursorPaginationService } from './cursorPagination';
 *
 * const result = await CursorPaginationService.paginate({
 *   limit: 20,
 *   cursor: requestCursor,
 *   order: 'desc',
 *   fetcher: async ({ limit, cursor, order }) => {
 *     return await userRepository.find({
 *       limit,
 *       afterId: cursor?.id,
 *       afterTimestamp: cursor?.timestamp,
 *       order,
 *     });
 *   },
 *   getId: (user) => user.id,
 *   getTimestamp: (user) => user.createdAt,
 * });
 *
 * // Add HATEOAS links
 * const links = createPaginationLinks(
 *   '/api/users',
 *   { limit: 20, cursor: requestCursor },
 *   result.pagination
 * );
 *
 * res.json({
 *   data: result.data,
 *   pagination: result.pagination,
 *   links,
 * });
 * ```
 */
