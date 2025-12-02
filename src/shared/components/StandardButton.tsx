/**
 * StandardButton Component
 * Consistent button component used across all screens and roles
 * Updated with SDA Brand Colors
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { designTokens } from '../theme/designTokens';
import { mobileTypography } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface StandardButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const StandardButton: React.FC<StandardButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
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
      case 'small':
        baseStyle.push(styles.buttonSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge);
        break;
      default:
        baseStyle.push(styles.buttonMedium);
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.buttonPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'accent':
        baseStyle.push(styles.buttonAccent);
        break;
      case 'danger':
        baseStyle.push(styles.buttonDanger);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'ghost':
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
      case 'small':
        baseStyle.push(styles.buttonTextSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonTextLarge);
        break;
      default:
        baseStyle.push(styles.buttonTextMedium);
    }

    // Variant text styles
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        baseStyle.push(styles.buttonTextLight);
        break;
      case 'accent':
        baseStyle.push(styles.buttonTextDark);
        break;
      case 'outline':
      case 'ghost':
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
      case 'small':
        return designTokens.button.sizes.small.iconSize;
      case 'large':
        return designTokens.button.sizes.large.iconSize;
      default:
        return designTokens.button.sizes.medium.iconSize;
    }
  };

  const getIconColor = () => {
    if (isDisabled) return designTokens.colors.textDisabled;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return designTokens.colors.textOnPrimary;
      case 'accent':
        return designTokens.colors.textOnAccent;
      case 'outline':
      case 'ghost':
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
      activeOpacity={0.7}
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && (
            <MaterialCommunityIcons
              name={icon as any}
              size={getIconSize()}
              color={getIconColor()}
              style={styles.iconLeft}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '100%',
  },
  buttonDisabled: {
    opacity: designTokens.opacity.disabled,
  },

  // Text styles
  buttonText: {
    textAlign: 'center',
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

