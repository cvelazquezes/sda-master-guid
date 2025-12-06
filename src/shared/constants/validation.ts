/**
 * Validation Constants - Single Source of Truth for ALL validation rules
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR VALIDATION & BUSINESS RULES
 * ============================================================================
 *
 * Contains: Form validation, business rules, limits, constraints
 *
 * @version 3.0.0 - Consolidated validation constants
 */
/* eslint-disable no-magic-numbers */

import { BYTE, MS } from './numbers';

// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

export const PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  MIN_LENGTH_STRONG: 10,
  MIN_STRENGTH_REQUIREMENTS: 3,
} as const;

// =============================================================================
// EMAIL VALIDATION
// =============================================================================

export const EMAIL = {
  REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MAX_LENGTH: 254,
} as const;

// =============================================================================
// PHONE/WHATSAPP VALIDATION
// =============================================================================

export const PHONE = {
  REGEX: /^\+?[1-9]\d{1,14}$/,
  NORMALIZE_PATTERN: /[\s()-]/g,
  STRIP_NON_DIGITS: /[^0-9]/g,
  MIN_LENGTH: 10,
  MAX_LENGTH: 15,
} as const;

// =============================================================================
// TEXT FIELD LIMITS
// =============================================================================

export const TEXT = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  TITLE_MAX: 100,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 500,
  SHORT_TEXT_MAX: 50,
  MEDIUM_TEXT_MAX: 200,
  LONG_TEXT_MAX: 2048,
  EMAIL_MAX: 255,
  LANGUAGE_CODE_LENGTH: 2,
} as const;

// =============================================================================
// NUMERIC VALIDATION
// =============================================================================

export const NUMERIC = {
  MIN_REQUIRED: 1,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999.99,
  MIN_MEMBERS: 2,
  MAX_MEMBERS: 1000,
  MIN_AGE: 0,
  MAX_AGE: 150,
  DECIMAL_PLACES: 2,
} as const;

// =============================================================================
// DATE VALIDATION
// =============================================================================

export const DATE = {
  REGEX: {
    ISO: /^\d{4}-\d{2}-\d{2}$/,
    US: /^\d{2}\/\d{2}\/\d{4}$/,
    DATETIME_ISO: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
  },
  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
} as const;

// =============================================================================
// FILE UPLOAD
// =============================================================================

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * BYTE.MB,
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
  DOCUMENT_TYPES: ['application/pdf', 'application/msword'] as const,
} as const;

// =============================================================================
// UUID
// =============================================================================

export const UUID = {
  LENGTH: 36,
  REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  SHORT_LENGTH: 8,
} as const;

// =============================================================================
// CLUB RULES
// =============================================================================

export const CLUB = {
  MIN_MEMBERS: 2,
  MAX_MEMBERS: 100,
  MIN_GROUP_SIZE: 2,
  MAX_GROUP_SIZE: 10,
  DEFAULT_GROUP_SIZE: 2,
} as const;

// =============================================================================
// CLASS SELECTION
// =============================================================================

export const CLASS_SELECTION = {
  MIN: 1,
  MAX: 3,
  EMPTY: 0,
} as const;

// =============================================================================
// MATCH RULES
// =============================================================================

export const MATCH = {
  DEFAULT_DURATION_HOURS: 2,
  DEFAULT_DURATION_MINUTES: 90,
  MIN_PARTICIPANTS: 2,
  MAX_PARTICIPANTS: 4,
  MAX_PARTICIPANTS_EXTENDED: 10,
  DEFAULT_ROUND_COUNT: 5,
} as const;

// =============================================================================
// MEETING RULES
// =============================================================================

export const MEETING = {
  DEFAULT_AGENDA_MINUTES: 10,
} as const;

// =============================================================================
// DAY OF WEEK
// =============================================================================

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
// RETRY RULES (for validation/business rules context)
// =============================================================================

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY_MS: 1000,
  MAX_DELAY_MS: 30000,
  BACKOFF_MULTIPLIER: 2,
} as const;

// =============================================================================
// CIRCUIT BREAKER
// =============================================================================

export const CIRCUIT_BREAKER = {
  FAILURE_THRESHOLD: 5,
  SUCCESS_THRESHOLD: 2,
  TIMEOUT_MS: 60 * MS.SECOND,
  HALF_OPEN_MAX_CALLS: 3,
} as const;

// =============================================================================
// RATE LIMITING
// =============================================================================

export const RATE_LIMIT = {
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_MINUTES: 15,
} as const;

// =============================================================================
// PAYMENT RULES
// =============================================================================

export const PAYMENT = {
  DEFAULT_MONTHLY_FEE: 20.0,
  LATE_PAYMENT_GRACE_DAYS: 7,
  MAX_OUTSTANDING_BALANCE: 1000.0,
} as const;

// =============================================================================
// NOTIFICATION RULES
// =============================================================================

export const NOTIFICATION = {
  MAX_UNREAD: 99,
  RETENTION_DAYS: 30,
} as const;

// =============================================================================
// SESSION RULES
// =============================================================================

export const SESSION = {
  TIMEOUT_MINUTES: 60,
  REFRESH_TOKEN_DAYS: 30,
  ACCESS_TOKEN_MINUTES: 15,
} as const;

// =============================================================================
// ARRAY/COLLECTION LIMITS
// =============================================================================

export const ARRAY_LIMITS = {
  MIN_LENGTH: 0,
  SINGLE_ITEM: 1,
} as const;

// =============================================================================
// LEGACY EXPORTS - For backward compatibility
// =============================================================================

/** @deprecated Use individual exports */
export const VALIDATION = {
  PASSWORD,
  PHONE,
  EMAIL,
  TEXT,
  NUMERIC,
  DATE,
  FILE_UPLOAD,
} as const;

/** @deprecated Use individual exports */
export const BUSINESS_RULES = {
  ...RETRY_CONFIG,
  ...CIRCUIT_BREAKER,
  ...RATE_LIMIT,
  ...PAYMENT,
  ...NOTIFICATION,
  ...SESSION,
  ...CLUB,
  ...MATCH,
} as const;

// Legacy aliases
export const PASSWORD_RULES = PASSWORD;
export const WHATSAPP_RULES = PHONE;
export const EMAIL_RULES = EMAIL;
export const TEXT_RULES = TEXT;
export const NUMERIC_RULES = NUMERIC;
export const DATE_RULES = DATE;
export const FILE_UPLOAD_RULES = FILE_UPLOAD;
export const CLUB_SETTINGS = CLUB;
export const MATCH_RULES = MATCH;
export const RETRY_RULES = RETRY_CONFIG;
export const RATE_LIMITING = RATE_LIMIT;
export const PAYMENT_RULES = PAYMENT;
export const NOTIFICATION_RULES = NOTIFICATION;
export const SESSION_RULES = SESSION;
export const VALIDATION_LIMITS = ARRAY_LIMITS;

// Note: PAGE is defined in numbers.ts to avoid duplication

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type DayOfWeek = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];
