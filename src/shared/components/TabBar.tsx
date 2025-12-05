/**
 * TabBar Component
 * Reusable tab navigation for screens with multiple views
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileTypography, mobileFontSizes, designTokens, layoutConstants } from '../theme';
import { A11Y_ROLE, flexValues } from '../constants';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  style?: ViewStyle;
}

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
            style={[styles.tab, isActive && { borderBottomColor: colors.primary }]}
            onPress={() => onTabChange(tab.id)}
            accessible={true}
            accessibilityRole={A11Y_ROLE.TAB}
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            {tab.icon && (
              <MaterialCommunityIcons
                name={tab.icon as typeof ICONS.CHECK}
                size={designTokens.icon.sizes.md}
                color={isActive ? colors.primary : colors.textTertiary}
              />
            )}
            <Text
              style={[
                styles.tabText,
                { color: colors.textTertiary },
                isActive && { color: colors.primary },
              ]}
            >
              {tab.label}
            </Text>
            {tab.badge !== undefined && tab.badge > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.error }]}>
                <Text style={styles.badgeText}>{tab.badge}</Text>
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
    flex: flexValues.one,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.sm,
    borderBottomWidth: designTokens.borderWidth.thick,
    borderBottomColor: designTokens.colors.transparent,
    position: layoutConstants.position.relative,
  },
  tabText: {
    ...mobileTypography.labelBold,
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
  badgeText: {
    ...mobileTypography.captionBold,
    color: designTokens.colors.white,
    fontSize: mobileFontSizes.xs,
  },
});

export default TabBar;
