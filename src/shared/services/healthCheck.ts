/**
 * Health Check Service
 * Monitors application and dependency health following Kubernetes/Google SRE patterns
 */

import { logger } from '../utils/logger';
import { environment } from '../config/environment';

// ============================================================================
// Types
// ============================================================================

export type HealthCheckFunction = () => Promise<boolean>;

export interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'unhealthy';
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
  lastChecked: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: HealthCheckResult[];
  uptime: number;
  version: string;
}

// ============================================================================
// Health Check Service
// ============================================================================

class HealthCheckService {
  private dependencies = new Map<string, HealthCheckFunction>();
  private lastResults = new Map<string, HealthCheckResult>();
  private startTime = Date.now();

  /**
   * Registers a dependency health check
   */
  register(name: string, check: HealthCheckFunction): void {
    if (this.dependencies.has(name)) {
      logger.warn(`Health check ${name} already registered, overwriting`);
    }
    
    this.dependencies.set(name, check);
    logger.debug(`Registered health check: ${name}`);
  }

  /**
   * Unregisters a health check
   */
  unregister(name: string): void {
    this.dependencies.delete(name);
    this.lastResults.delete(name);
    logger.debug(`Unregistered health check: ${name}`);
  }

  /**
   * Performs all health checks
   */
  async checkHealth(): Promise<HealthStatus> {
    const checks = Array.from(this.dependencies.entries());
    
    const results = await Promise.all(
      checks.map(([name, check]) => this.executeCheck(name, check))
    );

    // Store results for quick access
    results.forEach((result) => {
      this.lastResults.set(result.name, result);
    });

    // Determine overall status
    const allHealthy = results.every((r) => r.isHealthy);
    const someUnhealthy = results.some((r) => !r.isHealthy);
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (allHealthy) {
      status = 'healthy';
    } else if (someUnhealthy && !allHealthy) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      checks: results,
      uptime: Date.now() - this.startTime,
      version: require('../../../package.json').version,
    };
  }

  /**
   * Executes a single health check
   */
  private async executeCheck(
    name: string,
    check: HealthCheckFunction
  ): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const isHealthy = await Promise.race([
        check(),
        this.timeout(5000), // 5 second timeout
      ]);
      
      const responseTime = Date.now() - startTime;

      return {
        name,
        status: isHealthy ? 'healthy' : 'unhealthy',
        isHealthy,
        responseTime,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      logger.error(`Health check failed: ${name}`, error as Error);
      
      return {
        name,
        status: 'unhealthy',
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
    const results = Array.from(this.lastResults.values());
    
    if (results.length === 0) {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: [],
        uptime: Date.now() - this.startTime,
        version: require('../../../package.json').version,
      };
    }

    const allHealthy = results.every((r) => r.isHealthy);
    const someUnhealthy = results.some((r) => !r.isHealthy);
    
    return {
      status: allHealthy ? 'healthy' : someUnhealthy ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: results,
      uptime: Date.now() - this.startTime,
      version: require('../../../package.json').version,
    };
  }

  /**
   * Checks if application is ready to serve traffic
   */
  async checkReadiness(): Promise<boolean> {
    const health = await this.checkHealth();
    return health.status === 'healthy' || health.status === 'degraded';
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
    const check = this.dependencies.get(name);
    
    if (!check) {
      return null;
    }

    return await this.executeCheck(name, check);
  }

  /**
   * Helper to create timeout promise
   */
  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Health check timeout')), ms);
    });
  }

  /**
   * Gets uptime in milliseconds
   */
  getUptime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Resets the service (for testing)
   */
  reset(): void {
    this.dependencies.clear();
    this.lastResults.clear();
    this.startTime = Date.now();
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
  healthCheckService.register('api', async () => {
    try {
      const response = await fetch(`${environment.apiUrl}/health`, {
        method: 'GET',
        timeout: 3000,
      } as any);
      return response.ok;
    } catch {
      return false;
    }
  });

  // Memory health check (React Native)
  healthCheckService.register('memory', async () => {
    try {
      // Basic memory check - if we can allocate, we're okay
      const testArray = new Array(1000);
      testArray.fill(0);
      return true;
    } catch {
      return false;
    }
  });

  // Environment configuration check
  healthCheckService.register('config', async () => {
    try {
      // Verify critical config is present
      return !!(
        environment.apiUrl &&
        environment.wsUrl &&
        environment.env
      );
    } catch {
      return false;
    }
  });

  logger.info('Default health checks registered');
}

// ============================================================================
// Health Check Utilities
// ============================================================================

/**
 * Creates a simple HTTP health check
 */
export function createHttpHealthCheck(
  url: string,
  timeoutMs: number = 3000
): HealthCheckFunction {
  return async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        method: 'GET',
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
  maxRetries: number = 2
): HealthCheckFunction {
  return async () => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await check();
        if (result) return true;
        
        if (i < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch {
        if (i === maxRetries) return false;
      }
    }
    return false;
  };
}

// Auto-register default checks
if (environment.apiUrl) {
  registerDefaultHealthChecks();
}

