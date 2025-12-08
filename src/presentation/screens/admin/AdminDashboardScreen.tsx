/**
 * AdminDashboardScreen
 * Dashboard for platform administrators
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/AuthContext';
import { useTheme, ThemeContextType } from '../../state/ThemeContext';
import { StatCard } from '../../components/features/StatCard';
import { userService } from '../../../infrastructure/repositories/userService';
import { clubService } from '../../../infrastructure/repositories/clubService';
import { PageHeader, SectionHeader, MenuCard } from '../../components/primitives';
import { logger } from '../../../shared/utils/logger';
import { ApprovalStatus } from '../../../types';
import { ICONS, LOG_MESSAGES, MENU_ITEM_IDS, SCREENS, FLEX } from '../../../shared/constants';

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
  const { colors, spacing } = useTheme();
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

  const containerStyle = { flex: FLEX.ONE, backgroundColor: colors.backgroundSecondary };

  return (
    <ScrollView style={containerStyle}>
      <PageHeader
        title={t('screens.adminDashboard.title')}
        subtitle={t('screens.adminDashboard.welcomeSubtitle', { name: user?.name })}
        showActions
      />
      <StatsSection stats={stats} colors={colors} spacing={spacing} t={t} navigation={navigation} />
      <View style={{ padding: spacing.lg }}>
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
  colors: ThemeContextType['colors'];
  spacing: ThemeContextType['spacing'];
  t: ReturnType<typeof useTranslation>['t'];
  navigation: ReturnType<typeof useNavigation>;
}

function StatsSection({
  stats,
  colors,
  spacing,
  t,
  navigation,
}: StatsSectionProps): React.JSX.Element {
  const gridStyle = { flexDirection: 'row' as const, gap: spacing.md, marginBottom: spacing.md };

  return (
    <View style={{ padding: spacing.lg, paddingBottom: spacing.none }}>
      <SectionHeader title={t('sections.overview')} />
      <View style={gridStyle}>
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
        <View style={{ marginBottom: spacing.md }}>
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

export default AdminDashboardScreen;
