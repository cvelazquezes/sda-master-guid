/**
 * Numeric Constants - Single Source of Truth for ALL numeric values
 *
 * ============================================================================
 * THIS IS THE ONLY FILE WHERE MAGIC NUMBERS ARE DEFINED
 * ============================================================================
 *
 * All numeric literals in the codebase MUST reference constants from here.
 * Other files should IMPORT from here, not define their own numbers.
 *
 * @version 3.0.0 - Consolidated from numbers.ts, http.ts, timing.ts overlaps
 */
/* eslint-disable no-magic-numbers */

// =============================================================================
// MATHEMATICAL CONSTANTS
// =============================================================================

export const MATH = {
  /** Division by 2 (half) */
  HALF: 2,
  /** Division by 3 (third) */
  THIRD: 3,
  /** Division by 4 (quarter) */
  QUARTER: 4,
  /** Five */
  FIVE: 5,
  /** Ten */
  TEN: 10,
  /** Hundred */
  HUNDRED: 100,
  /** Thousand */
  THOUSAND: 1000,
  /** Million */
  MILLION: 1000000,
  /** Percentage base */
  PERCENTAGE: 100,
  /** Decimal base */
  DECIMAL_BASE: 10,
  /** Hex base */
  HEX_BASE: 16,
  /** Spacing multiplier */
  SPACING_MULTIPLIER: 1.5,
} as const;

// =============================================================================
// TIME UNITS (raw numeric values)
// =============================================================================

export const TIME_UNIT = {
  /** Milliseconds in a second */
  MS_PER_SECOND: 1000,
  /** Seconds in a minute */
  SECONDS_PER_MINUTE: 60,
  /** Minutes in an hour */
  MINUTES_PER_HOUR: 60,
  /** Hours in a day */
  HOURS_PER_DAY: 24,
  /** Days in a week */
  DAYS_PER_WEEK: 7,
  /** Days in a month (approx) */
  DAYS_PER_MONTH: 30,
  /** Months in a year */
  MONTHS_PER_YEAR: 12,
} as const;

// Pre-calculated time in milliseconds
export const MS = {
  SECOND: TIME_UNIT.MS_PER_SECOND,
  MINUTE: TIME_UNIT.SECONDS_PER_MINUTE * TIME_UNIT.MS_PER_SECOND,
  HOUR: TIME_UNIT.MINUTES_PER_HOUR * TIME_UNIT.SECONDS_PER_MINUTE * TIME_UNIT.MS_PER_SECOND,
  DAY:
    TIME_UNIT.HOURS_PER_DAY *
    TIME_UNIT.MINUTES_PER_HOUR *
    TIME_UNIT.SECONDS_PER_MINUTE *
    TIME_UNIT.MS_PER_SECOND,
  WEEK:
    TIME_UNIT.DAYS_PER_WEEK *
    TIME_UNIT.HOURS_PER_DAY *
    TIME_UNIT.MINUTES_PER_HOUR *
    TIME_UNIT.SECONDS_PER_MINUTE *
    TIME_UNIT.MS_PER_SECOND,
} as const;

// Pre-calculated time in seconds
export const SECONDS = {
  MINUTE: TIME_UNIT.SECONDS_PER_MINUTE,
  HOUR: TIME_UNIT.MINUTES_PER_HOUR * TIME_UNIT.SECONDS_PER_MINUTE,
  DAY: TIME_UNIT.HOURS_PER_DAY * TIME_UNIT.MINUTES_PER_HOUR * TIME_UNIT.SECONDS_PER_MINUTE,
  WEEK:
    TIME_UNIT.DAYS_PER_WEEK *
    TIME_UNIT.HOURS_PER_DAY *
    TIME_UNIT.MINUTES_PER_HOUR *
    TIME_UNIT.SECONDS_PER_MINUTE,
} as const;

// =============================================================================
// FILE SIZE UNITS
// =============================================================================

export const BYTE = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

// =============================================================================
// SPACING SCALE (pixels)
// =============================================================================

