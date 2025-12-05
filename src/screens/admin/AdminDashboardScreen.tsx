/**
 * AdminDashboardScreen
 * Dashboard for platform administrators
 * Supports dynamic theming (light/dark mode)
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { useTranslation } from 'react-i18next';
import { ICONS, LOG_MESSAGES, MENU_ITEM_IDS, SCREENS, flexValues } from '../../shared/constants';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalClubs: 0,
    activeClubs: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, clubs] = await Promise.all([
        userService.getAllUsers(),
        clubService.getAllClubs(),
      ]);

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.isActive).length,
        totalClubs: clubs.length,
        activeClubs: clubs.filter((c) => c.isActive).length,
        pendingApprovals: users.filter((u) => u.approvalStatus === ApprovalStatus.PENDING).length,
      });
    } catch (error) {
      logger.error(LOG_MESSAGES.SCREENS.ADMIN_DASHBOARD.FAILED_TO_LOAD_STATS, error as Error);
    }
  };

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

      {/* Statistics Section */}
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

      {/* Management Menu */}
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
