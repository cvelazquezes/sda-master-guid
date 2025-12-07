/**
 * Feature Configuration
 *
 * Feature flags, country/region rules, and business conditions.
 * This is the SINGLE SOURCE OF TRUTH for all feature toggles and business rules.
 *
 * ❌ NEVER write: if (country === 'MLM') { ... }
 * ✅ ALWAYS use: if (country === featureConfig.countries.MEXICO) { ... }
 *
 * ❌ NEVER write: if (isNewFeatureEnabled) { ... }
 * ✅ ALWAYS use: if (featureConfig.flags.newFeature) { ... }
 */

import {
  EMPTY_VALUE,
  STORAGE_KEYS,
  DIGEST_FREQUENCY,
  AB_TEST_VARIANT,
  LANGUAGE,
  COUNTRY_CODE,
  DIVISION_CODE,
  APP_VERSION,
} from '../constants';

// ============================================================================
// COUNTRY CODES - Re-exported from constants for feature config
// ============================================================================

export const countryCodes = COUNTRY_CODE;

// ============================================================================
// LANGUAGE CODES - Re-exported from constants for feature config
// ============================================================================

export const languageCodes = {
  ENGLISH: LANGUAGE.EN,
  SPANISH: LANGUAGE.ES,
  PORTUGUESE: LANGUAGE.PT,
  FRENCH: LANGUAGE.FR,
  GERMAN: LANGUAGE.DE,
  ITALIAN: LANGUAGE.IT,
} as const;

// ============================================================================
// REGION CONFIGURATIONS
// ============================================================================

