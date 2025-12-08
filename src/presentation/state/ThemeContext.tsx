/**
 * Theme Context
 *
 * Provides theme switching and management for the application.
 * This context is the central hub for theme state throughout the application.
 *
 * USAGE:
 * Use the useTheme() hook to access all theme values including colors, spacing, typography, etc.
 *
 * @example
 * const { colors, spacing, typography, radii, shadows } = useTheme();
 *
 * NOTE: Features should NEVER import designTokens directly.
 * All theme values should be accessed via useTheme().
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sdaSemanticColors, statusColors, roleColors } from '../theme/sdaColors';
import { darkColors, darkStatusColors, darkRoleColors } from '../theme/darkColors';
import { darkBlueColors, darkBlueStatusColors, darkBlueRoleColors } from '../theme/darkBlueColors';
// eslint-disable-next-line no-restricted-imports -- ThemeContext is the source of theme values, legitimate import
import {
  spacing as spacingTokens,
  borderRadius,
  borderWidth,
  shadows as shadowTokens,
  typographyTokens,
  iconSize,
  avatarSize,
  componentSizes,
  lineHeights,
  opacity as opacityTokens,
  breakpoints as breakpointTokens,
  responsiveScale as responsiveScaleTokens,
} from '../theme/designTokens';
import { storageKeys } from '../../shared/config/storage';
import { THEME_MODE, ThemeModeValue } from '../../shared/constants/ui';
import { logger } from '../../shared/utils/logger';
import { LOG_MESSAGES } from '../../shared/constants/logMessages';

export type ThemeMode = ThemeModeValue;
export type ActiveTheme = typeof THEME_MODE.LIGHT | typeof THEME_MODE.DARK | typeof THEME_MODE.DARK_BLUE;

// Theme colors type - matches sdaSemanticColors structure
type ThemeColors = typeof sdaSemanticColors;

// Status color structure (theme-aware)
interface StatusColorConfig {
  primary: string;
  light: string;
  medium: string;
  text: string;
  icon: string;
}

type StatusColors = {
  active: StatusColorConfig;
  inactive: StatusColorConfig;
  paused: StatusColorConfig;
  pending: StatusColorConfig;
  completed: StatusColorConfig;
  scheduled: StatusColorConfig;
  skipped: StatusColorConfig;
  cancelled: StatusColorConfig;
};

// Role color structure (theme-aware)
interface RoleColorConfig {
  primary: string;
  light: string;
  medium: string;
  text: string;
  icon: string;
}

type RoleColors = {
  admin: RoleColorConfig;
  club_admin: RoleColorConfig;
  user: RoleColorConfig;
};

// Token types for complete theme access
type SpacingTokens = typeof spacingTokens;
type RadiusTokens = typeof borderRadius;
type BorderWidthTokens = typeof borderWidth;
type ShadowTokens = typeof shadowTokens;
type TypographyTokens = typeof typographyTokens;
type IconSizeTokens = typeof iconSize;
type AvatarSizeTokens = typeof avatarSize;
type ComponentSizeTokens = typeof componentSizes;
type LineHeightTokens = typeof lineHeights;
type OpacityTokens = typeof opacityTokens;
type BreakpointTokens = typeof breakpointTokens;
type ResponsiveScaleTokens = typeof responsiveScaleTokens;

export interface ThemeContextType {
  /** User's theme preference (light, dark, or system) */
  mode: ThemeMode;

  /** The resolved active theme (always light or dark) */
  activeTheme: ActiveTheme;

  /** Colors object for theming (theme-aware) */
  colors: ThemeColors;

  /**
   * Spacing tokens - Use these instead of importing designTokens
   * @example const { spacing } = useTheme(); style={{ padding: spacing.md }}
   */
  spacing: SpacingTokens;

  /**
   * Border radius tokens - Use these instead of importing designTokens
   * @example const { radii } = useTheme(); style={{ borderRadius: radii.lg }}
   */
  radii: RadiusTokens;

  /**
   * Shadow tokens - Use these instead of importing designTokens
   * @example const { shadows } = useTheme(); style={shadows.md}
   */
  shadows: ShadowTokens;

  /**
   * Typography tokens (fontSizes, fontWeights, lineHeights)
   * @example const { typography } = useTheme(); style={{ fontSize: typography.fontSizes.lg }}
   */
  typography: TypographyTokens;

  /**
   * Icon size tokens
   * @example const { iconSizes } = useTheme(); size={iconSizes.md}
   */
  iconSizes: IconSizeTokens;

  /**
   * Component size tokens (for building custom components)
   * @example const { componentSizes } = useTheme();
   */
  componentSizes: ComponentSizeTokens;

  /**
   * Avatar size tokens
   * @example const { avatarSizes } = useTheme(); style={{ width: avatarSizes.lg }}
   */
  avatarSizes: AvatarSizeTokens;

  /**
   * Border width tokens
   * @example const { borderWidths } = useTheme(); style={{ borderWidth: borderWidths.thin }}
   */
  borderWidths: BorderWidthTokens;

  /**
   * Line height tokens (pixel values for specific use cases)
   * @example const { lineHeights } = useTheme(); style={{ lineHeight: lineHeights.body }}
   */
  lineHeights: LineHeightTokens;

  /**
   * Opacity tokens
   * @example const { opacity } = useTheme(); style={{ opacity: opacity.high }}
   */
  opacity: OpacityTokens;

  /**
   * Breakpoint tokens for responsive design
   * @example const { breakpoints } = useTheme(); if (width > breakpoints.tablet) { ... }
   */
  breakpoints: BreakpointTokens;

  /**
   * Responsive scale tokens for modals and layouts
   * @example const { responsiveScale } = useTheme(); width * responsiveScale.modal.desktop
   */
  responsiveScale: ResponsiveScaleTokens;

  /**
   * Theme-aware status colors (for StatusIndicator, Badge)
   * These automatically switch between light/dark variants
   */
  statusColors: StatusColors;

  /**
   * Theme-aware role colors (for Badge, user roles)
   * These automatically switch between light/dark variants
   */
  roleColors: RoleColors;

  /** Whether the current theme is dark */
  isDark: boolean;

  /** Set the theme mode */
  setTheme: (mode: ThemeMode) => Promise<void>;

  /** Toggle between light and dark mode */
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Helper to resolve active theme from mode and system preference
const resolveActiveTheme = (
  mode: ThemeMode,
  systemColorScheme: ReturnType<typeof useColorScheme>
): ActiveTheme => {
  if (mode === THEME_MODE.SYSTEM) {
    return systemColorScheme === THEME_MODE.DARK ? THEME_MODE.DARK : THEME_MODE.LIGHT;
  }
  // For explicit modes (light, dark, dark_blue), return as is
  return mode as ActiveTheme;
};

