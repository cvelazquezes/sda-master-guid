/**
 * StandardInput Component
 * Consistent input field component used across all screens and roles
 * Supports dynamic theming (light/dark mode)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileTypography, mobileIconSizes } from '../theme';
import { designTokens } from '../theme/designTokens';

interface StandardInputProps extends TextInputProps {
  label?: string;
  icon?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  disabled?: boolean;
  containerStyle?: any;
}

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
  ...textInputProps
}) => {
  const { colors } = useTheme();
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  const getContainerStyle = () => {
    const baseStyle: any[] = [
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
        opacity: 0.6,
      });
    }
    
    return baseStyle;
  };

  const getIconColor = () => {
    if (hasError) return colors.error;
    if (isFocused) return colors.primary;
    return colors.textTertiary;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            {label}
            {required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        </View>
      )}

      {/* Input Container */}
      <View style={getContainerStyle()}>
        {/* Icon */}
        {icon && (
          <MaterialCommunityIcons
            name={icon as any}
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
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          placeholderTextColor={colors.textTertiary}
        />

        {/* Secure Entry Toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.secureToggle}
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isSecureVisible ? 'Hide password' : 'Show password'}
          >
            <MaterialCommunityIcons
              name={isSecureVisible ? 'eye-off' : 'eye'}
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
            name="alert-circle"
            size={mobileIconSizes.tiny}
            color={colors.error}
            style={styles.messageIcon}
          />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <Text style={[styles.helperText, { color: colors.textTertiary }]}>{helperText}</Text>
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
  label: {
    ...mobileTypography.labelBold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: designTokens.borderRadius.lg,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  icon: {
    marginRight: 12,
  },
  iconMultiline: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    ...mobileTypography.bodyLarge,
    minHeight: 52,
  },
  secureToggle: {
    padding: designTokens.spacing.sm,
    marginLeft: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: designTokens.spacing.xs,
    marginLeft: designTokens.spacing.xs,
  },
  messageIcon: {
    marginRight: designTokens.spacing.xs,
  },
  errorText: {
    ...mobileTypography.caption,
    flex: 1,
  },
  helperText: {
    ...mobileTypography.caption,
    marginTop: designTokens.spacing.xs,
    marginLeft: designTokens.spacing.xs,
  },
});
