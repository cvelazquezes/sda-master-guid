/**
 * Input Validation Utilities
 * Using Zod for type-safe validation
 */

import { z } from 'zod';
import { PASSWORD_RULES, TEXT_RULES } from '../constants/validation';

// Password validation schema
export const PasswordSchema = z
  .string()
  .min(
    PASSWORD_RULES.MIN_LENGTH,
    `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters`
  )
  .max(PASSWORD_RULES.MAX_LENGTH, 'Password too long')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

// Email validation schema
export const EmailSchema = z
  .string()
  .email('Invalid email address')
  .max(TEXT_RULES.EMAIL_MAX, 'Email too long')
  .toLowerCase();

// Login credentials schema
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

// Registration schema
export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: z
    .string()
    .min(TEXT_RULES.NAME_MIN, `Name must be at least ${TEXT_RULES.NAME_MIN} characters`)
    .max(TEXT_RULES.NAME_MAX, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  clubId: z.string().min(1, 'Club is required'),
});

export type RegisterData = z.infer<typeof RegisterSchema>;

// User update schema
export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(TEXT_RULES.NAME_MIN, `Name must be at least ${TEXT_RULES.NAME_MIN} characters`)
    .max(TEXT_RULES.NAME_MAX, 'Name too long')
    .optional(),
  timezone: z.string().optional(),
  language: z.string().length(TEXT_RULES.LANGUAGE_CODE_LENGTH).optional(),
  isPaused: z.boolean().optional(),
});

export type UpdateUserData = z.infer<typeof UpdateUserSchema>;

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates input and throws ValidationError if invalid
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new ValidationError(firstError.message, firstError.path.join('.'), data);
    }
    throw error;
  }
}

/**
 * Validates input and returns result with errors
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map((e) => e.message),
  };
}
