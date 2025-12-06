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

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { layoutConstants, getStatusSizePreset, getSpacing } from '../theme';
import { TEXT_LINES, COMPONENT_SIZE, A11Y_ROLE, ICONS } from '../constants';
import { Text } from './Text';
import { StatusType, ComponentSize } from '../types/theme';

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

  // Use size preset (replaces inline switch statement)
  const sizePreset = useMemo(() => getStatusSizePreset(size as ComponentSize), [size]);

  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <View
      style={[styles.container, { gap: getSpacing(sizePreset.gap) }, style]}
      testID={testID}
      accessible
      accessibilityRole={A11Y_ROLE.TEXT}
      accessibilityLabel={accessibilityLabel || displayLabel}
    >
      {showIcon && (
        <MaterialCommunityIcons
          name={statusConfig.icon as typeof ICONS.CHECK}
          size={sizePreset.iconSize}
          color={statusConfig.primary}
        />
      )}
      {showLabel && (
        <Text
          variant="label"
          weight="bold"
          numberOfLines={TEXT_LINES.single}
          style={{ color: statusConfig.text, fontSize: sizePreset.fontSize }}
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
