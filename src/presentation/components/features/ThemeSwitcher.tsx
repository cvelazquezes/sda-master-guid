/**
 * Theme Switcher Component
 * Allows users to change between light/dark/system theme
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../primitives';
import { useTheme, ThemeMode } from '../../state/ThemeContext';
import { SelectionModal, SelectionItem } from '../primitives/SelectionModal';
import { A11Y_ROLE, ICONS, THEME_MODE, FLEX } from '../../../shared/constants';

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
    mode: THEME_MODE.DARK_BLUE,
    icon: ICONS.CHURCH,
    labelKey: 'settings.sdaDarkMode',
    subtitleKey: 'components.themeSwitcher.sdaDarkSubtitle',
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
  const { mode, colors, spacing, radii, iconSizes, componentSizes, typography, setTheme } =
    useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const currentOption = THEME_OPTIONS.find((opt) => opt.mode === mode) || THEME_OPTIONS[3];

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

  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  };

  const iconContainerStyle: ViewStyle = {
    width: componentSizes.iconContainer.md,
    height: componentSizes.iconContainer.md,
    borderRadius: radii['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '20',
  };

  const labelStyle: TextStyle = {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  };

  const valueStyle: TextStyle = {
    fontSize: typography.fontSizes.lg,
    color: colors.textPrimary,
  };

  return (
    <View>
      <TouchableOpacity
        style={buttonStyle}
        onPress={() => setModalVisible(true)}
        accessibilityLabel={t('accessibility.changeTheme')}
        accessibilityRole={A11Y_ROLE.BUTTON}
      >
        <View style={iconContainerStyle}>
          <MaterialCommunityIcons
            name={currentOption.icon as typeof ICONS.CHECK}
            size={iconSizes.md}
            color={colors.primary}
          />
        </View>
        {showLabel && (
          <View style={{ flex: FLEX.ONE }}>
            <Text style={labelStyle}>{t('settings.theme')}</Text>
            <Text style={valueStyle}>{t(currentOption.labelKey)}</Text>
          </View>
        )}
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_DOWN}
          size={iconSizes.md}
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
