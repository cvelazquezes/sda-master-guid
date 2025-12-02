/**
 * SearchBar Component
 * Reusable search input with optional filter button
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { mobileTypography } from '../theme/mobileTypography';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  filterActive?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFilterPress,
  filterActive = false,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }, style]} testID={testID}>
      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surfaceLight }]}>
        <MaterialCommunityIcons
          name="magnify"
          size={designTokens.icon.sizes.md}
          color={colors.textTertiary}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textTertiary}
          accessible={true}
          accessibilityLabel="Search input"
          accessibilityHint={placeholder}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={designTokens.icon.sizes.md}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
      {onFilterPress && (
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primaryAlpha10 }]}
          onPress={onFilterPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
          accessibilityState={{ selected: filterActive }}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={designTokens.icon.sizes.md}
            color={colors.primary}
          />
          <Text style={[styles.filterButtonText, { color: colors.primary }]}>Filters</Text>
          {filterActive && <View style={[styles.filterBadge, { backgroundColor: colors.error }]} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: designTokens.borderRadius.lg,
    paddingHorizontal: designTokens.spacing.md,
    height: designTokens.touchTarget.comfortable,
    gap: designTokens.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...mobileTypography.bodyLarge,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: designTokens.borderRadius.lg,
    paddingHorizontal: designTokens.spacing.lg,
    height: designTokens.touchTarget.comfortable,
    gap: 6,
    position: 'relative',
  },
  filterButtonText: {
    ...mobileTypography.labelBold,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: designTokens.borderRadius.xs,
  },
});

export default SearchBar;

