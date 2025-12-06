import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../shared/components';
import { useAuth } from '../../../context/AuthContext';
import { mobileTypography, designTokens } from '../../../shared/theme';
import { FLEX } from '../../../shared/constants';
import { useClubMatches } from './useClubMatches';
import { StatsSection } from './StatsSection';
import { RoundsSection } from './RoundsSection';
import { FilterSection } from './FilterSection';
import { MatchesList } from './MatchesList';
import { MatchDetailModal } from './MatchDetailModal';

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
  const data = useClubMatches(user?.clubId);
  const labels = useLabels(t);

  const refreshControl = <RefreshControl refreshing={data.refreshing} onRefresh={data.onRefresh} />;

  return (
    <>
      <ScrollView style={styles.container} refreshControl={refreshControl}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('screens.clubMatches.title')}</Text>
          <Text style={styles.subtitle}>{t('screens.clubMatches.subtitle')}</Text>
        </View>
        <StatsSection stats={data.stats} labels={labels.stats} />
        <RoundsSection
          matchRounds={data.matchRounds}
          title={t('screens.clubMatches.recentMatchRounds')}
        />
        <FilterSection
          currentFilter={data.filterStatus}
          onFilterChange={data.setFilterStatus}
          title={t('screens.clubMatches.matches')}
          labels={labels.filter}
        />
        <View style={styles.content}>
          <MatchesList
            matches={data.filteredMatches}
            filterStatus={data.filterStatus}
            onViewDetails={data.handleViewMatchDetails}
            labels={labels.list}
          />
        </View>
      </ScrollView>
      <MatchDetailModal
        visible={data.detailModalVisible}
        match={data.selectedMatch}
        participants={data.matchParticipants}
        onClose={data.closeModal}
        onNotify={data.handleNotifyMatch}
        onUpdateStatus={data.handleUpdateMatchStatus}
        labels={labels.modal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.ONE,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  header: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.xl,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  title: {
    ...mobileTypography.displayMedium,
  },
  subtitle: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xs,
  },
  content: {
    padding: designTokens.spacing.lg,
  },
});

export default ClubMatchesScreen;
