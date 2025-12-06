/**
 * HTTP Constants - Single Source of Truth for HTTP/Network values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR HTTP STATUS CODES & NETWORK CONFIG
 * ============================================================================
 *
 * Contains: HTTP status codes, request methods, headers, network config
 *
 * NOTE: For timing values (timeouts, retries), see timing.ts
 * NOTE: For numeric values (sizes, counts), see numbers.ts
 *
 * @version 3.0.0 - HTTP-focused, removed duplicate timing/numeric values
 */
/* eslint-disable no-magic-numbers */

// =============================================================================
// HTTP STATUS CODES
// =============================================================================

/**
 * Successful responses (2xx)
 */
export const HTTP_SUCCESS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
} as const;

/**
 * Client error responses (4xx)
 */
export const HTTP_CLIENT_ERROR = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
} as const;

/**
 * Server error responses (5xx)
 */
export const HTTP_SERVER_ERROR = {
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * All HTTP status codes combined
 */
export const HTTP_STATUS = {
  ...HTTP_SUCCESS,
  ...HTTP_CLIENT_ERROR,
  ...HTTP_SERVER_ERROR,
} as const;

/**
 * Status codes that are safe to retry
 */
export const RETRYABLE_STATUS_CODES = [
  HTTP_STATUS.REQUEST_TIMEOUT,
  HTTP_STATUS.TOO_MANY_REQUESTS,
  HTTP_STATUS.INTERNAL_SERVER_ERROR,
  HTTP_STATUS.BAD_GATEWAY,
  HTTP_STATUS.SERVICE_UNAVAILABLE,
  HTTP_STATUS.GATEWAY_TIMEOUT,
] as const;

// =============================================================================
// HTTP METHODS
// =============================================================================

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

// =============================================================================
// CONTENT TYPES
// =============================================================================

export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const;

// =============================================================================
// HEADERS
// =============================================================================

export const HEADER = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  ACCEPT_LANGUAGE: 'Accept-Language',
  CACHE_CONTROL: 'Cache-Control',
  X_REQUEST_ID: 'X-Request-ID',
  X_CSRF_TOKEN: 'X-CSRF-Token',
  X_API_KEY: 'X-API-Key',
} as const;

// =============================================================================
// AUTHORIZATION
// =============================================================================

export const AUTH_SCHEME = {
  BEARER: 'Bearer',
  BASIC: 'Basic',
} as const;

// =============================================================================
// CACHE CONTROL
// =============================================================================

export const CACHE_CONTROL = {
  NO_CACHE: 'no-cache',
  NO_STORE: 'no-store',
  MUST_REVALIDATE: 'must-revalidate',
} as const;

// =============================================================================
// API RESPONSE STRUCTURE
// =============================================================================

export const API_RESPONSE_FIELD = {
  DATA: 'data',
  ERROR: 'error',
  MESSAGE: 'message',
  STATUS: 'status',
  META: 'meta',
  PAGINATION: 'pagination',
} as const;

// =============================================================================
// ERROR CODES (application-specific)
// =============================================================================

export const ERROR_CODE = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];
export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];
export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
