/**
 * ProfileScreen
 * Unified profile screen accessible from header for all user roles
 * Redesigned with modern card-based layout matching app design patterns
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { UserRole } from '../../types';
import { designTokens, layoutConstants } from '../../shared/theme';
import { mobileTypography } from '../../shared/theme/mobileTypography';
import {
  MESSAGES,
  ICONS,
  TOUCH_OPACITY,
  flexValues,
  ALERT_BUTTON_STYLE,
  LIST_SEPARATOR,
  OPACITY,
  COMPONENT_VARIANT,
} from '../../shared/constants';
import { Card, SectionHeader } from '../../shared/components';

const ProfileScreen = () => {
  const { t } = useTranslation();
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
    Alert.alert(MESSAGES.TITLES.LOGOUT, MESSAGES.WARNINGS.CONFIRM_LOGOUT, [
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
    ]);
  };

  const getRoleLabel = (role: UserRole | undefined): string => {
    switch (role) {
      case UserRole.ADMIN:
        return t('roles.administrator');
      case UserRole.CLUB_ADMIN:
        return t('roles.clubAdmin');
      case UserRole.USER:
        return t('roles.member');
      default:
        return t('roles.user');
    }
  };

  const getRoleIcon = (
    role: UserRole | undefined
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
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

  const getRoleGradientStart = (role: UserRole | undefined): string => {
    switch (role) {
      case UserRole.ADMIN:
        return designTokens.colors.primary[600]; // Deep blue for admin
      case UserRole.CLUB_ADMIN:
        return designTokens.colors.primary[500]; // Main blue for club admin
      case UserRole.USER:
        return designTokens.colors.primary[400]; // Lighter blue for user
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
        <Card
          variant={COMPONENT_VARIANT.elevated}
          style={[styles.profileCard, { backgroundColor: getRoleGradientStart(user?.role) }]}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarOuter, { backgroundColor: designTokens.overlay.light }]}>
                <View
                  style={[
                    styles.avatarInner,
                    { backgroundColor: designTokens.overlay.lightOpaque },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getRoleIcon(user?.role)}
                    size={designTokens.iconSize['3xl']}
                    color={getRoleGradientStart(user?.role)}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.userName}>{user?.name || t('roles.user')}</Text>
            <Text style={styles.userEmail}>{user?.email || t('screens.account.defaultEmail')}</Text>

            <View style={styles.roleBadge}>
              <MaterialCommunityIcons
                name={getRoleIcon(user?.role)}
                size={designTokens.iconSize.xs}
                color={designTokens.overlay.lightOpaque}
              />
              <Text style={styles.roleText}>{getRoleLabel(user?.role)}</Text>
            </View>

            {/* Quick Stats */}
            {user?.role !== UserRole.ADMIN && (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons
                    name={ICONS.CHECK_CIRCLE}
                    size={designTokens.iconSize.md}
                    color={designTokens.overlay.lightOpaque}
                  />
                  <Text style={styles.statText}>
                    {isActive ? t('common.active') : t('screens.profile.inactive')}
                  </Text>
                </View>
                {user?.classes && user.classes.length > 0 && <View style={styles.statDivider} />}
                {user?.classes && user.classes.length > 0 && (
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name={ICONS.SCHOOL}
                      size={designTokens.iconSize.md}
                      color={designTokens.overlay.lightOpaque}
                    />
                    <Text style={styles.statText}>
                      {t('screens.profile.classCount', { count: user.classes.length })}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </Card>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <SectionHeader title={t('screens.profile.preferences')} />
        <Card variant={COMPONENT_VARIANT.elevated}>
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
        <Card variant={COMPONENT_VARIANT.elevated}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={TOUCH_OPACITY.default}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.info + '20' }]}>
              <MaterialCommunityIcons
                name={ICONS.EARTH}
                size={designTokens.iconSize.lg}
                color={colors.info}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>
                {t('screens.profile.timezone')}
              </Text>
              <Text style={[styles.menuValue, { color: colors.textPrimary }]}>
                {user?.timezone || t('screens.profile.defaultTimezone')}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={ICONS.CHEVRON_RIGHT}
              size={designTokens.iconSize.lg}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Account Status - Only shown for non-admin users */}
      {user?.role !== UserRole.ADMIN && (
        <View style={styles.section}>
          <SectionHeader title={t('screens.profile.activityStatus')} />
          <Card variant={COMPONENT_VARIANT.elevated}>
            <View style={styles.statusContainer}>
              <View style={styles.statusInfo}>
                <View
                  style={[
                    styles.statusIconContainer,
                    {
                      backgroundColor: isActive
                        ? `${colors.success}${OPACITY.LIGHT}`
                        : `${colors.textTertiary}${OPACITY.LIGHT}`,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={isActive ? ICONS.ACCOUNT_CHECK : ICONS.ACCOUNT_OFF}
                    size={designTokens.iconSize.lg}
                    color={isActive ? colors.success : colors.textTertiary}
                  />
                </View>
                <View style={styles.statusText}>
                  <Text style={[styles.statusLabel, { color: colors.textPrimary }]}>
                    {isActive
                      ? t('screens.profile.participating')
                      : t('screens.profile.notParticipating')}
                  </Text>
                  <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                    {isActive
                      ? t('screens.profile.activeInActivities')
                      : t('screens.profile.notInActivities')}
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
          <SectionHeader title={t('screens.profile.contactInfo')} />
          <Card variant={COMPONENT_VARIANT.elevated}>
            <View style={styles.detailsContainer}>
              {user?.whatsappNumber && (
                <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                  <View
                    style={[
                      styles.detailIconContainer,
                      { backgroundColor: designTokens.colors.social.whatsapp + '20' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={ICONS.WHATSAPP}
                      size={designTokens.iconSize.lg}
                      color={designTokens.colors.social.whatsapp}
                    />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      {t('screens.profile.whatsApp')}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {user.whatsappNumber}
                    </Text>
                  </View>
                </View>
              )}

              {user?.classes && user.classes.length > 0 && (
                <View style={styles.detailRow}>
                  <View
                    style={[styles.detailIconContainer, { backgroundColor: colors.primary + '20' }]}
                  >
                    <MaterialCommunityIcons
                      name={ICONS.SCHOOL}
                      size={designTokens.iconSize.lg}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.detailText}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      {t('screens.profile.pathfinderClasses')}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {user.classes.join(LIST_SEPARATOR)}
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
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + '12', borderColor: colors.error },
          ]}
          onPress={handleLogout}
          activeOpacity={TOUCH_OPACITY.default}
        >
          <MaterialCommunityIcons
            name={ICONS.LOGOUT}
            size={designTokens.iconSize.lg}
            color={colors.error}
          />
          <Text style={[styles.logoutButtonText, { color: colors.error }]}>
            {t('screens.settings.signOut')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Version info */}
      <View style={styles.versionSection}>
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          {t('screens.profile.appName')} • {t('screens.settings.version', { version: '1.0.0' })}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
  },
  headerSection: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
  },
  profileCard: {
    overflow: layoutConstants.overflow.hidden,
  },
  profileHeader: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  avatarWrapper: {
    marginBottom: designTokens.spacing.md,
  },
  avatarOuter: {
    width: designTokens.avatarSize['3xl'], // 96 → closest token
    height: designTokens.avatarSize['3xl'],
    borderRadius: designTokens.avatarSize['3xl'] / 2,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  avatarInner: {
    width: designTokens.avatarSize['2xl'], // 80
    height: designTokens.avatarSize['2xl'],
    borderRadius: designTokens.avatarSize['2xl'] / 2,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  userName: {
    ...mobileTypography.heading2,
    color: designTokens.colors.white,
    marginBottom: designTokens.spacing.xs,
    textAlign: layoutConstants.textAlign.center,
  },
  userEmail: {
    ...mobileTypography.body,
    color: designTokens.overlay.lightOpaque,
    marginBottom: designTokens.spacing.md,
    textAlign: layoutConstants.textAlign.center,
  },
  roleBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.overlay.light,
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.radius.full,
    gap: designTokens.spacing.xs,
  },
  roleText: {
    ...mobileTypography.captionBold,
    color: designTokens.colors.white,
  },
  statsRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.overlay.light,
  },
  statItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  statDivider: {
    width: designTokens.borderWidth.thin,
    height: designTokens.spacing.lg,
    backgroundColor: designTokens.overlay.lightStrong,
    marginHorizontal: designTokens.spacing.md,
  },
  statText: {
    ...mobileTypography.caption,
    color: designTokens.overlay.lightOpaque,
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
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.transparent,
  },
  menuItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  menuIconContainer: {
    width: designTokens.touchTarget.minimum, // 44
    height: designTokens.touchTarget.minimum,
    borderRadius: designTokens.touchTarget.minimum / 2,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  menuContent: {
    flex: flexValues.one,
  },
  menuLabel: {
    ...mobileTypography.caption,
    marginBottom: designTokens.spacing.xxs,
  },
  menuValue: {
    ...mobileTypography.bodyLarge,
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
    width: designTokens.touchTarget.comfortable, // 48
    height: designTokens.touchTarget.comfortable,
    borderRadius: designTokens.touchTarget.comfortable / 2,
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
    borderBottomColor: designTokens.colors.transparent,
    gap: designTokens.spacing.md,
  },
  detailIconContainer: {
    width: designTokens.touchTarget.minimum,
    height: designTokens.touchTarget.minimum,
    borderRadius: designTokens.touchTarget.minimum / 2,
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
  logoutButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.radius.lg,
    borderWidth: designTokens.borderWidth.medium,
    gap: designTokens.spacing.sm,
  },
  logoutButtonText: {
    ...mobileTypography.bodyLargeBold,
  },
  versionSection: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing['3xl'],
  },
  versionText: {
    ...mobileTypography.caption,
  },
});

export default ProfileScreen;
