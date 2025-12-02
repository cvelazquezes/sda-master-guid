/**
 * i18n Main Export
 * Central export point for i18n functionality
 */

export { default as i18n, changeLanguage, getCurrentLanguage } from './config';
export { LANGUAGES, Language } from './locales';
export { useTranslation } from 'react-i18next';

// Re-export for convenience
export { default } from './config';

