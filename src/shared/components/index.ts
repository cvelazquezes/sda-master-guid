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

// Button primitive
export { StandardButton as Button } from './StandardButton';

// Input primitive
export { StandardInput as Input } from './StandardInput';

// Card primitive
export { Card } from './Card';

// Badge primitive
export { Badge } from './Badge';

// Icon button primitive
export { IconButton } from './IconButton';

// Divider primitive
export { Divider } from './Divider';

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
// LEGACY EXPORTS (for backwards compatibility - prefer new names)
// =============================================================================

export { StandardButton } from './StandardButton';
export { StandardInput } from './StandardInput';
export { StandardModal } from './StandardModal';
export { StandardPicker } from './StandardPicker';
