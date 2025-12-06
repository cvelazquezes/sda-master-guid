/**
 * Language Switcher Component
 * Allows users to change the app language
 * Uses SelectionModal for consistent UI across the app
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../shared/components';
import { LANGUAGES, changeLanguage, Language } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';
import { SelectionModal, SelectionItem } from '../shared/components/SelectionModal';
import { mobileTypography, designTokens, layoutConstants } from '../shared/theme';
import { A11Y_ROLE, ICONS, flexValues } from '../shared/constants';

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
  const { colors } = useTheme();
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

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        accessibilityLabel={t('accessibility.changeLanguage')}
        accessibilityRole={A11Y_ROLE.BUTTON}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.info + '20' }]}>
          <MaterialCommunityIcons
            name={ICONS.TRANSLATE}
            size={designTokens.iconSize.md}
            color={colors.info}
          />
        </View>
        {showLabel && (
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t('settings.language')}
            </Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {currentLanguage.nativeName}
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
        title={t('settings.language')}
        subtitle={t('modals.chooseLanguage')}
        items={selectionItems}
        onSelectItem={handleSelect}
        selectedItemId={i18n.language}
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
