/**
 * Language Exports
 * Central export point for all translations
 */

import { en, TranslationKeys } from './en';
import { es } from './es';

export { en, TranslationKeys };
export { es };

export const resources = {
  en: { translation: en },
  es: { translation: es },
};

export type Language = 'en' | 'es';

export const LANGUAGES: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];
