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
 * ✅ ALWAYS use: flex: flexValues.one, maxWidth: dimensionValues.maxWidth.card
 *
 * @version 1.1.0
 */

/**
 * Flex Values - Used for flex, flexShrink, flexGrow props
 */
export const flexValues = {
  none: 0,
  one: 1,
  oneAndHalf: 1.5,
  two: 2,
  three: 3,
  shrinkDisabled: 0,
  shrinkEnabled: 1,
  growDisabled: 0,
  growEnabled: 1,
} as const;

/**
 * Dimension Values - Used for width, height, maxWidth, maxHeight, minWidth, minHeight
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: maxWidth: 400, width: '100%'
 * ✅ ALWAYS use: maxWidth: dimensionValues.maxWidth.card, width: dimensionValues.width.full
 */
export const dimensionValues = {
  // Common width values
  width: {
    full: '100%' as const,
    half: '50%' as const,
    auto: 'auto' as const,
  },

  // MaxWidth values for various components
  maxWidth: {
    /** Error boundary content card */
    card: 400,
    /** Modal dialogs */
    modal: 500,
    /** Small labels, tags */
    label: 120,
    /** Empty state messages */
    message: 300,
    /** Toast notifications */
    toast: 280,
    /** Main container */
    container: 1200,
    /** Percentage based */
    modalPercent: '90%' as const,
    full: '100%' as const,
  },

  // MaxHeight values for various components
  maxHeight: {
    /** Error details scrollview */
    errorDetails: 200,
    /** Dropdown/select lists */
    listSmall: 150,
    listMedium: 200,
    /** Modal body content */
    modalBodySmall: 400,
    modalBodyMedium: 500,
    modalBodyLarge: 600,
    /** Percentage based */
    modalPercent: '90%' as const,
  },

  // MinWidth values for various components
  minWidth: {
    /** Buttons */
    button: 150,
    /** Small icon buttons */
    iconButtonSmall: 36,
    /** Badge/notification indicator */
    badge: 18,
    /** Toast notifications */
    toast: 280,
  },

  // Height values
  height: {
    /** Drag handle for modals */
    dragHandle: 4,
    /** Divider/separator line */
    divider: 30,
    /** Input field height */
    input: 50,
  },

  // Size values (equal width and height)
  size: {
    /** Small badge/indicator size */
    badgeSmall: 20,
    /** Icon button small (36x36) */
    iconButtonSmall: 36,
    /** Touch target standard (44x44) */
    touchTarget: 44,
    /** Avatar/icon container medium (56x56) */
    avatarMedium: 56,
    /** Order badge (32x32) */
    orderBadge: 32,
    /** Share icon container (80x80) */
    shareIconLarge: 80,
    /** Large icon container (120x120) */
    iconContainerLarge: 120,
  },

  // Skeleton dimensions
  skeleton: {
    /** Title skeleton */
    titleWidth: 200,
    titleHeight: 32,
    /** Subtitle skeleton */
    subtitleWidth: 150,
    subtitleHeight: 20,
  },

  // Progress bar heights
  progressBar: {
    /** Standard progress bar */
    standard: 8,
  },

  // Position offset values
  offset: {
    /** Small negative offset for badges */
    badgeNegative: -2,
  },

  // MinHeight values
  minHeight: {
    /** Small icon buttons */
    iconButtonSmall: 36,
    /** Badge/notification indicator */
    badge: 18,
    /** Touch target (40px) */
    touchTarget: 40,
    /** Standard touch target (44px) */
    touchTargetStandard: 44,
    /** Select item height */
    selectItem: 48,
    /** Button standard */
    button: 52,
    /** Filter/selection option items */
    filterOption: 56,
    /** Card/item content */
    cardContent: 80,
    /** Textarea/multiline input */
    textarea: 100,
    /** Selection modal item */
    selectionItem: 60,
  },

  // MaxWidth values (percentage strings)
  maxWidthPercent: {
    full: '100%',
    ninety: '90%',
  },
  maxHeightPercent: {
    full: '100%',
    ninety: '90%',
    eightyFive: '85%',
  },
} as const;

/**
 * Typography Values - Used for line height and letter spacing
 */
export const typographyValues = {
  lineHeight: {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
    '2xl': 24,
  },
  letterSpacing: {
    tight: 0.25,
    normal: 0.5,
    wide: 1,
  },
} as const;

/**
 * Border Values - Used for border radius and width
 */
export const borderValues = {
  radius: {
    none: 0,
  },
  color: {
    transparent: 'transparent',
  },
  style: {
    solid: 'solid' as const,
    dashed: 'dashed' as const,
    dotted: 'dotted' as const,
  },
  width: {
    thin: 1,
    medium: 4,
  },
} as const;

/**
 * Text Transform Values - Used for textTransform in text styles
 */
export const textTransformValues = {
  uppercase: 'uppercase' as const,
  lowercase: 'lowercase' as const,
  capitalize: 'capitalize' as const,
  none: 'none' as const,
} as const;

/**
 * Shadow Offset Values - Used for shadowOffset in StyleSheet
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: shadowOffset: { width: 0, height: 2 }
 * ✅ ALWAYS use: shadowOffset: shadowOffsetValues.md
 */
export const shadowOffsetValues = {
  none: { width: 0, height: 0 },
  sm: { width: 0, height: 1 },
  md: { width: 0, height: 2 },
  lg: { width: 0, height: 4 },
  xl: { width: 0, height: 8 },
  '2xl': { width: 0, height: 12 },
} as const;

/**
 * Font Family Values - Used for fontFamily in text styles
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: fontFamily: 'monospace'
 * ✅ ALWAYS use: fontFamily: fontFamilyValues.mono
 */
export const fontFamilyValues = {
  system: 'System',
  mono: 'monospace',
} as const;

/**
 * Breakpoint Values - Used for responsive design
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: windowWidth < 768
 * ✅ ALWAYS use: windowWidth < BREAKPOINTS.MOBILE
 */
export const BREAKPOINTS = {
  /** Mobile breakpoint (< 768px) */
  MOBILE: 768,
  /** Tablet breakpoint (< 1024px) */
  TABLET: 1024,
  /** Desktop breakpoint (< 1280px) */
  DESKTOP: 1280,
} as const;

/**
 * Text Align Vertical - Used for textAlignVertical style prop
 */
export const textAlignVertical = {
  top: 'top' as const,
  center: 'center' as const,
  bottom: 'bottom' as const,
  auto: 'auto' as const,
} as const;

// Type exports
export type FlexValue = (typeof flexValues)[keyof typeof flexValues];
export type DimensionValue = typeof dimensionValues;
export type ShadowOffsetValue = (typeof shadowOffsetValues)[keyof typeof shadowOffsetValues];
export type FontFamilyValue = (typeof fontFamilyValues)[keyof typeof fontFamilyValues];
export type BreakpointValue = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS];
