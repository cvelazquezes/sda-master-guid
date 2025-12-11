/**
 * Language Switcher Component
 * Allows users to change the app language
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, type TextStyle, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { A11Y_ROLE, ICONS, FLEX } from '../../../shared/constants';
import { LANGUAGES, changeLanguage, type Language } from '../../../shared/i18n';
import { useTheme } from '../../state/ThemeContext';
import { Text } from '../primitives';
import { SelectionModal, type SelectionItem } from '../primitives/SelectionModal';

type LanguageSwitcherProps = {
  showLabel?: boolean;
};

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
    backgroundColor: `${colors.info}20`,
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
        accessibilityLabel={t('accessibility.changeLanguage')}
        accessibilityRole={A11Y_ROLE.BUTTON}
        onPress={() => setModalVisible(true)}
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
        title={t('settings.language')}
        subtitle={t('modals.chooseLanguage')}
        items={selectionItems}
        selectedItemId={i18n.language}
        onClose={() => setModalVisible(false)}
        onSelectItem={handleSelect}
      />
    </View>
  );
};
