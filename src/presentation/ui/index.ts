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
 * import { Text, Card, Button, useTheme } from '@/ui';
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

  // Layout primitives - use instead of raw View
  Box,
  Pressable,
  Divider,

  // Core primitives
  Button,
  Input,
  Card,
  Badge,
  IconButton,
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
} from '../components/primitives';

// Export types
export type {
  // Text types
  TextProps,
  TextVariant,
  TextColor,
  TextWeight,
  TextAlign,
  // Box types
  BoxProps,
  BackgroundColor,
  BorderColor,
  SpacingKey as BoxSpacingKey,
  RadiusKey,
  // Pressable types
  PressableProps,
  InteractiveBackgroundColor,
  PressableBorderColor,
  // Divider types
  DividerProps,
  DividerColor,
  // Status/Role types
  StatusType,
  RoleType,
  ComponentSize,
  ShadowPreset,
  // Other component types
  SelectionItem,
  FilterOption,
  FilterSection,
  Tab,
  OptimizedListProps,
} from '../components/primitives';

// =============================================================================
// DESIGN TOKENS
// All visual decisions come from these tokens
// =============================================================================
export {
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
} from '../theme/tokens';

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
} from '../theme/tokens/types';

// =============================================================================
// THEME
// Theme context and hooks
// =============================================================================
export { useTheme, ThemeProvider } from '../state/ThemeContext';
export type { ThemeContextType } from '../state/ThemeContext';
export { lightTheme, darkTheme, getTheme } from '../theme';
export type { Theme, ThemeMode as ThemeModeType } from '../theme';
