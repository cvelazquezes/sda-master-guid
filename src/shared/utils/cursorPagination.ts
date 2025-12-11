/**
 * Cursor-Based Pagination Utility
 * Following GitHub/Stripe API pagination patterns for scalability
 */

import { useState, useCallback } from 'react';
import { logger } from './logger';
import {
  EMPTY_VALUE,
  LOG_MESSAGES,
  SORT_ORDERS,
  SORT_ORDER,
  ENCODING,
  QUERY_PARAM,
} from '../constants';
import { LIST_LIMITS } from '../constants/numbers';

/** Derived type for sort order */
type SortOrderType = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

// ============================================================================
// React Hook for Cursor Pagination
// ============================================================================

// ============================================================================
// Types
// ============================================================================

/**
 * Cursor pagination parameters
 */
export type CursorPaginationParams = {
  /** Number of items to return */
  limit: number;
  /** Cursor for pagination (base64 encoded) */
  cursor?: string;
  /** Sort order */
  order?: SortOrderType;
};

/**
 * Cursor pagination response
 */
export type CursorPaginationResponse<T> = {
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
};

/**
 * Cursor data structure
 */
type CursorData = {
  /** Item ID */
  id: string;
  /** Timestamp for ordering */
  timestamp: string | number;
  /** Sort direction */
  direction: SortOrderType;
};

/**
 * Paginated query options
 */
export type PaginatedQueryOptions<T> = {
  /** Function to fetch items */
  fetcher: (params: CursorPaginationParams) => Promise<T[]>;
  /** Function to extract ID from item */
  getId: (item: T) => string;
  /** Function to extract timestamp from item */
  getTimestamp: (item: T) => string | number;
} & CursorPaginationParams;

// ============================================================================
// Cursor Encoding/Decoding
// ============================================================================

/**
 * Encodes cursor data to base64 string
 */
export function encodeCursor(data: CursorData): string {
  try {
    const json = JSON.stringify(data);
    const base64 = Buffer.from(json).toString(ENCODING.BASE64);
    return base64;
  } catch (error) {
    logger.error(LOG_MESSAGES.PAGINATION.ENCODE_FAILED, error as Error, { data });
    throw new Error(LOG_MESSAGES.PAGINATION.INVALID_CURSOR_DATA);
  }
}

/**
 * Decodes base64 cursor string to cursor data
 */
export function decodeCursor(cursor: string): CursorData {
  try {
    const json = Buffer.from(cursor, ENCODING.BASE64).toString(ENCODING.UTF8);
    const data = JSON.parse(json) as CursorData;

    // Validate cursor data
    if (!data.id || !data.timestamp || !data.direction) {
      throw new Error(LOG_MESSAGES.PAGINATION.INVALID_CURSOR_STRUCTURE);
    }

    return data;
  } catch (error) {
    logger.error(LOG_MESSAGES.PAGINATION.DECODE_FAILED, error as Error, { cursor });
    throw new Error(LOG_MESSAGES.PAGINATION.INVALID_CURSOR);
  }
}

/**
 * Creates a cursor from an item
 */
