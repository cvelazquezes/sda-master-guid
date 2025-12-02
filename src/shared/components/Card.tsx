/**
 * Card Component
 * Reusable card component with consistent styling
 * Supports dynamic theming (light/dark mode)
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

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
  variant = 'default',
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
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.5 : 0.2,
          shadowRadius: 12,
          elevation: isDark ? 10 : 8,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: designTokens.card.borderWidth || designTokens.borderWidth.thin,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.25 : 0.12,
          shadowRadius: 4,
          elevation: isDark ? 3 : 2,
        };
      case 'flat':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return {
          ...baseStyle,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.4 : 0.18,
          shadowRadius: 10,
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
        activeOpacity={0.7}
        testID={testID}
        accessible={true}
        accessibilityRole="button"
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
