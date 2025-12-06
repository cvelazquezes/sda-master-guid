/**
 * @yourorg/ui - Internal UI Library
 *
 * This is the PUBLIC API for all UI primitives and design tokens.
 * Product features (screens, feature components) should ONLY import from here.
 *
 * RULES:
 * 1. Every color, spacing, radius, font size comes from tokens
 * 2. Primitives are generic (no business meaning)
 * 3. Features should NEVER import raw React Native Text/View/TextInput
 *
 * @example
 * // ❌ BAD - Don't do this in feature code
 * import { Text, View } from 'react-native';
 *
 * // ✅ GOOD - Import from ui
 * import { Text, Card, Button, useDesignTokens } from '@/ui';
 */

// =============================================================================
// PRIMITIVES
// Export all primitive components from shared/components
// =============================================================================
export {
  // Text - ALL text must use this
  Text,
  Heading,
  Body,
  Label,
  Caption,

  // Core primitives
  Button,
  Input,
  Card,
  Badge,
  IconButton,
  Divider,
  StatusIndicator,
  EmptyState,

  // Composed components
  Modal,
  Picker,
  SelectionModal,
  FilterModal,

  // Layout components
  MenuCard,
  ScreenHeader,
  SearchBar,
  SectionHeader,
  TabBar,

  // Performance components
  OptimizedList,
  lazyScreen,
  preloadScreen,
} from '../shared/components';

// Export types
export type {
  TextProps,
  TextVariant,
  TextColor,
  TextWeight,
  TextAlign,
  SelectionItem,
  FilterOption,
  FilterSection,
  Tab,
  OptimizedListProps,
} from '../shared/components';

// =============================================================================
// DESIGN TOKENS
// All visual decisions come from these tokens
// =============================================================================
export {
  // V2 Token System (Recommended)
  designTokensV2,

  // Token creators for theming
  createSemanticTokens,
  createComponentTokens,

  // Individual token modules
  primitiveTokens,
  motionTokens,
  layoutTokens,
  behaviorTokens,

  // Token resolver for theme-aware values
  resolveTokens,
  getTokenValue,
} from '../shared/theme/tokens';

export type {
  // Token types
  ThemeMode,
  SemanticTokens,
  ComponentTokens,
  ResolvedTokens,

  // Component variant types
  ButtonVariant,
  ButtonSize,
  CardVariant,
  BadgeVariant,
  BadgeSize,

  // Color types
  TextColorKey,
  BackgroundColorKey,
  BorderColorKey,

  // Typography types
  TypographyStyle,
  FontSizeKey,
  FontWeightKey,

  // Other types
  SpacingKey,
  ShadowKey,
  Status,
  UserRole,
} from '../shared/theme/tokens/types';

// =============================================================================
// THEME
// Theme context and hooks
// =============================================================================
export { useTheme, ThemeProvider } from '../contexts/ThemeContext';
export { lightTheme, darkTheme, getTheme } from '../shared/theme';
export type { Theme, ThemeMode as ThemeModeType } from '../shared/theme';

// =============================================================================
// HOOKS
// Utility hooks for UI
// =============================================================================
export { useDesignTokens } from '../shared/hooks/useDesignTokens';
