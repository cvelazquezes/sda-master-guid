/**
 * Design Tokens - Single Source of Truth
 * 
 * This module is the ONLY place where design values should be defined.
 * All visual decisions across the project MUST consume these tokens.
 * 
 * @module tokens
 * @version 2.0.0
 * 
 * ⚠️ STRONG COMPLIANCE RULE:
 * ❌ Do NOT hardcode colors, spacing, font sizes, breakpoints, timing, etc.
 * ✅ Do use design tokens for ALL UI-related values
 * 
 * Architecture:
 * - primitives.ts: Raw values (colors, numbers, etc.) - Theme agnostic
 * - semantic.ts: Semantic tokens that map to primitives - Theme aware
 * - components.ts: Component-specific tokens - Composed from semantic
 * - motion.ts: Animation and transition tokens
 * - layout.ts: Breakpoints, grid, density, responsive configurations
 * - behavior.ts: UI timing, interactions, validation configs
 * - types.ts: TypeScript definitions for all tokens
 */

// Primitive tokens (raw values)
export * from './primitives';

// Semantic tokens (theme-aware)
export * from './semantic';

// Component-specific tokens
export * from './components';

// Motion/Animation tokens
export * from './motion';

// Layout tokens (breakpoints, grid, density)
export * from './layout';

// Behavior tokens (timing, interactions, validation)
export * from './behavior';

// TypeScript definitions
export * from './types';

// Main token resolver
export { resolveTokens, getTokenValue, type ResolvedTokens } from './resolver';

// Re-export default resolved tokens for convenience
import { primitiveTokens } from './primitives';
import { createSemanticTokens } from './semantic';
import { createComponentTokens } from './components';
import { motionTokens } from './motion';
import { layoutTokens } from './layout';
import { behaviorTokens } from './behavior';

/**
 * Default design tokens (light theme)
 * For theme-aware tokens, use useDesignTokens() hook or resolveTokens()
 * 
 * This is the SINGLE SOURCE OF TRUTH for all UI decisions.
 */
export const designTokensV2 = {
  primitives: primitiveTokens,
  semantic: createSemanticTokens('light'),
  components: createComponentTokens('light'),
  motion: motionTokens,
  layout: layoutTokens,
  behavior: behaviorTokens,
} as const;

export default designTokensV2;

