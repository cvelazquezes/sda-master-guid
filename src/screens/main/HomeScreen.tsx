/**
 * HomeScreen
 * Main dashboard for regular users
 * Supports dynamic theming (light/dark mode)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import { Club, User } from '../../types';
import { ClubDetailModal } from '../../components/ClubDetailModal';
import { ClubCard } from '../../components/ClubCard';
import { StatCard } from '../../components/StatCard';
import { mobileTypography, designTokens } from '../../shared/theme';
import { EmptyState, Card, SectionHeader, MenuCard } from '../../shared/components';
import { MESSAGES } from '../../shared/constants';

const HomeScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clubDetailVisible, setClubDetailVisible] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    upcomingMeetings: 0,
    pendingFees: 0,
    upcomingActivities: 0,
  });
  const [recentMembers, setRecentMembers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      const [clubData, members, matches] = await Promise.all([
        clubService.getClub(user.clubId),
        clubService.getClubMembers(user.clubId),
        matchService.getMyMatches(),
      ]);
      
      setClub(clubData);
      
      // Calculate stats
      const activeMembers = members.filter((m) => m.isActive);
      const upcomingActivities = matches.filter((m) => m.status === 'pending' || m.status === 'scheduled');
      
      setStats({
        totalMembers: activeMembers.length,
        upcomingMeetings: 0, // This would come from a meeting service
        pendingFees: 0, // This would come from a fees service
        upcomingActivities: upcomingActivities.length,
      });
      
      // Get most recent 3 members
      const sortedMembers = [...activeMembers].sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setRecentMembers(sortedMembers.slice(0, 3));
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

  if (!user?.clubId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
        <EmptyState
          icon="account-alert"
          title="You are not part of a club"
          description="Please contact an administrator to join a club and start connecting with other members"
          iconColor={colors.warning}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header with Welcome */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.welcomeText, { color: colors.textPrimary }]}>
          Welcome back, {user.name}!
        </Text>
        <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
          Here's what's happening in your club
        </Text>
      </View>

      {/* Club Card */}
      {club && (
        <View style={styles.clubSection}>
          <ClubCard
            club={club}
            onPress={() => setClubDetailVisible(true)}
          />
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.section}>
        <SectionHeader title="Club Overview" />
        <View style={styles.statsGrid}>
          <StatCard
            icon="account-group"
            label="Members"
            value={stats.totalMembers}
            color={colors.info}
            onPress={() => navigation.navigate('Members' as never)}
          />
          <StatCard
            icon="calendar-check"
            label="Meetings"
            value={stats.upcomingMeetings}
            color={colors.success}
            subtitle="upcoming"
          />
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            icon="calendar-clock"
            label="Meetings"
            value={stats.upcomingActivities}
            color={colors.primary}
            subtitle="upcoming"
            onPress={() => navigation.navigate('Meetings' as never)}
          />
          <StatCard
            icon="cash"
            label="Finances"
            value={stats.pendingFees}
            color={colors.warning}
            subtitle="pending"
            onPress={() => navigation.navigate('Finances' as never)}
          />
        </View>
      </View>

      {/* Recent Members */}
      {recentMembers.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Recent Members" />
          {recentMembers.map((member) => (
            <Card key={member.id} variant="elevated" style={styles.memberCard}>
              <View style={styles.memberRow}>
                <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.memberAvatarText, { color: '#fff' }]}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.textPrimary }]}>{member.name}</Text>
                  <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>{member.email}</Text>
                </View>
                <MaterialCommunityIcons 
                  name="account-check" 
                  size={24} 
                  color={colors.success} 
                />
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Inactive Account Warning */}
      {!user.isActive && (
        <Card variant="outlined" style={[styles.inactiveBanner, { borderLeftColor: colors.error }]}>
          <View style={styles.inactiveBannerContent}>
            <MaterialCommunityIcons 
              name="alert-circle" 
              size={designTokens.icon.sizes.lg} 
              color={colors.error} 
            />
            <View style={styles.inactiveBannerText}>
              <Text style={[styles.inactiveBannerTitle, { color: colors.error }]}>Account Inactive</Text>
              <Text style={[styles.inactiveBannerDescription, { color: colors.textSecondary }]}>
                Your account is currently inactive. Contact your club admin to activate it.
              </Text>
            </View>
          </View>
        </Card>
      )}

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
  header: {
    padding: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  welcomeText: {
    ...mobileTypography.heading1,
    marginBottom: 4,
  },
  subtitleText: {
    ...mobileTypography.body,
  },
  clubSection: {
    padding: designTokens.spacing.lg,
    paddingBottom: 0,
  },
  section: {
    padding: designTokens.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
  },
  memberCard: {
    marginBottom: designTokens.spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    ...mobileTypography.heading4,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...mobileTypography.bodyLargeBold,
  },
  memberEmail: {
    ...mobileTypography.caption,
    marginTop: 2,
  },
  inactiveBanner: {
    margin: designTokens.spacing.lg,
    borderLeftWidth: 4,
  },
  inactiveBannerContent: {
    flexDirection: 'row',
    gap: designTokens.spacing.md,
  },
  inactiveBannerText: {
    flex: 1,
    gap: designTokens.spacing.xs,
  },
  inactiveBannerTitle: {
    ...mobileTypography.bodyLargeBold,
  },
  inactiveBannerDescription: {
    ...mobileTypography.bodySmall,
  },
});

export default HomeScreen;
