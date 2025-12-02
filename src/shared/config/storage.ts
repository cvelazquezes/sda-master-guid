/**
 * Storage Configuration
 * 
 * Storage keys, persistence policies, and data management constants.
 * This is the SINGLE SOURCE OF TRUTH for all storage-related decisions.
 * 
 * ❌ NEVER write: await AsyncStorage.getItem('user_token')
 * ✅ ALWAYS use: await AsyncStorage.getItem(storageConfig.keys.AUTH_TOKEN)
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * All storage keys must be defined here.
 * This prevents typos and ensures consistency.
 */
export const storageKeys = {
  // Authentication
  AUTH_TOKEN: '@sda_auth_token',
  REFRESH_TOKEN: '@sda_refresh_token',
  USER_DATA: '@sda_user_data',
  SESSION_ID: '@sda_session_id',

  // Preferences
  THEME: '@sda_theme',
  LANGUAGE: '@sda_language',
  NOTIFICATIONS_ENABLED: '@sda_notifications_enabled',
  BIOMETRIC_ENABLED: '@sda_biometric_enabled',

  // Onboarding
  ONBOARDING_COMPLETE: '@sda_onboarding_complete',
  FIRST_LAUNCH: '@sda_first_launch',
  LAST_VERSION_SEEN: '@sda_last_version_seen',

  // Cache
  API_CACHE: '@sda_api_cache',
  IMAGE_CACHE: '@sda_image_cache',
  SEARCH_HISTORY: '@sda_search_history',

  // User State
  LAST_CLUB_ID: '@sda_last_club_id',
  RECENT_ITEMS: '@sda_recent_items',
  FAVORITES: '@sda_favorites',
  DRAFT_DATA: '@sda_draft_data',

  // Sync State
  LAST_SYNC_TIME: '@sda_last_sync_time',
  PENDING_SYNC: '@sda_pending_sync',
  OFFLINE_QUEUE: '@sda_offline_queue',

  // A/B Testing
  AB_TEST_ASSIGNMENTS: '@sda_ab_test_assignments',

  // Analytics
  ANALYTICS_USER_ID: '@sda_analytics_user_id',
  ANALYTICS_SESSION: '@sda_analytics_session',

  // Device
  DEVICE_ID: '@sda_device_id',
  PUSH_TOKEN: '@sda_push_token',

  // Temporary
  TEMP_FORM_DATA: '@sda_temp_form_data',
  TEMP_FILTERS: '@sda_temp_filters',
} as const;

// ============================================================================
// SECURE STORAGE KEYS
// ============================================================================

/**
 * Keys for sensitive data that should use secure storage
 * (e.g., react-native-keychain or expo-secure-store)
 */
export const secureStorageKeys = {
  AUTH_TOKEN: 'sda_auth_token_secure',
  REFRESH_TOKEN: 'sda_refresh_token_secure',
  PIN_CODE: 'sda_pin_code',
  BIOMETRIC_KEY: 'sda_biometric_key',
  ENCRYPTION_KEY: 'sda_encryption_key',
} as const;

// ============================================================================
// STORAGE PREFIXES
// ============================================================================

/**
 * Prefixes for namespacing storage keys
 */
export const storagePrefixes = {
  /** Main app prefix */
  APP: '@sda_',
  /** Cache prefix */
  CACHE: '@sda_cache_',
  /** Temporary data prefix */
  TEMP: '@sda_temp_',
  /** User-specific data prefix (append user ID) */
  USER: '@sda_user_',
  /** Offline data prefix */
  OFFLINE: '@sda_offline_',
} as const;

// ============================================================================
// STORAGE LIMITS
// ============================================================================

export const storageLimits = {
  /** Maximum items in recent items list */
  maxRecentItems: 20,
  /** Maximum items in favorites */
  maxFavorites: 100,
  /** Maximum search history entries */
  maxSearchHistory: 50,
  /** Maximum cached API responses */
  maxCachedResponses: 100,
  /** Maximum offline queue items */
  maxOfflineQueueItems: 500,
  /** Maximum draft data age (ms) - 7 days */
  maxDraftAge: 7 * 24 * 60 * 60 * 1000,
} as const;

// ============================================================================
// CACHE POLICIES
// ============================================================================