// Helper to load theme from storage
const loadThemeFromStorage = async (
  setMode: React.Dispatch<React.SetStateAction<ThemeMode>>
): Promise<void> => {
  try {
    const savedTheme = await AsyncStorage.getItem(storageKeys.THEME);
    const validThemes = [THEME_MODE.LIGHT, THEME_MODE.DARK, THEME_MODE.DARK_BLUE, THEME_MODE.SYSTEM];
    if (savedTheme && validThemes.includes(savedTheme as ThemeModeValue)) {
      setMode(savedTheme as ThemeMode);
    }
  } catch (error) {
    logger.error(LOG_MESSAGES.CONTEXTS.THEME.LOAD_ERROR, error as Error);
  }
};

// Helper to save theme to storage
const saveThemeToStorage = async (newMode: ThemeMode): Promise<void> => {
  try {
    await AsyncStorage.setItem(storageKeys.THEME, newMode);
  } catch (error) {
    logger.error(LOG_MESSAGES.CONTEXTS.THEME.SAVE_ERROR, error as Error);
  }
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(THEME_MODE.SYSTEM);
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>(
    resolveActiveTheme(THEME_MODE.SYSTEM, systemColorScheme)
  );

  useEffect(() => {
    loadThemeFromStorage(setMode);
  }, []);

  useEffect(() => {
    setActiveTheme(resolveActiveTheme(mode, systemColorScheme));
  }, [mode, systemColorScheme]);

  const setTheme = async (newMode: ThemeMode): Promise<void> => {
    setMode(newMode);
    await saveThemeToStorage(newMode);
  };

  const toggleTheme = async (): Promise<void> => {
    const newMode = activeTheme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    await setTheme(newMode);
  };

  const colors = useMemo(() => {
    switch (activeTheme) {
      case THEME_MODE.DARK:
        return darkColors;
      case THEME_MODE.DARK_BLUE:
        return darkBlueColors;
      default:
        return sdaSemanticColors;
    }
  }, [activeTheme]);

  const themeStatusColors = useMemo(() => {
    switch (activeTheme) {
      case THEME_MODE.DARK:
        return darkStatusColors as StatusColors;
      case THEME_MODE.DARK_BLUE:
        return darkBlueStatusColors as StatusColors;
      default:
        return statusColors as StatusColors;
    }
  }, [activeTheme]);

  const themeRoleColors = useMemo(() => {
    switch (activeTheme) {
      case THEME_MODE.DARK:
        return darkRoleColors as RoleColors;
      case THEME_MODE.DARK_BLUE:
        return darkBlueRoleColors as RoleColors;
      default:
        return roleColors as RoleColors;
    }
  }, [activeTheme]);

  const isDark = activeTheme === THEME_MODE.DARK || activeTheme === THEME_MODE.DARK_BLUE;

  const value: ThemeContextType = {
    mode,
    activeTheme,
    colors,
    // Design tokens - exposed via context so features don't need to import designTokens directly
    spacing: spacingTokens,
    radii: borderRadius,
    shadows: shadowTokens,
    typography: typographyTokens,
    iconSizes: iconSize,
    componentSizes,
    avatarSizes: avatarSize,
    borderWidths: borderWidth,
    lineHeights,
    opacity: opacityTokens,
    breakpoints: breakpointTokens,
    responsiveScale: responsiveScaleTokens,
    // Theme-aware properties
    statusColors: themeStatusColors,
    roleColors: themeRoleColors,
    isDark,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook to access the theme context
 *
 * @returns Theme context with mode, activeTheme, colors, isDark, setTheme, and toggleTheme
 *
 * @example
 * const { colors, isDark, toggleTheme } = useTheme();
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(LOG_MESSAGES.CONTEXTS.THEME.USE_OUTSIDE_PROVIDER);
  }
  return context;
};

/**
 * Helper hook to get the active theme
 *
 * @returns 'light' or 'dark'
 */
export const useActiveTheme = (): ThemeModeValue => {
  const { activeTheme } = useTheme();
  return activeTheme;
};
