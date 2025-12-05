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
import { Club, User, MatchStatus } from '../../types';
import { ClubDetailModal } from '../../components/ClubDetailModal';
import { ClubCard } from '../../components/ClubCard';
import { StatCard } from '../../components/StatCard';
import { mobileTypography, designTokens, layoutConstants } from '../../shared/theme';
import { EmptyState, Card, SectionHeader, MenuCard } from '../../shared/components';
import { MESSAGES, ICONS, COMPONENT_VARIANT, TABS } from '../../shared/constants';
import { flexValues } from '../../shared/constants/layoutConstants';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
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
      const upcomingActivities = matches.filter((m) => m.status === MatchStatus.PENDING || m.status === MatchStatus.SCHEDULED);
      
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
          icon={ICONS.ACCOUNT_ALERT}
          title={t('screens.home.notPartOfClub')}
          description={t('screens.home.contactAdminDescription')}
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
          {t('screens.home.welcomeBack', { name: user.name })}
        </Text>
        <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
          {t('screens.home.clubHappenings')}
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

      {/* Recent Members */}
      {recentMembers.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title={t('sections.recentMembers')} />
          {recentMembers.map((member) => (
            <Card key={member.id} variant={COMPONENT_VARIANT.elevated} style={styles.memberCard}>
              <View style={styles.memberRow}>
                <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.memberAvatarText, { color: designTokens.colors.white }]}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.textPrimary }]}>{member.name}</Text>
                  <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>{member.email}</Text>
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
      )}

      {/* Inactive Account Warning */}
      {!user.isActive && (
        <Card variant={COMPONENT_VARIANT.outlined} style={[styles.inactiveBanner, { borderLeftColor: colors.error }]}>
          <View style={styles.inactiveBannerContent}>
            <MaterialCommunityIcons 
              name={ICONS.ALERT_CIRCLE} 
              size={designTokens.icon.sizes.lg} 
              color={colors.error} 
            />
            <View style={styles.inactiveBannerText}>
              <Text style={[styles.inactiveBannerTitle, { color: colors.error }]}>{t('screens.home.accountInactive')}</Text>
              <Text style={[styles.inactiveBannerDescription, { color: colors.textSecondary }]}>
                {t('screens.home.inactiveAccountDescription')}
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
    flex: flexValues.one,
  },
  header: {
    padding: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  welcomeText: {
    ...mobileTypography.heading1,
    marginBottom: designTokens.spacing.xs,
  },
  subtitleText: {
    ...mobileTypography.body,
  },
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
    borderRadius: designTokens.borderRadius.xxl,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  memberAvatarText: {
    ...mobileTypography.heading4,
  },
  memberInfo: {
    flex: flexValues.one,
  },
  memberName: {
    ...mobileTypography.bodyLargeBold,
  },
  memberEmail: {
    ...mobileTypography.caption,
    marginTop: designTokens.spacing.xxs,
  },
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
  inactiveBannerTitle: {
    ...mobileTypography.bodyLargeBold,
  },
  inactiveBannerDescription: {
    ...mobileTypography.bodySmall,
  },
});

export default HomeScreen;
