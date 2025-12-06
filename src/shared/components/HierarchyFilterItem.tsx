/**
 * HierarchyFilterItem
 * Reusable component for hierarchical organization filter selection
 * Used in ClubsManagement, UsersManagement, and other admin screens
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { designTokens, layoutConstants } from '../theme';
import { ICONS } from '../constants';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface HierarchyFilterItemProps {
  /** Label text for the filter section */
  label: string;
  /** Icon to display */
  icon: IconName;
  /** Available options to choose from */
  options: string[];
  /** Currently selected value */
  selectedValue: string;
  /** Callback when option is selected */
  onSelect: (value: string) => void;
  /** Theme colors */
  colors: {
    primary: string;
    success: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    surface: string;
  };
  /** Whether the section is disabled */
  disabled?: boolean;
  /** Style overrides */
  style?: ViewStyle;
}

/**
 * Renders a single hierarchy filter section with auto-select for single options
 */
export function HierarchyFilterItem({
  label,
  icon,
  options,
  selectedValue,
  onSelect,
  colors,
  disabled = false,
  style,
}: HierarchyFilterItemProps): React.JSX.Element | null {
  // If no options, don't render anything
  if (options.length === 0) {
    return null;
  }

  // Single option - show as auto-selected
  if (options.length === 1) {
    return (
      <View style={[styles.hierarchyItem, style]}>
        <MaterialCommunityIcons
          name={icon}
          size={designTokens.iconSize.sm}
          color={colors.primary}
        />
        <View style={styles.hierarchyInfo}>
          <Text style={[styles.hierarchyLabel, { color: colors.textSecondary }]}>{label}</Text>
          <Text style={[styles.hierarchyValue, { color: colors.textPrimary }]}>{options[0]}</Text>
        </View>
        <MaterialCommunityIcons
          name={ICONS.CHECK_CIRCLE as IconName}
          size={designTokens.iconSize.sm}
          color={colors.success}
        />
      </View>
    );
  }

  // Multiple options - show selectable list
  return (
    <View style={[styles.filterSection, style]}>
      <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>{label}</Text>
      {options.map((option) => {
        const isSelected = selectedValue === option;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterOption,
              { borderColor: colors.border },
              isSelected && [styles.filterOptionActive, { borderColor: colors.primary }],
            ]}
            onPress={() => !disabled && onSelect(option)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterOptionText,
                { color: colors.textPrimary },
                isSelected && [styles.filterOptionTextActive, { color: colors.primary }],
              ]}
            >
              {option}
            </Text>
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
  hierarchyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  hierarchyInfo: {
    flex: 1,
    marginLeft: designTokens.spacing.sm,
  },
  hierarchyLabel: {
    fontSize: designTokens.typography.fontSizes.xs,
    marginBottom: designTokens.spacing.xxs,
  },
  hierarchyValue: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: designTokens.spacing.md,
  },
  filterLabel: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: '500',
    marginBottom: designTokens.spacing.xs,
  },
  filterOption: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    padding: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: designTokens.borderWidth.thin,
    marginBottom: designTokens.spacing.xs,
  },
  filterOptionActive: {
    backgroundColor: `${designTokens.colors.primary}10`,
  },
  filterOptionText: {
    fontSize: designTokens.typography.fontSizes.sm,
  },
  filterOptionTextActive: {
    fontWeight: '600',
  },
});

export default HierarchyFilterItem;
