/**
 * Health Check Service
 * Monitors application and dependency health following Kubernetes/Google SRE patterns
 */

import packageJson from '../../../package.json';
import {
  LOG_MESSAGES,
  HEALTH_STATUS,
  HEALTH_CHECK_NAME,
  API_ENDPOINTS,
} from '../../shared/constants';
import { HTTP_METHOD } from '../../shared/constants/http';
import { MATH } from '../../shared/constants/numbers';
import { RETRY, TIMEOUT } from '../../shared/constants/timing';
import { logger } from '../../shared/utils/logger';
import { environment } from '../config/environment';

// ============================================================================
// Types
// ============================================================================

export type HealthCheckFunction = () => Promise<boolean>;

/** Derived type from HEALTH_STATUS constant */
type HealthStatusValue = (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS];

export type HealthCheckResult = {
  name: string;
  status: HealthStatusValue;
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
  lastChecked: string;
};

export type HealthStatus = {
  status: HealthStatusValue;
  timestamp: string;
  checks: HealthCheckResult[];
  uptime: number;
  version: string;
};

// ============================================================================
// Health Check Service
// ============================================================================

class HealthCheckService {
  private _dependencies: Map<string, HealthCheckFunction> = new Map<string, HealthCheckFunction>();
  private _lastResults: Map<string, HealthCheckResult> = new Map<string, HealthCheckResult>();
  private _startTime: number = Date.now();

  /**
   * Registers a dependency health check
   */
  register(name: string, check: HealthCheckFunction): void {
    if (this._dependencies.has(name)) {
      logger.warn(LOG_MESSAGES.HEALTH_CHECK.ALREADY_REGISTERED(name));
    }

    this._dependencies.set(name, check);
    logger.debug(LOG_MESSAGES.HEALTH_CHECK.REGISTERED(name));
  }

  /**
   * Unregisters a health check
   */
  unregister(name: string): void {
    this._dependencies.delete(name);
    this._lastResults.delete(name);
    logger.debug(LOG_MESSAGES.HEALTH_CHECK.UNREGISTERED(name));
  }

  /**
   * Performs all health checks
   */
  async checkHealth(): Promise<HealthStatus> {
    const checks = Array.from(this._dependencies.entries());

    const results = await Promise.all(
      checks.map(([name, check]) => this._executeCheck(name, check))
    );

    // Store results for quick access
    results.forEach((result) => {
      this._lastResults.set(result.name, result);
    });

    // Determine overall status
    const allHealthy = results.every((r) => r.isHealthy);
    const someUnhealthy = results.some((r) => !r.isHealthy);

    let status: HealthStatusValue;
    if (allHealthy) {
      status = HEALTH_STATUS.HEALTHY;
    } else if (someUnhealthy && !allHealthy) {
      status = HEALTH_STATUS.DEGRADED;
    } else {
      status = HEALTH_STATUS.UNHEALTHY;
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      checks: results,
      uptime: Date.now() - this._startTime,
      version: packageJson.version,
    };
  }

  /**
   * Executes a single health check
   */
  private async _executeCheck(
    name: string,
    check: HealthCheckFunction
  ): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const isHealthy = await Promise.race([
        check(),
        this._timeout(TIMEOUT.ALERT), // 5 second timeout
      ]);

      const responseTime = Date.now() - startTime;

