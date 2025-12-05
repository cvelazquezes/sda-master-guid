/**
 * Sentry Configuration
 *
 * Error tracking and performance monitoring with Sentry.
 * Captures errors, tracks performance, and provides insights.
 *
 * Based on best practices from:
 * - Sentry documentation
 * - Airbnb's error tracking
 * - Netflix's monitoring
 */

import * as Sentry from '@sentry/react-native';
import { environment } from './environment';
import Constants from 'expo-constants';

/**
 * Sentry configuration options
 */
const sentryConfig: Sentry.ReactNativeOptions = {
  // DSN from environment variables
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',

  // Enable/disable based on environment
  enabled: !__DEV__ && !!process.env.EXPO_PUBLIC_SENTRY_DSN,

  // Environment
  environment: __DEV__ ? 'development' : 'production',

  // Release version
  release: `${Constants.expoConfig?.name}@${Constants.expoConfig?.version}`,

  // Distribution (for Expo)
  dist: Constants.expoConfig?.version,

  // Enable automatic session tracking
  enableAutoSessionTracking: true,

  // Session tracking interval (30 seconds)
  sessionTrackingIntervalMillis: 30000,

  // Enable native crash handling
  enableNative: true,

  // Enable automatic breadcrumbs
  enableAutoPerformanceTracing: true,

  // Trace sampling rate (10% of transactions)
  tracesSampleRate: 0.1,

  // Attach stack traces to messages
  attachStacktrace: true,

  // Maximum breadcrumbs
  maxBreadcrumbs: 50,

  // Send default PII (Personally Identifiable Information)
  sendDefaultPii: false,

  // Before send hook (filter/modify events)
  beforeSend(event, hint) {
    // Don't send events in development
    if (__DEV__) {
      console.log('Sentry event (dev mode, not sent):', event);
      return null;
    }

    // Filter out specific errors
    if (event.exception) {
      const error = hint.originalException as Error;

      // Ignore network errors (handled by retry logic)
      if (error?.name === 'NetworkError' || error?.message?.includes('Network')) {
        return null;
      }

      // Ignore user cancellations
      if (error?.name === 'CanceledError') {
        return null;
      }
    }

    return event;
  },

  // Before breadcrumb hook
  beforeBreadcrumb(breadcrumb, _hint) {
    // Filter sensitive data from breadcrumbs
    if (breadcrumb.category === 'console') {
      // Don't log console messages
      return null;
    }

    if (breadcrumb.type === 'http') {
      // Remove sensitive headers
      if (breadcrumb.data?.headers) {
        delete breadcrumb.data.headers.Authorization;
        delete breadcrumb.data.headers.Cookie;
      }

      // Remove sensitive query params
      if (breadcrumb.data?.url) {
        const url = new URL(breadcrumb.data.url);
        url.searchParams.delete('token');
        url.searchParams.delete('password');
        breadcrumb.data.url = url.toString();
      }
    }

    return breadcrumb;
  },

  // Integrations
  integrations: [
    // React Native integrations
    new Sentry.ReactNativeTracing({
      // Trace all navigation
      routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),

      // Track user interactions
      tracingOrigins: ['localhost', environment.apiUrl, /^\//],

      // Enable automatic tracing for fetch/XHR
      traceFetch: true,
      traceXHR: true,
    }),
  ],
};

/**
 * Initialize Sentry
 *
 * Call this early in your app's initialization (e.g., index.js or App.tsx)
 *
 * @example
 * ```typescript
 * import { initSentry } from './config/sentry';
 *
 * initSentry();
 * ```
 */
export function initSentry() {
  if (sentryConfig.enabled) {
    Sentry.init(sentryConfig);
    console.log('Sentry initialized');
  } else {
    console.log('Sentry disabled (dev mode or no DSN)');
  }
}

