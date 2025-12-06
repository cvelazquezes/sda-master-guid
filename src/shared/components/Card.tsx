/**
 * Card Component
 * Reusable card component with consistent styling
 * Supports dynamic theming (light/dark mode)
 */

import React, { ReactNode, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme';
import { useShadowStyle } from '../hooks/useShadowStyle';
import { A11Y_ROLE, TOUCH_OPACITY, COMPONENT_VARIANT } from '../constants';
import { ShadowPreset } from '../types/theme';

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
  const { colors } = useTheme();
  const { getShadow } = useShadowStyle();

  // Map variant to shadow preset
  const variantShadowMap: Record<CardVariant, ShadowPreset> = useMemo(
    () => ({
      [COMPONENT_VARIANT.elevated]: 'elevated',
      [COMPONENT_VARIANT.outlined]: 'subtle',
      [COMPONENT_VARIANT.flat]: 'none',
      [COMPONENT_VARIANT.default]: 'card',
    }),
    []
  );

  // Get variant-specific styles (memoized)
  const variantStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface,
      borderRadius: designTokens.card.borderRadius,
      padding: designTokens.card.padding,
      marginBottom: designTokens.spacing.md,
    };

    // Get shadow from preset
    const shadowPreset = variantShadowMap[variant];
    const shadowStyle = getShadow(shadowPreset);

    // Handle variant-specific additions
    if (variant === COMPONENT_VARIANT.flat) {
      return { ...baseStyle, backgroundColor: 'transparent' };
    }

    if (variant === COMPONENT_VARIANT.outlined) {
      return {
        ...baseStyle,
        ...shadowStyle,
        borderWidth: designTokens.card.borderWidth || designTokens.borderWidth.thin,
        borderColor: colors.border,
      };
    }

    return { ...baseStyle, ...shadowStyle };
  }, [variant, colors.surface, colors.border, getShadow, variantShadowMap]);

  const cardStyle = [variantStyle, disabled && styles.disabled, style];

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
