/**
 * Validation Schemas
 * Comprehensive Zod schemas for all input validation
 * Following Google/Airbnb validation standards
 */

import { z } from 'zod';
import { PASSWORD, TEXT, NUMERIC, MATCH } from '../constants/validation';
import { PAGE } from '../constants/numbers';
import {
  ERROR_MESSAGES,
  ERROR_NAME,
  USER_ROLES,
  MATCH_STATUSES,
  LANGUAGES_SUPPORTED,
  TIME_REGEX,
  IDEMPOTENCY_KEY_REGEX,
  SORT_ORDER,
  VALIDATION_PATH,
} from '../constants';

// ============================================================================
// Common Validation Rules
// ============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ============================================================================
// Reusable Field Schemas
// ============================================================================

export const CommonSchemas = {
  email: z
    .string()
    .min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED)
    .max(TEXT.EMAIL_MAX, ERROR_MESSAGES.VALIDATION.EMAIL_TOO_LONG)
    .regex(EMAIL_REGEX, ERROR_MESSAGES.VALIDATION.EMAIL_INVALID)
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(PASSWORD.MIN_LENGTH, ERROR_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH(PASSWORD.MIN_LENGTH))
    .max(PASSWORD.MAX_LENGTH, ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_LONG)
    .regex(/[A-Z]/, ERROR_MESSAGES.VALIDATION.PASSWORD_UPPERCASE)
    .regex(/[a-z]/, ERROR_MESSAGES.VALIDATION.PASSWORD_LOWERCASE)
    .regex(/[0-9]/, ERROR_MESSAGES.VALIDATION.PASSWORD_NUMBER)
    .regex(/[^A-Za-z0-9]/, ERROR_MESSAGES.VALIDATION.PASSWORD_SPECIAL),

  phone: z
    .string()
    .regex(PHONE_REGEX, ERROR_MESSAGES.VALIDATION.PHONE_INVALID)
    .optional()
    .or(z.literal('')),

  name: z
    .string()
    .min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.NAME_REQUIRED)
    .max(TEXT.NAME_MAX, ERROR_MESSAGES.VALIDATION.NAME_TOO_LONG)
    .trim(),

  uuid: z.string().regex(UUID_REGEX, ERROR_MESSAGES.VALIDATION.ID_INVALID),

  url: z
    .string()
    .url(ERROR_MESSAGES.VALIDATION.URL_INVALID)
    .max(TEXT.LONG_TEXT_MAX, ERROR_MESSAGES.VALIDATION.URL_TOO_LONG),

  timezone: z
    .string()
    .min(1, ERROR_MESSAGES.VALIDATION.TIMEZONE_REQUIRED)
    .refine(
      (tz) => {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: tz });
          return true;
        } catch {
          return false;
        }
      },
      { message: ERROR_MESSAGES.VALIDATION.TIMEZONE_INVALID }
    ),

  language: z.enum(LANGUAGES_SUPPORTED, {
    errorMap: () => ({ message: ERROR_MESSAGES.VALIDATION.LANGUAGE_INVALID }),
  }),

  positiveInteger: z
    .number()
    .int(ERROR_MESSAGES.VALIDATION.MUST_BE_INTEGER)
    .positive(ERROR_MESSAGES.VALIDATION.MUST_BE_POSITIVE),

  nonNegativeInteger: z
    .number()
    .int(ERROR_MESSAGES.VALIDATION.MUST_BE_INTEGER)
    .nonnegative(ERROR_MESSAGES.VALIDATION.MUST_BE_NON_NEGATIVE),
};

// ============================================================================
// Authentication Schemas
// ============================================================================

export const AuthSchemas = {
  login: z.object({
    email: CommonSchemas.email,
    password: z.string().min(1, ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED),
  }),

  register: z.object({
    email: CommonSchemas.email,
    password: CommonSchemas.password,
    name: CommonSchemas.name,
    whatsappNumber: CommonSchemas.phone,
    clubId: z.string().min(1, ERROR_MESSAGES.VALIDATION.CLUB_ID_REQUIRED),
  }),

  updateProfile: z.object({
    name: CommonSchemas.name.optional(),
    whatsappNumber: CommonSchemas.phone,
    timezone: CommonSchemas.timezone.optional(),
    language: CommonSchemas.language.optional(),
  }),

  changePassword: z
    .object({
      currentPassword: z.string().min(1, ERROR_MESSAGES.VALIDATION.CURRENT_PASSWORD_REQUIRED),
      newPassword: CommonSchemas.password,
      confirmPassword: z.string().min(1, ERROR_MESSAGES.VALIDATION.PASSWORD_CONFIRMATION_REQUIRED),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: ERROR_MESSAGES.VALIDATION.PASSWORDS_DO_NOT_MATCH,
      path: [VALIDATION_PATH.CONFIRM_PASSWORD],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: ERROR_MESSAGES.VALIDATION.PASSWORD_MUST_BE_DIFFERENT,
      path: [VALIDATION_PATH.NEW_PASSWORD],
    }),
};

