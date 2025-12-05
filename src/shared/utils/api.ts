/**
 * API Utility Functions
 *
 * Utilities for API operations including pagination, filtering, sorting,
 * and request building following REST best practices.
 *
 * Based on best practices from:
 * - Google API Design Guide
 * - Microsoft REST API Guidelines
 * - Stripe API
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

/**
 * Cursor-based pagination parameters
 */
export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
}

/**
 * Sorting parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters (generic)
 */
export type FilterParams = Record<string, unknown>;

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Cursor paginated response structure
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: {
    cursor: string | null;
    hasMore: boolean;
    limit: number;
  };
}

/**
 * API Query parameters
 */
export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

// ============================================================================
// Pagination Helpers
// ============================================================================

/**
 * Creates pagination query parameters
 *
 * @param params - Pagination parameters
 * @returns URL query parameters object
 *
 * @example
 * ```typescript
 * const params = createPaginationParams({ page: 2, pageSize: 20 });
 * // Returns: { page: 2, pageSize: 20, offset: 20, limit: 20 }
 * ```
 */
export function createPaginationParams(params: PaginationParams): Record<string, string> {
  const { page = 1, pageSize = 20, limit, offset } = params;

  const calculatedOffset = offset ?? (page - 1) * pageSize;
  const calculatedLimit = limit ?? pageSize;

  return {
    page: String(page),
    pageSize: String(pageSize),
    offset: String(calculatedOffset),
    limit: String(calculatedLimit),
  };
}

/**
 * Creates cursor-based pagination parameters
 *
 * @param params - Cursor pagination parameters
 * @returns URL query parameters object
 *
 * @example
 * ```typescript
 * const params = createCursorPaginationParams({ cursor: 'abc123', limit: 50 });
 * // Returns: { cursor: 'abc123', limit: '50' }
 * ```
 */
export function createCursorPaginationParams(
  params: CursorPaginationParams
): Record<string, string> {
  const { cursor, limit = 20 } = params;

  const result: Record<string, string> = {
    limit: String(limit),
  };

  if (cursor) {
    result.cursor = cursor;
  }

  return result;
}

/**
 * Calculates pagination metadata
 *
 * @param total - Total number of items
 * @param page - Current page number
 * @param pageSize - Items per page
 * @returns Pagination metadata
 *
 * @example
 * ```typescript
 * const meta = calculatePaginationMeta(150, 3, 20);
 * // Returns: { page: 3, pageSize: 20, total: 150, totalPages: 8, hasNext: true, hasPrev: true }
 * ```
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<unknown>['pagination'] {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// ============================================================================
// Filtering & Sorting Helpers
// ============================================================================

/**
 * Creates filter query parameters from object
 *
 * @param filters - Filter object
 * @param options - Configuration options
 * @returns URL query parameters string
 *
 * @example
 * ```typescript
 * const params = createFilterParams({
 *   status: 'active',
 *   role: ['admin', 'user'],
 *   createdAt: { gte: '2024-01-01' }
 * });
 * // Returns: "status=active&role=admin&role=user&createdAt[gte]=2024-01-01"
 * ```
 */
export function createFilterParams(
  filters: FilterParams,
  options: { prefix?: string; arrayFormat?: 'repeat' | 'bracket' | 'comma' } = {}
): Record<string, string | string[]> {
  const { prefix = '', arrayFormat = 'repeat' } = options;
  const params: Record<string, string | string[]> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      if (arrayFormat === 'repeat') {
        // status=active&status=pending
        params[fullKey] = value.map(String);
      } else if (arrayFormat === 'bracket') {
        // status[]=active&status[]=pending
        params[`${fullKey}[]`] = value.map(String);
      } else if (arrayFormat === 'comma') {
        // status=active,pending
        params[fullKey] = value.join(',');
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested object: { gte: '2024-01-01' } => key[gte]=2024-01-01
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (nestedValue !== null && nestedValue !== undefined) {
          params[`${fullKey}[${nestedKey}]`] = String(nestedValue);
        }
      }
    } else {
      params[fullKey] = String(value);
    }
  }

  return params;
}

/**
 * Creates sort query parameters
 *
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (asc or desc)
 * @returns URL query parameters object
 *
 * @example
 * ```typescript
 * const params = createSortParams('createdAt', 'desc');
 * // Returns: { sortBy: 'createdAt', sortOrder: 'desc' }
 * ```
 */
export function createSortParams(
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'asc'
): Record<string, string> {
  if (!sortBy) {
    return {};
  }

  return {
    sortBy,
    sortOrder,
  };
}

/**
 * Parses sort string into sortBy and sortOrder
 *
 * @param sortString - Sort string (e.g., "createdAt:desc" or "-createdAt")
 * @returns Sort parameters
 *
 * @example
 * ```typescript
 * parseSortString('createdAt:desc'); // { sortBy: 'createdAt', sortOrder: 'desc' }
 * parseSortString('-createdAt');     // { sortBy: 'createdAt', sortOrder: 'desc' }
 * parseSortString('name');           // { sortBy: 'name', sortOrder: 'asc' }
 * ```
 */
