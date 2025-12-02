/**
 * Theme Switcher Component
 * Allows users to change between light/dark/system theme
 * Uses SelectionModal for consistent UI across the app
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { SelectionModal, SelectionItem } from '../shared/components/SelectionModal';
import { designTokens } from '../shared/theme/designTokens';
import { mobileTypography } from '../shared/theme/mobileTypography';

interface ThemeSwitcherProps {
  showLabel?: boolean;
}

const THEME_OPTIONS: { mode: ThemeMode; icon: string; labelKey: string; subtitle: string }[] = [
  { mode: 'light', icon: 'white-balance-sunny', labelKey: 'settings.lightMode', subtitle: 'Always use light colors' },
  { mode: 'dark', icon: 'moon-waning-crescent', labelKey: 'settings.darkMode', subtitle: 'Always use dark colors' },
  { mode: 'system', icon: 'theme-light-dark', labelKey: 'settings.systemDefault', subtitle: 'Follow device settings' },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ showLabel = true }) => {
  const { t } = useTranslation();
  const { mode, colors, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const currentOption = THEME_OPTIONS.find(opt => opt.mode === mode) || THEME_OPTIONS[2];

  // Convert theme options to SelectionItem format
  const selectionItems: SelectionItem[] = THEME_OPTIONS.map(option => ({
    id: option.mode,
    title: t(option.labelKey),
    subtitle: option.subtitle,
    icon: option.icon,
    iconColor: colors.primary,
  }));

  const handleSelect = async (item: SelectionItem) => {
    await setTheme(item.id as ThemeMode);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Change theme"
        accessibilityRole="button"
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <MaterialCommunityIcons 
            name={currentOption.icon as any} 
            size={20} 
            color={colors.primary} 
          />
        </View>
        {showLabel && (
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t('settings.theme')}
            </Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {t(currentOption.labelKey)}
            </Text>
          </View>
        )}
        <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textTertiary} />
      </TouchableOpacity>

      <SelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={t('settings.theme')}
        subtitle="Choose your preferred appearance"
        items={selectionItems}
        onSelectItem={handleSelect}
        selectedItemId={mode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...mobileTypography.caption,
    marginBottom: 2,
  },
  value: {
    ...mobileTypography.bodyLarge,
  },
});