export const regionConfig = {
  /** Inter-American Division regions */
  divisions: DIVISION_CODE,

  /** Countries by region */
  countriesByDivision: {
    [DIVISION_CODE.INTER_AMERICAN]: [
      countryCodes.MEXICO,
      countryCodes.GUATEMALA,
      countryCodes.HONDURAS,
      countryCodes.EL_SALVADOR,
      countryCodes.NICARAGUA,
      countryCodes.COSTA_RICA,
      countryCodes.PANAMA,
      countryCodes.BELIZE,
      countryCodes.CUBA,
      countryCodes.DOMINICAN_REPUBLIC,
      countryCodes.HAITI,
      countryCodes.JAMAICA,
      countryCodes.PUERTO_RICO,
      countryCodes.COLOMBIA,
      countryCodes.VENEZUELA,
    ],
    [DIVISION_CODE.SOUTH_AMERICAN]: [
      countryCodes.BRAZIL,
      countryCodes.ARGENTINA,
      countryCodes.CHILE,
      countryCodes.PERU,
      countryCodes.ECUADOR,
      countryCodes.BOLIVIA,
      countryCodes.PARAGUAY,
      countryCodes.URUGUAY,
    ],
    [DIVISION_CODE.NORTH_AMERICAN]: [countryCodes.USA, countryCodes.CANADA],
  } as const,

  /** Default language by country */
  defaultLanguage: {
    [countryCodes.USA]: languageCodes.ENGLISH,
    [countryCodes.CANADA]: languageCodes.ENGLISH,
    [countryCodes.BRAZIL]: languageCodes.PORTUGUESE,
    [countryCodes.SPAIN]: languageCodes.SPANISH,
    [countryCodes.PORTUGAL]: languageCodes.PORTUGUESE,
    [countryCodes.FRANCE]: languageCodes.FRENCH,
    // All other countries default to Spanish
    default: languageCodes.SPANISH,
  } as const,
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const featureFlags = {
  /** Core features */
  darkMode: true,
  multiLanguage: true,
  offlineMode: true,
  pushNotifications: true,

  /** Club features */
  clubRegistration: true,
  clubApprovalWorkflow: true,
  clubFees: true,
  clubAnalytics: true,

  /** Match features */
  matchScheduling: true,
  matchReminders: true,
  matchHistory: true,

  /** Pathfinder features */
  pathfinderClasses: true,
  pathfinderProgress: true,
  pathfinderBadges: true,

  /** Payment features */
  onlinePayments: false, // Disabled until payment integration is complete
  paymentReminders: true,
  paymentHistory: true,

  /** Social features */
  userProfiles: true,
  activityFeed: false, // Coming soon
  messaging: false, // Coming soon

  /** Admin features */
  advancedReporting: true,
  bulkOperations: true,
  dataExport: true,

  /** Experimental features */
  newDashboard: false,
  aiSuggestions: false,
  betaFeatures: false,
} as const;

// ============================================================================
// BUSINESS RULES BY FEATURE
// ============================================================================

export const businessRules = {
  /** Registration rules */
  registration: {
    requireEmailVerification: true,
    requireApproval: true,
    allowSelfRegistration: true,
    minAgeForSelfRegistration: 13,
  },

  /** Club rules */
  club: {
    requireApprovalForNewClub: true,
    allowMultipleClubMembership: false,
    requireActivePaymentForParticipation: true,
  },

  /** Match rules */
  match: {
    allowGuestParticipants: false,
    requireMinimumParticipants: true,
    sendAutomaticReminders: true,
    reminderHoursBefore: 24,
  },

  /** Payment rules */
  payment: {
    allowPartialPayments: true,
    automaticLateFees: false,
    sendPaymentReminders: true,
    reminderDaysBeforeDue: 3,
  },

  /** Notification rules */
  notification: {
    allowEmailNotifications: true,
    allowPushNotifications: true,
    allowSmsNotifications: false,
    digestEmailFrequency: DIGEST_FREQUENCY.WEEKLY,
  },
} as const;

// ============================================================================
// A/B TEST CONFIGURATIONS
// ============================================================================

export const abTestConfig = {
  /** Active experiments */
  experiments: {
    newOnboarding: {
      enabled: false,
      variants: [
        AB_TEST_VARIANT.CONTROL,
        AB_TEST_VARIANT.VARIANT_A,
        AB_TEST_VARIANT.VARIANT_B,
      ] as const,
      distribution: [50, 25, 25] as const,
    },
    redesignedDashboard: {
      enabled: false,
      variants: [AB_TEST_VARIANT.CONTROL, AB_TEST_VARIANT.VARIANT_A] as const,
      distribution: [50, 50] as const,
    },
  },

  /** User assignment persistence key */
  persistenceKey: STORAGE_KEYS.AB_TEST.ASSIGNMENTS,
} as const;

// ============================================================================
// MAINTENANCE CONFIGURATION
// ============================================================================

export const maintenanceConfig = {
  /** Is maintenance mode active */
  isActive: false,
  /** Maintenance message to display */
  message: EMPTY_VALUE,
  /** Expected end time (ISO string or null) */
  expectedEndTime: null as string | null,
  /** Features disabled during maintenance */
  disabledFeatures: [] as string[],
  /** Allow admin access during maintenance */
  allowAdminAccess: true,
} as const;

// ============================================================================
// APP VERSION CONFIGURATION
// ============================================================================

export const versionConfig = {
  /** Minimum supported app version */
  minSupportedVersion: APP_VERSION,
  /** Current app version */
  currentVersion: APP_VERSION,
  /** Force update if below this version */
  forceUpdateBelowVersion: APP_VERSION,
  /** Show update prompt if below this version */
  suggestUpdateBelowVersion: APP_VERSION,
} as const;

// ============================================================================
// COMBINED FEATURE CONFIG EXPORT
// ============================================================================

export const featureConfig = {
  countries: countryCodes,
  languages: languageCodes,
  regions: regionConfig,
  flags: featureFlags,
  rules: businessRules,
  abTests: abTestConfig,
  maintenance: maintenanceConfig,
  version: versionConfig,
} as const;

export type FeatureConfig = typeof featureConfig;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a feature flag is enabled
 *
 * @example
 * if (isFeatureEnabled('darkMode')) { ... }
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature] ?? false;
}

/**
 * Get default language for a country
 *
 * @example
 * const lang = getDefaultLanguage('BRA'); // 'pt'
 */
export function getDefaultLanguage(countryCode: string): string {
  return (
    (regionConfig.defaultLanguage as Record<string, string>)[countryCode] ??
    regionConfig.defaultLanguage.default
  );
}

/**
 * Check if country is in a specific division
 *
 * @example
 * if (isCountryInDivision('MEX', 'iad')) { ... }
 */
export function isCountryInDivision(
  countryCode: string,
  division: keyof typeof regionConfig.countriesByDivision
): boolean {
  return (regionConfig.countriesByDivision[division] as readonly string[]).includes(countryCode);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CountryCode = (typeof countryCodes)[keyof typeof countryCodes];
export type LanguageCode = (typeof languageCodes)[keyof typeof languageCodes];
export type Division = (typeof regionConfig.divisions)[keyof typeof regionConfig.divisions];
export type FeatureFlag = keyof typeof featureFlags;
