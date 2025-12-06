/**
 * Environment Configuration
 *
 * Environment-specific settings and runtime configuration.
 * This is the SINGLE SOURCE OF TRUTH for all environment-related decisions.
 *
 * ❌ NEVER write: if (process.env.NODE_ENV === 'production') { ... }
 * ✅ ALWAYS use: if (isProduction()) { ... }
 */

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

export type Environment = 'development' | 'staging' | 'production';

/**
 * Detect current environment
 * Priority: APP_ENV > NODE_ENV > default to development
 */
function detectEnvironment(): Environment {
  // Check for explicit APP_ENV first
  const appEnv = process.env.APP_ENV || process.env.EXPO_PUBLIC_APP_ENV;
  if (appEnv === 'production' || appEnv === 'staging' || appEnv === 'development') {
    return appEnv;
  }

  // Fall back to NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    return 'production';
  }
  if (nodeEnv === 'test') {
    return 'development';
  }

  // Default to development
  return 'development';
}

const currentEnvironment = detectEnvironment();

// ============================================================================
// ENVIRONMENT HELPERS
// ============================================================================

/**
 * Get current environment
 */
export function getEnvironment(): Environment {
  return currentEnvironment;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return currentEnvironment === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return currentEnvironment === 'development';
}

/**
 * Check if running in staging
 */
export function isStaging(): boolean {
  return currentEnvironment === 'staging';
}

/**
 * Check if running in any non-production environment
 */
export function isNonProduction(): boolean {
  return currentEnvironment !== 'production';
}

// ============================================================================
// API URLS BY ENVIRONMENT
// ============================================================================

export const apiUrls = {
  development: {
    base: 'http://localhost:3000/api',
    auth: 'http://localhost:3000/auth',
    websocket: 'ws://localhost:3000/ws',
    cdn: 'http://localhost:3000/static',
  },
  staging: {
    base: 'https://staging-api.sda-master-guide.com/api',
    auth: 'https://staging-api.sda-master-guide.com/auth',
    websocket: 'wss://staging-api.sda-master-guide.com/ws',
    cdn: 'https://staging-cdn.sda-master-guide.com',
  },
  production: {
    base: 'https://api.sda-master-guide.com/api',
    auth: 'https://api.sda-master-guide.com/auth',
    websocket: 'wss://api.sda-master-guide.com/ws',
    cdn: 'https://cdn.sda-master-guide.com',
  },
} as const;

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================

export const loggingConfig = {
  development: {
    level: 'debug' as const,
    enabled: true,
    consoleEnabled: true,
    remoteEnabled: false,
    includeStackTrace: true,
  },
  staging: {
    level: 'info' as const,
    enabled: true,
    consoleEnabled: true,
    remoteEnabled: true,
    includeStackTrace: true,
  },
  production: {
    level: 'warn' as const,
    enabled: true,
    consoleEnabled: false,
    remoteEnabled: true,
    includeStackTrace: false,
  },
} as const;

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ============================================================================
// ANALYTICS CONFIGURATION
// ============================================================================

export const analyticsConfig = {
  development: {
    enabled: false,
    trackScreenViews: false,
    trackUserActions: false,
    trackErrors: false,
    debugMode: true,
  },
  staging: {
    enabled: true,
    trackScreenViews: true,
    trackUserActions: true,
    trackErrors: true,
    debugMode: true,
  },
  production: {
    enabled: true,
    trackScreenViews: true,
    trackUserActions: true,
    trackErrors: true,
    debugMode: false,
  },
} as const;

// ============================================================================
// ERROR REPORTING CONFIGURATION
// ============================================================================

export const errorReportingConfig = {
  development: {
    enabled: false,
    captureUnhandled: false,
    sendToRemote: false,
    showLocalAlert: true,
  },
  staging: {
    enabled: true,
    captureUnhandled: true,
    sendToRemote: true,
    showLocalAlert: true,
  },
  production: {
    enabled: true,
    captureUnhandled: true,
    sendToRemote: true,
    showLocalAlert: false,
  },
} as const;

// ============================================================================
// DEVELOPER TOOLS CONFIGURATION
// ============================================================================

