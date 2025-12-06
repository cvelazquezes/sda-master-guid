/**
 * useThemeColor Hook
 *
 * Centralized color resolution for themed components.
 * Replaces duplicate getBackgroundColor/getBorderColor functions across components.
 *
 * @example
 * const { getBackgroundColor, getBorderColor, getStatusColor, getRoleColor } = useThemeColor();
 *
 * const bg = getBackgroundColor('surface');
 * const border = getBorderColor('borderLight');
 * const statusConfig = getStatusColor('active');
 */

import { useMemo, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  BackgroundColor,
  InteractiveBackgroundColor,
  BorderColor,
  PressableBorderColor,
  DividerColor,
  StatusType,
  RoleType,
  StatusColorConfig,
  RoleColorConfig,
} from '../types/theme';

interface UseThemeColorReturn {
  /** Get background color from theme by key */
  getBackgroundColor: (key?: BackgroundColor | undefined) => string | undefined;

  /** Get interactive background color (includes hover/press states) */
  getInteractiveBackgroundColor: (
    key?: InteractiveBackgroundColor | undefined
  ) => string | undefined;

  /** Get border color from theme by key */
  getBorderColor: (key?: BorderColor | undefined) => string | undefined;

  /** Get pressable border color (subset of border colors) */
  getPressableBorderColor: (key?: PressableBorderColor | undefined) => string | undefined;

  /** Get divider color */
  getDividerColor: (key?: DividerColor | undefined) => string;

  /** Get status color configuration */
  getStatusColor: (status: StatusType) => StatusColorConfig;

  /** Get role color configuration */
  getRoleColor: (role: RoleType) => RoleColorConfig;

  /** Raw colors from theme */
  colors: Record<string, string>;

  /** Whether dark mode is active */
  isDark: boolean;
}

/**
 * Hook for centralized color resolution
 * Uses theme colors from ThemeContext
 */
// eslint-disable-next-line max-lines-per-function
export const useThemeColor = (): UseThemeColorReturn => {
  const { colors, statusColors, roleColors, isDark } = useTheme();

  // Background color map (memoized)
  const bgColorMap = useMemo<Record<string, string | undefined>>(
    () => ({
      background: colors.background,
      backgroundPrimary: colors.backgroundPrimary,
      backgroundSecondary: colors.backgroundSecondary,
      backgroundTertiary: colors.backgroundTertiary,
      backgroundElevated: colors.backgroundElevated,
      surface: colors.surface,
      surfaceLight: colors.surfaceLight,
      surfaceDark: colors.surfaceDark,
      // Interactive surface states
      surfaceHovered: colors.surfaceHovered,
      surfacePressed: colors.surfacePressed,
      // Brand colors
      primary: colors.primary,
      primaryLight: colors.primaryLight,
      primaryHover: colors.primaryHover,
      primaryActive: colors.primaryActive,
      primaryAlpha10: colors.primaryAlpha10,
      primaryAlpha20: colors.primaryAlpha20,
      secondary: colors.secondary,
      secondaryLight: colors.secondaryLight,
      secondaryHover: colors.secondaryHover,
      accent: colors.accent,
      accentLight: colors.accentLight,
      accentHover: colors.accentHover,
      // Semantic colors
      success: colors.success,
      successLight: colors.successLight,
      warning: colors.warning,
      warningLight: colors.warningLight,
      error: colors.error,
      errorLight: colors.errorLight,
      info: colors.info,
      infoLight: colors.infoLight,
    }),
    [colors]
  );

  // Border color map (memoized)
  const borderColorMap = useMemo<Record<string, string | undefined>>(
    () => ({
      border: colors.border,
      borderLight: colors.borderLight,
      borderMedium: colors.borderMedium,
      borderDark: colors.borderDark,
      borderFocus: colors.borderFocus,
      borderError: colors.borderError,
      borderSuccess: colors.borderSuccess,
      // Brand colors can also be used as borders
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      error: colors.error,
      success: colors.success,
      warning: colors.warning,
      info: colors.info,
    }),
    [colors]
  );

  // Divider color map (memoized)
  const dividerColorMap = useMemo<Record<string, string | undefined>>(
    () => ({
      border: colors.border,
      borderLight: colors.borderLight,
      borderMedium: colors.borderMedium,
      borderDark: colors.borderDark,
      divider: colors.border, // Fallback to border
      surface: colors.surface,
      surfaceLight: colors.surfaceLight,
    }),
    [colors]
  );

  /**
   * Get background color for static containers (Box, Card, etc.)
   */
  const getBackgroundColor = useCallback(
    (key?: BackgroundColor): string | undefined => {
      if (!key || key === 'none') {
        return undefined;
      }
      if (key === 'transparent') {
        return 'transparent';
      }
      return bgColorMap[key];
    },
    [bgColorMap]
  );

  /**
   * Get background color for interactive components (Pressable, Button, etc.)
   * Supports additional hover/press state colors
   */
  const getInteractiveBackgroundColor = useCallback(
    (key?: InteractiveBackgroundColor): string | undefined => {
      if (!key || key === 'none') {
        return undefined;
      }
      if (key === 'transparent') {
        return 'transparent';
      }
      return bgColorMap[key];
    },
    [bgColorMap]
  );

  /**
   * Get border color
   */
  const getBorderColor = useCallback(
    (key?: BorderColor): string | undefined => {
      if (!key) {
        return undefined;
      }
      if (key === 'transparent') {
        return 'transparent';
      }
      return borderColorMap[key];
    },
    [borderColorMap]
  );

  /**
   * Get pressable border color (simplified set)
   */
  const getPressableBorderColor = useCallback(
    (key?: PressableBorderColor): string | undefined => {
      if (!key) {
        return undefined;
      }
      if (key === 'transparent') {
        return 'transparent';
      }
      return borderColorMap[key];
    },
    [borderColorMap]
  );

  /**
   * Get divider color (always returns a valid color)
   */
  const getDividerColor = useCallback(
    (key?: DividerColor): string => {
      if (!key) {
        return colors.border;
      }
      return dividerColorMap[key] || colors.border;
    },
    [dividerColorMap, colors.border]
  );

  /**
   * Get status color configuration
   * Returns the full color config for a status (primary, light, text, icon)
   */
  const getStatusColor = useCallback(
    (status: StatusType): StatusColorConfig => {
      return statusColors[status] as StatusColorConfig;
    },
    [statusColors]
  );

  /**
   * Get role color configuration
   * Returns the full color config for a role (primary, light, text, icon)
   */
  const getRoleColor = useCallback(
    (role: RoleType): RoleColorConfig => {
      return roleColors[role] as RoleColorConfig;
    },
    [roleColors]
  );

  return {
    getBackgroundColor,
    getInteractiveBackgroundColor,
    getBorderColor,
    getPressableBorderColor,
    getDividerColor,
    getStatusColor,
    getRoleColor,
    colors,
    isDark,
  };
};

export default useThemeColor;
