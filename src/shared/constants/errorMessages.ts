/**
 * Error Messages Constants
 *
 * Centralized error messages for consistent error handling across the application.
 * Used with custom Error classes (AuthenticationError, AppError, etc.)
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: throw new AuthenticationError('Invalid credentials');
 * ✅ ALWAYS use: throw new AuthenticationError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
 *
 * @version 1.0.0
 */

export const ERROR_MESSAGES = {
  // Authentication Errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_ALREADY_EXISTS: 'User already exists',
    LOGIN_FAILED: 'Login failed',
    REGISTRATION_FAILED: 'Registration failed',
    TOKEN_REFRESH_FAILED: 'Token refresh failed',
    SESSION_EXPIRED: 'Session expired. Please login again.',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    AUTHENTICATION_FAILED: 'Authentication failed',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  },

  // User Errors
  USER: {
    NOT_FOUND: 'User not found',
    UPDATE_FAILED: 'Failed to update user',
    DELETE_FAILED: 'Failed to delete user',
    INVALID_DATA: 'Invalid user data',
  },

  // Network Errors
  NETWORK: {
    REQUEST_FAILED: 'Network request failed',
    CONNECTION_FAILED: 'Connection failed',
    SERVER_ERROR: 'Server error',
    SERVICE_UNAVAILABLE: 'Service unavailable',
  },

  // Timeout Errors
  TIMEOUT: {
    REQUEST_TIMEOUT: 'Request timed out',
    OPERATION_TIMEOUT: 'Operation timed out',
    CONNECTION_TIMEOUT: 'Connection timed out',
  },

  // Rate Limit Errors
  RATE_LIMIT: {
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
    QUOTA_EXCEEDED: 'API quota exceeded',
  },

  // Validation Errors
  VALIDATION: {
    INVALID_INPUT: 'Invalid input',
    REQUIRED_FIELD: 'Required field missing',
    INVALID_FORMAT: 'Invalid format',
    // Field-specific messages
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_TOO_LONG: 'Email is too long',
    EMAIL_INVALID: 'Invalid email format',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_TOO_LONG: 'Password is too long',
    PASSWORD_MIN_LENGTH: (min: number) => `Password must be at least ${min} characters`,
    PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter',
    PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter',
    PASSWORD_NUMBER: 'Password must contain at least one number',
    PASSWORD_SPECIAL: 'Password must contain at least one special character',
    PASSWORD_CONFIRMATION_REQUIRED: 'Password confirmation is required',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
    PASSWORD_MUST_BE_DIFFERENT: 'New password must be different from current password',
    CURRENT_PASSWORD_REQUIRED: 'Current password is required',
    PHONE_INVALID: 'Invalid phone number format',
    WHATSAPP_REQUIRED: 'WhatsApp number is required',
    WHATSAPP_INVALID: 'WhatsApp number must include country code (e.g., +1 555 123 4567)',
    NAME_REQUIRED: 'Name is required',
    NAME_TOO_LONG: 'Name is too long',
    NAME_MIN_LENGTH: (min: number) => `Name must be at least ${min} characters`,
    NAME_INVALID_CHARACTERS: 'Name contains invalid characters',
    ID_INVALID: 'Invalid ID format',
    URL_INVALID: 'Invalid URL format',
    URL_TOO_LONG: 'URL is too long',
    TIMEZONE_REQUIRED: 'Timezone is required',
    TIMEZONE_INVALID: 'Invalid timezone',
    LANGUAGE_INVALID: 'Invalid language code',
    MUST_BE_INTEGER: 'Must be an integer',
    MUST_BE_POSITIVE: 'Must be positive',
    MUST_BE_NON_NEGATIVE: 'Must be non-negative',
    ADDRESS_REQUIRED: 'Address is required',
    CITY_REQUIRED: 'City is required',
    COUNTRY_REQUIRED: 'Country is required',
    CLUB_REQUIRED: 'Club is required',
    CLUB_ID_REQUIRED: 'Club ID is required',
    DATE_INVALID: 'Invalid date format',
    TIME_INVALID: 'Invalid time format',
    PARTICIPANTS_MIN: (min: number) => `At least ${min} participants required`,
    PARTICIPANTS_MAX: (max: number) => `Maximum ${max} participants allowed`,
    PARTICIPANT_ID_REQUIRED: 'Participant ID is required',
    IDEMPOTENCY_KEY_REQUIRED: 'Idempotency key is required',
    IDEMPOTENCY_KEY_TOO_LONG: 'Idempotency key is too long',
    IDEMPOTENCY_KEY_INVALID: 'Invalid idempotency key format',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PASSWORD: 'Invalid password format',
    PASSWORD_TOO_SHORT: 'Password too short',
    PASSWORD_TOO_WEAK: 'Password too weak',
  },

  // Conflict Errors
  CONFLICT: {
    RESOURCE_EXISTS: 'Resource already exists',
    DUPLICATE_ENTRY: 'Duplicate entry',
    VERSION_MISMATCH: 'Version mismatch',
  },

  // Not Found Errors
  NOT_FOUND: {
    RESOURCE: 'Resource not found',
    USER: 'User not found',
    CLUB: 'Club not found',
    MATCH: 'Match not found',
    PAYMENT: 'Payment not found',
  },

  // Conflict Errors
  CONFLICT: {
    RESOURCE: 'Resource conflict',
    DUPLICATE: 'Duplicate entry',
    ALREADY_EXISTS: 'Resource already exists',
  },

  // App Errors (generic)
  APP: {
    UNKNOWN_ERROR: 'An unknown error occurred',
    INTERNAL_ERROR: 'Internal error',
    OPERATION_FAILED: 'Operation failed',
    LOGOUT_FAILED: 'Logout failed',
  },

  // Circuit Breaker Errors
  CIRCUIT_BREAKER: {
    IS_OPEN: (name: string) => `Circuit breaker is OPEN for ${name}`,
    HALF_OPEN_LIMIT: (name: string) => `Circuit breaker half-open limit reached for ${name}`,
  },

  // Request Batcher Errors
  REQUEST_BATCHER: {
    BATCH_CLEARED: 'Batch cleared',
    BATCH_SIZE_MISMATCH: (results: number, keys: number) =>
      `Batch function returned ${results} results for ${keys} keys`,
  },

  // Secure Storage Errors
  SECURE_STORAGE: {
    NOT_AVAILABLE:
      'Secure storage is not available on web platform. Use server-side sessions with httpOnly cookies instead.',
    SAVE_TOKENS_FAILED: 'Failed to save authentication tokens',
    SAVE_USER_ID_FAILED: 'Failed to save user ID',
    SAVE_CSRF_TOKEN_FAILED: 'Failed to save CSRF token',
    SAVE_ITEM_FAILED: (key: string) => `Failed to save item: ${key}`,
    RETRIEVE_ITEM_FAILED: (key: string) => `Failed to retrieve item: ${key}`,
    REMOVE_ITEM_FAILED: (key: string) => `Failed to remove item: ${key}`,
  },
} as const;

