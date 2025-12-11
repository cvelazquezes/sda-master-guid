/**
 * StandardPicker Component
 * Consistent picker/select component used across all screens and roles
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import {
  A11Y_ROLE,
  EMPTY_VALUE,
  ICONS,
  TEXT_LINES,
  FLEX,
  TEXT_VARIANT,
  TEXT_WEIGHT,
  TEXT_COLOR,
} from '../../../shared/constants';
import { SPACING, MATH } from '../../../shared/constants/numbers';
import { useTheme } from '../../state/ThemeContext';
import { mobileIconSizes, designTokens, layoutConstants } from '../../theme';

type StandardPickerProps = {
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
};

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
  const displayPlaceholder = placeholder || EMPTY_VALUE;
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
          <Text variant={TEXT_VARIANT.LABEL} weight={TEXT_WEIGHT.BOLD}>
            {label}
            {required && <Text color={TEXT_COLOR.ERROR}> *</Text>}
          </Text>
        </View>
      )}

      {/* Picker Button */}
      <TouchableOpacity
        accessible
        style={pickerContainerStyle}
        disabled={disabled}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={label || displayPlaceholder}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
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
          variant={TEXT_VARIANT.BODY_LARGE}
          color={hasValue ? TEXT_COLOR.PRIMARY : TEXT_COLOR.TERTIARY}
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
          <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.ERROR} style={styles.errorText}>
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
