import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { clubService } from '../../../infrastructure/repositories/clubService';
import { matchService } from '../../../infrastructure/repositories/matchService';
import {
  ALERT_BUTTON_STYLE,
  BUTTON_SIZE,
  COMPONENT_VARIANT,
  DATE_FORMATS,
  ICONS,
  MESSAGES,
  SCREENS,
  FLEX,
} from '../../../shared/constants';
import { MATH, BORDER_WIDTH } from '../../../shared/constants/numbers';
import { Text, Button, PageHeader } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../../theme';
import { designTokens } from '../../theme/designTokens';
import type { MatchRound, Club } from '../../../types';

type TranslationFn = ReturnType<typeof useTranslation>['t'];

// Custom hook for match rounds data
type UseMatchRoundsDataReturn = {
  club: Club | null;
  matchRounds: MatchRound[];
  refreshing: boolean;
  generating: boolean;
  setGenerating: (value: boolean) => void;
  onRefresh: () => void;
  loadData: () => Promise<void>;
};

function useMatchRoundsData(clubId?: string): UseMatchRoundsDataReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [matchRounds, setMatchRounds] = useState<MatchRound[]>([]);
  const [, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (): Promise<void> => {
    if (!clubId) {
      return;
    }
    try {
      const [clubData, roundsData] = await Promise.all([
        clubService.getClub(clubId),
        matchService.getMatchRounds(clubId),
      ]);
      setClub(clubData);
      setMatchRounds(
        roundsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    } catch {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DATA);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      loadData();
    }
  }, [clubId, loadData]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadData();
  };

  return { club, matchRounds, refreshing, generating, setGenerating, onRefresh, loadData };
}

// Round card component
function RoundCard({ round }: { round: MatchRound }): React.JSX.Element {
  const { t } = useTranslation();
  const activityCount = round.matches.length;
  const activityLabel = t('common.activity', { count: activityCount });
  return (
    <View style={styles.roundCard}>
      <View style={styles.roundHeader}>
        <View style={styles.roundInfo}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_CLOCK}
            size={mobileIconSizes.large}
            color={designTokens.colors.primary}
          />
          <View style={styles.roundDetails}>
            <Text style={styles.roundDate}>
              {format(new Date(round.scheduledDate), DATE_FORMATS.DATE_FNS_DATE_DISPLAY)}
            </Text>
            <Text style={styles.roundStatus}>
              {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.roundBadge}>
          <Text style={styles.roundBadgeText}>
            {activityCount} {activityLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.roundCreated}>
        Created: {format(new Date(round.createdAt), DATE_FORMATS.DATE_FNS_DATETIME_SHORT)}
      </Text>
    </View>
  );
}

// Generate matches handler
function createGenerateHandler(
  clubId: string | undefined,
  t: TranslationFn,
  setGenerating: (v: boolean) => void,
  loadData: () => Promise<void>
): () => void {
  return (): void => {
    if (!clubId) {
      return;
    }
    Alert.alert(MESSAGES.TITLES.GENERATE_ACTIVITIES, MESSAGES.WARNINGS.CONFIRM_GENERATE_MATCHES, [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('screens.generateMatches.generateButton'),
        onPress: async () => {
          setGenerating(true);
          try {
            await matchService.generateMatches(clubId);
            Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.ACTIVITIES_GENERATED);
            loadData();
          } catch (error: unknown) {
            const msg =
              error instanceof Error
                ? error.message
                : t('screens.generateMatches.failedToGenerate');
            Alert.alert(MESSAGES.TITLES.ERROR, msg);
          } finally {
            setGenerating(false);
          }
        },
      },
    ]);
  };
}

// Header section props
// Action buttons
function ActionButtonsSection({
  generating,
  generateTitle,
  onGenerate,
  onViewAll,
}: {
  generating: boolean;
  generateTitle: string;
  onGenerate: () => void;
  onViewAll: () => void;
}): React.JSX.Element {
  return (
    <View style={styles.actionsContainer}>
      <Button
        fullWidth
        title={generateTitle}
        icon={ICONS.ACCOUNT_HEART}
        variant={COMPONENT_VARIANT.primary}
        size={BUTTON_SIZE.large}
        loading={generating}
        onPress={onGenerate}
      />
      <Button
        fullWidth
        title={t('screens.generateMatches.viewAllActivities')}
        icon={ICONS.VIEW_LIST}
        variant={COMPONENT_VARIANT.secondary}
        size={BUTTON_SIZE.large}
        onPress={onViewAll}
      />
    </View>
  );
}

