/**
 * i18n Configuration
 * Configures i18next for internationalization
 */

import i18next, { use, changeLanguage as i18nChangeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resources, Language } from './locales';
import { storageKeys } from '../../shared/config/storage';
import { DEFAULT_LANGUAGE, I18N_CONFIG } from '../../shared/constants/ui';
import { logger } from '../../shared/utils/logger';
import { LOG_MESSAGES } from '../../shared/constants/logMessages';

// Language detector for React Native
const languageDetector = {
  type: I18N_CONFIG.DETECTOR_TYPE as 'languageDetector',
  async: true as const,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(storageKeys.LANGUAGE);
      if (savedLanguage) {
        callback(savedLanguage);
      } else {
        // Default to English
        callback(DEFAULT_LANGUAGE);
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.I18N.DETECT_ERROR, error as Error);
      callback(DEFAULT_LANGUAGE);
    }
  },
  init: (): void => undefined,
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(storageKeys.LANGUAGE, language);
    } catch (error) {
      logger.error(LOG_MESSAGES.I18N.SAVE_ERROR, error as Error);
    }
  },
};

use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    compatibilityJSON: I18N_CONFIG.COMPATIBILITY_JSON,
    interpolation: {
      escapeValue: I18N_CONFIG.ESCAPE_VALUE, // React already escapes values
    },
    react: {
      useSuspense: I18N_CONFIG.USE_SUSPENSE, // Important for React Native
    },
  });

export default i18next;

// Helper to change language
export const changeLanguage = async (language: Language): Promise<void> => {
  try {
    await i18nChangeLanguage(language);
    await AsyncStorage.setItem(storageKeys.LANGUAGE, language);
  } catch (error) {
    logger.error(LOG_MESSAGES.I18N.CHANGE_ERROR, error as Error);
  }
};

// Helper to get current language
export const getCurrentLanguage = (): Language => {
  return (i18next.language || DEFAULT_LANGUAGE) as Language;
};
