/**
 * Token Resolver
 *
 * Resolves design tokens based on the current theme.
 * This is the primary interface for consuming design tokens in the application.
 *
 * USAGE:
 * // In a hook or component
 * const tokens = resolveTokens('light');
 * const backgroundColor = tokens.colors.background.surface;
 */

import { behaviorTokens } from './behavior';
import { createComponentTokens } from './components';
import { layoutTokens } from './layout';
import { motionTokens } from './motion';
import { primitiveTokens } from './primitives';
import { createSemanticTokens, createSemanticColors, type ThemeMode } from './semantic';
import type { ResolvedDesignTokens, TokenPath, TokenValue } from './types';

// ============================================================================
// RESOLVE TOKENS
// ============================================================================

/**
 * Resolves all design tokens for a given theme
 *
 * @param theme - The theme mode ('light' or 'dark')
 * @returns Fully resolved design tokens for the specified theme
 *
 * @example
 * const tokens = resolveTokens('dark');
 * const primaryColor = tokens.colors.brand.primary;
 * const isCompact = width < tokens.layout.breakpoints.md;
 */
export function resolveTokens(theme: ThemeMode): ResolvedDesignTokens {
  const isDark = theme === 'dark';
  const semanticTokens = createSemanticTokens(theme);
  const componentTokens = createComponentTokens(theme);
  const colors = createSemanticColors(theme);

  return {
    theme,
    isDark,
    primitives: primitiveTokens,
    semantic: semanticTokens,
    components: componentTokens,
    motion: motionTokens,
    layout: layoutTokens,
    behavior: behaviorTokens,
    colors,
  };
}

// ============================================================================
// GET TOKEN VALUE
// ============================================================================

/**
 * Gets a specific token value by path
 *
 * @param tokens - The resolved tokens object
 * @param path - Dot-notation path to the token (e.g., 'colors.brand.primary')
 * @returns The token value or undefined if not found
 *
 * @example
 * const tokens = resolveTokens('light');
 * const color = getTokenValue(tokens, 'colors.brand.primary');
 */
export function getTokenValue(
  tokens: ResolvedDesignTokens,
  path: TokenPath
): TokenValue | undefined {
  const parts = path.split('.');
  let current: unknown = tokens;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current as TokenValue;
}

// ============================================================================
// TOKEN HELPERS
// ============================================================================

/**
 * Creates a themed color getter
 *
 * @param theme - The theme mode
 * @returns A function to get colors by path
 *
 * @example
 * const getColor = createThemedColor('dark');
 * const primary = getColor('brand.primary');
 */
export function createThemedColor(theme: ThemeMode): (path: string) => string {
  const colors = createSemanticColors(theme);

  return function getColor(path: string): string {
    const parts = path.split('.');
    let current: unknown = colors;

    for (const part of parts) {
      if (current === null || current === undefined) {
        // eslint-disable-next-line no-console, no-restricted-globals
        console.warn(`Token path not found: colors.${path}`);
        return '#FF00FF'; // Magenta for debugging
      }
      current = (current as Record<string, unknown>)[part];
    }

    return current as string;
  };
}

/**
 * Creates a spacing value getter
 *
 * @returns A function to get spacing values
 *
 * @example
 * const getSpacing = createSpacingGetter();
 * const padding = getSpacing('lg'); // 16
 */
export function createSpacingGetter(): (
  key:
    | 'none'
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
) => number {
  type SpacingKey =
    | 'none'
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl';
  return function getSpacing(key: SpacingKey): number {
    return primitiveTokens.spacing[key] as number;
  };
}

/**
 * Creates a radius value getter
 *
 * @returns A function to get radius values
 *
 * @example
 * const getRadius = createRadiusGetter();
 * const borderRadius = getRadius('lg'); // 8
 */
export function createRadiusGetter() {
  return function getRadius(key: keyof typeof primitiveTokens.radius): number {
    return primitiveTokens.radius[key];
  };
}

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type { ResolvedDesignTokens as ResolvedTokens };

// ============================================================================
// PRE-RESOLVED TOKENS (for static usage)
// ============================================================================

/**
 * Pre-resolved light theme tokens
 * Use for static contexts where hooks aren't available
 */
export const lightTokens = resolveTokens('light');

/**
 * Pre-resolved dark theme tokens
 * Use for static contexts where hooks aren't available
 */
export const darkTokens = resolveTokens('dark');
