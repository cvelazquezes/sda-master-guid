import React, { useState } from 'react';
import { Animated, RefreshControl, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LoadingState } from './LoadingState';
import { ProfileHeader } from './ProfileHeader';
import { QuickActions } from './QuickActions';
import { getRoleConfig } from './roleConfig';
import { showLogoutAlert, showToggleActiveAlert } from './settingsHandlers';
import {
  AccountSection,
  AppearanceSection,
  LogoutSection,
  NotificationsSection,
  SupportSection,
} from './SettingsSections';
import { useSettingsData } from './useSettingsData';
import { useSettingsStyles } from './useSettingsStyles';
import { UserDetailModal } from '../../../components/features/UserDetailModal';
import { useAuth } from '../../../state/AuthContext';
import { useTheme } from '../../../state/ThemeContext';

const BOTTOM_SPACER_HEIGHT = 40;

const SettingsScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const { styles } = useSettingsStyles();
  const [detailVisible, setDetailVisible] = useState(false);
  const data = useSettingsData(user?.id, user?.clubId, user?.isActive);
  const roleConfig = getRoleConfig(user?.role, colors, t);

  const handleToggleActive = (newValue: boolean): void => {
    if (user) {
      showToggleActiveAlert(user.id, newValue, data.setIsActive, t);
    }
  };
  const handleLogout = (): void => showLogoutAlert(t, logout);
  const openProfile = (): void => setDetailVisible(true);
  const closeProfile = (): void => setDetailVisible(false);

  if (data.loading) {
    return <LoadingState colors={colors} />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={data.refreshing}
          tintColor={colors.primary}
          onRefresh={data.onRefresh}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader
        user={user}
        club={data.club}
        isActive={data.isActive}
        roleConfig={roleConfig}
        colors={colors}
        t={t}
      />
      <Animated.View style={{ opacity: data.fadeAnim }}>
        <QuickActions
          userRole={user?.role}
          isActive={data.isActive}
          colors={colors}
          t={t}
          onViewProfile={openProfile}
          onToggleActive={(): void => handleToggleActive(!data.isActive)}
          onLogout={handleLogout}
        />
        <AppearanceSection colors={colors} t={t} />
        <AccountSection
          colors={colors}
          t={t}
          club={data.club}
          userRole={user?.role}
          isActive={data.isActive}
          onViewProfile={openProfile}
          onToggleActive={handleToggleActive}
        />
        <NotificationsSection colors={colors} t={t} />
        <SupportSection colors={colors} t={t} />
        <LogoutSection colors={colors} t={t} onLogout={handleLogout} />
        <View style={{ height: BOTTOM_SPACER_HEIGHT }} />
      </Animated.View>
      <UserDetailModal user={data.fullUser} visible={detailVisible} onClose={closeProfile} />
    </ScrollView>
  );
};

export default SettingsScreen;
