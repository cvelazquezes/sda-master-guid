/**
 * Badge Component
 * Reusable badge component for status indicators, roles, and labels
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { statusColors, roleColors } from '../theme/sdaColors';
import { mobileFontSizes, layoutConstants } from '../theme';
import { TEXT_LINES, COMPONENT_VARIANT, COMPONENT_SIZE, A11Y_ROLE } from '../constants';

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
type StatusType = keyof typeof statusColors;
type RoleType = keyof typeof roleColors;

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
  const { colors: themeColors } = useTheme();

  // Determine colors based on status/role or variant (using theme colors)
  const getColors = (): { bg: string; text: string; border: string } => {
    if (status) {
      return {
        bg: statusColors[status].light,
        text: statusColors[status].text,
        border: statusColors[status].primary,
      };
    }

    if (role) {
      return {
        bg: roleColors[role].light,
        text: roleColors[role].text,
        border: roleColors[role].primary,
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
        style={[styles.text, sizeStyles.text, { color: finalTextColor }]}
        numberOfLines={TEXT_LINES.single}
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
  text: {
    fontWeight: designTokens.badge.fontWeight,
    textTransform: designTokens.badge.textTransform,
    letterSpacing: designTokens.badge.letterSpacing,
  },
});

export default Badge;
