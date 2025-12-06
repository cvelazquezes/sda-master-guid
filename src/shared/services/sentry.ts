/**
 * Sentry Error Tracking & Performance Monitoring
 * Implements comprehensive error tracking following Google SRE practices
 */

import * as Sentry from '@sentry/react-native';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';
import { MS, OPACITY_VALUE } from '../constants/numbers';

// Sentry configuration constants
const SENTRY_CONFIG = {
  PRODUCTION_SAMPLE_RATE: OPACITY_VALUE.LIGHT_MEDIUM, // 0.2
  SESSION_TRACKING_INTERVAL_MS: MS.THIRTY_SECONDS, // 30000
} as const;

// ============================================================================
// Sentry Initialization
// ============================================================================

let isInitialized = false;

/**
 * Initialize Sentry with proper configuration
 */
export function initializeSentry(): void {
  if (!environment.sentry.enabled || !environment.sentry.dsn) {
    logger.info('Sentry is disabled or DSN not configured');
    return;
  }

  if (isInitialized) {
    logger.warn('Sentry already initialized');
    return;
  }

  try {
    Sentry.init({
      dsn: environment.sentry.dsn,
      environment: environment.env,

      // Performance Monitoring
      tracesSampleRate:
        environment.env === 'production'
          ? SENTRY_CONFIG.PRODUCTION_SAMPLE_RATE
          : OPACITY_VALUE.FULL,
      enableTracing: true,

      // Release tracking
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      release: `sda-master-guid@${require('../../../package.json').version}`,
      dist: '1',

      // Filter sensitive data
      beforeSend(event) {
        // Remove sensitive headers
        if (event.request?.headers) {
          delete event.request.headers['Authorization'];
          delete event.request.headers['Cookie'];
        }

        // Remove sensitive cookies
        if (event.request?.cookies) {
          delete event.request.cookies;
        }

        // Sanitize user data
        if (event.user) {
          // Keep only non-sensitive fields
          event.user = {
            id: event.user.id,
            username: event.user.username,
          };
        }

        return event;
      },

      // Breadcrumb filtering
      beforeBreadcrumb(breadcrumb) {
        // Don't log sensitive navigation data
        if (breadcrumb.category === 'navigation' && breadcrumb.data) {
          const sanitized = { ...breadcrumb.data };
          delete sanitized.token;
          delete sanitized.password;
          breadcrumb.data = sanitized;
        }

        return breadcrumb;
      },

      // Enable automatic session tracking
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: SENTRY_CONFIG.SESSION_TRACKING_INTERVAL_MS,

      // Integrations
      integrations: [
        new Sentry.ReactNativeTracing({
          routingInstrumentation: Sentry.reactNavigationIntegration(),
          tracePropagationTargets: [
            'localhost',
            environment.apiUrl,
            /^https:\/\/api\.example\.com/,
          ],
        }),
      ],

      // Debug mode in development
      debug: environment.env === 'development',

      // Attach stack traces
      attachStacktrace: true,
    });

    isInitialized = true;
    logger.info('Sentry initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Sentry', error as Error);
  }
}

// ============================================================================
// Error Tracking
// ============================================================================

/**
 * Captures an exception with optional context
 */
export function captureError(
  error: Error,
  context?: {
    level?: Sentry.SeverityLevel;
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    user?: {
      id?: string;
      email?: string;
      username?: string;
    };
  }
): void {
  if (!isInitialized) {
    logger.error('Sentry not initialized, logging error locally', error);
    return;
  }

  Sentry.withScope((scope) => {
    // Set severity level
    if (context?.level) {
      scope.setLevel(context.level);
    }

    // Add tags
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Add extra context
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    // Set user context
    if (context?.user) {
      scope.setUser(context.user);
    }

    Sentry.captureException(error);
  });
}

/**
 * Captures a message with optional context
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): void {
  if (!isInitialized) {
    logger.info(`Sentry message: ${message}`);
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureMessage(message, level);
  });
}

// ============================================================================
// Performance Monitoring
// ============================================================================

/**
 * Tracks performance of an async operation
 */
export async function trackPerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  if (!isInitialized) {
    return await fn();
  }

  const transaction = Sentry.startTransaction({
    name: operation,
    op: 'performance',
    data: metadata,
  });

  try {
    const result = await fn();
    transaction.setStatus('ok');
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    throw error;
  } finally {
    transaction.finish();
  }
}

/**
 * Creates a manual span for fine-grained performance tracking
 */
export function createSpan(name: string, operation: string): Sentry.Span | undefined {
  if (!isInitialized) {
    return undefined;
  }

  const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
  if (!transaction) {
    return undefined;
  }

  return transaction.startChild({
    op: operation,
    description: name,
  });
}

// ============================================================================
// User Context
// ============================================================================

/**
 * Sets user context for error tracking
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  username?: string;
  role?: string;
}): void {
  if (!isInitialized) {
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });
}

/**
 * Clears user context
 */
export function clearUserContext(): void {
  if (!isInitialized) {
    return;
  }

  Sentry.setUser(null);
}

// ============================================================================
// Breadcrumbs
// ============================================================================

/**
 * Adds a breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, unknown>
): void {
  if (!isInitialized) {
    return;
  }

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / MS.SECOND,
  });
}

// ============================================================================
// Security Monitoring
// ============================================================================

export enum SecurityEvent {
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  PERMISSION_DENIED = 'permission_denied',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  TOKEN_REFRESH = 'token_refresh',
  TOKEN_EXPIRED = 'token_expired',
}

/**
 * Tracks security-related events
 */
export function trackSecurityEvent(
  event: SecurityEvent,
  metadata: {
    userId?: string;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    reason?: string;
  }
): void {
  // Add breadcrumb for debugging
  addBreadcrumb(
    `Security event: ${event}`,
    'security',
    metadata.success === false ? 'warning' : 'info',
    metadata
  );

  // Capture failed auth attempts as errors
  if (event === SecurityEvent.LOGIN_FAILURE || event === SecurityEvent.UNAUTHORIZED_ACCESS) {
    captureMessage(`Security Event: ${event}`, 'warning', {
      tags: {
        event_type: event,
        security: 'true',
      },
      extra: metadata,
    });
  }

  // Log locally
  logger.log('security', event, metadata);
}

// ============================================================================
// Exports
// ============================================================================

export { Sentry, isInitialized as isSentryInitialized };

// Initialize on import if configured
if (environment.sentry.enabled && environment.sentry.dsn) {
  initializeSentry();
}
