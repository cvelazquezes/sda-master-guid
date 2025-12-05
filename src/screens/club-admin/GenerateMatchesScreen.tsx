import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import { useAuth } from '../../context/AuthContext';
import { MatchRound, Club } from '../../types';
import { StandardButton } from '../../shared/components/StandardButton';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { format } from 'date-fns';
import { MESSAGES, ICONS, COMPONENT_VARIANT, BUTTON_SIZE, DATE_FORMATS, SCREENS, ALERT_BUTTON_STYLE } from '../../shared/constants';
import { flexValues } from '../../shared/constants/layoutConstants';

const GenerateMatchesScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [club, setClub] = useState<Club | null>(null);
  const [matchRounds, setMatchRounds] = useState<MatchRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.clubId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      const [clubData, roundsData] = await Promise.all([
        clubService.getClub(user.clubId),
        matchService.getMatchRounds(user.clubId),
      ]);
      setClub(clubData);
      setMatchRounds(roundsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DATA);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleGenerateMatches = () => {
    if (!user?.clubId) return;

    Alert.alert(
      MESSAGES.TITLES.GENERATE_ACTIVITIES,
      MESSAGES.WARNINGS.CONFIRM_GENERATE_MATCHES,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: t('screens.generateMatches.generateButton'),
          onPress: async () => {
            setGenerating(true);
            try {
              await matchService.generateMatches(user.clubId!);
              Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.ACTIVITIES_GENERATED);
              loadData();
            } catch (error: any) {
              Alert.alert(
                MESSAGES.TITLES.ERROR,
                error.response?.data?.message || t('screens.generateMatches.failedToGenerate')
              );
            } finally {
              setGenerating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.generateMatches.title')}</Text>
        {club && (
          <Text style={styles.subtitle}>
            {t('screens.generateMatches.clubActivities', { clubName: club.name, frequency: t(`club.matchFrequency.${club.matchFrequency}`) })}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <StandardButton
            title={generating ? t('screens.generateMatches.generating') : t('screens.generateMatches.generateNewRound')}
            icon={ICONS.ACCOUNT_HEART}
            variant={COMPONENT_VARIANT.primary}
            size={BUTTON_SIZE.large}
            fullWidth
            loading={generating}
            onPress={handleGenerateMatches}
          />
          <StandardButton
            title={t('screens.generateMatches.viewAllActivities')}
            icon={ICONS.VIEW_LIST}
            variant={COMPONENT_VARIANT.secondary}
            size={BUTTON_SIZE.large}
            fullWidth
            onPress={() => navigation.navigate(SCREENS.CLUB_MATCHES as never)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('screens.generateMatches.activityRoundsHistory')}</Text>
          {matchRounds.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name={ICONS.ACCOUNT_HEART_OUTLINE} size={mobileIconSizes.xxlarge * 1.5} color={designTokens.colors.textTertiary} />
              <Text style={styles.emptyText}>{t('screens.generateMatches.noActivityRounds')}</Text>
              <Text style={styles.emptySubtext}>
                {t('screens.generateMatches.getStarted')}
              </Text>
            </View>
          ) : (
            matchRounds.slice(0, 5).map((round) => (
              <View key={round.id} style={styles.roundCard}>
                <View style={styles.roundHeader}>
                  <View style={styles.roundInfo}>
                    <MaterialCommunityIcons name={ICONS.CALENDAR_CLOCK} size={mobileIconSizes.large} color={designTokens.colors.primary} />
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
                      {round.matches.length} activit{round.matches.length === 1 ? 'y' : 'ies'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.roundCreated}>
                  Created: {format(new Date(round.createdAt), DATE_FORMATS.DATE_FNS_DATETIME_SHORT)}
                </Text>
              </View>
            ))
          )}
          
          {matchRounds.length > 5 && (
            <StandardButton
              title={t('screens.generateMatches.viewAllMatchHistory')}
              icon={ICONS.HISTORY}
              variant={COMPONENT_VARIANT.ghost}
              fullWidth
              onPress={() => navigation.navigate(SCREENS.CLUB_MATCHES as never)}
            />
          )}
        </View>
      </View>
    </ScrollView>
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
    borderLeftWidth: 4,
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
    flex: flexValues.one,
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

