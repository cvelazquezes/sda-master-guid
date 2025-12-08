/**
 * ClubAdminDashboardScreen
 * Dashboard for club administrators
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useAuth } from '../../state/AuthContext';
import { useTheme, ThemeContextType } from '../../state/ThemeContext';
import { ClubDetailModal } from '../../components/features/ClubDetailModal';
import { ClubCard } from '../../components/features/ClubCard';
import { StatCard } from '../../components/features/StatCard';
import { clubService } from '../../../infrastructure/repositories/clubService';
import { matchService } from '../../../infrastructure/repositories/matchService';
import { Club, ApprovalStatus, MatchStatus } from '../../../types';
import { PageHeader, SectionHeader, MenuCard } from '../../components/primitives';
import { ICONS, MENU_ITEM_IDS, SCREENS, TABS, FLEX } from '../../../shared/constants';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  pendingApprovals: number;
  upcomingMatches: number;
}

// Custom hook for dashboard data
function useClubDashboardData(clubId?: string): {
  club: Club | null;
  stats: DashboardStats;
} {
  const [club, setClub] = useState<Club | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    pendingApprovals: 0,
    upcomingMatches: 0,
  });

  const loadData = useCallback(async () => {
    if (!clubId) {
      return;
    }
    try {
      const [clubData, members, matches] = await Promise.all([
        clubService.getClub(clubId),
        clubService.getClubMembers(clubId),
        matchService.getClubMatches(clubId),
      ]);
      setClub(clubData);
      const pending = members.filter((m) => m.approvalStatus === ApprovalStatus.PENDING);
      const upcoming = matches.filter(
        (m) => m.status === MatchStatus.PENDING || m.status === MatchStatus.SCHEDULED
      );
      setStats({
        totalMembers: members.length,
        activeMembers: members.filter((m) => m.isActive).length,
        pendingApprovals: pending.length,
        upcomingMatches: upcoming.length,
      });
    } catch {
      Alert.alert(i18next.t('common.error'), i18next.t('errors.failedToLoadClubInfo'));
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      loadData();
    }
  }, [clubId, loadData]);

  return { club, stats };
}

// Stats section component
interface DashboardStatsSectionProps {
  stats: DashboardStats;
  colors: ThemeContextType['colors'];
  spacing: ThemeContextType['spacing'];
  t: ReturnType<typeof useTranslation>['t'];
  navigation: ReturnType<typeof useNavigation>;
}

function DashboardStatsSection({
  stats,
  colors,
  spacing,
  t,
  navigation,
}: DashboardStatsSectionProps): React.JSX.Element {
  const gridStyle = { flexDirection: 'row' as const, gap: spacing.md, marginBottom: spacing.md };

  return (
    <View style={{ padding: spacing.lg, paddingBottom: spacing.none }}>
      <SectionHeader title={t('sections.clubOverview')} />
      <View style={gridStyle}>
        <StatCard
          icon={ICONS.ACCOUNT_GROUP}
          label={t('stats.members')}
          value={stats.totalMembers}
          color={colors.info}
          subtitle={t('screens.clubAdminDashboard.activeCount', { count: stats.activeMembers })}
          onPress={() => navigation.navigate(TABS.MEMBERS as never)}
        />
        <StatCard
          icon={ICONS.ACCOUNT_HEART}
          label={t('stats.activities')}
          value={stats.upcomingMatches}
          color={colors.success}
          subtitle={t('screens.clubAdminDashboard.upcoming')}
          onPress={() => navigation.navigate(TABS.MORE as never)}
        />
      </View>
      {stats.pendingApprovals > 0 && (
        <View style={{ marginBottom: spacing.md }}>
          <StatCard
            icon={ICONS.CLOCK_ALERT_OUTLINE}
            label={t('stats.pendingApprovals')}
            value={stats.pendingApprovals}
            color={colors.warning}
            subtitle={t('screens.clubAdminDashboard.membersAwaitingApproval')}
            onPress={() => navigation.navigate(TABS.MEMBERS as never)}
          />
        </View>
      )}
    </View>
  );
}

type TranslationFn = ReturnType<typeof useTranslation>['t'];
type ThemeColors = ThemeContextType['colors'];
type ThemeSpacing = ThemeContextType['spacing'];
type NavType = ReturnType<typeof useNavigation>;

// Quick action item interface
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen: string;
  color: string;
}

// Quick actions configuration
const createQuickActions = (t: TranslationFn, colors: ThemeColors): QuickAction[] => [
  {
    id: MENU_ITEM_IDS.ACTIVITIES,
    title: t('screens.clubDashboard.menuItems.generateActivities'),
    description: t('screens.clubDashboard.menuItems.generateActivitiesDescription'),
    icon: ICONS.ACCOUNT_HEART,
    screen: SCREENS.GENERATE_MATCHES,
    color: colors.success,
  },
  {
    id: MENU_ITEM_IDS.DIRECTIVE,
    title: t('screens.clubDashboard.menuItems.clubDirective'),
    description: t('screens.clubDashboard.menuItems.clubDirectiveDescription'),
    icon: ICONS.SHIELD_ACCOUNT,
    screen: SCREENS.CLUB_DIRECTIVE,
    color: colors.warning,
  },
  {
    id: MENU_ITEM_IDS.SETTINGS,
    title: t('screens.clubDashboard.menuItems.clubSettings'),
    description: t('screens.clubDashboard.menuItems.clubSettingsDescription'),
    icon: ICONS.COG,
    screen: SCREENS.CLUB_SETTINGS,
    color: colors.info,
  },
];

// Quick actions section props
interface QuickActionsSectionProps {
  t: TranslationFn;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  navigation: NavType;
}

function QuickActionsSection({
  t,
  colors,
  spacing,
  navigation,
}: QuickActionsSectionProps): React.JSX.Element {
  const quickActions = createQuickActions(t, colors);
  return (
    <View style={{ padding: spacing.lg }}>
      <SectionHeader title={t('sections.quickActions')} />
      {quickActions.map((item) => (
        <MenuCard
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
          color={item.color}
          onPress={() => navigation.navigate(item.screen as never)}
        />
      ))}
    </View>
  );
}

const ClubAdminDashboardScreen = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const [clubDetailVisible, setClubDetailVisible] = useState(false);
  const { club, stats } = useClubDashboardData(user?.clubId);

  const containerStyle = { flex: FLEX.ONE, backgroundColor: colors.backgroundSecondary };

  return (
    <ScrollView style={containerStyle}>
      <PageHeader
        title={t('screens.clubDashboard.title')}
        subtitle={t('screens.clubDashboard.subtitle')}
        showActions
      />
      {club && (
        <View style={{ marginTop: spacing.sm, paddingHorizontal: spacing.lg }}>
          <ClubCard club={club} onPress={() => setClubDetailVisible(true)} />
        </View>
      )}
      <DashboardStatsSection
        stats={stats}
        colors={colors}
        spacing={spacing}
        t={t}
        navigation={navigation}
      />
      <QuickActionsSection t={t} colors={colors} spacing={spacing} navigation={navigation} />
      <ClubDetailModal
        visible={clubDetailVisible}
        club={club}
        onClose={() => setClubDetailVisible(false)}
      />
    </ScrollView>
  );
};

export default ClubAdminDashboardScreen;
