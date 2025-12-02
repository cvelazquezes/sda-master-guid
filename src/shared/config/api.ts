/**
 * API Configuration
 * 
 * HTTP/network configuration, timeouts, retry policies, and API-related constants.
 * This is the SINGLE SOURCE OF TRUTH for all API/network behavior.
 * 
 * ❌ NEVER write: fetch(url, { timeout: 5000 })
 * ✅ ALWAYS use: fetch(url, { timeout: apiConfig.timeouts.default })
 * 
 * ❌ NEVER write: if (status === 500) { retry() }
 * ✅ ALWAYS use: if (apiConfig.retry.retryableStatuses.includes(status)) { retry() }
 */

// ============================================================================
// TIMEOUT CONFIGURATION
// ============================================================================

export const timeoutConfig = {
  /** Default request timeout (ms) */
  default: 15000,
  /** Short timeout for quick operations */
  short: 5000,
  /** Long timeout for complex operations */
  long: 30000,
  /** Very long timeout for uploads/downloads */
  veryLong: 60000,
  /** File upload timeout */
  upload: 120000,
  /** Real-time connection timeout */
  realtime: 10000,
} as const;

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================

export const retryConfig = {
  /** Maximum number of retry attempts */
  maxAttempts: 3,
  /** Base delay between retries (ms) */
  baseDelay: 1000,
  /** Maximum delay between retries (ms) */
  maxDelay: 10000,
  /** Backoff multiplier for exponential backoff */
  backoffMultiplier: 2,
  /** Jitter factor (0-1) for randomizing delays */
  jitterFactor: 0.1,
  /** HTTP status codes that should trigger a retry */
  retryableStatuses: [408, 429, 500, 502, 503, 504] as const,
  /** Network errors that should trigger a retry */
  retryableErrors: ['NETWORK_ERROR', 'TIMEOUT', 'CONNECTION_RESET'] as const,
} as const;

// ============================================================================
// PAGINATION CONFIGURATION
// ============================================================================

export const paginationConfig = {
  /** Default page size */
  defaultPageSize: 20,
  /** Minimum page size */
  minPageSize: 10,
  /** Maximum page size */
  maxPageSize: 100,
  /** Default starting page */
  defaultPage: 1,
  /** Load more threshold (percentage of list scrolled) */
  loadMoreThreshold: 0.8,
  /** Initial items to render (for virtualization) */
  initialNumToRender: 10,
  /** Window size for virtualization */
  windowSize: 5,
} as const;

// ============================================================================
// RATE LIMITING CONFIGURATION
// ============================================================================

export const rateLimitConfig = {
  /** Maximum requests per minute */
  maxRequestsPerMinute: 60,
  /** Maximum login attempts before lockout */
  maxLoginAttempts: 5,
  /** Lockout duration after max attempts (minutes) */
  lockoutDurationMinutes: 15,
  /** Request throttle window (ms) */
  throttleWindow: 1000,
} as const;

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

export const httpStatus = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ============================================================================
// HTTP METHODS
// ============================================================================

export const httpMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

// ============================================================================
// CONTENT TYPES
// ============================================================================

export const contentTypes = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
} as const;

// ============================================================================
// HEADERS
// ============================================================================

export const headerNames = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  ACCEPT_LANGUAGE: 'Accept-Language',
  CACHE_CONTROL: 'Cache-Control',
  X_REQUEST_ID: 'X-Request-ID',
  X_API_KEY: 'X-API-Key',
  X_CLIENT_VERSION: 'X-Client-Version',
  X_DEVICE_ID: 'X-Device-ID',
} as const;

// ============================================================================
// API ENDPOINTS PREFIXES
// ============================================================================

