/**
 * Shared Hooks
 *
 * Central export for all shared React hooks
 */

// Theme Color Hook (Centralized color resolution)
export { useThemeColor } from './useThemeColor';

// Shadow Style Hook (Centralized shadow generation)
export { useShadowStyle } from './useShadowStyle';

// Design Tokens Hook (Primary way to consume design tokens)
export {
  // Main hook
  useDesignTokens,

  // Category-specific hooks
  useTokenColors,
  useTokenSpacing,
  useTokenTypography,
  useTokenComponents,
  useTokenMotion,
  useTokenPrimitives,
  useTokenLayout,
  useTokenBehavior,

  // Responsive layout hooks
  useResponsiveLayout,
  useDensity,

  // Theme utilities
  useThemedColor,
  useThemedValue,
  useThemeState,

  // Static access
  getStaticTokens,
} from './useDesignTokens';

// Performance Monitoring
export * from './usePerformanceMonitor';

// Query Hooks
export * from './useQueryHooks';
