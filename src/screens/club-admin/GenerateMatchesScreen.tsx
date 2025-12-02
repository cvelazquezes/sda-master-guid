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
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import { useAuth } from '../../context/AuthContext';
import { MatchRound, Club } from '../../types';
import { StandardButton } from '../../shared/components/StandardButton';
import { mobileTypography, mobileIconSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { format } from 'date-fns';
import { MESSAGES } from '../../shared/constants';

const GenerateMatchesScreen = () => {
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
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            setGenerating(true);
            try {
              await matchService.generateMatches(user.clubId!);
              Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.ACTIVITIES_GENERATED);
              loadData();
            } catch (error: any) {
              Alert.alert(
                MESSAGES.TITLES.ERROR,
                error.response?.data?.message || 'Failed to generate activities'
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
        <Text style={styles.title}>Generate Social Activities</Text>
        {club && (
          <Text style={styles.subtitle}>
            {club.name} • {club.matchFrequency.replace('_', '-')} activities
          </Text>
        )}
      </View>

      <View style={styles.content}>
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <StandardButton
            title={generating ? 'Generating...' : 'Generate New Round'}
            icon="account-heart"
            variant="primary"
            size="large"
            fullWidth
            loading={generating}
            onPress={handleGenerateMatches}
          />
          <StandardButton
            title="View All Activities"
            icon="view-list"
            variant="secondary"
            size="large"
            fullWidth
            onPress={() => navigation.navigate('ClubMatches' as never)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Rounds History</Text>
          {matchRounds.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-heart-outline" size={mobileIconSizes.xxlarge * 1.5} color={designTokens.colors.textTertiary} />
              <Text style={styles.emptyText}>No activity rounds yet</Text>
              <Text style={styles.emptySubtext}>
                Generate your first activity round to get started
              </Text>
            </View>
          ) : (
            matchRounds.slice(0, 5).map((round) => (
              <View key={round.id} style={styles.roundCard}>
                <View style={styles.roundHeader}>
                  <View style={styles.roundInfo}>
                    <MaterialCommunityIcons name="calendar-clock" size={mobileIconSizes.large} color={designTokens.colors.primary} />
                    <View style={styles.roundDetails}>
                      <Text style={styles.roundDate}>
                        {format(new Date(round.scheduledDate), 'MMM dd, yyyy')}
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
                  Created: {format(new Date(round.createdAt), 'MMM dd, yyyy HH:mm')}
                </Text>
              </View>
            ))
          )}
          
          {matchRounds.length > 5 && (
            <StandardButton
              title="View All Match History"
              icon="history"
              variant="ghost"
              fullWidth
              onPress={() => navigation.navigate('ClubMatches' as never)}
            />
          )}
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: designTokens.spacing.lg,
  },
  actionsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  section: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: 16,
  },
  roundCard: {
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: designTokens.colors.primary,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roundDetails: {
    marginLeft: 12,
  },
  roundDate: {
    ...mobileTypography.bodyLargeBold,
  },
  roundStatus: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: 4,
  },
  roundBadge: {
    backgroundColor: designTokens.colors.infoLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    alignItems: 'center',
    padding: designTokens.spacing['4xl'],
  },
  emptyText: {
    ...mobileTypography.heading4,
    color: designTokens.colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textTertiary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default GenerateMatchesScreen;