export const apiPaths = {
  AUTH: '/auth',
  USERS: '/users',
  CLUBS: '/clubs',
  MATCHES: '/matches',
  PAYMENTS: '/payments',
  NOTIFICATIONS: '/notifications',
  CLASSES: '/classes',
  ORGANIZATIONS: '/organizations',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

// ============================================================================
// WEBSOCKET CONFIGURATION
// ============================================================================

export const websocketConfig = {
  /** Reconnection attempts */
  maxReconnectAttempts: 5,
  /** Initial reconnection delay (ms) */
  reconnectDelay: 1000,
  /** Maximum reconnection delay (ms) */
  maxReconnectDelay: 30000,
  /** Heartbeat interval (ms) */
  heartbeatInterval: 30000,
  /** Heartbeat timeout (ms) */
  heartbeatTimeout: 10000,
} as const;

// ============================================================================
// POLLING CONFIGURATION
// ============================================================================

export const pollingConfig = {
  /** Real-time updates (1 second) */
  realtime: 1000,
  /** Fast polling (5 seconds) */
  fast: 5000,
  /** Normal polling (10 seconds) */
  normal: 10000,
  /** Slow polling (30 seconds) */
  slow: 30000,
  /** Background sync (1 minute) */
  background: 60000,
  /** Idle polling (5 minutes) */
  idle: 300000,
} as const;

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const cacheConfig = {
  /** Time-to-live durations (ms) */
  ttl: {
    /** Very short (30 seconds) - for real-time data */
    veryShort: 30 * 1000,
    /** Short (1 minute) */
    short: 60 * 1000,
    /** Medium (5 minutes) */
    medium: 5 * 60 * 1000,
    /** Long (1 hour) */
    long: 60 * 60 * 1000,
    /** Very long (24 hours) */
    veryLong: 24 * 60 * 60 * 1000,
    /** Persistent (7 days) */
    persistent: 7 * 24 * 60 * 60 * 1000,
  },
  /** Maximum items in cache */
  maxItems: {
    api: 50,
    images: 100,
    search: 20,
    user: 10,
  },
  /** Cache strategies */
  strategies: {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
    NETWORK_ONLY: 'network-only',
    CACHE_ONLY: 'cache-only',
  } as const,
} as const;

// ============================================================================
// CIRCUIT BREAKER CONFIGURATION
// ============================================================================

export const circuitBreakerConfig = {
  /** Number of failures before circuit opens */
  failureThreshold: 5,
  /** Number of successes to close circuit */
  successThreshold: 2,
  /** Timeout before attempting to close circuit (ms) */
  timeout: 60000,
  /** Maximum calls allowed in half-open state */
  halfOpenMaxCalls: 3,
} as const;

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================

export const uploadConfig = {
  /** Maximum file sizes (bytes) */
  maxSize: {
    image: 10 * 1024 * 1024,      // 10MB
    document: 25 * 1024 * 1024,   // 25MB
    video: 100 * 1024 * 1024,     // 100MB
    avatar: 5 * 1024 * 1024,      // 5MB
  },
  /** Allowed MIME types */
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    video: ['video/mp4', 'video/quicktime', 'video/webm'],
  },
  /** Chunk size for resumable uploads */
  chunkSize: 1024 * 1024, // 1MB
  /** Maximum concurrent uploads */
  maxConcurrent: 3,
} as const;

// ============================================================================
// COMBINED API CONFIG EXPORT
// ============================================================================

export const apiConfig = {
  timeouts: timeoutConfig,
  retry: retryConfig,
  pagination: paginationConfig,
  rateLimit: rateLimitConfig,
  httpStatus,
  httpMethods,
  contentTypes,
  headers: headerNames,
  paths: apiPaths,
  websocket: websocketConfig,
  polling: pollingConfig,
  cache: cacheConfig,
  circuitBreaker: circuitBreakerConfig,
  upload: uploadConfig,
} as const;

export type ApiConfig = typeof apiConfig;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type HttpStatus = typeof httpStatus[keyof typeof httpStatus];
export type HttpMethod = typeof httpMethods[keyof typeof httpMethods];
export type ContentType = typeof contentTypes[keyof typeof contentTypes];
export type CacheStrategy = typeof cacheConfig.strategies[keyof typeof cacheConfig.strategies];

