/**
 * UserMoreScreen
 * More options screen for regular club members
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenHeader, MenuCard, SectionHeader } from '../../shared/components';
import { ICONS, MENU_ITEM_IDS, FLEX } from '../../shared/constants';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen: string | null;
  color: string;
  disabled?: boolean;
}

// Extracted menu section component
function DisabledMenuSection({
  items,
  colors,
  t,
}: {
  items: MenuItem[];
  colors: ReturnType<typeof useTheme>['colors'];
  t: ReturnType<typeof useTranslation>['t'];
}): React.JSX.Element {
  return (
    <>
      {items.map((item) => (
        <MenuCard
          key={item.id}
          title={item.title}
          description={item.disabled ? t('common.comingSoon') : item.description}
          icon={item.icon}
          color={item.disabled ? colors.textTertiary : item.color}
          onPress={undefined}
          disabled={item.disabled}
        />
      ))}
    </>
  );
}

const UserMoreScreen = (): React.JSX.Element => {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();

  const clubItems: MenuItem[] = [
    {
      id: MENU_ITEM_IDS.CLUB_INFO,
      title: t('screens.userMore.clubInfo'),
      description: t('screens.userMore.clubInfoDescription'),
      icon: ICONS.INFORMATION,
      screen: null,
      color: colors.info,
      disabled: true,
    },
    {
      id: MENU_ITEM_IDS.CONTACT_ADMIN,
      title: t('screens.userMore.contactAdmin'),
      description: t('screens.userMore.contactAdminDescription'),
      icon: ICONS.MESSAGE_TEXT,
      screen: null,
      color: colors.primary,
      disabled: true,
    },
  ];

  const helpItems: MenuItem[] = [
    {
      id: MENU_ITEM_IDS.HELP,
      title: t('screens.userMore.helpAndSupport'),
      description: t('screens.userMore.helpAndSupportDescription'),
      icon: ICONS.HELP_CIRCLE,
      screen: null,
      color: colors.textSecondary,
      disabled: true,
    },
    {
      id: MENU_ITEM_IDS.FEEDBACK,
      title: t('screens.userMore.sendFeedback'),
      description: t('screens.userMore.sendFeedbackDescription'),
      icon: ICONS.MESSAGE_REPLY_TEXT,
      screen: null,
      color: colors.warning,
      disabled: true,
    },
  ];

  const containerStyle = { flex: FLEX.ONE, backgroundColor: colors.background };
  const contentStyle = { padding: spacing.lg, paddingTop: spacing.sm };

  return (
    <View style={containerStyle}>
      <ScreenHeader title={t('screens.userMore.title')} subtitle={t('screens.userMore.subtitle')} />
      <ScrollView style={{ flex: FLEX.ONE }}>
        <View style={contentStyle}>
          <SectionHeader title={t('screens.userMore.myClubSection')} />
          <DisabledMenuSection items={clubItems} colors={colors} t={t} />
        </View>
        <View style={contentStyle}>
          <SectionHeader title={t('screens.userMore.helpSection')} />
          <DisabledMenuSection items={helpItems} colors={colors} t={t} />
        </View>
      </ScrollView>
    </View>
  );
};

export default UserMoreScreen;
