/**
 * Validation Constants - Single Source of Truth for ALL validation rules
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL VALIDATION & BUSINESS RULES
 * ============================================================================
 *
 * Consolidated from: validation.ts + businessRules.ts
 *
 * @version 2.0.0
 */

// =============================================================================
// FORM VALIDATION RULES
// =============================================================================

/**
 * Password Validation Rules
 * NOTE: MIN_LENGTH is 8 (security best practice)
 */
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  MIN_LENGTH_STRONG: 10,
  REQUIRE_UPPERCASE: false,
  REQUIRE_LOWERCASE: false,
  REQUIRE_NUMBER: false,
  REQUIRE_SPECIAL_CHAR: false,
  MIN_STRENGTH_REQUIREMENTS: 3,
} as const;

/**
 * Email Validation Rules
 */
export const EMAIL_RULES = {
  REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MAX_LENGTH: 254,
} as const;

/**
 * WhatsApp Number Validation Rules
 */
export const WHATSAPP_RULES = {
  REGEX: /^\+?[1-9]\d{1,14}$/,
  NORMALIZE_PATTERN: /[\s()-]/g,
  STRIP_NON_DIGITS: /[^0-9]/g,
  MIN_LENGTH: 10,
  MAX_LENGTH: 15,
} as const;

/**
 * Text Field Validation Rules
 */
export const TEXT_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  TITLE_MAX_LENGTH: 100,
  LANGUAGE_CODE_LENGTH: 2,
} as const;

/**
 * Numeric Validation Rules
 */
export const NUMERIC_RULES = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999.99,
  MIN_MEMBERS: 2,
  MAX_MEMBERS: 1000,
  MIN_AGE: 0,
  MAX_AGE: 150,
} as const;

// =============================================================================
// DATE VALIDATION
// =============================================================================

/**
 * Date Validation Rules
 */
export const DATE_RULES = {
  REGEX: {
    ISO: /^\d{4}-\d{2}-\d{2}$/,
    US: /^\d{2}\/\d{2}\/\d{4}$/,
    DATETIME_ISO: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
  },
  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
} as const;

// =============================================================================
// FILE UPLOAD VALIDATION
// =============================================================================

/**
 * File Upload Rules
 */
export const FILE_UPLOAD_RULES = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const;

// =============================================================================
// PAGINATION RULES
// =============================================================================

/**
 * Pagination Rules - For list pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MIN_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// =============================================================================
// BUSINESS RULES - Selection & Limits
// =============================================================================

/**
 * Class Selection Rules - For pathfinder class selection
 */
export const CLASS_SELECTION = {
  MINIMUM: 1,
  MAXIMUM: 3,
  EMPTY: 0,
  // Legacy camelCase aliases
  minimum: 1,
  maximum: 3,
  empty: 0,
} as const;

/**
 * Club Settings Rules - For club configuration defaults
 */
export const CLUB_SETTINGS = {
  DEFAULT_GROUP_SIZE: 2,
  MIN_GROUP_SIZE: 2,
  MAX_GROUP_SIZE: 10,
  MIN_MEMBERS: 2,
  MAX_MEMBERS: 100,
  // Legacy camelCase aliases
  defaultGroupSize: 2,
  minGroupSize: 2,
  maxGroupSize: 10,
} as const;

/**
 * Match Rules - For match generation and management
 */
export const MATCH_RULES = {
  DEFAULT_DURATION_HOURS: 2,
  MIN_PARTICIPANTS: 2,
  MAX_PARTICIPANTS: 10,
} as const;

/**
 * Meeting Agenda Rules - For meeting configuration
 */
export const MEETING_AGENDA = {
  DEFAULT_MINUTES: 10,
} as const;

// =============================================================================
// BUSINESS RULES - Day of Week
// =============================================================================

/**
 * Day of Week Constants - For day calculations
 */
export const DAY_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  DAYS_IN_WEEK: 7,
} as const;

// =============================================================================
// BUSINESS RULES - Retry & Resilience
// =============================================================================

/**
 * Retry Rules - For API retry logic
 */
export const RETRY_RULES = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY_MS: 1000,
  MAX_DELAY_MS: 30000,
  BACKOFF_MULTIPLIER: 2,
} as const;

/**
 * Circuit Breaker Rules
 */
export const CIRCUIT_BREAKER = {
  FAILURE_THRESHOLD: 5,
  SUCCESS_THRESHOLD: 2,
  TIMEOUT_MS: 60000,
  HALF_OPEN_MAX_CALLS: 3,
} as const;

/**
 * HTTP Retryable Status Codes
 */
export const RETRYABLE_HTTP_STATUSES = [408, 429, 500, 502, 503, 504] as const;

// =============================================================================
// BUSINESS RULES - Rate Limiting & Security
// =============================================================================

/**
 * Rate Limiting Rules
 */
export const RATE_LIMITING = {
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION_MINUTES: 15,
} as const;

// =============================================================================
// BUSINESS RULES - Payment & Fees
// =============================================================================

/**
 * Payment Rules
 */
export const PAYMENT_RULES = {
  DEFAULT_MONTHLY_FEE: 20.0,
  LATE_PAYMENT_GRACE_DAYS: 7,
  MAX_OUTSTANDING_BALANCE: 1000.0,
} as const;