export const SPACING = {
  /** 0px - None */
  NONE: 0,
  /** 2px - Tiny */
  TINY: 2,
  /** 4px - Extra extra small */
  XXS: 4,
  /** 6px */
  XXXS: 6,
  /** 8px - Extra small */
  XS: 8,
  /** 10px */
  SM_MINUS: 10,
  /** 12px - Small */
  SM: 12,
  /** 14px */
  SM_PLUS: 14,
  /** 16px - Medium */
  MD: 16,
  /** 18px */
  MD_PLUS: 18,
  /** 20px */
  LG_MINUS: 20,
  /** 24px - Large */
  LG: 24,
  /** 28px */
  LG_PLUS: 28,
  /** 32px - Extra large */
  XL: 32,
  /** 36px */
  XL_PLUS: 36,
  /** 40px - Extra extra large */
  XXL: 40,
  /** 44px - Touch target */
  TOUCH: 44,
  /** 48px */
  XXL_PLUS: 48,
  /** 50px */
  FIFTY: 50,
  /** 56px */
  XXXL: 56,
  /** 60px */
  SIXTY: 60,
  /** 64px */
  XXXXL: 64,
  /** 72px */
  HUGE: 72,
  /** 80px */
  HUGE_PLUS: 80,
  /** 96px */
  MASSIVE: 96,
  /** 120px */
  GIANT: 120,
  /** 128px */
  GIANT_PLUS: 128,
} as const;

// =============================================================================
// FONT SIZES (pixels)
// =============================================================================

export const FONT_SIZE = {
  /** 10px - Tiny */
  TINY: 10,
  /** 11px */
  XXS: 11,
  /** 12px - Extra small */
  XS: 12,
  /** 13px */
  XS_PLUS: 13,
  /** 14px - Small */
  SM: 14,
  /** 15px */
  SM_PLUS: 15,
  /** 16px - Medium (default) */
  MD: 16,
  /** 17px */
  MD_PLUS: 17,
  /** 18px - Large */
  LG: 18,
  /** 20px - Extra large */
  XL: 20,
  /** 22px */
  XL_PLUS: 22,
  /** 24px - Title */
  XXL: 24,
  /** 28px */
  XXXL: 28,
  /** 30px */
  TITLE_SM: 30,
  /** 32px - Title */
  TITLE: 32,
  /** 36px - Display */
  DISPLAY: 36,
  /** 40px */
  DISPLAY_LG: 40,
  /** 48px - Hero */
  HERO: 48,
  /** 60px */
  HERO_LG: 60,
  /** 72px */
  HERO_XL: 72,
  /** 96px */
  HERO_XXL: 96,
} as const;

// =============================================================================
// LINE HEIGHT (pixels)
// =============================================================================

export const LINE_HEIGHT = {
  TIGHT: 16,
  NORMAL: 20,
  RELAXED: 24,
  LOOSE: 28,
  XL: 32,
  XXL: 36,
  XXXL: 42,
  HUGE: 48,
  HERO: 60,
  HERO_LG: 72,
  HERO_XL: 84,
  HERO_XXL: 108,
} as const;

// =============================================================================
// FONT WEIGHTS
// =============================================================================

export const FONT_WEIGHT = {
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900,
} as const;

// =============================================================================
// BORDER RADIUS (pixels)
// =============================================================================

export const RADIUS = {
  /** 0px - None */
  NONE: 0,
  /** 2px - Subtle */
  XXS: 2,
  /** 4px - Small */
  XS: 4,
  /** 6px */
  SM_MINUS: 6,
  /** 8px - Medium small */
  SM: 8,
  /** 10px */
  MD_MINUS: 10,
  /** 12px - Medium */
  MD: 12,
  /** 16px - Large */
  LG: 16,
  /** 20px - Extra large */
  XL: 20,
  /** 24px */
  XXL: 24,
  /** 32px */
  XXXL: 32,
  /** Full circle */
  FULL: 9999,
} as const;

// =============================================================================
// BORDER WIDTH (pixels)
// =============================================================================

export const BORDER_WIDTH = {
  NONE: 0,
  HAIRLINE: 0.5,
  THIN: 1,
  MEDIUM: 2,
  THICK: 3,
  HEAVY: 4,
  /** Alias for HEAVY */
  EXTRA_THICK: 4,
} as const;

// =============================================================================
// ELEVATION (Android elevation / shadow depth)
// =============================================================================