// ============================================================================
// User Schemas
// ============================================================================

export const UserSchemas = {
  create: z.object({
    email: CommonSchemas.email,
    name: CommonSchemas.name,
    role: z.enum(USER_ROLES),
    clubId: z.string().min(1, ERROR_MESSAGES.VALIDATION.CLUB_ID_REQUIRED),
    whatsappNumber: CommonSchemas.phone,
    timezone: CommonSchemas.timezone,
    language: CommonSchemas.language,
  }),

  update: z.object({
    name: CommonSchemas.name.optional(),
    role: z.enum(USER_ROLES).optional(),
    whatsappNumber: CommonSchemas.phone,
    timezone: CommonSchemas.timezone.optional(),
    language: CommonSchemas.language.optional(),
    isActive: z.boolean().optional(),
    isPaused: z.boolean().optional(),
  }),

  filter: z.object({
    role: z.enum(USER_ROLES).optional(),
    clubId: z.string().optional(),
    isActive: z.boolean().optional(),
    isPaused: z.boolean().optional(),
    search: z.string().max(TEXT.NAME_MAX).optional(),
    page: CommonSchemas.positiveInteger.default(PAGE.DEFAULT_NUMBER),
    pageSize: CommonSchemas.positiveInteger.max(PAGE.MAX_SIZE).default(PAGE.DEFAULT_SIZE),
  }),
};

// ============================================================================
// Club Schemas
// ============================================================================

export const ClubSchemas = {
  create: z.object({
    name: z
      .string()
      .min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.NAME_REQUIRED)
      .max(TEXT.NAME_MAX, ERROR_MESSAGES.VALIDATION.NAME_TOO_LONG),
    address: z
      .string()
      .min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.ADDRESS_REQUIRED)
      .max(TEXT.MEDIUM_TEXT_MAX),
    city: z
      .string()
      .min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.CITY_REQUIRED)
      .max(TEXT.NAME_MAX),
    country: z
      .string()
      .min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.COUNTRY_REQUIRED)
      .max(TEXT.NAME_MAX),
    timezone: CommonSchemas.timezone,
    numberOfCourts: CommonSchemas.positiveInteger,
    courtNames: z.array(z.string().max(TEXT.SHORT_TEXT_MAX)).optional(),
    settings: z
      .object({
        matchDuration: CommonSchemas.positiveInteger.default(MATCH.DEFAULT_DURATION_MINUTES),
        openingTime: z.string().regex(TIME_REGEX, ERROR_MESSAGES.VALIDATION.TIME_INVALID),
        closingTime: z.string().regex(TIME_REGEX, ERROR_MESSAGES.VALIDATION.TIME_INVALID),
        allowBookings: z.boolean().default(true),
      })
      .optional(),
  }),

  update: z.object({
    name: z.string().min(NUMERIC.MIN_REQUIRED).max(TEXT.NAME_MAX).optional(),
    address: z.string().min(NUMERIC.MIN_REQUIRED).max(TEXT.MEDIUM_TEXT_MAX).optional(),
    city: z.string().min(NUMERIC.MIN_REQUIRED).max(TEXT.NAME_MAX).optional(),
    country: z.string().min(NUMERIC.MIN_REQUIRED).max(TEXT.NAME_MAX).optional(),
    timezone: CommonSchemas.timezone.optional(),
    numberOfCourts: CommonSchemas.positiveInteger.optional(),
    courtNames: z.array(z.string().max(TEXT.SHORT_TEXT_MAX)).optional(),
    settings: z
      .object({
        matchDuration: CommonSchemas.positiveInteger.optional(),
        openingTime: z.string().regex(TIME_REGEX).optional(),
        closingTime: z.string().regex(TIME_REGEX).optional(),
        allowBookings: z.boolean().optional(),
      })
      .optional(),
  }),
};

// ============================================================================
// Match Schemas
// ============================================================================