// Empty rounds state
function EmptyRoundsState({ t }: { t: TranslationFn }): React.JSX.Element {
  const iconSize = mobileIconSizes.xxlarge * MATH.SPACING_MULTIPLIER;
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_HEART_OUTLINE}
        size={iconSize}
        color={designTokens.colors.textTertiary}
      />
      <Text style={styles.emptyText}>{t('screens.generateMatches.noActivityRounds')}</Text>
      <Text style={styles.emptySubtext}>{t('screens.generateMatches.getStarted')}</Text>
    </View>
  );
}

// Rounds list section
type RoundsSectionProps = {
  matchRounds: MatchRound[];
  t: TranslationFn;
  onViewHistory: () => void;
};

function RoundsSection({ matchRounds, t, onViewHistory }: RoundsSectionProps): React.JSX.Element {
  const displayRounds = matchRounds.slice(0, MATH.FIVE);
  const hasMoreRounds = matchRounds.length > MATH.FIVE;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('screens.generateMatches.activityRoundsHistory')}</Text>
      {matchRounds.length === 0 ? (
        <EmptyRoundsState t={t} />
      ) : (
        displayRounds.map((round) => <RoundCard key={round.id} round={round} />)
      )}
      {hasMoreRounds && (
        <Button
          fullWidth
          title={t('screens.generateMatches.viewAllMatchHistory')}
          icon={ICONS.HISTORY}
          variant={COMPONENT_VARIANT.ghost}
          onPress={onViewHistory}
        />
      )}
    </View>
  );
}

const GenerateMatchesScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const { club, matchRounds, refreshing, generating, setGenerating, onRefresh, loadData } =
    useMatchRoundsData(user?.clubId);
  const handleGenerate = createGenerateHandler(user?.clubId, t, setGenerating, loadData);
  const generateTitle = generating
    ? t('screens.generateMatches.generating')
    : t('screens.generateMatches.generateNewRound');
  const navigateToMatches = (): void => navigation.navigate(SCREENS.CLUB_MATCHES as never);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <PageHeader
        showActions
        title={t('screens.generateMatches.title')}
        subtitle={
          club
            ? t('screens.generateMatches.clubActivities', {
                clubName: club.name,
                frequency: t(`club.matchFrequency.${club.matchFrequency}`),
              })
            : undefined
        }
      />
      <View style={styles.content}>
        <ActionButtonsSection
          generating={generating}
          generateTitle={generateTitle}
          onGenerate={handleGenerate}
          onViewAll={navigateToMatches}
        />
        <RoundsSection matchRounds={matchRounds} t={t} onViewHistory={navigateToMatches} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.ONE,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  content: {
    padding: designTokens.spacing.lg,
  },
  actionsContainer: {
    marginBottom: designTokens.spacing.xxl,
    gap: designTokens.spacing.md,
  },
  section: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.lg,
  },
  roundCard: {
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    borderLeftWidth: BORDER_WIDTH.EXTRA_THICK,
    borderLeftColor: designTokens.colors.primary,
  },
  roundHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  roundInfo: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: FLEX.ONE,
  },
  roundDetails: {
    marginLeft: designTokens.spacing.md,
  },
  roundDate: {
    ...mobileTypography.bodyLargeBold,
  },
  roundStatus: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xs,
  },
  roundBadge: {
    backgroundColor: designTokens.colors.infoLight,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
  },
  roundBadgeText: {
    ...mobileTypography.captionBold,
    color: designTokens.colors.info,
  },
  roundCreated: {
    ...mobileTypography.caption,
    color: designTokens.colors.textTertiary,
  },
  emptyContainer: {
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing['4xl'],
  },
  emptyText: {
    ...mobileTypography.heading4,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.lg,
  },
  emptySubtext: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textTertiary,
    marginTop: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
  },
});

export default GenerateMatchesScreen;
