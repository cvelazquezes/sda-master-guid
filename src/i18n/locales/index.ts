/**
 * Language Exports
 * Central export point for all translations
 */

export { en, TranslationKeys } from './en';
export { es } from './es';

export const resources = {
  en: { translation: require('./en').en },
  es: { translation: require('./es').es },
};

export type Language = 'en' | 'es';

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

