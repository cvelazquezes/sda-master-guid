/**
 * StatusFilterSection
 * Reusable component for status filter selection (All/Active/Inactive)
 * Used in ClubsManagement, UsersManagement, and other admin screens
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import {
  ICONS,
  FILTER_STATUS,
  FILTER_STATUS_LABEL,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
  type IconName,
} from '../../../shared/constants';
import { useTheme } from '../../state/ThemeContext';
import { designTokens, layoutConstants } from '../../theme';

type StatusValue =
  | typeof FILTER_STATUS.ALL
  | typeof FILTER_STATUS.ACTIVE
  | typeof FILTER_STATUS.INACTIVE;

type StatusOption = {
  value: StatusValue;
  label: string;
  icon: IconName;
  activeColor?: string;
};

type StatusFilterSectionProps = {
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
};

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
  const { colors: themeColors } = useTheme();

  const defaultOptions: StatusOption[] = [
    {
      value: FILTER_STATUS.ALL,
      label: FILTER_STATUS_LABEL.ALL,
      icon: DEFAULT_ICONS[FILTER_STATUS.ALL],
    },
    {
      value: FILTER_STATUS.ACTIVE,
      label: FILTER_STATUS_LABEL.ACTIVE,
      icon: DEFAULT_ICONS[FILTER_STATUS.ACTIVE],
      activeColor: colors.success,
    },
    {
      value: FILTER_STATUS.INACTIVE,
      label: FILTER_STATUS_LABEL.INACTIVE,
      icon: DEFAULT_ICONS[FILTER_STATUS.INACTIVE],
      activeColor: colors.error,
    },
  ];

  const statusOptions = options || defaultOptions;

  return (
    <View style={[styles.container, style]}>
      <Text variant={TEXT_VARIANT.LABEL} color={TEXT_COLOR.SECONDARY} style={styles.label}>
        {label}
      </Text>
      {statusOptions.map((option) => {
        const isSelected = selectedStatus === option.value;
        const iconColor = isSelected ? colors.primary : option.activeColor || colors.textSecondary;

        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              { borderColor: colors.border },
              isSelected && [
                styles.optionActive,
                { borderColor: colors.primary, backgroundColor: `${themeColors.primary}10` },
              ],
            ]}
            activeOpacity={0.7}
            onPress={() => onSelect(option.value)}
          >
            <View style={styles.optionContent}>
              <MaterialCommunityIcons
                name={option.icon}
                size={designTokens.iconSize.md}
                color={iconColor}
              />
              <Text
                variant={TEXT_VARIANT.BODY_SMALL}
                weight={isSelected ? TEXT_WEIGHT.SEMIBOLD : TEXT_WEIGHT.NORMAL}
                style={{ color: colors.textPrimary }}
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
    // backgroundColor set dynamically via useTheme
  },
  optionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
});

export default StatusFilterSection;
