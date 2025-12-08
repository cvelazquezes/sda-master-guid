/**
 * Unified Theme Types
 *
 * Single source of truth for all theme-related types used across components.
 * This eliminates type duplication across Box, Pressable, Divider, Badge, etc.
 *
 * @example
 * import { BackgroundColor, BorderColor, StatusType } from '@shared/types/theme';
 */

import { designTokens } from '../../presentation/theme/designTokens';

// =============================================================================
// SPACING & SIZE TYPES (derived from designTokens)
// =============================================================================

/**
 * Valid spacing keys from design tokens
 * Used for padding, margin, gap
 */
export type SpacingKey = keyof typeof designTokens.spacing;

/**
 * Valid border radius keys from design tokens
 */
export type RadiusKey = keyof typeof designTokens.borderRadius;

/**
 * Valid border width keys from design tokens
 */
export type BorderWidthKey = keyof typeof designTokens.borderWidth;

/**
 * Component size variants
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Extended component size with extra small
 */
export type ExtendedComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// =============================================================================
// BACKGROUND COLOR TYPES
// =============================================================================

/**
 * Static background colors (no interaction states)
 * Used by Box and non-interactive containers
 */
export type BackgroundColor =
  // Base backgrounds
  | 'background'
  | 'backgroundPrimary'
  | 'backgroundSecondary'
  | 'backgroundTertiary'
  | 'backgroundElevated'
  // Surface colors
  | 'surface'
  | 'surfaceLight'
  | 'surfaceDark'
  // Brand colors
  | 'primary'
  | 'primaryLight'
  | 'secondary'
  | 'secondaryLight'
  | 'accent'
  | 'accentLight'
  // Semantic colors
  | 'success'
  | 'successLight'
  | 'warning'
  | 'warningLight'
  | 'error'
  | 'errorLight'
  | 'info'
  | 'infoLight'
  // Special values
  | 'transparent'
  | 'none';

/**
 * Interactive background colors (includes hover/press states)
 * Used by Pressable and interactive components
 */
export type InteractiveBackgroundColor =
  | BackgroundColor
  // Surface interaction states
  | 'surfaceHovered'
  | 'surfacePressed'
  // Primary interaction states
  | 'primaryHover'
  | 'primaryActive'
  | 'primaryAlpha10'
  | 'primaryAlpha20'
  // Secondary interaction states
  | 'secondaryHover'
  // Accent interaction states
  | 'accentHover';

// =============================================================================
// BORDER COLOR TYPES
// =============================================================================

/**
 * Base border colors for containers
 */
export type BorderColor =
  // Border scale
  | 'border'
  | 'borderLight'
  | 'borderMedium'
  | 'borderDark'
  // Semantic borders
  | 'borderFocus'
  | 'borderError'
  | 'borderSuccess'
  // Brand borders (reuse brand colors)
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  // Special
  | 'transparent';

/**
 * Simplified border colors for pressable components
 */
export type PressableBorderColor =
  | 'border'
  | 'borderLight'
  | 'borderMedium'
  | 'borderFocus'
  | 'primary'
  | 'secondary'
  | 'transparent';

/**
 * Divider-specific colors
 */
export type DividerColor =
  | 'border'
  | 'borderLight'
  | 'borderMedium'
  | 'borderDark'
  | 'divider'
  | 'surface'
  | 'surfaceLight';

// =============================================================================
// STATUS & ROLE TYPES
// =============================================================================

/**
 * Status types matching statusColors from ThemeContext
 * Used by StatusIndicator, Badge, and entity status displays
 */
export type StatusType =
  | 'active'
  | 'inactive'
  | 'paused'
  | 'pending'
  | 'completed'
  | 'scheduled'
  | 'skipped'
  | 'cancelled';

/**
 * Role types matching roleColors from ThemeContext
 * Used by Badge and user role displays
 */
export type RoleType = 'admin' | 'club_admin' | 'user';

/**
 * Organization hierarchy types
 */
export type HierarchyType = 'division' | 'union' | 'association' | 'church' | 'club';

// =============================================================================
// COLOR CONFIG INTERFACES
// =============================================================================

/**
 * Status color configuration
 * Each status has multiple color variants for different contexts
 */
export interface StatusColorConfig {
  primary: string;
  light: string;
  medium: string;
  text: string;
  icon: string;
}

/**
 * Role color configuration
 * Each role has multiple color variants for different contexts
 */
export interface RoleColorConfig {
  primary: string;
  light: string;
  medium: string;
  text: string;
  icon: string;
}

/**
 * Theme colors object type (for useTheme().colors)
 */
export interface ThemeColors {
  [key: string]: string;
}

// =============================================================================
// COMPONENT VARIANT TYPES
// =============================================================================

/**
 * Component visual variants
 */
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

/**
 * Button-specific variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';

// =============================================================================
// SHADOW TYPES
// =============================================================================

/**
 * Shadow preset names for useShadowStyle hook
 */
export type ShadowPreset = 'none' | 'subtle' | 'card' | 'elevated' | 'modal';

// =============================================================================
// ACCESSIBILITY TYPES
// =============================================================================

/**
 * Common accessibility roles for interactive components
 */
export type AccessibilityRole =
  | 'button'
  | 'link'
  | 'menuitem'
  | 'tab'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'text'
  | 'image'
  | 'none';

/**
 * Accessibility state for components
 */
export interface AccessibilityState {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
}

// =============================================================================
// RE-EXPORTS FOR CONVENIENCE
// =============================================================================

export type { TextStyle, ViewStyle, StyleProp } from 'react-native';
