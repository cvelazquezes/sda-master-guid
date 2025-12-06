/**
 * HomeScreen
 * Main dashboard for regular users
 * Supports dynamic theming (light/dark mode)
 *
 * ✅ REFACTORED: Uses UI primitives instead of raw React Native components
 * - Text → Text primitive from @/ui
 * - View kept for layout only (no colors/styles defined directly)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import { Club, User, MatchStatus } from '../../types';
import { ClubDetailModal } from '../../components/ClubDetailModal';
import { ClubCard } from '../../components/ClubCard';
import { StatCard } from '../../components/StatCard';
import { designTokens, layoutConstants } from '../../shared/theme';
// ✅ GOOD: Import UI primitives (Text, Card, etc.)
import { Text, EmptyState, Card, SectionHeader } from '../../shared/components';
import { COMPONENT_VARIANT, ICONS, MESSAGES, TABS, flexValues } from '../../shared/constants';
import { DISPLAY_LIMITS } from '../../shared/constants/http';

interface HomeStats {
  totalMembers: number;
  upcomingMeetings: number;
  pendingFees: number;
  upcomingActivities: number;
}

// Custom hook for home data
interface UseHomeDataReturn {
  club: Club | null;
  stats: HomeStats;
  recentMembers: User[];
  refreshing: boolean;
  refresh: () => void;
}

function useHomeData(clubId?: string): UseHomeDataReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<HomeStats>({
    totalMembers: 0,
    upcomingMeetings: 0,
    pendingFees: 0,
    upcomingActivities: 0,
  });
  const [recentMembers, setRecentMembers] = useState<User[]>([]);

  const loadData = useCallback(async () => {
    if (!clubId) {
      return;
    }
    try {
      const [clubData, members, matches] = await Promise.all([
        clubService.getClub(clubId),
        clubService.getClubMembers(clubId),
        matchService.getMyMatches(),
      ]);
      setClub(clubData);
      const activeMembers = members.filter((m) => m.isActive);
      const upcoming = matches.filter(
        (m) => m.status === MatchStatus.PENDING || m.status === MatchStatus.SCHEDULED
      );
      setStats({
        totalMembers: activeMembers.length,
        upcomingMeetings: 0,
        pendingFees: 0,
        upcomingActivities: upcoming.length,
      });
      const sorted = [...activeMembers].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setRecentMembers(sorted.slice(0, DISPLAY_LIMITS.MAX_PREVIEW_ITEMS));
    } catch {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DATA);
    } finally {
      setRefreshing(false);
    }
  }, [clubId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = (): void => {
    setRefreshing(true);
    loadData();
  };

  return { club, stats, recentMembers, refreshing, refresh };
}

// Stats grid component
interface HomeStatsGridProps {
  stats: HomeStats;
  colors: ReturnType<typeof useTheme>['colors'];
  t: ReturnType<typeof useTranslation>['t'];
  navigation: ReturnType<typeof useNavigation>;
}

function HomeStatsGrid({ stats, colors, t, navigation }: HomeStatsGridProps): React.JSX.Element {
  return (
    <View style={styles.section}>
      <SectionHeader title={t('sections.clubOverview')} />
      <View style={styles.statsGrid}>
        <StatCard
          icon={ICONS.ACCOUNT_GROUP}
          label={t('stats.members')}
          value={stats.totalMembers}
          color={colors.info}
          onPress={() => navigation.navigate(TABS.MEMBERS as never)}
        />
        <StatCard
          icon={ICONS.CALENDAR_CHECK}
          label={t('stats.meetings')}
          value={stats.upcomingMeetings}
          color={colors.success}
          subtitle={t('screens.home.upcoming')}
        />
      </View>
      <View style={styles.statsGrid}>
        <StatCard
          icon={ICONS.CALENDAR_CLOCK}
          label={t('stats.meetings')}
          value={stats.upcomingActivities}
          color={colors.primary}
          subtitle={t('screens.home.upcoming')}
          onPress={() => navigation.navigate(TABS.MEETINGS as never)}
        />
        <StatCard
          icon={ICONS.CASH}
          label={t('stats.finances')}
          value={stats.pendingFees}
          color={colors.warning}
          subtitle={t('screens.home.pending')}
          onPress={() => navigation.navigate(TABS.FINANCES as never)}
        />
      </View>
    </View>
  );
}

// Recent members section
interface RecentMembersSectionProps {
  members: User[];
  colors: ReturnType<typeof useTheme>['colors'];
  t: ReturnType<typeof useTranslation>['t'];
}

function RecentMembersSection({
  members,
  colors,
  t,
}: RecentMembersSectionProps): React.JSX.Element | null {
  if (members.length === 0) {
    return null;
  }
  return (
    <View style={styles.section}>
      <SectionHeader title={t('sections.recentMembers')} />
      {members.map((m) => (
        <Card key={m.id} variant={COMPONENT_VARIANT.elevated} style={styles.memberCard}>
          <View style={styles.memberRow}>
            <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
              <Text variant="h4" color="onPrimary">
                {m.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.memberInfo}>
              <Text variant="bodyLarge" weight="bold">
                {m.name}
              </Text>
              <Text variant="caption" color="secondary">
                {m.email}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={ICONS.ACCOUNT_CHECK}
              size={designTokens.iconSize.lg}
              color={colors.success}
            />
          </View>
        </Card>
      ))}
    </View>
  );
}

// Common prop types
type HomeColors = HomeStatsGridProps['colors'];
type HomeT = HomeStatsGridProps['t'];

// No club empty state
interface NoClubEmptyStateProps {
  colors: HomeColors;
  t: HomeT;
}

function NoClubEmptyState({ colors, t }: NoClubEmptyStateProps): React.JSX.Element {
  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <EmptyState
        icon={ICONS.ACCOUNT_ALERT}
        title={t('screens.home.notPartOfClub')}
        description={t('screens.home.contactAdminDescription')}
        iconColor={colors.warning}
      />
    </View>
  );
}

// Welcome header
interface WelcomeHeaderProps {
  user: User;
  colors: HomeColors;
  t: HomeT;
}

function WelcomeHeader({ user, colors, t }: WelcomeHeaderProps): React.JSX.Element {
  const headerStyle = [
    styles.header,
    { backgroundColor: colors.background, borderBottomColor: colors.border },
  ];
  return (
    <View style={headerStyle}>
      <Text variant="h1" style={styles.welcomeText}>
        {t('screens.home.welcomeBack', { name: user.name })}
      </Text>
      <Text variant="body" color="secondary">
        {t('screens.home.clubHappenings')}
      </Text>
    </View>
  );
}

// Inactive account banner
interface InactiveBannerProps {
  colors: HomeColors;
  t: HomeT;
}

function InactiveBanner({ colors, t }: InactiveBannerProps): React.JSX.Element {
  const bannerStyle = [styles.inactiveBanner, { borderLeftColor: colors.error }];
  return (
    <Card variant={COMPONENT_VARIANT.outlined} style={bannerStyle}>
      <View style={styles.inactiveBannerContent}>
        <MaterialCommunityIcons
          name={ICONS.ALERT_CIRCLE}
          size={designTokens.icon.sizes.lg}
          color={colors.error}
        />
        <View style={styles.inactiveBannerText}>
          <Text variant="bodyLarge" weight="bold" color="error">
            {t('screens.home.accountInactive')}
          </Text>
          <Text variant="bodySmall" color="secondary">
            {t('screens.home.inactiveAccountDescription')}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const HomeScreen = (): React.JSX.Element => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [clubDetailVisible, setClubDetailVisible] = useState(false);
  const homeData = useHomeData(user?.clubId);

  if (!user?.clubId) {
    return <NoClubEmptyState colors={colors} t={t} />;
  }

  const containerStyle = [styles.container, { backgroundColor: colors.backgroundSecondary }];
  const refreshControl = (
    <RefreshControl
      refreshing={homeData.refreshing}
      onRefresh={homeData.refresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
    />
  );

  return (
    <ScrollView style={containerStyle} refreshControl={refreshControl}>
      <WelcomeHeader user={user} colors={colors} t={t} />
      {homeData.club && (
        <View style={styles.clubSection}>
          <ClubCard club={homeData.club} onPress={() => setClubDetailVisible(true)} />
        </View>
      )}
      <HomeStatsGrid stats={homeData.stats} colors={colors} t={t} navigation={navigation} />
      <RecentMembersSection members={homeData.recentMembers} colors={colors} t={t} />
      {!user.isActive && <InactiveBanner colors={colors} t={t} />}
      <ClubDetailModal
        visible={clubDetailVisible}
        club={homeData.club}
        onClose={() => setClubDetailVisible(false)}
      />
    </ScrollView>
  );
};

/**
 * Styles - Simplified since Text primitive handles typography
 *
 * ✅ GOOD: Only layout styles (flex, margin, padding) are defined here
 * ❌ BAD: No inline colors, font sizes, or typography - use tokens/primitives
 */
const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
  },
  header: {
    padding: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  // Typography handled by Text variant="h1"
  welcomeText: {
    marginBottom: designTokens.spacing.xs,
  },
  // Removed subtitleText - handled by Text variant="body" color="secondary"
  clubSection: {
    padding: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.none,
  },
  section: {
    padding: designTokens.spacing.lg,
  },
  statsGrid: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
  },
  memberCard: {
    marginBottom: designTokens.spacing.md,
  },
  memberRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  memberAvatar: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius['2xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  // Removed memberAvatarText - handled by Text variant="h4" color="onPrimary"
  memberInfo: {
    flex: flexValues.one,
    gap: designTokens.spacing.xxs,
  },
  // Removed memberName/memberEmail - handled by Text variant props
  inactiveBanner: {
    margin: designTokens.spacing.lg,
    borderLeftWidth: designTokens.borderWidth.heavy,
  },
  inactiveBannerContent: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  inactiveBannerText: {
    flex: flexValues.one,
    gap: designTokens.spacing.xs,
  },
  // Removed inactiveBannerTitle/Description - handled by Text variant props
});

export default HomeScreen;
