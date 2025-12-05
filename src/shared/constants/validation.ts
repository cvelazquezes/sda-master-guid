/**
 * Validation Constants
 * Centralized validation rules, limits, and patterns
 */

export const VALIDATION = {
  // Password Rules
  PASSWORD: {
    MIN_LENGTH: 8, // Increased from 6 for better security
    MAX_LENGTH: 128,
    MIN_LENGTH_STRONG: 10, // For strong password requirement
    REQUIRE_UPPERCASE: false,
    REQUIRE_LOWERCASE: false,
    REQUIRE_NUMBER: false,
    REQUIRE_SPECIAL_CHAR: false,
    MIN_STRENGTH_REQUIREMENTS: 3, // Minimum number of character types required
  },

  // WhatsApp Number
  WHATSAPP: {
    REGEX: /^\+?[1-9]\d{1,14}$/,
    NORMALIZE_PATTERN: /[\s()-]/g,
    STRIP_NON_DIGITS: /[^0-9]/g,
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },

  // Email
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 254,
  },

  // Text Fields
  TEXT: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 500,
    TITLE_MAX_LENGTH: 100,
    LANGUAGE_CODE_LENGTH: 2,
  },

  // Numeric Limits
  NUMBERS: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 999999.99,
    MIN_MEMBERS: 2,
    MAX_MEMBERS: 1000,
    MIN_AGE: 0,
    MAX_AGE: 150,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    MIN_PAGE_SIZE: 10,
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
  },
} as const;

// Date Validation
export const DATE_VALIDATION = {
  DATE_REGEX: {
    ISO: /^\d{4}-\d{2}-\d{2}$/,
    US: /^\d{2}\/\d{2}\/\d{4}$/,
    DATETIME_ISO: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
  },

  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
} as const;

// Business Rules
export const BUSINESS_RULES = {
  // Retry Logic
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_BASE_DELAY_MS: 1000,
  RETRY_MAX_DELAY_MS: 30000,
  RETRY_BACKOFF_MULTIPLIER: 2,

  // Circuit Breaker
  CIRCUIT_BREAKER_FAILURE_THRESHOLD: 5,
  CIRCUIT_BREAKER_SUCCESS_THRESHOLD: 2,
  CIRCUIT_BREAKER_TIMEOUT_MS: 60000,
  CIRCUIT_BREAKER_HALF_OPEN_MAX_CALLS: 3,

  // HTTP Retryable Status Codes
  RETRYABLE_HTTP_STATUSES: [408, 429, 500, 502, 503, 504],

  // Rate Limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION_MINUTES: 15,

  // Club Management
  MIN_CLUB_MEMBERS: 2,
  MAX_CLUB_MEMBERS: 100,
  DEFAULT_MATCH_DURATION_HOURS: 2,
  MIN_MATCH_PARTICIPANTS: 2,
  MAX_MATCH_PARTICIPANTS: 10,

  // Payment & Fees
  DEFAULT_MONTHLY_FEE: 20.0,
  LATE_PAYMENT_GRACE_DAYS: 7,
  MAX_OUTSTANDING_BALANCE: 1000.0,

  // Notifications
  MAX_UNREAD_NOTIFICATIONS: 99,
  NOTIFICATION_RETENTION_DAYS: 30,

  // Session Management
  SESSION_TIMEOUT_MINUTES: 60,
  REFRESH_TOKEN_VALIDITY_DAYS: 30,
  ACCESS_TOKEN_VALIDITY_MINUTES: 15,
} as const;

// Array/Collection Limits
export const LIMITS = {
  MIN_ARRAY_LENGTH: 0,
  MIN_SELECTED_ITEMS: 1,
  SINGLE_ITEM: 1,
  MIN_PATHFINDER_CLASSES: 1,
} as const;

// Export type helpers
export type ValidationKey = keyof typeof VALIDATION;
export type BusinessRuleKey = keyof typeof BUSINESS_RULES;
export type LimitKey = keyof typeof LIMITS;
