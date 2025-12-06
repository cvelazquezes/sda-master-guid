import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { designTokens } from '../../../shared/theme';
import { ICONS } from '../../../shared/constants';
import { filterStyles } from './styles';

interface HierarchyFilterItemProps {
  icon: string;
  label: string;
  values: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  colors: { primary: string; success: string };
}

function SingleValueItem({
  icon,
  label,
  value,
  colors,
}: {
  icon: string;
  label: string;
  value: string;
  colors: { primary: string; success: string };
}): React.JSX.Element {
  return (
    <View style={filterStyles.hierarchyItem}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.EARTH}
        size={designTokens.iconSize.sm}
        color={colors.primary}
      />
      <View style={filterStyles.hierarchyInfo}>
        <Text style={filterStyles.label}>{label}</Text>
        <Text style={filterStyles.hierarchyValue}>{value}</Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHECK_CIRCLE}
        size={designTokens.iconSize.sm}
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
}: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  color: string;
}): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[filterStyles.option, selected && filterStyles.optionActive]}
      onPress={onSelect}
    >
      <Text style={[filterStyles.optionText, selected && filterStyles.optionTextActive]}>
        {value}
      </Text>
      {selected && (
        <MaterialCommunityIcons name={ICONS.CHECK} size={designTokens.iconSize.md} color={color} />
      )}
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
  if (values.length === 0) {
    return null;
  }
  if (values.length === 1) {
    return <SingleValueItem icon={icon} label={label} value={values[0]} colors={colors} />;
  }
  return (
    <View>
      <Text style={filterStyles.label}>{label}</Text>
      {values.map((v) => (
        <ValueOption
          key={v}
          value={v}
          selected={selectedValue === v}
          onSelect={(): void => onSelect(v)}
          color={colors.primary}
        />
      ))}
    </View>
  );
}