export const MatchSchemas = {
  create: z.object({
    clubId: z.string().min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.CLUB_ID_REQUIRED),
    date: z.string().datetime(ERROR_MESSAGES.VALIDATION.DATE_INVALID),
    courtNumber: CommonSchemas.positiveInteger,
    duration: CommonSchemas.positiveInteger.default(MATCH.DEFAULT_DURATION_MINUTES),
    participants: z
      .array(
        z.string().min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.PARTICIPANT_ID_REQUIRED)
      )
      .min(
        MATCH.MIN_PARTICIPANTS,
        ERROR_MESSAGES.VALIDATION.PARTICIPANTS_MIN(MATCH.MIN_PARTICIPANTS)
      )
      .max(
        MATCH.MAX_PARTICIPANTS,
        ERROR_MESSAGES.VALIDATION.PARTICIPANTS_MAX(MATCH.MAX_PARTICIPANTS)
      ),
    notes: z.string().max(TEXT.DESCRIPTION_MAX).optional(),
  }),

  update: z.object({
    date: z.string().datetime().optional(),
    courtNumber: CommonSchemas.positiveInteger.optional(),
    duration: CommonSchemas.positiveInteger.optional(),
    participants: z
      .array(z.string().min(NUMERIC.MIN_REQUIRED))
      .min(MATCH.MIN_PARTICIPANTS)
      .max(MATCH.MAX_PARTICIPANTS)
      .optional(),
    notes: z.string().max(TEXT.DESCRIPTION_MAX).optional(),
    status: z.enum(MATCH_STATUSES).optional(),
  }),

  filter: z.object({
    clubId: z.string().optional(),
    date: z.string().datetime().optional(),
    status: z.enum(MATCH_STATUSES).optional(),
    participantId: z.string().optional(),
    page: CommonSchemas.positiveInteger.default(PAGE.DEFAULT_NUMBER),
    pageSize: CommonSchemas.positiveInteger.max(PAGE.MAX_SIZE).default(PAGE.DEFAULT_SIZE),
  }),
};

// ============================================================================
// API Request Schemas
// ============================================================================

export const ApiSchemas = {
  pagination: z.object({
    page: CommonSchemas.positiveInteger.default(PAGE.DEFAULT_NUMBER),
    pageSize: CommonSchemas.positiveInteger.max(PAGE.MAX_SIZE).default(PAGE.DEFAULT_SIZE),
    sortBy: z.string().max(TEXT.SHORT_TEXT_MAX).optional(),
    sortOrder: z.enum([SORT_ORDER.ASC, SORT_ORDER.DESC]).default(SORT_ORDER.ASC),
  }),

  idempotencyKey: z
    .string()
    .min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.IDEMPOTENCY_KEY_REQUIRED)
    .max(TEXT.EMAIL_MAX, ERROR_MESSAGES.VALIDATION.IDEMPOTENCY_KEY_TOO_LONG)
    .regex(IDEMPOTENCY_KEY_REGEX, ERROR_MESSAGES.VALIDATION.IDEMPOTENCY_KEY_INVALID),
};

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validates data against a schema and returns parsed data or throws
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_INPUT, error.errors);
    }
    throw error;
  }
}

/**
 * Validates data and returns result object instead of throwing
 */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Custom ValidationError class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: z.ZodIssue[]
  ) {
    super(message);
    this.name = ERROR_NAME.VALIDATION_ERROR;
  }

  /**
   * Formats errors for user display
   */
  getFormattedErrors(): Record<string, string> {
    const formatted: Record<string, string> = {};
    for (const error of this.errors) {
      const path = error.path.join('.');
      formatted[path] = error.message;
    }
    return formatted;
  }

  /**
   * Gets first error message
   */
  getFirstError(): string {
    return this.errors[0]?.message || this.message;
  }
}

// ============================================================================
// Type Exports
// ============================================================================

export type LoginInput = z.infer<typeof AuthSchemas.login>;
export type RegisterInput = z.infer<typeof AuthSchemas.register>;
export type UpdateProfileInput = z.infer<typeof AuthSchemas.updateProfile>;
export type ChangePasswordInput = z.infer<typeof AuthSchemas.changePassword>;

export type CreateUserInput = z.infer<typeof UserSchemas.create>;
export type UpdateUserInput = z.infer<typeof UserSchemas.update>;
export type UserFilterInput = z.infer<typeof UserSchemas.filter>;

export type CreateClubInput = z.infer<typeof ClubSchemas.create>;
export type UpdateClubInput = z.infer<typeof ClubSchemas.update>;

export type CreateMatchInput = z.infer<typeof MatchSchemas.create>;
export type UpdateMatchInput = z.infer<typeof MatchSchemas.update>;
export type MatchFilterInput = z.infer<typeof MatchSchemas.filter>;

export type PaginationInput = z.infer<typeof ApiSchemas.pagination>;
