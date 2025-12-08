import React, { useMemo } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FilterSection } from './FilterSection';
import { MatchDetailModal } from './MatchDetailModal';
import { MatchesList } from './MatchesList';
import { RoundsSection } from './RoundsSection';
import { StatsSection } from './StatsSection';
import { useClubMatches } from './useClubMatches';
import { FLEX } from '../../../../shared/constants';
import { PageHeader } from '../../../components/primitives';
import { useAuth } from '../../../state/AuthContext';
import { useTheme } from '../../../state/ThemeContext';

function useLabels(t: (key: string) => string): {
  stats: { overview: string; total: string; pending: string; scheduled: string; completed: string };
  filter: { all: string; pending: string; scheduled: string; completed: string; skipped: string };
  list: { noActivities: string; generateHint: string; noFiltered: string };
  modal: {
    title: string;
    subtitle: string;
    status: string;
    adminActions: string;
    notify: string;
    scheduled: string;
    completed: string;
    cancel: string;
  };
} {
  return {
    stats: {
      overview: t('screens.clubMatches.overview'),
      total: t('screens.clubMatches.totalMatches'),
      pending: t('screens.clubMatches.pending'),
      scheduled: t('screens.clubMatches.scheduled'),
      completed: t('screens.clubMatches.completed'),
    },
    filter: {
      all: t('screens.clubMatches.filterAll'),
      pending: t('screens.clubMatches.filterPending'),
      scheduled: t('screens.clubMatches.filterScheduled'),
      completed: t('screens.clubMatches.filterCompleted'),
      skipped: t('screens.clubMatches.filterSkipped'),
    },
    list: {
      noActivities: t('screens.clubMatches.noActivitiesFound'),
      generateHint: t('screens.clubMatches.generateFromDashboard'),
      noFiltered: t('screens.clubMatches.noFilteredActivities'),
    },
    modal: {
      title: t('screens.activities.activityDetails'),
      subtitle: t('screens.activities.manageActivity'),
      status: t('screens.clubMatches.currentStatus'),
      adminActions: t('screens.clubMatches.adminActions'),
      notify: t('screens.activities.notifyParticipants'),
      scheduled: t('screens.activities.markAsScheduled'),
      completed: t('screens.activities.markAsCompleted'),
      cancel: t('screens.activities.cancelMatch'),
    },
  };
}

const ClubMatchesScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors, spacing, borderWidth, typography } = useTheme();
  const data = useClubMatches(user?.clubId);
  const labels = useLabels(t);

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: FLEX.ONE,
          backgroundColor: colors.backgroundSecondary,
        },
        content: {
          padding: spacing.lg,
        },
      }),
    [colors, spacing]
  );

  const refreshControl = <RefreshControl refreshing={data.refreshing} onRefresh={data.onRefresh} />;

  return (
    <>
      <ScrollView style={dynamicStyles.container} refreshControl={refreshControl}>
        <PageHeader
          showActions
          title={t('screens.clubMatches.title')}
          subtitle={t('screens.clubMatches.subtitle')}
        />
        <StatsSection stats={data.stats} labels={labels.stats} />
        <RoundsSection
          matchRounds={data.matchRounds}
          title={t('screens.clubMatches.recentMatchRounds')}
        />
        <FilterSection
          currentFilter={data.filterStatus}
          title={t('screens.clubMatches.matches')}
          labels={labels.filter}
          onFilterChange={data.setFilterStatus}
        />
        <View style={dynamicStyles.content}>
          <MatchesList
            matches={data.filteredMatches}
            filterStatus={data.filterStatus}
            labels={labels.list}
            onViewDetails={data.handleViewMatchDetails}
          />
        </View>
      </ScrollView>
      <MatchDetailModal
        visible={data.detailModalVisible}
        match={data.selectedMatch}
        participants={data.matchParticipants}
        labels={labels.modal}
        onClose={data.closeModal}
        onNotify={data.handleNotifyMatch}
        onUpdateStatus={data.handleUpdateMatchStatus}
      />
    </>
  );
};

export default ClubMatchesScreen;
