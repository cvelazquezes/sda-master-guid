/**
 * Badge Primitive Component
 *
 * Reusable badge component for status indicators, roles, and labels.
 * Uses theme-aware status/role colors that automatically switch for light/dark mode.
 *
 * @example
 * <Badge label="Active" status="active" />
 * <Badge label="Admin" role="admin" />
 * <Badge label={t('badge.new')} variant="primary" />
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { mobileFontSizes, layoutConstants } from '../theme';
import { TEXT_LINES, COMPONENT_VARIANT, COMPONENT_SIZE, A11Y_ROLE, ICONS } from '../constants';
import { Text } from './Text';

type BadgeVariant =
  | typeof COMPONENT_VARIANT.primary
  | typeof COMPONENT_VARIANT.secondary
  | typeof COMPONENT_VARIANT.accent
  | typeof COMPONENT_VARIANT.success
  | typeof COMPONENT_VARIANT.warning
  | typeof COMPONENT_VARIANT.error
  | typeof COMPONENT_VARIANT.info
  | typeof COMPONENT_VARIANT.neutral;
type BadgeSize = typeof COMPONENT_SIZE.sm | typeof COMPONENT_SIZE.md | typeof COMPONENT_SIZE.lg;

// Status types match the keys in statusColors (from ThemeContext)
type StatusType =
  | 'active'
  | 'inactive'
  | 'paused'
  | 'pending'
  | 'completed'
  | 'scheduled'
  | 'skipped'
  | 'cancelled';

// Role types match the keys in roleColors (from ThemeContext)
type RoleType = 'admin' | 'club_admin' | 'user';

interface BadgeProps {
  // Content
  label: string;
  icon?: string;

  // Styling
  variant?: BadgeVariant;
  size?: BadgeSize;
  status?: StatusType;
  role?: RoleType;

  // Custom colors (overrides variant)
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;

  // Layout
  style?: ViewStyle;
  testID?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  variant = COMPONENT_VARIANT.neutral,
  size = COMPONENT_SIZE.md,
  status,
  role,
  backgroundColor,
  textColor,
  borderColor,
  style,
  testID,
}) => {
  // Get theme-aware colors from context (includes statusColors and roleColors)
  const {
    colors: themeColors,
    statusColors: themeStatusColors,
    roleColors: themeRoleColors,
  } = useTheme();

  // Determine colors based on status/role or variant (using theme-aware colors)
  const getColors = (): { bg: string; text: string; border: string } => {
    // Use theme-aware status colors
    if (status) {
      const statusConfig = themeStatusColors[status];
      return {
        bg: statusConfig.light,
        text: statusConfig.text,
        border: statusConfig.primary,
      };
    }

    // Use theme-aware role colors
    if (role) {
      const roleConfig = themeRoleColors[role];
      return {
        bg: roleConfig.light,
        text: roleConfig.text,
        border: roleConfig.primary,
      };
    }

    // Variant-based colors from theme
    switch (variant) {
      case COMPONENT_VARIANT.primary:
        return {
          bg: themeColors.primaryLight || themeColors.primaryAlpha10,
          text: themeColors.primary,
          border: themeColors.primary,
        };
      case COMPONENT_VARIANT.secondary:
        return {
          bg: themeColors.secondaryLight || themeColors.secondaryAlpha10,
          text: themeColors.secondary,
          border: themeColors.secondary,
        };
      case COMPONENT_VARIANT.accent:
        return {
          bg: themeColors.accentLight || themeColors.accentAlpha10,
          text: themeColors.accent,
          border: themeColors.accent,
        };
      case COMPONENT_VARIANT.success:
        return {
          bg: themeColors.successLight,
          text: themeColors.success,
          border: themeColors.success,
        };
      case COMPONENT_VARIANT.warning:
        return {
          bg: themeColors.warningLight,
          text: themeColors.warning,
          border: themeColors.warning,
        };
      case COMPONENT_VARIANT.error:
        return {
          bg: themeColors.errorLight,
          text: themeColors.error,
          border: themeColors.error,
        };
      case COMPONENT_VARIANT.info:
        return {
          bg: themeColors.infoLight,
          text: themeColors.info,
          border: themeColors.info,
        };
      default:
        return {
          bg: themeColors.surfaceLight,
          text: themeColors.textSecondary,
          border: themeColors.border,
        };
    }
  };

  const colors = getColors();

  const finalBackgroundColor = backgroundColor || colors.bg;
  const finalTextColor = textColor || colors.text;
  const finalBorderColor = borderColor || colors.border;

  // Size-based styles
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
    switch (size) {
      case COMPONENT_SIZE.sm:
        return {
          container: {
            paddingVertical: designTokens.spacing.xxs,
            paddingHorizontal: designTokens.spacing.sm,
          },
          text: {
            fontSize: mobileFontSizes.xs,
            lineHeight: designTokens.lineHeights.caption,
          },
          iconSize: designTokens.iconSize.xs,
        };
      case COMPONENT_SIZE.lg:
        return {
          container: {
            paddingVertical: designTokens.spacing.sm,
            paddingHorizontal: designTokens.spacing.md,
          },
          text: {
            fontSize: mobileFontSizes.xs,
            lineHeight: designTokens.lineHeights.body,
          },
          iconSize: designTokens.iconSize.sm,
        };
      default:
        return {
          container: {
            paddingVertical: designTokens.spacing.xs,
            paddingHorizontal: designTokens.spacing.sm,
          },
          text: {
            fontSize: mobileFontSizes.xs,
            lineHeight: designTokens.lineHeights.captionLarge,
          },
          iconSize: designTokens.iconSize.xs,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        {
          backgroundColor: finalBackgroundColor,
          borderColor: finalBorderColor,
        },
        style,
      ]}
      testID={testID}
      accessible
      accessibilityRole={A11Y_ROLE.TEXT}
      accessibilityLabel={label}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon as typeof ICONS.CHECK}
          size={sizeStyles.iconSize}
          color={finalTextColor}
          style={styles.icon}
        />
      )}
      <Text
        variant="caption"
        weight="bold"
        uppercase
        numberOfLines={TEXT_LINES.single}
        style={[sizeStyles.text, { color: finalTextColor }]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    alignSelf: layoutConstants.alignSelf.flexStart,
    borderRadius: designTokens.badge.borderRadius,
    borderWidth: designTokens.borderWidth.none,
  },
  icon: {
    marginRight: designTokens.spacing.xs,
  },
});

export default Badge;
