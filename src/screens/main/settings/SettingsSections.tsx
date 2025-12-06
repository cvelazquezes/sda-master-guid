import React from 'react';
import { View, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { ThemeSwitcher } from '../../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { Club, UserRole } from '../../../types';
import { designTokens } from '../../../shared/theme';
import { ICONS } from '../../../shared/constants';
import { sectionStyles, menuItemStyles } from './styles';
import { MenuItem } from './MenuItem';

interface SectionProps {
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

interface AccountSectionProps extends SectionProps {
  club: Club | null;
  userRole?: UserRole;
  isActive: boolean;
  onViewProfile: () => void;
  onToggleActive: (v: boolean) => void;
}

export function AppearanceSection({ colors, t }: SectionProps): React.JSX.Element {
  const sectionBg = [sectionStyles.section, { backgroundColor: colors.surface }];
  const itemBorder = [menuItemStyles.menuItem, { borderBottomColor: colors.border }];
  const primaryBg = `${colors.primary}15`;
  const infoBg = `${colors.info}15`;

  return (
    <View style={sectionBg}>
      <SectionHeader
        icon={ICONS.PALETTE_OUTLINE}
        title={t('screens.settings.appearance')}
        colors={colors}
      />
      <View style={itemBorder}>
        <View style={[menuItemStyles.menuIcon, { backgroundColor: primaryBg }]}>
          <MaterialCommunityIcons
            name={ICONS.THEME_LIGHT_DARK}
            size={designTokens.iconSize.md}
            color={colors.primary}
          />
        </View>
        <View style={menuItemStyles.menuContent}>
          <Text style={[menuItemStyles.menuTitle, { color: colors.textPrimary }]}>
            {t('screens.settings.theme')}
          </Text>
          <Text style={[menuItemStyles.menuSubtitle, { color: colors.textTertiary }]}>
            {t('screens.settings.customizeAppearance')}
          </Text>
        </View>
        <ThemeSwitcher />
      </View>
      <View style={[menuItemStyles.menuItem, { borderBottomWidth: 0 }]}>
        <View style={[menuItemStyles.menuIcon, { backgroundColor: infoBg }]}>
          <MaterialCommunityIcons
            name={ICONS.TRANSLATE}
            size={designTokens.iconSize.md}
            color={colors.info}
          />
        </View>
        <View style={menuItemStyles.menuContent}>
          <Text style={[menuItemStyles.menuTitle, { color: colors.textPrimary }]}>
            {t('screens.settings.language')}
          </Text>
          <Text style={[menuItemStyles.menuSubtitle, { color: colors.textTertiary }]}>
            {t('screens.settings.changeLanguage')}
          </Text>
        </View>
        <LanguageSwitcher />
      </View>
    </View>
  );
}

export function AccountSection({
  colors,
  t,
  club,
  userRole,
  isActive,
  onViewProfile,
  onToggleActive,
}: AccountSectionProps): React.JSX.Element {
  const sectionBg = [sectionStyles.section, { backgroundColor: colors.surface }];
  const statusColor = isActive ? colors.success : colors.warning;
  const statusIcon = isActive ? ICONS.CHECK_CIRCLE : ICONS.PAUSE_CIRCLE;
  const statusText = isActive
    ? t('screens.settings.accountIsActive')
    : t('screens.settings.accountIsPaused');

  return (
    <View style={sectionBg}>
      <SectionHeader
        icon={ICONS.ACCOUNT_COG_OUTLINE}
        title={t('screens.settings.account')}
        colors={colors}
      />
      <MenuItem
        icon={ICONS.ACCOUNT_CIRCLE_OUTLINE}
        title={t('screens.settings.profileInformation')}
        subtitle={t('screens.settings.profileSubtitle')}
        onPress={onViewProfile}
        colors={colors}
      />
      {club && (
        <MenuItem
          icon={ICONS.CHURCH}
          iconColor={colors.secondary}
          iconBg={`${colors.secondary}15`}
          title={t('screens.settings.clubDetails')}
          subtitle={club.name}
          colors={colors}
        />
      )}
      {userRole !== UserRole.ADMIN && (
        <AccountStatusSwitch
          statusIcon={statusIcon}
          statusColor={statusColor}
          statusText={statusText}
          isActive={isActive}
          onToggleActive={onToggleActive}
          colors={colors}
          t={t}
        />
      )}
    </View>
  );
}

function AccountStatusSwitch({
  statusIcon,
  statusColor,
  statusText,
  isActive,
  onToggleActive,
  colors,
  t,
}: {
  statusIcon: string;
  statusColor: string;
  statusText: string;
  isActive: boolean;
  onToggleActive: (v: boolean) => void;
  colors: Record<string, string>;
  t: (k: string) => string;
}): React.JSX.Element {
  return (
    <View style={[menuItemStyles.menuItem, { borderBottomWidth: 0 }]}>
      <View style={[menuItemStyles.menuIcon, { backgroundColor: `${statusColor}15` }]}>
        <MaterialCommunityIcons
          name={statusIcon as typeof ICONS.CHECK_CIRCLE}
          size={designTokens.iconSize.md}
          color={statusColor}
        />
      </View>
      <View style={menuItemStyles.menuContent}>
        <Text style={[menuItemStyles.menuTitle, { color: colors.textPrimary }]}>
          {t('screens.settings.accountStatus')}
        </Text>
        <Text style={[menuItemStyles.menuSubtitle, { color: colors.textTertiary }]}>
          {statusText}
        </Text>
      </View>
      <Switch
        value={isActive}
        onValueChange={onToggleActive}
        trackColor={{ false: colors.border, true: `${colors.success}50` }}
        thumbColor={isActive ? colors.success : colors.textTertiary}
      />
    </View>
  );
}

export function NotificationsSection({ colors, t }: SectionProps): React.JSX.Element {
  return (
    <View style={[sectionStyles.section, { backgroundColor: colors.surface }]}>
      <SectionHeader
        icon={ICONS.BELL_OUTLINE}
        title={t('screens.settings.notifications')}
        colors={colors}
      />
      <NotificationToggle
        icon={ICONS.BELL_RING_OUTLINE}
        color={colors.primary}
        title={t('screens.settings.pushNotifications')}
        subtitle={t('screens.settings.receiveAppNotifications')}
        colors={colors}
        hasBorder
      />
      <NotificationToggle
        icon={ICONS.EMAIL_OUTLINE}
        color={colors.info}
        title={t('screens.settings.emailUpdates')}
        subtitle={t('screens.settings.receiveEmailNotifications')}
        colors={colors}
      />
    </View>
  );
}

function NotificationToggle({
  icon,
  color,
  title,
  subtitle,
  colors,
  hasBorder,
}: {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  colors: Record<string, string>;
  hasBorder?: boolean;
}): React.JSX.Element {
  const itemStyle = hasBorder
    ? [menuItemStyles.menuItem, { borderBottomColor: colors.border }]
    : [menuItemStyles.menuItem, { borderBottomWidth: 0 }];
  return (
    <View style={itemStyle}>
      <View style={[menuItemStyles.menuIcon, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.BELL_RING_OUTLINE}
          size={designTokens.iconSize.md}
          color={color}
        />
      </View>
      <View style={menuItemStyles.menuContent}>
        <Text style={[menuItemStyles.menuTitle, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[menuItemStyles.menuSubtitle, { color: colors.textTertiary }]}>
          {subtitle}
        </Text>
      </View>
      <Switch value trackColor={{ false: colors.border, true: `${color}50` }} thumbColor={color} />
    </View>
  );
}

export function SupportSection({ colors, t }: SectionProps): React.JSX.Element {
  const sectionBg = [sectionStyles.section, { backgroundColor: colors.surface }];

  return (
    <View style={sectionBg}>
      <SectionHeader
        icon={ICONS.HELP_CIRCLE_OUTLINE}
        title={t('screens.settings.support')}
        colors={colors}
      />
      <MenuItem
        icon={ICONS.FREQUENTLY_ASKED_QUESTIONS}
        iconColor={colors.info}
        iconBg={`${colors.info}15`}
        title={t('screens.settings.faq')}
        subtitle={t('screens.settings.faqSubtitle')}
        colors={colors}
      />
      <MenuItem
        icon={ICONS.MESSAGE_TEXT_OUTLINE}
        iconColor={colors.secondary}
        iconBg={`${colors.secondary}15`}
        title={t('screens.settings.contactSupport')}
        subtitle={t('screens.settings.contactSupportSubtitle')}
        colors={colors}
      />
      <MenuItem
        icon={ICONS.FILE_DOCUMENT_OUTLINE}
        title={t('screens.settings.privacyPolicy')}
        colors={colors}
      />
      <MenuItem
        icon={ICONS.INFORMATION_OUTLINE}
        title={t('screens.settings.about')}
        subtitle={t('screens.settings.version', { version: '1.0.0' })}
        showChevron={false}
        colors={colors}
        noBorder
      />
    </View>
  );
}

interface LogoutSectionProps extends SectionProps {
  onLogout: () => void;
}

export function LogoutSection({ colors, t, onLogout }: LogoutSectionProps): React.JSX.Element {
  return (
    <View style={[sectionStyles.section, { backgroundColor: colors.surface }]}>
      <MenuItem
        icon={ICONS.LOGOUT}
        title={t('screens.settings.signOut')}
        danger
        onPress={onLogout}
        showChevron={false}
        colors={colors}
        noBorder
      />
    </View>
  );
}

interface SectionHeaderProps {
  icon: string;
  title: string;
  colors: Record<string, string>;
}

function SectionHeader({ icon, title, colors }: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={sectionStyles.sectionHeader}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.PALETTE_OUTLINE}
        size={designTokens.iconSize.md}
        color={colors.primary}
      />
      <Text style={[sectionStyles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
    </View>
  );
}
