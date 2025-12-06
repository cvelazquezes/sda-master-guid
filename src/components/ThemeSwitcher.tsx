/**
 * Theme Switcher Component
 * Allows users to change between light/dark/system theme
 * Uses SelectionModal for consistent UI across the app
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../shared/components';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { SelectionModal, SelectionItem } from '../shared/components/SelectionModal';
import { mobileTypography, designTokens, layoutConstants } from '../shared/theme';
import { A11Y_ROLE, ICONS, THEME_MODE, flexValues } from '../shared/constants';

interface ThemeSwitcherProps {
  showLabel?: boolean;
}

const THEME_OPTIONS: { mode: ThemeMode; icon: string; labelKey: string; subtitleKey: string }[] = [
  {
    mode: THEME_MODE.LIGHT,
    icon: ICONS.WEATHER_SUNNY,
    labelKey: 'settings.lightMode',
    subtitleKey: 'components.themeSwitcher.lightSubtitle',
  },
  {
    mode: THEME_MODE.DARK,
    icon: ICONS.WEATHER_NIGHT,
    labelKey: 'settings.darkMode',
    subtitleKey: 'components.themeSwitcher.darkSubtitle',
  },
  {
    mode: THEME_MODE.SYSTEM,
    icon: ICONS.THEME_LIGHT_DARK,
    labelKey: 'settings.systemDefault',
    subtitleKey: 'components.themeSwitcher.systemSubtitle',
  },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ showLabel = true }) => {
  const { t } = useTranslation();
  const { mode, colors, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const currentOption = THEME_OPTIONS.find((opt) => opt.mode === mode) || THEME_OPTIONS[2];

  // Convert theme options to SelectionItem format
  const selectionItems: SelectionItem[] = THEME_OPTIONS.map((option) => ({
    id: option.mode,
    title: t(option.labelKey),
    subtitle: t(option.subtitleKey),
    icon: option.icon,
    iconColor: colors.primary,
  }));

  const handleSelect = async (item: SelectionItem): Promise<void> => {
    await setTheme(item.id as ThemeMode);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        accessibilityLabel={t('accessibility.changeTheme')}
        accessibilityRole={A11Y_ROLE.BUTTON}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <MaterialCommunityIcons
            name={currentOption.icon as typeof ICONS.CHECK}
            size={designTokens.iconSize.md}
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
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_DOWN}
          size={designTokens.iconSize.md}
          color={colors.textTertiary}
        />
      </TouchableOpacity>

      <SelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={t('settings.theme')}
        subtitle={t('modals.chooseTheme')}
        items={selectionItems}
        onSelectItem={handleSelect}
        selectedItemId={mode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.md,
  },
  iconContainer: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius['3xl'],
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  textContainer: {
    flex: flexValues.one,
  },
  label: {
    ...mobileTypography.caption,
    marginBottom: designTokens.spacing.xxs,
  },
  value: {
    ...mobileTypography.bodyLarge,
  },
});
