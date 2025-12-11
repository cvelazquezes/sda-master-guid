/**
 * Shared Utilities
 *
 * Note: Some exports are namespaced to avoid conflicts with shared/validation
 * ValidationError is exported from ./errors as the canonical source for utils
 * CursorPaginationParams is exported from ./cursorPagination as the canonical source
 */

export * from './accessibility';

// API utilities (excluding CursorPaginationParams which is in cursorPagination)
export {
  createPaginationParams,
  createCursorPaginationParams,
  calculatePaginationMeta,
  createFilterParams,
  createSortParams,
  parseSortString,
  buildQueryString,
  combineQueryParams,
  createGetUrl,
  extractPaginationFromHeaders,
  generateIdempotencyKey,
  createIdempotencyHeaders,
  createPaginatedResponse,
  createCursorPaginatedResponse,
  type PaginationParams,
  type SortParams,
  type FilterParams,
  type PaginatedResponse,
  type CursorPaginatedResponse,
  type QueryParams,
} from './api';

export * from './csrfProtection';

// Cursor pagination (canonical source for CursorPaginationParams)
export * from './cursorPagination';

// Errors (ErrorCode type is in constants/http.ts)
export {
  AppError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ValidationError,
  TimeoutError,
  isAppError,
  getErrorMessage,
  toAppError,
} from './errors';

export * from './formatters';
export * from './logger';
export * from './performance';
export * from './secureStorage';

// Validation utilities (excluding validate and ValidationError which are in shared/validation)
export {
  validateOrThrow,
  LoginSchema,
  RegisterSchema,
  UpdateUserSchema,
  PasswordSchema,
  EmailSchema,
  type LoginCredentials,
  type RegisterData,
  type UpdateUserData,
} from './validation';