export const ELEVATION = {
  /** No elevation */
  NONE: 0,
  /** Subtle - 1 */
  XS: 1,
  /** Light - 2 */
  SM: 2,
  /** Default card - 4 */
  MD: 4,
  /** Raised card - 6 */
  LG: 6,
  /** Modal - 8 */
  XL: 8,
  /** Overlay - 10 */
  XXL: 10,
  /** Tooltip - 12 */
  XXXL: 12,
  /** Max - 24 */
  MAX: 24,
} as const;

// =============================================================================
// OPACITY VALUES (0-1 scale)
// =============================================================================

export const OPACITY_VALUE = {
  TRANSPARENT: 0,
  VERY_LIGHT: 0.05,
  LIGHT: 0.1,
  SUBTLE: 0.15,
  LIGHT_MEDIUM: 0.2,
  QUARTER: 0.25,
  MEDIUM_LIGHT: 0.3,
  MEDIUM: 0.5,
  MEDIUM_STRONG: 0.6,
  STRONG: 0.7,
  VERY_STRONG: 0.75,
  INTENSE: 0.8,
  ALMOST_FULL: 0.85,
  NEAR_FULL: 0.9,
  NEARLY_OPAQUE: 0.95,
  FULL: 1,
} as const;

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================

export const Z_INDEX = {
  BEHIND: -1,
  BASE: 0,
  RAISED: 1,
  DROPDOWN: 10,
  STICKY: 100,
  FIXED: 200,
  OVERLAY: 300,
  MODAL_BACKDROP: 500,
  MODAL: 1000,
  POPOVER: 1500,
  TOOLTIP: 2000,
  TOAST: 9999,
} as const;

// =============================================================================
// ICON SIZES (pixels)
// =============================================================================

export const ICON_SIZE = {
  TINY: 12,
  XS: 16,
  SM: 20,
  MD: 24,
  LG: 32,
  XL: 40,
  XXL: 48,
  XXXL: 56,
  HUGE: 64,
} as const;

// =============================================================================
// AVATAR SIZES (pixels)
// =============================================================================

export const AVATAR_SIZE = {
  XS: 24,
  SM: 32,
  MD: 40,
  LG: 56,
  XL: 80,
  XXL: 120,
} as const;

// =============================================================================
// BUTTON HEIGHTS (pixels)
// =============================================================================

export const BUTTON_HEIGHT = {
  SM: 32,
  MD: 44,
  LG: 52,
} as const;

// =============================================================================
// GRID COLUMNS
// =============================================================================

export const GRID = {
  COLUMNS_1: 1,
  COLUMNS_2: 2,
  COLUMNS_3: 3,
  COLUMNS_4: 4,
  COLUMNS_6: 6,
  COLUMNS_12: 12,
} as const;

// =============================================================================
// BREAKPOINTS (pixels)
// =============================================================================