// =============================================================================
// BUSINESS RULES - Notifications
// =============================================================================

/**
 * Notification Rules
 */
export const NOTIFICATION_RULES = {
  MAX_UNREAD: 99,
  RETENTION_DAYS: 30,
} as const;

// =============================================================================
// BUSINESS RULES - Session & Auth
// =============================================================================

/**
 * Session Rules
 */
export const SESSION_RULES = {
  TIMEOUT_MINUTES: 60,
  REFRESH_TOKEN_VALIDITY_DAYS: 30,
  ACCESS_TOKEN_VALIDITY_MINUTES: 15,
} as const;

// =============================================================================
// ARRAY/COLLECTION LIMITS
// =============================================================================

/**
 * Collection Limits
 */
export const LIMITS = {
  MIN_ARRAY_LENGTH: 0,
  MIN_SELECTED_ITEMS: 1,
  SINGLE_ITEM: 1,
  MIN_PATHFINDER_CLASSES: 1,
} as const;

// =============================================================================
// LEGACY EXPORTS - For backward compatibility
// =============================================================================

/**
 * @deprecated Use individual rule exports instead
 */
export const VALIDATION = {
  PASSWORD: PASSWORD_RULES,
  WHATSAPP: WHATSAPP_RULES,
  EMAIL: EMAIL_RULES,
  TEXT: TEXT_RULES,
  NUMBERS: NUMERIC_RULES,
  PAGINATION,
  FILE_UPLOAD: FILE_UPLOAD_RULES,
} as const;

/**
 * @deprecated Use DATE_RULES instead
 */
export const DATE_VALIDATION = DATE_RULES;

/**
 * @deprecated Use individual rule exports instead
 */
export const BUSINESS_RULES = {
  MAX_RETRY_ATTEMPTS: RETRY_RULES.MAX_ATTEMPTS,
  RETRY_BASE_DELAY_MS: RETRY_RULES.INITIAL_DELAY_MS,
  RETRY_MAX_DELAY_MS: RETRY_RULES.MAX_DELAY_MS,
  RETRY_BACKOFF_MULTIPLIER: RETRY_RULES.BACKOFF_MULTIPLIER,
  CIRCUIT_BREAKER_FAILURE_THRESHOLD: CIRCUIT_BREAKER.FAILURE_THRESHOLD,
  CIRCUIT_BREAKER_SUCCESS_THRESHOLD: CIRCUIT_BREAKER.SUCCESS_THRESHOLD,
  CIRCUIT_BREAKER_TIMEOUT_MS: CIRCUIT_BREAKER.TIMEOUT_MS,
  CIRCUIT_BREAKER_HALF_OPEN_MAX_CALLS: CIRCUIT_BREAKER.HALF_OPEN_MAX_CALLS,
  RETRYABLE_HTTP_STATUSES,
  MAX_REQUESTS_PER_MINUTE: RATE_LIMITING.MAX_REQUESTS_PER_MINUTE,
  MAX_LOGIN_ATTEMPTS: RATE_LIMITING.MAX_LOGIN_ATTEMPTS,
  LOGIN_LOCKOUT_DURATION_MINUTES: RATE_LIMITING.LOGIN_LOCKOUT_DURATION_MINUTES,
  MIN_CLUB_MEMBERS: CLUB_SETTINGS.MIN_MEMBERS,
  MAX_CLUB_MEMBERS: CLUB_SETTINGS.MAX_MEMBERS,
  DEFAULT_MATCH_DURATION_HOURS: MATCH_RULES.DEFAULT_DURATION_HOURS,
  MIN_MATCH_PARTICIPANTS: MATCH_RULES.MIN_PARTICIPANTS,
  MAX_MATCH_PARTICIPANTS: MATCH_RULES.MAX_PARTICIPANTS,
  DEFAULT_MONTHLY_FEE: PAYMENT_RULES.DEFAULT_MONTHLY_FEE,
  LATE_PAYMENT_GRACE_DAYS: PAYMENT_RULES.LATE_PAYMENT_GRACE_DAYS,
  MAX_OUTSTANDING_BALANCE: PAYMENT_RULES.MAX_OUTSTANDING_BALANCE,
  MAX_UNREAD_NOTIFICATIONS: NOTIFICATION_RULES.MAX_UNREAD,
  NOTIFICATION_RETENTION_DAYS: NOTIFICATION_RULES.RETENTION_DAYS,
  SESSION_TIMEOUT_MINUTES: SESSION_RULES.TIMEOUT_MINUTES,
  REFRESH_TOKEN_VALIDITY_DAYS: SESSION_RULES.REFRESH_TOKEN_VALIDITY_DAYS,
  ACCESS_TOKEN_VALIDITY_MINUTES: SESSION_RULES.ACCESS_TOKEN_VALIDITY_MINUTES,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ClassSelectionRule = (typeof CLASS_SELECTION)[keyof typeof CLASS_SELECTION];
export type PaginationRule = (typeof PAGINATION)[keyof typeof PAGINATION];
export type DayOfWeek = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];
export type ValidationKey = keyof typeof VALIDATION;
export type LimitKey = keyof typeof LIMITS;
