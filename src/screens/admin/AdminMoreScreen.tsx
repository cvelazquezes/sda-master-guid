/**
 * AdminMoreScreen
 * More options screen for platform administrators
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenHeader, MenuCard, SectionHeader } from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
import { ICONS, MENU_ITEM_IDS, SCREENS, flexValues } from '../../shared/constants';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen: string | null;
  color: string;
  disabled?: boolean;
}

// Extracted menu section component to reduce main component size
function MenuSection({
  items,
  colors,
  navigation,
  t,
}: {
  items: MenuItem[];
  colors: ReturnType<typeof useTheme>['colors'];
  navigation: ReturnType<typeof useNavigation>;
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
          onPress={() => item.screen && navigation.navigate(item.screen as never)}
          disabled={item.disabled}
        />
      ))}
    </>
  );
}

const AdminMoreScreen = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const managementItems: MenuItem[] = [
    {
      id: MENU_ITEM_IDS.ORGANIZATION,
      title: t('screens.adminDashboard.menuItems.organizationStructure'),
      description: t('screens.adminDashboard.menuItems.organizationDescription'),
      icon: ICONS.SITEMAP,
      screen: SCREENS.ORGANIZATION_MANAGEMENT,
      color: colors.primary,
    },
  ];

  const systemItems: MenuItem[] = [
    {
      id: MENU_ITEM_IDS.REPORTS,
      title: t('screens.adminMore.reports'),
      description: t('screens.adminMore.reportsDescription'),
      icon: ICONS.CHART_BAR,
      screen: null,
      color: colors.warning,
      disabled: true,
    },
    {
      id: MENU_ITEM_IDS.NOTIFICATIONS,
      title: t('screens.adminMore.sendNotifications'),
      description: t('screens.adminMore.sendNotificationsDescription'),
      icon: ICONS.BELL_RING,
      screen: null,
      color: colors.error,
      disabled: true,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t('screens.adminMore.title')}
        subtitle={t('screens.adminMore.subtitle')}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <SectionHeader title={t('screens.adminMore.managementSection')} />
          <MenuSection items={managementItems} colors={colors} navigation={navigation} t={t} />
        </View>
        <View style={styles.content}>
          <SectionHeader title={t('screens.adminMore.systemSection')} />
          <MenuSection items={systemItems} colors={colors} navigation={navigation} t={t} />
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

export default AdminMoreScreen;
