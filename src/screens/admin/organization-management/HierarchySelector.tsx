import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, StandardInput } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICONS } from '../../../shared/constants';
import { filterStyles } from './styles';
import { filterBySearch } from './orgUtils';

interface HierarchySelectorProps {
  title: string;
  icon: string;
  iconColor: string;
  items: string[];
  selectedValue: string;
  searchValue: string;
  onSearch: (s: string) => void;
  onSelect: (value: string) => void;
  onClear: () => void;
  searchPlaceholder: string;
  noResultsText: string;
  levelLabel: string;
  colors: { primary: string; success: string; textTertiary: string };
  t: (key: string) => string;
}

function SingleItem({
  title,
  icon,
  iconColor,
  levelLabel,
  value,
  successColor,
}: {
  title: string;
  icon: string;
  iconColor: string;
  levelLabel: string;
  value: string;
  successColor: string;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={filterStyles.section}>
      <View style={filterStyles.sectionHeader}>
        <Text style={filterStyles.sectionTitle}>{title}</Text>
      </View>
      <View style={filterStyles.hierarchyItem}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.EARTH}
          size={iconSizes.sm}
          color={iconColor}
        />
        <View style={filterStyles.hierarchyInfo}>
          <Text style={filterStyles.hierarchyLabel}>{levelLabel}</Text>
          <Text style={filterStyles.hierarchyValue}>{value}</Text>
        </View>
        <MaterialCommunityIcons
          name={ICONS.CHECK_CIRCLE}
          size={iconSizes.sm}
          color={successColor}
        />
      </View>
    </View>
  );
}

function SelectedItem({
  title,
  icon,
  selectedValue,
  onClear,
  primary,
  tertiary,
}: {
  title: string;
  icon: string;
  selectedValue: string;
  onClear: () => void;
  primary: string;
  tertiary: string;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={filterStyles.section}>
      <View style={filterStyles.sectionHeader}>
        <Text style={filterStyles.sectionTitle}>{title}</Text>
      </View>
      <TouchableOpacity style={[filterStyles.option, filterStyles.optionActive]} onPress={onClear}>
        <View style={filterStyles.optionContent}>
          <MaterialCommunityIcons
            name={icon as typeof ICONS.EARTH}
            size={iconSizes.md}
            color={primary}
          />
          <Text style={[filterStyles.optionText, filterStyles.optionTextActive]}>
            {selectedValue}
          </Text>
        </View>
        <MaterialCommunityIcons name={ICONS.CLOSE_CIRCLE} size={iconSizes.md} color={tertiary} />
      </TouchableOpacity>
    </View>
  );
}

function ItemOption({
  item,
  icon,
  color,
  onSelect,
}: {
  item: string;
  icon: string;
  color: string;
  onSelect: () => void;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <TouchableOpacity key={item} style={filterStyles.option} onPress={onSelect}>
      <View style={filterStyles.optionContent}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.EARTH}
          size={iconSizes.md}
          color={color}
        />
        <Text style={filterStyles.optionText}>{item}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function HierarchySelector({
  title,
  icon,
  iconColor,
  items,
  selectedValue,
  searchValue,
  onSearch,
  onSelect,
  onClear,
  searchPlaceholder,
  noResultsText,
  levelLabel,
  colors,
}: HierarchySelectorProps): React.JSX.Element {
  if (items.length === 0) {
    return null;
  }
  if (items.length === 1) {
    return (
      <SingleItem
        title={title}
        icon={icon}
        iconColor={iconColor}
        levelLabel={levelLabel}
        value={items[0]}
        successColor={colors.success}
      />
    );
  }
  if (selectedValue) {
    return (
      <SelectedItem
        title={title}
        icon={icon}
        selectedValue={selectedValue}
        onClear={onClear}
        primary={colors.primary}
        tertiary={colors.textTertiary}
      />
    );
  }

  const filtered = filterBySearch(items, searchValue);
  return (
    <View style={filterStyles.section}>
      <View style={filterStyles.sectionHeader}>
        <Text style={filterStyles.sectionTitle}>{title}</Text>
        {items.length > 1 && (
          <Text style={filterStyles.resultsCount}>
            {filtered.length} of {items.length}
          </Text>
        )}
      </View>
      <StandardInput
        placeholder={searchPlaceholder}
        icon={ICONS.MAGNIFY}
        value={searchValue}
        onChangeText={onSearch}
      />
      {filtered.length === 0 ? (
        <Text style={filterStyles.noResultsText}>{noResultsText}</Text>
      ) : (
        filtered.map((item) => (
          <ItemOption
            key={item}
            item={item}
            icon={icon}
            color={colors.textTertiary}
            onSelect={(): void => onSelect(item)}
          />
        ))
      )}
    </View>
  );
}