export const cachePolicies = {
  /** API response cache */
  api: {
    /** Default TTL (5 minutes) */
    defaultTTL: 5 * 60 * 1000,
    /** User data TTL (1 minute) */
    userDataTTL: 60 * 1000,
    /** Static data TTL (1 hour) */
    staticDataTTL: 60 * 60 * 1000,
    /** List data TTL (2 minutes) */
    listDataTTL: 2 * 60 * 1000,
  },

  /** Image cache */
  images: {
    /** Default TTL (24 hours) */
    defaultTTL: 24 * 60 * 60 * 1000,
    /** Avatar TTL (1 hour) */
    avatarTTL: 60 * 60 * 1000,
    /** Maximum cached images */
    maxItems: 100,
    /** Maximum cache size (bytes) - 50MB */
    maxSize: 50 * 1024 * 1024,
  },

  /** Search cache */
  search: {
    /** TTL (10 minutes) */
    ttl: 10 * 60 * 1000,
    /** Maximum cached searches */
    maxItems: 20,
  },
} as const;

// ============================================================================
// PERSISTENCE POLICIES
// ============================================================================

export const persistencePolicies = {
  /** Data that persists across sessions */
  persistent: [
    storageKeys.USER_DATA,
    storageKeys.THEME,
    storageKeys.LANGUAGE,
    storageKeys.ONBOARDING_COMPLETE,
    storageKeys.FAVORITES,
    storageKeys.DEVICE_ID,
    storageKeys.NOTIFICATIONS_ENABLED,
    storageKeys.BIOMETRIC_ENABLED,
  ],

  /** Data cleared on logout */
  clearOnLogout: [
    storageKeys.AUTH_TOKEN,
    storageKeys.REFRESH_TOKEN,
    storageKeys.USER_DATA,
    storageKeys.SESSION_ID,
    storageKeys.LAST_CLUB_ID,
    storageKeys.RECENT_ITEMS,
    storageKeys.DRAFT_DATA,
    storageKeys.PENDING_SYNC,
    storageKeys.OFFLINE_QUEUE,
    storageKeys.TEMP_FORM_DATA,
    storageKeys.TEMP_FILTERS,
  ],

  /** Data cleared on app update */
  clearOnUpdate: [
    storageKeys.API_CACHE,
    storageKeys.IMAGE_CACHE,
    storageKeys.TEMP_FORM_DATA,
    storageKeys.TEMP_FILTERS,
  ],

  /** Data that can be cleared to free space */
  clearable: [
    storageKeys.API_CACHE,
    storageKeys.IMAGE_CACHE,
    storageKeys.SEARCH_HISTORY,
    storageKeys.RECENT_ITEMS,
  ],
} as const;

// ============================================================================
// SYNC CONFIGURATION
// ============================================================================

export const syncConfig = {
  /** Minimum time between syncs (ms) */
  minSyncInterval: 30 * 1000,
  /** Maximum time without sync before force sync (ms) */
  maxSyncAge: 5 * 60 * 1000,
  /** Batch size for sync operations */
  batchSize: 50,
  /** Retry configuration for failed syncs */
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
  },
} as const;

// ============================================================================
// MIGRATION CONFIGURATION
// ============================================================================

export const migrationConfig = {
  /** Current storage schema version */
  currentVersion: 1,
  /** Storage key for schema version */
  versionKey: '@sda_storage_version',
} as const;

// ============================================================================
// COMBINED STORAGE CONFIG EXPORT
// ============================================================================

export const storageConfig = {
  keys: storageKeys,
  secureKeys: secureStorageKeys,
  prefixes: storagePrefixes,
  limits: storageLimits,
  cache: cachePolicies,
  persistence: persistencePolicies,
  sync: syncConfig,
  migration: migrationConfig,
} as const;

export type StorageConfig = typeof storageConfig;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a user-specific storage key
 * 
 * @example
 * const key = getUserStorageKey('preferences', 'user123');
 * // Returns '@sda_user_user123_preferences'
 */
export function getUserStorageKey(key: string, userId: string): string {
  return `${storagePrefixes.USER}${userId}_${key}`;
}

/**
 * Generate a cache key
 * 
 * @example
 * const key = getCacheKey('clubs_list');
 * // Returns '@sda_cache_clubs_list'
 */
export function getCacheKey(key: string): string {
  return `${storagePrefixes.CACHE}${key}`;
}

/**
 * Check if a key should be cleared on logout
 */
export function shouldClearOnLogout(key: string): boolean {
  return (persistencePolicies.clearOnLogout as readonly string[]).includes(key);
}

/**
 * Check if a key is clearable (can be deleted to free space)
 */
export function isClearable(key: string): boolean {
  return (persistencePolicies.clearable as readonly string[]).includes(key);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type StorageKey = typeof storageKeys[keyof typeof storageKeys];
export type SecureStorageKey = typeof secureStorageKeys[keyof typeof secureStorageKeys];

