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
import { UserRole, Club, ApprovalStatus } from '../../types';
import { mobileTypography, designTokens, layoutConstants } from '../../shared/theme';
import { MESSAGES, ICONS, TOUCH_OPACITY, flexValues, ALERT_BUTTON_STYLE, APP_VERSION, borderValues, DATE_LOCALE_OPTIONS } from '../../shared/constants';
import { LOG_MESSAGES } from '../../shared/constants/logMessages';
import { ScreenHeader, SectionHeader, Card } from '../../shared/components';
import { clubService } from '../../services/clubService';
import { logger } from '../../shared/utils/logger';

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
          logger.error(LOG_MESSAGES.COMPONENTS.USER_DETAIL_MODAL.FAILED_TO_LOAD_CLUB, error as Error);
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
        { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: MESSAGES.TITLES.LOGOUT,
          style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
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
        return t('screens.account.platformAdministrator');
      case UserRole.CLUB_ADMIN:
        return t('screens.account.clubAdministrator');
      case UserRole.USER:
        return t('screens.account.clubMember');
      default:
        return t('roles.user');
    }
  };

  const getRoleIcon = (role: UserRole | undefined): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (role) {
      case UserRole.ADMIN:
        return ICONS.SHIELD_CROWN;
      case UserRole.CLUB_ADMIN:
        return ICONS.ACCOUNT_TIE;
      case UserRole.USER:
        return ICONS.ACCOUNT;
      default:
        return ICONS.ACCOUNT;
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
    if (!dateString) return t('common.notAvailable');
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.LONG_DATE);
  };

  const getApprovalStatusLabel = (status: string | undefined): { label: string; color: string } => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return { label: t('screens.account.statusApproved'), color: colors.success };
      case ApprovalStatus.PENDING:
        return { label: t('screens.account.statusPending'), color: colors.warning };
      case ApprovalStatus.REJECTED:
        return { label: t('screens.account.statusRejected'), color: colors.error };
      default:
        return { label: t('screens.account.statusUnknown'), color: colors.textTertiary };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t('screens.account.title')}
        subtitle={t('screens.account.subtitle')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.section}>
          <Card variant="elevated" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: getRoleColor(user?.role) + '20' }]}>
                <MaterialCommunityIcons
                  name={getRoleIcon(user?.role)}
                  size={designTokens.iconSize.xxl}
                  color={getRoleColor(user?.role)}
                />
              </View>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                {user?.name || t('roles.user')}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {user?.email || t('screens.account.defaultEmail')}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role) + '15' }]}>
                <MaterialCommunityIcons
                  name={getRoleIcon(user?.role)}
                  size={designTokens.iconSize.sm}
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
            <SectionHeader title={t('screens.account.contactInformation')} />
            <Card variant="elevated">
              <View style={styles.detailsContainer}>
                {/* Email */}
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <MaterialCommunityIcons name={ICONS.EMAIL_OUTLINE} size={designTokens.iconSize.md} color={colors.primary} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.emailAddress')}</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {user?.email || t('common.notSet')}
                    </Text>
                  </View>
                </View>

                {/* WhatsApp */}
                <View style={styles.detailRow}>
                  <View style={[styles.detailIconContainer, { backgroundColor: colors.success + '20' }]}>
                    <MaterialCommunityIcons name={ICONS.WHATSAPP} size={designTokens.iconSize.md} color={colors.success} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.whatsAppNumber')}</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {user?.whatsappNumber || t('common.notSet')}
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
            <SectionHeader title={t('screens.account.clubMembership')} />
            <Card variant="elevated">
              <View style={styles.detailsContainer}>
                {/* Club Name */}
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.detailIconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <MaterialCommunityIcons name={ICONS.ACCOUNT_GROUP} size={designTokens.iconSize.md} color={colors.primary} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.club')}</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {club?.name || t('common.loading')}
                    </Text>
                  </View>
                </View>

                {/* Pathfinder Classes */}
                {user?.classes && user.classes.length > 0 && (
                  <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                    <View style={[styles.detailIconContainer, { backgroundColor: colors.info + '20' }]}>
                      <MaterialCommunityIcons name={ICONS.SCHOOL} size={designTokens.iconSize.md} color={colors.info} />
                    </View>
                    <View style={styles.detailText}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.pathfinderClasses')}</Text>
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
                    <MaterialCommunityIcons name={ICONS.CALENDAR_ACCOUNT} size={designTokens.iconSize.md} color={colors.textTertiary} />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.memberSince')}</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {formatDate(user?.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Membership Status */}
                <View style={styles.detailRow}>
                  <View style={[styles.detailIconContainer, { backgroundColor: getApprovalStatusLabel(user?.approvalStatus).color + '20' }]}>
                    <MaterialCommunityIcons 
                      name={user?.approvalStatus === ApprovalStatus.APPROVED ? ICONS.CHECK_CIRCLE : user?.approvalStatus === ApprovalStatus.PENDING ? ICONS.CLOCK_OUTLINE : ICONS.CLOSE_CIRCLE} 
                      size={designTokens.iconSize.md} 
                      color={getApprovalStatusLabel(user?.approvalStatus).color} 
                    />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.membershipStatus')}</Text>
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
            <SectionHeader title={t('screens.account.activityStatus')} />
            <Card variant="elevated">
              <View style={styles.statusContainer}>
                <View style={styles.statusInfo}>
                  <View style={[styles.statusIconContainer, { backgroundColor: isActive ? colors.success + '20' : colors.textTertiary + '20' }]}>
                    <MaterialCommunityIcons
                      name={isActive ? ICONS.ACCOUNT_CHECK : ICONS.ACCOUNT_OFF}
                      size={designTokens.iconSize.lg}
                      color={isActive ? colors.success : colors.textTertiary}
                    />
                  </View>
                  <View style={styles.statusText}>
                    <Text style={[styles.statusLabel, { color: colors.textPrimary }]}>
                      {isActive ? t('common.active') : t('screens.profile.inactive')}
                    </Text>
                    <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                      {isActive ? t('screens.profile.activeInActivities') : t('screens.profile.notInActivities')}
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
          <SectionHeader title={t('screens.account.preferences')} />
          <Card variant="elevated">
            <View style={styles.detailsContainer}>
              {/* Timezone */}
              <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.info + '20' }]}>
                  <MaterialCommunityIcons name={ICONS.EARTH} size={designTokens.iconSize.md} color={colors.info} />
                </View>
                <View style={styles.detailText}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.timezone')}</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {user?.timezone || t('screens.profile.defaultTimezone')}
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
          <SectionHeader title={t('screens.account.about')} />
          <Card variant="elevated">
            <View style={styles.detailsContainer}>
              <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.textTertiary + '20' }]}>
                  <MaterialCommunityIcons name={ICONS.INFORMATION_OUTLINE} size={designTokens.iconSize.md} color={colors.textTertiary} />
                </View>
                <View style={styles.detailText}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.appVersion')}</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{APP_VERSION}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.detailRow} activeOpacity={TOUCH_OPACITY.default}>
                <View style={[styles.detailIconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <MaterialCommunityIcons name={ICONS.SHIELD_CHECK_OUTLINE} size={designTokens.iconSize.md} color={colors.primary} />
                </View>
                <View style={styles.detailText}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('screens.account.privacy')}</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{t('screens.account.privacyPolicy')}</Text>
                </View>
                <MaterialCommunityIcons name={ICONS.CHEVRON_RIGHT} size={designTokens.iconSize.md} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error + '15', borderColor: colors.error }]}
            onPress={handleLogout}
            activeOpacity={TOUCH_OPACITY.default}
          >
            <MaterialCommunityIcons name={ICONS.LOGOUT} size={designTokens.iconSize.md} color={colors.error} />
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
    flex: flexValues.one,
  },
  scrollView: {
    flex: flexValues.one,
  },
  section: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.sm,
  },
  profileCard: {
    marginBottom: designTokens.spacing.none,
  },
  profileHeader: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
  },
  avatarContainer: {
    width: designTokens.avatarSize.xxl,
    height: designTokens.avatarSize.xxl,
    borderRadius: designTokens.borderRadius.full,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    marginBottom: designTokens.spacing.md,
  },
  profileName: {
    ...mobileTypography.heading2,
    marginBottom: designTokens.spacing.xs,
    textAlign: layoutConstants.textAlign.center,
  },
  profileEmail: {
    ...mobileTypography.body,
    marginBottom: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
  },
  roleBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.xs,
  },
  roleText: {
    ...mobileTypography.captionBold,
  },
  settingRow: {
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: borderValues.color.transparent,
  },
  statusContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
  },
  statusInfo: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: flexValues.one,
    gap: designTokens.spacing.md,
  },
  statusIconContainer: {
    width: designTokens.touchTarget.comfortable,
    height: designTokens.touchTarget.comfortable,
    borderRadius: designTokens.borderRadius.full,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  statusText: {
    flex: flexValues.one,
  },
  statusLabel: {
    ...mobileTypography.bodyLargeBold,
    marginBottom: designTokens.spacing.xxs,
  },
  statusDescription: {
    ...mobileTypography.caption,
  },
  detailsContainer: {
    // Container for detail items
  },
  detailRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: borderValues.color.transparent,
    gap: designTokens.spacing.md,
  },
  detailIconContainer: {
    width: designTokens.avatarSize.md,
    height: designTokens.avatarSize.md,
    borderRadius: designTokens.borderRadius.full,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  detailText: {
    flex: flexValues.one,
  },
  detailLabel: {
    ...mobileTypography.caption,
    marginBottom: designTokens.spacing.xxs,
  },
  detailValue: {
    ...mobileTypography.bodyLarge,
  },
  classesContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.xs,
    marginTop: designTokens.spacing.xs,
  },
  classBadge: {
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.md,
  },
  classBadgeText: {
    ...mobileTypography.caption,
    fontWeight: designTokens.fontWeight.semibold,
  },
  logoutButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    borderWidth: designTokens.borderWidth.medium,
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
