/**
 * ClubAdminDashboardScreen
 * Dashboard for club administrators
 * Supports dynamic theming (light/dark mode)
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ClubDetailModal } from '../../components/ClubDetailModal';
import { ClubCard } from '../../components/ClubCard';
import { StatCard } from '../../components/StatCard';
import { clubService } from '../../services/clubService';
import { matchService } from '../../services/matchService';
import { Club } from '../../types';
import { designTokens } from '../../shared/theme/designTokens';
import { layoutConstants } from '../../shared/theme';
import { ScreenHeader, SectionHeader, MenuCard } from '../../shared/components';
import { MESSAGES, ICONS, TABS, SCREENS, MENU_ITEM_IDS } from '../../shared/constants';
import { ApprovalStatus, MatchStatus } from '../../types';
import { flexValues } from '../../shared/constants/layoutConstants';
import { useTranslation } from 'react-i18next';

const ClubAdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [club, setClub] = useState<Club | null>(null);
  const [clubDetailVisible, setClubDetailVisible] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingApprovals: 0,
    upcomingMatches: 0,
  });

  useEffect(() => {
    if (user?.clubId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.clubId) return;
    try {
      const [clubData, members, matches] = await Promise.all([
        clubService.getClub(user.clubId),
        clubService.getClubMembers(user.clubId),
        matchService.getClubMatches(user.clubId),
      ]);
      
      setClub(clubData);
      setStats({
        totalMembers: members.length,
        activeMembers: members.filter((m) => m.isActive).length,
        pendingApprovals: members.filter((m) => m.approvalStatus === ApprovalStatus.PENDING).length,
        upcomingMatches: matches.filter((m) => m.status === MatchStatus.PENDING || m.status === MatchStatus.SCHEDULED).length,
      });
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_CLUB_INFO);
    }
  };

  const quickActions = [
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScreenHeader
        title={t('screens.clubDashboard.title')}
        subtitle={t('screens.clubDashboard.subtitle')}
      >
        {/* Show club card in header */}
        {club && (
          <View style={styles.clubCardContainer}>
            <ClubCard
              club={club}
              onPress={() => setClubDetailVisible(true)}
            />
          </View>
        )}
      </ScreenHeader>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <SectionHeader title={t('sections.clubOverview')} />
        <View style={styles.statsGrid}>
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
          <View style={styles.statsRow}>
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

      {/* Quick Actions Menu */}
      <View style={styles.content}>
        <SectionHeader title={t('sections.quickActions')} />
        {quickActions.map((item) => (
          <MenuCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            color={item.color}
            badge={item.badge}
            onPress={() => navigation.navigate(item.screen as never)}
          />
        ))}
      </View>

      {/* Club Detail Modal */}
      <ClubDetailModal
        visible={clubDetailVisible}
        club={club}
        onClose={() => setClubDetailVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
  },
  clubCardContainer: {
    marginTop: designTokens.spacing.lg,
  },
  statsSection: {
    padding: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.none,
  },
  statsGrid: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
  },
  statsRow: {
    marginBottom: designTokens.spacing.md,
  },
  content: {
    padding: designTokens.spacing.lg,
  },
});

export default ClubAdminDashboardScreen;
