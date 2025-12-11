import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { filterBySearch } from './orgUtils';
import { createFilterStyles } from './styles';
import { ICONS } from '../../../../shared/constants';
import { Text, Input } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type HierarchySelectorProps = {
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
  colors: { primary: string; success: string; textTertiary: string; textPrimary: string };
  t: (key: string) => string;
};

type FilterStylesType = ReturnType<typeof createFilterStyles>;

function SingleItem({
  title,
  icon,
  iconColor,
  levelLabel,
  value,
  successColor,
  filterStyles,
}: {
  title: string;
  icon: string;
  iconColor: string;
  levelLabel: string;
  value: string;
  successColor: string;
  filterStyles: FilterStylesType;
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
  _tertiary,
  textPrimary,
  filterStyles,
}: {
  title: string;
  icon: string;
  selectedValue: string;
  onClear: () => void;
  primary: string;
  _tertiary: string;
  textPrimary: string;
  filterStyles: FilterStylesType;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={filterStyles.section}>
      <View style={filterStyles.sectionHeader}>
        <Text style={filterStyles.sectionTitle}>{title}</Text>
      </View>
      <TouchableOpacity
        style={[filterStyles.option, filterStyles.optionActive]}
        accessibilityRole="button"
        accessibilityLabel="Clear selection"
        onPress={onClear}
      >
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
        <MaterialCommunityIcons name={ICONS.CLOSE_CIRCLE} size={iconSizes.md} color={textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

function ItemOption({
  item,
  icon,
  color,
  onSelect,
  filterStyles,
}: {
  item: string;
  icon: string;
  color: string;
  onSelect: () => void;
  filterStyles: FilterStylesType;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <TouchableOpacity
      key={item}
      style={filterStyles.option}
      accessibilityRole="radio"
      accessibilityLabel={item}
      onPress={onSelect}
    >
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
}: HierarchySelectorProps): React.JSX.Element | null {
  const { colors: themeColors, spacing, radii, typography } = useTheme();

  const filterStyles = useMemo(
    () => createFilterStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

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
        filterStyles={filterStyles}
      />
    );
  }
  if (selectedValue) {
    return (
      <SelectedItem
        title={title}
        icon={icon}
        selectedValue={selectedValue}
        primary={colors.primary}
        tertiary={colors.textTertiary}
        textPrimary={colors.textPrimary}
        filterStyles={filterStyles}
        onClear={onClear}
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
      <Input
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
            filterStyles={filterStyles}
            onSelect={(): void => onSelect(item)}
          />
        ))
      )}
    </View>
  );
}