export function parseSortString(sortString: string): SortParams {
  if (!sortString) {
    return {};
  }

  // Handle "-fieldName" format
  if (sortString.startsWith('-')) {
    return {
      sortBy: sortString.substring(1),
      sortOrder: 'desc',
    };
  }

  // Handle "fieldName:order" format
  if (sortString.includes(':')) {
    const [sortBy, sortOrder] = sortString.split(':');
    return {
      sortBy,
      sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
    };
  }

  // Default to ascending
  return {
    sortBy: sortString,
    sortOrder: 'asc',
  };
}

// ============================================================================
// Query Building
// ============================================================================

/**
 * Builds a complete query string from parameters
 *
 * @param params - Query parameters
 * @returns URL query string (without leading ?)
 *
 * @example
 * ```typescript
 * const query = buildQueryString({
 *   page: 1,
 *   pageSize: 20,
 *   sortBy: 'name',
 *   status: 'active'
 * });
 * // Returns: "page=1&pageSize=20&sortBy=name&status=active"
 * ```
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * Combines multiple parameter objects into a single query string
 *
 * @param pagination - Pagination parameters
 * @param sort - Sort parameters
 * @param filters - Filter parameters
 * @returns Complete query string
 *
 * @example
 * ```typescript
 * const query = combineQueryParams(
 *   { page: 2, pageSize: 20 },
 *   { sortBy: 'name', sortOrder: 'asc' },
 *   { status: 'active', role: 'admin' }
 * );
 * ```
 */
export function combineQueryParams(
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: FilterParams
): string {
  const allParams = {
    ...createPaginationParams(pagination || {}),
    ...createSortParams(sort?.sortBy, sort?.sortOrder),
    ...createFilterParams(filters || {}),
  };

  return buildQueryString(allParams);
}

// ============================================================================
// Request Helpers
// ============================================================================

/**
 * Creates a GET request URL with query parameters
 *
 * @param baseUrl - Base URL
 * @param params - Query parameters
 * @returns Complete URL with query string
 *
 * @example
 * ```typescript
 * const url = createGetUrl('/api/users', { page: 1, status: 'active' });
 * // Returns: "/api/users?page=1&status=active"
 * ```
 */
export function createGetUrl(baseUrl: string, params?: QueryParams): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const queryString = buildQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Extracts pagination info from response headers
 *
 * Common headers: X-Total-Count, X-Page, X-Page-Size, Link
 *
 * @param headers - Response headers
 * @returns Pagination metadata
 *
 * @example
 * ```typescript
 * const meta = extractPaginationFromHeaders(response.headers);
 * // Returns: { total: 150, page: 2, pageSize: 20 }
 * ```
 */
export function extractPaginationFromHeaders(
  headers: Record<string, string>
): Partial<PaginatedResponse<unknown>['pagination']> {
  const total = headers['x-total-count'] || headers['X-Total-Count'];
  const page = headers['x-page'] || headers['X-Page'];
  const pageSize = headers['x-page-size'] || headers['X-Page-Size'];

  const result: Partial<PaginatedResponse<unknown>['pagination']> = {};

  if (total) result.total = parseInt(total, 10);
  if (page) result.page = parseInt(page, 10);
  if (pageSize) result.pageSize = parseInt(pageSize, 10);

  if (result.total && result.page && result.pageSize) {
    result.totalPages = Math.ceil(result.total / result.pageSize);
    result.hasNext = result.page < result.totalPages;
    result.hasPrev = result.page > 1;
  }

  return result;
}

// ============================================================================
// Idempotency
// ============================================================================

/**
 * Generates an idempotency key for requests
 *
 * @param prefix - Optional prefix
 * @returns UUID-based idempotency key
 *
 * @example
 * ```typescript
 * const key = generateIdempotencyKey('payment');
 * // Returns: "payment_1234567890abcdef"
 *
 * // Usage in API call:
 * await api.post('/payments', data, {
 *   headers: { 'Idempotency-Key': key }
 * });
 * ```
 */
export function generateIdempotencyKey(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const key = `${timestamp}${random}`;
  return prefix ? `${prefix}_${key}` : key;
}

/**
 * Creates headers with idempotency key
 *
 * @param key - Idempotency key
 * @returns Headers object
 *
 * @example
 * ```typescript
 * const headers = createIdempotencyHeaders('abc123');
 * // Returns: { 'Idempotency-Key': 'abc123' }
 * ```
 */
export function createIdempotencyHeaders(key: string): Record<string, string> {
  return {
    'Idempotency-Key': key,
  };
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Creates a paginated response object
 *
 * @param data - Array of items
 * @param total - Total number of items
 * @param page - Current page
 * @param pageSize - Items per page
 * @returns Paginated response
 *
 * @example
 * ```typescript
 * const response = createPaginatedResponse(users, 150, 2, 20);
 * ```
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: calculatePaginationMeta(total, page, pageSize),
  };
}

/**
 * Creates a cursor paginated response object
 *
 * @param data - Array of items
 * @param nextCursor - Cursor for next page (null if no more)
 * @param limit - Items limit
 * @returns Cursor paginated response
 *
 * @example
 * ```typescript
 * const response = createCursorPaginatedResponse(users, 'cursor_abc', 20);
 * ```
 */
export function createCursorPaginatedResponse<T>(
  data: T[],
  nextCursor: string | null,
  limit: number
): CursorPaginatedResponse<T> {
  return {
    data,
    pagination: {
      cursor: nextCursor,
      hasMore: nextCursor !== null,
      limit,
    },
  };
}
