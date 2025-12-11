import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createFilterStyles } from './styles';
import { ICONS } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type HierarchyFilterItemProps = {
  icon: string;
  label: string;
  values: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  colors: { primary: string; success: string };
};

function SingleValueItem({
  icon,
  label,
  value,
  colors,
  filterStyles,
}: {
  icon: string;
  label: string;
  value: string;
  colors: { primary: string; success: string };
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={filterStyles.hierarchyItem}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.EARTH}
        size={iconSizes.sm}
        color={colors.primary}
      />
      <View style={filterStyles.hierarchyInfo}>
        <Text style={filterStyles.label}>{label}</Text>
        <Text style={filterStyles.hierarchyValue}>{value}</Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHECK_CIRCLE}
        size={iconSizes.sm}
        color={colors.success}
      />
    </View>
  );
}

function ValueOption({
  value,
  selected,
  onSelect,
  color,
  filterStyles,
}: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  color: string;
  filterStyles: ReturnType<typeof createFilterStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <TouchableOpacity
      style={[filterStyles.option, selected && filterStyles.optionActive]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={value}
      onPress={onSelect}
    >
      <Text style={[filterStyles.optionText, selected && filterStyles.optionTextActive]}>
        {value}
      </Text>
      {selected && <MaterialCommunityIcons name={ICONS.CHECK} size={iconSizes.md} color={color} />}
    </TouchableOpacity>
  );
}

export function HierarchyFilterItem({
  icon,
  label,
  values,
  selectedValue,
  onSelect,
  colors,
}: HierarchyFilterItemProps): React.JSX.Element | null {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const filterStyles = useMemo(
    () => createFilterStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  if (values.length === 0) {
    return null;
  }
  if (values.length === 1) {
    return (
      <SingleValueItem
        icon={icon}
        label={label}
        value={values[0]}
        colors={colors}
        filterStyles={filterStyles}
      />
    );
  }
  return (
    <View>
      <Text style={filterStyles.label}>{label}</Text>
      {values.map((v) => (
        <ValueOption
          key={v}
          value={v}
          selected={selectedValue === v}
          color={colors.primary}
          filterStyles={filterStyles}
          onSelect={(): void => onSelect(v)}
        />
      ))}
    </View>
  );
}
