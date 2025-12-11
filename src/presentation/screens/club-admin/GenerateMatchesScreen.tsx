import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, Alert, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { t as i18nT } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  createScreenStyles,
  createSectionStylesLocal,
  createRoundCardStyles,
  createEmptyStyles,
} from './generate-matches/styles';
import { clubService } from '../../../infrastructure/repositories/clubService';
import { matchService } from '../../../infrastructure/repositories/matchService';
import {
  ALERT_BUTTON_STYLE,
  BUTTON_SIZE,
  COMPONENT_VARIANT,
  DATE_FORMATS,
  ICONS,
  SCREENS,
} from '../../../shared/constants';
import { MATH } from '../../../shared/constants/numbers';
import { Text, Button, PageHeader } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { useTheme } from '../../state/ThemeContext';
import type { MatchRound, Club } from '../../../types';

type TranslationFn = ReturnType<typeof useTranslation>['t'];

// Hook to create all styles
function useGenerateMatchesStyles(): {
  screenStyles: ReturnType<typeof createScreenStyles>;
  sectionStylesLocal: ReturnType<typeof createSectionStylesLocal>;
  roundCardStyles: ReturnType<typeof createRoundCardStyles>;
  emptyStyles: ReturnType<typeof createEmptyStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
} {
  const { colors, spacing, radii, typography, iconSizes } = useTheme();

  const screenStyles = useMemo(() => createScreenStyles(colors, spacing), [colors, spacing]);
  const sectionStylesLocal = useMemo(
    () => createSectionStylesLocal(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const roundCardStyles = useMemo(
    () => createRoundCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const emptyStyles = useMemo(
    () => createEmptyStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );

  return {
    screenStyles,
    sectionStylesLocal,
    roundCardStyles,
    emptyStyles,
    colors,
    iconSizes,
  };
}

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
  const [loading, setLoading] = useState(true);
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
      Alert.alert(i18nT('common.error'), i18nT('errors.failedToLoadData'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      void loadData();
    }
  }, [clubId, loadData]);

  const onRefresh = (): void => {
    setRefreshing(true);
    void loadData();
  };

  // Suppress unused variable warning - loading is managed internally
  void loading;

  return { club, matchRounds, refreshing, generating, setGenerating, onRefresh, loadData };
}

// Round card component
type RoundCardProps = {
  round: MatchRound;
  styles: ReturnType<typeof createRoundCardStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
};

function RoundCard({ round, styles, colors, iconSizes }: RoundCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const activityCount = round.matches.length;
  const activityLabel = t('common.activity', { count: activityCount });
  const formattedDate = format(new Date(round.createdAt), DATE_FORMATS.DATE_FNS_DATETIME_SHORT);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_CLOCK}
            size={iconSizes.lg}
            color={colors.primary}
          />
          <View style={styles.details}>
            <Text style={styles.date}>
              {format(new Date(round.scheduledDate), DATE_FORMATS.DATE_FNS_DATE_DISPLAY)}
            </Text>
            <Text style={styles.status}>
              {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {activityCount} {activityLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.created}>
        {t('screens.generateMatches.createdOn', { date: formattedDate })}
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
    Alert.alert(t('titles.generateActivities'), t('screens.generateMatches.confirmGenerate'), [
      { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('screens.generateMatches.generateButton'),
        onPress: (): void => {
          setGenerating(true);
          matchService
            .generateMatches(clubId)
            .then(() => {
              Alert.alert(t('common.success'), t('screens.generateMatches.activitiesGenerated'));
              void loadData();
            })
            .catch((error: unknown) => {
              const msg =
                error instanceof Error
                  ? error.message
                  : t('screens.generateMatches.failedToGenerate');
              Alert.alert(t('common.error'), msg);
            })
            .finally(() => {
              setGenerating(false);
            });
        },
      },
    ]);
  };
}

// Action buttons
type ActionButtonsSectionProps = {
  generating: boolean;
  generateTitle: string;
  viewAllTitle: string;
  onGenerate: () => void;
  onViewAll: () => void;
  styles: ReturnType<typeof createScreenStyles>;
};

