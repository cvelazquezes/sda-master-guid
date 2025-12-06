/**
 * useThemeColor Hook
 * Centralized color resolution for themed components.
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
  getBackgroundColor: (key?: BackgroundColor) => string | undefined;
  getInteractiveBackgroundColor: (key?: InteractiveBackgroundColor) => string | undefined;
  getBorderColor: (key?: BorderColor) => string | undefined;
  getPressableBorderColor: (key?: PressableBorderColor) => string | undefined;
  getDividerColor: (key?: DividerColor) => string;
  getStatusColor: (status: StatusType) => StatusColorConfig;
  getRoleColor: (role: RoleType) => RoleColorConfig;
  colors: Record<string, string>;
  isDark: boolean;
}

type ColorsRecord = Record<string, string>;

function createBgMap(c: ColorsRecord): Record<string, string | undefined> {
  return {
    background: c.background,
    backgroundPrimary: c.backgroundPrimary,
    backgroundSecondary: c.backgroundSecondary,
    backgroundTertiary: c.backgroundTertiary,
    backgroundElevated: c.backgroundElevated,
    surface: c.surface,
    surfaceLight: c.surfaceLight,
    surfaceDark: c.surfaceDark,
    surfaceHovered: c.surfaceHovered,
    surfacePressed: c.surfacePressed,
    primary: c.primary,
    primaryLight: c.primaryLight,
    primaryHover: c.primaryHover,
    primaryActive: c.primaryActive,
    primaryAlpha10: c.primaryAlpha10,
    primaryAlpha20: c.primaryAlpha20,
    secondary: c.secondary,
    secondaryLight: c.secondaryLight,
    secondaryHover: c.secondaryHover,
    accent: c.accent,
    accentLight: c.accentLight,
    accentHover: c.accentHover,
    success: c.success,
    successLight: c.successLight,
    warning: c.warning,
    warningLight: c.warningLight,
    error: c.error,
    errorLight: c.errorLight,
    info: c.info,
    infoLight: c.infoLight,
  };
}

function createBorderMap(c: ColorsRecord): Record<string, string | undefined> {
  return {
    border: c.border,
    borderLight: c.borderLight,
    borderMedium: c.borderMedium,
    borderDark: c.borderDark,
    borderFocus: c.borderFocus,
    borderError: c.borderError,
    borderSuccess: c.borderSuccess,
    primary: c.primary,
    secondary: c.secondary,
    accent: c.accent,
    error: c.error,
    success: c.success,
    warning: c.warning,
    info: c.info,
  };
}

function createDividerMap(c: ColorsRecord): Record<string, string | undefined> {
  return {
    border: c.border,
    borderLight: c.borderLight,
    borderMedium: c.borderMedium,
    borderDark: c.borderDark,
    divider: c.border,
    surface: c.surface,
    surfaceLight: c.surfaceLight,
  };
}

export const useThemeColor = (): UseThemeColorReturn => {
  const { colors, statusColors, roleColors, isDark } = useTheme();

  const bgMap = useMemo(() => createBgMap(colors), [colors]);
  const borderMap = useMemo(() => createBorderMap(colors), [colors]);
  const dividerMap = useMemo(() => createDividerMap(colors), [colors]);

  const getBackgroundColor = useCallback(
    (key?: BackgroundColor): string | undefined => {
      if (!key || key === 'none') {
        return undefined;
      }
      return key === 'transparent' ? 'transparent' : bgMap[key];
    },
    [bgMap]
  );

  const getInteractiveBackgroundColor = useCallback(
    (key?: InteractiveBackgroundColor): string | undefined => {
      if (!key || key === 'none') {
        return undefined;
      }
      return key === 'transparent' ? 'transparent' : bgMap[key];
    },
    [bgMap]
  );

  const getBorderColor = useCallback(
    (key?: BorderColor): string | undefined => {
      if (!key) {
        return undefined;
      }
      return key === 'transparent' ? 'transparent' : borderMap[key];
    },
    [borderMap]
  );

  const getPressableBorderColor = useCallback(
    (key?: PressableBorderColor): string | undefined => {
      if (!key) {
        return undefined;
      }
      return key === 'transparent' ? 'transparent' : borderMap[key];
    },
    [borderMap]
  );

  const getDividerColor = useCallback(
    (key?: DividerColor): string => (!key ? colors.border : dividerMap[key] || colors.border),
    [dividerMap, colors.border]
  );

  const getStatusColor = useCallback(
    (status: StatusType): StatusColorConfig => statusColors[status] as StatusColorConfig,
    [statusColors]
  );

  const getRoleColor = useCallback(
    (role: RoleType): RoleColorConfig => roleColors[role] as RoleColorConfig,
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
