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
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme, ThemeContextType } from '../../contexts/ThemeContext';
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import { Club, User, MatchStatus } from '../../types';
import { ClubDetailModal } from '../../components/ClubDetailModal';
import { ClubCard } from '../../components/ClubCard';
import { StatCard } from '../../components/StatCard';
// ✅ GOOD: Import UI primitives (Text, Card, etc.)
import { Text, EmptyState, Card, SectionHeader } from '../../shared/components';
import {
  COMPONENT_VARIANT,
  ICONS,
  TABS,
  FLEX,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../shared/constants';
import { DISPLAY_LIMITS } from '../../shared/constants/http';
import { BORDER_WIDTH } from '../../shared/constants/numbers';

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
      Alert.alert(i18next.t('common.error'), i18next.t('errors.failedToLoadData'));
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
  colors: ThemeContextType['colors'];
  spacing: ThemeContextType['spacing'];
  t: ReturnType<typeof useTranslation>['t'];
  navigation: ReturnType<typeof useNavigation>;
}

function HomeStatsGrid({
  stats,
  colors,
  spacing,
  t,
  navigation,
}: HomeStatsGridProps): React.JSX.Element {
  const gridStyle = { flexDirection: 'row' as const, gap: spacing.md, marginBottom: spacing.md };

  return (
    <View style={{ padding: spacing.lg }}>
      <SectionHeader title={t('sections.clubOverview')} />
      <View style={gridStyle}>
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
      <View style={gridStyle}>
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
  colors: ThemeContextType['colors'];
  spacing: ThemeContextType['spacing'];
  radii: ThemeContextType['radii'];
  iconSizes: ThemeContextType['iconSizes'];
  componentSizes: ThemeContextType['componentSizes'];
  t: ReturnType<typeof useTranslation>['t'];
}

function RecentMembersSection({
  members,
  colors,
  spacing,
  radii,
  iconSizes,
  componentSizes,
  t,
}: RecentMembersSectionProps): React.JSX.Element | null {
  if (members.length === 0) {
    return null;
  }

  const memberAvatarStyle = {
    width: componentSizes.iconContainer.md,
    height: componentSizes.iconContainer.md,
    borderRadius: radii['2xl'],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.primary,
  };

  return (
    <View style={{ padding: spacing.lg }}>
      <SectionHeader title={t('sections.recentMembers')} />
      {members.map((m) => (
        <Card key={m.id} variant={COMPONENT_VARIANT.elevated} style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={memberAvatarStyle}>
              <Text variant={TEXT_VARIANT.H4} color={TEXT_COLOR.ON_PRIMARY}>
                {m.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: FLEX.ONE, gap: spacing.xxs }}>
              <Text variant={TEXT_VARIANT.BODY_LARGE} weight={TEXT_WEIGHT.BOLD}>
                {m.name}
              </Text>
              <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.SECONDARY}>
                {m.email}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={ICONS.ACCOUNT_CHECK}
              size={iconSizes.lg}
              color={colors.success}
            />
          </View>
        </Card>
      ))}
    </View>
  );
}

// Common prop types
type HomeColors = ThemeContextType['colors'];
type HomeSpacing = ThemeContextType['spacing'];
type HomeT = HomeStatsGridProps['t'];

// No club empty state
interface NoClubEmptyStateProps {
  colors: HomeColors;
  t: HomeT;
}

function NoClubEmptyState({ colors, t }: NoClubEmptyStateProps): React.JSX.Element {
  return (
    <View style={{ flex: FLEX.ONE, backgroundColor: colors.backgroundSecondary }}>
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
  spacing: HomeSpacing;
  t: HomeT;
}

function WelcomeHeader({ user, colors, spacing, t }: WelcomeHeaderProps): React.JSX.Element {
  const headerStyle = {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: BORDER_WIDTH.THIN,
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
  };

  return (
    <View style={headerStyle}>
      <Text variant={TEXT_VARIANT.H1} style={{ marginBottom: spacing.xs }}>
        {t('screens.home.welcomeBack', { name: user.name })}
      </Text>
      <Text variant={TEXT_VARIANT.BODY} color={TEXT_COLOR.SECONDARY}>
        {t('screens.home.clubHappenings')}
      </Text>
    </View>
  );
}

// Inactive account banner
interface InactiveBannerProps {
  colors: HomeColors;
  spacing: HomeSpacing;
  iconSizes: ThemeContextType['iconSizes'];
  t: HomeT;
}

function InactiveBanner({ colors, spacing, iconSizes, t }: InactiveBannerProps): React.JSX.Element {
  const bannerStyle = {
    margin: spacing.lg,
    borderLeftWidth: BORDER_WIDTH.HEAVY,
    borderLeftColor: colors.error,
  };

  return (
    <Card variant={COMPONENT_VARIANT.outlined} style={bannerStyle}>
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <MaterialCommunityIcons
          name={ICONS.ALERT_CIRCLE}
          size={iconSizes.lg}
          color={colors.error}
        />
        <View style={{ flex: FLEX.ONE, gap: spacing.xs }}>
          <Text
            variant={TEXT_VARIANT.BODY_LARGE}
            weight={TEXT_WEIGHT.BOLD}
            color={TEXT_COLOR.ERROR}
          >
            {t('screens.home.accountInactive')}
          </Text>
          <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.SECONDARY}>
            {t('screens.home.inactiveAccountDescription')}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const HomeScreen = (): React.JSX.Element => {
  const { user } = useAuth();
  const { colors, spacing, radii, iconSizes, componentSizes } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [clubDetailVisible, setClubDetailVisible] = useState(false);
  const homeData = useHomeData(user?.clubId);

  if (!user?.clubId) {
    return <NoClubEmptyState colors={colors} t={t} />;
  }

  const containerStyle = { flex: FLEX.ONE, backgroundColor: colors.backgroundSecondary };
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
      <WelcomeHeader user={user} colors={colors} spacing={spacing} t={t} />
      {homeData.club && (
        <View style={{ padding: spacing.lg, paddingBottom: spacing.none }}>
          <ClubCard club={homeData.club} onPress={() => setClubDetailVisible(true)} />
        </View>
      )}
      <HomeStatsGrid
        stats={homeData.stats}
        colors={colors}
        spacing={spacing}
        t={t}
        navigation={navigation}
      />
      <RecentMembersSection
        members={homeData.recentMembers}
        colors={colors}
        spacing={spacing}
        radii={radii}
        iconSizes={iconSizes}
        componentSizes={componentSizes}
        t={t}
      />
      {!user.isActive && (
        <InactiveBanner colors={colors} spacing={spacing} iconSizes={iconSizes} t={t} />
      )}
      <ClubDetailModal
        visible={clubDetailVisible}
        club={homeData.club}
        onClose={() => setClubDetailVisible(false)}
      />
    </ScrollView>
  );
};

// Note: Styles are now inline using theme values from useTheme()
// This ensures proper theme compliance and removes designTokens imports

export default HomeScreen;
