/* eslint-disable max-lines -- Activities screen with comprehensive activity management */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, Alert, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { t as i18nT } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  createScreenStyles,
  createFilterStyles,
  createModalStyles,
  createStatusStyles,
  createParticipantStyles,
} from './activities/styles';
import { matchService } from '../../../infrastructure/repositories/matchService';
import { userService } from '../../../infrastructure/repositories/userService';
import {
  ALERT_BUTTON_STYLE,
  BUTTON_SIZE,
  COMPONENT_VARIANT,
  EMPTY_VALUE,
  EXTERNAL_URLS,
  ICONS,
  PHONE,
} from '../../../shared/constants';
import { LOG_MESSAGES } from '../../../shared/constants/logMessages';
import { logger } from '../../../shared/utils/logger';
import { MatchStatus, type Match, type User } from '../../../types';
import { MatchCard } from '../../components/features/MatchCard';
import {
  Text,
  StandardModal,
  StandardButton,
  PageHeader,
  EmptyState,
} from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { useTheme, type ThemeContextType } from '../../state/ThemeContext';

type TranslationFn = ReturnType<typeof useTranslation>['t'];

// Helper function: get status color
const getStatusColor = (status: MatchStatus, colors: ThemeContextType['colors']): string => {
  const colorMap: Record<MatchStatus, string> = {
    [MatchStatus.PENDING]: colors.warning,
    [MatchStatus.SCHEDULED]: colors.info,
    [MatchStatus.COMPLETED]: colors.success,
    [MatchStatus.SKIPPED]: colors.textQuaternary,
    [MatchStatus.CANCELLED]: colors.error,
  };
  return colorMap[status] || colors.textSecondary;
};

// Helper: open WhatsApp
const openWhatsApp = (url: string): void => {
  Linking.openURL(url).catch(() => {
    Alert.alert(i18nT('common.error'), i18nT('errors.couldNotOpenWhatsapp'));
  });
};

// Custom hook for activities data
type UseActivitiesReturn = {
  matches: Match[];
  loading: boolean;
  refreshing: boolean;
  loadMatches: () => Promise<void>;
  onRefresh: () => void;
};

