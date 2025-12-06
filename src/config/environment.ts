/**
 * Environment Configuration
 * Centralized configuration management with validation
 */

export interface Environment {
  api: {
    base: string;
    websocket: string;
  };
  name: 'development' | 'staging' | 'production';
  mock: {
    useMockApi: boolean;
  };
  features: {
    enableBiometrics: boolean;
    enableOfflineMode: boolean;
    enablePushNotifications: boolean;
    enablePerformanceMonitoring: boolean;
  };
  analytics: {
    enabled: boolean;
    key?: string;
  };
  sentry: {
    enabled: boolean;
    dsn?: string;
  };
}

const getBoolEnvVar = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) {
    return defaultValue;
  }
  return value === 'true';
};

export const environment: Environment = {
  api: {
    base: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    websocket: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000',
  },
  name: (process.env.EXPO_PUBLIC_ENV || 'development') as Environment['name'],
  mock: {
    useMockApi: getBoolEnvVar(process.env.EXPO_PUBLIC_USE_MOCK_DATA, true),
  },
  features: {
    enableBiometrics: getBoolEnvVar(process.env.EXPO_PUBLIC_ENABLE_BIOMETRICS, true),
    enableOfflineMode: getBoolEnvVar(process.env.EXPO_PUBLIC_ENABLE_OFFLINE_MODE, true),
    enablePushNotifications: getBoolEnvVar(
      process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS,
      false
    ),
    enablePerformanceMonitoring: getBoolEnvVar(
      process.env.EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING,
      false
    ),
  },
  analytics: {
    enabled: !!process.env.EXPO_PUBLIC_ANALYTICS_KEY,
    key: process.env.EXPO_PUBLIC_ANALYTICS_KEY,
  },
  sentry: {
    enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  },
};

/**
 * Validates environment configuration on startup
 * @throws Error if critical configuration is missing
 */
export const validateEnvironment = (): void => {
  if (!environment.api.base) {
    throw new Error('Missing required environment variable: api.base');
  }
  if (!environment.api.websocket) {
    throw new Error('Missing required environment variable: api.websocket');
  }
  if (!environment.name) {
    throw new Error('Missing required environment variable: name');
  }

  // Note: Mock data is allowed in production for standalone APK builds
  // that don't have a backend server. This is intentional for testing
  // and demonstration purposes.
  if (environment.name === 'production' && environment.mock.useMockApi) {
    console.warn('⚠️  Running in production mode with mock data enabled');
  }
};

// Validate on import
try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error);
  // Don't throw - allow app to start even with validation warnings
}
