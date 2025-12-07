/**
 * Mock Data Constants
 *
 * Centralized mock data for development and testing.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: email: 'admin@example.com'
 * ✅ ALWAYS use: email: MOCK_DATA.USERS.ADMIN.EMAIL
 *
 * @version 1.0.0
 */

/**
 * Service and Repository Type Constants
 */
export const SERVICE_NAMES = {
  AUTH: 'AuthService',
  USER: 'UserService',
  CLUB: 'ClubService',
  MATCH: 'MatchService',
  PAYMENT: 'PaymentService',
  NOTIFICATION: 'NotificationService',
} as const;

export const REPOSITORY_TYPES = {
  MOCK: 'Mock',
  API: 'API',
} as const;

/**
 * Feature Flag Keys
 * Used to identify feature flags throughout the application
 */
export const FEATURE_FLAG_KEY = {
  ENABLE_OFFLINE_MODE: 'enableOfflineMode',
  ENABLE_PERFORMANCE_MONITORING: 'enablePerformanceMonitoring',
  ENABLE_BIOMETRICS: 'enableBiometrics',
  ENABLE_PUSH_NOTIFICATIONS: 'enablePushNotifications',
  ENABLE_AB_TESTING: 'enableABTesting',
  ENABLE_ADVANCED_ANALYTICS: 'enableAdvancedAnalytics',
  ENABLE_NEW_MATCH_UI: 'enableNewMatchUI',
  ENABLE_ADMIN_DEBUG_TOOLS: 'enableAdminDebugTools',
} as const;

/**
 * User Groups for feature flag targeting
 */
export const USER_GROUP = {
  BETA: 'beta',
  INTERNAL: 'internal',
  SUPER_ADMIN: 'super_admin',
} as const;

/**
 * Operation types for offline support
 */
export const OFFLINE_OPERATION = {
  READ: 'read',
  VIEW: 'view',
  LIST: 'list',
  GET: 'get',
  SEARCH: 'search',
} as const;

export const OFFLINE_OPERATIONS = Object.values(OFFLINE_OPERATION);

/**
 * Storage Keys Constants
 * Used for secure storage and AsyncStorage keys
 */
export const STORAGE_KEYS = {
  AUTH: {
    TOKEN: 'auth_token',
    USER_ID: 'auth_user_id',
    REFRESH_TOKEN: 'refresh_token',
  },
  CSRF: {
    TOKEN: 'csrf_token',
    TOKEN_TIMESTAMP: 'csrf_token_timestamp',
  },
  THEME: {
    MODE: 'theme_mode',
  },
  LANGUAGE: {
    CURRENT: 'current_language',
  },
  FEATURE_FLAGS: {
    CACHE: 'feature_flags_cache',
    DATA: '@feature_flags',
  },
  OFFLINE: {
    QUEUE: '@offline_queue',
  },
  IDEMPOTENCY: {
    PREFIX: '@idempotency:',
  },
  AB_TEST: {
    ASSIGNMENTS: '@ab_test_assignments',
  },
} as const;

export const MOCK_DATA = {
  USERS: {
    ADMIN: {
      ID: '1',
      EMAIL: 'admin@example.com',
      NAME: 'Admin User',
    },
    REGULAR: {
      ID: '2',
      EMAIL: 'user@example.com',
      NAME: 'Regular User',
    },
  },

  CLUBS: {
    DEFAULT: {
      ID: 'club1',
      NAME: 'Default Club',
    },
  },

  TOKENS: {
    PREFIX: 'mock_token_',
    REFRESH_PREFIX: 'mock_refresh_',
    REFRESHED_PREFIX: 'mock_token_refreshed_',
  },

  NOTIFICATIONS: {
    IDS: {
      ACTIVITY: '1',
      FEE: '2',
      CLUB: '3',
      SYSTEM: '4',
    },
  },
} as const;

/**
 * Generates a mock token
 */
export const generateMockToken = (userId: string): string =>
  `${MOCK_DATA.TOKENS.PREFIX}${userId}_${Date.now()}`;

/**
 * Generates a mock refresh token
 */
export const generateMockRefreshToken = (): string =>
  `${MOCK_DATA.TOKENS.REFRESH_PREFIX}${Date.now()}`;

/**
 * Generates a refreshed mock token
 */
export const generateRefreshedMockToken = (): string =>
  `${MOCK_DATA.TOKENS.REFRESHED_PREFIX}${Date.now()}`;
