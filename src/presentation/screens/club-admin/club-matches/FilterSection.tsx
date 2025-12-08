import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { createFilterSectionStyles } from './styles';
import { Text } from '../../../components/primitives';
import { MatchStatus } from '../../../../types';
import { useTheme } from '../../../state/ThemeContext';
import { FILTER_STATUS } from '../../../../shared/constants';

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
  const { colors, spacing, radii, typography } = useTheme();
  const filters = createFilters(labels);

  const styles = useMemo(
    () => createFilterSectionStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

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
