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

// ============================================================================
// COUNTRY CODES (ISO 3166-1 alpha-3)
// ============================================================================

export const countryCodes = {
  // North America
  USA: 'USA',
  CANADA: 'CAN',
  MEXICO: 'MEX',

  // Central America
  GUATEMALA: 'GTM',
  HONDURAS: 'HND',
  EL_SALVADOR: 'SLV',
  NICARAGUA: 'NIC',
  COSTA_RICA: 'CRI',
  PANAMA: 'PAN',
  BELIZE: 'BLZ',

  // Caribbean
  CUBA: 'CUB',
  DOMINICAN_REPUBLIC: 'DOM',
  HAITI: 'HTI',
  JAMAICA: 'JAM',
  PUERTO_RICO: 'PRI',

  // South America
  BRAZIL: 'BRA',
  ARGENTINA: 'ARG',
  CHILE: 'CHL',
  COLOMBIA: 'COL',
  PERU: 'PER',
  VENEZUELA: 'VEN',
  ECUADOR: 'ECU',
  BOLIVIA: 'BOL',
  PARAGUAY: 'PRY',
  URUGUAY: 'URY',

  // Europe
  SPAIN: 'ESP',
  PORTUGAL: 'PRT',
  FRANCE: 'FRA',
  GERMANY: 'DEU',
  UNITED_KINGDOM: 'GBR',
  ITALY: 'ITA',

  // Other
  PHILIPPINES: 'PHL',
} as const;

// ============================================================================
// LANGUAGE CODES (ISO 639-1)
// ============================================================================

export const languageCodes = {
  ENGLISH: 'en',
  SPANISH: 'es',
  PORTUGUESE: 'pt',
  FRENCH: 'fr',
  GERMAN: 'de',
  ITALIAN: 'it',
} as const;

// ============================================================================
// REGION CONFIGURATIONS
// ============================================================================

export const regionConfig = {
  /** Inter-American Division regions */
  divisions: {
    INTER_AMERICAN: 'iad',
    SOUTH_AMERICAN: 'sad',
    NORTH_AMERICAN: 'nad',
    EURO_AFRICA: 'eud',
    SOUTHERN_ASIA: 'sud',
  } as const,

  /** Countries by region */
  countriesByDivision: {
    iad: [
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
    sad: [
      countryCodes.BRAZIL,
      countryCodes.ARGENTINA,
      countryCodes.CHILE,
      countryCodes.PERU,
      countryCodes.ECUADOR,
      countryCodes.BOLIVIA,
      countryCodes.PARAGUAY,
      countryCodes.URUGUAY,
    ],
    nad: [countryCodes.USA, countryCodes.CANADA],
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
    digestEmailFrequency: 'weekly' as const,
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
      variants: ['control', 'variant_a', 'variant_b'] as const,
      distribution: [50, 25, 25] as const,
    },
    redesignedDashboard: {
      enabled: false,
      variants: ['control', 'variant_a'] as const,
      distribution: [50, 50] as const,
    },
  },

  /** User assignment persistence key */
  persistenceKey: '@ab_test_assignments',
} as const;

// ============================================================================
// MAINTENANCE CONFIGURATION
// ============================================================================

export const maintenanceConfig = {
  /** Is maintenance mode active */
  isActive: false,
  /** Maintenance message to display */
  message: '',
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
  minSupportedVersion: '1.0.0',
  /** Current app version */
  currentVersion: '1.0.0',
  /** Force update if below this version */
  forceUpdateBelowVersion: '1.0.0',
  /** Show update prompt if below this version */
  suggestUpdateBelowVersion: '1.0.0',
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
