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
import { ScreenHeader, SectionHeader, MenuCard } from '../../shared/components';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
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
        pendingApprovals: users.filter((u) => u.approvalStatus === 'pending').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const menuItems = [
    {
      id: 'organization',
      title: 'Organization Structure',
      description: 'Manage divisions, unions, associations, and churches',
      icon: 'sitemap',
      screen: 'OrganizationManagement',
      color: colors.primary,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScreenHeader
        title="Admin Dashboard"
        subtitle={`Welcome, ${user?.name}`}
      />

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <SectionHeader title="Overview" />
        <View style={styles.statsGrid}>
          <StatCard
            icon="account-group"
            label="Total Users"
            value={stats.totalUsers}
            color={colors.info}
            subtitle={`${stats.activeUsers} active`}
          />
          <StatCard
            icon="account-group"
            label="Total Clubs"
            value={stats.totalClubs}
            color={colors.success}
            subtitle={`${stats.activeClubs} active`}
          />
        </View>
        {stats.pendingApprovals > 0 && (
          <View style={styles.statsRow}>
            <StatCard
              icon="clock-alert-outline"
              label="Pending Approvals"
              value={stats.pendingApprovals}
              color={colors.warning}
              onPress={() => navigation.navigate('UsersManagement' as never)}
            />
          </View>
        )}
      </View>

      {/* Management Menu */}
      <View style={styles.content}>
        <SectionHeader title="Management" />
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
    flex: 1,
  },
  statsSection: {
    padding: designTokens.spacing.lg,
    paddingBottom: 0,
  },
  statsGrid: {
    flexDirection: 'row',
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
