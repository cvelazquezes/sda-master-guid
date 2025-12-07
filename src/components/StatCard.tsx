/**
 * StatCard Component
 * Displays statistics in a card format
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../shared/components';
import { useTheme } from '../contexts/ThemeContext';
import { mobileIconSizes, mobileFontSizes, layoutConstants } from '../shared/theme';
import { designTokens } from '../shared/theme/designTokens';
import {
  ICONS,
  TOUCH_OPACITY,
  FLEX,
  SHADOW_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
  TEXT_COLOR,
  HEX_OPACITY,
} from '../shared/constants';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  onPress?: () => void;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  onPress,
  subtitle,
}) => {
  const { colors, isDark } = useTheme();

  const shadowConfig = isDark ? designTokens.shadowConfig.dark : designTokens.shadowConfig.light;

  const CardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow || SHADOW_COLOR.DEFAULT,
          shadowOpacity: shadowConfig.opacity,
          elevation: shadowConfig.elevation,
        },
        onPress && styles.cardTouchable,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}${HEX_OPACITY.SUBTLE}` }]}>
        <MaterialCommunityIcons
          name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={mobileIconSizes.xlarge}
          color={color}
        />
      </View>
      <View style={styles.content}>
        <Text variant={TEXT_VARIANT.DISPLAY_SMALL} style={styles.value}>
          {value}
        </Text>
        <Text variant={TEXT_VARIANT.LABEL} weight={TEXT_WEIGHT.BOLD} color={TEXT_COLOR.SECONDARY}>
          {label}
        </Text>
        {subtitle && (
          <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.TERTIARY} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      {onPress && (
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_RIGHT}
          size={mobileIconSizes.large}
          color={colors.textTertiary}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={TOUCH_OPACITY.default}
        style={styles.touchable}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.touchable}>{CardContent}</View>;
};

const styles = StyleSheet.create({
  touchable: {
    flex: FLEX.ONE,
  },
  card: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
    // Shadow properties are applied via inline styles for theme-awareness
    shadowOffset: { width: 0, height: designTokens.spacing.xxs + 1 },
    shadowRadius: designTokens.shadows.lg.shadowRadius,
  },
  cardTouchable: {
    // Add visual hint for touchable cards
  },
  iconContainer: {
    width: designTokens.componentSizes.iconContainer['2xl'],
    height: designTokens.componentSizes.iconContainer['2xl'],
    borderRadius: designTokens.borderRadius['5xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  content: {
    flex: FLEX.ONE,
  },
  value: {
    fontSize: mobileFontSizes['3xl'],
    marginBottom: designTokens.spacing.xs,
  },
  subtitle: {
    marginTop: designTokens.spacing.xs,
  },
});
