/**
 * Sentry Error Tracking & Performance Monitoring
 * Implements comprehensive error tracking following Google SRE practices
 */

import * as Sentry from '@sentry/react-native';
import { environment, isDevelopment, isProduction } from '../config/environment';
import { logger } from '../../shared/utils/logger';
import { MS, OPACITY_VALUE } from '../../shared/constants/numbers';
import packageJson from '../../../package.json';
import {
  LOG_MESSAGES,
  HEADER,
  SENTRY_LEVEL,
  SENTRY_OP,
  SENTRY_CATEGORY,
  SENTRY_TAG,
  SENTRY_TAG_VALUE,
  SECURITY_EVENT,
  SENTRY_DIST,
  SENTRY_RELEASE_PREFIX,
} from '../../shared/constants';

// Sentry configuration constants
const SENTRY_CONFIG = {
  PRODUCTION_SAMPLE_RATE: OPACITY_VALUE.LIGHT_MEDIUM, // 0.2
  SESSION_TRACKING_INTERVAL_MS: 30000, // 30 seconds in ms
} as const;

// ============================================================================
// Sentry Initialization
// ============================================================================

let isInitialized = false;

/**
 * Initialize Sentry with proper configuration
 */
export function initializeSentry(): void {
  // Check if Sentry config exists in environment
  const sentryConfig = (environment as Record<string, unknown>).sentry as { enabled?: boolean; dsn?: string } | undefined;
  if (!sentryConfig?.enabled || !sentryConfig?.dsn) {
    logger.info(LOG_MESSAGES.SENTRY.DISABLED);
    return;
  }

  if (isInitialized) {
    logger.warn(LOG_MESSAGES.SENTRY.ALREADY_INITIALIZED);
    return;
  }

  try {
    Sentry.init({
      dsn: sentryConfig.dsn,
      environment: environment.name,

      // Performance Monitoring
      tracesSampleRate: isProduction() ? SENTRY_CONFIG.PRODUCTION_SAMPLE_RATE : OPACITY_VALUE.FULL,
      enableTracing: true,

      // Release tracking
      release: `${SENTRY_RELEASE_PREFIX}${packageJson.version}`,
      dist: SENTRY_DIST,

      // Filter sensitive data
      beforeSend(event) {
        // Remove sensitive headers
        if (event.request?.headers) {
          delete event.request.headers[HEADER.AUTHORIZATION];
          delete event.request.headers[HEADER.COOKIE];
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
        if (breadcrumb.category === SENTRY_CATEGORY.NAVIGATION && breadcrumb.data) {
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

      // Integrations (Sentry SDK 8.x compatible)
      integrations: [
        Sentry.reactNativeTracingIntegration({
          routingInstrumentation: Sentry.reactNavigationIntegration(),
          enableAppStartTracking: true,
          enableNativeFramesTracking: true,
          enableStallTracking: true,
        }),
      ],

      // Debug mode in development
      debug: isDevelopment(),

      // Attach stack traces
      attachStacktrace: true,
    });

    isInitialized = true;
    logger.info(LOG_MESSAGES.SENTRY.INITIALIZED);
  } catch (error) {
    logger.error(LOG_MESSAGES.SENTRY.INIT_FAILED, error as Error);
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
    logger.error(LOG_MESSAGES.SENTRY.NOT_INITIALIZED, error);
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
  level: Sentry.SeverityLevel = SENTRY_LEVEL.INFO as Sentry.SeverityLevel,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): void {
  if (!isInitialized) {
    logger.info(LOG_MESSAGES.SENTRY.MESSAGE(message));
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
 * Tracks performance of an async operation (Sentry SDK 8.x compatible)
 */
export async function trackPerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  if (!isInitialized) {
    return await fn();
  }

  return Sentry.startSpan(
    { name: operation, op: SENTRY_OP.PERFORMANCE, attributes: metadata },
    async () => {
      return await fn();
    }
  );
}

/**
 * Creates a manual span for fine-grained performance tracking (Sentry SDK 8.x compatible)
 */
export async function createSpan<T>(
  name: string,
  operation: string,
  callback: () => Promise<T>
): Promise<T> {
  if (!isInitialized) {
    return await callback();
  }

  return Sentry.startSpan({ name, op: operation }, async () => {
    return await callback();
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
  level: Sentry.SeverityLevel = SENTRY_LEVEL.INFO as Sentry.SeverityLevel,
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
  LOGIN_ATTEMPT = SECURITY_EVENT.LOGIN_ATTEMPT,
  LOGIN_SUCCESS = SECURITY_EVENT.LOGIN_SUCCESS,
  LOGIN_FAILURE = SECURITY_EVENT.LOGIN_FAILURE,
  LOGOUT = SECURITY_EVENT.LOGOUT,
  UNAUTHORIZED_ACCESS = SECURITY_EVENT.UNAUTHORIZED_ACCESS,
  PERMISSION_DENIED = SECURITY_EVENT.PERMISSION_DENIED,
  SUSPICIOUS_ACTIVITY = SECURITY_EVENT.SUSPICIOUS_ACTIVITY,
  TOKEN_REFRESH = SECURITY_EVENT.TOKEN_REFRESH,
  TOKEN_EXPIRED = SECURITY_EVENT.TOKEN_EXPIRED,
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
    LOG_MESSAGES.SENTRY.SECURITY_EVENT(event),
    SENTRY_CATEGORY.SECURITY,
    metadata.success === false
      ? (SENTRY_LEVEL.WARNING as Sentry.SeverityLevel)
      : (SENTRY_LEVEL.INFO as Sentry.SeverityLevel),
    metadata
  );

  // Capture failed auth attempts as errors
  if (event === SecurityEvent.LOGIN_FAILURE || event === SecurityEvent.UNAUTHORIZED_ACCESS) {
    captureMessage(
      LOG_MESSAGES.SENTRY.SECURITY_EVENT_CAPTURED(event),
      SENTRY_LEVEL.WARNING as Sentry.SeverityLevel,
      {
        tags: {
          [SENTRY_TAG.EVENT_TYPE]: event,
          [SENTRY_TAG.SECURITY]: SENTRY_TAG_VALUE.TRUE,
        },
        extra: metadata,
      }
    );
  }

  // Log locally
  logger.log(SENTRY_CATEGORY.SECURITY, event, metadata);
}

// ============================================================================
// Exports
// ============================================================================

export { Sentry, isInitialized as isSentryInitialized, initializeSentry };
