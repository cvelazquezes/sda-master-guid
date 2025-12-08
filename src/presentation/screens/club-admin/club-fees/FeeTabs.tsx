import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS, TOUCH_OPACITY, FEE_TABS } from '../../../../shared/constants';
import { createTabStyles } from './styles';
import type { FeeTabValue } from './types';

type TabStylesType = ReturnType<typeof createTabStyles>;

type FeeTabsProps = {
  activeTab: FeeTabValue;
  onTabChange: (tab: FeeTabValue) => void;
  t: (key: string) => string;
};

export function FeeTabs({ activeTab, onTabChange, t }: FeeTabsProps): React.JSX.Element {
  const { colors, spacing, typography } = useTheme();

  const tabStyles = useMemo(
    () => createTabStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );

  return (
    <View style={tabStyles.tabs}>
      <TabButton
        icon={ICONS.COG_OUTLINE}
        label={t('screens.clubFees.tabs.settings')}
        active={activeTab === FEE_TABS.SETTINGS}
        onPress={(): void => onTabChange(FEE_TABS.SETTINGS)}
        colors={colors}
        tabStyles={tabStyles}
      />
      <TabButton
        icon={ICONS.WALLET_OUTLINE}
        label={t('screens.clubFees.tabs.balances')}
        active={activeTab === FEE_TABS.BALANCES}
        onPress={(): void => onTabChange(FEE_TABS.BALANCES)}
        colors={colors}
        tabStyles={tabStyles}
      />
      <TabButton
        icon={ICONS.FILE_DOCUMENT_OUTLINE}
        label={t('screens.clubFees.tabs.charges')}
        active={activeTab === FEE_TABS.CHARGES}
        onPress={(): void => onTabChange(FEE_TABS.CHARGES)}
        colors={colors}
        tabStyles={tabStyles}
      />
    </View>
  );
}

type TabButtonProps = {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
  colors: Record<string, string>;
  tabStyles: TabStylesType;
};

function TabButton({ icon, label, active, onPress, colors, tabStyles }: TabButtonProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const tabStyle = [tabStyles.tab, active && tabStyles.tabActive];
  const textStyle = [tabStyles.tabText, active && tabStyles.tabTextActive];
  const iconColor = active ? colors.primary : colors.textSecondary;

  return (
    <TouchableOpacity style={tabStyle} onPress={onPress} activeOpacity={TOUCH_OPACITY.default}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.COG_OUTLINE}
        size={iconSizes.md}
        color={iconColor}
      />
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
