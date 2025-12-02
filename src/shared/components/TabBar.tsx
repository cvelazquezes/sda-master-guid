/**
 * TabBar Component
 * Reusable tab navigation for screens with multiple views
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { mobileTypography, mobileFontSizes } from '../theme/mobileTypography';

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

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }, style]}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && { borderBottomColor: colors.primary }]}
            onPress={() => onTabChange(tab.id)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            {tab.icon && (
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={designTokens.icon.sizes.md}
                color={isActive ? colors.primary : colors.textTertiary}
              />
            )}
            <Text style={[styles.tabText, { color: colors.textTertiary }, isActive && { color: colors.primary }]}>
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
    flexDirection: 'row',
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    position: 'relative',
  },
  tabText: {
    ...mobileTypography.labelBold,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: designTokens.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    ...mobileTypography.captionBold,
    color: '#fff',
    fontSize: mobileFontSizes.xs,
  },
});

export default TabBar;