export function createCursor<T>(
  item: T,
  getId: (item: T) => string,
  getTimestamp: (item: T) => string | number,
  direction: SortOrderType = SORT_ORDER.DESC
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- LIST_LIMITS constants are properly typed numbers
  private static readonly _defaultLimit: number = LIST_LIMITS.PAGE_SIZE_DEFAULT;

  /**
   * Maximum limit allowed
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- LIST_LIMITS constants are properly typed numbers
  private static readonly _maxLimit: number = LIST_LIMITS.PAGE_SIZE_MAX;

  /**
   * Executes a paginated query
   */
  static async paginate<T>(
    options: PaginatedQueryOptions<T>
  ): Promise<CursorPaginationResponse<T>> {
    const {
      limit: requestedLimit,
      cursor,
      order = SORT_ORDER.DESC,
      fetcher,
      getId,
      getTimestamp,
    } = options;

    // Validate and normalize limit
    const limit = Math.min(Math.max(1, requestedLimit || this._defaultLimit), this._maxLimit);

    try {
      // Decode cursor if provided
      let cursorData: CursorData | null = null;
      if (cursor) {
        cursorData = decodeCursor(cursor);

        // Validate direction matches
        if (cursorData.direction !== order) {
          throw new Error(LOG_MESSAGES.PAGINATION.CURSOR_DIRECTION_MISMATCH);
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
      logger.error(LOG_MESSAGES.PAGINATION.FETCH_FAILED, error as Error, {
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

    queryParams.append(QUERY_PARAM.LIMIT, params.limit.toString());

    if (params.cursor) {
      queryParams.append(QUERY_PARAM.CURSOR, params.cursor);
    }

    if (params.order) {
      queryParams.append(QUERY_PARAM.ORDER, params.order);
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
      limit: parseInt(params.get(QUERY_PARAM.LIMIT) || `${this._defaultLimit}`, 10),
      cursor: params.get(QUERY_PARAM.CURSOR) || undefined,
      order: (params.get(QUERY_PARAM.ORDER) as SortOrderType) || SORT_ORDER.DESC,
    };
  }
}

/**
 * Hook state
 */
type UseCursorPaginationState<T> = {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  cursor: string | null;
};

/**
 * Hook result
 */
type UseCursorPaginationResult<T> = {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  hasMore: boolean;
} & UseCursorPaginationState<T>;

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
        order: SORT_ORDER.DESC,
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
        order: SORT_ORDER.DESC,
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
      return LOG_MESSAGES.VALIDATION.LIMIT_AT_LEAST;
    }
    /* eslint-disable @typescript-eslint/no-unsafe-argument -- LIST_LIMITS.PAGE_SIZE_MAX is a properly typed number */
    if (params.limit > LIST_LIMITS.PAGE_SIZE_MAX) {
      return LOG_MESSAGES.VALIDATION.LIMIT_EXCEEDED(LIST_LIMITS.PAGE_SIZE_MAX);
    }
    /* eslint-enable @typescript-eslint/no-unsafe-argument */
  }

  if (params.cursor !== undefined && params.cursor !== EMPTY_VALUE) {
    try {
      decodeCursor(params.cursor);
    } catch {
      return LOG_MESSAGES.VALIDATION.INVALID_CURSOR;
    }
  }

  if (params.order !== undefined && !SORT_ORDERS.includes(params.order)) {
    return LOG_MESSAGES.VALIDATION.ORDER_INVALID;
  }

  return null;
}

/**
 * Creates HATEOAS links for pagination
 */
export function createPaginationLinks<T>(
  baseUrl: string,
  params: CursorPaginationParams,
  pagination: CursorPaginationResponse<T>['pagination']
): {
  self: string;
  next: string | null;
  prev: string | null;
} {
  const selfParams = new URLSearchParams({
    [QUERY_PARAM.LIMIT]: params.limit.toString(),
    [QUERY_PARAM.ORDER]: params.order || SORT_ORDER.DESC,
  });
  if (params.cursor) {
    selfParams.append(QUERY_PARAM.CURSOR, params.cursor);
  }

  const links = {
    self: `${baseUrl}?${selfParams.toString()}`,
    next: null as string | null,
    prev: null as string | null,
  };

  // Next link
  if (pagination.nextCursor) {
    const nextParams = new URLSearchParams({
      [QUERY_PARAM.LIMIT]: params.limit.toString(),
      [QUERY_PARAM.ORDER]: params.order || SORT_ORDER.DESC,
      [QUERY_PARAM.CURSOR]: pagination.nextCursor,
    });
    links.next = `${baseUrl}?${nextParams.toString()}`;
  }

  // Previous link
  if (pagination.prevCursor) {
    const prevParams = new URLSearchParams({
      [QUERY_PARAM.LIMIT]: params.limit.toString(),
      [QUERY_PARAM.ORDER]: params.order === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
      [QUERY_PARAM.CURSOR]: pagination.prevCursor,
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
