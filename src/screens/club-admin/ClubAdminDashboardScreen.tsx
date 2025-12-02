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
import { ScreenHeader, SectionHeader, MenuCard } from '../../shared/components';
import { MESSAGES } from '../../shared/constants';

const ClubAdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
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
        pendingApprovals: members.filter((m) => m.approvalStatus === 'pending').length,
        upcomingMatches: matches.filter((m) => m.status === 'pending' || m.status === 'scheduled').length,
      });
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_CLUB_INFO);
    }
  };

  const quickActions = [
    {
      id: 'activities',
      title: 'Generate Activities',
      description: 'Create new social activity rounds',
      icon: 'account-heart',
      screen: 'GenerateMatches',
      color: colors.success,
    },
    {
      id: 'directive',
      title: 'Club Directive',
      description: 'Assign leadership positions',
      icon: 'account-star',
      screen: 'ClubDirective',
      color: colors.warning,
    },
    {
      id: 'settings',
      title: 'Club Settings',
      description: 'Configure club preferences',
      icon: 'cog',
      screen: 'ClubSettings',
      color: colors.info,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScreenHeader
        title="Club Dashboard"
        subtitle={`Manage your club effectively`}
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
        <SectionHeader title="Club Overview" />
        <View style={styles.statsGrid}>
          <StatCard
            icon="account-group"
            label="Members"
            value={stats.totalMembers}
            color={colors.info}
            subtitle={`${stats.activeMembers} active`}
            onPress={() => navigation.navigate('Members' as never)}
          />
          <StatCard
            icon="account-heart"
            label="Activities"
            value={stats.upcomingMatches}
            color={colors.success}
            subtitle="upcoming"
            onPress={() => navigation.navigate('More' as never)}
          />
        </View>
        {stats.pendingApprovals > 0 && (
          <View style={styles.statsRow}>
            <StatCard
              icon="clock-alert-outline"
              label="Pending Approvals"
              value={stats.pendingApprovals}
              color={colors.warning}
              subtitle="members awaiting approval"
              onPress={() => navigation.navigate('Members' as never)}
            />
          </View>
        )}
      </View>

      {/* Quick Actions Menu */}
      <View style={styles.content}>
        <SectionHeader title="Quick Actions" />
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
    flex: 1,
  },
  clubCardContainer: {
    marginTop: designTokens.spacing.lg,
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

export default ClubAdminDashboardScreen;
