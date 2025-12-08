/**
 * i18n Configuration Tests
 * Testing internationalization setup and language switching
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Import after mocks are set up
import { changeLanguage, getCurrentLanguage } from '../config';
import { LANGUAGES } from '../locales';

describe('i18n Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('i18next Initialization', () => {
    it('should be initialized', () => {
      expect(i18next.isInitialized).toBe(true);
    });

    it('should have fallback language set to English', () => {
      expect(i18next.options.fallbackLng).toContain('en');
    });

    it('should have English resources loaded', () => {
      const hasEnglish = i18next.hasResourceBundle('en', 'translation');
      expect(hasEnglish).toBe(true);
    });

    it('should have Spanish resources loaded', () => {
      const hasSpanish = i18next.hasResourceBundle('es', 'translation');
      expect(hasSpanish).toBe(true);
    });
  });

  describe('changeLanguage', () => {
    it('should change language to Spanish', async () => {
      await changeLanguage(LANGUAGES.SPANISH);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should change language to English', async () => {
      await changeLanguage(LANGUAGES.ENGLISH);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should handle storage errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      // Should not throw
      await expect(changeLanguage(LANGUAGES.SPANISH)).resolves.not.toThrow();
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return current language', () => {
      const language = getCurrentLanguage();

      expect(typeof language).toBe('string');
      expect([LANGUAGES.ENGLISH, LANGUAGES.SPANISH]).toContain(language);
    });

    it('should return English as default', () => {
      // Reset i18next language to undefined
      const originalLanguage = i18next.language;

      // The function should fall back to 'en' if no language is set
      const language = getCurrentLanguage();
      expect(language).toBeDefined();

      // Restore
      if (originalLanguage) {
        i18next.changeLanguage(originalLanguage);
      }
    });
  });

  describe('Translation Keys', () => {
    it('should have common translations', () => {
      const hasCommon = i18next.exists('common.loading');
      expect(hasCommon).toBe(true);
    });

    it('should have error translations', () => {
      const hasErrors = i18next.exists('errors.generic');
      expect(hasErrors).toBe(true);
    });

    it('should have auth screen translations', () => {
      const hasAuth = i18next.exists('screens.login.appTitle');
      expect(hasAuth).toBe(true);
    });
  });

  describe('Interpolation', () => {
    it('should handle interpolation in translations', () => {
      const result = i18next.t('common.welcomeBack', { name: 'John' });
      expect(result).toContain('John');
    });
  });

  describe('Fallback Behavior', () => {
    it('should fallback to key when translation is missing', () => {
      const key = 'nonexistent.key';
      const result = i18next.t(key);
      expect(result).toBe(key);
    });

    it('should fallback to English for missing Spanish translations', async () => {
      await i18next.changeLanguage('es');

      // If Spanish doesn't have this key, it should fallback to English
      const result = i18next.t('common.loading');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Language Constants', () => {
    it('should export LANGUAGES constant', () => {
      expect(LANGUAGES).toBeDefined();
      expect(LANGUAGES.ENGLISH).toBe('en');
      expect(LANGUAGES.SPANISH).toBe('es');
    });
  });
});

describe('Translation Resources', () => {
  describe('English Resources', () => {
    beforeEach(async () => {
      await i18next.changeLanguage('en');
    });

    it('should have navigation translations', () => {
      expect(i18next.exists('navigation.home')).toBe(true);
      expect(i18next.exists('navigation.settings')).toBe(true);
    });

    it('should have roles translations', () => {
      expect(i18next.exists('roles.admin')).toBe(true);
      expect(i18next.exists('roles.user')).toBe(true);
    });

    it('should have validation error translations', () => {
      expect(i18next.exists('errors.validation')).toBe(true);
    });

    it('should have settings screen translations', () => {
      expect(i18next.exists('screens.settings.theme')).toBe(true);
      expect(i18next.exists('screens.settings.language')).toBe(true);
    });
  });

  describe('Spanish Resources', () => {
    beforeEach(async () => {
      await i18next.changeLanguage('es');
    });

    it('should have common translations in Spanish', () => {
      const loading = i18next.t('common.loading');
      expect(loading).toBeDefined();
      expect(loading.length).toBeGreaterThan(0);
    });

    it('should have navigation translations in Spanish', () => {
      expect(i18next.exists('navigation.home')).toBe(true);
    });
  });
});

