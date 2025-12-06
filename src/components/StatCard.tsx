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
import { ICONS, TOUCH_OPACITY, flexValues } from '../shared/constants';

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
          shadowColor: colors.shadow || '#000000',
          shadowOpacity: shadowConfig.opacity,
          elevation: shadowConfig.elevation,
        },
        onPress && styles.cardTouchable,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons
          name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={mobileIconSizes.xlarge}
          color={color}
        />
      </View>
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.value}>
          {value}
        </Text>
        <Text variant="label" weight="bold" color="secondary">
          {label}
        </Text>
        {subtitle && (
          <Text variant="caption" color="tertiary" style={styles.subtitle}>
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
    flex: flexValues.one,
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
    flex: flexValues.one,
  },
  value: {
    fontSize: mobileFontSizes['3xl'],
    marginBottom: designTokens.spacing.xs,
  },
  subtitle: {
    marginTop: designTokens.spacing.xs,
  },
});
