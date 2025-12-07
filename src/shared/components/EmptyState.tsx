/**
 * EmptyState Primitive Component
 *
 * Reusable empty state component for lists and screens.
 * Uses Text primitive for proper theme integration.
 *
 * @example
 * <EmptyState
 *   icon="inbox-outline"
 *   title={t('emptyState.noData')}
 *   description={t('emptyState.noDataDescription')}
 * />
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { layoutConstants } from '../theme';
import { StandardButton } from './StandardButton';
import {
  A11Y_ROLE,
  BUTTON_SIZE,
  COMPONENT_VARIANT,
  EMPTY_VALUE,
  ICONS,
  DIMENSIONS,
  FLEX,
  TEXT_VARIANT,
  TEXT_ALIGN,
  TEXT_COLOR,
} from '../constants';
import { Text } from './Text';

export interface EmptyStateProps {
  // Content
  icon?: string;
  title: string;
  description?: string;

  // Action
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;

  // Custom content
  children?: ReactNode;

  // Styling
  iconColor?: string;
  style?: ViewStyle;
  testID?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = ICONS.INBOX_OUTLINE,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  children,
  iconColor,
  style,
  testID,
}) => {
  const { colors } = useTheme();
  const finalIconColor = iconColor || colors.textTertiary;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }, style]}
      testID={testID}
      accessible
      accessibilityLabel={`${title}${description ? `. ${description}` : EMPTY_VALUE}`}
      accessibilityRole={A11Y_ROLE.TEXT}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.CHECK}
          size={designTokens.icon.sizes['4xl']}
          color={finalIconColor}
        />
      </View>

      {/* Title */}
      <Text variant={TEXT_VARIANT.H3} align={TEXT_ALIGN.CENTER} style={styles.title}>
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          variant={TEXT_VARIANT.BODY_SMALL}
          color={TEXT_COLOR.SECONDARY}
          align={TEXT_ALIGN.CENTER}
          style={styles.description}
        >
          {description}
        </Text>
      )}

      {/* Custom children */}
      {children}

      {/* Action button */}
      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <StandardButton
            title={actionLabel}
            onPress={onAction}
            icon={actionIcon}
            variant={COMPONENT_VARIANT.primary}
            size={BUTTON_SIZE.medium}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.ONE,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xxl,
    borderRadius: designTokens.borderRadius.lg,
  },
  iconContainer: {
    marginBottom: designTokens.spacing.lg,
    opacity: designTokens.opacity.high,
  },
  title: {
    marginBottom: designTokens.spacing.sm,
  },
  description: {
    maxWidth: DIMENSIONS.MAX_WIDTH.MESSAGE,
    marginBottom: designTokens.spacing.lg,
  },
  actionContainer: {
    marginTop: designTokens.spacing.md,
  },
});

export default EmptyState;
