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
import { sdaSemanticColors } from '../shared/theme/sdaColors';
import { darkColors } from '../shared/theme/darkColors';
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

// Theme object structure for backward compatibility with components expecting { theme: { colors, ... } }
interface ThemeObject {
  colors: LegacyThemeColors;
}

export interface ThemeContextType {
  /** User's theme preference (light, dark, or system) */
  mode: ThemeMode;
  
  /** The resolved active theme (always light or dark) */
  activeTheme: ActiveTheme;
  
  /** 
   * Legacy colors object (flat structure)
   * @deprecated For new code, use useDesignTokens() hook instead
   */
  colors: LegacyThemeColors;
  
  /**
   * Theme object for backward compatibility
   * Components that do `const { theme } = useTheme()` can still access theme.colors
   */
  theme: ThemeObject;
  
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(THEME_MODE.SYSTEM);
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>(
    systemColorScheme === THEME_MODE.DARK ? THEME_MODE.DARK : THEME_MODE.LIGHT
  );

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Update active theme when mode or system theme changes
  useEffect(() => {
    const theme: ActiveTheme = mode === THEME_MODE.SYSTEM 
      ? (systemColorScheme === THEME_MODE.DARK ? THEME_MODE.DARK : THEME_MODE.LIGHT)
      : mode as ActiveTheme;
    setActiveTheme(theme);
  }, [mode, systemColorScheme]);

  const loadTheme = async () => {
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

  const setTheme = async (newMode: ThemeMode) => {
    try {
      setMode(newMode);
      await AsyncStorage.setItem(storageKeys.THEME, newMode);
    } catch (error) {
      logger.error(LOG_MESSAGES.CONTEXTS.THEME.SAVE_ERROR, error as Error);
    }
  };

  const toggleTheme = async () => {
    const newMode = activeTheme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    await setTheme(newMode);
  };

  // Memoize colors (legacy flat structure for backward compatibility)
  const colors = useMemo(() => {
    return activeTheme === THEME_MODE.DARK ? darkColors : sdaSemanticColors;
  }, [activeTheme]);

  const isDark = activeTheme === THEME_MODE.DARK;

  // Theme object for backward compatibility
  const theme: ThemeObject = useMemo(() => ({
    colors: colors as unknown as LegacyThemeColors,
  }), [colors]);

  const value: ThemeContextType = {
    mode,
    activeTheme,
    colors: colors as unknown as LegacyThemeColors,
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
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
 * Helper hook for easy color access
 * 
 * @deprecated For new code, use useTokenColors() from ../shared/hooks instead
 * @returns Legacy flat colors object for the current theme
 */
export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
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
export const useIsDark = () => {
  const { isDark } = useTheme();
  return isDark;
};

/**
 * Helper hook to get the active theme
 * 
 * @returns 'light' or 'dark'
 */
export const useActiveTheme = () => {
  const { activeTheme } = useTheme();
  return activeTheme;
};