function ActionButtonsSection({
  generating,
  generateTitle,
  viewAllTitle,
  onGenerate,
  onViewAll,
  styles,
}: ActionButtonsSectionProps): React.JSX.Element {
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
        title={viewAllTitle}
        icon={ICONS.VIEW_LIST}
        variant={COMPONENT_VARIANT.secondary}
        size={BUTTON_SIZE.large}
        onPress={onViewAll}
      />
    </View>
  );
}

// Empty rounds state
type EmptyRoundsStateProps = {
  t: TranslationFn;
  styles: ReturnType<typeof createEmptyStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
};

function EmptyRoundsState({
  t,
  styles,
  colors,
  iconSizes,
}: EmptyRoundsStateProps): React.JSX.Element {
  // eslint-disable-next-line no-magic-numbers -- Icon size fallback
  const iconSize = (iconSizes.xxl ?? iconSizes['2xl'] ?? 48) * MATH.SPACING_MULTIPLIER;
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_HEART_OUTLINE}
        size={iconSize}
        color={colors.textTertiary}
      />
      <Text style={styles.title}>{t('screens.generateMatches.noActivityRounds')}</Text>
      <Text style={styles.subtitle}>{t('screens.generateMatches.getStarted')}</Text>
    </View>
  );
}

// Rounds list section
type RoundsSectionProps = {
  matchRounds: MatchRound[];
  t: TranslationFn;
  onViewHistory: () => void;
  sectionStyles: ReturnType<typeof createSectionStylesLocal>;
  roundStyles: ReturnType<typeof createRoundCardStyles>;
  emptyStyles: ReturnType<typeof createEmptyStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
};

function RoundsSection({
  matchRounds,
  t,
  onViewHistory,
  sectionStyles,
  roundStyles,
  emptyStyles,
  colors,
  iconSizes,
}: RoundsSectionProps): React.JSX.Element {
  const displayRounds = matchRounds.slice(0, MATH.FIVE);
  const hasMoreRounds = matchRounds.length > MATH.FIVE;

  return (
    <View style={sectionStyles.section}>
      <Text style={sectionStyles.title}>{t('screens.generateMatches.activityRoundsHistory')}</Text>
      {matchRounds.length === 0 ? (
        <EmptyRoundsState t={t} styles={emptyStyles} colors={colors} iconSizes={iconSizes} />
      ) : (
        displayRounds.map((round) => (
          <RoundCard
            key={round.id}
            round={round}
            styles={roundStyles}
            colors={colors}
            iconSizes={iconSizes}
          />
        ))
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
  const styles = useGenerateMatchesStyles();
  const clubId = user?.clubId ?? undefined;
  const { club, matchRounds, refreshing, generating, setGenerating, onRefresh, loadData } =
    useMatchRoundsData(clubId);
  const handleGenerate = createGenerateHandler(clubId, t, setGenerating, loadData);
  const generateTitle = generating
    ? t('screens.generateMatches.generating')
    : t('screens.generateMatches.generateNewRound');
  const navigateToMatches = (): void => navigation.navigate(SCREENS.CLUB_MATCHES as never);

  return (
    <ScrollView
      style={styles.screenStyles.container}
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
      <View style={styles.screenStyles.content}>
        <ActionButtonsSection
          generating={generating}
          generateTitle={generateTitle}
          viewAllTitle={t('screens.generateMatches.viewAllActivities')}
          styles={styles.screenStyles}
          onGenerate={handleGenerate}
          onViewAll={navigateToMatches}
        />
        <RoundsSection
          matchRounds={matchRounds}
          t={t}
          sectionStyles={styles.sectionStylesLocal}
          roundStyles={styles.roundCardStyles}
          emptyStyles={styles.emptyStyles}
          colors={styles.colors}
          iconSizes={styles.iconSizes}
          onViewHistory={navigateToMatches}
        />
      </View>
    </ScrollView>
  );
};

export default GenerateMatchesScreen;
