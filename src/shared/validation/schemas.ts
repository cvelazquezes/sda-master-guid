/**
 * Validation Schemas
 * Comprehensive Zod schemas for all input validation
 * Following Google/Airbnb validation standards
 */

import { z } from 'zod';
import { PASSWORD, TEXT, NUMERIC, MATCH } from '../constants/validation';
import { PAGE } from '../constants/numbers';

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
    .min(NUMERIC.MIN_REQUIRED, 'Email is required')
    .max(TEXT.EMAIL_MAX, 'Email is too long')
    .regex(EMAIL_REGEX, 'Invalid email format')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(PASSWORD.MIN_LENGTH, `Password must be at least ${PASSWORD.MIN_LENGTH} characters`)
    .max(PASSWORD.MAX_LENGTH, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  phone: z.string().regex(PHONE_REGEX, 'Invalid phone number format').optional().or(z.literal('')),

  name: z
    .string()
    .min(NUMERIC.MIN_REQUIRED, 'Name is required')
    .max(TEXT.NAME_MAX, 'Name is too long')
    .trim(),

  uuid: z.string().regex(UUID_REGEX, 'Invalid ID format'),

  url: z.string().url('Invalid URL format').max(TEXT.LONG_TEXT_MAX, 'URL is too long'),

  timezone: z
    .string()
    .min(1, 'Timezone is required')
    .refine(
      (tz) => {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: tz });
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid timezone' }
    ),

  language: z.enum(['en', 'es', 'pt', 'fr'], {
    errorMap: () => ({ message: 'Invalid language code' }),
  }),

  positiveInteger: z.number().int('Must be an integer').positive('Must be positive'),

  nonNegativeInteger: z.number().int('Must be an integer').nonnegative('Must be non-negative'),
};

// ============================================================================
// Authentication Schemas
// ============================================================================

export const AuthSchemas = {
  login: z.object({
    email: CommonSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),

  register: z.object({
    email: CommonSchemas.email,
    password: CommonSchemas.password,
    name: CommonSchemas.name,
    whatsappNumber: CommonSchemas.phone,
    clubId: z.string().min(1, 'Club ID is required'),
  }),

  updateProfile: z.object({
    name: CommonSchemas.name.optional(),
    whatsappNumber: CommonSchemas.phone,
    timezone: CommonSchemas.timezone.optional(),
    language: CommonSchemas.language.optional(),
  }),

  changePassword: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: CommonSchemas.password,
      confirmPassword: z.string().min(1, 'Password confirmation is required'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'New password must be different from current password',
      path: ['newPassword'],
    }),
};

// ============================================================================
// User Schemas
// ============================================================================

export const UserSchemas = {
  create: z.object({
    email: CommonSchemas.email,
    name: CommonSchemas.name,
    role: z.enum(['user', 'club_admin', 'super_admin']),
    clubId: z.string().min(1, 'Club ID is required'),
    whatsappNumber: CommonSchemas.phone,
    timezone: CommonSchemas.timezone,
    language: CommonSchemas.language,
  }),

  update: z.object({
    name: CommonSchemas.name.optional(),
    role: z.enum(['user', 'club_admin', 'super_admin']).optional(),
    whatsappNumber: CommonSchemas.phone,
    timezone: CommonSchemas.timezone.optional(),
    language: CommonSchemas.language.optional(),
    isActive: z.boolean().optional(),
    isPaused: z.boolean().optional(),
  }),

  filter: z.object({
    role: z.enum(['user', 'club_admin', 'super_admin']).optional(),
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
      .min(NUMERIC.MIN_REQUIRED, 'Name is required')
      .max(TEXT.NAME_MAX, 'Name is too long'),
    address: z.string().min(NUMERIC.MIN_REQUIRED, 'Address is required').max(TEXT.MEDIUM_TEXT_MAX),
    city: z.string().min(NUMERIC.MIN_REQUIRED, 'City is required').max(TEXT.NAME_MAX),
    country: z.string().min(NUMERIC.MIN_REQUIRED, 'Country is required').max(TEXT.NAME_MAX),
    timezone: CommonSchemas.timezone,
    numberOfCourts: CommonSchemas.positiveInteger,
    courtNames: z.array(z.string().max(TEXT.SHORT_TEXT_MAX)).optional(),
    settings: z
      .object({
        matchDuration: CommonSchemas.positiveInteger.default(MATCH.DEFAULT_DURATION_MINUTES),
        openingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
        closingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
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
        openingTime: z
          .string()
          .regex(/^\d{2}:\d{2}$/)
          .optional(),
        closingTime: z
          .string()
          .regex(/^\d{2}:\d{2}$/)
          .optional(),
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
    clubId: z.string().min(NUMERIC.MIN_REQUIRED, 'Club ID is required'),
    date: z.string().datetime('Invalid date format'),
    courtNumber: CommonSchemas.positiveInteger,
    duration: CommonSchemas.positiveInteger.default(MATCH.DEFAULT_DURATION_MINUTES),
    participants: z
      .array(z.string().min(NUMERIC.MIN_REQUIRED, 'Participant ID is required'))
      .min(MATCH.MIN_PARTICIPANTS, 'At least 2 participants required')
      .max(MATCH.MAX_PARTICIPANTS, 'Maximum 4 participants allowed'),
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
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  }),

  filter: z.object({
    clubId: z.string().optional(),
    date: z.string().datetime().optional(),
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
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
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),

  idempotencyKey: z
    .string()
    .min(NUMERIC.MIN_REQUIRED, 'Idempotency key is required')
    .max(TEXT.EMAIL_MAX, 'Idempotency key is too long')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Invalid idempotency key format'),
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
      throw new ValidationError('Validation failed', error.errors);
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
    this.name = 'ValidationError';
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
