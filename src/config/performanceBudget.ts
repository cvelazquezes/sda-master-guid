/**
 * Performance Budget Configuration
 * 
 * Defines performance budgets based on best practices from:
 * - Google Web Vitals
 * - Meta (Facebook) Performance Guidelines
 * - Netflix Performance Budgets
 * - Airbnb Performance Standards
 */

/**
 * Performance Budget
 * All times in milliseconds unless otherwise noted
 */
export const PERFORMANCE_BUDGET = {
  // === Core Web Vitals (Google) ===
  
  /**
   * Time to Interactive (TTI)
   * Target: < 3000ms (3 seconds)
   * Critical: User can interact with the app
   */
  TTI: 3000,
  
  /**
   * First Contentful Paint (FCP)
   * Target: < 1000ms (1 second)
   * Important: User sees something on screen
   */
  FCP: 1000,
  
  /**
   * Largest Contentful Paint (LCP)
   * Target: < 2500ms (2.5 seconds)
   * Critical: Main content is visible
   */
  LCP: 2500,
  
  /**
   * First Input Delay (FID)
   * Target: < 100ms
   * Critical: App responds to first user interaction
   */
  FID: 100,
  
  /**
   * Cumulative Layout Shift (CLS)
   * Target: < 0.1
   * Important: Visual stability
   */
  CLS: 0.1,
  
  // === Bundle Size (Meta/Netflix standards) ===
  
  /**
   * Total JavaScript bundle size
   * Target: < 5MB for main bundle
   * Good: < 3MB
   * Excellent: < 1MB
   */
  BUNDLE_SIZE_TOTAL: 5 * 1024 * 1024, // 5MB in bytes
  
  /**
   * Per-route bundle size
   * Target: < 500KB per lazy-loaded route
   */
  BUNDLE_SIZE_PER_ROUTE: 500 * 1024, // 500KB in bytes
  
  /**
   * Vendor bundle size (node_modules)
   * Target: < 2MB
   */
  BUNDLE_SIZE_VENDOR: 2 * 1024 * 1024, // 2MB in bytes
  
  // === Asset Budgets ===
  
  /**
   * Image size per file
   * Target: < 200KB per image
   * Use compression and WebP format
   */
  IMAGE_SIZE: 200 * 1024, // 200KB in bytes
  
  /**
   * Font size per file
   * Target: < 100KB per font file
   */
  FONT_SIZE: 100 * 1024, // 100KB in bytes
  
  // === API Performance ===
  
  /**
   * API response time
   * Target: < 500ms for most endpoints
   * Critical: < 1000ms max
   */
  API_RESPONSE_TIME: 500,
  API_RESPONSE_TIME_MAX: 1000,
  
  /**
   * GraphQL query time
   * Target: < 300ms
   */
  GRAPHQL_QUERY_TIME: 300,
  
  // === React Native Specific ===
  
  /**
   * Screen navigation time
   * Target: < 300ms (60 FPS = 16.67ms per frame)
   */
  SCREEN_NAVIGATION_TIME: 300,
  
  /**
   * List scroll performance (FPS)
   * Target: > 55 FPS
   * Excellent: 60 FPS
   */
  LIST_SCROLL_FPS: 55,
  
  /**
   * Component render time
   * Target: < 16ms (60 FPS)
   * Max: < 33ms (30 FPS minimum)
   */
  COMPONENT_RENDER_TIME: 16,
  COMPONENT_RENDER_TIME_MAX: 33,
  
  // === Memory Budgets ===
  
  /**
   * JavaScript heap size
   * Target: < 50MB
   * Max: < 100MB
   */
  JS_HEAP_SIZE: 50 * 1024 * 1024, // 50MB in bytes
  JS_HEAP_SIZE_MAX: 100 * 1024 * 1024, // 100MB in bytes
  
  /**
   * Memory per screen
   * Target: < 10MB per screen
   */
  MEMORY_PER_SCREEN: 10 * 1024 * 1024, // 10MB in bytes
  
  // === Network Budgets ===
  
  /**
   * Number of HTTP requests per page
   * Target: < 50 requests
   */
  HTTP_REQUESTS_PER_PAGE: 50,
  
  /**
   * WebSocket message size
   * Target: < 50KB per message
   */
  WEBSOCKET_MESSAGE_SIZE: 50 * 1024, // 50KB in bytes
} as const;

