/**
 * Primitive Design Tokens
 *
 * Raw, theme-agnostic values that serve as the foundation for all design decisions.
 * These values NEVER change based on theme - they are the atomic building blocks.
 *
 * IMPORTANT: Do not use primitive tokens directly in components.
 * Instead, use semantic tokens that map to these primitives.
 *
 * NOTE: This file intentionally contains literal numbers as it DEFINES the design tokens.
 * All other files should import from here rather than using magic numbers.
 */

import { TextStyle } from 'react-native';

// ============================================================================
// COLOR PRIMITIVES
// ============================================================================

/**
 * SDA Brand Color Palette
 * Official colors following SDA and Master Guide branding
 */
export const colorPrimitives = {
  // Primary Blue Scale (SDA Brand)
  blue: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#1976D2', // Main SDA Blue
    600: '#1565C0',
    700: '#0D47A1',
    800: '#0A3A8A',
    900: '#062863',
  },

  // Secondary Burgundy Scale (Master Guide)
  burgundy: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#C62828', // Main Master Guide Red
    600: '#B71C1C',
    700: '#8B0000',
    800: '#6D0000',
    900: '#4D0000',
  },

  // Accent Gold Scale
  gold: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FDB913', // Main Gold
    600: '#F9A825',
    700: '#F57F17',
    800: '#E67100',
    900: '#BF5F00',
  },

  // Success Green Scale
  green: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#43A047', // Main Success
    600: '#388E3C',
    700: '#2E7D32',
    800: '#1B5E20',
    900: '#0D4715',
  },

  // Warning Orange Scale
  orange: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FB8C00', // Main Warning
    600: '#F57C00',
    700: '#EF6C00',
    800: '#E65100',
    900: '#BF4100',
  },

  // Error Red Scale
  red: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#D32F2F', // Main Error
    600: '#C62828',
    700: '#B71C1C',
    800: '#8B0000',
    900: '#6D0000',
  },

  // Info Blue Scale
  cyan: {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#0288D1', // Main Info
    600: '#0277BD',
    700: '#01579B',
    800: '#014682',
    900: '#013A6B',
  },

  // Neutral Gray Scale
  gray: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#121212',
    1000: '#000000',
  },

  // Dark Mode Specific Colors
  dark: {
    purple: {
      300: '#DDB3FF',
      400: '#BB86FC',
      500: '#9965D4',
    },
    teal: {
      300: '#66FFF9',
      400: '#03DAC6',
      500: '#00A896',
    },
    pink: {
      300: '#FF94A9',
      400: '#CF6679',
      500: '#9A4F5F',
    },
  },

  // Absolute Colors
  absolute: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  // Social Media Colors
  social: {
    whatsapp: '#25D366',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    instagram: '#E4405F',
    google: '#4285F4',
    apple: '#000000',
  },
} as const;

// ============================================================================
// SPACING PRIMITIVES
// ============================================================================

/**
 * Spacing Scale
 * Based on 4px base unit with semantic aliases
 */
export const spacingPrimitives = {
  // Numeric scale (for direct use)
  px: {
    0: 0,
    1: 1,
    2: 2,
    4: 4,
    6: 6,
    8: 8,
    10: 10,
    12: 12,
    14: 14,
    16: 16,
    18: 18,
    20: 20,
    24: 24,
    28: 28,
    32: 32,
    36: 36,
    40: 40,
    44: 44,
    48: 48,
    56: 56,
    64: 64,
    72: 72,
    80: 80,
    96: 96,
    128: 128,
  },

  // Semantic scale
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
} as const;

// ============================================================================
// BORDER RADIUS PRIMITIVES
// ============================================================================

export const radiusPrimitives = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
  '5xl': 32,
  full: 9999,
} as const;

// ============================================================================
// BORDER WIDTH PRIMITIVES
// ============================================================================

export const borderWidthPrimitives = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 3,
  heavy: 4,
} as const;

// ============================================================================
// TYPOGRAPHY PRIMITIVES
// ============================================================================

export const typographyPrimitives = {
  // Font Families
  fontFamily: {
    system: 'System',
    mono: 'monospace',
  },

  // Font Sizes (minimum 13px for mobile accessibility)
  fontSize: {
    '2xs': 11,
    xs: 13,
    sm: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 40,
    '8xl': 48,
  },

  // Font Weights
  fontWeight: {
    light: '300' as TextStyle['fontWeight'],
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extrabold: '800' as TextStyle['fontWeight'],
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
} as const;

// ============================================================================
// SHADOW PRIMITIVES
// ============================================================================

export const shadowPrimitives = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  xl: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  '2xl': {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  '3xl': {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

// ============================================================================
// Z-INDEX PRIMITIVES
// ============================================================================

export const zIndexPrimitives = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
  max: 9999,
} as const;

// ============================================================================
// OPACITY PRIMITIVES
// ============================================================================

export const opacityPrimitives = {
  0: 0,
  5: 0.05,
  10: 0.1,
  15: 0.15,
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

  // Semantic
  disabled: 0.4,
  hover: 0.9,
  pressed: 0.7,
  focus: 0.85,
} as const;

// ============================================================================
// SIZE PRIMITIVES
// ============================================================================

export const sizePrimitives = {
  // Touch targets (minimum 44px for accessibility)
  touchTarget: {
    minimum: 44,
    comfortable: 48,
    spacious: 56,
  },

  // Icon sizes
  icon: {
    '2xs': 12,
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },

  // Avatar sizes
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 80,
    '3xl': 96,
  },
} as const;

// ============================================================================
// COMBINED PRIMITIVES EXPORT
// ============================================================================

export const primitiveTokens = {
  color: colorPrimitives,
  spacing: spacingPrimitives,
  radius: radiusPrimitives,
  borderWidth: borderWidthPrimitives,
  typography: typographyPrimitives,
  shadow: shadowPrimitives,
  zIndex: zIndexPrimitives,
  opacity: opacityPrimitives,
  size: sizePrimitives,
} as const;

export type PrimitiveTokens = typeof primitiveTokens;
