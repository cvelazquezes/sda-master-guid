/**
 * IconButton Component
 * Reusable icon button component
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { designTokens } from '../theme/designTokens';

type IconButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  color,
  backgroundColor,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          containerSize: 32,
          iconSize: designTokens.icon.sizes.sm,
        };
      case 'lg':
        return {
          containerSize: 48,
          iconSize: designTokens.icon.sizes.lg,
        };
      default:
        return {
          containerSize: 40,
          iconSize: designTokens.icon.sizes.md,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: designTokens.colors.primary,
          color: designTokens.colors.textOnPrimary,
        };
      case 'secondary':
        return {
          backgroundColor: designTokens.colors.secondary,
          color: designTokens.colors.textOnSecondary,
        };
      case 'accent':
        return {
          backgroundColor: designTokens.colors.accent,
          color: designTokens.colors.textOnAccent,
        };
      case 'danger':
        return {
          backgroundColor: designTokens.colors.error,
          color: designTokens.colors.textInverse,
        };
      default:
        return {
          backgroundColor: 'transparent',
          color: designTokens.colors.textPrimary,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const finalBackgroundColor = backgroundColor || variantStyles.backgroundColor;
  const finalColor = color || variantStyles.color;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: sizeStyles.containerSize,
          height: sizeStyles.containerSize,
          backgroundColor: finalBackgroundColor,
        },
        disabled && styles.disabled,
        style,
      ]}
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
      <MaterialCommunityIcons
        name={icon as any}
        size={sizeStyles.iconSize}
        color={disabled ? designTokens.colors.textDisabled : finalColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: designTokens.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: designTokens.opacity.disabled,
  },
});

export default IconButton;

