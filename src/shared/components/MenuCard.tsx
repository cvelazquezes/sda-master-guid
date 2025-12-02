/**
 * MenuCard Component
 * Reusable menu/action card for dashboard and navigation screens
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { mobileTypography, mobileFontSizes } from '../theme/mobileTypography';

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
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.4 : 0.2,
          elevation: isDark ? 8 : 5,
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
      accessibilityState={{ disabled }}
    >
      {/* Icon Container */}
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <MaterialCommunityIcons
          name={icon as any}
          size={designTokens.icon.sizes.xxl}
          color={iconColor}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          {badge !== undefined && (
            <View style={[styles.badge, { backgroundColor: iconColor }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {/* Chevron */}
      <MaterialCommunityIcons
        name="chevron-right"
        size={designTokens.icon.sizes.lg}
        color={colors.textTertiary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.lg,
    // Shadow properties are applied via inline styles for theme-awareness
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.lg,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    marginRight: designTokens.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
    marginBottom: 4,
  },
  title: {
    ...mobileTypography.heading4,
    flex: 1,
  },
  description: {
    ...mobileTypography.bodySmall,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: designTokens.borderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...mobileTypography.captionBold,
    color: '#fff',
    fontSize: mobileFontSizes.xs,
  },
  chevron: {
    flexShrink: 0,
  },
});

export default MenuCard;
