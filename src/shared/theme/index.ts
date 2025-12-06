/**
 * Theme System
 *
 * Comprehensive design system combining colors, typography, spacing, and more.
 * Supports light/dark modes and follows Material Design & iOS HIG principles.
 *
 * Updated with SDA Master Guide Brand Colors and Design Tokens
 *
 * Based on design systems from:
 * - Material Design 3
 * - iOS Human Interface Guidelines
 * - Tailwind CSS
 * - Chakra UI
 *
 * DESIGN TOKENS (Recommended - Single Source of Truth):
 * Import from './tokens' for the new unified token system:
 *
 * ```typescript
 * import { useDesignTokens } from '../hooks/useDesignTokens';
 * // or
 * import { designTokensV2, resolveTokens } from '../theme/tokens';
 * ```
 */

import { colors, colorUtils } from './colors';
import { typography, fontFamilies, fontWeights, fontSizes, lineHeights } from './typography';
import {
  spacing,
  semanticSpacing,
  borderRadius,
  borderWidth,
  shadows,
  zIndex,
  opacity,
  sizes,
  iconSizes,
  componentSpacing,
  containerSpacing,
} from './spacing';
import {
  mobileTypography,
  mobileFontSizes,
  mobileIconSizes,
  touchTargets,
  textStyles,
  getResponsiveFontSize,
  calculateLineHeight,
  isMobileFriendly,
} from './mobileTypography';
// SDA Brand Colors and Design Tokens
import sdaColors, {
  sdaBrandColors,
  sdaSemanticColors,
  roleColors,
  statusColors,
  hierarchyColors,
  sdaColorUtils,
} from './sdaColors';
import { designTokens } from './designTokens';
// NEW: Design Tokens V2 - Single Source of Truth
import { designTokensV2 } from './tokens';
// Layout Constants - Single Source of Truth for style string values
import { layoutConstants } from './layoutConstants';

/**
 * Theme modes
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Light theme
 */
export const lightTheme = {
  mode: 'light' as ThemeMode,

  // Colors
  colors: {
    ...colors,
    background: colors.light.background,
    surface: colors.light.surface,
    surfaceVariant: colors.light.surfaceVariant,
    onBackground: colors.light.onBackground,
    onSurface: colors.light.onSurface,
    onSurfaceVariant: colors.light.onSurfaceVariant,
    border: colors.light.border,
    divider: colors.light.divider,
    overlay: colors.light.overlay,
    shadow: colors.light.shadow,
    disabled: colors.light.disabled,
    placeholder: colors.light.placeholder,

    // Semantic colors
    primary: colors.primary[500],
    primaryLight: colors.primary[300],
    primaryDark: colors.primary[700],
    secondary: colors.secondary[500],
    secondaryLight: colors.secondary[300],
    secondaryDark: colors.secondary[700],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    info: colors.info[500],
  },

  // Typography
  typography,
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,

  // Spacing
  spacing,
  semanticSpacing,
  containerSpacing,
  componentSpacing,

  // Borders & Shadows
  borderRadius,
  borderWidth,
  shadows,

  // Layout
  zIndex,
  opacity,
  sizes,
  iconSizes,

  // Utilities
  utils: colorUtils,
} as const;

/**
 * Dark theme
 */
export const darkTheme = {
  mode: 'dark' as ThemeMode,

  // Colors
  colors: {
    ...colors,
    background: colors.dark.background,
    surface: colors.dark.surface,
    surfaceVariant: colors.dark.surfaceVariant,
    onBackground: colors.dark.onBackground,
    onSurface: colors.dark.onSurface,
    onSurfaceVariant: colors.dark.onSurfaceVariant,
    border: colors.dark.border,
    divider: colors.dark.divider,
    overlay: colors.dark.overlay,
    shadow: colors.dark.shadow,
    disabled: colors.dark.disabled,
    placeholder: colors.dark.placeholder,

    // Semantic colors (adjusted for dark mode)
    primary: colors.primary[400],
    primaryLight: colors.primary[300],
    primaryDark: colors.primary[600],
    secondary: colors.secondary[400],
    secondaryLight: colors.secondary[300],
    secondaryDark: colors.secondary[600],
    success: colors.success[400],
    warning: colors.warning[400],
    error: colors.error[400],
    info: colors.info[400],
  },

  // Typography
  typography,
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,

  // Spacing
  spacing,
  semanticSpacing,
  containerSpacing,
  componentSpacing,

  // Borders & Shadows
  borderRadius,
  borderWidth,
  shadows,

  // Layout
  zIndex,
  opacity,
  sizes,
  iconSizes,

  // Utilities
  utils: colorUtils,
} as const;

/**
 * Default theme (light)
 */
export const theme = lightTheme;

/**
 * Theme type
 */
export type Theme = typeof lightTheme;

/**
 * Get theme by mode
 *
 * @param mode - Theme mode
 * @returns Theme object
 *
 * @example
 * ```typescript
 * const currentTheme = getTheme('dark');
 * ```
 */
export function getTheme(mode: ThemeMode): Theme {
  if (mode === 'dark') {
    return darkTheme;
  }
  return lightTheme;
}

/**
 * Note: useTheme hook is re-exported from ThemeContext for convenience.
 * The app uses ThemeContext for theme management.
 */

// Re-export useTheme from ThemeContext
export { useTheme } from '../../contexts/ThemeContext';

/**
 * Export all theme-related utilities
 */
export {
  // Legacy colors and typography
  colors,
  colorUtils,
  typography,
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  spacing,
  semanticSpacing,
  containerSpacing,
  componentSpacing,
  borderRadius,
  borderWidth,
  shadows,
  zIndex,
  opacity,
  sizes,
  iconSizes,
  mobileTypography,
  mobileFontSizes,
  mobileIconSizes,
  touchTargets,
  textStyles,
  getResponsiveFontSize,
  calculateLineHeight,
  isMobileFriendly,

  // SDA Brand System (Recommended)
  sdaColors,
  sdaBrandColors,
  sdaSemanticColors,
  roleColors,
  statusColors,
  hierarchyColors,
  sdaColorUtils,
  designTokens,

  // NEW: Design Tokens V2 - Single Source of Truth (RECOMMENDED)
  designTokensV2,

  // Layout Constants - Style string values
  layoutConstants,
};

// Note: For Design Tokens V2, import directly from './tokens'
// export * from './tokens'; // Commented to avoid duplicate exports

/**
 * Export types from colors module
 */
export type { ColorName, ColorShade } from './colors';
