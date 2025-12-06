import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../../../shared/components';
import { MatchStatus } from '../../../types';
import { mobileTypography, designTokens, layoutConstants } from '../../../shared/theme';
import { FILTER_STATUS } from '../../../shared/constants';

interface FilterSectionProps {
  currentFilter: MatchStatus | typeof FILTER_STATUS.ALL;
  onFilterChange: (filter: MatchStatus | typeof FILTER_STATUS.ALL) => void;
  title: string;
  labels: {
    all: string;
    pending: string;
    scheduled: string;
    completed: string;
    skipped: string;
  };
}

type FilterValue = MatchStatus | typeof FILTER_STATUS.ALL;

interface FilterConfig {
  label: string;
  value: FilterValue;
}

function createFilters(labels: FilterSectionProps['labels']): FilterConfig[] {
  return [
    { label: labels.all, value: FILTER_STATUS.ALL },
    { label: labels.pending, value: MatchStatus.PENDING },
    { label: labels.scheduled, value: MatchStatus.SCHEDULED },
    { label: labels.completed, value: MatchStatus.COMPLETED },
    { label: labels.skipped, value: MatchStatus.SKIPPED },
  ];
}

export function FilterSection({
  currentFilter,
  onFilterChange,
  title,
  labels,
}: FilterSectionProps): React.JSX.Element {
  const filters = createFilters(labels);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter) => {
          const isActive = currentFilter === filter.value;
          const chipStyle = [styles.filterChip, isActive && styles.filterChipActive];
          const textStyle = [styles.filterChipText, isActive && styles.filterChipTextActive];
          return (
            <TouchableOpacity
              key={filter.value}
              style={chipStyle}
              onPress={(): void => onFilterChange(filter.value)}
            >
              <Text style={textStyle}>{filter.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginTop: designTokens.spacing.sm,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.lg,
  },
  filterScroll: {
    flexDirection: layoutConstants.flexDirection.row,
  },
  filterChip: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius['2xl'],
    marginRight: designTokens.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: designTokens.colors.primary,
  },
  filterChipText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textSecondary,
  },
  filterChipTextActive: {
    color: designTokens.colors.textInverse,
  },
});
