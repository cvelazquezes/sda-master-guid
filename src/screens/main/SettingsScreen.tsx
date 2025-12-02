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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { UserRole, Club, User } from '../../types';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { UserDetailModal } from '../../components/UserDetailModal';
import { mobileTypography, mobileFontSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';

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
        duration: 400,
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
      console.error('Failed to load settings data:', error);
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

    const actionText = newValue ? 'activate' : 'pause';
    Alert.alert(
      `${newValue ? 'Activate' : 'Pause'} Account`,
      `Are you sure you want to ${actionText} your account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await userService.updateUserActiveStatus(
                user.id,
                newValue
              );
              setIsActive(newValue);
              Alert.alert('Success', `Your account has been ${newValue ? 'activated' : 'paused'}.`);
            } catch (error) {
              Alert.alert('Error', `Failed to ${actionText} your account.`);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const getRoleConfig = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return { 
          label: 'Administrator', 
          color: colors.error,
          bg: colors.errorLight || `${colors.error}15`,
          icon: 'shield-crown' as IconName
        };
      case UserRole.CLUB_ADMIN:
        return { 
          label: 'Club Admin', 
          color: colors.warning,
          bg: colors.warningLight || `${colors.warning}15`,
          icon: 'account-star' as IconName
        };
      default:
        return { 
          label: 'Member', 
          color: colors.info,
          bg: colors.infoLight || `${colors.info}15`,
          icon: 'account' as IconName
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
          size={22} 
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
          name="chevron-right" 
          size={24} 
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
            <MaterialCommunityIcons name={roleConfig.icon} size={16} color={colors.textInverse} />
            <Text style={[styles.roleText, { color: colors.textInverse }]}>
              {roleConfig.label}
            </Text>
          </View>

          {/* Quick Stats */}
          {club && (
            <View style={[styles.headerStats, { borderTopColor: `${colors.textInverse}30` }]}>
              <View style={styles.headerStat}>
                <MaterialCommunityIcons name="church" size={20} color={colors.textInverse} />
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
                    {isActive ? 'Active' : 'Paused'}
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
              <MaterialCommunityIcons name="account-circle" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>View Profile</Text>
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
                  name={isActive ? 'pause-circle' : 'play-circle'} 
                  size={24} 
                  color={isActive ? colors.warning : colors.success} 
                />
              </View>
              <Text style={[styles.quickActionText, { color: colors.textPrimary }]}>
                {isActive ? 'Pause' : 'Activate'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.surface }]}
            onPress={handleLogout}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.error}15` }]}>
              <MaterialCommunityIcons name="logout" size={24} color={colors.error} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="palette-outline" size={22} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Appearance
            </Text>
          </View>
          
          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialCommunityIcons name="theme-light-dark" size={22} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Theme</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                Customize app appearance
              </Text>
            </View>
            <ThemeSwitcher />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.info}15` }]}>
              <MaterialCommunityIcons name="translate" size={22} color={colors.info} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Language</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                Change app language
              </Text>
            </View>
            <LanguageSwitcher />
          </View>
        </View>

        {/* Account Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-cog-outline" size={22} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Account
            </Text>
          </View>

          <MenuItem
            icon="account-circle-outline"
            title="Profile Information"
            subtitle="View and edit your details"
            onPress={() => setDetailVisible(true)}
          />

          {club && (
            <MenuItem
              icon="church"
              iconColor={colors.secondary}
              iconBg={`${colors.secondary}15`}
              title="Club Details"
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
                  name={isActive ? 'check-circle' : 'pause-circle'} 
                  size={22} 
                  color={isActive ? colors.success : colors.warning} 
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Account Status</Text>
                <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                  {isActive ? 'Your account is active' : 'Your account is paused'}
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
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Notifications
            </Text>
          </View>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialCommunityIcons name="bell-ring-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Push Notifications</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                Receive app notifications
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
              <MaterialCommunityIcons name="email-outline" size={22} color={colors.info} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Email Updates</Text>
              <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>
                Receive email notifications
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
            <MaterialCommunityIcons name="help-circle-outline" size={22} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Support
            </Text>
          </View>

          <MenuItem
            icon="frequently-asked-questions"
            iconColor={colors.info}
            iconBg={`${colors.info}15`}
            title="FAQ"
            subtitle="Frequently asked questions"
          />

          <MenuItem
            icon="message-text-outline"
            iconColor={colors.secondary}
            iconBg={`${colors.secondary}15`}
            title="Contact Support"
            subtitle="Get help from our team"
          />

          <MenuItem
            icon="file-document-outline"
            title="Privacy Policy"
          />

          <MenuItem
            icon="information-outline"
            title="About"
            subtitle="Version 1.0.0"
            showChevron={false}
          />
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <MenuItem
            icon="logout"
            title="Sign Out"
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
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: designTokens.spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    padding: 4,
    borderRadius: 60,
    marginBottom: designTokens.spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
  },
  userName: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: '700',
    marginBottom: designTokens.spacing.xs,
  },
  userEmail: {
    fontSize: mobileFontSizes.md,
    marginBottom: designTokens.spacing.md,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.sm,
  },
  roleText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
    borderTopWidth: 1,
    gap: designTokens.spacing.md,
  },
  headerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  headerStatText: {
    fontSize: mobileFontSizes.sm,
  },
  headerStatDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  quickActionText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
    overflow: 'hidden',
    ...designTokens.shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    marginBottom: designTokens.spacing.xxs,
  },
  menuSubtitle: {
    fontSize: mobileFontSizes.xs,
  },
  // Skeleton
  skeletonProfile: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing['4xl'],
  },
  skeletonAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: designTokens.spacing.lg,
  },
  skeletonName: {
    width: 150,
    height: 24,
    borderRadius: designTokens.borderRadius.sm,
    marginBottom: designTokens.spacing.sm,
  },
  skeletonEmail: {
    width: 200,
    height: 16,
    borderRadius: designTokens.borderRadius.sm,
  },
});

export default SettingsScreen;