/**
 * Performance Thresholds
 * Used for monitoring and alerting
 */
export const PERFORMANCE_THRESHOLDS = {
  // Green: Good performance
  GOOD: {
    TTI: 2000,
    FCP: 800,
    LCP: 2000,
    FID: 50,
    CLS: 0.05,
  },
  
  // Yellow: Needs improvement
  NEEDS_IMPROVEMENT: {
    TTI: 3000,
    FCP: 1000,
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
  },
  
  // Red: Poor performance
  POOR: {
    TTI: 5000,
    FCP: 1500,
    LCP: 4000,
    FID: 300,
    CLS: 0.25,
  },
} as const;

/**
 * Checks if a metric is within budget
 */
export function isWithinBudget(
  metric: keyof typeof PERFORMANCE_BUDGET,
  value: number
): boolean {
  return value <= PERFORMANCE_BUDGET[metric];
}

/**
 * Gets performance level for a metric
 */
export function getPerformanceLevel(
  metric: keyof typeof PERFORMANCE_THRESHOLDS.GOOD,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= PERFORMANCE_THRESHOLDS.GOOD[metric]) {
    return 'good';
  }
  if (value <= PERFORMANCE_THRESHOLDS.NEEDS_IMPROVEMENT[metric]) {
    return 'needs-improvement';
  }
  return 'poor';
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Formats time in human-readable format
 */
export function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(0)} ms`;
  }
  return `${(ms / 1000).toFixed(2)} s`;
}

/**
 * Performance Budget Validator
 */
export class PerformanceBudgetValidator {
  private violations: Array<{
    metric: string;
    value: number;
    budget: number;
    severity: 'warning' | 'error';
  }> = [];

  /**
   * Validates a performance metric
   */
  validate(
    metric: keyof typeof PERFORMANCE_BUDGET,
    value: number,
    severity: 'warning' | 'error' = 'warning'
  ): void {
    if (!isWithinBudget(metric, value)) {
      this.violations.push({
        metric,
        value,
        budget: PERFORMANCE_BUDGET[metric],
        severity,
      });
    }
  }

  /**
   * Gets all violations
   */
  getViolations(): typeof this.violations {
    return this.violations;
  }

  /**
   * Checks if there are any violations
   */
  hasViolations(): boolean {
    return this.violations.length > 0;
  }

  /**
   * Gets formatted violation report
   */
  getReport(): string {
    if (!this.hasViolations()) {
      return '✅ All performance budgets met!';
    }

    let report = '⚠️ Performance Budget Violations:\n\n';
    
    for (const violation of this.violations) {
      const icon = violation.severity === 'error' ? '❌' : '⚠️';
      report += `${icon} ${violation.metric}\n`;
      report += `   Value: ${formatFileSize(violation.value)} or ${formatTime(violation.value)}\n`;
      report += `   Budget: ${formatFileSize(violation.budget)} or ${formatTime(violation.budget)}\n`;
      report += `   Severity: ${violation.severity}\n\n`;
    }

    return report;
  }

  /**
   * Clears all violations
   */
  clear(): void {
    this.violations = [];
  }
}

/**
 * Usage Examples:
 * 
 * ```typescript
 * import { PERFORMANCE_BUDGET, PerformanceBudgetValidator } from './config/performanceBudget';
 * 
 * // Check if bundle size is within budget
 * const bundleSize = 4 * 1024 * 1024; // 4MB
 * if (bundleSize > PERFORMANCE_BUDGET.BUNDLE_SIZE_TOTAL) {
 *   console.warn('Bundle size exceeds budget!');
 * }
 * 
 * // Validate multiple metrics
 * const validator = new PerformanceBudgetValidator();
 * validator.validate('TTI', 3500, 'error');
 * validator.validate('BUNDLE_SIZE_TOTAL', 6 * 1024 * 1024, 'error');
 * 
 * if (validator.hasViolations()) {
 *   console.log(validator.getReport());
 *   process.exit(1); // Fail CI/CD
 * }
 * ```
 */

