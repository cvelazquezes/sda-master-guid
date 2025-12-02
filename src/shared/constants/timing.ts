/**
 * Timing Constants
 * Centralized timing values for animations, debounce, timeouts, and polling
 */

export const TIMING = {
  // Debounce Delays (user input)
  DEBOUNCE: {
    SEARCH: 300,        // Search input debounce
    INPUT: 300,         // Generic input debounce
    FAST: 150,          // Quick debounce
    NORMAL: 300,        // Standard debounce
    SLOW: 500,          // Slower debounce
    VALIDATION: 500,    // Form validation debounce
  },

  // Animation Durations
  ANIMATION: {
    INSTANT: 0,
    FAST: 200,          // Quick animations
    NORMAL: 300,        // Standard animations
    SLOW: 500,          // Slower animations
    MODAL: 300,         // Modal open/close
    FADE: 300,          // Fade in/out
    SLIDE: 300,         // Slide transitions
    SPINNER: 1000,      // Loading spinner minimum display
  },

  // Timeouts
  TIMEOUT: {
    SHORT: 3000,        // 3 seconds
    MEDIUM: 5000,       // 5 seconds
    LONG: 10000,        // 10 seconds
    API_REQUEST: 30000, // 30 seconds for API calls
    TOAST: 3000,        // Toast notification display
    ALERT: 5000,        // Alert display duration
  },

  // Polling Intervals
  POLLING: {
    REALTIME: 1000,     // 1 second (real-time updates)
    FAST: 5000,         // 5 seconds
    NORMAL: 10000,      // 10 seconds
    SLOW: 30000,        // 30 seconds
    BACKGROUND: 60000,  // 1 minute (background sync)
  },

  // Retry Delays
  RETRY: {
    FIRST: 1000,        // 1 second
    SECOND: 2000,       // 2 seconds
    THIRD: 4000,        // 4 seconds (exponential backoff)
    MAX: 10000,         // Maximum retry delay
  },

  // Auto-save & Sync
  AUTO_SAVE: {
    DRAFT: 30000,       // 30 seconds
    FORM: 60000,        // 1 minute
  },

  // Cache Expiry
  CACHE: {
    SHORT: 60000,       // 1 minute
    MEDIUM: 300000,     // 5 minutes
    LONG: 3600000,      // 1 hour
    DAY: 86400000,      // 24 hours
  },
} as const;

// Helper to convert seconds to milliseconds
export const seconds = (s: number): number => s * 1000;

// Helper to convert minutes to milliseconds
export const minutes = (m: number): number => m * 60 * 1000;

// Helper to convert hours to milliseconds
export const hours = (h: number): number => h * 60 * 60 * 1000;

// Export type helpers
export type TimingCategory = keyof typeof TIMING;

