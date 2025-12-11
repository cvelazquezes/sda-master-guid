import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AccountStatusSection } from './AccountStatusSection';
import { ContactInfoSection } from './ContactInfoSection';
import { LogoutSection } from './LogoutSection';
import { PreferencesSection } from './PreferencesSection';
import { ProfileHeader } from './ProfileHeader';
import { createScreenStyles } from './styles';
import { useProfileState } from './useProfileState';
import { UserRole } from '../../../../types';
import { useAuth } from '../../../state/AuthContext';
import { useTheme } from '../../../state/ThemeContext';

const ProfileScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const screenStyles = useMemo(() => createScreenStyles(colors), [colors]);
  const { isActive, loading, handleToggleActive, handleLogout } = useProfileState();

  const logoutLabels = {
    signOut: t('screens.settings.signOut'),
    appName: t('screens.profile.appName'),
    version: t('screens.settings.version', { version: '1.0.0' }),
  };

  const containerStyle = [screenStyles.container, { backgroundColor: colors.background }];

  return (
    <ScrollView style={containerStyle} showsVerticalScrollIndicator={false}>
      <ProfileHeader user={user} isActive={isActive} colors={colors} t={t} />
      <PreferencesSection timezone={user?.timezone} colors={colors} t={t} />
      {user?.role !== UserRole.ADMIN && (
        <AccountStatusSection
          isActive={isActive}
          loading={loading}
          colors={colors}
          t={t}
          onToggle={handleToggleActive}
        />
      )}
      <ContactInfoSection user={user} colors={colors} t={t} />
      <LogoutSection colors={colors} labels={logoutLabels} onLogout={handleLogout} />
    </ScrollView>
  );
};

export default ProfileScreen;
