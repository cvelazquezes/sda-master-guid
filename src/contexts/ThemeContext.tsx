/**
 * Theme Context
 *
 * Provides theme switching and management integrated with the design token system.
 * This context is the central hub for theme state throughout the application.
 *
 * BACKWARD COMPATIBILITY:
 * - `colors` property maintains the old flat structure for existing components
 * - Use `useDesignTokens()` hook for the new semantic token structure
 *
 * MIGRATION PATH:
 * 1. Existing code continues to work with colors.primary, colors.surface, etc.
 * 2. New code should use useDesignTokens() for colors.brand.primary, colors.background.surface
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sdaSemanticColors, statusColors, roleColors } from '../shared/theme/sdaColors';
import { darkColors, darkStatusColors, darkRoleColors } from '../shared/theme/darkColors';
import { storageKeys } from '../shared/config/storage';
import { THEME_MODE, ThemeModeValue } from '../shared/constants/ui';
import { logger } from '../utils/logger';
import { LOG_MESSAGES } from '../shared/constants/logMessages';

export type ThemeMode = ThemeModeValue;
export type ActiveTheme = typeof THEME_MODE.LIGHT | typeof THEME_MODE.DARK;

// Legacy color interface (flat structure for backward compatibility)
interface LegacyThemeColors {
  [key: string]: string;
}

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

// Theme object structure for backward compatibility
// with components expecting { theme: { colors, ... } }
interface ThemeObject {
  colors: LegacyThemeColors;
}

export interface ThemeContextType {
  /** User's theme preference (light, dark, or system) */
  mode: ThemeMode;

  /** The resolved active theme (always light or dark) */
  activeTheme: ActiveTheme;

  /**
   * Colors object (flat structure)
   * NOTE: For new semantic token structure, use useDesignTokens() hook
   */
  colors: LegacyThemeColors;

  /**
   * Theme object for backward compatibility
   * Components that do `const { theme } = useTheme()` can still access theme.colors
   */
  theme: ThemeObject;

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
): ActiveTheme =>
  mode === THEME_MODE.SYSTEM
    ? systemColorScheme === THEME_MODE.DARK
      ? THEME_MODE.DARK
      : THEME_MODE.LIGHT
    : (mode as ActiveTheme);

// Helper to load theme from storage
const loadThemeFromStorage = async (
  setMode: React.Dispatch<React.SetStateAction<ThemeMode>>
): Promise<void> => {
  try {
    const savedTheme = await AsyncStorage.getItem(storageKeys.THEME);
    const validThemes = [THEME_MODE.LIGHT, THEME_MODE.DARK, THEME_MODE.SYSTEM];
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

  const colors = useMemo(
    () => (activeTheme === THEME_MODE.DARK ? darkColors : sdaSemanticColors),
    [activeTheme]
  );

  const themeStatusColors = useMemo(
    () => (activeTheme === THEME_MODE.DARK ? darkStatusColors : statusColors) as StatusColors,
    [activeTheme]
  );

  const themeRoleColors = useMemo(
    () => (activeTheme === THEME_MODE.DARK ? darkRoleColors : roleColors) as RoleColors,
    [activeTheme]
  );

  const isDark = activeTheme === THEME_MODE.DARK;
  const theme: ThemeObject = useMemo(
    () => ({ colors: colors as unknown as LegacyThemeColors }),
    [colors]
  );

  const value: ThemeContextType = {
    mode,
    activeTheme,
    colors: colors as unknown as LegacyThemeColors,
    theme,
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
 * NOTE: For new code using design tokens, prefer useDesignTokens() hook
 * which provides the semantic token structure (colors.background.surface, etc.)
 *
 * @returns Theme context with mode, activeTheme, colors, isDark, setTheme, and toggleTheme
 *
 * @example
 * // Legacy usage (still works)
 * const { colors, isDark, toggleTheme } = useTheme();
 *
 * // New recommended usage
 * import { useDesignTokens } from '../shared/hooks';
 * const { colors } = useDesignTokens();
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(LOG_MESSAGES.CONTEXTS.THEME.USE_OUTSIDE_PROVIDER);
  }
  return context;
};

/**
 * Helper hook to check if dark mode is active
 *
 * @returns True if dark mode is active
 *
 * @example
 * const isDark = useIsDark();
 * const bgColor = isDark ? '#000' : '#FFF';
 */
export const useIsDark = (): boolean => {
  const { isDark } = useTheme();
  return isDark;
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
