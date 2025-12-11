/**
 * EntityCard - Generic Card Component
 *
 * A reusable card component that abstracts the common pattern used by
 * ClubCard, UserCard, and similar entity display cards.
 *
 * Provides:
 * - Unified card styling with theme-aware shadows
 * - Consistent inactive state handling
 * - TouchableOpacity wrapper when onPress is provided
 * - Accessibility props via render pattern
 * - Memoization support
 *
 * @example
 * <EntityCard
 *   entity={club}
 *   isActive={club.isActive}
 *   onPress={handlePress}
 *   renderIcon={({ isActive, colors }) => <ClubIcon isActive={isActive} ... />}
 *   renderInfo={({ entity, colors }) => <ClubInfo club={entity} ... />}
 *   renderActions={({ entity, onPress }) => <ClubActions club={entity} ... />}
 *   accessibilityLabel="View club details"
 * />
 */

import React, { memo, useMemo, type ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { A11Y_ROLE, TOUCH_OPACITY } from '../../../shared/constants';
import { useShadowStyle } from '../../hooks/useShadowStyle';
import { useTheme } from '../../state/ThemeContext';
import { designTokens } from '../../theme/designTokens';
import type { ShadowPreset, ThemeColors } from '../../../shared/types/theme';

// =============================================================================
// TYPES
// =============================================================================

export type EntityCardRenderProps<T> = {
  /** The entity being displayed */
  entity: T;
  /** Whether the entity is active */
  isActive: boolean;
  /** Theme colors */
  colors: ThemeColors;
  /** Whether dark mode is active */
  isDark: boolean;
};

export type EntityCardActionProps<T> = {
  /** The entity being displayed */
  entity: T;
  /** Press handler (if provided) */
  onPress?: () => void;
};

export type EntityCardProps<T> = {
  /** The entity data to display */
  entity: T;
  /** Whether the entity is in active state */
  isActive: boolean;
  /** Press handler - wraps card in TouchableOpacity when provided */
  onPress?: () => void;
  /** Shadow preset to use */
  shadowPreset?: ShadowPreset;

  // Render props for composition
  /** Render the icon/avatar section */
  renderIcon: (props: EntityCardRenderProps<T>) => ReactNode;
  /** Render the main info section */
  renderInfo: (props: EntityCardRenderProps<T>) => ReactNode;
  /** Render optional actions section */
  renderActions?: (props: EntityCardActionProps<T>) => ReactNode;

  // Accessibility
  /** Accessibility label for the card */
  accessibilityLabel: string;
  /** Accessibility hint for the card */
  accessibilityHint?: string;

  // Styling
  /** Additional card container styles */
  style?: StyleProp<ViewStyle>;
  /** Additional content styles */
  contentStyle?: StyleProp<ViewStyle>;
  /** Test ID for the card */
  testID?: string;
};

// =============================================================================
// CONSTANTS
// =============================================================================

const INACTIVE_OPACITY = 0.7;

// =============================================================================
// COMPONENT
// =============================================================================

function EntityCardInner<T>(props: EntityCardProps<T>): React.ReactElement {
  const {
    entity,
    isActive,
    onPress,
    shadowPreset = 'card',
    renderIcon,
    renderInfo,
    renderActions,
    accessibilityLabel,
    accessibilityHint,
    style,
    contentStyle,
    testID,
  } = props;

  const { colors, isDark } = useTheme();
  const { getShadow } = useShadowStyle();

  // Get shadow style based on preset
  const shadowStyle = useMemo(() => getShadow(shadowPreset), [getShadow, shadowPreset]);

  // Card container style
  const cardStyle = useMemo<ViewStyle[]>(
    () =>
      [
        styles.card,
        shadowStyle,
        {
          backgroundColor: isActive ? colors.surface : colors.surfaceLight,
        },
        !isActive && styles.inactiveCard,
        StyleSheet.flatten(style) as ViewStyle,
      ].filter(Boolean) as ViewStyle[],
    [shadowStyle, colors.surface, colors.surfaceLight, isActive, style]
  );

  // Render props for children
  const renderProps: EntityCardRenderProps<T> = useMemo(
    () => ({
      entity,
      isActive,
      colors: colors as unknown as ThemeColors,
      isDark,
    }),
    [entity, isActive, colors, isDark]
  );

  const actionProps: EntityCardActionProps<T> = useMemo(
    () => ({
      entity,
      onPress,
    }),
    [entity, onPress]
  );

  // Card content
  const CardContent = (
    <View style={cardStyle} testID={testID}>
      <View style={[styles.content, contentStyle]}>
        {renderIcon(renderProps)}
        {renderInfo(renderProps)}
        {renderActions?.(actionProps)}
      </View>
    </View>
  );

  // Wrap in TouchableOpacity if onPress provided
  if (onPress) {
    return (
      <TouchableOpacity
        accessible
        activeOpacity={TOUCH_OPACITY.default}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !isActive }}
        onPress={onPress}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View accessible accessibilityLabel={accessibilityLabel}>
      {CardContent}
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.card.borderRadius,
    padding: designTokens.card.padding,
    marginBottom: designTokens.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  inactiveCard: {
    opacity: INACTIVE_OPACITY,
  },
});

// =============================================================================
// EXPORT
// =============================================================================

/**
 * Generic EntityCard component
 * Use this as a base for entity display cards like ClubCard, UserCard, etc.
 */
export const EntityCard = memo(EntityCardInner) as typeof EntityCardInner;

export default EntityCard;
