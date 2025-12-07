/**
 * Input Validation Utilities
 * Using Zod for type-safe validation
 */

import { z } from 'zod';
import { PASSWORD, TEXT, PHONE, NAME, NUMERIC } from '../shared/constants/validation';
import { EMPTY_VALUE, ERROR_MESSAGES, ERROR_NAME, STRING_DELIMITER } from '../shared/constants';

// Password validation schema
export const PasswordSchema = z
  .string()
  .min(PASSWORD.MIN_LENGTH, ERROR_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH(PASSWORD.MIN_LENGTH))
  .max(PASSWORD.MAX_LENGTH, ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_LONG)
  .regex(PASSWORD.REGEX.UPPERCASE, ERROR_MESSAGES.VALIDATION.PASSWORD_UPPERCASE)
  .regex(PASSWORD.REGEX.LOWERCASE, ERROR_MESSAGES.VALIDATION.PASSWORD_LOWERCASE)
  .regex(PASSWORD.REGEX.NUMBER, ERROR_MESSAGES.VALIDATION.PASSWORD_NUMBER)
  .regex(PASSWORD.REGEX.SPECIAL, ERROR_MESSAGES.VALIDATION.PASSWORD_SPECIAL);

// Email validation schema
export const EmailSchema = z
  .string()
  .email(ERROR_MESSAGES.VALIDATION.EMAIL_INVALID)
  .max(TEXT.MEDIUM_TEXT_MAX, ERROR_MESSAGES.VALIDATION.EMAIL_TOO_LONG)
  .toLowerCase();

// Login credentials schema
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

// WhatsApp number validation schema
export const WhatsAppSchema = z
  .string()
  .min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.WHATSAPP_REQUIRED)
  .regex(PHONE.REGEX, ERROR_MESSAGES.VALIDATION.WHATSAPP_INVALID)
  .transform((val) => val.replace(PHONE.NORMALIZE_PATTERN, EMPTY_VALUE)); // Remove formatting characters

// Registration schema
export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: z
    .string()
    .min(TEXT.NAME_MIN, ERROR_MESSAGES.VALIDATION.NAME_MIN_LENGTH(TEXT.NAME_MIN))
    .max(TEXT.NAME_MAX, ERROR_MESSAGES.VALIDATION.NAME_TOO_LONG)
    .regex(NAME.REGEX, ERROR_MESSAGES.VALIDATION.NAME_INVALID_CHARACTERS),
  whatsappNumber: WhatsAppSchema,
  clubId: z.string().min(NUMERIC.MIN_REQUIRED, ERROR_MESSAGES.VALIDATION.CLUB_REQUIRED), // User gets hierarchy from club
});

export type RegisterData = z.infer<typeof RegisterSchema>;

// User update schema
export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(TEXT.NAME_MIN, ERROR_MESSAGES.VALIDATION.NAME_MIN_LENGTH(TEXT.NAME_MIN))
    .max(TEXT.NAME_MAX, ERROR_MESSAGES.VALIDATION.NAME_TOO_LONG)
    .optional(),
  timezone: z.string().optional(),
  language: z.string().length(TEXT.LANGUAGE_CODE_LENGTH).optional(),
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
    this.name = ERROR_NAME.VALIDATION_ERROR;
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
      throw new ValidationError(
        firstError.message,
        firstError.path.join(STRING_DELIMITER.DOT),
        data
      );
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
