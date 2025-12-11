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
// Re-export default resolved tokens for convenience
// Note: These imports are intentionally kept for potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { behaviorTokens as _behaviorTokens } from './behavior';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createComponentTokens as _createComponentTokens } from './components';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { layoutTokens as _layoutTokens } from './layout';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motionTokens as _motionTokens } from './motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { primitiveTokens as _primitiveTokens } from './primitives';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createSemanticTokens as _createSemanticTokens } from './semantic';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { THEME_MODE as _THEME_MODE } from '../../../shared/constants';

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

/**
 * Design Tokens - Single Source of Truth
 *
 * For theme-aware tokens, use useTheme() hook from ThemeContext.
 *
 * The primitiveTokens contain the raw values (spacing, colors, typography).
 * Use resolveTokens() for theme-specific values.
 */