function useActivities(): UseActivitiesReturn {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = useCallback(async (): Promise<void> => {
    try {
      const data = await matchService.getMyMatches();
      setMatches(data);
    } catch {
      Alert.alert(i18nT('common.error'), i18nT('errors.failedToLoadActivities'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadMatches();
  }, [loadMatches]);

  const onRefresh = (): void => {
    setRefreshing(true);
    void loadMatches();
  };

  return { matches, loading, refreshing, loadMatches, onRefresh };
}

// Participant row component
type ParticipantRowProps = {
  participant: User;
  currentUserId?: string;
  onContact: (p: User) => void;
  t: TranslationFn;
  styles: ReturnType<typeof createParticipantStyles>;
};

function ParticipantRow({
  participant,
  currentUserId,
  onContact,
  t,
  styles,
}: ParticipantRowProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{participant.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{participant.name}</Text>
        <Text style={styles.email}>{participant.email}</Text>
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
    Alert.alert(i18nT('titles.skipActivity'), i18nT('warnings.confirmSkip'), [
      { text: i18nT('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: i18nT('common.skip'),
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: () => {
          matchService
            .skipMatch(matchId)
            .then(() => loadMatches())
            .catch(() => {
              Alert.alert(i18nT('common.error'), i18nT('errors.failedToSkipActivity'));
            });
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
    const cleanNum = participant.whatsappNumber.replace(PHONE.STRIP_NON_DIGITS, EMPTY_VALUE);
    const url = EXTERNAL_URLS.WHATSAPP.WEB(cleanNum, message);
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
    const otherParticipants = participants.filter(
      (p) => p.whatsappNumber && p.id !== currentUserId
    );
    if (otherParticipants.length > 0) {
      const message = t('screens.activities.whatsappMessageGroup');
      // Open WhatsApp with the first participant (group chat creation requires native app)
      const [firstParticipant] = otherParticipants;
      const cleanNum = firstParticipant.whatsappNumber.replace(PHONE.STRIP_NON_DIGITS, EMPTY_VALUE);
      const url = EXTERNAL_URLS.WHATSAPP.WEB(cleanNum, message);
      openWhatsApp(url);
    }
  };
}

// Filter badge props
type FilterBadgeProps = {
  label: string;
  status: MatchStatus | null;
  colors: ThemeContextType['colors'];
  iconSizes: ThemeContextType['iconSizes'];
  styles: ReturnType<typeof createFilterStyles>;
};

function FilterBadge({
  label,
  status,
  colors,
  iconSizes,
  styles,
}: FilterBadgeProps): React.JSX.Element {
  const color = status ? getStatusColor(status, colors) : colors.textSecondary;
  return (
    <View style={styles.badge}>
      <MaterialCommunityIcons name={ICONS.CIRCLE} size={iconSizes.xs} color={color} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

// Filter section
type FilterSectionProps = {
  t: TranslationFn;
  colors: ThemeContextType['colors'];
  iconSizes: ThemeContextType['iconSizes'];
  styles: ReturnType<typeof createFilterStyles>;
};

function FilterSection({ t, colors, iconSizes, styles }: FilterSectionProps): React.JSX.Element {
  const filters = [
    { label: t('screens.activities.filterAll'), status: null },
    { label: t('screens.activities.filterPending'), status: MatchStatus.PENDING },
    { label: t('screens.activities.filterScheduled'), status: MatchStatus.SCHEDULED },
    { label: t('screens.activities.filterCompleted'), status: MatchStatus.COMPLETED },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('screens.activities.filterByStatus')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((f) => (
          <FilterBadge
            key={f.label}
            label={f.label}
            status={f.status}
            colors={colors}
            iconSizes={iconSizes}
            styles={styles}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// Activity list props
type ActivityListProps = {
  matches: Match[];
  onView: (m: Match) => void | Promise<void>;
  onSkip: (id: string) => void;
};

function ActivityList({ matches, onView, onSkip }: ActivityListProps): React.JSX.Element {
  const handleView = (match: Match): void => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    onView(match);
  };

  return (
    <>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          showActions={match.status === MatchStatus.PENDING}
          onPress={() => handleView(match)}
          onSkip={() => onSkip(match.id)}
          onSchedule={() => handleView(match)}
        />
      ))}
    </>
  );
}

// Activities content
type ActivitiesContentProps = {
  loading: boolean;
  matches: Match[];
  t: TranslationFn;
  colors: ThemeContextType['colors'];
  iconSizes: ThemeContextType['iconSizes'];
  filterStyles: ReturnType<typeof createFilterStyles>;
  onView: (m: Match) => void | Promise<void>;
  onSkip: (id: string) => void;
};

function ActivitiesContent({
  loading,
  matches,
  t,
  colors,
  iconSizes,
  filterStyles,
  onView,
  onSkip,
}: ActivitiesContentProps): React.JSX.Element {
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
      <FilterSection t={t} colors={colors} iconSizes={iconSizes} styles={filterStyles} />
      <ActivityList matches={matches} onView={onView} onSkip={onSkip} />
    </>
  );
}

type ActivitiesState = {
  selectedMatch: Match | null;
  matchParticipants: User[];
  detailModalVisible: boolean;
  handleSkipMatch: (matchId: string) => void;
  handleContactParticipant: (p: User) => void;
  handleCreateGroupChat: () => void;
  handleViewMatchDetails: (m: Match) => Promise<void>;
  closeDetailModal: () => void;
};

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

  const closeDetailModal = (): void => {
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
    closeDetailModal,
  };
}

const ActivitiesScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors, spacing, radii, typography, iconSizes } = useTheme();
  const { matches, loading, refreshing, loadMatches, onRefresh } = useActivities();
  const state = useActivitiesState(loadMatches, user?.id, t);

  // Create theme-aware styles
  const screenStyles = useMemo(() => createScreenStyles(colors, spacing), [colors, spacing]);
  const filterStyles = useMemo(
    () => createFilterStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const modalStyles = useMemo(
    () => createModalStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );
  const statusStyles = useMemo(
    () => createStatusStyles(spacing, radii, typography),
    [spacing, radii, typography]
  );
  const participantStyles = useMemo(
    () => createParticipantStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  return (
    <>
      <ScrollView
        style={screenStyles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <PageHeader
          showActions
          title={t('screens.activities.title')}
          subtitle={t('screens.activities.socialMeetupsSubtitle')}
        />
        <View style={screenStyles.content}>
          <ActivitiesContent
            loading={loading}
            matches={matches}
            t={t}
            colors={colors}
            iconSizes={iconSizes}
            filterStyles={filterStyles}
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
          t={t}
          colors={colors}
          iconSizes={iconSizes}
          modalStyles={modalStyles}
          statusStyles={statusStyles}
          participantStyles={participantStyles}
          onClose={state.closeDetailModal}
          onContact={state.handleContactParticipant}
          onGroupChat={state.handleCreateGroupChat}
          onSkip={state.handleSkipMatch}
        />
      )}
    </>
  );
};

// Activity detail modal component
type ActivityDetailModalProps = {
  visible: boolean;
  match: Match;
  participants: User[];
  currentUserId?: string;
  onClose: () => void;
  onContact: (p: User) => void;
  onGroupChat: () => void;
  onSkip: (id: string) => void;
  t: TranslationFn;
  colors: ThemeContextType['colors'];
  iconSizes: ThemeContextType['iconSizes'];
  modalStyles: ReturnType<typeof createModalStyles>;
  statusStyles: ReturnType<typeof createStatusStyles>;
  participantStyles: ReturnType<typeof createParticipantStyles>;
};

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
  colors,
  iconSizes,
  modalStyles,
  statusStyles,
  participantStyles,
}: ActivityDetailModalProps): React.JSX.Element {
  const statusColor = getStatusColor(match.status, colors);
  const statusIcon =
    match.status === MatchStatus.COMPLETED ? ICONS.CHECK_CIRCLE : ICONS.CLOCK_OUTLINE;
  const statusLabel = match.status.charAt(0).toUpperCase() + match.status.slice(1);

  return (
    <StandardModal
      visible={visible}
      title={t('screens.activities.activityDetails')}
      subtitle={t('screens.activities.socialMeetupInfo')}
      icon={ICONS.ACCOUNT_HEART}
      iconColor={colors.primary}
      iconBackgroundColor={colors.primaryAlpha20}
      onClose={onClose}
    >
      <View style={modalStyles.content}>
        <View style={modalStyles.section}>
          <Text style={modalStyles.sectionTitle}>{t('screens.activities.status')}</Text>
          <View style={[statusStyles.badge, { backgroundColor: `${statusColor}20` }]}>
            <MaterialCommunityIcons name={statusIcon} size={iconSizes.md} color={statusColor} />
            <Text style={[statusStyles.text, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={modalStyles.section}>
          <Text style={modalStyles.sectionTitle}>{t('screens.activities.participants')}</Text>
          {participants.map((p) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              currentUserId={currentUserId}
              t={t}
              styles={participantStyles}
              onContact={onContact}
            />
          ))}
        </View>

        <View style={modalStyles.section}>
          <StandardButton
            fullWidth
            title={t('screens.activities.createGroupChat')}
            icon={ICONS.WHATSAPP}
            variant={COMPONENT_VARIANT.primary}
            onPress={onGroupChat}
          />
          {match.status === MatchStatus.PENDING && (
            <StandardButton
              fullWidth
              title={t('screens.activities.skipActivity')}
              icon={ICONS.CLOSE}
              variant={COMPONENT_VARIANT.danger}
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

export default ActivitiesScreen;
