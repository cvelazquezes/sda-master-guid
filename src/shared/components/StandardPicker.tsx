/**
 * StandardPicker Component
 * Consistent picker/select component used across all screens and roles
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileTypography, mobileIconSizes, designTokens, layoutConstants } from '../theme';
import { A11Y_ROLE, ICONS, TEXT_LINES, flexValues } from '../constants';

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
}) => {
  const { t } = useTranslation();
  const displayPlaceholder = placeholder || t('placeholders.selectOption');
  const { colors } = useTheme();
  const hasError = !!error;
  const hasValue = !!value;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      {/* Picker Button */}
      <TouchableOpacity
        style={[
          styles.pickerContainer,
          hasError && styles.pickerContainerError,
          disabled && styles.pickerContainerDisabled,
        ]}
        onPress={onPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={label || displayPlaceholder}
        accessibilityHint={t('accessibility.selectOption')}
      >
        {/* Icon */}
        {icon && (
          <MaterialCommunityIcons
            name={icon as typeof ICONS.CHECK}
            size={mobileIconSizes.medium}
            color={hasError ? designTokens.colors.error : colors.textSecondary}
            style={styles.icon}
          />
        )}

        {/* Value/Placeholder */}
        <Text
          style={[styles.pickerText, !hasValue && styles.pickerTextPlaceholder]}
          numberOfLines={TEXT_LINES.single}
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
            color={designTokens.colors.error}
            style={styles.messageIcon}
          />
          <Text style={styles.errorText}>{error}</Text>
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
  label: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.text.primary,
  },
  required: {
    color: designTokens.colors.error,
  },
  pickerContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.border.medium,
    borderRadius: designTokens.borderRadius.xl,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.background.secondary,
    minHeight: 52,
  },
  pickerContainerError: {
    borderColor: designTokens.colors.error,
  },
  pickerContainerDisabled: {
    backgroundColor: designTokens.colors.background.tertiary,
    opacity: designTokens.opacity.high,
  },
  icon: {
    marginRight: designTokens.spacing.md,
  },
  pickerText: {
    flex: flexValues.one,
    ...mobileTypography.bodyLarge,
    color: designTokens.colors.text.primary,
  },
  pickerTextPlaceholder: {
    color: designTokens.colors.text.tertiary,
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
    ...mobileTypography.caption,
    color: designTokens.colors.error,
    flex: flexValues.one,
  },
});
