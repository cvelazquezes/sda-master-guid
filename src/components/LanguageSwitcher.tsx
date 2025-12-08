/**
 * Language Switcher Component
 * Allows users to change the app language
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../shared/components';
import { LANGUAGES, changeLanguage, Language } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';
import { SelectionModal, SelectionItem } from '../shared/components/SelectionModal';
import { A11Y_ROLE, ICONS, FLEX } from '../shared/constants';

interface LanguageSwitcherProps {
  showLabel?: boolean;
}

// Flag emojis for each language
const FLAG_AVATARS: Record<string, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ showLabel = true }) => {
  const { i18n, t } = useTranslation();
  const { colors, spacing, radii, iconSizes, componentSizes, typography } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  // Convert languages to SelectionItem format
  const selectionItems: SelectionItem[] = LANGUAGES.map((lang) => ({
    id: lang.code,
    title: lang.nativeName,
    subtitle: lang.name,
    avatar: FLAG_AVATARS[lang.code] || '🌐',
    iconColor: colors.info,
  }));

  const handleSelect = async (item: SelectionItem): Promise<void> => {
    await changeLanguage(item.id as Language);
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
    backgroundColor: colors.info + '20',
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
        accessibilityLabel={t('accessibility.changeLanguage')}
        accessibilityRole={A11Y_ROLE.BUTTON}
      >
        <View style={iconContainerStyle}>
          <MaterialCommunityIcons name={ICONS.TRANSLATE} size={iconSizes.md} color={colors.info} />
        </View>
        {showLabel && (
          <View style={{ flex: FLEX.ONE }}>
            <Text style={labelStyle}>{t('settings.language')}</Text>
            <Text style={valueStyle}>{currentLanguage.nativeName}</Text>
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
        title={t('settings.language')}
        subtitle={t('modals.chooseLanguage')}
        items={selectionItems}
        onSelectItem={handleSelect}
        selectedItemId={i18n.language}
      />
    </View>
  );
};
