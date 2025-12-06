/**
 * MenuCard Component
 * Reusable menu/action card for dashboard and navigation screens
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens, layoutConstants } from '../theme';
import { A11Y_ROLE, ICONS, TEXT_LINES, TOUCH_OPACITY, FLEX } from '../constants';
import { Text } from './Text';

interface MenuCardProps {
  title: string;
  description: string;
  icon: string;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
  badge?: string | number;
  style?: ViewStyle;
  testID?: string;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  title,
  description,
  icon,
  color,
  onPress,
  disabled = false,
  badge,
  style,
  testID,
}) => {
  const { colors, isDark } = useTheme();
  const iconColor = color || colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: designTokens.colors.black,
          shadowOpacity: isDark
            ? designTokens.shadowConfig.dark.opacity
            : designTokens.shadowConfig.light.opacity,
          elevation: isDark
            ? designTokens.shadowConfig.dark.elevation
            : designTokens.shadowConfig.light.elevation,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={TOUCH_OPACITY.default}
      testID={testID}
      accessible
      accessibilityRole={A11Y_ROLE.BUTTON}
      accessibilityLabel={title}
      accessibilityHint={description}
      accessibilityState={{ disabled }}
    >
      {/* Icon Container */}
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.CHECK}
          size={designTokens.icon.sizes.xxl}
          color={iconColor}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text variant="h4" numberOfLines={TEXT_LINES.single} style={styles.title}>
            {title}
          </Text>
          {badge !== undefined && (
            <View style={[styles.badge, { backgroundColor: iconColor }]}>
              <Text variant="caption" weight="bold" color="onPrimary">
                {badge}
              </Text>
            </View>
          )}
        </View>
        <Text variant="bodySmall" color="secondary" numberOfLines={TEXT_LINES.double}>
          {description}
        </Text>
      </View>

      {/* Chevron */}
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={designTokens.icon.sizes.lg}
        color={colors.textTertiary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.lg,
    // Shadow properties are applied via inline styles for theme-awareness
    shadowOffset: { width: 0, height: designTokens.spacing.xxs + 1 },
    shadowRadius: designTokens.shadows.lg.shadowRadius,
  },
  iconContainer: {
    width: designTokens.componentSizes.iconContainer['2xl'],
    height: designTokens.componentSizes.iconContainer['2xl'],
    borderRadius: designTokens.borderRadius['5xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.lg,
    flexShrink: FLEX.SHRINK_DISABLED,
  },
  content: {
    flex: FLEX.ONE,
    marginRight: designTokens.spacing.sm,
  },
  titleRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  title: {
    flex: FLEX.ONE,
  },
  badge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    minWidth: designTokens.spacing.xxl,
    height: designTokens.componentSizes.tabBarIndicator.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  chevron: {
    flexShrink: FLEX.SHRINK_DISABLED,
  },
});

export default MenuCard;
