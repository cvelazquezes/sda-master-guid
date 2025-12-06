/**
 * Timing Constants - Single Source of Truth for ALL timing values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL TIMING VALUES (in milliseconds)
 * ============================================================================
 *
 * All timing-related values: debounce, animation, timeouts, polling, cache
 *
 * @version 3.0.0 - Consolidated timing constants
 */
/* eslint-disable no-magic-numbers */

import { MS } from './numbers';

// =============================================================================
// DEBOUNCE DELAYS (milliseconds)
// =============================================================================

export const DEBOUNCE = {
  /** 100ms - Very fast */
  INSTANT: 100,
  /** 150ms - Fast */
  FAST: 150,
  /** 300ms - Normal (search) */
  NORMAL: 300,
  /** 500ms - Slow (validation) */
  SLOW: 500,
  /** 1000ms - Very slow */
  VERY_SLOW: 1000,
} as const;

// =============================================================================
// ANIMATION DURATIONS (milliseconds)
// =============================================================================

export const DURATION = {
  /** 0ms - Instant */
  INSTANT: 0,
  /** 50ms - Ultra fast */
  ULTRA_FAST: 50,
  /** 100ms - Micro interactions */
  MICRO: 100,
  /** 150ms - Fast */
  FAST: 150,
  /** 200ms - Fade */
  FADE: 200,
  /** 250ms - Normal */
  NORMAL: 250,
  /** 300ms - Standard (modal, slide) */
  STANDARD: 300,
  /** 350ms - Slow */
  SLOW: 350,
  /** 400ms - Ripple */
  RIPPLE: 400,
  /** 450ms - Long */
  LONG: 450,
  /** 500ms - Slower */
  SLOWER: 500,
  /** 700ms - Slowest */
  SLOWEST: 700,
  /** 1000ms - Spinner minimum */
  SPINNER: 1000,
  /** 1200ms - Skeleton shimmer */
  SHIMMER: 1200,
  /** 1500ms - Pulse */
  PULSE: 1500,
} as const;

// =============================================================================
// TIMEOUTS (milliseconds)
// =============================================================================

export const TIMEOUT = {
  /** 1000ms - 1 second */
  SHORT: 1000,
  /** 3000ms - 3 seconds (toast) */
  TOAST: 3000,
  /** 5000ms - 5 seconds (alert) */
  ALERT: 5000,
  /** 10000ms - 10 seconds (API default) */
  API_DEFAULT: 10000,
  /** 15000ms - 15 seconds */
  MEDIUM: 15000,
  /** 30000ms - 30 seconds (API max) */
  API_MAX: 30000,
  /** 60000ms - 1 minute */
  LONG: 60000,
} as const;

// =============================================================================
// POLLING INTERVALS (milliseconds)
// =============================================================================

export const POLLING = {
  /** 1000ms - Real-time (1 second) */
  REALTIME: MS.SECOND,
  /** 5000ms - Fast (5 seconds) */
  FAST: 5 * MS.SECOND,
  /** 10000ms - Normal (10 seconds) */
  NORMAL: 10 * MS.SECOND,
  /** 30000ms - Slow (30 seconds) */
  SLOW: 30 * MS.SECOND,
  /** 60000ms - Background (1 minute) */
  BACKGROUND: MS.MINUTE,
} as const;

// =============================================================================
// RETRY DELAYS (milliseconds)
// =============================================================================

export const RETRY = {
  /** 1000ms - First retry */
  FIRST: 1000,
  /** 2000ms - Second retry */
  SECOND: 2000,
  /** 4000ms - Third retry */
  THIRD: 4000,
  /** 10000ms - Max delay */
  MAX: 10000,
  /** Backoff multiplier */
  MULTIPLIER: 2,
  /** Jitter range (0-0.5) */
  JITTER: 0.5,
} as const;

// =============================================================================
// AUTO-SAVE INTERVALS (milliseconds)
// =============================================================================

export const AUTO_SAVE = {
  /** 30000ms - Draft (30 seconds) */
  DRAFT: 30 * MS.SECOND,
  /** 60000ms - Form (1 minute) */
  FORM: MS.MINUTE,
} as const;

// =============================================================================
// CACHE EXPIRY (milliseconds)
// =============================================================================

export const CACHE = {
  /** 60000ms - 1 minute */
  SHORT: MS.MINUTE,
  /** 300000ms - 5 minutes */
  MEDIUM: 5 * MS.MINUTE,
  /** 3600000ms - 1 hour */
  LONG: MS.HOUR,
  /** 86400000ms - 24 hours */
  DAY: MS.DAY,
  /** 604800000ms - 1 week */
  WEEK: MS.WEEK,
} as const;

// =============================================================================
// MOCK API DELAYS (milliseconds)
// =============================================================================

export const MOCK_DELAY = {
  /** 300ms - Fast */
  FAST: 300,
  /** 500ms - Normal */
  NORMAL: 500,
  /** 1000ms - Slow */
  SLOW: 1000,
  /** 2000ms - Very slow */
  VERY_SLOW: 2000,
} as const;

// =============================================================================
// RELATIVE TIME THRESHOLDS
// =============================================================================

export const RELATIVE_TIME = {
  /** Show "X minutes ago" if < 60 minutes */
  MINUTES_THRESHOLD: 60,
  /** Show "X hours ago" if < 24 hours */
  HOURS_THRESHOLD: 24,
  /** Show "X days ago" if < 7 days */
  DAYS_THRESHOLD: 7,
} as const;

// =============================================================================
// SCHEDULE DEFAULTS
// =============================================================================

export const SCHEDULE = {
  /** Default days ahead for scheduling */
  DEFAULT_ADVANCE_DAYS: 7,
} as const;

// =============================================================================
// FEEDBACK TIMINGS (milliseconds)
// =============================================================================

export const FEEDBACK = {
  /** Haptic feedback delay */
  HAPTIC_DELAY: 10,
  /** Success message display */
  SUCCESS_DISPLAY: 2000,
  /** Error message display */
  ERROR_DISPLAY: 5000,
  /** Loading spinner minimum */
  LOADING_MIN: 500,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert seconds to milliseconds
 */
export const seconds = (s: number): number => s * MS.SECOND;

/**
 * Convert minutes to milliseconds
 */
export const minutes = (m: number): number => m * MS.MINUTE;

/**
 * Convert hours to milliseconds
 */
export const hours = (h: number): number => h * MS.HOUR;

// =============================================================================
// LEGACY EXPORT - For backward compatibility
// =============================================================================

/**
 * @deprecated Use individual exports instead (DEBOUNCE, DURATION, etc.)
 */
export const TIMING = {
  DEBOUNCE,
  ANIMATION: DURATION,
  DURATION,
  TIMEOUT,
  POLLING,
  RETRY,
  AUTO_SAVE,
  MOCK_API: MOCK_DELAY,
  CACHE,
  MS_PER: MS,
  SCHEDULE,
  RELATIVE_TIME,
  FEEDBACK,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type DebounceKey = keyof typeof DEBOUNCE;
export type DurationKey = keyof typeof DURATION;
export type TimeoutKey = keyof typeof TIMEOUT;
export type PollingKey = keyof typeof POLLING;
export type CacheKey = keyof typeof CACHE;
