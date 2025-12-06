/**
 * Card Component
 * Reusable card component with consistent styling
 * Supports dynamic theming (light/dark mode)
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme';
import { A11Y_ROLE, TOUCH_OPACITY, COMPONENT_VARIANT } from '../constants';
import { MATH, OPACITY_VALUE } from '../constants/numbers';

// Card elevation values for different themes and variants
/* eslint-disable no-magic-numbers -- Elevation constants for card shadows */
const CARD_ELEVATION = {
  ELEVATED_DARK: 10,
  ELEVATED_LIGHT: 8,
  OUTLINED_DARK: 3,
  DEFAULT_DARK: 6,
  DEFAULT_LIGHT: 4,
} as const;
const SHADOW_OPACITY_ADJUSTMENT = OPACITY_VALUE.VERY_LIGHT; // 0.06
/* eslint-enable no-magic-numbers */

type CardVariant =
  | typeof COMPONENT_VARIANT.default
  | typeof COMPONENT_VARIANT.elevated
  | typeof COMPONENT_VARIANT.outlined
  | typeof COMPONENT_VARIANT.flat;

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = COMPONENT_VARIANT.default,
  onPress,
  disabled = false,
  style,
  contentStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { colors, isDark } = useTheme();

  // Get shadow color from theme (falls back to black if not defined)
  const shadowColor = colors.shadow || '#000000';

  const getVariantStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface,
      borderRadius: designTokens.card.borderRadius,
      padding: designTokens.card.padding,
      marginBottom: designTokens.spacing.md,
    };

    switch (variant) {
      case COMPONENT_VARIANT.elevated:
        return {
          ...baseStyle,
          shadowColor,
          shadowOffset: { width: 0, height: designTokens.spacing.xs },
          shadowOpacity: isDark
            ? designTokens.shadowConfig.darkStrong.opacity
            : designTokens.shadowConfig.light.opacity,
          shadowRadius: designTokens.spacing.md,
          elevation: isDark ? CARD_ELEVATION.ELEVATED_DARK : CARD_ELEVATION.ELEVATED_LIGHT,
        };
      case COMPONENT_VARIANT.outlined:
        return {
          ...baseStyle,
          borderWidth: designTokens.card.borderWidth || designTokens.borderWidth.thin,
          borderColor: colors.border,
          shadowColor,
          shadowOffset: { width: 0, height: designTokens.borderWidth.thin },
          shadowOpacity: isDark
            ? designTokens.shadowConfig.darkSubtle.opacity
            : designTokens.shadowConfig.lightSubtle.opacity,
          shadowRadius: designTokens.spacing.xs,
          elevation: isDark ? CARD_ELEVATION.OUTLINED_DARK : MATH.HALF,
        };
      case COMPONENT_VARIANT.flat:
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return {
          ...baseStyle,
          shadowColor,
          shadowOffset: { width: 0, height: designTokens.borderWidth.thick },
          shadowOpacity: isDark
            ? designTokens.shadowConfig.dark.opacity
            : designTokens.shadowConfig.lightSubtle.opacity + SHADOW_OPACITY_ADJUSTMENT,
          shadowRadius: designTokens.spacing.sm + designTokens.spacing.xxs,
          elevation: isDark ? CARD_ELEVATION.DEFAULT_DARK : CARD_ELEVATION.DEFAULT_LIGHT,
        };
    }
  };

  const cardStyle = [getVariantStyle(), disabled && styles.disabled, style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={TOUCH_OPACITY.default}
        testID={testID}
        accessible
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID={testID} accessible accessibilityLabel={accessibilityLabel}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: designTokens.card.gap,
  },
  disabled: {
    opacity: designTokens.opacity.disabled,
  },
});

export default Card;
