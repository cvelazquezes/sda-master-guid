/**
 * Typography System
 *
 * Type scale following Material Design and iOS HIG principles.
 * Ensures consistent, accessible, and responsive typography.
 */

import { Platform, TextStyle } from 'react-native';

/**
 * Font families
 */
export const fontFamilies = {
  // System fonts
  system: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Monospace
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),

  // Custom fonts (add after loading with expo-font)
  primary: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  secondary: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
} as const;

/**
 * Font weights
 */
export const fontWeights = {
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
} as const;

/**
 * Font sizes (in pixels)
 */
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
} as const;

/**
 * Line heights
 */
export const lineHeights = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 36,
  '3xl': 42,
  '4xl': 48,
  '5xl': 60,
  '6xl': 72,
  '7xl': 84,
  '8xl': 108,
} as const;

/**
 * Letter spacing
 */
export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

/**
 * Typography styles following Material Design type scale
 */
export const typography = {
  // Display styles
  displayLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['6xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['6xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  displayMedium: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['5xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  displaySmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['4xl'],
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Headline styles
  headlineLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['3xl'],
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  headlineMedium: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights['2xl'],
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  headlineSmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.xl,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Title styles
  titleLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.lg,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  titleMedium: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.md,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  titleSmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.sm,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Body styles
  bodyLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.md,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.sm,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.xs,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Label styles
  labelLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.sm,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  labelMedium: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.xs,
    letterSpacing: letterSpacing.wider,
  } as TextStyle,

  labelSmall: {
    fontFamily: fontFamilies.primary,
    fontSize: 11,
    fontWeight: fontWeights.medium,
    lineHeight: 14,
    letterSpacing: letterSpacing.wider,
  } as TextStyle,

  // Special styles
  button: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.sm,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,

  caption: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.xs,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  overline: {
    fontFamily: fontFamilies.primary,
    fontSize: 10,
    fontWeight: fontWeights.medium,
    lineHeight: 12,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,

  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.md,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
} as const;

/**
 * Typography utility functions
 */
export const typographyUtils = {
  /**
   * Get responsive font size based on screen size
   *
   * @param baseSize - Base font size
   * @param scale - Scale factor (default: 1)
   * @returns Scaled font size
   */
  responsive(baseSize: number, scale: number = 1): number {
    return Math.round(baseSize * scale);
  },

  /**
   * Calculate optimal line height for font size
   *
   * @param fontSize - Font size in pixels
   * @returns Calculated line height
   */
  calculateLineHeight(fontSize: number): number {
    return Math.round(fontSize * 1.5);
  },

  /**
   * Truncate text with ellipsis
   *
   * @param maxLines - Maximum number of lines
   * @returns Text style with truncation
   */
  truncate(maxLines: number = 1): TextStyle {
    return {
      numberOfLines: maxLines,
    } as TextStyle; // numberOfLines is used by Text component
  },
};

export type TypographyStyle = keyof typeof typography;
