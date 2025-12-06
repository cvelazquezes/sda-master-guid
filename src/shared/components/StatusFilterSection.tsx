/**
 * StatusFilterSection
 * Reusable component for status filter selection (All/Active/Inactive)
 * Used in ClubsManagement, UsersManagement, and other admin screens
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { designTokens, layoutConstants } from '../theme';
import { ICONS, FILTER_STATUS } from '../constants';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type StatusValue =
  | typeof FILTER_STATUS.ALL
  | typeof FILTER_STATUS.ACTIVE
  | typeof FILTER_STATUS.INACTIVE;

interface StatusOption {
  value: StatusValue;
  label: string;
  icon: IconName;
  activeColor?: string;
}

interface StatusFilterSectionProps {
  /** Section label */
  label: string;
  /** Currently selected status */
  selectedStatus: StatusValue;
  /** Callback when status is selected */
  onSelect: (status: StatusValue) => void;
  /** Theme colors */
  colors: {
    primary: string;
    success: string;
    error: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  /** Custom options (optional, uses defaults if not provided) */
  options?: StatusOption[];
  /** Style overrides */
  style?: ViewStyle;
}

const DEFAULT_ICONS: Record<StatusValue, IconName> = {
  [FILTER_STATUS.ALL]: ICONS.VIEW_LIST as IconName,
  [FILTER_STATUS.ACTIVE]: ICONS.CHECK_CIRCLE as IconName,
  [FILTER_STATUS.INACTIVE]: ICONS.CLOSE_CIRCLE as IconName,
};

/**
 * Renders a status filter section with All/Active/Inactive options
 */
export function StatusFilterSection({
  label,
  selectedStatus,
  onSelect,
  colors,
  options,
  style,
}: StatusFilterSectionProps): React.JSX.Element {
  const defaultOptions: StatusOption[] = [
    { value: FILTER_STATUS.ALL, label: 'All', icon: DEFAULT_ICONS[FILTER_STATUS.ALL] },
    {
      value: FILTER_STATUS.ACTIVE,
      label: 'Active',
      icon: DEFAULT_ICONS[FILTER_STATUS.ACTIVE],
      activeColor: colors.success,
    },
    {
      value: FILTER_STATUS.INACTIVE,
      label: 'Inactive',
      icon: DEFAULT_ICONS[FILTER_STATUS.INACTIVE],
      activeColor: colors.error,
    },
  ];

  const statusOptions = options || defaultOptions;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      {statusOptions.map((option) => {
        const isSelected = selectedStatus === option.value;
        const iconColor = isSelected ? colors.primary : option.activeColor || colors.textSecondary;

        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              { borderColor: colors.border },
              isSelected && [styles.optionActive, { borderColor: colors.primary }],
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <MaterialCommunityIcons
                name={option.icon}
                size={designTokens.iconSize.md}
                color={iconColor}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: colors.textPrimary },
                  isSelected && [styles.optionTextActive, { color: colors.primary }],
                ]}
              >
                {option.label}
              </Text>
            </View>
            {isSelected && (
              <MaterialCommunityIcons
                name={ICONS.CHECK as IconName}
                size={designTokens.iconSize.md}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.md,
  },
  label: {
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: '500',
    marginBottom: designTokens.spacing.xs,
  },
  option: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    padding: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: designTokens.borderWidth.thin,
    marginBottom: designTokens.spacing.xs,
  },
  optionActive: {
    backgroundColor: `${designTokens.colors.primary}10`,
  },
  optionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  optionText: {
    fontSize: designTokens.typography.fontSize.sm,
  },
  optionTextActive: {
    fontWeight: '600',
  },
});

export default StatusFilterSection;
