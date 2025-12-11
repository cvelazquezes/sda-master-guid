import React, { useMemo } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createHierarchyPickerStyles } from './styles';
import { ICONS } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type HierarchyPickerProps = {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

export function HierarchyPicker({
  label,
  options,
  selectedValue,
  onSelect,
}: HierarchyPickerProps): React.JSX.Element {
  const { colors, spacing, radii, typography, iconSizes } = useTheme();

  const hierarchyPickerStyles = useMemo(
    () => createHierarchyPickerStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  return (
    <View style={hierarchyPickerStyles.container}>
      <Text style={hierarchyPickerStyles.label}>{label}</Text>
      <ScrollView style={hierarchyPickerStyles.optionsList}>
        {options.map((option) => {
          const isSelected = selectedValue === option;
          const iconName = isSelected ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK;
          const iconColor = isSelected ? colors.primary : colors.textSecondary;
          return (
            <TouchableOpacity
              key={option}
              style={[
                hierarchyPickerStyles.option,
                isSelected && hierarchyPickerStyles.optionSelected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option}
              onPress={(): void => onSelect(option)}
            >
              <MaterialCommunityIcons name={iconName} size={iconSizes.md} color={iconColor} />
              <Text style={hierarchyPickerStyles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
