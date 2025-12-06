/**
 * AdminDashboardScreen
 * Dashboard for platform administrators
 * Supports dynamic theming (light/dark mode)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { StatCard } from '../../components/StatCard';
import { userService } from '../../services/userService';
import { clubService } from '../../services/clubService';
import { designTokens } from '../../shared/theme/designTokens';
import { layoutConstants } from '../../shared/theme';
import { ScreenHeader, SectionHeader, MenuCard } from '../../shared/components';
import { logger } from '../../shared/utils/logger';
import { ApprovalStatus } from '../../types';
import { ICONS, LOG_MESSAGES, MENU_ITEM_IDS, SCREENS, flexValues } from '../../shared/constants';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalClubs: number;
  activeClubs: number;
  pendingApprovals: number;
}

const initialStats: DashboardStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalClubs: 0,
  activeClubs: 0,
  pendingApprovals: 0,
};

const loadDashboardStats = async (): Promise<DashboardStats> => {
  const [users, clubs] = await Promise.all([userService.getAllUsers(), clubService.getAllClubs()]);
  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    totalClubs: clubs.length,
    activeClubs: clubs.filter((c) => c.isActive).length,
    pendingApprovals: users.filter((u) => u.approvalStatus === ApprovalStatus.PENDING).length,
  };
};

const AdminDashboardScreen = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>(initialStats);

  const loadStats = useCallback(async () => {
    try {
      setStats(await loadDashboardStats());
    } catch (error) {
      logger.error(LOG_MESSAGES.SCREENS.ADMIN_DASHBOARD.FAILED_TO_LOAD_STATS, error as Error);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const menuItems = [
    {
      id: MENU_ITEM_IDS.ORGANIZATION,
      title: t('screens.adminDashboard.menuItems.organizationStructure'),
      description: t('screens.adminDashboard.menuItems.organizationDescription'),
      icon: ICONS.SITEMAP,
      screen: SCREENS.ORGANIZATION_MANAGEMENT,
      color: colors.primary,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScreenHeader
        title={t('screens.adminDashboard.title')}
        subtitle={t('screens.adminDashboard.welcomeSubtitle', { name: user?.name })}
      />
      <StatsSection stats={stats} colors={colors} t={t} navigation={navigation} />
      <View style={styles.content}>
        <SectionHeader title={t('sections.management')} />
        {menuItems.map((item) => (
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
    </ScrollView>
  );
};

// Extracted stats section component
interface StatsSectionProps {
  stats: DashboardStats;
  colors: ReturnType<typeof useTheme>['colors'];
  t: ReturnType<typeof useTranslation>['t'];
  navigation: ReturnType<typeof useNavigation>;
}

function StatsSection({ stats, colors, t, navigation }: StatsSectionProps): React.JSX.Element {
  return (
    <View style={styles.statsSection}>
      <SectionHeader title={t('sections.overview')} />
      <View style={styles.statsGrid}>
        <StatCard
          icon={ICONS.ACCOUNT_GROUP}
          label={t('stats.totalUsers')}
          value={stats.totalUsers}
          color={colors.info}
          subtitle={t('screens.adminDashboard.activeCount', { count: stats.activeUsers })}
        />
        <StatCard
          icon={ICONS.ACCOUNT_GROUP}
          label={t('stats.totalClubs')}
          value={stats.totalClubs}
          color={colors.success}
          subtitle={t('screens.adminDashboard.activeCount', { count: stats.activeClubs })}
        />
      </View>
      {stats.pendingApprovals > 0 && (
        <View style={styles.statsRow}>
          <StatCard
            icon={ICONS.CLOCK_ALERT_OUTLINE}
            label={t('stats.pendingApprovals')}
            value={stats.pendingApprovals}
            color={colors.warning}
            onPress={() => navigation.navigate(SCREENS.USERS_MANAGEMENT as never)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
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

export default AdminDashboardScreen;
