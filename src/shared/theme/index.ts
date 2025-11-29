/**
 * Theme System
 * 
 * Comprehensive design system combining colors, typography, spacing, and more.
 * Supports light/dark modes and follows Material Design & iOS HIG principles.
 * 
 * Based on design systems from:
 * - Material Design 3
 * - iOS Human Interface Guidelines
 * - Tailwind CSS
 * - Chakra UI
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
 * Theme provider hook (for React Context)
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme Provider Component
 * 
 * @example
 * ```typescript
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [effectiveMode, setEffectiveMode] = useState<'light' | 'dark'>('light');

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') {
        setEffectiveMode(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    // Set initial theme
    if (mode === 'system') {
      const systemScheme = Appearance.getColorScheme();
      setEffectiveMode(systemScheme === 'dark' ? 'dark' : 'light');
    } else {
      setEffectiveMode(mode);
    }

    return () => subscription.remove();
  }, [mode]);

  const currentTheme = getTheme(effectiveMode);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const setThemeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  const value: ThemeContextValue = {
    theme: currentTheme,
    mode: effectiveMode,
    toggleTheme,
    setTheme: setThemeMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to use theme in components
 * 
 * @returns Theme context value
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme();
 *   
 *   return (
 *     <View style={{ backgroundColor: theme.colors.background }}>
 *       <Text style={theme.typography.bodyLarge}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * Export all theme-related utilities
 */
export {
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
};

/**
 * Export types
 */
export type {
  ColorName,
  ColorShade,
  TypographyStyle,
  SpacingKey,
  SemanticSpacingKey,
  BorderRadiusKey,
  ShadowKey,
} from './colors';

