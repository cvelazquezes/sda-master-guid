/**
 * Spacing System
 * 
 * Consistent spacing scale following 8px grid system.
 * Used for margins, padding, gaps, etc.
 */

/**
 * Base spacing unit (8px)
 */
export const BASE_SPACING = 8;

/**
 * Spacing scale
 * 
 * Uses 8px base unit for consistent spacing throughout the app.
 * Each step is a multiple of 8px for perfect alignment.
 */
export const spacing = {
  0: 0,
  1: BASE_SPACING * 0.5, // 4px
  2: BASE_SPACING * 1, // 8px
  3: BASE_SPACING * 1.5, // 12px
  4: BASE_SPACING * 2, // 16px
  5: BASE_SPACING * 2.5, // 20px
  6: BASE_SPACING * 3, // 24px
  7: BASE_SPACING * 3.5, // 28px
  8: BASE_SPACING * 4, // 32px
  10: BASE_SPACING * 5, // 40px
  12: BASE_SPACING * 6, // 48px
  16: BASE_SPACING * 8, // 64px
  20: BASE_SPACING * 10, // 80px
  24: BASE_SPACING * 12, // 96px
  32: BASE_SPACING * 16, // 128px
  40: BASE_SPACING * 20, // 160px
  48: BASE_SPACING * 24, // 192px
  56: BASE_SPACING * 28, // 224px
  64: BASE_SPACING * 32, // 256px
} as const;

/**
 * Semantic spacing aliases
 */
export const semanticSpacing = {
  // Extra small spacing
  xs: spacing[1], // 4px
  
  // Small spacing
  sm: spacing[2], // 8px
  
  // Medium spacing (default)
  md: spacing[4], // 16px
  
  // Large spacing
  lg: spacing[6], // 24px
  
  // Extra large spacing
  xl: spacing[8], // 32px
  
  // 2x extra large
  '2xl': spacing[12], // 48px
  
  // 3x extra large
  '3xl': spacing[16], // 64px
  
  // 4x extra large
  '4xl': spacing[20], // 80px
} as const;

/**
 * Screen padding/margins
 */
export const containerSpacing = {
  screenHorizontal: spacing[4], // 16px horizontal padding
  screenVertical: spacing[4], // 16px vertical padding
  cardPadding: spacing[4], // 16px card internal padding
  sectionGap: spacing[6], // 24px between sections
  listItemGap: spacing[3], // 12px between list items
} as const;

/**
 * Component spacing
 */
export const componentSpacing = {
  buttonPaddingHorizontal: spacing[6], // 24px
  buttonPaddingVertical: spacing[3], // 12px
  inputPaddingHorizontal: spacing[4], // 16px
  inputPaddingVertical: spacing[3], // 12px
  iconMargin: spacing[2], // 8px
  badgeSize: spacing[3], // 12px
} as const;

/**
 * Border radius scale
 */
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999, // Fully rounded (pill shape)
} as const;

/**
 * Border width scale
 */
export const borderWidth = {
  0: 0,
  1: 1,
  2: 2,
  4: 4,
  8: 8,
} as const;

/**
 * Shadow depths
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
} as const;

/**
 * Z-index scale
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
} as const;

/**
 * Opacity scale
 */
export const opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
} as const;

/**
 * Sizing scale (width/height)
 */
export const sizes = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
  full: '100%',
  screen: '100vh',
} as const;

/**
 * Icon sizes
 */
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SemanticSpacingKey = keyof typeof semanticSpacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;

