/**
 * App Constants - Application metadata and version info
 *
 * @version 1.0.0
 */

/**
 * Application Version
 */
export const APP_VERSION = '1.0.0' as const;

/**
 * Application Info
 */
export const APP_INFO = {
  name: 'SDA Master Guide',
  version: APP_VERSION,
  bundleId: 'com.sda.masterguide',
} as const;

/**
 * Platform OS Constants
 * Use these instead of string literals for Platform.OS comparisons
 */
export const PLATFORM_OS = {
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
} as const;

/**
 * JavaScript typeof return values
 * Used for type checking consistency
 */
export const TYPEOF = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  FUNCTION: 'function',
  UNDEFINED: 'undefined',
  SYMBOL: 'symbol',
  BIGINT: 'bigint',
} as const;

/**
 * Common object property names for type guards
 */
export const OBJECT_PROPERTY = {
  RESPONSE: 'response',
  MESSAGE: 'message',
  CODE: 'code',
  STATUS: 'status',
  DATA: 'data',
  ERROR: 'error',
} as const;

/**
 * User roles
 */
export const USER_ROLE = {
  USER: 'user',
  CLUB_ADMIN: 'club_admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const USER_ROLES = [USER_ROLE.USER, USER_ROLE.CLUB_ADMIN, USER_ROLE.SUPER_ADMIN] as const;

/**
 * Match statuses
 */
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const MATCH_STATUSES = [
  MATCH_STATUS.SCHEDULED,
  MATCH_STATUS.IN_PROGRESS,
  MATCH_STATUS.COMPLETED,
  MATCH_STATUS.CANCELLED,
] as const;

/**
 * Supported languages
 */
export const LANGUAGE = {
  EN: 'en',
  ES: 'es',
  PT: 'pt',
  FR: 'fr',
} as const;

export const LANGUAGES_SUPPORTED = [LANGUAGE.EN, LANGUAGE.ES, LANGUAGE.PT, LANGUAGE.FR] as const;

/**
 * Time format regex
 */
export const TIME_REGEX = /^\d{2}:\d{2}$/;

/**
 * Idempotency key regex
 */
export const IDEMPOTENCY_KEY_REGEX = /^[a-zA-Z0-9-_]+$/;

/**
 * Query parameter names
 */
export const QUERY_PARAM = {
  LIMIT: 'limit',
  CURSOR: 'cursor',
  ORDER: 'order',
  PAGE: 'page',
  PAGE_SIZE: 'pageSize',
  SORT_BY: 'sortBy',
  SORT_ORDER: 'sortOrder',
} as const;

/**
 * StatusBar styles
 */
export const STATUS_BAR_STYLE = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark',
  INVERTED: 'inverted',
} as const;

/**
 * Circuit breaker states
 */
export const CIRCUIT_STATE = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN',
} as const;

/**
 * Circuit breaker service names
 */
export const CIRCUIT_BREAKER_SERVICE = {
  API: 'API',
  AUTH: 'Auth',
  SEARCH: 'Search',
  PAYMENTS: 'Payments',
} as const;

/**
 * Deduplication key prefixes
 */
export const DEDUP_KEY_PREFIX = {
  USER: 'user:',
  CLUB: 'club:',
  MATCH: 'match:',
  PAYMENT: 'payment:',
} as const;

/**
 * Sentry severity levels
 */
export const SENTRY_LEVEL = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

/**
 * Sentry operation types
 */
export const SENTRY_OP = {
  PERFORMANCE: 'performance',
  HTTP: 'http',
  DB: 'db',
  UI: 'ui',
} as const;

/**
 * Sentry breadcrumb categories
 */
export const SENTRY_CATEGORY = {
  NAVIGATION: 'navigation',
  SECURITY: 'security',
  UI: 'ui',
  HTTP: 'http',
} as const;

/**
 * Sentry tag keys
 */
export const SENTRY_TAG = {
  EVENT_TYPE: 'event_type',
  SECURITY: 'security',
} as const;

/**
 * Sentry tag values
 */
export const SENTRY_TAG_VALUE = {
  TRUE: 'true',
  FALSE: 'false',
} as const;

/**
 * Security event types
 */
export const SECURITY_EVENT = {
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  PERMISSION_DENIED: 'permission_denied',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  TOKEN_REFRESH: 'token_refresh',
  TOKEN_EXPIRED: 'token_expired',
} as const;

/**
 * Sentry distribution identifier
 */
export const SENTRY_DIST = '1';

/**
 * Array format types for query string serialization
 */
export const ARRAY_FORMAT = {
  REPEAT: 'repeat',
  BRACKET: 'bracket',
  COMMA: 'comma',
} as const;

export type ArrayFormatType = (typeof ARRAY_FORMAT)[keyof typeof ARRAY_FORMAT];

/**
 * Zod validation path names
 */
export const VALIDATION_PATH = {
  CONFIRM_PASSWORD: 'confirmPassword',
  NEW_PASSWORD: 'newPassword',
  CURRENT_PASSWORD: 'currentPassword',
  EMAIL: 'email',
  PASSWORD: 'password',
} as const;

/**
 * Sentry release format
 */
export const SENTRY_RELEASE_PREFIX = 'sda-master-guid@';

/**
 * Health check status values
 */
export const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
} as const;

/**
 * Health check names
 */
export const HEALTH_CHECK_NAME = {
  API: 'api',
  MEMORY: 'memory',
  CONFIG: 'config',
  DATABASE: 'database',
  CACHE: 'cache',
} as const;

/**
 * Network status values
 */
export const NETWORK_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  UNKNOWN: 'unknown',
} as const;

export type NetworkStatusType = (typeof NETWORK_STATUS)[keyof typeof NETWORK_STATUS];

/**
 * Rate limiter names
 */
export const RATE_LIMITER_NAME = {
  API: 'api',
  AUTH: 'auth',
  SEARCH: 'search',
  HEAVY: 'heavy',
  DEFAULT: 'default',
} as const;

/**
 * Breadcrumb categories
 */
export const BREADCRUMB_CATEGORY = {
  NETWORK: 'network',
  AUTH: 'auth',
  NAVIGATION: 'navigation',
  USER: 'user',
} as const;

/**
 * Breadcrumb levels
 */
export const BREADCRUMB_LEVEL = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  DEBUG: 'debug',
} as const;

// Type exports
export type AppVersion = typeof APP_VERSION;
export type PlatformOS = (typeof PLATFORM_OS)[keyof typeof PLATFORM_OS];
