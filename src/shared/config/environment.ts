/**
 * Environment Configuration
 * Centralized configuration management with validation
 */

export interface Environment {
  apiUrl: string;
  wsUrl: string;
  env: 'development' | 'staging' | 'production';
  useMockData: boolean;
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

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getBoolEnvVar = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true';
};

export const environment: Environment = {
  apiUrl: getEnvVar('EXPO_PUBLIC_API_URL', 'http://localhost:3000/api'),
  wsUrl: getEnvVar('EXPO_PUBLIC_WS_URL', 'ws://localhost:3000'),
  env: (getEnvVar('EXPO_PUBLIC_ENV', 'development') as Environment['env']),
  useMockData: getBoolEnvVar('EXPO_PUBLIC_USE_MOCK_DATA', true),
  features: {
    enableBiometrics: getBoolEnvVar('EXPO_PUBLIC_ENABLE_BIOMETRICS', true),
    enableOfflineMode: getBoolEnvVar('EXPO_PUBLIC_ENABLE_OFFLINE_MODE', true),
    enablePushNotifications: getBoolEnvVar('EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS', false),
    enablePerformanceMonitoring: getBoolEnvVar(
      'EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING',
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
  const required = ['apiUrl', 'wsUrl', 'env'];
  
  for (const key of required) {
    if (!environment[key as keyof Environment]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
  
  if (environment.env === 'production' && environment.useMockData) {
    throw new Error('Mock data cannot be enabled in production');
  }
};

// Validate on import
validateEnvironment();

