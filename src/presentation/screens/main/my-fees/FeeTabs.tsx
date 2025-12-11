import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createTabStyles } from './styles';
import { ICONS, MY_FEES_TAB } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { MyFeesTabValue } from './types';

type TabStylesType = ReturnType<typeof createTabStyles>;

type FeeTabsProps = {
  selectedTab: MyFeesTabValue;
  onTabChange: (tab: MyFeesTabValue) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
};

export function FeeTabs({ selectedTab, onTabChange, colors, t }: FeeTabsProps): React.JSX.Element {
  const { spacing, typography } = useTheme();

  const tabStyles = useMemo(
    () => createTabStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );

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
          colors={colors}
          t={t}
          tabStyles={tabStyles}
          onPress={(): void => onTabChange(tab)}
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
  tabStyles,
}: {
  tab: MyFeesTabValue;
  isActive: boolean;
  onPress: () => void;
  colors: Record<string, string>;
  t: (key: string) => string;
  tabStyles: TabStylesType;
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
    <TouchableOpacity
      style={tabStyle}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={t(`screens.myFees.${tab}`)}
      onPress={onPress}
    >
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
