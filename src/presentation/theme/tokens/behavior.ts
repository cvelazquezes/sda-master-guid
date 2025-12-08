/**
 * Behavior Design Tokens
 *
 * UI behavior configuration that affects user experience.
 * These tokens drive ALL interaction patterns across the codebase.
 *
 * ❌ NEVER write: setTimeout(fn, 3000), debounceTime = 300
 * ✅ ALWAYS use: setTimeout(fn, behaviorTokens.feedback.toastDuration)
 *
 * NOTE: This file intentionally contains literal numbers as it DEFINES the behavior tokens.
 */

// ============================================================================
// TIMING TOKENS (UI-specific)
// ============================================================================

/**
 * UI timing configurations
 * For animations, see motion.ts. These are for UI behavior timing.
 */
export const timingTokens = {
  /** Debounce delays for user input */
  debounce: {
    /** Search input - wait for user to stop typing */
    search: 300,
    /** Generic input debounce */
    input: 300,
    /** Fast debounce for quick interactions */
    fast: 150,
    /** Standard debounce */
    normal: 300,
    /** Slow debounce for expensive operations */
    slow: 500,
    /** Form validation debounce */
    validation: 500,
  },

  /** Throttle intervals */
  throttle: {
    /** Scroll events */
    scroll: 100,
    /** Resize events */
    resize: 250,
    /** Rapid button press protection */
    buttonPress: 500,
  },

  /** Auto-dismiss durations */
  autoDismiss: {
    /** Toast/snackbar display time */
    toast: 3000,
    /** Success feedback */
    successFeedback: 2000,
    /** Error display (longer for reading) */
    errorFeedback: 5000,
    /** Tooltip display after hover */
    tooltip: 2000,
    /** Banner auto-hide */
    banner: 7000,
  },

  /** Delay before showing */
  showDelay: {
    /** Loading indicator delay (avoid flash) */
    loadingIndicator: 200,
    /** Tooltip show delay */
    tooltip: 500,
    /** Long press activation */
    longPress: 500,
    /** Double tap window */
    doubleTap: 300,
  },

  /** Polling intervals */
  polling: {
    /** Real-time updates */
    realtime: 1000,
    /** Fast polling */
    fast: 5000,
    /** Normal polling */
    normal: 10000,
    /** Slow/background polling */
    slow: 30000,
    /** Background sync */
    background: 60000,
  },

  /** Network timeouts */
  timeout: {
    /** Short API calls */
    short: 5000,
    /** Normal API calls */
    normal: 15000,
    /** Long operations (uploads, etc.) */
    long: 30000,
    /** Very long operations */
    veryLong: 60000,
  },
} as const;

// ============================================================================
// FEEDBACK TOKENS
// ============================================================================

/**
 * User feedback configurations
 */
export const feedbackTokens = {
  /** Haptic feedback types */
  haptic: {
    /** Light impact - subtle confirmation */
    light: 'impactLight',
    /** Medium impact - standard feedback */
    medium: 'impactMedium',
    /** Heavy impact - significant action */
    heavy: 'impactHeavy',
    /** Selection change */
    selection: 'selection',
    /** Success notification */
    success: 'notificationSuccess',
    /** Warning notification */
    warning: 'notificationWarning',
    /** Error notification */
    error: 'notificationError',
  },

  /** Toast configuration */
  toast: {
    /** Duration in ms */
    duration: 3000,
    /** Maximum visible at once */
    maxVisible: 3,
    /** Position from edge */
    edgeSpacing: 16,
  },

  /** Loading states */
  loading: {
    /** Minimum loading display (avoid flash) */
    minDisplayTime: 500,
    /** Spinner animation duration per cycle */
    spinnerCycle: 1000,
    /** Skeleton shimmer duration */
    shimmerDuration: 1200,
  },

  /** Progress indicators */
  progress: {
    /** Minimum visible progress (avoid 0% start) */
    minProgress: 0.05,
    /** Progress update interval */
    updateInterval: 100,
  },
} as const;

// ============================================================================
// INTERACTION TOKENS
// ============================================================================

/**
 * Touch and interaction configurations
 */
export const interactionTokens = {
  /** Press states */
  press: {
    /** Opacity when pressed */
    activeOpacity: 0.7,
    /** Delay before showing press state */
    delayPressIn: 0,
    /** Delay before hiding press state */
    delayPressOut: 100,
    /** Long press threshold */
    delayLongPress: 500,
  },

  /** Swipe gestures */
  swipe: {
    /** Minimum swipe distance to trigger action */
    minDistance: 50,
    /** Maximum swipe time (velocity threshold) */
    maxDuration: 300,
    /** Swipe action threshold (percentage) */
    actionThreshold: 0.25,
    /** Full swipe threshold */
    fullSwipeThreshold: 0.6,
  },

  /** Drag gestures */
  drag: {
    /** Minimum distance before drag starts */
    activationDistance: 10,
    /** Snap back animation duration */
    snapBackDuration: 250,
  },

  /** Scroll behavior */
  scroll: {
    /** Velocity threshold for momentum */
    velocityThreshold: 0.5,
    /** Deceleration rate */
    decelerationRate: 0.985,
    /** Over-scroll resistance */
    overScrollResistance: 0.3,
  },

  /** Pull to refresh */
  pullToRefresh: {
    /** Distance to trigger refresh */
    triggerDistance: 80,
    /** Maximum pull distance */
    maxDistance: 150,
    /** Resistance when over-pulled */
    resistance: 2.5,
  },
} as const;

