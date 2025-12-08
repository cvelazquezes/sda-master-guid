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
 * THEME USAGE (Recommended - Single Source of Truth):
 * Use the useTheme() hook from ThemeContext for all theme colors:
 *
 * ```typescript
 * import { useTheme } from './state/ThemeContext';
 * const { colors } = useTheme();
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
// Layout Constants - Single Source of Truth for style string values
import { layoutConstants } from './layoutConstants';
// Size Presets - Standardized component sizing
import {
  SIZE_PRESETS,
  BADGE_SIZE_PRESETS,
  STATUS_SIZE_PRESETS,
  BUTTON_SIZE_PRESETS,
  getSizePreset,
  getBadgeSizePreset,
  getStatusSizePreset,
  getButtonSizePreset,
  getSpacing,
  getIconSize,
  getFontSize,
} from './sizePresets';
import { THEME_MODE, COLOR_SHADE } from '../../shared/constants';

/**
 * Theme modes
 */
export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];

/**
 * Light theme
 */
export const lightTheme = {
  mode: THEME_MODE.LIGHT as ThemeMode,

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
    primary: colors.primary[COLOR_SHADE[500]],
    primaryLight: colors.primary[COLOR_SHADE[300]],
    primaryDark: colors.primary[COLOR_SHADE[700]],
    secondary: colors.secondary[COLOR_SHADE[500]],
    secondaryLight: colors.secondary[COLOR_SHADE[300]],
    secondaryDark: colors.secondary[COLOR_SHADE[700]],
    success: colors.success[COLOR_SHADE[500]],
    warning: colors.warning[COLOR_SHADE[500]],
    error: colors.error[COLOR_SHADE[500]],
    info: colors.info[COLOR_SHADE[500]],
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
  mode: THEME_MODE.DARK as ThemeMode,

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
    primary: colors.primary[COLOR_SHADE[400]],
    primaryLight: colors.primary[COLOR_SHADE[300]],
    primaryDark: colors.primary[COLOR_SHADE[600]],
    secondary: colors.secondary[COLOR_SHADE[400]],
    secondaryLight: colors.secondary[COLOR_SHADE[300]],
    secondaryDark: colors.secondary[COLOR_SHADE[600]],
    success: colors.success[COLOR_SHADE[400]],
    warning: colors.warning[COLOR_SHADE[400]],
    error: colors.error[COLOR_SHADE[400]],
    info: colors.info[COLOR_SHADE[400]],
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
export type Theme = typeof lightTheme | typeof darkTheme;

/**
 * Get theme by mode
 *
 * @param mode - Theme mode
 * @returns Theme object
 *
 * @example
 * ```typescript
 * const currentTheme = getTheme(THEME_MODE.DARK);
 * ```
 */
export function getTheme(mode: ThemeMode): Theme {
  if (mode === THEME_MODE.DARK) {
    return darkTheme;
  }
  return lightTheme;
}

/**
 * Note: useTheme hook is re-exported from ThemeContext for convenience.
 * The app uses ThemeContext for theme management.
 */

// Re-export useTheme from ThemeContext
export { useTheme } from '../state/ThemeContext';

/**
 * Export all theme-related utilities
 */
export {
  // Core theme values
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

  // Layout Constants - Style string values
  layoutConstants,

  // Size Presets - Component sizing utilities
  SIZE_PRESETS,
  BADGE_SIZE_PRESETS,
  STATUS_SIZE_PRESETS,
  BUTTON_SIZE_PRESETS,
  getSizePreset,
  getBadgeSizePreset,
  getStatusSizePreset,
  getButtonSizePreset,
  getSpacing,
  getIconSize,
  getFontSize,
};

/**
 * Export types from colors module
 */
export type { ColorName, ColorShade } from './colors';
