import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../state/AuthContext';
import { useTheme } from '../../../state/ThemeContext';
import { UserRole } from '../../../../types';
import { PageHeader } from '../../../components/primitives';
import { EMPTY_VALUE } from '../../../../shared/constants';
import { styles } from './styles';
import { getRoleConfig, getApprovalStatusLabel } from './roleUtils';
import { useAccountData, handleToggleActive, handleLogout } from './useAccountData';
import { ProfileHeader } from './ProfileHeader';
import { ContactInfoSection } from './ContactInfoSection';
import { ClubMembershipSection } from './ClubMembershipSection';
import { ActivityStatusSection } from './ActivityStatusSection';
import { PreferencesSection } from './PreferencesSection';
import { AboutSection } from './AboutSection';
import { LogoutSection } from './LogoutSection';

const AccountScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            onToggle={onToggleActive}
            colors={colors}
            t={t}
          />
        )}
        <PreferencesSection timezone={user?.timezone} colors={colors} t={t} />
        <AboutSection colors={colors} t={t} />
        <LogoutSection onLogout={onLogout} colors={colors} t={t} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
