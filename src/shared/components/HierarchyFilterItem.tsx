/**
 * HierarchyFilterItem
 * Reusable component for hierarchical organization filter selection
 * Used in ClubsManagement, UsersManagement, and other admin screens
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens, layoutConstants } from '../theme';
import { ICONS, FLEX, TEXT_COLOR, TEXT_VARIANT, TEXT_WEIGHT, IconName } from '../constants';

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
  const { colors: themeColors } = useTheme();

  // If no options, don't render anything
  if (options.length === 0) {
    return null;
  }

  // Single option - show as auto-selected
  if (options.length === 1) {
    return (
      <View style={[styles.hierarchyItem, { backgroundColor: themeColors.surfaceLight }, style]}>
        <MaterialCommunityIcons
          name={icon}
          size={designTokens.iconSize.sm}
          color={colors.primary}
        />
        <View style={styles.hierarchyInfo}>
          <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.SECONDARY}>
            {label}
          </Text>
          <Text variant={TEXT_VARIANT.BODY_SMALL} weight={TEXT_WEIGHT.SEMIBOLD}>
            {options[0]}
          </Text>
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
      <Text variant={TEXT_VARIANT.LABEL} color={TEXT_COLOR.SECONDARY} style={styles.filterLabel}>
        {label}
      </Text>
      {options.map((option) => {
        const isSelected = selectedValue === option;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterOption,
              { borderColor: colors.border },
              isSelected && [
                styles.filterOptionActive,
                { borderColor: colors.primary, backgroundColor: `${themeColors.primary}10` },
              ],
            ]}
            onPress={() => !disabled && onSelect(option)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text
              variant={TEXT_VARIANT.BODY_SMALL}
              weight={isSelected ? TEXT_WEIGHT.SEMIBOLD : TEXT_WEIGHT.NORMAL}
              style={{ color: isSelected ? colors.primary : colors.textPrimary }}
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
    // backgroundColor set dynamically via useTheme
  },
  hierarchyInfo: {
    flex: FLEX.ONE,
    marginLeft: designTokens.spacing.sm,
  },
  filterSection: {
    marginBottom: designTokens.spacing.md,
  },
  filterLabel: {
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
    // backgroundColor set dynamically via useTheme
  },
});

export default HierarchyFilterItem;
