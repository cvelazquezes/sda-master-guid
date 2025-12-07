/**
 * Format Constants
 * Centralized format strings for dates, numbers, currency, etc.
 */
/* eslint-disable no-magic-numbers */

// External Service URLs
export const EXTERNAL_URLS = {
  WHATSAPP: {
    BASE: 'https://wa.me/',
    // Deep link for native app: whatsapp://send?phone=XXX&text=YYY
    SEND: (phone: string, message: string) =>
      `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`,
    // Web fallback: https://wa.me/XXX?text=YYY
    WEB: (phone: string, message: string) =>
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
  },
} as const;

/**
 * Date Locale Options - Used for toLocaleDateString options
 */
export const DATE_LOCALE_OPTIONS = {
  FULL_DATE: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } as const,
  LONG_DATE: { year: 'numeric', month: 'long', day: 'numeric' } as const,
  DATE_WITHOUT_YEAR: { weekday: 'long', month: 'long', day: 'numeric' } as const,
  SHORT_DATE: { month: 'short', day: 'numeric', year: 'numeric' } as const,
  MEDIUM_DATE: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' } as const,
  MONTH_DAY: { month: 'short', day: 'numeric' } as const,
} as const;

export const DATE_FORMATS = {
  // ISO Standards
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
  ISO_DATETIME_MS: 'YYYY-MM-DDTHH:mm:ss.SSSZ',

  // Display Formats
  DISPLAY_DATE: 'MM/DD/YYYY',
  DISPLAY_DATE_SHORT: 'MM/DD/YY',
  DISPLAY_DATE_LONG: 'MMMM DD, YYYY',
  DISPLAY_DATE_WITH_DAY: 'dddd, MMMM DD, YYYY',

  // Time Formats
  TIME_12H: 'hh:mm A',
  TIME_12H_SECONDS: 'hh:mm:ss A',
  TIME_24H: 'HH:mm',
  TIME_24H_SECONDS: 'HH:mm:ss',

  // Combined Date & Time
  DATETIME_12H: 'MM/DD/YYYY hh:mm A',
  DATETIME_24H: 'MM/DD/YYYY HH:mm',
  DATETIME_LONG: 'MMMM DD, YYYY at hh:mm A',

  // Relative Formats (for display)
  RELATIVE_SHORT: 'relative-short', // "2h ago"
  RELATIVE_LONG: 'relative-long', // "2 hours ago"

  // Month & Year
  MONTH_YEAR: 'MMMM YYYY',
  MONTH_YEAR_SHORT: 'MMM YYYY',
  MONTH_DAY: 'MMMM DD',
  MONTH_DAY_SHORT: 'MMM DD',

  // API Formats
  API_DATE: 'YYYY-MM-DD',
  API_DATETIME: 'YYYY-MM-DDTHH:mm:ss.SSSZ',

  // ============================================================================
  // DATE-FNS FORMATS (use with date-fns format() function)
  // ============================================================================
  // Note: date-fns uses lowercase 'yyyy' for year, 'dd' for day

  /** Format: "Jan 01, 2024 · 14:30" - Used for scheduled dates with separator */
  DATE_FNS_DATETIME_DISPLAY: 'MMM dd, yyyy · HH:mm',
  /** Format: "Jan 01, 2024 14:30" - Used for datetime without separator */
  DATE_FNS_DATETIME_SHORT: 'MMM dd, yyyy HH:mm',
  /** Format: "Jan 01, 2024" - Used for creation dates */
  DATE_FNS_DATE_DISPLAY: 'MMM dd, yyyy',
  /** Format: "2024-01-01" - ISO date for date-fns */
  DATE_FNS_ISO_DATE: 'yyyy-MM-dd',
  /** Format: "January 01, 2024" - Long date format */
  DATE_FNS_DATE_LONG: 'MMMM dd, yyyy',
  /** Format: "14:30" - 24-hour time */
  DATE_FNS_TIME_24H: 'HH:mm',
  /** Format: "2:30 PM" - 12-hour time */
  DATE_FNS_TIME_12H: 'h:mm a',
} as const;

/**
 * Default Display Values - Used for fallback/placeholder amounts
 */
export const DEFAULT_DISPLAY = {
  /** Default zero amount with 2 decimal places */
  AMOUNT_ZERO: '0.00',
} as const;

export const NUMBER_FORMATS = {
  // Currency
  CURRENCY_USD: {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },

  // Decimal
  DECIMAL: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },

  // Integer
  INTEGER: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },

  // Percentage
  PERCENTAGE: {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  },
} as const;

export const PHONE_FORMATS = {
  // Phone number format examples
  US: '(XXX) XXX-XXXX',
  INTERNATIONAL: '+X XXX XXX XXXX',
  WHATSAPP: '+X (XXX) XXX-XXXX',
} as const;

// Regular expressions for format validation
export const FORMAT_REGEX = {
  DATE: {
    ISO: /^\d{4}-\d{2}-\d{2}$/,
    US: /^\d{2}\/\d{2}\/\d{4}$/,
    US_SHORT: /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
  },
  TIME: {
    TIME_24H: /^([01]\d|2[0-3]):([0-5]\d)$/,
    TIME_12H: /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM|am|pm)$/,
  },
  PHONE: {
    US: /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
    INTERNATIONAL: /^\+?[1-9]\d{1,14}$/,
  },
  CURRENCY: {
    USD: /^\$?\d{1,3}(,?\d{3})*(\.\d{2})?$/,
  },
} as const;

// Helper function to format currency
export function formatCurrency(amount: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, NUMBER_FORMATS.CURRENCY_USD).format(amount);
}

// Helper function to format number
export function formatNumber(value: number, decimals = 2, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Export type helpers
export type DateFormatKey = keyof typeof DATE_FORMATS;
export type NumberFormatKey = keyof typeof NUMBER_FORMATS;
