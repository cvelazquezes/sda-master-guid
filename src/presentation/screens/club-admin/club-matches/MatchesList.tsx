import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createEmptyStyles } from './styles';
import { FILTER_STATUS, ICONS, MATH } from '../../../../shared/constants';
import { MatchCard } from '../../../components/features/MatchCard';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { Match } from '../../../../types';

type EmptyStylesType = ReturnType<typeof createEmptyStyles>;

type MatchesListProps = {
  matches: Match[];
  filterStatus: string;
  onViewDetails: (match: Match) => void;
  labels: {
    noActivities: string;
    generateHint: string;
    noFiltered: string;
  };
};

type EmptyStateProps = {
  filterStatus: string;
  labels: MatchesListProps['labels'];
  emptyStyles: EmptyStylesType;
};

function EmptyState({ filterStatus, labels, emptyStyles }: EmptyStateProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  const isAllFilter = filterStatus === FILTER_STATUS.ALL;
  const subtext = isAllFilter
    ? labels.generateHint
    : labels.noFiltered.replace('{status}', filterStatus);

  return (
    <View style={emptyStyles.container}>
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_HEART_OUTLINE}
        size={iconSizes['4xl'] * MATH.HALF}
        color={colors.textTertiary}
      />
      <Text style={emptyStyles.text}>{labels.noActivities}</Text>
      <Text style={emptyStyles.subtext}>{subtext}</Text>
    </View>
  );
}

export function MatchesList({
  matches,
  filterStatus,
  onViewDetails,
  labels,
}: MatchesListProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useTheme();

  const emptyStyles = useMemo(
    () => createEmptyStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  if (matches.length === 0) {
    return <EmptyState filterStatus={filterStatus} labels={labels} emptyStyles={emptyStyles} />;
  }

  return (
    <>
      {matches.map((match) => (
        <TouchableOpacity
          key={match.id}
          accessibilityRole="button"
          accessibilityLabel="View match details"
          onPress={(): void => onViewDetails(match)}
        >
          <MatchCard match={match} showActions={false} />
        </TouchableOpacity>
      ))}
    </>
  );
}
