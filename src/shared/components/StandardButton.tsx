/**
 * StandardButton Component
 * Consistent button component used across all screens and roles
 * Updated with SDA Brand Colors
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { mobileTypography, designTokens, layoutConstants } from '../theme';
import { A11Y_ROLE, TOUCH_OPACITY, dimensionValues, ACTIVITY_INDICATOR_SIZE, COMPONENT_VARIANT, BUTTON_SIZE, ICON_POSITION } from '../constants';

type ButtonVariant = typeof COMPONENT_VARIANT.primary | typeof COMPONENT_VARIANT.secondary | typeof COMPONENT_VARIANT.accent | typeof COMPONENT_VARIANT.danger | typeof COMPONENT_VARIANT.outline | typeof COMPONENT_VARIANT.ghost;
type ButtonSize = typeof BUTTON_SIZE.small | typeof BUTTON_SIZE.medium | typeof BUTTON_SIZE.large;
type IconPosition = typeof ICON_POSITION.LEFT | typeof ICON_POSITION.RIGHT;

interface StandardButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: IconPosition;
  fullWidth?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const StandardButton: React.FC<StandardButtonProps> = ({
  title,
  onPress,
  variant = COMPONENT_VARIANT.primary,
  size = BUTTON_SIZE.medium,
  disabled = false,
  loading = false,
  icon,
  iconPosition = ICON_POSITION.LEFT,
  fullWidth = false,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button];
    
    // Size styles
    switch (size) {
      case BUTTON_SIZE.small:
        baseStyle.push(styles.buttonSmall);
        break;
      case BUTTON_SIZE.large:
        baseStyle.push(styles.buttonLarge);
        break;
      default:
        baseStyle.push(styles.buttonMedium);
    }

    // Variant styles
    switch (variant) {
      case COMPONENT_VARIANT.primary:
        baseStyle.push(styles.buttonPrimary);
        break;
      case COMPONENT_VARIANT.secondary:
        baseStyle.push(styles.buttonSecondary);
        break;
      case COMPONENT_VARIANT.accent:
        baseStyle.push(styles.buttonAccent);
        break;
      case COMPONENT_VARIANT.danger:
        baseStyle.push(styles.buttonDanger);
        break;
      case COMPONENT_VARIANT.outline:
        baseStyle.push(styles.buttonOutline);
        break;
      case COMPONENT_VARIANT.ghost:
        baseStyle.push(styles.buttonGhost);
        break;
    }

    // Full width
    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }

    // Disabled state
    if (isDisabled) {
      baseStyle.push(styles.buttonDisabled);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.buttonText];

    // Size text styles
    switch (size) {
      case BUTTON_SIZE.small:
        baseStyle.push(styles.buttonTextSmall);
        break;
      case BUTTON_SIZE.large:
        baseStyle.push(styles.buttonTextLarge);
        break;
      default:
        baseStyle.push(styles.buttonTextMedium);
    }

    // Variant text styles
    switch (variant) {
      case COMPONENT_VARIANT.primary:
      case COMPONENT_VARIANT.secondary:
      case COMPONENT_VARIANT.danger:
        baseStyle.push(styles.buttonTextLight);
        break;
      case COMPONENT_VARIANT.accent:
        baseStyle.push(styles.buttonTextDark);
        break;
      case COMPONENT_VARIANT.outline:
      case COMPONENT_VARIANT.ghost:
        baseStyle.push(styles.buttonTextPrimary);
        break;
    }

    if (isDisabled) {
      baseStyle.push(styles.buttonTextDisabled);
    }

    return baseStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case BUTTON_SIZE.small:
        return designTokens.button.sizes.small.iconSize;
      case BUTTON_SIZE.large:
        return designTokens.button.sizes.large.iconSize;
      default:
        return designTokens.button.sizes.medium.iconSize;
    }
  };

  const getIconColor = () => {
    if (isDisabled) return designTokens.colors.textDisabled;
    switch (variant) {
      case COMPONENT_VARIANT.primary:
      case COMPONENT_VARIANT.secondary:
      case COMPONENT_VARIANT.danger:
        return designTokens.colors.textOnPrimary;
      case COMPONENT_VARIANT.accent:
        return designTokens.colors.textOnAccent;
      case COMPONENT_VARIANT.outline:
      case COMPONENT_VARIANT.ghost:
        return designTokens.colors.primary;
      default:
        return designTokens.colors.textOnPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={TOUCH_OPACITY.default}
      testID={testID}
      accessible={true}
      accessibilityRole={A11Y_ROLE.BUTTON}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} size={ACTIVITY_INDICATOR_SIZE.small} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && iconPosition === ICON_POSITION.LEFT && (
            <MaterialCommunityIcons
              name={icon as any}
              size={getIconSize()}
              color={getIconColor()}
              style={styles.iconLeft}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === ICON_POSITION.RIGHT && (
            <MaterialCommunityIcons
              name={icon as any}
              size={getIconSize()}
              color={getIconColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: designTokens.button.borderRadius,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  buttonContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },

  // Size variants
  buttonSmall: {
    paddingVertical: designTokens.button.sizes.small.paddingVertical,
    paddingHorizontal: designTokens.button.sizes.small.paddingHorizontal,
    minHeight: designTokens.button.sizes.small.minHeight,
  },
  buttonMedium: {
    paddingVertical: designTokens.button.sizes.medium.paddingVertical,
    paddingHorizontal: designTokens.button.sizes.medium.paddingHorizontal,
    minHeight: designTokens.button.sizes.medium.minHeight,
  },
  buttonLarge: {
    paddingVertical: designTokens.button.sizes.large.paddingVertical,
    paddingHorizontal: designTokens.button.sizes.large.paddingHorizontal,
    minHeight: designTokens.button.sizes.large.minHeight,
  },

  // Style variants - SDA Brand Colors
  buttonPrimary: {
    backgroundColor: designTokens.button.variants.primary.backgroundColor,
  },
  buttonSecondary: {
    backgroundColor: designTokens.button.variants.secondary.backgroundColor,
  },
  buttonAccent: {
    backgroundColor: designTokens.button.variants.accent.backgroundColor,
  },
  buttonDanger: {
    backgroundColor: designTokens.button.variants.danger.backgroundColor,
  },
  buttonOutline: {
    backgroundColor: designTokens.button.variants.outline.backgroundColor,
    borderWidth: designTokens.button.borderWidth,
    borderColor: designTokens.button.variants.outline.borderColor,
  },
  buttonGhost: {
    backgroundColor: designTokens.button.variants.ghost.backgroundColor,
  },
  buttonFullWidth: {
    width: dimensionValues.width.full,
  },
  buttonDisabled: {
    opacity: designTokens.opacity.disabled,
  },

  // Text styles
  buttonText: {
    textAlign: layoutConstants.textAlign.center,
  },
  buttonTextSmall: {
    ...mobileTypography.buttonSmall,
  },
  buttonTextMedium: {
    ...mobileTypography.button,
  },
  buttonTextLarge: {
    ...mobileTypography.button,
    fontSize: designTokens.typography.fontSizes.xl,
  },
  buttonTextLight: {
    color: designTokens.colors.textOnPrimary,
  },
  buttonTextPrimary: {
    color: designTokens.colors.primary,
  },
  buttonTextDark: {
    color: designTokens.colors.textPrimary,
  },
  buttonTextDisabled: {
    color: designTokens.colors.textDisabled,
  },

  // Icon styles
  iconLeft: {
    marginRight: designTokens.spacing.sm,
  },
  iconRight: {
    marginLeft: designTokens.spacing.sm,
  },
});

