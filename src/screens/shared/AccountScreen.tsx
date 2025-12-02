/**
 * AccountScreen
 * Unified account and settings screen for all user roles
 * Shows complete user profile information and preferences
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { UserRole, Club } from '../../types';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileTypography } from '../../shared/theme/mobileTypography';
import { MESSAGES } from '../../shared/constants';
import { ScreenHeader, SectionHeader, Card } from '../../shared/components';
import { clubService } from '../../services/clubService';

const AccountScreen = () => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(user?.isActive !== false);
  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<Club | null>(null);

  // Fetch club information for non-admin users
  useEffect(() => {
    const fetchClub = async () => {
      if (user?.clubId && user.role !== UserRole.ADMIN) {
        try {
          const clubData = await clubService.getClubById(user.clubId);
          setClub(clubData);
        } catch (error) {
          console.error('Failed to fetch club:', error);
        }
      }
    };
    fetchClub();
  }, [user?.clubId, user?.role]);

  const handleToggleActive = async (value: boolean) => {
    setLoading(true);
    try {
      await updateUser({ isActive: value });
      setIsActive(value);
      Alert.alert(
        MESSAGES.TITLES.SUCCESS,
        value ? MESSAGES.SUCCESS.ACCOUNT_ACTIVATED : MESSAGES.SUCCESS.ACCOUNT_PAUSED
      );
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_SETTINGS);
      setIsActive(!value);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      MESSAGES.TITLES.LOGOUT,
      MESSAGES.WARNINGS.CONFIRM_LOGOUT,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: MESSAGES.TITLES.LOGOUT,
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOGOUT);
            }
          },
        },
      ]
    );
  };

  const getRoleLabel = (role: UserRole | undefined): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Platform Administrator';
      case UserRole.CLUB_ADMIN:
        return 'Club Administrator';
      case UserRole.USER:
        return 'Club Member';
      default:
        return 'User';
    }
  };

  const getRoleIcon = (role: UserRole | undefined): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (role) {
      case UserRole.ADMIN:
        return 'shield-crown';
      case UserRole.CLUB_ADMIN:
        return 'account-tie';
      case UserRole.USER:
        return 'account';
      default:
        return 'account';
    }
  };

  const getRoleColor = (role: UserRole | undefined): string => {
    switch (role) {
      case UserRole.ADMIN:
        return colors.error;
      case UserRole.CLUB_ADMIN:
        return colors.warning;
      case UserRole.USER:
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getApprovalStatusLabel = (status: string | undefined): { label: string; color: string } => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', color: colors.success };
      case 'pending':
        return { label: 'Pending Approval', color: colors.warning };
      case 'rejected':
        return { label: 'Rejected', color: colors.error };
      default:
        return { label: 'Unknown', color: colors.textTertiary };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="My Account"
        subtitle="Your profile and preferences"
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.section}>
          <Card variant="elevated" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: getRoleColor(user?.role) + '20' }]}>
                <MaterialCommunityIcons
                  name={getRoleIcon(user?.role)}
                  size={48}
                  color={getRoleColor(user?.role)}
                />
              </View>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                {user?.name || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {user?.email || 'email@example.com'}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role) + '15' }]}>
                <MaterialCommunityIcons
                  name={getRoleIcon(user?.role)}
                  size={16}
                  color={getRoleColor(user?.role)}
                />
                <Text style={[styles.roleText, { color: getRoleColor(user?.role) }]}>
                  {getRoleLabel(user?.role)}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Contact Information - Only for non-admin users */}
        {user?.role !== UserRole.ADMIN && (
          <View style={styles.section}>
            <SectionHeader title="Contact Information" />
            <Card variant="elevated">
              <View style={styles.detailsContainer}>
                {/* Email */}
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <MaterialCommunityIcons name="email-outline" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Email Address</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {user?.email || 'Not set'}
                    </Text>
                  </View>
                </View>

                {/* WhatsApp */}
                <View style={styles.detailRow}>
                  <View style={[styles.detailIconContainer, { backgroundColor: colors.success + '20' }]}>
                    <MaterialCommunityIcons name="whatsapp" size={20} color={colors.success} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>WhatsApp Number</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {user?.whatsappNumber || 'Not set'}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Club Membership - Only for non-admin users */}
        {user?.role !== UserRole.ADMIN && (
          <View style={styles.section}>
            <SectionHeader title="Club Membership" />
            <Card variant="elevated">
              <View style={styles.detailsContainer}>
                {/* Club Name */}
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Club</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {club?.name || 'Loading...'}
                    </Text>
                  </View>
                </View>

                {/* Pathfinder Classes */}
                {user?.classes && user.classes.length > 0 && (
                  <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                    <View style={[styles.detailIconContainer, { backgroundColor: colors.info + '20' }]}>
                      <MaterialCommunityIcons name="school" size={20} color={colors.info} />
                    </View>
                    <View style={styles.detailText}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Pathfinder Classes</Text>
                      <View style={styles.classesContainer}>
                        {user.classes.map((cls, index) => (
                          <View key={index} style={[styles.classBadge, { backgroundColor: colors.primary + '15' }]}>
                            <Text style={[styles.classBadgeText, { color: colors.primary }]}>{cls}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}

                {/* Member Since */}
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconContainer, { backgroundColor: colors.textTertiary + '20' }]}>
                    <MaterialCommunityIcons name="calendar-account" size={20} color={colors.textTertiary} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Member Since</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {formatDate(user?.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Membership Status */}
                <View style={styles.detailRow}>
                  <View style={[styles.detailIconContainer, { backgroundColor: getApprovalStatusLabel(user?.approvalStatus).color + '20' }]}>
                    <MaterialCommunityIcons 
                      name={user?.approvalStatus === 'approved' ? 'check-circle' : user?.approvalStatus === 'pending' ? 'clock-outline' : 'close-circle'} 
                      size={20} 
                      color={getApprovalStatusLabel(user?.approvalStatus).color} 
                    />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Membership Status</Text>
                    <Text style={[styles.detailValue, { color: getApprovalStatusLabel(user?.approvalStatus).color }]}>
                      {getApprovalStatusLabel(user?.approvalStatus).label}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Activity Status - Only shown for non-admin users */}
        {user?.role !== UserRole.ADMIN && (
          <View style={styles.section}>
            <SectionHeader title="Activity Status" />
            <Card variant="elevated">
              <View style={styles.statusContainer}>
                <View style={styles.statusInfo}>
                  <View style={[styles.statusIconContainer, { backgroundColor: isActive ? colors.success + '20' : colors.textTertiary + '20' }]}>
                    <MaterialCommunityIcons
                      name={isActive ? 'account-check' : 'account-off'}
                      size={24}
                      color={isActive ? colors.success : colors.textTertiary}
                    />
                  </View>
                  <View style={styles.statusText}>
                    <Text style={[styles.statusLabel, { color: colors.textPrimary }]}>
                      {isActive ? 'Active' : 'Inactive'}
                    </Text>
                    <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                      {isActive ? 'Participating in club activities' : 'Not participating in activities'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={handleToggleActive}
                  disabled={loading}
                  trackColor={{ false: colors.border, true: colors.success }}
                  thumbColor={colors.surface}
                />
              </View>
            </Card>
          </View>
        )}

        {/* Preferences Section */}
        <View style={styles.section}>
          <SectionHeader title="Preferences" />
          <Card variant="elevated">
            <View style={styles.detailsContainer}>
              {/* Timezone */}
              <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.info + '20' }]}>
                  <MaterialCommunityIcons name="earth" size={20} color={colors.info} />
                </View>
                <View style={styles.detailText}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Timezone</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {user?.timezone || 'America/New_York'}
                  </Text>
                </View>
              </View>

              {/* Theme Switcher */}
              <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
                <ThemeSwitcher showLabel={true} />
              </View>

              {/* Language Switcher */}
              <View style={styles.settingRow}>
                <LanguageSwitcher showLabel={true} />
              </View>
            </View>
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <SectionHeader title="About" />
          <Card variant="elevated">
            <View style={styles.detailsContainer}>
              <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.textTertiary + '20' }]}>
                  <MaterialCommunityIcons name="information-outline" size={20} color={colors.textTertiary} />
                </View>
                <View style={styles.detailText}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>App Version</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>1.0.0</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.detailRow} activeOpacity={0.7}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.primary} />
                </View>
                <View style={styles.detailText}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Privacy</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>Privacy Policy</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error + '15', borderColor: colors.error }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout" size={22} color={colors.error} />
            <Text style={[styles.logoutButtonText, { color: colors.error }]}>
              {t('auth.logout')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.sm,
  },
  profileCard: {
    marginBottom: 0,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: designTokens.spacing.md,
  },
  profileName: {
    ...mobileTypography.heading2,
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEmail: {
    ...mobileTypography.body,
    marginBottom: designTokens.spacing.sm,
    textAlign: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.xs,
  },
  roleText: {
    ...mobileTypography.captionBold,
  },
  settingRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: designTokens.spacing.md,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    ...mobileTypography.bodyLargeBold,
    marginBottom: 2,
  },
  statusDescription: {
    ...mobileTypography.caption,
  },
  detailsContainer: {
    // Container for detail items
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    gap: designTokens.spacing.md,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    ...mobileTypography.caption,
    marginBottom: 2,
  },
  detailValue: {
    ...mobileTypography.bodyLarge,
  },
  classesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designTokens.spacing.xs,
    marginTop: 4,
  },
  classBadge: {
    paddingVertical: 4,
    paddingHorizontal: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.md,
  },
  classBadgeText: {
    ...mobileTypography.caption,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    borderWidth: 1.5,
    gap: designTokens.spacing.sm,
  },
  logoutButtonText: {
    ...mobileTypography.bodyLargeBold,
  },
  bottomSpacer: {
    height: designTokens.spacing['3xl'],
  },
});

export default AccountScreen;
