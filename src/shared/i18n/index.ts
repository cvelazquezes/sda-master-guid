/**
 * i18n Main Export
 * Central export point for i18n functionality
 */

import i18next from './config';

export { default as i18n, changeLanguage, getCurrentLanguage } from './config';
export { LANGUAGES, Language } from './locales';
export { useTranslation } from 'react-i18next';

/**
 * Translation function for use outside React components
 * For React components, use the useTranslation hook instead
 */
export const t = i18next.t.bind(i18next);

// Re-export for convenience
export { default } from './config';
