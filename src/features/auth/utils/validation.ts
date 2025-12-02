/**
 * Auth Feature - Validation Schemas
 * 
 * Zod schemas for validating authentication-related inputs.
 * Ensures data integrity and security at the boundaries.
 */

import { z } from 'zod';
import { VALIDATION, MESSAGES } from '../../../shared/constants';

/**
 * Login credentials validation schema
 * 
 * Rules:
 * - Email must be valid format
 * - Password minimum 8 characters (increased from 6 for better security)
 * - Password must contain: uppercase, lowercase, number, special char
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email(MESSAGES.ERRORS.INVALID_EMAIL_ADDRESS)
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(VALIDATION.PASSWORD.MIN_LENGTH, MESSAGES.ERRORS.PASSWORD_TOO_SHORT_8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      MESSAGES.ERRORS.PASSWORD_REQUIREMENTS
    ),
});

/**
 * Registration data validation schema
 * 
 * Rules:
 * - All login schema rules apply
 * - Name minimum 2 characters, maximum 100
 * - Club ID required and non-empty
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email(MESSAGES.ERRORS.INVALID_EMAIL_ADDRESS)
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(VALIDATION.PASSWORD.MIN_LENGTH, MESSAGES.ERRORS.PASSWORD_TOO_SHORT_8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      MESSAGES.ERRORS.PASSWORD_REQUIREMENTS
    ),
  name: z
    .string()
    .min(VALIDATION.TEXT.NAME_MIN_LENGTH, MESSAGES.ERRORS.NAME_TOO_SHORT)
    .max(VALIDATION.TEXT.NAME_MAX_LENGTH, MESSAGES.ERRORS.NAME_TOO_LONG)
    .trim(),
  clubId: z
    .string()
    .min(1, MESSAGES.ERRORS.CLUB_ID_REQUIRED)
    .trim(),
});

/**
 * User update validation schema
 * 
 * Rules:
 * - All fields are optional (partial update)
 * - If provided, must meet minimum requirements
 * - Email must be valid format if changed
 * - Timezone must be valid IANA timezone
 * - Language must be valid ISO 639-1 code
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.TEXT.NAME_MIN_LENGTH, MESSAGES.ERRORS.NAME_TOO_SHORT)
    .max(VALIDATION.TEXT.NAME_MAX_LENGTH, MESSAGES.ERRORS.NAME_TOO_LONG)
    .trim()
    .optional(),
  email: z
    .string()
    .email(MESSAGES.ERRORS.INVALID_EMAIL_ADDRESS)
    .toLowerCase()
    .trim()
    .optional(),
  timezone: z
    .string()
    .regex(/^[A-Za-z_]+\/[A-Za-z_]+$/, MESSAGES.ERRORS.INVALID_TIMEZONE)
    .optional(),
  language: z
    .string()
    .length(VALIDATION.TEXT.LANGUAGE_CODE_LENGTH, MESSAGES.ERRORS.INVALID_LANGUAGE_CODE)
    .toLowerCase()
    .optional(),
  isActive: z.boolean().optional(),
  isPaused: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: MESSAGES.ERRORS.AT_LEAST_ONE_FIELD }
);

/**
 * Password change validation schema
 * 
 * Rules:
 * - Current password required
 * - New password must meet password requirements
 * - New password must be different from current
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, MESSAGES.ERRORS.CURRENT_PASSWORD_REQUIRED),
  newPassword: z
    .string()
    .min(VALIDATION.PASSWORD.MIN_LENGTH, MESSAGES.ERRORS.PASSWORD_TOO_SHORT_8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      MESSAGES.ERRORS.PASSWORD_REQUIREMENTS
    ),
}).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: MESSAGES.ERRORS.PASSWORD_MUST_DIFFER,
    path: ['newPassword'],
  }
);

/**
 * Email validation helper
 * 
 * @param email - Email address to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  try {
    z.string().email().parse(email);
    return true;
  } catch {
    return false;
  }
}

/**
 * Password strength checker
 * 
 * @param password - Password to check
 * @returns Strength level: weak, medium, strong
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) return 'weak';
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);
  
  const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (strength < VALIDATION.PASSWORD.MIN_STRENGTH_REQUIREMENTS || password.length < VALIDATION.PASSWORD.MIN_LENGTH_STRONG) return 'medium';
  return 'strong';
}