export const BREAKPOINT = {
  XS: 0,
  SM: 480,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

// =============================================================================
// CONTAINER WIDTHS (pixels)
// =============================================================================

export const CONTAINER_WIDTH = {
  SM: 540,
  MD: 720,
  LG: 960,
  XL: 1140,
  XXL: 1320,
} as const;

// =============================================================================
// TOUCH TARGETS (accessibility)
// =============================================================================

export const TOUCH_TARGET = {
  /** Minimum touch target (40px) */
  MIN: 40,
  /** Standard touch target (44px - Apple HIG) */
  STANDARD: 44,
  /** Comfortable touch target (48px - Material) */
  COMFORTABLE: 48,
} as const;

// =============================================================================
// COLOR CONSTANTS
// =============================================================================

export const COLOR = {
  /** Max RGB value */
  MAX_RGB: 255,
  /** RGB channel count */
  CHANNELS: 3,
  /** RGBA channel count */
  CHANNELS_ALPHA: 4,
} as const;

// =============================================================================
// ANIMATION NUMERIC CONSTANTS
// =============================================================================

export const ANIMATION_VALUE = {
  /** FPS intervals in ms */
  FPS_30: 33,
  FPS_60: 16,
  /** Scale values */
  SCALE_PRESSED: 0.95,
  SCALE_NORMAL: 1,
  SCALE_EXPANDED: 1.05,
} as const;

// =============================================================================
// PAGINATION & LIST LIMITS
// =============================================================================

export const PAGE = {
  DEFAULT_NUMBER: 1,
  DEFAULT_SIZE: 20,
  MIN_SIZE: 10,
  MAX_SIZE: 100,
} as const;

export const LIST_LIMITS = {
  /** Max items in dropdown */
  MAX_DROPDOWN_ITEMS: 50,
  /** Max retry attempts */
  MAX_RETRIES: 3,
  /** Max file size (MB) */
  MAX_FILE_SIZE_MB: 10,
  /** Default preview items */
  PREVIEW_ITEMS: 3,
  /** Max unread notifications display */
  MAX_UNREAD_DISPLAY: 99,
  /** Max items in offline queue */
  MAX_QUEUE: 100,
  /** Max items in memory cache */
  MAX_CACHE: 100,
  /** Max items in event history */
  MAX_HISTORY: 100,
} as const;

// =============================================================================
// WCAG ACCESSIBILITY
// =============================================================================

export const WCAG = {
  /** Contrast ratios */
  CONTRAST: {
    AA_NORMAL: 4.5,
    AA_LARGE: 3,
    AAA_NORMAL: 7,
    AAA_LARGE: 4.5,
  },
  /** Luminance coefficients */
  LUMINANCE: {
    RED: 0.2126,
    GREEN: 0.7152,
    BLUE: 0.0722,
    THRESHOLD: 0.03928,
    LINEAR_SCALE: 12.92,
    GAMMA: 2.4,
    OFFSET: 0.055,
    DENOMINATOR: 1.055,
  },
} as const;

// =============================================================================
// LETTER SPACING
// =============================================================================

export const LETTER_SPACING = {
  TIGHTER: -0.8,
  TIGHT: -0.4,
  NORMAL: 0,
  WIDE: 0.4,
  WIDER: 0.8,
  WIDEST: 1.6,
} as const;

// =============================================================================
// ID GENERATION
// =============================================================================

export const ID_GENERATION = {
  /** Base for random string generation (36 = alphanumeric) */
  RADIX: 36,
  /** Start position for substring (skip "0.") */
  SUBSTRING_START: 2,
  /** Length of random suffix */
  SUFFIX_LENGTH: 15,
} as const;

// =============================================================================
// CRYPTO
// =============================================================================

export const CRYPTO = {
  /** CSRF token bytes */
  TOKEN_BYTES: 32,
} as const;

// Note: BORDER_WIDTH is already defined above

// =============================================================================
// MODAL SIZES
// =============================================================================

export const MODAL_SIZE = {
  /** Small modal - 400px */
  SMALL: 400,
  /** Medium modal - 550px */
  MEDIUM: 550,
  /** Large modal - 700px */
  LARGE: 700,
  /** Extra large modal - 900px */
  XL: 900,
} as const;

// =============================================================================
// BATCH PROCESSING
// =============================================================================

export const BATCH = {
  /** Default max batch size */
  DEFAULT_SIZE: 100,
  /** Small batch window (ms) */
  WINDOW_MS: 10,
  /** User batch size */
  USER_BATCH_SIZE: 50,
} as const;

// =============================================================================
// SHADOW PRESETS
// =============================================================================

/**
 * Shadow preset height values for different component elevations
 */
export const SHADOW_HEIGHT = {
  SUBTLE: 1,
  CARD: 2,
  ELEVATED: 4,
  MODAL: 8,
} as const;

/**
 * Shadow preset radius values for blur effect
 */
export const SHADOW_BLUR = {
  SUBTLE: 2,
  CARD: 4,
  ELEVATED: 8,
  MODAL: 16,
} as const;

/**
 * Modal shadow elevation for Android
 */
export const MODAL_ELEVATION = 24;

/**
 * Performance monitoring thresholds (FPS)
 */
export const FPS = {
  TARGET: 60,
  LOW_WARNING: 55,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SpacingKey = keyof typeof SPACING;
export type FontSizeKey = keyof typeof FONT_SIZE;
export type RadiusKey = keyof typeof RADIUS;
export type OpacityKey = keyof typeof OPACITY_VALUE;
export type ZIndexKey = keyof typeof Z_INDEX;
export type IconSizeKey = keyof typeof ICON_SIZE;
export type BreakpointKey = keyof typeof BREAKPOINT;
