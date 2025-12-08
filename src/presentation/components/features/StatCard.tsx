/**
 * StatCard Component
 * Displays statistics in a card format
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */

import React from 'react';
import { View, TouchableOpacity, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ICONS,
  TOUCH_OPACITY,
  FLEX,
  SHADOW_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
  TEXT_COLOR,
  HEX_OPACITY,
  SHADOW_OPACITY,
  ELEVATION,
} from '../../../shared/constants';
import { useTheme } from '../../state/ThemeContext';
import { Text } from '../primitives';

type StatCardProps = {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  onPress?: () => void;
  subtitle?: string;
};

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  onPress,
  subtitle,
}) => {
  const { colors, spacing, radii, iconSizes, shadows, componentSizes, typography, isDark } =
    useTheme();

  // Shadow configuration based on theme
  const shadowOpacity = isDark ? SHADOW_OPACITY.DARK : SHADOW_OPACITY.LIGHT;
  const shadowElevation = isDark ? ELEVATION.XL : ELEVATION.LG;

  const cardStyle: ViewStyle = {
    padding: spacing.lg,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    shadowColor: SHADOW_COLOR.DEFAULT,
    shadowOpacity,
    elevation: shadowElevation,
    shadowOffset: { width: 0, height: spacing.xxs + 1 },
    shadowRadius: shadows.lg.shadowRadius,
  };

  const iconContainerStyle: ViewStyle = {
    width: componentSizes.iconContainer['2xl'],
    height: componentSizes.iconContainer['2xl'],
    borderRadius: radii['5xl'],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${color}${HEX_OPACITY.SUBTLE}`,
  };

  const CardContent = (
    <View style={cardStyle}>
      <View style={iconContainerStyle}>
        <MaterialCommunityIcons
          name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={iconSizes.xl}
          color={color}
        />
      </View>
      <View style={{ flex: FLEX.ONE }}>
        <Text
          variant={TEXT_VARIANT.DISPLAY_SMALL}
          style={{ fontSize: typography.fontSizes['3xl'], marginBottom: spacing.xs }}
        >
          {value}
        </Text>
        <Text variant={TEXT_VARIANT.LABEL} weight={TEXT_WEIGHT.BOLD} color={TEXT_COLOR.SECONDARY}>
          {label}
        </Text>
        {subtitle && (
          <Text
            variant={TEXT_VARIANT.CAPTION}
            color={TEXT_COLOR.TERTIARY}
            style={{ marginTop: spacing.xs }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {onPress && (
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_RIGHT}
          size={iconSizes.lg}
          color={colors.textTertiary}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={TOUCH_OPACITY.default}
        style={{ flex: FLEX.ONE }}
        onPress={onPress}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={{ flex: FLEX.ONE }}>{CardContent}</View>;
};
