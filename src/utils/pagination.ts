/**
 * Pagination Utilities
 *
 * Provides utilities for implementing offset-based and cursor-based pagination
 *
 * Based on best practices from:
 * - Facebook GraphQL Relay Specification
 * - Twitter API v2
 * - GitHub GraphQL API
 * - Netflix API patterns
 */

/**
 * Offset-based pagination parameters
 */
// Note: Add this import at the top of a React file
import React from 'react';

export interface OffsetPaginationParams {
  /**
   * Number of items per page
   */
  limit: number;

  /**
   * Number of items to skip
   */
  offset: number;

  /**
   * Current page number (1-based)
   */
  page?: number;
}

/**
 * Cursor-based pagination parameters
 */
export interface CursorPaginationParams {
  /**
   * Number of items to fetch
   */
  first?: number;

  /**
   * Cursor for forward pagination
   */
  after?: string;

  /**
   * Number of items to fetch (backward)
   */
  last?: number;

  /**
   * Cursor for backward pagination
   */
  before?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /**
   * Total number of items
   */
  total: number;

  /**
   * Current page number
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Number of items per page
   */
  perPage: number;

  /**
   * Whether there's a next page
   */
  hasNextPage: boolean;

  /**
   * Whether there's a previous page
   */
  hasPrevPage: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  /**
   * Items in current page
   */
  data: T[];

  /**
   * Pagination metadata
   */
  meta: PaginationMeta;
}

/**
 * Cursor-based paginated response
 */
export interface CursorPaginatedResponse<T> {
  /**
   * Edges containing nodes and cursors
   */
  edges: {
    node: T;
    cursor: string;
  }[];

  /**
   * Page info
   */
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };

  /**
   * Total count (optional)
   */
  totalCount?: number;
}

/**
 * Creates offset-based pagination params
 *
 * @param page - Page number (1-based)
 * @param limit - Items per page
 * @returns Pagination parameters
 *
 * @example
 * ```typescript
 * const params = createOffsetPaginationParams(2, 20);
 * // { limit: 20, offset: 20, page: 2 }
 *
 * const url = `/api/users?limit=${params.limit}&offset=${params.offset}`;
 * ```
 */
export function createOffsetPaginationParams(page: number, limit: number): OffsetPaginationParams {
  const offset = (page - 1) * limit;

  return {
    limit,
    offset,
    page,
  };
}

/**
 * Creates pagination metadata from response
 *
 * @param total - Total number of items
 * @param page - Current page
 * @param limit - Items per page
 * @returns Pagination metadata
 *
 * @example
 * ```typescript
 * const meta = createPaginationMeta(100, 2, 20);
 * // {
 * //   total: 100,
 * //   currentPage: 2,
 * //   totalPages: 5,
 * //   perPage: 20,
 * //   hasNextPage: true,
 * //   hasPrevPage: true
 * // }
 * ```
 */
export function createPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    currentPage: page,
    totalPages,
    perPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Encodes a cursor for cursor-based pagination
 *
 * @param value - Value to encode (ID, timestamp, etc.)
 * @returns Base64 encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeCursor('user_123');
 * // 'dXNlcl8xMjM='
 * ```
 */
export function encodeCursor(value: string | number): string {
  const stringValue = String(value);
  return Buffer.from(stringValue, 'utf-8').toString('base64');
}

/**
 * Decodes a cursor
 *
 * @param cursor - Base64 encoded cursor
 * @returns Decoded cursor value
 *
 * @example
 * ```typescript
 * const value = decodeCursor('dXNlcl8xMjM=');
 * // 'user_123'
 * ```
 */
export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString('utf-8');
}

/**
 * Validates pagination parameters
 *
 * @param page - Page number
 * @param limit - Items per page
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePaginationParams(1, 50);
 * if (!validation.valid) {
 *   throw new Error(validation.error);
 * }
 * ```
 */
export function validatePaginationParams(
  page: number,
  limit: number
): { valid: boolean; error?: string } {
  if (page < 1) {
    return { valid: false, error: 'Page must be >= 1' };
  }

  if (limit < 1) {
    return { valid: false, error: 'Limit must be >= 1' };
  }

  if (limit > 100) {
    return { valid: false, error: 'Limit must be <= 100' };
  }

  return { valid: true };
}

/**
 * Gets page numbers for pagination UI
 *
 * @param currentPage - Current page
 * @param totalPages - Total pages
 * @param maxVisible - Maximum visible page numbers
 * @returns Array of page numbers to display
 *
 * @example
 * ```typescript
 * const pages = getPageNumbers(5, 10, 5);
 * // [3, 4, 5, 6, 7]
 *
 * const pages2 = getPageNumbers(2, 10, 5);
 * // [1, 2, 3, 4, 5]
 * ```
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

/**
 * React hook for pagination state management
 *
 * @example
 * ```typescript
 * function UserList() {
 *   const {
 *     currentPage,
 *     limit,
 *     setPage,
 *     setLimit,
 *     nextPage,
 *     prevPage,
 *     params
 *   } = usePagination(1, 20);
 *
 *   const { data } = useQuery(['users', params], () =>
 *     fetchUsers(params.limit, params.offset)
 *   );
 *
 *   return (
 *     <View>
 *       <FlatList data={data} />
 *       <Button onPress={prevPage}>Previous</Button>
 *       <Button onPress={nextPage}>Next</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function usePagination(
  initialPage: number = 1,
  initialLimit: number = 20
): {
  currentPage: number;
  limit: number;
  params: OffsetPaginationParams;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
} {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [limit, setLimit] = React.useState(initialLimit);

  const params = React.useMemo(
    () => createOffsetPaginationParams(currentPage, limit),
    [currentPage, limit]
  );

  const setPage = React.useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  }, []);

  const nextPage = React.useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const prevPage = React.useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const reset = React.useCallback(() => {
    setCurrentPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    currentPage,
    limit,
    params,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    reset,
  };
}

/**
 * Pagination constants
 */
export const PAGINATION_DEFAULTS = {
  /**
   * Default page size
   */
  PAGE_SIZE: 20,

  /**
   * Maximum page size
   */
  MAX_PAGE_SIZE: 100,

  /**
   * Minimum page size
   */
  MIN_PAGE_SIZE: 1,

  /**
   * Default page number
   */
  DEFAULT_PAGE: 1,
} as const;

/**
 * Usage Examples:
 *
 * 1. Offset-based pagination:
 * ```typescript
 * const params = createOffsetPaginationParams(2, 20);
 * const response = await fetch(`/api/users?limit=${params.limit}&offset=${params.offset}`);
 * ```
 *
 * 2. Cursor-based pagination:
 * ```typescript
 * const response = await fetch('/api/users?first=20&after=' + encodeCursor('user_100'));
 * ```
 *
 * 3. With React Query:
 * ```typescript
 * function useUsers(page: number, limit: number) {
 *   const params = createOffsetPaginationParams(page, limit);
 *
 *   return useQuery(['users', params], async () => {
 *     const response = await api.get('/users', { params });
 *     return response.data;
 *   }, {
 *     keepPreviousData: true, // For smooth pagination
 *   });
 * }
 * ```
 */
