import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { matchService } from '../../services/matchService';
import { userService } from '../../services/userService';
import { Match, MatchStatus, User } from '../../types';
import { MatchCard } from '../../components/MatchCard';
import {
  Text,
  StandardModal,
  StandardButton,
  ScreenHeader,
  EmptyState,
} from '../../shared/components';
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

type TranslationFn = ReturnType<typeof useTranslation>['t'];

// Helper function: get status color
const getStatusColor = (status: MatchStatus): string => {
  const colorMap: Record<MatchStatus, string> = {
    [MatchStatus.PENDING]: designTokens.colors.warning,
    [MatchStatus.SCHEDULED]: designTokens.colors.info,
    [MatchStatus.COMPLETED]: designTokens.colors.success,
    [MatchStatus.SKIPPED]: designTokens.colors.textQuaternary,
  };
  return colorMap[status] || designTokens.colors.textSecondary;
};

// Helper: open WhatsApp
const openWhatsApp = (url: string): void => {
  Linking.openURL(url).catch(() => {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.COULD_NOT_OPEN_WHATSAPP);
  });
};

// Custom hook for activities data
interface UseActivitiesReturn {
  matches: Match[];
  loading: boolean;
  refreshing: boolean;
  loadMatches: () => Promise<void>;
  onRefresh: () => void;
}

function useActivities(): UseActivitiesReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = useCallback(async (): Promise<void> => {
    try {
      const data = await matchService.getMyMatches();
      setMatches(data);
    } catch {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_ACTIVITIES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadMatches();
  };

  return { matches, loading, refreshing, loadMatches, onRefresh };
}

// Participant row component
interface ParticipantRowProps {
  participant: User;
  currentUserId?: string;
  onContact: (p: User) => void;
  t: TranslationFn;
}

function ParticipantRow({
  participant,
  currentUserId,
  onContact,
  t,
}: ParticipantRowProps): React.JSX.Element {
  return (
    <View style={styles.participantRow}>
      <View style={styles.participantAvatar}>
        <Text style={styles.participantAvatarText}>{participant.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{participant.name}</Text>
        <Text style={styles.participantEmail}>{participant.email}</Text>
      </View>
      {participant.id !== currentUserId && (
        <StandardButton
          title={t('screens.activities.chat')}
          icon={ICONS.WHATSAPP}
          variant={COMPONENT_VARIANT.secondary}
          size={BUTTON_SIZE.small}
          onPress={() => onContact(participant)}
        />
      )}
    </View>
  );
}

// Activity handlers
function createSkipHandler(loadMatches: () => Promise<void>): (matchId: string) => void {
  return (matchId: string): void => {
    Alert.alert(MESSAGES.TITLES.SKIP_ACTIVITY, MESSAGES.WARNINGS.CONFIRM_SKIP, [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.SKIP,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: async () => {
          try {
            await matchService.skipMatch(matchId);
            loadMatches();
          } catch {
            Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_SKIP_ACTIVITY);
          }
        },
      },
    ]);
  };
}

function createContactHandler(t: TranslationFn): (participant: User) => void {
  return (participant: User): void => {
    if (!participant.whatsappNumber) {
      return;
    }
    const message = t('screens.activities.whatsappMessageSingle', { name: participant.name });
    const cleanNum = participant.whatsappNumber.replace(
      VALIDATION.WHATSAPP.STRIP_NON_DIGITS,
      EMPTY_VALUE
    );
    const url = `${EXTERNAL_URLS.WHATSAPP_BASE}${cleanNum}?text=${encodeURIComponent(message)}`;
    openWhatsApp(url);
  };
}

