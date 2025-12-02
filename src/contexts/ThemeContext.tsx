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

const THEME_STORAGE_KEY = '@sda_theme';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

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
  const [mode, setMode] = useState<ThemeMode>('system');
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>(
    systemColorScheme === 'dark' ? 'dark' : 'light'
  );

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Update active theme when mode or system theme changes
  useEffect(() => {
    const theme: ActiveTheme = mode === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : mode as ActiveTheme;
    setActiveTheme(theme);
  }, [mode, systemColorScheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setMode(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newMode: ThemeMode) => {
    try {
      setMode(newMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = activeTheme === 'light' ? 'dark' : 'light';
    await setTheme(newMode);
  };

  // Memoize colors (legacy flat structure for backward compatibility)
  const colors = useMemo(() => {
    return activeTheme === 'dark' ? darkColors : sdaSemanticColors;
  }, [activeTheme]);

  const isDark = activeTheme === 'dark';

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
    throw new Error('useTheme must be used within a ThemeProvider');
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
