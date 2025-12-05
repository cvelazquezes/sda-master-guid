import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenHeader, MenuCard, SectionHeader } from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
import { ICONS, SCREENS, MENU_ITEM_IDS, flexValues } from '../../shared/constants';

const MoreScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const activityItems = [
    {
      id: MENU_ITEM_IDS.GENERATE_MATCHES,
      title: t('screens.clubDashboard.menuItems.generateActivities'),
      description: t('screens.clubMore.generateActivitiesDescription'),
      icon: ICONS.ACCOUNT_HEART,
      screen: SCREENS.GENERATE_MATCHES,
      color: colors.success,
    },
    {
      id: MENU_ITEM_IDS.MATCH_MANAGEMENT,
      title: t('screens.clubMore.activityManagement'),
      description: t('screens.clubMore.activityManagementDescription'),
      icon: ICONS.ACCOUNT_HEART_OUTLINE,
      screen: SCREENS.CLUB_MATCHES,
      color: colors.primary,
    },
  ];

  const managementItems = [
    {
      id: MENU_ITEM_IDS.DIRECTIVE,
      title: t('screens.clubDashboard.menuItems.clubDirective'),
      description: t('screens.clubMore.clubDirectiveDescription'),
      icon: ICONS.ACCOUNT_STAR,
      screen: SCREENS.CLUB_DIRECTIVE,
      color: colors.warning,
    },
    {
      id: MENU_ITEM_IDS.SETTINGS,
      title: t('screens.clubDashboard.menuItems.clubSettings'),
      description: t('screens.clubMore.clubSettingsDescription'),
      icon: ICONS.COG,
      screen: SCREENS.CLUB_SETTINGS,
      color: colors.info,
    },
  ];

  const helpItems = [
    {
      id: MENU_ITEM_IDS.HELP,
      title: t('screens.clubMore.helpAndSupport'),
      description: t('screens.clubMore.helpAndSupportDescription'),
      icon: ICONS.HELP_CIRCLE,
      screen: null,
      color: colors.textSecondary,
      disabled: true,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('screens.clubMore.title')} subtitle={t('screens.clubMore.subtitle')} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <SectionHeader title={t('screens.clubMore.activitiesSection')} />
          {activityItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              color={item.color}
              onPress={() => navigation.navigate(item.screen as never)}
            />
          ))}
        </View>

        <View style={styles.content}>
          <SectionHeader title={t('screens.clubMore.clubManagementSection')} />
          {managementItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              color={item.color}
              onPress={() => navigation.navigate(item.screen as never)}
            />
          ))}
        </View>

        <View style={styles.content}>
          <SectionHeader title={t('screens.clubMore.helpSection')} />
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

export default MoreScreen;
