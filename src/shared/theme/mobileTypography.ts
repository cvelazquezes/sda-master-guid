/**
 * Mobile Typography Utilities
 *
 * Enhanced typography system optimized for mobile readability
 * Ensures minimum font sizes for accessibility (WCAG 2.1 AA)
 *
 * NOTE: This file intentionally contains literal numbers as it DEFINES typography tokens.
 */

import { TextStyle } from 'react-native';

/**
 * Mobile-Optimized Font Sizes
 * Minimum 13px for mobile readability
 */
export const mobileFontSizes = {
  // Extra small (minimum readable size on mobile)
  xs: 13,
  // Small
  sm: 14,
  // Medium (body text)
  md: 15,
  // Large
  lg: 16,
  // Extra large
  xl: 18,
  // 2x extra large
  '2xl': 20,
  // 3x extra large
  '3xl': 24,
  // 4x extra large
  '4xl': 28,
  // 5x extra large
  '5xl': 32,
} as const;

/**
 * Mobile Icon Sizes
 * Proportional to text for better visual hierarchy
 */
export const mobileIconSizes = {
  tiny: 14,
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
  xxlarge: 32,
} as const;

/**
 * Mobile Touch Targets
 * Minimum 44px recommended by iOS HIG and Material Design
 */
export const touchTargets = {
  minimum: 44,
  comfortable: 48,
  spacious: 56,
} as const;

/**
 * Mobile Typography Styles
 * Pre-configured text styles with optimal line heights
 */
export const mobileTypography = {
  // Display text
  displayLarge: {
    fontSize: mobileFontSizes['5xl'],
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 40,
    color: '#333',
  },
  displayMedium: {
    fontSize: mobileFontSizes['4xl'],
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 36,
    color: '#333',
  },
  displaySmall: {
    fontSize: mobileFontSizes['3xl'],
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 32,
    color: '#333',
  },

  // Headings
  heading1: {
    fontSize: mobileFontSizes['3xl'],
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 32,
    color: '#333',
  },
  heading2: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 28,
    color: '#333',
  },
  heading3: {
    fontSize: mobileFontSizes.xl,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 26,
    color: '#333',
  },
  heading4: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    color: '#333',
  },

  // Body text
  bodyLarge: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
    color: '#666',
  },
  bodyMedium: {
    fontSize: mobileFontSizes.md,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22,
    color: '#666',
  },
  bodySmall: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
    color: '#666',
  },

  // Body bold variants
  bodyLargeBold: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    color: '#333',
  },
  bodyMediumBold: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22,
    color: '#333',
  },
  bodySmallBold: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
    color: '#333',
  },

  // Labels and captions
  label: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 20,
    color: '#666',
  },
  labelBold: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
    color: '#333',
  },
  caption: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
    color: '#999',
  },
  captionBold: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 18,
    color: '#666',
  },

  // Button text
  button: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    color: '#fff',
  },
  buttonSmall: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
    color: '#fff',
  },

  // Badge text
  badge: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 16,
    textTransform: 'uppercase' as TextStyle['textTransform'],
    letterSpacing: 0.5,
  },

  // Helper text
  helper: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
    color: '#999',
  },
  error: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 18,
    color: '#f44336',
  },

  // Backward compatibility aliases
  body: {
    fontSize: mobileFontSizes.md,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22,
    color: '#666',
  },
  buttonMedium: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    color: '#fff',
  },
} as const;

/**
 * Utility function to get responsive font size
 * Scales font size based on base size
 */
export const getResponsiveFontSize = (baseSize: number, scale: number = 1): number => {
  return Math.round(Math.max(baseSize * scale, 13)); // Minimum 13px
};

/**
 * Utility function to calculate line height
 * 1.5x font size is optimal for readability
 */
export const calculateLineHeight = (fontSize: number): number => {
  return Math.round(fontSize * 1.5);
};

/**
 * Utility function to check if text size is mobile-friendly
 */
export const isMobileFriendly = (fontSize: number): boolean => {
  return fontSize >= 13;
};

/**
 * Common text style combinations
 */
export const textStyles = {
  // Card title
  cardTitle: {
    ...mobileTypography.bodyMediumBold,
    color: '#333',
  },
  // Card description
  cardDescription: {
    ...mobileTypography.bodySmall,
    color: '#666',
  },
  // Card metadata
  cardMeta: {
    ...mobileTypography.caption,
    color: '#999',
  },
  // Status text
  statusActive: {
    ...mobileTypography.labelBold,
    color: '#4caf50',
  },
  statusInactive: {
    ...mobileTypography.labelBold,
    color: '#f44336',
  },
  statusPending: {
    ...mobileTypography.labelBold,
    color: '#ff9800',
  },
} as const;

export default mobileTypography;