function createGroupChatHandler(
  participants: User[],
  currentUserId: string | undefined,
  t: TranslationFn
): () => void {
  return (): void => {
    if (participants.length === 0) {
      return;
    }
    const phoneNumbers = participants
      .filter((p) => p.whatsappNumber && p.id !== currentUserId)
      .map((p) => p.whatsappNumber.replace(VALIDATION.WHATSAPP.STRIP_NON_DIGITS, EMPTY_VALUE))
      .join(',');
    if (phoneNumbers) {
      const message = t('screens.activities.whatsappMessageGroup');
      const url = `${EXTERNAL_URLS.WHATSAPP_GROUP}?text=${encodeURIComponent(message)}&phone=${phoneNumbers}`;
      openWhatsApp(url);
    }
  };
}

// Filter badge props
interface FilterBadgeProps {
  label: string;
  status: MatchStatus | null;
}

function FilterBadge({ label, status }: FilterBadgeProps): React.JSX.Element {
  const color = status ? getStatusColor(status) : designTokens.colors.textSecondary;
  return (
    <View style={styles.filterBadge}>
      <MaterialCommunityIcons name={ICONS.CIRCLE} size={designTokens.icon.sizes.xs} color={color} />
      <Text style={styles.filterText}>{label}</Text>
    </View>
  );
}

// Filter section
function FilterSection({ t }: { t: TranslationFn }): React.JSX.Element {
  const filters = [
    { label: t('screens.activities.filterAll'), status: null },
    { label: t('screens.activities.filterPending'), status: MatchStatus.PENDING },
    { label: t('screens.activities.filterScheduled'), status: MatchStatus.SCHEDULED },
    { label: t('screens.activities.filterCompleted'), status: MatchStatus.COMPLETED },
  ];
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>{t('screens.activities.filterByStatus')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((f) => (
          <FilterBadge key={f.label} label={f.label} status={f.status} />
        ))}
      </ScrollView>
    </View>
  );
}

// Activity list props
interface ActivityListProps {
  matches: Match[];
  onView: (m: Match) => void;
  onSkip: (id: string) => void;
}

function ActivityList({ matches, onView, onSkip }: ActivityListProps): React.JSX.Element {
  return (
    <>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          showActions={match.status === MatchStatus.PENDING}
          onPress={() => onView(match)}
          onSkip={() => onSkip(match.id)}
          onSchedule={() => onView(match)}
        />
      ))}
    </>
  );
}

// Activities content
function ActivitiesContent({
  loading,
  matches,
  t,
  onView,
  onSkip,
}: {
  loading: boolean;
  matches: Match[];
  t: TranslationFn;
  onView: (m: Match) => void;
  onSkip: (id: string) => void;
}): React.JSX.Element {
  if (loading) {
    return (
      <EmptyState
        icon={ICONS.LOADING}
        title={t('screens.activities.loadingActivities')}
        description={t('common.pleaseWait')}
      />
    );
  }
  if (matches.length === 0) {
    return (
      <EmptyState
        icon={ICONS.ACCOUNT_HEART}
        title={t('screens.activities.noActivitiesYet')}
        description={t('screens.activities.noActivitiesDescription')}
      />
    );
  }
  return (
    <>
      <FilterSection t={t} />
      <ActivityList matches={matches} onView={onView} onSkip={onSkip} />
    </>
  );
}

interface ActivitiesState {
  selectedMatch: Match | null;
  matchParticipants: User[];
  detailModalVisible: boolean;
  handleSkipMatch: (matchId: string) => Promise<void>;
  handleContactParticipant: (p: User) => void;
  handleCreateGroupChat: () => void;
  handleViewMatchDetails: (m: Match) => Promise<void>;
  closeDetailModal: () => void;
}