/**
 * Error Codes Constants
 *
 * Standardized error codes for AppError and API responses.
 *
 * @version 1.0.0
 */
export const ERROR_CODES = {
  // Auth Codes
  AUTH: {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    UNAUTHORIZED: 'UNAUTHORIZED',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
  },

  // CRUD Codes
  CRUD: {
    CREATE_ERROR: 'CREATE_ERROR',
    READ_ERROR: 'READ_ERROR',
    UPDATE_ERROR: 'UPDATE_ERROR',
    DELETE_ERROR: 'DELETE_ERROR',
    NOT_FOUND: 'NOT_FOUND',
  },

  // Resource Codes
  RESOURCE: {
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    CLUB_NOT_FOUND: 'CLUB_NOT_FOUND',
    MATCH_NOT_FOUND: 'MATCH_NOT_FOUND',
    PAYMENT_NOT_FOUND: 'PAYMENT_NOT_FOUND',
  },

  // Validation Codes
  VALIDATION: {
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_FIELD: 'MISSING_FIELD',
    INVALID_FORMAT: 'INVALID_FORMAT',
  },

  // Network Codes
  NETWORK: {
    TIMEOUT: 'TIMEOUT',
    CONNECTION_FAILED: 'CONNECTION_FAILED',
    SERVER_ERROR: 'SERVER_ERROR',
  },

  // General Codes
  GENERAL: {
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    OPERATION_FAILED: 'OPERATION_FAILED',
    LOGOUT_ERROR: 'LOGOUT_ERROR',
    APP_ERROR: 'APP_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
    CONFLICT_ERROR: 'CONFLICT_ERROR',
    RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  },
} as const;

/**
 * Error class names
 */
export const ERROR_NAME = {
  APP_ERROR: 'AppError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  VALIDATION_ERROR: 'ValidationError',
  NETWORK_ERROR: 'NetworkError',
  TIMEOUT_ERROR: 'TimeoutError',
  NOT_FOUND_ERROR: 'NotFoundError',
  CONFLICT_ERROR: 'ConflictError',
  RATE_LIMIT_ERROR: 'RateLimitError',
  SECURE_STORAGE_ERROR: 'SecureStorageError',
} as const;

/**
 * Axios Error Codes
 * Standard error codes from Axios library
 */
export const AXIOS_ERROR_CODE = {
  ECONNABORTED: 'ECONNABORTED',
  ECONNRESET: 'ECONNRESET',
  ETIMEDOUT: 'ETIMEDOUT',
  CANCELED_ERROR: 'CanceledError',
  ERR_NETWORK: 'ERR_NETWORK',
  ERR_BAD_REQUEST: 'ERR_BAD_REQUEST',
  ERR_BAD_RESPONSE: 'ERR_BAD_RESPONSE',
} as const;

/**
 * Query Key Constants
 * Used for React Query cache key management
 */
export const QUERY_KEY = {
  AUTH: 'auth',
  CURRENT_USER: 'current-user',
  USERS: 'users',
  LIST: 'list',
  DETAIL: 'detail',
  MATCHES: 'matches',
  ROUNDS: 'rounds',
  CLUBS: 'clubs',
  MEMBERS: 'members',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
  INFINITE: 'infinite',
} as const;

/**
 * Query scope constants for filtering queries
 */
export const QUERY_SCOPE = {
  MY: 'my',
  ALL: 'all',
  CLUB: 'club',
} as const;

/**
 * Sort order constants for pagination and queries
 */
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const SORT_ORDERS = Object.values(SORT_ORDER);

/**
 * Sort string parsing delimiters
 */
export const SORT_PARSE = {
  /** Prefix for descending sort (e.g., "-createdAt") */
  DESC_PREFIX: '-',
  /** Delimiter between field and order (e.g., "createdAt:desc") */
  DELIMITER: ':',
} as const;

export type ErrorMessageCategory = keyof typeof ERROR_MESSAGES;
export type ErrorCodeCategory = keyof typeof ERROR_CODES;
export type QueryKey = (typeof QUERY_KEY)[keyof typeof QUERY_KEY];
