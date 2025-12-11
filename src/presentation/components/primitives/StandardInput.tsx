/**
 * StandardInput Component
 * Consistent input field component used across all screens and roles
 * Supports dynamic theming (light/dark mode)
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import {
  A11Y_ROLE,
  ICONS,
  DIMENSIONS,
  FLEX,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../../shared/constants';
import { useTheme } from '../../state/ThemeContext';
import { mobileTypography, mobileIconSizes, designTokens, layoutConstants } from '../../theme';

type StandardInputProps = {
  label?: string;
  icon?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  /** Accessibility label for show password button (pass translated string from screen) */
  showPasswordLabel?: string;
  /** Accessibility label for hide password button (pass translated string from screen) */
  hidePasswordLabel?: string;
} & TextInputProps;

export const StandardInput: React.FC<StandardInputProps> = ({
  label,
  icon,
  error,
  helperText,
  required,
  secureTextEntry,
  disabled,
  containerStyle,
  multiline,
  showPasswordLabel,
  hidePasswordLabel,
  ...textInputProps
}) => {
  const { colors } = useTheme();
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  const getContainerStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [
      styles.inputContainer,
      {
        borderColor: colors.border,
        backgroundColor: colors.surfaceLight,
      },
    ];

    if (multiline) {
      baseStyle.push(styles.inputContainerMultiline);
    }

    if (isFocused) {
      baseStyle.push({
        borderColor: colors.primary,
        backgroundColor: colors.surface,
      });
    }

    if (hasError) {
      baseStyle.push({ borderColor: colors.error });
    }

    if (disabled) {
      baseStyle.push({
        backgroundColor: colors.surfaceLight,
        opacity: designTokens.opacity.high,
      });
    }

    return baseStyle;
  };

  const getIconColor = (): string => {
    if (hasError) {
      return colors.error;
    }
    if (isFocused) {
      return colors.primary;
    }
    return colors.textTertiary;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text variant={TEXT_VARIANT.LABEL} weight={TEXT_WEIGHT.BOLD}>
            {label}
            {required && <Text color={TEXT_COLOR.ERROR}> *</Text>}
          </Text>
        </View>
      )}

      {/* Input Container */}
      <View style={getContainerStyle()}>
        {/* Icon */}
        {icon && (
          <MaterialCommunityIcons
            name={icon as typeof ICONS.CHECK}
            size={mobileIconSizes.medium}
            color={getIconColor()}
            style={[styles.icon, multiline && styles.iconMultiline]}
          />
        )}

        {/* Text Input */}
        <TextInput
          {...textInputProps}
          multiline={multiline}
          style={[styles.input, { color: colors.textPrimary }, textInputProps.style]}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          editable={!disabled}
          placeholderTextColor={colors.textTertiary}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
        />

        {/* Secure Entry Toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            accessible
            style={styles.secureToggle}
            accessibilityRole={A11Y_ROLE.BUTTON}
            accessibilityLabel={isSecureVisible ? hidePasswordLabel : showPasswordLabel}
            onPress={() => setIsSecureVisible(!isSecureVisible)}
          >
            <MaterialCommunityIcons
              name={isSecureVisible ? ICONS.EYE_OFF : ICONS.EYE}
              size={mobileIconSizes.medium}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.messageContainer}>
          <MaterialCommunityIcons
            name={ICONS.ALERT_CIRCLE}
            size={mobileIconSizes.tiny}
            color={colors.error}
            style={styles.messageIcon}
          />
          <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.ERROR} style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.TERTIARY} style={styles.helperText}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.md,
  },
  labelContainer: {
    marginBottom: designTokens.spacing.sm,
  },
  inputContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    borderWidth: designTokens.borderWidth.thin,
    borderRadius: designTokens.borderRadius.lg,
    paddingHorizontal: designTokens.spacing.md,
    minHeight: DIMENSIONS.MIN_HEIGHT.BUTTON,
  },
  inputContainerMultiline: {
    alignItems: layoutConstants.alignItems.flexStart,
    paddingVertical: designTokens.spacing.md,
  },
  icon: {
    marginRight: designTokens.spacing.md,
  },
  iconMultiline: {
    marginTop: designTokens.spacing.xxs,
  },
  input: {
    flex: FLEX.ONE,
    ...mobileTypography.bodyLarge,
    minHeight: DIMENSIONS.MIN_HEIGHT.BUTTON,
  },
  secureToggle: {
    padding: designTokens.spacing.sm,
    marginLeft: designTokens.spacing.sm,
  },
  messageContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.xs,
    marginLeft: designTokens.spacing.xs,
  },
  messageIcon: {
    marginRight: designTokens.spacing.xs,
  },
  errorText: {
    flex: FLEX.ONE,
  },
  helperText: {
    marginTop: designTokens.spacing.xs,
    marginLeft: designTokens.spacing.xs,
  },
});