/**
 * Set user context for error tracking
 *
 * @param user - User information
 *
 * @example
 * ```typescript
 * setSentryUser({
 *   id: user.id,
 *   email: user.email,
 *   username: user.name,
 * });
 * ```
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}) {
  Sentry.setUser(user);
}

/**
 * Clear user context (e.g., on logout)
 *
 * @example
 * ```typescript
 * clearSentryUser();
 * ```
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Set custom context for errors
 *
 * @param name - Context name
 * @param context - Context data
 *
 * @example
 * ```typescript
 * setSentryContext('match', {
 *   matchId: '123',
 *   status: 'active',
 * });
 * ```
 */
export function setSentryContext(name: string, context: Record<string, unknown>) {
  Sentry.setContext(name, context);
}

/**
 * Add breadcrumb for debugging
 *
 * @param breadcrumb - Breadcrumb data
 *
 * @example
 * ```typescript
 * addSentryBreadcrumb({
 *   category: 'auth',
 *   message: 'User logged in',
 *   level: 'info',
 * });
 * ```
 */
export function addSentryBreadcrumb(breadcrumb: {
  category?: string;
  message?: string;
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  data?: Record<string, unknown>;
}) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Capture exception manually
 *
 * @param error - Error to capture
 * @param context - Additional context
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation
 * } catch (error) {
 *   captureSentryException(error, {
 *     extra: { userId: '123' }
 *   });
 * }
 * ```
 */
export function captureSentryException(
  error: Error,
  context?: {
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
  }
) {
  Sentry.captureException(error, {
    ...context,
  });
}

/**
 * Capture message manually
 *
 * @param message - Message to capture
 * @param level - Severity level
 * @param context - Additional context
 *
 * @example
 * ```typescript
 * captureSentryMessage('Payment processing started', 'info', {
 *   tags: { payment_id: '123' }
 * });
 * ```
 */
export function captureSentryMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: {
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
  }
) {
  Sentry.captureMessage(message, {
    level,
    ...context,
  });
}

/**
 * Start a performance transaction
 *
 * @param name - Transaction name
 * @param op - Operation type
 * @returns Transaction object
 *
 * @example
 * ```typescript
 * const transaction = startSentryTransaction('load_matches', 'http');
 *
 * try {
 *   await fetchMatches();
 * } finally {
 *   transaction.finish();
 * }
 * ```
 */
export function startSentryTransaction(name: string, op: string) {
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Wrap a function with performance tracking
 *
 * @param name - Transaction name
 * @param fn - Function to track
 * @returns Wrapped function
 *
 * @example
 * ```typescript
 * const fetchData = withSentryPerformance('fetch_data', async () => {
 *   return await api.get('/data');
 * });
 * ```
 */
export function withSentryPerformance<T extends (...args: unknown[]) => Promise<unknown>>(
  name: string,
  fn: T
): T {
  return (async (...args: unknown[]) => {
    const transaction = startSentryTransaction(name, 'function');
    try {
      const result = await fn(...args);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      throw error;
    } finally {
      transaction.finish();
    }
  }) as T;
}

/**
 * Usage Guide:
 *
 * 1. Setup:
 *    - Add EXPO_PUBLIC_SENTRY_DSN to .env
 *    - Install @sentry/react-native
 *    - Call initSentry() in index.js
 *
 * 2. User tracking:
 *    - Call setSentryUser() after login
 *    - Call clearSentryUser() on logout
 *
 * 3. Context:
 *    - Add context for better debugging
 *    - Use setSentryContext() before operations
 *
 * 4. Breadcrumbs:
 *    - Add breadcrumbs for important events
 *    - Helps understand error context
 *
 * 5. Performance:
 *    - Use startSentryTransaction() for tracking
 *    - Wrap critical functions with withSentryPerformance()
 *
 * 6. Privacy:
 *    - Don't send PII (sendDefaultPii: false)
 *    - Filter sensitive data in beforeSend
 *    - Remove sensitive headers/params
 */

export default Sentry;
