/**
 * StatusIndicator Component
 * Reusable component for displaying status with icon and label
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { statusColors } from '../theme/sdaColors';
import { mobileTypography, mobileFontSizes } from '../theme/mobileTypography';
import { designTokens } from '../theme/designTokens';

type StatusType = keyof typeof statusColors;
type StatusSize = 'sm' | 'md' | 'lg';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: StatusSize;
  style?: ViewStyle;
  testID?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showIcon = true,
  showLabel = true,
  size = 'md',
  style,
  testID,
}) => {
  const statusConfig = statusColors[status];
  
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          iconSize: designTokens.icon.sizes.xs,
          fontSize: mobileFontSizes.xs,
          gap: 3,
        };
      case 'lg':
        return {
          iconSize: designTokens.icon.sizes.md,
          fontSize: mobileFontSizes.md,
          gap: 6,
        };
      default:
        return {
          iconSize: designTokens.icon.sizes.sm,
          fontSize: mobileFontSizes.xs,
          gap: 4,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        { gap: sizeStyles.gap },
        style,
      ]}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${displayLabel}`}
    >
      {showIcon && (
        <MaterialCommunityIcons
          name={statusConfig.icon as any}
          size={sizeStyles.iconSize}
          color={statusConfig.primary}
        />
      )}
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color: statusConfig.text,
              fontSize: sizeStyles.fontSize,
            },
          ]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  label: {
    ...mobileTypography.labelBold,
  },
});

export default StatusIndicator;

