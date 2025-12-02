/**
 * useDesignTokens Hook
 * 
 * The primary hook for consuming design tokens throughout the application.
 * Provides theme-aware token values that automatically update when theme changes.
 * 
 * USAGE:
 * const { colors, spacing, typography, components } = useDesignTokens();
 * 
 * <View style={{ backgroundColor: colors.background.surface }}>
 *   <Text style={{ color: colors.text.primary, ...typography.body.medium }}>
 *     Hello World
 *   </Text>
 * </View>
 */

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { resolveTokens, lightTokens, darkTokens } from '../theme/tokens/resolver';
import { primitiveTokens } from '../theme/tokens/primitives';
import { motionTokens } from '../theme/tokens/motion';
import { layoutTokens, getCurrentBreakpoint, isCompactWidth, getResponsiveDensity, type DensityMode } from '../theme/tokens/layout';
import { behaviorTokens } from '../theme/tokens/behavior';
import type { ResolvedDesignTokens } from '../theme/tokens/types';

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Primary hook for consuming design tokens
 * 
 * Automatically resolves tokens based on the current theme and memoizes
 * the result for optimal performance.
 * 
 * @returns Resolved design tokens for the current theme
 * 
 * @example
 * function MyComponent() {
 *   const { colors, semantic, components } = useDesignTokens();
 *   
 *   return (
 *     <View style={{
 *       backgroundColor: colors.background.surface,
 *       padding: semantic.spacing.layout.screenPadding,
 *       borderRadius: components.card.variants.default.borderRadius,
 *     }}>
 *       <Text style={{ color: colors.text.primary }}>
 *         Hello World
 *       </Text>
 *     </View>
 *   );
 * }
 */
export function useDesignTokens(): ResolvedDesignTokens {
  const { activeTheme } = useTheme();
  
  // Memoize resolved tokens to prevent unnecessary recalculations
  const tokens = useMemo(() => {
    return resolveTokens(activeTheme);
  }, [activeTheme]);
  
  return tokens;
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

/**
 * Hook for consuming only semantic colors
 * 
 * @returns Theme-aware semantic colors
 * 
 * @example
 * const colors = useTokenColors();
 * <View style={{ backgroundColor: colors.background.primary }} />
 */
export function useTokenColors() {
  const { colors } = useDesignTokens();
  return colors;
}

/**
 * Hook for consuming only spacing tokens
 * 
 * @returns Spacing tokens (same for all themes)
 * 
 * @example
 * const spacing = useTokenSpacing();
 * <View style={{ padding: spacing.layout.screenPadding }} />
 */
export function useTokenSpacing() {
  const { semantic } = useDesignTokens();
  return semantic.spacing;
}

/**
 * Hook for consuming only typography tokens
 * 
 * @returns Typography tokens
 * 
 * @example
 * const typography = useTokenTypography();
 * <Text style={typography.heading.h1} />
 */
export function useTokenTypography() {
  const { semantic } = useDesignTokens();
  return semantic.typography;
}

/**
 * Hook for consuming only component tokens
 * 
 * @returns Theme-aware component tokens
 * 
 * @example
 * const components = useTokenComponents();
 * const buttonStyle = components.button.variants.primary;
 */
export function useTokenComponents() {
  const { components } = useDesignTokens();
  return components;
}

/**
 * Hook for consuming only motion tokens
 * 
 * @returns Motion/animation tokens (same for all themes)
 * 
 * @example
 * const motion = useTokenMotion();
 * Animated.timing(value, { duration: motion.duration.normal });
 */
export function useTokenMotion() {
  return motionTokens;
}

/**
 * Hook for consuming primitive tokens
 * 
 * @returns Raw primitive tokens (same for all themes)
 * 
 * @example
 * const primitives = useTokenPrimitives();
 * const blue500 = primitives.color.blue[500];
 */
export function useTokenPrimitives() {
  return primitiveTokens;
}

/**
 * Hook for consuming layout tokens
 * 
 * @returns Layout tokens (breakpoints, grid, density, etc.)
 * 
 * @example
 * const layout = useTokenLayout();
 * const isTablet = width >= layout.breakpoints.md;
 */
export function useTokenLayout() {
  return layoutTokens;
}

/**
 * Hook for consuming behavior tokens
 * 
 * @returns Behavior tokens (timing, interactions, validation, etc.)
 * 
 * @example
 * const behavior = useTokenBehavior();
 * const debounceMs = behavior.timing.debounce.search;
 */
export function useTokenBehavior() {
  return behaviorTokens;
}

/**
 * Hook for responsive layout information
 * 
 * @returns Responsive layout state based on current screen width
 * 
 * @example
 * const { isCompact, breakpoint, density, width } = useResponsiveLayout();
 * 
 * if (isCompact) {
 *   // Render compact layout
 * }
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  
  return useMemo(() => ({
    /** Current screen width */
    width,
    /** Current screen height */
    height,
    /** Current breakpoint name */
    breakpoint: getCurrentBreakpoint(width),
    /** Whether in compact mode (phones) */
    isCompact: isCompactWidth(width),
    /** Whether tablet or larger */
    isTablet: width >= layoutTokens.breakpoints.md,
    /** Whether desktop or larger */
    isDesktop: width >= layoutTokens.breakpoints.lg,
    /** Recommended density for current width */
    density: getResponsiveDensity(width),
    /** Layout breakpoints for comparison */
    breakpoints: layoutTokens.breakpoints,
  }), [width, height]);
}

