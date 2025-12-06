import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import {
  mobileTypography,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../../shared/theme';
import { ICONS, dimensionValues } from '../../../shared/constants';

interface HierarchyPickerProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function HierarchyPicker({
  label,
  options,
  selectedValue,
  onSelect,
}: HierarchyPickerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView style={styles.optionsList}>
        {options.map((option) => {
          const isSelected = selectedValue === option;
          const iconName = isSelected ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK;
          const iconColor = isSelected
            ? designTokens.colors.primary
            : designTokens.colors.textSecondary;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onSelect(option)}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={mobileIconSizes.medium}
                color={iconColor}
              />
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.md,
  },
  label: {
    ...mobileTypography.bodyLargeBold,
    marginBottom: designTokens.spacing.md,
  },
  optionsList: {
    maxHeight: dimensionValues.maxHeight.listSmall,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderMedium,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  option: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  optionSelected: {
    backgroundColor: designTokens.colors.primaryLight,
  },
  optionText: {
    marginLeft: designTokens.spacing.md,
    ...mobileTypography.bodyLarge,
  },
});
