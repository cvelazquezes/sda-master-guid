import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AboutSection } from './AboutSection';
import { ActivityStatusSection } from './ActivityStatusSection';
import { ClubMembershipSection } from './ClubMembershipSection';
import { ContactInfoSection } from './ContactInfoSection';
import { LogoutSection } from './LogoutSection';
import { PreferencesSection } from './PreferencesSection';
import { ProfileHeader } from './ProfileHeader';
import { getApprovalStatusLabel, getRoleConfig } from './roleUtils';
import { createStyles } from './styles';
import { handleLogout, handleToggleActive, useAccountData } from './useAccountData';
import { EMPTY_VALUE } from '../../../../shared/constants';
import { UserRole } from '../../../../types';
import { PageHeader } from '../../../components/primitives';
import { useAuth } from '../../../state/AuthContext';
import { useTheme } from '../../../state/ThemeContext';

const AccountScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const { colors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const { club, isActive, setIsActive, loading, setLoading } = useAccountData(
    user?.clubId,
    user?.role,
    user?.isActive !== false
  );
  const roleConfig = getRoleConfig(user?.role, colors, t);
  const approvalStatus = getApprovalStatusLabel(user?.approvalStatus, colors, t);
  const isNonAdmin = user?.role !== UserRole.ADMIN;
  const onToggleActive = (v: boolean): void => {
    handleToggleActive(v, setIsActive, setLoading, updateUser);
  };
  const onLogout = (): void => handleLogout(logout);

  return (
    <View style={styles.container}>
      <PageHeader title={t('screens.account.title')} subtitle={t('screens.account.subtitle')} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileHeader
          name={user?.name || EMPTY_VALUE}
          email={user?.email || EMPTY_VALUE}
          roleLabel={roleConfig.label}
          roleIcon={roleConfig.icon}
          roleColor={roleConfig.color}
          colors={colors}
          t={t}
        />
        {isNonAdmin && (
          <ContactInfoSection
            email={user?.email}
            whatsappNumber={user?.whatsappNumber}
            colors={colors}
            t={t}
          />
        )}
        {isNonAdmin && (
          <ClubMembershipSection
            club={club}
            classes={user?.classes}
            createdAt={user?.createdAt}
            approvalStatus={user?.approvalStatus}
            approvalLabel={approvalStatus.label}
            approvalColor={approvalStatus.color}
            colors={colors}
            t={t}
          />
        )}
        {isNonAdmin && (
          <ActivityStatusSection
            isActive={isActive}
            loading={loading}
            colors={colors}
            t={t}
            onToggle={onToggleActive}
          />
        )}
        <PreferencesSection timezone={user?.timezone} colors={colors} t={t} />
        <AboutSection colors={colors} t={t} />
        <LogoutSection colors={colors} t={t} onLogout={onLogout} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