/**
 * Hook for determining appropriate density
 * 
 * @param overrideDensity - Optional override for density
 * @returns Density configuration values
 * 
 * @example
 * const density = useDensity();
 * const padding = density.cardPadding;
 */
export function useDensity(overrideDensity?: DensityMode) {
  const { width } = useWindowDimensions();
  
  return useMemo(() => {
    const densityMode = overrideDensity ?? getResponsiveDensity(width);
    return layoutTokens.density[densityMode];
  }, [width, overrideDensity]);
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook that returns a color based on theme
 * Useful for dynamic color selection
 * 
 * @param lightColor - Color to use in light theme
 * @param darkColor - Color to use in dark theme
 * @returns The appropriate color for current theme
 * 
 * @example
 * const bgColor = useThemedColor('#FFFFFF', '#121212');
 */
export function useThemedColor(lightColor: string, darkColor: string): string {
  const { isDark } = useTheme();
  return isDark ? darkColor : lightColor;
}

/**
 * Hook that returns a value based on theme
 * Generic version for any value type
 * 
 * @param lightValue - Value to use in light theme
 * @param darkValue - Value to use in dark theme
 * @returns The appropriate value for current theme
 * 
 * @example
 * const opacity = useThemedValue(0.1, 0.2);
 */
export function useThemedValue<T>(lightValue: T, darkValue: T): T {
  const { isDark } = useTheme();
  return isDark ? darkValue : lightValue;
}

/**
 * Hook for quick access to theme state
 * 
 * @returns Object with theme state information
 * 
 * @example
 * const { isDark, activeTheme } = useThemeState();
 */
export function useThemeState() {
  const { activeTheme, isDark, mode } = useTheme();
  return { activeTheme, isDark, mode };
}

// ============================================================================
// STATIC TOKEN ACCESS
// ============================================================================

/**
 * Get tokens for a specific theme without hooks
 * Useful for StyleSheet.create() or other static contexts
 * 
 * @param theme - 'light' or 'dark'
 * @returns Resolved tokens for the specified theme
 * 
 * @example
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: getStaticTokens('light').colors.background.surface,
 *   },
 * });
 */
export function getStaticTokens(theme: 'light' | 'dark'): ResolvedDesignTokens {
  return theme === 'dark' ? darkTokens : lightTokens;
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useDesignTokens;

