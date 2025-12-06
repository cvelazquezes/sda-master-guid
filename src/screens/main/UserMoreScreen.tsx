/**
 * UserMoreScreen
 * More options screen for regular club members
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenHeader, MenuCard, SectionHeader } from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
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
  const { colors } = useTheme();
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('screens.userMore.title')} subtitle={t('screens.userMore.subtitle')} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <SectionHeader title={t('screens.userMore.myClubSection')} />
          <DisabledMenuSection items={clubItems} colors={colors} t={t} />
        </View>
        <View style={styles.content}>
          <SectionHeader title={t('screens.userMore.helpSection')} />
          <DisabledMenuSection items={helpItems} colors={colors} t={t} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: FLEX.ONE,
  },
  scrollView: {
    flex: FLEX.ONE,
  },
  content: {
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.sm,
  },
});

export default UserMoreScreen;
