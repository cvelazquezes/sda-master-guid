import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchService } from '../../services/matchService';
import { userService } from '../../services/userService';
import { Match, MatchStatus, User } from '../../types';
import { MatchCard } from '../../components/MatchCard';
import { StandardModal, StandardButton, ScreenHeader, EmptyState } from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileTypography } from '../../shared/theme/mobileTypography';
import { layoutConstants } from '../../shared/theme';
import { LOG_MESSAGES } from '../../shared/constants/logMessages';
import { logger } from '../../shared/utils/logger';
import {
  ALERT_BUTTON_STYLE,
  BUTTON_SIZE,
  COMPONENT_VARIANT,
  EMPTY_VALUE,
  EXTERNAL_URLS,
  ICONS,
  MESSAGES,
  VALIDATION,
  flexValues,
} from '../../shared/constants';

const ActivitiesScreen = () => {
  const { t } = useTranslation();
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
    Alert.alert(MESSAGES.TITLES.SKIP_ACTIVITY, MESSAGES.WARNINGS.CONFIRM_SKIP, [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.SKIP,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: async () => {
          try {
            await matchService.skipMatch(matchId);
            loadMatches();
          } catch (error) {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_SKIP_ACTIVITY);
          }
        },
      },
    ]);
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
      logger.error(LOG_MESSAGES.ACTIVITIES.FAILED_TO_LOAD_PARTICIPANTS, error as Error);
    }
  };

  const handleContactParticipant = (participant: User) => {
    if (participant.whatsappNumber) {
      const message = t('screens.activities.whatsappMessageSingle', { name: participant.name });
      const url = `${EXTERNAL_URLS.WHATSAPP_BASE}${participant.whatsappNumber.replace(VALIDATION.WHATSAPP.STRIP_NON_DIGITS, EMPTY_VALUE)}?text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.COULD_NOT_OPEN_WHATSAPP);
      });
    }
  };

  const handleCreateGroupChat = () => {
    if (matchParticipants.length === 0) return;

    const phoneNumbers = matchParticipants
      .filter((p) => p.whatsappNumber && p.id !== user?.id)
      .map((p) => p.whatsappNumber.replace(VALIDATION.WHATSAPP.STRIP_NON_DIGITS, EMPTY_VALUE))
      .join(',');

    if (phoneNumbers) {
      const message = t('screens.activities.whatsappMessageGroup');
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
          title={t('screens.activities.title')}
          subtitle={t('screens.activities.socialMeetupsSubtitle')}
        />

        <View style={styles.content}>
          {loading ? (
            <EmptyState
              icon={ICONS.LOADING}
              title={t('screens.activities.loadingActivities')}
              description={t('common.pleaseWait')}
            />
          ) : matches.length === 0 ? (
            <EmptyState
              icon={ICONS.ACCOUNT_HEART}
              title={t('screens.activities.noActivitiesYet')}
              description={t('screens.activities.noActivitiesDescription')}
            />
          ) : (
            <>
              {/* Filter badges (visual only for now) */}
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>{t('screens.activities.filterByStatus')}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.filterScroll}
                >
                  {[
                    { label: t('screens.activities.filterAll'), status: null },
                    { label: t('screens.activities.filterPending'), status: MatchStatus.PENDING },
                    {
                      label: t('screens.activities.filterScheduled'),
                      status: MatchStatus.SCHEDULED,
                    },
                    {
                      label: t('screens.activities.filterCompleted'),
                      status: MatchStatus.COMPLETED,
                    },
                  ].map((filter) => (
                    <View key={filter.label} style={styles.filterBadge}>
                      <MaterialCommunityIcons
                        name={ICONS.CIRCLE}
                        size={designTokens.icon.sizes.xs}
                        color={
                          filter.status
                            ? getStatusColor(filter.status)
                            : designTokens.colors.textSecondary
                        }
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
          title={t('screens.activities.activityDetails')}
          subtitle={t('screens.activities.socialMeetupInfo')}
          icon={ICONS.ACCOUNT_HEART}
          iconColor={designTokens.colors.primary}
          iconBackgroundColor={designTokens.colors.primaryLight}
        >
          <View style={styles.modalContent}>
            {/* Activity Status */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>{t('screens.activities.status')}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(selectedMatch.status)}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    selectedMatch.status === MatchStatus.COMPLETED
                      ? ICONS.CHECK_CIRCLE
                      : ICONS.CLOCK_OUTLINE
                  }
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
              <Text style={styles.modalSectionTitle}>{t('screens.activities.participants')}</Text>
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
                      title={t('screens.activities.chat')}
                      icon={ICONS.WHATSAPP}
                      variant={COMPONENT_VARIANT.secondary}
                      size={BUTTON_SIZE.small}
                      onPress={() => handleContactParticipant(participant)}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.modalSection}>
              <StandardButton
                title={t('screens.activities.createGroupChat')}
                icon={ICONS.WHATSAPP}
                variant={COMPONENT_VARIANT.primary}
                fullWidth
                onPress={handleCreateGroupChat}
              />
              {selectedMatch.status === MatchStatus.PENDING && (
                <StandardButton
                  title={t('screens.activities.skipActivity')}
                  icon={ICONS.CLOSE}
                  variant={COMPONENT_VARIANT.danger}
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
    flex: flexValues.one,
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
    flexDirection: layoutConstants.flexDirection.row,
  },
  filterBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.full,
    marginRight: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
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
    backgroundColor: designTokens.colors.backgroundSecondary,
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
    color: designTokens.colors.textPrimary,
  },
  participantEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
});

export default ActivitiesScreen;
