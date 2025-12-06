/**
 * StandardPicker Component
 * Consistent picker/select component used across all screens and roles
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileIconSizes, designTokens, layoutConstants } from '../theme';
import { A11Y_ROLE, ICONS, TEXT_LINES, FLEX } from '../constants';
import { SPACING, MATH } from '../constants/numbers';
import { Text } from './Text';

interface StandardPickerProps {
  label?: string;
  value: string;
  placeholder?: string;
  icon?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
  /** Accessibility hint for the picker (pass translated string from screen) */
  accessibilityHint?: string;
}

export const StandardPicker: React.FC<StandardPickerProps> = ({
  label,
  value,
  placeholder,
  icon,
  error,
  required,
  disabled,
  onPress,
  containerStyle,
  accessibilityHint,
}) => {
  const { colors } = useTheme();
  const displayPlaceholder = placeholder || '';
  const hasError = !!error;
  const hasValue = !!value;

  // Dynamic styles from theme
  const pickerContainerStyle = [
    styles.pickerContainer,
    {
      borderColor: colors.border,
      backgroundColor: colors.surfaceLight,
    },
    hasError && { borderColor: colors.error },
    disabled && {
      backgroundColor: colors.surfaceLight,
      opacity: designTokens.opacity.high,
    },
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text variant="label" weight="bold">
            {label}
            {required && <Text color="error"> *</Text>}
          </Text>
        </View>
      )}

      {/* Picker Button */}
      <TouchableOpacity
        style={pickerContainerStyle}
        onPress={onPress}
        disabled={disabled}
        accessible
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={label || displayPlaceholder}
        accessibilityHint={accessibilityHint}
      >
        {/* Icon */}
        {icon && (
          <MaterialCommunityIcons
            name={icon as typeof ICONS.CHECK}
            size={mobileIconSizes.medium}
            color={hasError ? colors.error : colors.textSecondary}
            style={styles.icon}
          />
        )}

        {/* Value/Placeholder */}
        <Text
          variant="bodyLarge"
          color={hasValue ? 'primary' : 'tertiary'}
          numberOfLines={TEXT_LINES.single}
          style={styles.pickerText}
        >
          {hasValue ? value : displayPlaceholder}
        </Text>

        {/* Chevron */}
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_DOWN}
          size={mobileIconSizes.medium}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <View style={styles.messageContainer}>
          <MaterialCommunityIcons
            name={ICONS.ALERT_CIRCLE}
            size={mobileIconSizes.tiny}
            color={colors.error}
            style={styles.messageIcon}
          />
          <Text variant="caption" color="error" style={styles.errorText}>
            {error}
          </Text>
        </View>
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
  pickerContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    borderWidth: designTokens.borderWidth.thin,
    borderRadius: designTokens.borderRadius.xl,
    paddingHorizontal: designTokens.spacing.md,
    minHeight: SPACING.FIFTY + MATH.HALF, // 52
  },
  icon: {
    marginRight: designTokens.spacing.md,
  },
  pickerText: {
    flex: FLEX.ONE,
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
});
