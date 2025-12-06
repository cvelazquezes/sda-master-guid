/**
 * StatusIndicator Primitive Component
 *
 * Reusable component for displaying status with icon and label.
 * Uses theme-aware status colors that automatically switch for light/dark mode.
 *
 * @example
 * <StatusIndicator status="active" />
 * <StatusIndicator status="pending" label={t('status.pending')} />
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileFontSizes } from '../theme/mobileTypography';
import { designTokens } from '../theme/designTokens';
import { layoutConstants } from '../theme';
import { TEXT_LINES, COMPONENT_SIZE, A11Y_ROLE, ICONS } from '../constants';
import { Text } from './Text';

// Status types match the keys in statusColors
type StatusType =
  | 'active'
  | 'inactive'
  | 'paused'
  | 'pending'
  | 'completed'
  | 'scheduled'
  | 'skipped'
  | 'cancelled';

type StatusSize = typeof COMPONENT_SIZE.sm | typeof COMPONENT_SIZE.md | typeof COMPONENT_SIZE.lg;

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: StatusSize;
  style?: ViewStyle;
  testID?: string;
  /** Accessibility label (pass translated string from screen) */
  accessibilityLabel?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showIcon = true,
  showLabel = true,
  size = COMPONENT_SIZE.md,
  style,
  testID,
  accessibilityLabel,
}) => {
  // Get theme-aware status colors from context
  const { statusColors } = useTheme();
  const statusConfig = statusColors[status];

  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  const getSizeStyles = (): { iconSize: number; fontSize: number; gap: number } => {
    switch (size) {
      case COMPONENT_SIZE.sm:
        return {
          iconSize: designTokens.icon.sizes.xs,
          fontSize: mobileFontSizes.xs,
          gap: designTokens.spacing.xxs,
        };
      case COMPONENT_SIZE.lg:
        return {
          iconSize: designTokens.icon.sizes.md,
          fontSize: mobileFontSizes.md,
          gap: designTokens.spacing.sm,
        };
      default:
        return {
          iconSize: designTokens.icon.sizes.sm,
          fontSize: mobileFontSizes.xs,
          gap: designTokens.spacing.xs,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[styles.container, { gap: sizeStyles.gap }, style]}
      testID={testID}
      accessible
      accessibilityRole={A11Y_ROLE.TEXT}
      accessibilityLabel={accessibilityLabel || displayLabel}
    >
      {showIcon && (
        <MaterialCommunityIcons
          name={statusConfig.icon as typeof ICONS.CHECK}
          size={sizeStyles.iconSize}
          color={statusConfig.primary}
        />
      )}
      {showLabel && (
        <Text
          variant="label"
          weight="bold"
          numberOfLines={TEXT_LINES.single}
          style={{ color: statusConfig.text, fontSize: sizeStyles.fontSize }}
        >
          {displayLabel}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    alignSelf: layoutConstants.alignSelf.flexStart,
  },
});

export default StatusIndicator;
