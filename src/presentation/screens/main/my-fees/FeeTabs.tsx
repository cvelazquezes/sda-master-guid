import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { MY_FEES_TAB, ICONS } from '../../../../shared/constants';
import { tabStyles } from './styles';
import { MyFeesTabValue } from './types';

interface FeeTabsProps {
  selectedTab: MyFeesTabValue;
  onTabChange: (tab: MyFeesTabValue) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
}

export function FeeTabs({ selectedTab, onTabChange, colors, t }: FeeTabsProps): React.JSX.Element {
  const tabs: MyFeesTabValue[] = [MY_FEES_TAB.OVERVIEW, MY_FEES_TAB.HISTORY, MY_FEES_TAB.CHARGES];

  return (
    <View
      style={[
        tabStyles.tabContainer,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          tab={tab}
          isActive={selectedTab === tab}
          onPress={(): void => onTabChange(tab)}
          colors={colors}
          t={t}
        />
      ))}
    </View>
  );
}

function TabButton({
  tab,
  isActive,
  onPress,
  colors,
  t,
}: {
  tab: MyFeesTabValue;
  isActive: boolean;
  onPress: () => void;
  colors: Record<string, string>;
  t: (key: string) => string;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const icon =
    tab === MY_FEES_TAB.OVERVIEW
      ? ICONS.VIEW_DASHBOARD_OUTLINE
      : tab === MY_FEES_TAB.HISTORY
        ? ICONS.HISTORY
        : ICONS.RECEIPT;
  const tabStyle = [
    tabStyles.tab,
    isActive && [tabStyles.tabActive, { borderBottomColor: colors.primary }],
  ];

  return (
    <TouchableOpacity style={tabStyle} onPress={onPress}>
      <MaterialCommunityIcons
        name={icon}
        size={iconSizes.md}
        color={isActive ? colors.primary : colors.textTertiary}
      />
      <Text style={[tabStyles.tabText, { color: isActive ? colors.primary : colors.textTertiary }]}>
        {t(`screens.myFees.${tab}`)}
      </Text>
    </TouchableOpacity>
  );
}
