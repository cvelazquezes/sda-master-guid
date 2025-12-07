/**
 * Locale Constants
 *
 * Centralized locale-related constants (timezones, languages).
 *
 * @version 1.0.0
 */

/**
 * Supported Timezones
 */
export const TIMEZONES = {
  // Americas
  AMERICA_NEW_YORK: 'America/New_York',
  AMERICA_CHICAGO: 'America/Chicago',
  AMERICA_DENVER: 'America/Denver',
  AMERICA_LOS_ANGELES: 'America/Los_Angeles',
  AMERICA_MEXICO_CITY: 'America/Mexico_City',
  AMERICA_SAO_PAULO: 'America/Sao_Paulo',
  AMERICA_BOGOTA: 'America/Bogota',
  AMERICA_LIMA: 'America/Lima',
  AMERICA_BUENOS_AIRES: 'America/Buenos_Aires',

  // Europe
  EUROPE_LONDON: 'Europe/London',
  EUROPE_PARIS: 'Europe/Paris',
  EUROPE_BERLIN: 'Europe/Berlin',
  EUROPE_MADRID: 'Europe/Madrid',
  EUROPE_ROME: 'Europe/Rome',

  // Asia
  ASIA_TOKYO: 'Asia/Tokyo',
  ASIA_SHANGHAI: 'Asia/Shanghai',
  ASIA_SINGAPORE: 'Asia/Singapore',
  ASIA_DUBAI: 'Asia/Dubai',

  // Default
  DEFAULT: 'America/New_York',
} as const;

/**
 * Supported Languages
 */
export const LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  PORTUGUESE: 'pt',
  FRENCH: 'fr',
  GERMAN: 'de',
  ITALIAN: 'it',
  JAPANESE: 'ja',
  CHINESE: 'zh',

  // Default
  DEFAULT: 'en',
} as const;

export type TimezoneKey = keyof typeof TIMEZONES;
export type LanguageKey = keyof typeof LANGUAGES;

/**
 * Locale identifiers for formatting
 */
export const LOCALE = {
  EN_US: 'en-US',
  EN_GB: 'en-GB',
  ES_ES: 'es-ES',
  PT_BR: 'pt-BR',
  FR_FR: 'fr-FR',
  DE_DE: 'de-DE',
} as const;

/**
 * Date/Time format options
 */
export const DATE_FORMAT_OPTION = {
  LONG: 'long',
  SHORT: 'short',
  NARROW: 'narrow',
  NUMERIC: 'numeric',
  TWO_DIGIT: '2-digit',
} as const;

/**
 * Common date formatting presets
 */
export const DATE_FORMAT = {
  /** Full readable date: "Monday, January 1, 2024" */
  FULL_DATE: {
    weekday: DATE_FORMAT_OPTION.LONG,
    year: DATE_FORMAT_OPTION.NUMERIC,
    month: DATE_FORMAT_OPTION.LONG,
    day: DATE_FORMAT_OPTION.NUMERIC,
  } as const,
  /** Time with AM/PM: "2:30 PM" */
  TIME_12H: {
    hour: DATE_FORMAT_OPTION.NUMERIC,
    minute: DATE_FORMAT_OPTION.TWO_DIGIT,
    hour12: true,
  } as const,
  /** 24-hour time: "14:30" */
  TIME_24H: {
    hour: DATE_FORMAT_OPTION.TWO_DIGIT,
    minute: DATE_FORMAT_OPTION.TWO_DIGIT,
    hour12: false,
  } as const,
} as const;

/**
 * String joiner for combining accessibility parts
 */
export const STRING_JOINER = {
  COMMA_SPACE: ', ',
  SPACE: ' ',
  DASH: ' - ',
  NEWLINE: '\n',
} as const;
