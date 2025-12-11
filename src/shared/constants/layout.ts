/**
 * Layout Constants - Single Source of Truth for layout-related values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL LAYOUT VALUES
 * ============================================================================
 *
 * All layout-related values should be referenced from here.
 * This ensures type safety, consistency, and easier refactoring.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: flex: 1, flexShrink: 0, maxWidth: 400
 * ✅ ALWAYS use: flex: FLEX.ONE, maxWidth: DIMENSIONS.MAX_WIDTH.CARD
 *
 * @version 2.0.0
 */
/* eslint-disable no-magic-numbers */

// =============================================================================
// FLEX VALUES
// =============================================================================

/**
 * Flex Values - Used for flex, flexShrink, flexGrow props
 */
export const FLEX = {
  NONE: 0,
  ONE: 1,
  ONE_AND_HALF: 1.5,
  TWO: 2,
  THREE: 3,
  SHRINK_DISABLED: 0,
  SHRINK_ENABLED: 1,
  GROW_DISABLED: 0,
  GROW_ENABLED: 1,
} as const;

// =============================================================================
// DIMENSIONS
// =============================================================================

/**
 * Dimension Values - Used for width, height, maxWidth, maxHeight, minWidth, minHeight
 */
export const DIMENSIONS = {
  // Common width values
  WIDTH: {
    FULL: '100%' as const,
    HALF: '50%' as const,
    AUTO: 'auto' as const,
  },

  // MaxWidth values for various components
  MAX_WIDTH: {
    /** Error boundary content card */
    CARD: 400,
    /** Modal dialogs */
    MODAL: 500,
    /** Small labels, tags */
    LABEL: 120,
    /** Empty state messages */
    MESSAGE: 300,
    /** Toast notifications */
    TOAST: 280,
    /** Main container */
    CONTAINER: 1200,
    /** Percentage based */
    MODAL_PERCENT: '90%' as const,
    FULL: '100%' as const,
  },

  // MaxHeight values for various components
  MAX_HEIGHT: {
    /** Error details scrollview */
    ERROR_DETAILS: 200,
    /** Dropdown/select lists */
    LIST_SMALL: 150,
    LIST_MEDIUM: 200,
    /** Modal body content */
    MODAL_BODY_SMALL: 400,
    MODAL_BODY_MEDIUM: 500,
    MODAL_BODY_LARGE: 600,
    /** Percentage based */
    MODAL_PERCENT: '90%' as const,
  },

  // MinWidth values for various components
  MIN_WIDTH: {
    /** Buttons */
    BUTTON: 150,
    /** Small icon buttons */
    ICON_BUTTON_SMALL: 36,
    /** Badge/notification indicator */
    BADGE: 18,
    /** Toast notifications */
    TOAST: 280,
  },

  // Height values
  HEIGHT: {
    /** Drag handle for modals */
    DRAG_HANDLE: 4,
    /** Divider/separator line */
    DIVIDER: 30,
    /** Input field height */
    INPUT: 50,
  },

  // Size values (equal width and height)
  SIZE: {
    /** Small badge/indicator size */
    BADGE_SMALL: 20,
    /** Icon button small (36x36) */
    ICON_BUTTON_SMALL: 36,
    /** Touch target standard (44x44) */
    TOUCH_TARGET: 44,
    /** Avatar/icon container medium (56x56) */
    AVATAR_MEDIUM: 56,
    /** Order badge (32x32) */
    ORDER_BADGE: 32,
    /** Share icon container (80x80) */
    SHARE_ICON_LARGE: 80,
    /** Large icon container (120x120) */
    ICON_CONTAINER_LARGE: 120,
  },

  // Skeleton dimensions
  SKELETON: {
    /** Title skeleton */
    TITLE_WIDTH: 200,
    TITLE_HEIGHT: 32,
    /** Subtitle skeleton */
    SUBTITLE_WIDTH: 150,
    SUBTITLE_HEIGHT: 20,
  },

  // Progress bar heights
  PROGRESS_BAR: {
    /** Standard progress bar */
    STANDARD: 8,
  },

  // Position offset values
  OFFSET: {
    /** Small negative offset for badges */
    BADGE_NEGATIVE: -2,
  },

  // MinHeight values
  MIN_HEIGHT: {
    /** Small icon buttons */
    ICON_BUTTON_SMALL: 36,
    /** Badge/notification indicator */
    BADGE: 18,
    /** Touch target (40px) */
    TOUCH_TARGET: 40,
    /** Standard touch target (44px) */
    TOUCH_TARGET_STANDARD: 44,
    /** Select item height */
    SELECT_ITEM: 48,
    /** Button standard */
    BUTTON: 52,
    /** Filter/selection option items */
    FILTER_OPTION: 56,
    /** Card/item content */
    CARD_CONTENT: 80,
    /** Textarea/multiline input */
    TEXTAREA: 100,
    /** Selection modal item */
    SELECTION_ITEM: 60,
  },

  // Percentage based max dimensions
  MAX_WIDTH_PERCENT: {
    FULL: '100%',
    NINETY: '90%',
  },
  MAX_HEIGHT_PERCENT: {
    FULL: '100%',
    NINETY: '90%',
    EIGHTY_FIVE: '85%',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Typography Values - Used for line height and letter spacing
 */
export const TYPOGRAPHY = {
  LINE_HEIGHT: {
    SM: 16,
    MD: 18,
    LG: 20,
    XL: 22,
    XXL: 24,
  },
  LETTER_SPACING: {
    TIGHT: 0.25,
    NORMAL: 0.5,
    WIDE: 1,
  },
} as const;

// =============================================================================
// BORDERS
// =============================================================================

/**
 * Border Values - Used for border radius and width
 */
export const BORDERS = {
  RADIUS: {
    NONE: 0,
  },
  COLOR: {
    TRANSPARENT: 'transparent',
  },
  STYLE: {
    SOLID: 'solid' as const,
    DASHED: 'dashed' as const,
    DOTTED: 'dotted' as const,
  },
  WIDTH: {
    THIN: 1,
    MEDIUM: 4,
  },
} as const;

// =============================================================================
// TEXT TRANSFORMS
// =============================================================================

/**
 * Text Transform Values - Used for textTransform in text styles
 */
export const TEXT_TRANSFORM = {
  UPPERCASE: 'uppercase' as const,
  LOWERCASE: 'lowercase' as const,
  CAPITALIZE: 'capitalize' as const,
  NONE: 'none' as const,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

/**
 * Shadow Offset Values - Used for shadowOffset in StyleSheet
 */
export const SHADOW_OFFSET = {
  NONE: { width: 0, height: 0 },
  SM: { width: 0, height: 1 },
  MD: { width: 0, height: 2 },
  LG: { width: 0, height: 4 },
  XL: { width: 0, height: 8 },
  XXL: { width: 0, height: 12 },
} as const;

// =============================================================================
// FONTS
// =============================================================================

/**
 * Font Family Values - Used for fontFamily in text styles
 */
export const FONT_FAMILY = {
  SYSTEM: 'System',
  MONO: 'monospace',
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

/**
 * Breakpoint Values - Used for responsive design
 */
export const BREAKPOINTS = {
  /** Mobile breakpoint (< 768px) */
  MOBILE: 768,
  /** Tablet breakpoint (< 1024px) */
  TABLET: 1024,
  /** Desktop breakpoint (< 1280px) */
  DESKTOP: 1280,
} as const;

// =============================================================================
// TEXT ALIGNMENT
// =============================================================================

/**
 * Text Align Vertical - Used for textAlignVertical style prop
 */
export const TEXT_ALIGN_VERTICAL = {
  TOP: 'top' as const,
  CENTER: 'center' as const,
  BOTTOM: 'bottom' as const,
  AUTO: 'auto' as const,
} as const;

// =============================================================================
// MODAL CONFIGURATION
// =============================================================================

/**
 * Modal Width Breakpoints and Ratios - Used for responsive modal sizing
 */
export const MODAL_WIDTH = {
  BREAKPOINTS: {
    LARGE: 1200,
    MEDIUM: 768,
    SMALL: 480,
  },
  MAX: {
    LARGE: 700,
    MEDIUM: 600,
    SHARE: 500,
  },
  RATIO: {
    HALF: 0.5,
    SEVENTY: 0.7,
    SEVENTY_FIVE: 0.75,
    EIGHTY_FIVE: 0.85,
    NINETY: 0.9,
    NINETY_FIVE: 0.95,
  },
} as const;

/**
 * Modal Configuration - Used for modal size calculations
 */
export const MODAL_CONFIG = {
  PERCENTAGE_SYMBOL: '%',
  MAX_HEIGHT_RATIO: 0.9,
  PERCENTAGE_DIVISOR: 100,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type FlexValue = (typeof FLEX)[keyof typeof FLEX];
export type DimensionValue = typeof DIMENSIONS;
export type ShadowOffsetValue = (typeof SHADOW_OFFSET)[keyof typeof SHADOW_OFFSET];
export type FontFamilyValue = (typeof FONT_FAMILY)[keyof typeof FONT_FAMILY];
export type BreakpointValue = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS];
