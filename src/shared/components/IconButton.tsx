/**
 * IconButton Component
 * Reusable icon button component
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens, layoutConstants } from '../theme';
import {
  A11Y_ROLE,
  COMPONENT_SIZE,
  COMPONENT_VARIANT,
  TOUCH_OPACITY,
  dimensionValues,
  ICONS,
} from '../constants';

type IconButtonVariant =
  | typeof COMPONENT_VARIANT.primary
  | typeof COMPONENT_VARIANT.secondary
  | typeof COMPONENT_VARIANT.accent
  | typeof COMPONENT_VARIANT.danger
  | typeof COMPONENT_VARIANT.ghost;
type IconButtonSize =
  | typeof COMPONENT_SIZE.sm
  | typeof COMPONENT_SIZE.md
  | typeof COMPONENT_SIZE.lg;

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
  variant = COMPONENT_VARIANT.ghost,
  size = COMPONENT_SIZE.md,
  disabled = false,
  color,
  backgroundColor,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { colors } = useTheme();

  const getSizeStyles = (): { containerSize: number; iconSize: number } => {
    switch (size) {
      case COMPONENT_SIZE.sm:
        return {
          containerSize: dimensionValues.minWidth.iconButtonSmall,
          iconSize: designTokens.icon.sizes.sm,
        };
      case COMPONENT_SIZE.lg:
        return {
          containerSize: dimensionValues.minHeight.selectItem,
          iconSize: designTokens.icon.sizes.lg,
        };
      default:
        return {
          containerSize: dimensionValues.minHeight.touchTarget,
          iconSize: designTokens.icon.sizes.md,
        };
    }
  };

  const getVariantStyles = (): { backgroundColor: string; color: string } => {
    switch (variant) {
      case COMPONENT_VARIANT.primary:
        return {
          backgroundColor: colors.primary,
          color: colors.textOnPrimary,
        };
      case COMPONENT_VARIANT.secondary:
        return {
          backgroundColor: colors.secondary,
          color: colors.textOnSecondary || colors.textOnPrimary,
        };
      case COMPONENT_VARIANT.accent:
        return {
          backgroundColor: colors.accent,
          color: colors.textOnAccent || colors.textPrimary,
        };
      case COMPONENT_VARIANT.danger:
        return {
          backgroundColor: colors.error,
          color: colors.textInverse,
        };
      default:
        return {
          backgroundColor: 'transparent',
          color: colors.textPrimary,
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
      activeOpacity={TOUCH_OPACITY.default}
      testID={testID}
      accessible
      accessibilityRole={A11Y_ROLE.BUTTON}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      <MaterialCommunityIcons
        name={icon as typeof ICONS.CHECK}
        size={sizeStyles.iconSize}
        color={disabled ? colors.textDisabled : finalColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: designTokens.borderRadius.full,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  disabled: {
    opacity: designTokens.opacity.disabled,
  },
});

export default IconButton;
