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

type CardVariant = typeof COMPONENT_VARIANT.default | typeof COMPONENT_VARIANT.elevated | typeof COMPONENT_VARIANT.outlined | typeof COMPONENT_VARIANT.flat;

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
          shadowColor: designTokens.colors.black,
          shadowOffset: { width: 0, height: designTokens.spacing.xs },
          shadowOpacity: isDark ? designTokens.shadowConfig.darkStrong.opacity : designTokens.shadowConfig.light.opacity,
          shadowRadius: designTokens.spacing.md,
          elevation: isDark ? 10 : 8,
        };
      case COMPONENT_VARIANT.outlined:
        return {
          ...baseStyle,
          borderWidth: designTokens.card.borderWidth || designTokens.borderWidth.thin,
          borderColor: colors.border,
          shadowColor: designTokens.colors.black,
          shadowOffset: { width: 0, height: designTokens.borderWidth.thin },
          shadowOpacity: isDark ? designTokens.shadowConfig.darkSubtle.opacity : designTokens.shadowConfig.lightSubtle.opacity,
          shadowRadius: designTokens.spacing.xs,
          elevation: isDark ? 3 : 2,
        };
      case COMPONENT_VARIANT.flat:
        return {
          ...baseStyle,
          backgroundColor: designTokens.colors.transparent,
        };
      default:
        return {
          ...baseStyle,
          shadowColor: designTokens.colors.black,
          shadowOffset: { width: 0, height: designTokens.borderWidth.thick },
          shadowOpacity: isDark ? designTokens.shadowConfig.dark.opacity : designTokens.shadowConfig.lightSubtle.opacity + 0.06,
          shadowRadius: designTokens.spacing.sm + designTokens.spacing.xxs,
          elevation: isDark ? 6 : 4,
        };
    }
  };

  const cardStyle = [
    getVariantStyle(),
    disabled && styles.disabled,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={TOUCH_OPACITY.default}
        testID={testID}
        accessible={true}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
      >
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={cardStyle}
      testID={testID}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
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
