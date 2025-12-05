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
import { flexValues } from '../../shared/constants/layoutConstants';
import { ICONS, MENU_ITEM_IDS } from '../../shared/constants';

const UserMoreScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const clubItems = [
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

  const helpItems = [
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
      <ScreenHeader
        title={t('screens.userMore.title')}
        subtitle={t('screens.userMore.subtitle')}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <SectionHeader title={t('screens.userMore.myClubSection')} />
          {clubItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.disabled ? t('common.comingSoon') : item.description}
              icon={item.icon}
              color={item.disabled ? colors.textTertiary : item.color}
              onPress={() => {}}
              disabled={item.disabled}
            />
          ))}
        </View>

        <View style={styles.content}>
          <SectionHeader title={t('screens.userMore.helpSection')} />
          {helpItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.disabled ? t('common.comingSoon') : item.description}
              icon={item.icon}
              color={item.disabled ? colors.textTertiary : item.color}
              onPress={() => {}}
              disabled={item.disabled}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
  },
  scrollView: {
    flex: flexValues.one,
  },
  content: {
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.sm,
  },
});

export default UserMoreScreen;

