/**
 * MoreScreen
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../state/ThemeContext';
import { PageHeader, MenuCard, SectionHeader } from '../../components/primitives';
import { ICONS, SCREENS, MENU_ITEM_IDS, FLEX } from '../../../shared/constants';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen: string | null;
  color: string;
  disabled?: boolean;
}

// Extracted navigable menu section
function NavMenuSection({
  items,
  navigation,
}: {
  items: MenuItem[];
  navigation: ReturnType<typeof useNavigation>;
}): React.JSX.Element {
  return (
    <>
      {items.map((item) => (
        <MenuCard
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
          color={item.color}
          onPress={() => item.screen && navigation.navigate(item.screen as never)}
        />
      ))}
    </>
  );
}

// Extracted disabled menu section
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

const MoreScreen = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();

  const activityItems: MenuItem[] = [
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

  const managementItems: MenuItem[] = [
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

  const helpItems: MenuItem[] = [
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

  const containerStyle = { flex: FLEX.ONE, backgroundColor: colors.background };
  const contentStyle = { padding: spacing.lg, paddingTop: spacing.sm };

  return (
    <View style={containerStyle}>
      <PageHeader title={t('screens.clubMore.title')} subtitle={t('screens.clubMore.subtitle')} showActions />
      <ScrollView style={{ flex: FLEX.ONE }}>
        <View style={contentStyle}>
          <SectionHeader title={t('screens.clubMore.activitiesSection')} />
          <NavMenuSection items={activityItems} navigation={navigation} />
        </View>
        <View style={contentStyle}>
          <SectionHeader title={t('screens.clubMore.clubManagementSection')} />
          <NavMenuSection items={managementItems} navigation={navigation} />
        </View>
        <View style={contentStyle}>
          <SectionHeader title={t('screens.clubMore.helpSection')} />
          <DisabledMenuSection items={helpItems} colors={colors} t={t} />
        </View>
      </ScrollView>
    </View>
  );
};

export default MoreScreen;
