/**
 * Club Activities Screen (Club Admin)
 * Comprehensive social activity management for club admins
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { matchService } from '../../services/matchService';
import { userService } from '../../services/userService';
import { Match, MatchStatus, User, MatchRound } from '../../types';
import { MatchCard } from '../../components/MatchCard';
import { StandardModal } from '../../shared/components/StandardModal';
import { StandardButton } from '../../shared/components/StandardButton';
import {
  mobileTypography,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../shared/theme';
import { format } from 'date-fns';
import { logger } from '../../shared/utils/logger';
import {
  ALERT_BUTTON_STYLE,
  COMPONENT_VARIANT,
  DATE_FORMATS,
  EMPTY_VALUE,
  EXTERNAL_URLS,
  FILTER_STATUS,
  ICONS,
  LOG_MESSAGES,
  MESSAGES,
  ROUND_STATUS,
  VALIDATION,
  flexValues,
} from '../../shared/constants';

const ClubMatchesScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchRounds, setMatchRounds] = useState<MatchRound[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchParticipants, setMatchParticipants] = useState<User[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<MatchStatus | typeof FILTER_STATUS.ALL>(
    FILTER_STATUS.ALL
  );

  useEffect(() => {
    if (user?.clubId) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    applyFilter();
  }, [matches, filterStatus]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      const [matchesData, roundsData] = await Promise.all([
        matchService.getClubMatches(user.clubId),
        matchService.getMatchRounds(user.clubId),
      ]);
      setMatches(
        matchesData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setMatchRounds(
        roundsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_ACTIVITIES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const applyFilter = () => {
    if (filterStatus === FILTER_STATUS.ALL) {
      setFilteredMatches(matches);
    } else {
      setFilteredMatches(matches.filter((m) => m.status === filterStatus));
    }
  };

  const handleViewMatchDetails = async (match: Match) => {
    setSelectedMatch(match);
    setDetailModalVisible(true);

    try {
      const participants = await Promise.all(
        match.participants.map((userId) => userService.getUser(userId))
      );
      setMatchParticipants(participants);
    } catch (error) {
      logger.error(LOG_MESSAGES.SCREENS.CLUB_MATCHES.FAILED_TO_LOAD_PARTICIPANTS, error as Error);
    }
  };

  const handleNotifyMatch = (match: Match) => {
    Alert.alert(
      MESSAGES.TITLES.NOTIFY_PARTICIPANTS,
      MESSAGES.WARNINGS.NOTIFY_PARTICIPANTS_MESSAGE,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: 'Send',
          onPress: async () => {
            try {
              const participants = await Promise.all(
                match.participants.map((userId) => userService.getUser(userId))
              );

              const phoneNumbers = participants
                .filter((p) => p.whatsappNumber)
                .map((p) =>
                  p.whatsappNumber.replace(VALIDATION.WHATSAPP.STRIP_NON_DIGITS, EMPTY_VALUE)
                )
                .join(',');

              if (phoneNumbers) {
                const message = t('screens.clubMatches.whatsappGroupMessage');
                const url = `${EXTERNAL_URLS.WHATSAPP_GROUP}?text=${encodeURIComponent(message)}&phone=${phoneNumbers}`;
                Linking.openURL(url);
              }
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_SEND_NOTIFICATION);
            }
          },
        },
      ]
    );
  };

  const handleUpdateMatchStatus = async (matchId: string, status: MatchStatus) => {
    try {
      await matchService.updateMatchStatus(matchId, status);
      loadData();
      setDetailModalVisible(false);
      Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.MATCH_STATUS_UPDATED);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_MATCH_STATUS);
    }
  };

  const getStatusConfig = (status: MatchStatus) => {
    return designTokens.status[status] || designTokens.status.pending;
  };

  const getStatusStats = () => {
    return {
      total: matches.length,
      pending: matches.filter((m) => m.status === MatchStatus.PENDING).length,
      scheduled: matches.filter((m) => m.status === MatchStatus.SCHEDULED).length,
      completed: matches.filter((m) => m.status === MatchStatus.COMPLETED).length,
      skipped: matches.filter((m) => m.status === MatchStatus.SKIPPED).length,
    };
  };

  const stats = getStatusStats();

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('screens.clubMatches.title')}</Text>
          <Text style={styles.subtitle}>{t('screens.clubMatches.subtitle')}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>{t('screens.clubMatches.overview')}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>{t('screens.clubMatches.totalMatches')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: designTokens.colors.warning }]}>
                {stats.pending}
              </Text>
              <Text style={styles.statLabel}>{t('screens.clubMatches.pending')}</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: designTokens.colors.info }]}>
                {stats.scheduled}
              </Text>
              <Text style={styles.statLabel}>{t('screens.clubMatches.scheduled')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: designTokens.colors.success }]}>
                {stats.completed}
              </Text>
              <Text style={styles.statLabel}>{t('screens.clubMatches.completed')}</Text>
            </View>
          </View>
        </View>

        {/* Match Rounds */}
        {matchRounds.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('screens.clubMatches.recentMatchRounds')}</Text>
            {matchRounds.slice(0, 3).map((round) => (
              <View key={round.id} style={styles.roundCard}>
                <View style={styles.roundHeader}>
                  <View>
                    <Text style={styles.roundTitle}>Round {round.id}</Text>
                    <Text style={styles.roundDate}>
                      Created{' '}
                      {format(new Date(round.createdAt), DATE_FORMATS.DATE_FNS_DATE_DISPLAY)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.roundStatusBadge,
                      {
                        backgroundColor:
                          round.status === ROUND_STATUS.ACTIVE
                            ? designTokens.colors.successLight
                            : designTokens.colors.backgroundSecondary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roundStatusText,
                        {
                          color:
                            round.status === ROUND_STATUS.ACTIVE
                              ? designTokens.colors.success
                              : designTokens.colors.textSecondary,
                        },
                      ]}
                    >
                      {round.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.roundMatches}>{round.matches.length} matches generated</Text>
              </View>
            ))}
          </View>
        )}

        {/* Filter Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('screens.clubMatches.matches')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { label: t('screens.clubMatches.filterAll'), value: FILTER_STATUS.ALL },
              { label: t('screens.clubMatches.filterPending'), value: MatchStatus.PENDING },
              { label: t('screens.clubMatches.filterScheduled'), value: MatchStatus.SCHEDULED },
              { label: t('screens.clubMatches.filterCompleted'), value: MatchStatus.COMPLETED },
              { label: t('screens.clubMatches.filterSkipped'), value: MatchStatus.SKIPPED },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterChip,
                  filterStatus === filter.value && styles.filterChipActive,
                ]}
                onPress={() =>
                  setFilterStatus(filter.value as MatchStatus | typeof FILTER_STATUS.ALL)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterStatus === filter.value && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Matches List */}
        <View style={styles.content}>
          {filteredMatches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name={ICONS.ACCOUNT_HEART_OUTLINE}
                size={mobileIconSizes.xxlarge * 2}
                color={designTokens.colors.textTertiary}
              />
              <Text style={styles.emptyText}>{t('screens.clubMatches.noActivitiesFound')}</Text>
              <Text style={styles.emptySubtext}>
                {filterStatus === FILTER_STATUS.ALL
                  ? t('screens.clubMatches.generateFromDashboard')
                  : t('screens.clubMatches.noFilteredActivities', { status: filterStatus })}
              </Text>
            </View>
          ) : (
            filteredMatches.map((match) => (
              <TouchableOpacity key={match.id} onPress={() => handleViewMatchDetails(match)}>
                <MatchCard match={match} showActions={false} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Match Details Modal */}
      {selectedMatch && (
        <StandardModal
          visible={detailModalVisible}
          onClose={() => {
            setDetailModalVisible(false);
            setSelectedMatch(null);
            setMatchParticipants([]);
          }}
          title={t('screens.activities.activityDetails')}
          subtitle={t('screens.activities.manageActivity')}
          icon={ICONS.ACCOUNT_HEART}
          iconColor={designTokens.colors.primary}
          iconBackgroundColor={designTokens.colors.primaryLight}
        >
          <View style={styles.modalContent}>
            {/* Status */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>{t('screens.clubMatches.currentStatus')}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${getStatusConfig(selectedMatch.status).color}20`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={getStatusConfig(selectedMatch.status).icon as typeof ICONS.CHECK}
                  size={mobileIconSizes.medium}
                  color={getStatusConfig(selectedMatch.status).color}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: getStatusConfig(selectedMatch.status).color,
                    },
                  ]}
                >
                  {selectedMatch.status.charAt(0).toUpperCase() + selectedMatch.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Participants */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                Participants ({matchParticipants.length})
              </Text>
              {matchParticipants.map((participant) => (
                <View key={participant.id} style={styles.participantRow}>
                  <View style={styles.participantAvatar}>
                    <Text style={styles.participantAvatarText}>
                      {participant.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{participant.name}</Text>
                    <Text style={styles.participantEmail}>{participant.email}</Text>
                    {participant.whatsappNumber && (
                      <Text style={styles.participantPhone}>📱 {participant.whatsappNumber}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Admin Actions */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>{t('screens.clubMatches.adminActions')}</Text>

              <StandardButton
                title={t('screens.activities.notifyParticipants')}
                icon={ICONS.WHATSAPP}
                variant={COMPONENT_VARIANT.secondary}
                fullWidth
                onPress={() => handleNotifyMatch(selectedMatch)}
              />

              {selectedMatch.status === MatchStatus.PENDING && (
                <StandardButton
                  title={t('screens.activities.markAsScheduled')}
                  icon={ICONS.CALENDAR_CHECK}
                  variant={COMPONENT_VARIANT.primary}
                  fullWidth
                  onPress={() => handleUpdateMatchStatus(selectedMatch.id, MatchStatus.SCHEDULED)}
                />
              )}

              {selectedMatch.status === MatchStatus.SCHEDULED && (
                <StandardButton
                  title={t('screens.activities.markAsCompleted')}
                  icon={ICONS.CHECK_CIRCLE}
                  variant={COMPONENT_VARIANT.primary}
                  fullWidth
                  onPress={() => handleUpdateMatchStatus(selectedMatch.id, MatchStatus.COMPLETED)}
                />
              )}

              {(selectedMatch.status === MatchStatus.PENDING ||
                selectedMatch.status === MatchStatus.SCHEDULED) && (
                <StandardButton
                  title={t('screens.activities.cancelMatch')}
                  icon={ICONS.CLOSE_CIRCLE}
                  variant={COMPONENT_VARIANT.danger}
                  fullWidth
                  onPress={() => handleUpdateMatchStatus(selectedMatch.id, MatchStatus.CANCELLED)}
                />
              )}
            </View>
          </View>
        </StandardModal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
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
  statsSection: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginTop: designTokens.spacing.sm,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.lg,
  },
  statsGrid: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
  },
  statCard: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: layoutConstants.alignItems.center,
  },
  statValue: {
    ...mobileTypography.displaySmall,
    color: designTokens.colors.primary,
    marginBottom: designTokens.spacing.xs,
  },
  statLabel: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  section: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginTop: designTokens.spacing.sm,
  },
  roundCard: {
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
  },
  roundHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  roundTitle: {
    ...mobileTypography.bodyLargeBold,
  },
  roundDate: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
  roundStatusBadge: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
  },
  roundStatusText: {
    ...mobileTypography.captionBold,
  },
  roundMatches: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
  filterScroll: {
    flexDirection: layoutConstants.flexDirection.row,
  },
  filterChip: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.xxl,
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
  content: {
    padding: designTokens.spacing.lg,
  },
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
  modalContent: {
    padding: designTokens.spacing.xl,
  },
  modalSection: {
    marginBottom: designTokens.spacing.xxl,
  },
  modalSectionTitle: {
    ...mobileTypography.heading4,
    marginBottom: designTokens.spacing.md,
  },
  statusBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.sm,
  },
  statusText: {
    ...mobileTypography.bodyLargeBold,
  },
  participantRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.inputBackground,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  participantAvatar: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  participantAvatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textInverse,
  },
  participantInfo: {
    flex: flexValues.one,
  },
  participantName: {
    ...mobileTypography.bodyLargeBold,
  },
  participantEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
  participantPhone: {
    ...mobileTypography.caption,
    color: designTokens.colors.success,
    marginTop: designTokens.spacing.xxs,
  },
});

export default ClubMatchesScreen;
