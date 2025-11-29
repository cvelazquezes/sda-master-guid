/**
 * Auth Feature - Validation Schemas
 * 
 * Zod schemas for validating authentication-related inputs.
 * Ensures data integrity and security at the boundaries.
 */

import { z } from 'zod';

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
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
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
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  clubId: z
    .string()
    .min(1, 'Club ID is required')
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
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .optional(),
  timezone: z
    .string()
    .regex(/^[A-Za-z_]+\/[A-Za-z_]+$/, 'Invalid timezone format')
    .optional(),
  language: z
    .string()
    .length(2, 'Language code must be 2 characters')
    .toLowerCase()
    .optional(),
  isActive: z.boolean().optional(),
  isPaused: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
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
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
}).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: 'New password must be different from current password',
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
  if (password.length < 8) return 'weak';
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);
  
  const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (strength < 3 || password.length < 10) return 'medium';
  return 'strong';
}

