/**
 * Shared Constants - Central Export Hub
 *
 * ============================================================================
 * CONSTANTS STRUCTURE (v2.0.0)
 * ============================================================================
 *
 * app.ts          → App metadata, version
 * validation.ts   → All validation & business rules (consolidated)
 * timing.ts       → All timing values (debounce, animation, timeout, cache)
 * ui.ts           → UI behavior (animation types, a11y, input, status)
 * components.ts   → Component config (sizes, variants, names)
 * layout.ts       → Layout values (flex, dimensions, breakpoints)
 * icons.ts        → Icon names
 * navigation.ts   → Screen/tab names, menu IDs (consolidated)
 * messages.ts     → User-facing messages
 * logMessages.ts  → Developer log messages
 * formats.ts      → Date/number/currency formats
 *
 * @version 2.0.0
 */

// =============================================================================
// CORE EXPORTS
// =============================================================================

// App metadata
export * from './app';

// HTTP and numeric constants
export * from './http';

// Validation & Business Rules (consolidated)
export * from './validation';

// Timing (all timing values)
export * from './timing';

// UI Behavior
export * from './ui';

// Component Configuration
export * from './components';

// Layout Values
export * from './layout';

// Icons
export * from './icons';

// Navigation (includes menu item IDs)
export * from './navigation';

// User-facing Messages
export * from './messages';

// Developer Log Messages
export * from './logMessages';

// Formats (date, number, currency)
export * from './formats';

// Numeric constants (NO MAGIC NUMBERS)
export * from './numbers';
