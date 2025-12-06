import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { UserRole } from '../../../types';
import { FLEX } from '../../../shared/constants';
import { useProfileState } from './useProfileState';
import { ProfileHeader } from './ProfileHeader';
import { PreferencesSection } from './PreferencesSection';
import { AccountStatusSection } from './AccountStatusSection';
import { ContactInfoSection } from './ContactInfoSection';
import { LogoutSection } from './LogoutSection';

const ProfileScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { isActive, loading, handleToggleActive, handleLogout } = useProfileState();

  const logoutLabels = {
    signOut: t('screens.settings.signOut'),
    appName: t('screens.profile.appName'),
    version: t('screens.settings.version', { version: '1.0.0' }),
  };

  const containerStyle = [styles.container, { backgroundColor: colors.background }];

  return (
    <ScrollView style={containerStyle} showsVerticalScrollIndicator={false}>
      <ProfileHeader user={user} isActive={isActive} colors={colors} t={t} />
      <PreferencesSection timezone={user?.timezone} colors={colors} t={t} />
      {user?.role !== UserRole.ADMIN && (
        <AccountStatusSection
          isActive={isActive}
          loading={loading}
          onToggle={handleToggleActive}
          colors={colors}
          t={t}
        />
      )}
      <ContactInfoSection user={user} colors={colors} t={t} />
      <LogoutSection onLogout={handleLogout} colors={colors} labels={logoutLabels} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.ONE,
  },
});

export default ProfileScreen;
