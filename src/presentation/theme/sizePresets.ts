/**
 * Size Presets
 *
 * Standardized size configurations for components.
 * Eliminates repetitive switch statements for sm/md/lg sizing.
 *
 * @example
 * const { getSizePreset, getIconSize, getFontSize } = useSizePresets();
 *
 * const size = getSizePreset('md');
 * // { paddingV: 'xs', paddingH: 'sm', fontSize: 14, iconSize: 16, gap: 'xs' }
 */

import { designTokens } from './designTokens';
import type { ComponentSize, SpacingKey } from '../../shared/types/theme';

// =============================================================================
// TYPES
// =============================================================================

export type SizePreset = {
  /** Vertical padding key */
  paddingV: SpacingKey;
  /** Horizontal padding key */
  paddingH: SpacingKey;
  /** Font size in pixels */
  fontSize: number;
  /** Icon size in pixels */
  iconSize: number;
  /** Gap between elements key */
  gap: SpacingKey;
  /** Line height in pixels */
  lineHeight: number;
  /** Min height for touch targets */
  minHeight: number;
};

export type BadgeSizePreset = {
  /** Vertical padding key */
  paddingV: SpacingKey;
  /** Horizontal padding key */
  paddingH: SpacingKey;
  /** Font size in pixels */
  fontSize: number;
  /** Icon size in pixels */
  iconSize: number;
  /** Line height in pixels */
  lineHeight: number;
};

export type StatusSizePreset = {
  /** Icon size in pixels */
  iconSize: number;
  /** Font size in pixels */
  fontSize: number;
  /** Gap between icon and label */
  gap: SpacingKey;
};

// =============================================================================
// SIZE PRESETS
// =============================================================================

/**
 * General component size presets
 * Use for buttons, inputs, cards, etc.
 */
export const SIZE_PRESETS: Record<ComponentSize, SizePreset> = {
  sm: {
    paddingV: 'xs',
    paddingH: 'sm',
    fontSize: designTokens.fontSize.xs,
    iconSize: designTokens.iconSize.xs,
    gap: 'xxs',
    lineHeight: designTokens.lineHeights.caption,
    minHeight: 36,
  },
  md: {
    paddingV: 'sm',
    paddingH: 'md',
    fontSize: designTokens.fontSize.sm,
    iconSize: designTokens.iconSize.sm,
    gap: 'xs',
    lineHeight: designTokens.lineHeights.body,
    minHeight: 44,
  },
  lg: {
    paddingV: 'md',
    paddingH: 'lg',
    fontSize: designTokens.fontSize.md,
    iconSize: designTokens.iconSize.md,
    gap: 'sm',
    lineHeight: designTokens.lineHeights.bodyLarge,
    minHeight: 52,
  },
} as const;

/**
 * Badge-specific size presets
 */
export const BADGE_SIZE_PRESETS: Record<ComponentSize, BadgeSizePreset> = {
  sm: {
    paddingV: 'xxs',
    paddingH: 'sm',
    fontSize: designTokens.fontSize['2xs'],
    iconSize: designTokens.iconSize.xs,
    lineHeight: designTokens.lineHeights.caption,
  },
  md: {
    paddingV: 'xs',
    paddingH: 'sm',
    fontSize: designTokens.fontSize.xs,
    iconSize: designTokens.iconSize.xs,
    lineHeight: designTokens.lineHeights.captionLarge,
  },
  lg: {
    paddingV: 'sm',
    paddingH: 'md',
    fontSize: designTokens.fontSize.xs,
    iconSize: designTokens.iconSize.sm,
    lineHeight: designTokens.lineHeights.body,
  },
} as const;

/**
 * Status indicator size presets
 */
export const STATUS_SIZE_PRESETS: Record<ComponentSize, StatusSizePreset> = {
  sm: {
    iconSize: designTokens.icon.sizes.xs,
    fontSize: designTokens.fontSize.xs,
    gap: 'xxs',
  },
  md: {
    iconSize: designTokens.icon.sizes.sm,
    fontSize: designTokens.fontSize.xs,
    gap: 'xs',
  },
  lg: {
    iconSize: designTokens.icon.sizes.md,
    fontSize: designTokens.fontSize.md,
    gap: 'sm',
  },
} as const;

/**
 * Button size presets (from designTokens for consistency)
 */
export const BUTTON_SIZE_PRESETS = {
  sm: designTokens.button.sizes.small,
  md: designTokens.button.sizes.medium,
  lg: designTokens.button.sizes.large,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get general size preset
 */
export const getSizePreset = (size: ComponentSize): SizePreset => SIZE_PRESETS[size];

/**
 * Get badge size preset
 */
export const getBadgeSizePreset = (size: ComponentSize): BadgeSizePreset =>
  BADGE_SIZE_PRESETS[size];

/**
 * Get status indicator size preset
 */
export const getStatusSizePreset = (size: ComponentSize): StatusSizePreset =>
  STATUS_SIZE_PRESETS[size];

/**
 * Get button size preset
 */
export const getButtonSizePreset = (
  size: ComponentSize
): (typeof BUTTON_SIZE_PRESETS)[ComponentSize] => BUTTON_SIZE_PRESETS[size];

/**
 * Get spacing value from key
 * Helper to resolve spacing key to pixel value
 */
export const getSpacing = (key: SpacingKey): number => designTokens.spacing[key];

/**
 * Get icon size for component size
 */
export const getIconSize = (size: ComponentSize): number => SIZE_PRESETS[size].iconSize;

/**
 * Get font size for component size
 */
export const getFontSize = (size: ComponentSize): number => SIZE_PRESETS[size].fontSize;

export default SIZE_PRESETS;
