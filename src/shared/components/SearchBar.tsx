/**
 * SearchBar Component
 * Reusable search input with optional filter button
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileTypography, designTokens, layoutConstants } from '../theme';
import { A11Y_ROLE, EMPTY_VALUE, ICONS, FLEX, TEXT_VARIANT, TEXT_WEIGHT } from '../constants';
import { Text } from './Text';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  filterActive?: boolean;
  style?: ViewStyle;
  testID?: string;
  /** Accessibility label for search input (pass translated string from screen) */
  searchAccessibilityLabel?: string;
  /** Accessibility label for filter button (pass translated string from screen) */
  filterAccessibilityLabel?: string;
  /** Accessibility label for clear button (pass translated string from screen) */
  clearAccessibilityLabel?: string;
  /** Label text for filter button (pass translated string from screen) */
  filterLabel?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
  onFilterPress,
  filterActive = false,
  style,
  testID,
  searchAccessibilityLabel,
  filterAccessibilityLabel,
  clearAccessibilityLabel,
  filterLabel,
}) => {
  const { colors } = useTheme();
  const displayPlaceholder = placeholder || '';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderBottomColor: colors.border },
        style,
      ]}
      testID={testID}
    >
      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surfaceLight }]}>
        <MaterialCommunityIcons
          name={ICONS.MAGNIFY}
          size={designTokens.icon.sizes.md}
          color={colors.textTertiary}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder={displayPlaceholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textTertiary}
          accessible
          accessibilityLabel={searchAccessibilityLabel}
          accessibilityHint={displayPlaceholder}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText(EMPTY_VALUE)}
            accessible
            accessibilityRole={A11Y_ROLE.BUTTON}
            accessibilityLabel={clearAccessibilityLabel}
          >
            <MaterialCommunityIcons
              name={ICONS.CLOSE_CIRCLE}
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
          accessible
          accessibilityRole={A11Y_ROLE.BUTTON}
          accessibilityLabel={filterAccessibilityLabel}
          accessibilityState={{ selected: filterActive }}
        >
          <MaterialCommunityIcons
            name={ICONS.FILTER_VARIANT}
            size={designTokens.icon.sizes.md}
            color={colors.primary}
          />
          <Text
            variant={TEXT_VARIANT.LABEL}
            weight={TEXT_WEIGHT.BOLD}
            style={{ color: colors.primary }}
          >
            {filterLabel}
          </Text>
          {filterActive && <View style={[styles.filterBadge, { backgroundColor: colors.error }]} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  searchContainer: {
    flex: FLEX.ONE,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    borderRadius: designTokens.borderRadius.lg,
    paddingHorizontal: designTokens.spacing.md,
    height: designTokens.touchTarget.comfortable,
    gap: designTokens.spacing.sm,
  },
  searchInput: {
    flex: FLEX.ONE,
    ...mobileTypography.bodyLarge,
  },
  filterButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    borderRadius: designTokens.borderRadius.lg,
    paddingHorizontal: designTokens.spacing.lg,
    height: designTokens.touchTarget.comfortable,
    gap: designTokens.spacing.sm,
    position: layoutConstants.position.relative,
  },
  filterBadge: {
    position: layoutConstants.position.absolute,
    top: designTokens.spacing.sm,
    right: designTokens.spacing.sm,
    width: designTokens.componentSizes.indicator.sm,
    height: designTokens.componentSizes.indicator.sm,
    borderRadius: designTokens.borderRadius.xs,
  },
});

export default SearchBar;
