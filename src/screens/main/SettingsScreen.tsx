import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Switch,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { UserRole, Club, User } from '../../types';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { UserDetailModal } from '../../components/UserDetailModal';
import { mobileTypography, mobileFontSizes, designTokens, layoutConstants } from '../../shared/theme';
import { ICONS, ALERT_BUTTON_STYLE, MESSAGES, ANIMATION_DURATION } from '../../shared/constants';
import { flexValues, textTransformValues, typographyValues } from '../../shared/constants/layoutConstants';
import { LOG_MESSAGES } from '../../shared/constants/logMessages';
import { logger } from '../../shared/utils/logger';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface MenuItemProps {
  icon: IconName;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const [club, setClub] = useState<Club | null>(null);
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Animation
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.MEDIUM,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user?.clubId) {
        const clubData = await clubService.getClub(user.clubId);
        setClub(clubData);
      }
      if (user?.id) {
        const userData = await userService.getUser(user.id);
        setFullUser(userData);
        setIsActive(userData?.isActive ?? true);
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.SETTINGS.FAILED_TO_LOAD_DATA, error as Error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const handleToggleActive = async (newValue: boolean) => {
    if (!user) return;

    Alert.alert(
      newValue ? t('screens.settings.activateAccount') : t('screens.settings.pauseAccount'),
      newValue ? t('screens.settings.confirmActivate') : t('screens.settings.confirmPause'),
      [
        { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              await userService.updateUserActiveStatus(
                user.id,
                newValue
              );
              setIsActive(newValue);
              Alert.alert(MESSAGES.TITLES.SUCCESS, newValue ? t('screens.settings.accountActivated') : t('screens.settings.accountPaused'));
            } catch (error) {
              Alert.alert(MESSAGES.TITLES.ERROR, newValue ? t('screens.settings.failedToActivate') : t('screens.settings.failedToPause'));
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('screens.settings.signOut'),
      t('screens.settings.confirmSignOut'),
      [
        { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: t('screens.settings.signOut'),
          style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
          onPress: logout,
        },
      ]
    );
  };

  const getRoleConfig = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return { 
          label: t('roles.administrator'), 
          color: colors.error,
          bg: colors.errorLight || `${colors.error}15`,
          icon: ICONS.SHIELD_CROWN as IconName
        };
      case UserRole.CLUB_ADMIN:
        return { 
          label: t('roles.clubAdmin'), 
          color: colors.warning,
          bg: colors.warningLight || `${colors.warning}15`,
          icon: ICONS.ACCOUNT_STAR as IconName
        };
      default:
        return { 
          label: t('roles.member'), 
          color: colors.info,
          bg: colors.infoLight || `${colors.info}15`,
          icon: ICONS.ACCOUNT as IconName
        };
    }
  };

  const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    iconColor,
    iconBg,
    title,
    subtitle,
    rightComponent,
    onPress,
    showChevron = true,
    danger = false,
  }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress && !rightComponent}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[
        styles.menuIcon, 
        { backgroundColor: iconBg || (danger ? `${colors.error}15` : `${colors.primary}15`) }
      ]}>
        <MaterialCommunityIcons 
          name={icon} 
          size={designTokens.iconSize.md} 
          color={iconColor || (danger ? colors.error : colors.primary)} 
        />
      </View>
      <View style={styles.menuContent}>
        <Text style={[
          styles.menuTitle, 
          { color: danger ? colors.error : colors.textPrimary }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
      {showChevron && onPress && (
        <MaterialCommunityIcons 
          name={ICONS.CHEVRON_RIGHT} 
          size={designTokens.iconSize.lg} 
          color={colors.textTertiary} 
        />
      )}
    </TouchableOpacity>
  );

  const roleConfig = getRoleConfig();

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.skeletonProfile}>
            <View style={[styles.skeletonAvatar, { backgroundColor: `${colors.textInverse}30` }]} />
            <View style={[styles.skeletonName, { backgroundColor: `${colors.textInverse}20` }]} />
            <View style={[styles.skeletonEmail, { backgroundColor: `${colors.textInverse}15` }]} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          {/* Avatar */}
          <View style={[styles.avatarContainer, { backgroundColor: `${colors.textInverse}20` }]}>
            <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {user?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            {isActive && (
              <View style={[styles.activeIndicator, { backgroundColor: colors.success, borderColor: colors.primary }]} />
            )}
          </View>

          {/* User Info */}
          <Text style={[styles.userName, { color: colors.textInverse }]}>
            {user?.name}
          </Text>
          <Text style={[styles.userEmail, { color: `${colors.textInverse}BB` }]}>
            {user?.email}
          </Text>

          {/* Role Badge */}
          <View style={[styles.roleBadge, { backgroundColor: `${colors.textInverse}25` }]}>
            <MaterialCommunityIcons name={roleConfig.icon} size={designTokens.iconSize.sm} color={colors.textInverse} />
            <Text style={[styles.roleText, { color: colors.textInverse }]}>
              {roleConfig.label}
            </Text>
          </View>

          {/* Quick Stats */}
          {club && (
            <View style={[styles.headerStats, { borderTopColor: `${colors.textInverse}30` }]}>
              <View style={styles.headerStat}>
                <MaterialCommunityIcons name={ICONS.CHURCH} size={designTokens.iconSize.md} color={colors.textInverse} />
                <Text style={[styles.headerStatText, { color: colors.textInverse }]}>
                  {club.name}
                </Text>
              </View>
              {user && (
                <View style={[styles.headerStatDot, { backgroundColor: `${colors.textInverse}50` }]} />
              )}
              {user && (
                <View style={styles.headerStat}>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: isActive ? colors.success : colors.warning }
                  ]} />
                  <Text style={[styles.headerStatText, { color: colors.textInverse }]}>
                      {isActive ? t('common.active') : t('common.paused')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.surface }]}
            onPress={() => setDetailVisible(true)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialCommunityIcons name={ICONS.ACCOUNT_CIRCLE} size={designTokens.iconSize.lg} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>{t('screens.settings.viewProfile')}</Text>
          </TouchableOpacity>

          {user?.role !== UserRole.ADMIN && (
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.surface }]}
              onPress={() => handleToggleActive(!isActive)}
            >
              <View style={[
                styles.quickActionIcon, 
                { backgroundColor: isActive ? `${colors.warning}15` : `${colors.success}15` }
              ]}>
                <MaterialCommunityIcons 
                    name={isActive ? ICONS.PAUSE_CIRCLE : ICONS.PLAY_CIRCLE} 
                  size={designTokens.iconSize.lg} 
                  color={isActive ? colors.warning : colors.success} 
                />
              </View>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>
                {isActive ? t('common.pause') : t('common.activate')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.surface }]}
            onPress={handleLogout}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.error}15` }]}>
              <MaterialCommunityIcons name={ICONS.LOGOUT} size={designTokens.iconSize.lg} color={colors.error} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.error }]}>{t('screens.settings.signOut')}</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name={ICONS.PALETTE_OUTLINE} size={designTokens.iconSize.md} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('screens.settings.appearance')}
            </Text>
          </View>
          
          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialCommunityIcons name={ICONS.THEME_LIGHT_DARK} size={designTokens.iconSize.md} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('screens.settings.theme')}</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                {t('screens.settings.customizeAppearance')}
              </Text>
            </View>
            <ThemeSwitcher />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.info}15` }]}>
              <MaterialCommunityIcons name={ICONS.TRANSLATE} size={designTokens.iconSize.md} color={colors.info} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('screens.settings.language')}</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                {t('screens.settings.changeLanguage')}
              </Text>
            </View>
            <LanguageSwitcher />
          </View>
        </View>

        {/* Account Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name={ICONS.ACCOUNT_COG_OUTLINE} size={designTokens.iconSize.md} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('screens.settings.account')}
            </Text>
          </View>

          <MenuItem
            icon={ICONS.ACCOUNT_CIRCLE_OUTLINE}
            title={t('screens.settings.profileInformation')}
            subtitle={t('screens.settings.profileSubtitle')}
            onPress={() => setDetailVisible(true)}
          />

          {club && (
            <MenuItem
              icon={ICONS.CHURCH}
              iconColor={colors.secondary}
              iconBg={`${colors.secondary}15`}
              title={t('screens.settings.clubDetails')}
              subtitle={club.name}
            />
          )}

          {user?.role !== UserRole.ADMIN && (
            <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
              <View style={[
                styles.menuIcon, 
                { backgroundColor: isActive ? `${colors.success}15` : `${colors.warning}15` }
              ]}>
                <MaterialCommunityIcons 
                  name={isActive ? ICONS.CHECK_CIRCLE : ICONS.PAUSE_CIRCLE} 
                  size={designTokens.iconSize.md} 
                  color={isActive ? colors.success : colors.warning} 
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('screens.settings.accountStatus')}</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                  {isActive ? t('screens.settings.accountIsActive') : t('screens.settings.accountIsPaused')}
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={handleToggleActive}
                trackColor={{ false: colors.border, true: `${colors.success}50` }}
                thumbColor={isActive ? colors.success : colors.textTertiary}
              />
            </View>
          )}
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name={ICONS.BELL_OUTLINE} size={designTokens.iconSize.md} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('screens.settings.notifications')}
            </Text>
          </View>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialCommunityIcons name={ICONS.BELL_RING_OUTLINE} size={designTokens.iconSize.md} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('screens.settings.pushNotifications')}</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                {t('screens.settings.receiveAppNotifications')}
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: colors.border, true: `${colors.primary}50` }}
              thumbColor={colors.primary}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.info}15` }]}>
              <MaterialCommunityIcons name={ICONS.EMAIL_OUTLINE} size={designTokens.iconSize.md} color={colors.info} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{t('screens.settings.emailUpdates')}</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                {t('screens.settings.receiveEmailNotifications')}
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: colors.border, true: `${colors.info}50` }}
              thumbColor={colors.info}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name={ICONS.HELP_CIRCLE_OUTLINE} size={designTokens.iconSize.md} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('screens.settings.support')}
            </Text>
          </View>

          <MenuItem
            icon={ICONS.FREQUENTLY_ASKED_QUESTIONS}
            iconColor={colors.info}
            iconBg={`${colors.info}15`}
            title={t('screens.settings.faq')}
            subtitle={t('screens.settings.faqSubtitle')}
          />

          <MenuItem
            icon={ICONS.MESSAGE_TEXT_OUTLINE}
            iconColor={colors.secondary}
            iconBg={`${colors.secondary}15`}
            title={t('screens.settings.contactSupport')}
            subtitle={t('screens.settings.contactSupportSubtitle')}
          />

          <MenuItem
            icon={ICONS.FILE_DOCUMENT_OUTLINE}
            title={t('screens.settings.privacyPolicy')}
          />

          <MenuItem
            icon={ICONS.INFORMATION_OUTLINE}
            title={t('screens.settings.about')}
            subtitle={t('screens.settings.version', { version: '1.0.0' })}
            showChevron={false}
          />
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <MenuItem
            icon={ICONS.LOGOUT}
            title={t('screens.settings.signOut')}
            danger
            onPress={handleLogout}
            showChevron={false}
          />
        </View>

        <View style={{ height: 40 }} />
      </Animated.View>

      {/* User Detail Modal */}
      <UserDetailModal
        user={fullUser}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
  },
  header: {
    paddingTop: designTokens.spacing['6xl'],
    paddingBottom: designTokens.spacing.xxl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  headerContent: {
    alignItems: layoutConstants.alignItems.center,
  },
  avatarContainer: {
    padding: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    marginBottom: designTokens.spacing.lg,
  },
  avatar: {
    width: designTokens.avatarSize.xxl,
    height: designTokens.avatarSize.xxl,
    borderRadius: designTokens.borderRadius.full,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  avatarText: {
    fontSize: designTokens.fontSize['4xl'],
    fontWeight: designTokens.fontWeight.bold,
  },
  activeIndicator: {
    position: layoutConstants.position.absolute,
    bottom: designTokens.spacing.xs,
    right: designTokens.spacing.xs,
    width: designTokens.spacing.xl,
    height: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.full,
    borderWidth: designTokens.borderWidth.thick,
  },
  userName: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.xs,
  },
  userEmail: {
    fontSize: mobileFontSizes.md,
    marginBottom: designTokens.spacing.md,
  },
  roleBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.sm,
  },
  roleText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
  headerStats: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
    borderTopWidth: designTokens.borderWidth.thin,
    gap: designTokens.spacing.md,
  },
  headerStat: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  headerStatText: {
    fontSize: mobileFontSizes.sm,
  },
  headerStatDot: {
    width: designTokens.spacing.xs,
    height: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
  },
  statusDot: {
    width: designTokens.spacing.sm,
    height: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
  },
  quickActions: {
    flexDirection: layoutConstants.flexDirection.row,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  quickAction: {
    flex: flexValues.one,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.shadows.sm,
  },
  quickActionIcon: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  quickActionText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    textAlign: layoutConstants.textAlign.center,
  },
  section: {
    marginHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
    overflow: layoutConstants.overflow.hidden,
    ...designTokens.shadows.sm,
  },
  sectionHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.bold,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
  menuItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  menuIcon: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  menuContent: {
    flex: flexValues.one,
  },
  menuTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xxs,
  },
  menuSubtitle: {
    fontSize: mobileFontSizes.xs,
  },
  // Skeleton
  skeletonProfile: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['4xl'],
  },
  skeletonAvatar: {
    width: designTokens.avatarSize.xxl,
    height: designTokens.avatarSize.xxl,
    borderRadius: designTokens.borderRadius.full,
    marginBottom: designTokens.spacing.lg,
  },
  skeletonName: {
    width: designTokens.componentSizes.skeleton.text.sm,
    height: designTokens.componentSizes.tabBarIndicator.lg,
    borderRadius: designTokens.borderRadius.sm,
    marginBottom: designTokens.spacing.sm,
  },
  skeletonEmail: {
    width: designTokens.componentSizes.skeleton.text.md,
    height: designTokens.lineHeights.captionLarge,
    borderRadius: designTokens.borderRadius.sm,
  },
});

export default SettingsScreen;
