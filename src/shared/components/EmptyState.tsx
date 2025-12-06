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
  COMPONENT_SIZE,
  COMPONENT_VARIANT,
  ICONS,
  dimensionValues,
  flexValues,
} from '../constants';
import { Text } from './Text';

export interface EmptyStateProps {
  // Content
  icon?: string;
  title: string;
  description?: string;
  /** @deprecated Use description instead */
  message?: string;

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
  message,
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
  // Support both description and message props
  const displayDescription = description || message;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }, style]}
      testID={testID}
      accessible
      accessibilityLabel={`${title}${displayDescription ? `. ${displayDescription}` : ''}`}
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
      <Text variant="h3" align="center" style={styles.title}>
        {title}
      </Text>

      {/* Description */}
      {displayDescription && (
        <Text variant="bodySmall" color="secondary" align="center" style={styles.description}>
          {displayDescription}
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
            size={COMPONENT_SIZE.md}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
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
    maxWidth: dimensionValues.maxWidth.message,
    marginBottom: designTokens.spacing.lg,
  },
  actionContainer: {
    marginTop: designTokens.spacing.md,
  },
});

export default EmptyState;
