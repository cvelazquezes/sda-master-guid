/**
 * TabBar Component
 * Reusable tab navigation for screens with multiple views
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import {
  A11Y_ROLE,
  FLEX,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
  type ICONS,
} from '../../../shared/constants';
import { useTheme } from '../../state/ThemeContext';
import { designTokens, layoutConstants } from '../../theme';

export type Tab = {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
};

type TabBarProps = {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  style?: ViewStyle;
};

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onTabChange, style }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderBottomColor: colors.border },
        style,
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <TouchableOpacity
            key={tab.id}
            accessible
            style={[styles.tab, isActive && { borderBottomColor: colors.primary }]}
            accessibilityRole={A11Y_ROLE.TAB}
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabChange(tab.id)}
          >
            {tab.icon && (
              <MaterialCommunityIcons
                name={tab.icon as typeof ICONS.CHECK}
                size={designTokens.icon.sizes.md}
                color={isActive ? colors.primary : colors.textTertiary}
              />
            )}
            <Text
              variant={TEXT_VARIANT.LABEL}
              weight={TEXT_WEIGHT.BOLD}
              style={{ color: isActive ? colors.primary : colors.textTertiary }}
            >
              {tab.label}
            </Text>
            {tab.badge !== undefined && tab.badge > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.error }]}>
                <Text
                  variant={TEXT_VARIANT.CAPTION}
                  weight={TEXT_WEIGHT.BOLD}
                  color={TEXT_COLOR.ON_PRIMARY}
                >
                  {tab.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: layoutConstants.flexDirection.row,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  tab: {
    flex: FLEX.ONE,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.sm,
    borderBottomWidth: designTokens.borderWidth.thick,
    borderBottomColor: designTokens.colors.transparent,
    position: layoutConstants.position.relative,
  },
  badge: {
    position: layoutConstants.position.absolute,
    top: designTokens.spacing.sm,
    right: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
    minWidth: designTokens.componentSizes.indicator.lg,
    height: designTokens.componentSizes.tabBarIndicator.md,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.sm,
  },
});

export default TabBar;