      return {
        name,
        status: isHealthy ? HEALTH_STATUS.HEALTHY : HEALTH_STATUS.UNHEALTHY,
        isHealthy,
        responseTime,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      logger.error(LOG_MESSAGES.HEALTH_CHECK.CHECK_FAILED(name), error as Error);

      return {
        name,
        status: HEALTH_STATUS.UNHEALTHY,
        isHealthy: false,
        responseTime,
        error: (error as Error).message,
        lastChecked: new Date().toISOString(),
      };
    }
  }

  /**
   * Gets the last known health status without running checks
   */
  getLastStatus(): HealthStatus {
    const results = Array.from(this._lastResults.values());

    if (results.length === 0) {
      return {
        status: HEALTH_STATUS.HEALTHY,
        timestamp: new Date().toISOString(),
        checks: [],
        uptime: Date.now() - this._startTime,
        version: packageJson.version,
      };
    }

    const allHealthy = results.every((r) => r.isHealthy);
    const someUnhealthy = results.some((r) => !r.isHealthy);

    return {
      status: allHealthy
        ? HEALTH_STATUS.HEALTHY
        : someUnhealthy
          ? HEALTH_STATUS.DEGRADED
          : HEALTH_STATUS.UNHEALTHY,
      timestamp: new Date().toISOString(),
      checks: results,
      uptime: Date.now() - this._startTime,
      version: packageJson.version,
    };
  }

  /**
   * Checks if application is ready to serve traffic
   */
  async checkReadiness(): Promise<boolean> {
    const health = await this.checkHealth();
    return health.status === HEALTH_STATUS.HEALTHY || health.status === HEALTH_STATUS.DEGRADED;
  }

  /**
   * Checks if application is alive (basic liveness probe)
   */
  async checkLiveness(): Promise<boolean> {
    // Basic check - if we can execute this, we're alive
    return true;
  }

  /**
   * Gets status of a specific dependency
   */
  async checkDependency(name: string): Promise<HealthCheckResult | null> {
    const check = this._dependencies.get(name);

    if (!check) {
      return null;
    }

    return await this._executeCheck(name, check);
  }

  /**
   * Helper to create timeout promise
   */
  private _timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(LOG_MESSAGES.HEALTH_CHECK.TIMEOUT)), ms);
    });
  }

  /**
   * Gets uptime in milliseconds
   */
  getUptime(): number {
    return Date.now() - this._startTime;
  }

  /**
   * Resets the service (for testing)
   */
  reset(): void {
    this._dependencies.clear();
    this._lastResults.clear();
    this._startTime = Date.now();
  }
}

// ============================================================================
// Global Instance
// ============================================================================

export const healthCheckService = new HealthCheckService();

// ============================================================================
// Default Health Checks
// ============================================================================

/**
 * Registers default health checks
 */
export function registerDefaultHealthChecks(): void {
  // API health check
  healthCheckService.register(HEALTH_CHECK_NAME.API, async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT.TOAST);
      const response = await fetch(`${environment.api.base}${API_ENDPOINTS.HEALTH.CHECK}`, {
        method: HTTP_METHOD.GET,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  });

  // Memory health check (React Native)
  healthCheckService.register(HEALTH_CHECK_NAME.MEMORY, async () => {
    try {
      // Basic memory check - if we can allocate, we're okay
      const testArray = new Array(MATH.THOUSAND);
      testArray.fill(0);
      return true;
    } catch {
      return false;
    }
  });

  // Environment configuration check
  healthCheckService.register(HEALTH_CHECK_NAME.CONFIG, async () => {
    try {
      // Verify critical config is present
      return !!(environment.api.base && environment.api.websocket && environment.name);
    } catch {
      return false;
    }
  });

  logger.info(LOG_MESSAGES.HEALTH.CHECKS_REGISTERED);
}

// ============================================================================
// Health Check Utilities
// ============================================================================

/**
 * Creates a simple HTTP health check
 */
export function createHttpHealthCheck(
  url: string,
  timeoutMs: number = TIMEOUT.TOAST
): HealthCheckFunction {
  return async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        method: HTTP_METHOD.GET,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  };
}

/**
 * Creates a custom health check with retry
 */
export function createHealthCheckWithRetry(
  check: HealthCheckFunction,
  maxRetries: number = MATH.HALF
): HealthCheckFunction {
  return async () => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        // eslint-disable-next-line no-await-in-loop -- Sequential health check retries require awaiting each attempt
        const result = await check();
        if (result) {
          return true;
        }

        if (i < maxRetries) {
          // eslint-disable-next-line no-await-in-loop -- Intentional delay between retry attempts
          await new Promise((resolve) => {
            setTimeout(resolve, RETRY.FIRST);
          });
        }
      } catch {
        if (i === maxRetries) {
          return false;
        }
      }
    }
    return false;
  };
}

// Auto-register default checks
if (environment.api.base) {
  registerDefaultHealthChecks();
}
