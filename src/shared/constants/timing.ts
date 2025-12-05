/**
 * Timing Constants - Single Source of Truth for ALL timing values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL TIMING VALUES
 * ============================================================================
 *
 * Contains: Debounce, animation durations, timeouts, polling, cache expiry
 *
 * @version 2.0.0
 */

// =============================================================================
// DEBOUNCE DELAYS
// =============================================================================

/**
 * Debounce Delays - For user input throttling (in milliseconds)
 */
export const DEBOUNCE = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  /** Search input debounce */
  SEARCH: 300,
  /** Form validation debounce */
  VALIDATION: 500,
} as const;

// =============================================================================
// ANIMATION DURATIONS
// =============================================================================

/**
 * Animation Durations - For UI animations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 200,
  NORMAL: 300,
  MEDIUM: 400,
  SLOW: 500,
  /** Modal open/close */
  MODAL: 300,
  /** Fade in/out */
  FADE: 300,
  /** Slide transitions */
  SLIDE: 300,
  /** Loading spinner minimum display */
  SPINNER: 1000,
} as const;

// =============================================================================
// TIMEOUTS
// =============================================================================

/**
 * Timeouts - For operations and display durations (in milliseconds)
 */
export const TIMEOUT = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
  /** API request timeout */
  API_REQUEST: 30000,
  /** Toast notification display */
  TOAST: 3000,
  /** Alert display duration */
  ALERT: 5000,
} as const;

// =============================================================================
// POLLING INTERVALS
// =============================================================================

/**
 * Polling Intervals - For periodic data fetching (in milliseconds)
 */
export const POLLING = {
  /** Real-time updates (1 second) */
  REALTIME: 1000,
  /** Fast polling (5 seconds) */
  FAST: 5000,
  /** Normal polling (10 seconds) */
  NORMAL: 10000,
  /** Slow polling (30 seconds) */
  SLOW: 30000,
  /** Background sync (1 minute) */
  BACKGROUND: 60000,
} as const;

// =============================================================================
// RETRY DELAYS
// =============================================================================

/**
 * Retry Delays - For exponential backoff (in milliseconds)
 */
export const RETRY_DELAY = {
  FIRST: 1000,
  SECOND: 2000,
  THIRD: 4000,
  MAX: 10000,
} as const;

// =============================================================================
// AUTO-SAVE
// =============================================================================

/**
 * Auto-save Intervals (in milliseconds)
 */
export const AUTO_SAVE = {
  /** Draft save interval */
  DRAFT: 30000,
  /** Form save interval */
  FORM: 60000,
} as const;

// =============================================================================
// MOCK API DELAYS
// =============================================================================

/**
 * Mock API Delays - For development/testing (in milliseconds)
 */
export const MOCK_API_DELAY = {
  FAST: 300,
  NORMAL: 500,
  SLOW: 1000,
} as const;

// =============================================================================
// CACHE EXPIRY
// =============================================================================

/**
 * Cache Expiry Times (in milliseconds)
 */
export const CACHE_EXPIRY = {
  /** 1 minute */
  SHORT: 60000,
  /** 5 minutes */
  MEDIUM: 300000,
  /** 1 hour */
  LONG: 3600000,
  /** 24 hours */
  DAY: 86400000,
} as const;

// =============================================================================
// TIME UNITS
// =============================================================================

/**
 * Time Units - Conversion constants (in milliseconds)
 */
export const MS_PER = {
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
} as const;

// =============================================================================
// SCHEDULE DEFAULTS
// =============================================================================

/**
 * Schedule Defaults
 */
export const SCHEDULE = {
  /** Default days ahead for scheduling */
  DEFAULT_ADVANCE_DAYS: 7,
} as const;

// =============================================================================
// RELATIVE TIME THRESHOLDS
// =============================================================================

/**
 * Relative Time Thresholds - For displaying relative time
 */
export const RELATIVE_TIME_THRESHOLD = {
  /** Show minutes if < 60 minutes */
  MINUTES: 60,
  /** Show hours if < 24 hours */
  HOURS: 24,
  /** Show days if < 7 days */
  DAYS: 7,
} as const;

// =============================================================================
// LEGACY EXPORT - For backward compatibility
// =============================================================================

/**
 * @deprecated Use individual exports instead (DEBOUNCE, ANIMATION_DURATION, etc.)
 */
export const TIMING = {
  DEBOUNCE,
  ANIMATION: ANIMATION_DURATION,
  TIMEOUT,
  POLLING,
  RETRY: RETRY_DELAY,
  AUTO_SAVE,
  MOCK_API: MOCK_API_DELAY,
  CACHE: CACHE_EXPIRY,
  MS_PER,
  SCHEDULE,
  RELATIVE_TIME: RELATIVE_TIME_THRESHOLD,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert seconds to milliseconds
 */
export const seconds = (s: number): number => s * MS_PER.SECOND;

/**
 * Convert minutes to milliseconds
 */
export const minutes = (m: number): number => m * MS_PER.MINUTE;

/**
 * Convert hours to milliseconds
 */
export const hours = (h: number): number => h * MS_PER.HOUR;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type DebounceKey = keyof typeof DEBOUNCE;
export type AnimationDurationKey = keyof typeof ANIMATION_DURATION;
export type TimeoutKey = keyof typeof TIMEOUT;
export type PollingKey = keyof typeof POLLING;
export type CacheExpiryKey = keyof typeof CACHE_EXPIRY;
