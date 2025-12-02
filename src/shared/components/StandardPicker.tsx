/**
 * StandardPicker Component
 * Consistent picker/select component used across all screens and roles
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DesignConstants } from '../theme/designConstants';
import { mobileTypography, mobileIconSizes } from '../theme';

interface StandardPickerProps {
  label?: string;
  value: string;
  placeholder?: string;
  icon?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onPress: () => void;
  containerStyle?: any;
}

export const StandardPicker: React.FC<StandardPickerProps> = ({
  label,
  value,
  placeholder = 'Select an option',
  icon,
  error,
  required,
  disabled,
  onPress,
  containerStyle,
}) => {
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
        accessibilityRole="button"
        accessibilityLabel={label || placeholder}
        accessibilityHint="Double tap to open selection"
      >
        {/* Icon */}
        {icon && (
          <MaterialCommunityIcons
            name={icon as any}
            size={mobileIconSizes.medium}
            color={hasError ? DesignConstants.colors.error : '#666'}
            style={styles.icon}
          />
        )}

        {/* Value/Placeholder */}
        <Text
          style={[
            styles.pickerText,
            !hasValue && styles.pickerTextPlaceholder,
          ]}
          numberOfLines={1}
        >
          {hasValue ? value : placeholder}
        </Text>

        {/* Chevron */}
        <MaterialCommunityIcons
          name="chevron-down"
          size={mobileIconSizes.medium}
          color="#666"
        />
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <View style={styles.messageContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={mobileIconSizes.tiny}
            color={DesignConstants.colors.error}
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
    marginBottom: DesignConstants.spacing.md,
  },
  labelContainer: {
    marginBottom: DesignConstants.spacing.sm,
  },
  label: {
    ...mobileTypography.labelBold,
    color: DesignConstants.colors.text.primary,
  },
  required: {
    color: DesignConstants.colors.error,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignConstants.colors.border.medium,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: DesignConstants.colors.background.secondary,
    minHeight: 52,
  },
  pickerContainerError: {
    borderColor: DesignConstants.colors.error,
  },
  pickerContainerDisabled: {
    backgroundColor: DesignConstants.colors.background.tertiary,
    opacity: 0.6,
  },
  icon: {
    marginRight: 12,
  },
  pickerText: {
    flex: 1,
    ...mobileTypography.bodyLarge,
    color: DesignConstants.colors.text.primary,
  },
  pickerTextPlaceholder: {
    color: DesignConstants.colors.text.tertiary,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DesignConstants.spacing.xs,
    marginLeft: DesignConstants.spacing.xs,
  },
  messageIcon: {
    marginRight: DesignConstants.spacing.xs,
  },
  errorText: {
    ...mobileTypography.caption,
    color: DesignConstants.colors.error,
    flex: 1,
  },
});

