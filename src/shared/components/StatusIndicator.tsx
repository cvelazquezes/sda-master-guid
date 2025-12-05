/**
 * StatusIndicator Component
 * Reusable component for displaying status with icon and label
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { statusColors } from '../theme/sdaColors';
import { mobileTypography, mobileFontSizes } from '../theme/mobileTypography';
import { designTokens } from '../theme/designTokens';
import { layoutConstants } from '../theme';
import { TEXT_LINES, COMPONENT_SIZE, A11Y_ROLE } from '../constants';

type StatusType = keyof typeof statusColors;
type StatusSize = typeof COMPONENT_SIZE.sm | typeof COMPONENT_SIZE.md | typeof COMPONENT_SIZE.lg;

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
  size = COMPONENT_SIZE.md,
  style,
  testID,
}) => {
  const { t } = useTranslation();
  const statusConfig = statusColors[status];
  
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  const getSizeStyles = () => {
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
      style={[
        styles.container,
        { gap: sizeStyles.gap },
        style,
      ]}
      testID={testID}
      accessible={true}
      accessibilityRole={A11Y_ROLE.TEXT}
      accessibilityLabel={t('accessibility.status', { status: displayLabel })}
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
          numberOfLines={TEXT_LINES.single}
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
  label: {
    ...mobileTypography.labelBold,
  },
});

export default StatusIndicator;

