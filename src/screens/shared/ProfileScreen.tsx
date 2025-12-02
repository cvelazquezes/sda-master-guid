/**
 * ProfileScreen
 * Unified profile screen accessible from header for all user roles
 * Redesigned with modern card-based layout matching app design patterns
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { UserRole } from '../../types';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileTypography } from '../../shared/theme/mobileTypography';
import { MESSAGES } from '../../shared/constants';
import { Card, SectionHeader } from '../../shared/components';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, updateUser, logout } = useAuth();
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(user?.isActive !== false);
  const [loading, setLoading] = useState(false);

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
        return 'Administrator';
      case UserRole.CLUB_ADMIN:
        return 'Club Admin';
      case UserRole.USER:
        return 'Member';
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
        return '#E53935'; // Red for admin
      case UserRole.CLUB_ADMIN:
        return '#FB8C00'; // Orange for club admin
      case UserRole.USER:
        return '#43A047'; // Green for user
      default:
        return colors.primary;
    }
  };

  const getRoleGradientStart = (role: UserRole | undefined): string => {
    switch (role) {
      case UserRole.ADMIN:
        return '#1565C0';
      case UserRole.CLUB_ADMIN:
        return '#1976D2';
      case UserRole.USER:
        return '#1E88E5';
      default:
        return colors.primary;
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header Card */}
      <View style={styles.headerSection}>
        <Card variant="elevated" style={[styles.profileCard, { backgroundColor: getRoleGradientStart(user?.role) }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarOuter, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <View style={[styles.avatarInner, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                  <MaterialCommunityIcons
                    name={getRoleIcon(user?.role)}
                    size={40}
                    color={getRoleGradientStart(user?.role)}
                  />
                </View>
              </View>
            </View>
            
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
            
            <View style={styles.roleBadge}>
              <MaterialCommunityIcons
                name={getRoleIcon(user?.role)}
                size={14}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.roleText}>{getRoleLabel(user?.role)}</Text>
            </View>

            {/* Quick Stats */}
            {user?.role !== UserRole.ADMIN && (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="check-circle" size={18} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.statText}>{isActive ? 'Active' : 'Inactive'}</Text>
                </View>
                {user?.classes && user.classes.length > 0 && (
                  <View style={styles.statDivider} />
                )}
                {user?.classes && user.classes.length > 0 && (
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="school" size={18} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.statText}>{user.classes.length} Classes</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </Card>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <SectionHeader title="Preferences" />
        <Card variant="elevated">
          <View style={styles.settingsContainer}>
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <ThemeSwitcher showLabel={true} />
            </View>
            <View style={styles.settingRow}>
              <LanguageSwitcher showLabel={true} />
            </View>
          </View>
        </Card>
      </View>

      {/* Timezone */}
      <View style={styles.section}>
        <Card variant="elevated">
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.info + '20' }]}>
              <MaterialCommunityIcons name="earth" size={22} color={colors.info} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>Timezone</Text>
              <Text style={[styles.menuValue, { color: colors.textPrimary }]}>
                {user?.timezone || 'America/New_York'}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Account Status - Only shown for non-admin users */}
      {user?.role !== UserRole.ADMIN && (
        <View style={styles.section}>
          <SectionHeader title="Activity Status" />
          <Card variant="elevated">
            <View style={styles.statusContainer}>
              <View style={styles.statusInfo}>
                <View style={[
                  styles.statusIconContainer, 
                  { backgroundColor: isActive ? colors.success + '20' : colors.textTertiary + '20' }
                ]}>
                  <MaterialCommunityIcons
                    name={isActive ? 'account-check' : 'account-off'}
                    size={24}
                    color={isActive ? colors.success : colors.textTertiary}
                  />
                </View>
                <View style={styles.statusText}>
                  <Text style={[styles.statusLabel, { color: colors.textPrimary }]}>
                    {isActive ? 'Participating' : 'Not Participating'}
                  </Text>
                  <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                    {isActive ? 'You are active in club activities' : 'You are not participating in activities'}
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

      {/* Contact Information - Only show if user has whatsapp or classes */}
      {(user?.whatsappNumber || (user?.classes && user.classes.length > 0)) && (
        <View style={styles.section}>
          <SectionHeader title="Contact & Info" />
          <Card variant="elevated">
            <View style={styles.detailsContainer}>
              {user?.whatsappNumber && (
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconContainer, { backgroundColor: '#25D366' + '20' }]}>
                    <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>WhatsApp</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {user.whatsappNumber}
                    </Text>
                  </View>
                </View>
              )}

              {user?.classes && user.classes.length > 0 && (
                <View style={styles.detailRow}>
                  <View style={[styles.detailIconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <MaterialCommunityIcons name="school" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Pathfinder Classes</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {user.classes.join(', ')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Card>
        </View>
      )}

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error + '12', borderColor: colors.error }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="logout" size={22} color={colors.error} />
          <Text style={[styles.logoutButtonText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Version info */}
      <View style={styles.versionSection}>
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          SDA Master Guid • Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
  },
  profileCard: {
    overflow: 'hidden',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  avatarWrapper: {
    marginBottom: designTokens.spacing.md,
  },
  avatarOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    ...mobileTypography.heading2,
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    ...mobileTypography.body,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: designTokens.spacing.md,
    textAlign: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.xs,
  },
  roleText: {
    ...mobileTypography.captionBold,
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: designTokens.spacing.md,
  },
  statText: {
    ...mobileTypography.caption,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
  },
  settingsContainer: {
    // Container for settings items
  },
  settingRow: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    ...mobileTypography.caption,
    marginBottom: 2,
  },
  menuValue: {
    ...mobileTypography.bodyLarge,
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
  versionSection: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing['3xl'],
  },
  versionText: {
    ...mobileTypography.caption,
  },
});

export default ProfileScreen;
