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
import { useAuth } from '../../context/AuthContext';
import { matchService } from '../../services/matchService';
import { userService } from '../../services/userService';
import { Match, MatchStatus, User, MatchRound } from '../../types';
import { MatchCard } from '../../components/MatchCard';
import { StandardModal } from '../../shared/components/StandardModal';
import { StandardButton } from '../../shared/components/StandardButton';
import { mobileTypography, mobileIconSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { DesignConstants } from '../../shared/theme/designConstants';
import { format } from 'date-fns';
import { MESSAGES, EXTERNAL_URLS } from '../../shared/constants';

const ClubMatchesScreen = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchRounds, setMatchRounds] = useState<MatchRound[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchParticipants, setMatchParticipants] = useState<User[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<MatchStatus | 'all'>('all');

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
      setMatches(matchesData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setMatchRounds(roundsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
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
    if (filterStatus === 'all') {
      setFilteredMatches(matches);
    } else {
      setFilteredMatches(matches.filter(m => m.status === filterStatus));
    }
  };

  const handleViewMatchDetails = async (match: Match) => {
    setSelectedMatch(match);
    setDetailModalVisible(true);
    
    try {
      const participants = await Promise.all(
        match.participants.map(userId => userService.getUser(userId))
      );
      setMatchParticipants(participants);
    } catch (error) {
      console.error('Failed to load participants:', error);
    }
  };

  const handleNotifyMatch = (match: Match) => {
    Alert.alert(
      MESSAGES.TITLES.NOTIFY_PARTICIPANTS,
      MESSAGES.WARNINGS.NOTIFY_PARTICIPANTS_MESSAGE,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              const participants = await Promise.all(
                match.participants.map(userId => userService.getUser(userId))
              );
              
              const phoneNumbers = participants
                .filter(p => p.whatsappNumber)
                .map(p => p.whatsappNumber.replace(/[^0-9]/g, ''))
                .join(',');
              
              if (phoneNumbers) {
                const message = `Hello! You have a new social activity scheduled. Please coordinate with your group to set up a meetup this week.`;
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
    return DesignConstants.status[status] || DesignConstants.status.pending;
  };

  const getStatusStats = () => {
    return {
      total: matches.length,
      pending: matches.filter(m => m.status === MatchStatus.PENDING).length,
      scheduled: matches.filter(m => m.status === MatchStatus.SCHEDULED).length,
      completed: matches.filter(m => m.status === MatchStatus.COMPLETED).length,
      skipped: matches.filter(m => m.status === MatchStatus.SKIPPED).length,
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
          <Text style={styles.title}>Activity Management</Text>
          <Text style={styles.subtitle}>Manage all club social activities</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Matches</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: designTokens.colors.warning }]}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: designTokens.colors.info }]}>{stats.scheduled}</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: designTokens.colors.success }]}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Match Rounds */}
        {matchRounds.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Match Rounds</Text>
            {matchRounds.slice(0, 3).map((round) => (
              <View key={round.id} style={styles.roundCard}>
                <View style={styles.roundHeader}>
                  <View>
                    <Text style={styles.roundTitle}>Round {round.id}</Text>
                    <Text style={styles.roundDate}>
                      Created {format(new Date(round.createdAt), 'MMM dd, yyyy')}
                    </Text>
                  </View>
                  <View style={[styles.roundStatusBadge, { 
                    backgroundColor: round.status === 'active' ? designTokens.colors.successLight : designTokens.colors.backgroundSecondary 
                  }]}>
                    <Text style={[styles.roundStatusText, {
                      color: round.status === 'active' ? designTokens.colors.success : designTokens.colors.textSecondary
                    }]}>
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
          <Text style={styles.sectionTitle}>Matches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: MatchStatus.PENDING },
              { label: 'Scheduled', value: MatchStatus.SCHEDULED },
              { label: 'Completed', value: MatchStatus.COMPLETED },
              { label: 'Skipped', value: MatchStatus.SKIPPED },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterChip,
                  filterStatus === filter.value && styles.filterChipActive,
                ]}
                onPress={() => setFilterStatus(filter.value as any)}
              >
                <Text style={[
                  styles.filterChipText,
                  filterStatus === filter.value && styles.filterChipTextActive,
                ]}>
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
              <MaterialCommunityIcons name="account-heart-outline" size={mobileIconSizes.xxlarge * 2} color={designTokens.colors.textTertiary} />
              <Text style={styles.emptyText}>No activities found</Text>
              <Text style={styles.emptySubtext}>
                {filterStatus === 'all' 
                  ? 'Generate activities from the dashboard'
                  : `No ${filterStatus} activities`}
              </Text>
            </View>
          ) : (
            filteredMatches.map((match) => (
              <TouchableOpacity key={match.id} onPress={() => handleViewMatchDetails(match)}>
                <MatchCard
                  match={match}
                  showActions={false}
                />
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
          title="Activity Details"
          subtitle="Manage this social activity"
          icon="account-heart"
          iconColor={designTokens.colors.primary}
          iconBackgroundColor={designTokens.colors.primaryLight}
        >
          <View style={styles.modalContent}>
            {/* Status */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Current Status</Text>
              <View style={[styles.statusBadge, { 
                backgroundColor: `${getStatusConfig(selectedMatch.status).color}20` 
              }]}>
                <MaterialCommunityIcons
                  name={getStatusConfig(selectedMatch.status).icon as any}
                  size={mobileIconSizes.medium}
                  color={getStatusConfig(selectedMatch.status).color}
                />
                <Text style={[styles.statusText, { 
                  color: getStatusConfig(selectedMatch.status).color 
                }]}>
                  {selectedMatch.status.charAt(0).toUpperCase() + selectedMatch.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Participants */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Participants ({matchParticipants.length})</Text>
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
                      <Text style={styles.participantPhone}>
                        📱 {participant.whatsappNumber}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Admin Actions */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Admin Actions</Text>
              
              <StandardButton
                title="Notify Participants"
                icon="whatsapp"
                variant="secondary"
                fullWidth
                onPress={() => handleNotifyMatch(selectedMatch)}
              />

              {selectedMatch.status === MatchStatus.PENDING && (
                <StandardButton
                  title="Mark as Scheduled"
                  icon="calendar-check"
                  variant="primary"
                  fullWidth
                  onPress={() => handleUpdateMatchStatus(selectedMatch.id, MatchStatus.SCHEDULED)}
                />
              )}

              {selectedMatch.status === MatchStatus.SCHEDULED && (
                <StandardButton
                  title="Mark as Completed"
                  icon="check-circle"
                  variant="primary"
                  fullWidth
                  onPress={() => handleUpdateMatchStatus(selectedMatch.id, MatchStatus.COMPLETED)}
                />
              )}

              {(selectedMatch.status === MatchStatus.PENDING || selectedMatch.status === MatchStatus.SCHEDULED) && (
                <StandardButton
                  title="Cancel Match"
                  icon="close-circle"
                  variant="danger"
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
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  header: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  title: {
    ...mobileTypography.displayMedium,
  },
  subtitle: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginTop: 4,
  },
  statsSection: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginTop: 8,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    ...mobileTypography.displaySmall,
    color: designTokens.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  section: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginTop: 8,
  },
  roundCard: {
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: 12,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roundTitle: {
    ...mobileTypography.bodyLargeBold,
  },
  roundDate: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
  roundStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.xxl,
    marginRight: 8,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: designTokens.spacing['4xl'],
    marginTop: 40,
  },
  emptyText: {
    ...mobileTypography.heading3,
    marginTop: 16,
  },
  emptySubtext: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  modalContent: {
    padding: designTokens.spacing.xl,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    ...mobileTypography.heading4,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: designTokens.borderRadius.lg,
    gap: 8,
  },
  statusText: {
    ...mobileTypography.bodyLargeBold,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.inputBackground,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: 8,
    gap: 12,
  },
  participantAvatar: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius['3xl'],
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantAvatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textInverse,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    ...mobileTypography.bodyLargeBold,
  },
  participantEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
  participantPhone: {
    ...mobileTypography.caption,
    color: designTokens.colors.success,
    marginTop: 2,
  },
});

export default ClubMatchesScreen;

