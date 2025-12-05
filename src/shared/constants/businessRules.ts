/**
 * Business Rules Constants - Single Source of Truth for business logic values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL BUSINESS RULE VALUES
 * ============================================================================
 *
 * All business rule-related values should be referenced from here.
 * This ensures type safety, consistency, and easier refactoring.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: if (selectedClasses.length === 3)
 * ✅ ALWAYS use: if (selectedClasses.length === CLASS_SELECTION.maximum)
 *
 * @version 1.0.0
 */

/**
 * Class Selection Rules - For pathfinder class selection
 */
export const CLASS_SELECTION = {
  minimum: 1,
  maximum: 3,
  empty: 0,
} as const;

/**
 * Pagination Rules - For list pagination
 */
export const PAGINATION = {
  defaultPageSize: 20,
  minPageSize: 10,
  maxPageSize: 100,
} as const;

/**
 * Business Validation Rules - For form validation
 */
export const BUSINESS_VALIDATION = {
  minPasswordLength: 6,
  minNameLength: 2,
  maxNameLength: 50,
  maxDescriptionLength: 500,
} as const;

/**
 * Retry Rules - For API retry logic
 */
export const RETRY = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
} as const;

/**
 * Club Settings Rules - For club configuration defaults
 * Note: Using explicit number type to allow numeric operations
 */
export const CLUB_SETTINGS: {
  defaultGroupSize: number;
  minGroupSize: number;
  maxGroupSize: number;
} = {
  defaultGroupSize: 2,
  minGroupSize: 2,
  maxGroupSize: 10,
};

/**
 * Meeting Planner Rules - For meeting agenda configuration
 */
export const MEETING_AGENDA = {
  defaultMinutes: 10,
} as const;

/**
 * Date Calculation Constants - For day of week calculations
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

// Type exports
export type ClassSelectionRule = (typeof CLASS_SELECTION)[keyof typeof CLASS_SELECTION];
export type PaginationRule = (typeof PAGINATION)[keyof typeof PAGINATION];
