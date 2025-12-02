/**
 * EmptyState Component
 * Reusable empty state component for lists and screens
 * Supports dynamic theming (light/dark mode)
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileTypography } from '../theme/mobileTypography';
import { designTokens } from '../theme/designTokens';
import { StandardButton } from './StandardButton';

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
  icon = 'inbox-outline',
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
      accessible={true}
      accessibilityLabel={`${title}${displayDescription ? `. ${displayDescription}` : ''}`}
      accessibilityRole="text"
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon as any}
          size={designTokens.icon.sizes['4xl']}
          color={finalIconColor}
        />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>

      {/* Description */}
      {displayDescription && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
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
            variant="primary"
            size="medium"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.xxl,
    borderRadius: designTokens.borderRadius.lg,
  },
  iconContainer: {
    marginBottom: designTokens.spacing.lg,
    opacity: 0.6,
  },
  title: {
    ...mobileTypography.heading3,
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  description: {
    ...mobileTypography.bodySmall,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: designTokens.spacing.lg,
  },
  actionContainer: {
    marginTop: designTokens.spacing.md,
  },
});

export default EmptyState;