// ============================================================================
// VALIDATION TOKENS
// ============================================================================

/**
 * Input validation configurations
 */
export const validationTokens = {
  /** Character limits */
  limits: {
    /** Minimum name length */
    nameMin: 2,
    /** Maximum name length */
    nameMax: 100,
    /** Minimum password length */
    passwordMin: 8,
    /** Maximum password length */
    passwordMax: 128,
    /** Maximum email length */
    emailMax: 254,
    /** Minimum description length */
    descriptionMin: 10,
    /** Maximum description length */
    descriptionMax: 500,
    /** Maximum title length */
    titleMax: 100,
  },

  /** Phone/WhatsApp */
  phone: {
    minLength: 10,
    maxLength: 15,
    pattern: /^\+?[1-9]\d{1,14}$/,
  },

  /** Email */
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  /** Debounce for validation */
  debounce: 500,

  /** Error display duration */
  errorDisplayDuration: 5000,
} as const;

// ============================================================================
// PAGINATION TOKENS
// ============================================================================

/**
 * List pagination configurations
 */
export const paginationTokens = {
  /** Default page size */
  defaultPageSize: 20,
  /** Minimum page size */
  minPageSize: 10,
  /** Maximum page size */
  maxPageSize: 100,
  /** Threshold to trigger next page load (percentage scrolled) */
  loadMoreThreshold: 0.8,
  /** Initial number of items to render */
  initialNumToRender: 10,
  /** Window size for virtualization */
  windowSize: 5,
} as const;

// ============================================================================
// RETRY TOKENS
// ============================================================================

/**
 * Error recovery and retry configurations
 */
export const retryTokens = {
  /** Maximum retry attempts */
  maxAttempts: 3,
  /** Base delay between retries (ms) */
  baseDelay: 1000,
  /** Maximum delay between retries (ms) */
  maxDelay: 10000,
  /** Backoff multiplier */
  backoffMultiplier: 2,
  /** Jitter factor (randomization) */
  jitterFactor: 0.1,
  /** HTTP status codes that should trigger retry */
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
} as const;

// ============================================================================
// CACHE TOKENS
// ============================================================================

/**
 * Caching configurations
 */
export const cacheTokens = {
  /** Time-to-live durations (ms) */
  ttl: {
    /** Short-lived cache (1 minute) */
    short: 60 * 1000,
    /** Medium cache (5 minutes) */
    medium: 5 * 60 * 1000,
    /** Long cache (1 hour) */
    long: 60 * 60 * 1000,
    /** Very long cache (24 hours) */
    veryLong: 24 * 60 * 60 * 1000,
  },
  /** Maximum items in memory cache */
  maxItems: {
    images: 100,
    api: 50,
    search: 20,
  },
} as const;

// ============================================================================
// SESSION TOKENS
// ============================================================================

/**
 * Session and authentication configurations
 */
export const sessionTokens = {
  /** Session timeout (minutes) */
  timeoutMinutes: 60,
  /** Refresh token validity (days) */
  refreshTokenDays: 30,
  /** Access token validity (minutes) */
  accessTokenMinutes: 15,
  /** Warning before session expires (minutes) */
  expiryWarningMinutes: 5,
  /** Maximum login attempts before lockout */
  maxLoginAttempts: 5,
  /** Lockout duration (minutes) */
  lockoutDurationMinutes: 15,
} as const;

// ============================================================================
// NOTIFICATION TOKENS
// ============================================================================

/**
 * Notification configurations
 */
export const notificationTokens = {
  /** Maximum unread count to show (shows 99+ after) */
  maxUnreadCount: 99,
  /** Days to retain notifications */
  retentionDays: 30,
  /** Badge pulse animation */
  badgePulse: {
    duration: 1000,
    scale: 1.2,
  },
} as const;

// ============================================================================
// FILE UPLOAD TOKENS
// ============================================================================

/**
 * File upload configurations
 */
export const uploadTokens = {
  /** Maximum file sizes (bytes) */
  maxSize: {
    image: 10 * 1024 * 1024, // 10MB
    document: 25 * 1024 * 1024, // 25MB
    video: 100 * 1024 * 1024, // 100MB
  },
  /** Allowed MIME types */
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword'],
  },
  /** Chunk size for resumable uploads */
  chunkSize: 1024 * 1024, // 1MB
  /** Maximum concurrent uploads */
  maxConcurrent: 3,
} as const;

// ============================================================================
// COMBINED BEHAVIOR TOKENS EXPORT
// ============================================================================

export const behaviorTokens = {
  timing: timingTokens,
  feedback: feedbackTokens,
  interaction: interactionTokens,
  validation: validationTokens,
  pagination: paginationTokens,
  retry: retryTokens,
  cache: cacheTokens,
  session: sessionTokens,
  notification: notificationTokens,
  upload: uploadTokens,
} as const;

export type BehaviorTokens = typeof behaviorTokens;
