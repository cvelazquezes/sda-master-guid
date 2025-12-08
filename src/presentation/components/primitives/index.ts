/**
 * Shared Components Index (@yourorg/ui)
 *
 * This is the SINGLE entry point for all UI primitives.
 * Product features should ONLY import from this file.
 *
 * ❌ import { Text, View } from 'react-native';
 * ✅ import { Text, Card, Button } from '@shared/components';
 *
 * Rules:
 * 1. Primitives are generic - no business meaning
 * 2. Primitives read tokens - never define magic values
 * 3. Primitives never fetch data or contain business logic
 */

// =============================================================================
// PRIMITIVES - Generic building blocks (no business meaning)
// =============================================================================

// Text primitive - ALL text must go through this
export { Text, Heading, Body, Label, Caption } from './Text';
export type { TextProps, TextVariant, TextColor, TextWeight, TextAlign } from './Text';

// Box primitive - themed View wrapper for backgrounds
export { Box } from './Box';
export type { BoxProps } from './Box';

// Pressable primitive - themed TouchableOpacity with press states
export { Pressable } from './Pressable';
export type { PressableProps } from './Pressable';

// Re-export theme types from unified types file
export type {
  BackgroundColor,
  BorderColor,
  SpacingKey,
  RadiusKey,
  InteractiveBackgroundColor,
  PressableBorderColor,
  DividerColor,
  StatusType,
  RoleType,
  ComponentSize,
  ShadowPreset,
} from '../../../shared/types/theme';

// Button primitive
export { StandardButton as Button } from './StandardButton';

// Input primitive
export { StandardInput as Input } from './StandardInput';

// Card primitive
export { Card } from './Card';

// EntityCard - Generic card for entity displays (ClubCard, UserCard, etc.)
export { EntityCard } from './EntityCard';
export type { EntityCardProps, EntityCardRenderProps, EntityCardActionProps } from './EntityCard';

// Badge primitive
export { Badge } from './Badge';

// Icon button primitive
export { IconButton } from './IconButton';

// Divider primitive - themed divider
export { Divider } from './Divider';
export type { DividerProps } from './Divider';

// Status indicator primitive
export { StatusIndicator } from './StatusIndicator';

// Empty state primitive
export { EmptyState } from './EmptyState';

// =============================================================================
// FILTER COMPONENTS - Reusable filter patterns
// =============================================================================

// Hierarchy filter item (for org hierarchy filtering)
export { HierarchyFilterItem } from './HierarchyFilterItem';

// Status filter section (All/Active/Inactive)
export { StatusFilterSection } from './StatusFilterSection';

// =============================================================================
// COMPOSED COMPONENTS - Built from primitives
// =============================================================================

// Modal (composed from primitives)
export { StandardModal as Modal } from './StandardModal';

// Picker (composed from primitives)
export { StandardPicker as Picker } from './StandardPicker';

// Selection modal (composed)
export { SelectionModal } from './SelectionModal';
export type { SelectionItem } from './SelectionModal';

// Filter modal (composed)
export { FilterModal } from './FilterModal';
export type { FilterOption, FilterSection } from './FilterModal';

// =============================================================================
// LAYOUT COMPONENTS - Screen structure
// =============================================================================

export { MenuCard } from './MenuCard';
export { PageHeader } from './PageHeader';
export { ScreenHeader } from './ScreenHeader';
export { SearchBar } from './SearchBar';
export { SectionHeader } from './SectionHeader';
export { TabBar } from './TabBar';
export type { Tab } from './TabBar';

// =============================================================================
// PERFORMANCE COMPONENTS
// =============================================================================

export { lazyScreen, preloadScreen } from './LazyScreen';
export { OptimizedList } from './OptimizedList';
export type { OptimizedListProps } from './OptimizedList';

// =============================================================================
// INTERNAL EXPORTS (for use within primitives only)
// External code should use the aliased names: Button, Input, Modal, Picker
// =============================================================================

export { StandardButton } from './StandardButton';
export { StandardInput } from './StandardInput';
export { StandardModal } from './StandardModal';
export { StandardPicker } from './StandardPicker';
