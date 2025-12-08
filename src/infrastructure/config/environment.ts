/**
 * Environment Configuration
 *
 * Infrastructure configuration for the application.
 */

/**
 * Environment configuration
 */
export const environment = {
  /**
   * API configuration
   */
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },

  /**
   * Mock data configuration
   */
  mock: {
    useMockApi: __DEV__ && !process.env.EXPO_PUBLIC_API_URL,
  },

  /**
   * Feature flags
   */
  features: {
    enableAnalytics: !__DEV__,
    enableCrashReporting: !__DEV__,
  },

  /**
   * Check if running in development
   */
  isDevelopment: __DEV__,
};

