/**
 * StandardButton Component
 * Consistent button component used across all screens and roles
 * Updated with SDA Brand Colors
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import {
  A11Y_ROLE,
  TOUCH_OPACITY,
  DIMENSIONS,
  ACTIVITY_INDICATOR_SIZE,
  COMPONENT_VARIANT,
  BUTTON_SIZE,
  ICON_POSITION,
  TEXT_ALIGN,
  TEXT_VARIANT,
  BORDERS,
  type ICONS,
} from '../../../shared/constants';
import { useTheme } from '../../state/ThemeContext';
import { designTokens, layoutConstants } from '../../theme';

type ButtonVariant =
  | typeof COMPONENT_VARIANT.primary
  | typeof COMPONENT_VARIANT.secondary
  | typeof COMPONENT_VARIANT.accent
  | typeof COMPONENT_VARIANT.danger
  | typeof COMPONENT_VARIANT.outline
  | typeof COMPONENT_VARIANT.ghost;
type ButtonSize = typeof BUTTON_SIZE.small | typeof BUTTON_SIZE.medium | typeof BUTTON_SIZE.large;
type IconPosition = typeof ICON_POSITION.LEFT | typeof ICON_POSITION.RIGHT;

type StandardButtonProps = {
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
};

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
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  // Get variant background color from theme
  const getVariantBackgroundColor = (): string => {
    switch (variant) {
      case COMPONENT_VARIANT.primary:
        return colors.primary;
      case COMPONENT_VARIANT.secondary:
        return colors.secondary;
      case COMPONENT_VARIANT.accent:
        return colors.accent;
      case COMPONENT_VARIANT.danger:
        return colors.error;
      case COMPONENT_VARIANT.outline:
      case COMPONENT_VARIANT.ghost:
        return colors.transparent || BORDERS.COLOR.TRANSPARENT;
      default:
        return colors.primary;
    }
  };

  // Get variant border color from theme
  const getVariantBorderColor = (): string | undefined => {
    if (variant === COMPONENT_VARIANT.outline) {
      return colors.primary;
    }
    return undefined;
  };

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [
      styles.button,
      { backgroundColor: getVariantBackgroundColor() },
    ];

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

    // Variant-specific styles (border for outline)
    if (variant === COMPONENT_VARIANT.outline) {
      baseStyle.push({
        borderWidth: designTokens.button.borderWidth,
        borderColor: getVariantBorderColor(),
      });
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

  // Get text color from theme based on variant
  const getTextColor = (): string => {
    if (isDisabled) {
      return colors.textDisabled;
    }
    switch (variant) {
      case COMPONENT_VARIANT.primary:
      case COMPONENT_VARIANT.secondary:
      case COMPONENT_VARIANT.danger:
        return colors.textOnPrimary;
      case COMPONENT_VARIANT.accent:
        return colors.textOnAccent || colors.textPrimary;
      case COMPONENT_VARIANT.outline:
      case COMPONENT_VARIANT.ghost:
        return colors.primary;
      default:
        return colors.textOnPrimary;
    }
  };

  const getTextStyle = (): TextStyle => {
    const textStyle: TextStyle = { color: getTextColor() };

    // Large size needs bigger font
    if (size === BUTTON_SIZE.large) {
      textStyle.fontSize = designTokens.typography.fontSizes.xl;
    }

    return textStyle;
  };

  const getIconSize = (): number => {
    switch (size) {
      case BUTTON_SIZE.small:
        return designTokens.button.sizes.small.iconSize;
      case BUTTON_SIZE.large:
        return designTokens.button.sizes.large.iconSize;
      default:
        return designTokens.button.sizes.medium.iconSize;
    }
  };

  const getIconColor = (): string => {
    if (isDisabled) {
      return colors.textDisabled;
    }
    switch (variant) {
      case COMPONENT_VARIANT.primary:
      case COMPONENT_VARIANT.secondary:
      case COMPONENT_VARIANT.danger:
        return colors.textOnPrimary;
      case COMPONENT_VARIANT.accent:
        return colors.textOnAccent || colors.textPrimary;
      case COMPONENT_VARIANT.outline:
      case COMPONENT_VARIANT.ghost:
        return colors.primary;
      default:
        return colors.textOnPrimary;
    }
  };

  return (
    <TouchableOpacity
      accessible
      style={getButtonStyle()}
      disabled={isDisabled}
      activeOpacity={TOUCH_OPACITY.default}
      testID={testID}
      accessibilityRole={A11Y_ROLE.BUTTON}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} size={ACTIVITY_INDICATOR_SIZE.small} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && iconPosition === ICON_POSITION.LEFT && (
            <MaterialCommunityIcons
              name={icon as typeof ICONS.CHECK}
              size={getIconSize()}
              color={getIconColor()}
              style={styles.iconLeft}
            />
          )}
          <Text
            variant={size === BUTTON_SIZE.small ? TEXT_VARIANT.BUTTON_SMALL : TEXT_VARIANT.BUTTON}
            align={TEXT_ALIGN.CENTER}
            style={getTextStyle()}
          >
            {title}
          </Text>
          {icon && iconPosition === ICON_POSITION.RIGHT && (
            <MaterialCommunityIcons
              name={icon as typeof ICONS.CHECK}
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

  // Layout styles (colors handled dynamically via useTheme)
  buttonFullWidth: {
    width: DIMENSIONS.WIDTH.FULL,
  },
  buttonDisabled: {
    opacity: designTokens.opacity.disabled,
  },

  // Icon styles
  iconLeft: {
    marginRight: designTokens.spacing.sm,
  },
  iconRight: {
    marginLeft: designTokens.spacing.sm,
  },
});
