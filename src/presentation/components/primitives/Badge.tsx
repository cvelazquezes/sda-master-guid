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

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { designTokens } from '../../theme/designTokens';
import { layoutConstants, getBadgeSizePreset, getSpacing } from '../../theme';
import { useThemeColor } from '../../hooks/useThemeColor';
import {
  TEXT_LINES,
  COMPONENT_VARIANT,
  COMPONENT_SIZE,
  A11Y_ROLE,
  ICONS,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../../shared/constants';
import { Text } from './Text';
import { StatusType, RoleType, ComponentSize } from '../../../shared/types/theme';

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
  // Use centralized theme color hook
  const { getStatusColor, getRoleColor, colors: themeColors } = useThemeColor();

  // Get size preset (replaces switch statement)
  const sizePreset = useMemo(() => getBadgeSizePreset(size as ComponentSize), [size]);

  // Determine colors based on status/role or variant (memoized)
  const badgeColors = useMemo((): { bg: string; text: string; border: string } => {
    // Use theme-aware status colors
    if (status) {
      const statusConfig = getStatusColor(status);
      return { bg: statusConfig.light, text: statusConfig.text, border: statusConfig.primary };
    }

    // Use theme-aware role colors
    if (role) {
      const roleConfig = getRoleColor(role);
      return { bg: roleConfig.light, text: roleConfig.text, border: roleConfig.primary };
    }

    // Variant-based colors from theme (using color mapping)
    const variantColorMap: Record<string, { bg: string; text: string; border: string }> = {
      [COMPONENT_VARIANT.primary]: {
        bg: themeColors.primaryLight || themeColors.primaryAlpha10,
        text: themeColors.primary,
        border: themeColors.primary,
      },
      [COMPONENT_VARIANT.secondary]: {
        bg: themeColors.secondaryLight || themeColors.secondaryAlpha10,
        text: themeColors.secondary,
        border: themeColors.secondary,
      },
      [COMPONENT_VARIANT.accent]: {
        bg: themeColors.accentLight || themeColors.accentAlpha10,
        text: themeColors.accent,
        border: themeColors.accent,
      },
      [COMPONENT_VARIANT.success]: {
        bg: themeColors.successLight,
        text: themeColors.success,
        border: themeColors.success,
      },
      [COMPONENT_VARIANT.warning]: {
        bg: themeColors.warningLight,
        text: themeColors.warning,
        border: themeColors.warning,
      },
      [COMPONENT_VARIANT.error]: {
        bg: themeColors.errorLight,
        text: themeColors.error,
        border: themeColors.error,
      },
      [COMPONENT_VARIANT.info]: {
        bg: themeColors.infoLight,
        text: themeColors.info,
        border: themeColors.info,
      },
    };

    return (
      variantColorMap[variant] || {
        bg: themeColors.surfaceLight,
        text: themeColors.textSecondary,
        border: themeColors.border,
      }
    );
  }, [status, role, variant, getStatusColor, getRoleColor, themeColors]);

  const finalBackgroundColor = backgroundColor || badgeColors.bg;
  const finalTextColor = textColor || badgeColors.text;
  const finalBorderColor = borderColor || badgeColors.border;

  // Container style using size presets
  const containerStyle = useMemo<ViewStyle>(
    () => ({
      paddingVertical: getSpacing(sizePreset.paddingV),
      paddingHorizontal: getSpacing(sizePreset.paddingH),
    }),
    [sizePreset]
  );

  // Text style using size presets
  const textStyle = useMemo<TextStyle>(
    () => ({
      fontSize: sizePreset.fontSize,
      lineHeight: sizePreset.lineHeight,
      color: finalTextColor,
    }),
    [sizePreset, finalTextColor]
  );

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        { backgroundColor: finalBackgroundColor, borderColor: finalBorderColor },
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
          size={sizePreset.iconSize}
          color={finalTextColor}
          style={styles.icon}
        />
      )}
      <Text
        variant={TEXT_VARIANT.CAPTION}
        weight={TEXT_WEIGHT.BOLD}
        uppercase
        numberOfLines={TEXT_LINES.single}
        style={textStyle}
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
