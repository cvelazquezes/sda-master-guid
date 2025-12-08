import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { Match } from '../../../../types';
import { MatchCard } from '../../../components/features/MatchCard';
import {
  mobileTypography,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../../theme';
import { FILTER_STATUS, ICONS, MATH } from '../../../../shared/constants';

interface MatchesListProps {
  matches: Match[];
  filterStatus: string;
  onViewDetails: (match: Match) => void;
  labels: {
    noActivities: string;
    generateHint: string;
    noFiltered: string;
  };
}

interface EmptyStateProps {
  filterStatus: string;
  labels: MatchesListProps['labels'];
}

function EmptyState({ filterStatus, labels }: EmptyStateProps): React.JSX.Element {
  const isAllFilter = filterStatus === FILTER_STATUS.ALL;
  const subtext = isAllFilter
    ? labels.generateHint
    : labels.noFiltered.replace('{status}', filterStatus);

  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_HEART_OUTLINE}
        size={mobileIconSizes.xxlarge * MATH.HALF}
        color={designTokens.colors.textTertiary}
      />
      <Text style={styles.emptyText}>{labels.noActivities}</Text>
      <Text style={styles.emptySubtext}>{subtext}</Text>
    </View>
  );
}

export function MatchesList({
  matches,
  filterStatus,
  onViewDetails,
  labels,
}: MatchesListProps): React.JSX.Element {
  if (matches.length === 0) {
    return <EmptyState filterStatus={filterStatus} labels={labels} />;
  }

  return (
    <>
      {matches.map((match) => (
        <TouchableOpacity key={match.id} onPress={(): void => onViewDetails(match)}>
          <MatchCard match={match} showActions={false} />
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing['4xl'],
    marginTop: designTokens.spacing['4xl'],
  },
  emptyText: {
    ...mobileTypography.heading3,
    marginTop: designTokens.spacing.lg,
  },
  emptySubtext: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
  },
});