export const devToolsConfig = {
  development: {
    reactotronEnabled: true,
    flipperEnabled: true,
    reduxDevToolsEnabled: true,
    performanceMonitorEnabled: true,
    showNetworkLogs: true,
  },
  staging: {
    reactotronEnabled: false,
    flipperEnabled: false,
    reduxDevToolsEnabled: false,
    performanceMonitorEnabled: true,
    showNetworkLogs: false,
  },
  production: {
    reactotronEnabled: false,
    flipperEnabled: false,
    reduxDevToolsEnabled: false,
    performanceMonitorEnabled: false,
    showNetworkLogs: false,
  },
} as const;

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

export const securityConfig = {
  development: {
    certificatePinningEnabled: false,
    rootDetectionEnabled: false,
    debuggerDetectionEnabled: false,
    screenshotPreventionEnabled: false,
  },
  staging: {
    certificatePinningEnabled: true,
    rootDetectionEnabled: false,
    debuggerDetectionEnabled: false,
    screenshotPreventionEnabled: false,
  },
  production: {
    certificatePinningEnabled: true,
    rootDetectionEnabled: true,
    debuggerDetectionEnabled: true,
    screenshotPreventionEnabled: true,
  },
} as const;

// ============================================================================
// MOCK DATA CONFIGURATION
// ============================================================================

export const mockConfig = {
  development: {
    useMockApi: true,
    useMockAuth: true,
    mockDelay: 500,
    mockFailureRate: 0,
  },
  staging: {
    useMockApi: false,
    useMockAuth: false,
    mockDelay: 0,
    mockFailureRate: 0,
  },
  production: {
    useMockApi: false,
    useMockAuth: false,
    mockDelay: 0,
    mockFailureRate: 0,
  },
} as const;

// ============================================================================
// COMBINED ENVIRONMENT CONFIG
// ============================================================================

interface EnvironmentConfigResult {
  name: Environment;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  api: (typeof apiUrls)[Environment];
  logging: (typeof loggingConfig)[Environment];
  analytics: (typeof analyticsConfig)[Environment];
  errorReporting: (typeof errorReportingConfig)[Environment];
  devTools: (typeof devToolsConfig)[Environment];
  security: (typeof securityConfig)[Environment];
  mock: (typeof mockConfig)[Environment];
  apiUrl: string;
  useMockData: boolean;
}

function getEnvironmentConfig(): EnvironmentConfigResult {
  const env = currentEnvironment;

  return {
    /** Current environment name */
    name: env,
    /** Is production environment */
    isProduction: env === 'production',
    /** Is development environment */
    isDevelopment: env === 'development',
    /** Is staging environment */
    isStaging: env === 'staging',
    /** API URLs for current environment */
    api: apiUrls[env],
    /** Logging config for current environment */
    logging: loggingConfig[env],
    /** Analytics config for current environment */
    analytics: analyticsConfig[env],
    /** Error reporting config for current environment */
    errorReporting: errorReportingConfig[env],
    /** Developer tools config for current environment */
    devTools: devToolsConfig[env],
    /** Security config for current environment */
    security: securityConfig[env],
    /** Mock data config for current environment */
    mock: mockConfig[env],

    // Backward compatibility aliases
    /** @deprecated Use api.base instead */
    apiUrl: apiUrls[env].base,
    /** @deprecated Use mock.useMockApi instead */
    useMockData: mockConfig[env].useMockApi,
  };
}

export const environmentConfig = getEnvironmentConfig();

// Alias for backward compatibility - many files import { environment }
export const environment = environmentConfig;

export type EnvironmentConfig = typeof environmentConfig;

// ============================================================================
// CONVENIENCE GETTERS
// ============================================================================

/**
 * Get API base URL for current environment
 */
export function getApiBaseUrl(): string {
  return environmentConfig.api.base;
}

/**
 * Get auth URL for current environment
 */
export function getAuthUrl(): string {
  return environmentConfig.api.auth;
}

/**
 * Get WebSocket URL for current environment
 */
export function getWebSocketUrl(): string {
  return environmentConfig.api.websocket;
}

/**
 * Get CDN URL for current environment
 */
export function getCdnUrl(): string {
  return environmentConfig.api.cdn;
}

/**
 * Check if logging is enabled
 */
export function isLoggingEnabled(): boolean {
  return environmentConfig.logging.enabled;
}

/**
 * Get current log level
 */
export function getLogLevel(): LogLevel {
  return environmentConfig.logging.level;
}

/**
 * Check if mock API should be used
 */
export function shouldUseMockApi(): boolean {
  return environmentConfig.mock.useMockApi;
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return environmentConfig.analytics.enabled;
}