// Custom hook for activities screen state
function useActivitiesState(
  loadMatches: () => Promise<void>,
  userId?: string,
  t?: TranslationFn
): ActivitiesState {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchParticipants, setMatchParticipants] = useState<User[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const handleSkipMatch = createSkipHandler(loadMatches);
  const handleContactParticipant = t ? createContactHandler(t) : (): void => undefined;
  const handleCreateGroupChat = t
    ? createGroupChatHandler(matchParticipants, userId, t)
    : (): void => undefined;

  const handleViewMatchDetails = async (match: Match): Promise<void> => {
    setSelectedMatch(match);
    setDetailModalVisible(true);
    try {
      const participants = await Promise.all(
        match.participants.map((id) => userService.getUser(id))
      );
      setMatchParticipants(participants);
    } catch (error) {
      logger.error(LOG_MESSAGES.ACTIVITIES.FAILED_TO_LOAD_PARTICIPANTS, error as Error);
    }
  };

  const closeModal = (): void => {
    setDetailModalVisible(false);
    setSelectedMatch(null);
    setMatchParticipants([]);
  };

  return {
    selectedMatch,
    matchParticipants,
    detailModalVisible,
    handleSkipMatch,
    handleContactParticipant,
    handleCreateGroupChat,
    handleViewMatchDetails,
    closeModal,
  };
}

const ActivitiesScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { matches, loading, refreshing, loadMatches, onRefresh } = useActivities();
  const state = useActivitiesState(loadMatches, user?.id, t);

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
          <ActivitiesContent
            loading={loading}
            matches={matches}
            t={t}
            onView={state.handleViewMatchDetails}
            onSkip={state.handleSkipMatch}
          />
        </View>
      </ScrollView>
      {state.selectedMatch && (
        <ActivityDetailModal
          visible={state.detailModalVisible}
          match={state.selectedMatch}
          participants={state.matchParticipants}
          currentUserId={user?.id}
          onClose={state.closeModal}
          onContact={state.handleContactParticipant}
          onGroupChat={state.handleCreateGroupChat}
          onSkip={state.handleSkipMatch}
          t={t}
        />
      )}
    </>
  );
};

// Activity detail modal component
interface ActivityDetailModalProps {
  visible: boolean;
  match: Match;
  participants: User[];
  currentUserId?: string;
  onClose: () => void;
  onContact: (p: User) => void;
  onGroupChat: () => void;
  onSkip: (id: string) => void;
  t: TranslationFn;
}

function ActivityDetailModal({
  visible,
  match,
  participants,
  currentUserId,
  onClose,
  onContact,
  onGroupChat,
  onSkip,
  t,
}: ActivityDetailModalProps): React.JSX.Element {
  const statusColor = getStatusColor(match.status);
  const statusIcon =
    match.status === MatchStatus.COMPLETED ? ICONS.CHECK_CIRCLE : ICONS.CLOCK_OUTLINE;
  const statusLabel = match.status.charAt(0).toUpperCase() + match.status.slice(1);

  return (
    <StandardModal
      visible={visible}
      onClose={onClose}
      title={t('screens.activities.activityDetails')}
      subtitle={t('screens.activities.socialMeetupInfo')}
      icon={ICONS.ACCOUNT_HEART}
      iconColor={designTokens.colors.primary}
      iconBackgroundColor={designTokens.colors.primaryLight}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalSection}>
          <Text style={styles.modalSectionTitle}>{t('screens.activities.status')}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <MaterialCommunityIcons
              name={statusIcon}
              size={designTokens.icon.sizes.md}
              color={statusColor}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.modalSectionTitle}>{t('screens.activities.participants')}</Text>
          {participants.map((p) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              currentUserId={currentUserId}
              onContact={onContact}
              t={t}
            />
          ))}
        </View>

        <View style={styles.modalSection}>
          <StandardButton
            title={t('screens.activities.createGroupChat')}
            icon={ICONS.WHATSAPP}
            variant={COMPONENT_VARIANT.primary}
            fullWidth
            onPress={onGroupChat}
          />
          {match.status === MatchStatus.PENDING && (
            <StandardButton
              title={t('screens.activities.skipActivity')}
              icon={ICONS.CLOSE}
              variant={COMPONENT_VARIANT.danger}
              fullWidth
              onPress={() => {
                onClose();
                onSkip(match.id);
              }}
            />
          )}
        </View>
      </View>
    </StandardModal>
  );
}

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
