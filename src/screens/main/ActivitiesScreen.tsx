import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchService } from '../../services/matchService';
import { userService } from '../../services/userService';
import { Match, MatchStatus, User } from '../../types';
import { MatchCard } from '../../components/MatchCard';
import { 
  StandardModal, 
  StandardButton, 
  ScreenHeader, 
  EmptyState 
} from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileTypography } from '../../shared/theme/mobileTypography';
import { MESSAGES, EXTERNAL_URLS } from '../../shared/constants';

const ActivitiesScreen = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchParticipants, setMatchParticipants] = useState<User[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    try {
      const matchesData = await matchService.getMyMatches();
      setMatches(matchesData);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_ACTIVITIES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const handleSkipMatch = async (matchId: string) => {
    Alert.alert(
      MESSAGES.TITLES.SKIP_ACTIVITY,
      MESSAGES.WARNINGS.CONFIRM_SKIP,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: MESSAGES.BUTTONS.SKIP,
          style: 'destructive',
          onPress: async () => {
            try {
              await matchService.skipMatch(matchId);
              loadMatches();
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_SKIP_ACTIVITY);
            }
          },
        },
      ]
    );
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

  const handleContactParticipant = (participant: User) => {
    if (participant.whatsappNumber) {
      const message = `Hi ${participant.name}! Let's schedule our meetup for this week. What day works best for you?`;
      const url = `${EXTERNAL_URLS.WHATSAPP_BASE}${participant.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.COULD_NOT_OPEN_WHATSAPP);
      });
    }
  };

  const handleCreateGroupChat = () => {
    if (matchParticipants.length === 0) return;
    
    const phoneNumbers = matchParticipants
      .filter(p => p.whatsappNumber && p.id !== user?.id)
      .map(p => p.whatsappNumber.replace(/[^0-9]/g, ''))
      .join(',');
    
    if (phoneNumbers) {
      const message = `Hi everyone! Let's schedule our club meetup this week. What day and time works for everyone?`;
      const url = `${EXTERNAL_URLS.WHATSAPP_GROUP}?text=${encodeURIComponent(message)}&phone=${phoneNumbers}`;
      Linking.openURL(url).catch(() => {
        Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.COULD_NOT_OPEN_WHATSAPP);
      });
    }
  };

  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.PENDING:
        return designTokens.colors.warning;
      case MatchStatus.SCHEDULED:
        return designTokens.colors.info;
      case MatchStatus.COMPLETED:
        return designTokens.colors.success;
      case MatchStatus.SKIPPED:
        return designTokens.colors.textQuaternary;
      default:
        return designTokens.colors.textSecondary;
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenHeader
          title="Club Activities"
          subtitle="Social meetups and events"
        />

        <View style={styles.content}>
          {loading ? (
            <EmptyState
              icon="loading"
              title="Loading activities..."
              description="Please wait"
            />
          ) : matches.length === 0 ? (
            <EmptyState
              icon="account-heart"
              title="No activities yet"
              description="Social activities will appear here when they're organized by your club admin"
            />
          ) : (
            <>
              {/* Filter badges (visual only for now) */}
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by status:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                  {[
                    { label: 'All', status: null },
                    { label: 'Pending', status: MatchStatus.PENDING },
                    { label: 'Scheduled', status: MatchStatus.SCHEDULED },
                    { label: 'Completed', status: MatchStatus.COMPLETED },
                  ].map((filter) => (
                    <View key={filter.label} style={styles.filterBadge}>
                      <MaterialCommunityIcons
                        name="circle"
                        size={designTokens.icon.sizes.xs}
                        color={filter.status ? getStatusColor(filter.status) : designTokens.colors.textSecondary}
                      />
                      <Text style={styles.filterText}>{filter.label}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Activities list */}
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  showActions={match.status === MatchStatus.PENDING}
                  onPress={() => handleViewMatchDetails(match)}
                  onSkip={() => handleSkipMatch(match.id)}
                  onSchedule={() => handleViewMatchDetails(match)}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Activity Details Modal */}
      {selectedMatch && (
        <StandardModal
          visible={detailModalVisible}
          onClose={() => {
            setDetailModalVisible(false);
            setSelectedMatch(null);
            setMatchParticipants([]);
          }}
          title="Activity Details"
          subtitle="Social meetup information"
          icon="account-heart"
          iconColor={designTokens.colors.primary}
          iconBackgroundColor={designTokens.colors.primaryLight}
        >
          <View style={styles.modalContent}>
            {/* Activity Status */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedMatch.status)}20` }]}>
                <MaterialCommunityIcons
                  name={selectedMatch.status === MatchStatus.COMPLETED ? 'check-circle' : 'clock-outline'}
                  size={designTokens.icon.sizes.md}
                  color={getStatusColor(selectedMatch.status)}
                />
                <Text style={[styles.statusText, { color: getStatusColor(selectedMatch.status) }]}>
                  {selectedMatch.status.charAt(0).toUpperCase() + selectedMatch.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Participants */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Participants</Text>
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
                  </View>
                  {participant.id !== user?.id && (
                    <StandardButton
                      title="Chat"
                      icon="whatsapp"
                      variant="secondary"
                      size="small"
                      onPress={() => handleContactParticipant(participant)}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.modalSection}>
              <StandardButton
                title="Create Group Chat"
                icon="whatsapp"
                variant="primary"
                fullWidth
                onPress={handleCreateGroupChat}
              />
              {selectedMatch.status === MatchStatus.PENDING && (
                <StandardButton
                  title="Skip This Activity"
                  icon="close"
                  variant="danger"
                  fullWidth
                  onPress={() => {
                    setDetailModalVisible(false);
                    handleSkipMatch(selectedMatch.id);
                  }}
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
  content: {
    padding: designTokens.spacing.lg,
  },
  filterContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  filterLabel: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.sm,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.full,
    marginRight: designTokens.spacing.sm,
    gap: 6,
  },
  filterText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textPrimary,
  },
  modalContent: {
    padding: designTokens.spacing.lg,
  },
  modalSection: {
    marginBottom: designTokens.spacing.xl,
  },
  modalSectionTitle: {
    ...mobileTypography.heading4,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.sm,
  },
  statusText: {
    ...mobileTypography.bodyLargeBold,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
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
    color: designTokens.colors.textPrimary,
  },
  participantEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
});

export default ActivitiesScreen;

