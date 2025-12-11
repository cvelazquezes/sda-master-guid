/**
 * Performance Monitoring Hooks
 * Following Google Web Vitals and React Native performance best practices
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { LOG_MESSAGES } from '../../shared/constants';
import { MS, MATH, OPACITY_VALUE, LIST_LIMITS, FPS } from '../../shared/constants/numbers';
import { logger } from '../../shared/utils/logger';

// Performance thresholds
const PERF_THRESHOLD = {
  TARGET_FPS: FPS.TARGET,
  LOW_FPS_WARNING: FPS.LOW_WARNING,
  MEMORY_WARNING_RATIO: OPACITY_VALUE.NEAR_FULL, // 0.9
  EXCESSIVE_RENDERS: LIST_LIMITS.MAX_DROPDOWN_ITEMS, // 50
} as const;

// ============================================================================
// Types
// ============================================================================

/**
 * Performance metrics
 */
export type PerformanceMetrics = {
  /** Time to interactive (ms) */
  tti: number;
  /** Component mount time (ms) */
  mountTime: number;
  /** Render count */
  renderCount: number;
  /** Last render time (ms) */
  lastRenderTime: number;
  /** Memory usage (bytes) */
  memoryUsage?: number;
};

/**
 * Performance budget thresholds
 */
export type PerformanceBudget = {
  /** Maximum time to interactive (ms) */
  maxTTI: number;
  /** Maximum mount time (ms) */
  maxMountTime: number;
  /** Maximum render time (ms) */
  maxRenderTime: number;
  /** Component name for logging */
  componentName: string;
};

/**
 * Performance measurement result
 */
export type PerformanceMeasurement = {
  /** Measurement name */
  name: string;
  /** Duration in milliseconds */
  duration: number;
  /** Timestamp when measurement started */
  startTime: number;
  /** Timestamp when measurement ended */
  endTime: number;
  /** Whether the measurement exceeded budget */
  exceeded: boolean;
  /** Budget threshold if applicable */
  budget?: number;
};

// ============================================================================
// Performance Monitor Hook
// ============================================================================

/**
 * Monitors component performance and reports violations
 *
 * @param componentName - Name of the component being monitored
 * @param budget - Performance budget thresholds
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const metrics = usePerformanceMonitor('MyComponent', {
 *     maxTTI: 3000,
 *     maxMountTime: 100,
 *     maxRenderTime: 16,
 *     componentName: 'MyComponent',
 *   });
 *
 *   return <View>...</View>;
 * };
 * ```
 */
export function usePerformanceMonitor(
  componentName: string,
  budget?: Partial<PerformanceBudget>
): PerformanceMetrics {
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  const lastRenderTimeRef = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    tti: 0,
    mountTime: 0,
    renderCount: 0,
    lastRenderTime: 0,
  });

  // Record mount time
  useEffect(() => {
    const startTime = performance.now();
    mountTimeRef.current = startTime;

    // Measure time to interactive
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      const tti = performance.now() - startTime;
      const mountTime = performance.now() - startTime;

      setMetrics((prev) => ({
        ...prev,
        tti,
        mountTime,
      }));

      // Check against budget
      if (budget?.maxTTI && tti > budget.maxTTI) {
        logger.warn(LOG_MESSAGES.PERFORMANCE.BUDGET_EXCEEDED_TTI, {
          component: componentName,
          tti,
          budget: budget.maxTTI,
          exceeded: tti - budget.maxTTI,
        });
      }

      if (budget?.maxMountTime && mountTime > budget.maxMountTime) {
        logger.warn(LOG_MESSAGES.PERFORMANCE.BUDGET_EXCEEDED_MOUNT, {
          component: componentName,
          mountTime,
          budget: budget.maxMountTime,
        });
      }
    });

    return () => {
      interactionHandle.cancel();
    };
  }, [componentName, budget]);

  // Track renders - intentionally runs on every render
  useEffect(() => {
    const renderStart = lastRenderTimeRef.current;
    const renderEnd = performance.now();
    const renderTime = renderStart > 0 ? renderEnd - renderStart : 0;

    renderCountRef.current += 1;

    setMetrics((prev) => ({
      ...prev,
      renderCount: renderCountRef.current,
      lastRenderTime: renderTime,
    }));

    // Check render time against budget
    if (budget?.maxRenderTime && renderTime > budget.maxRenderTime) {
      logger.warn(LOG_MESSAGES.PERFORMANCE.BUDGET_EXCEEDED_RENDER, {
        component: componentName,
        renderTime,
        budget: budget.maxRenderTime,
        renderCount: renderCountRef.current,
      });
    }

    // Record start time for next render
    lastRenderTimeRef.current = performance.now();
    // Intentionally no deps - this runs on every render to track performance
  }, [budget?.maxRenderTime, componentName]);

  return metrics;
}

// ============================================================================
// Performance Measurement Hook
// ============================================================================

/**
 * Measures performance of async operations
 *
 * @returns Measurement utilities
 *
 * @example
 * ```typescript
 * const { measure, measurements } = usePerformanceMeasure();
 *
 * const loadData = async () => {
 *   await measure('loadUsers', async () => {
 *     return await fetchUsers();
 *   }, { budget: 500 });
 * };
 * ```
 */
export function usePerformanceMeasure(): {
  measure: <T>(name: string, fn: () => Promise<T>, options?: { budget?: number }) => Promise<T>;
  measurements: PerformanceMeasurement[];
  clearMeasurements: () => void;
  getAverageDuration: (operationName: string) => number;
} {
  const [measurements, setMeasurements] = useState<PerformanceMeasurement[]>([]);

  const measure = useCallback(
    async <T>(name: string, fn: () => Promise<T>, options?: { budget?: number }): Promise<T> => {
      const startTime = performance.now();

      try {
        const result = await fn();
        const endTime = performance.now();
        const duration = endTime - startTime;
        const exceeded = options?.budget ? duration > options.budget : false;

        const measurement: PerformanceMeasurement = {
          name,
          duration,
          startTime,
          endTime,
          exceeded,
          budget: options?.budget,
        };

        setMeasurements((prev) => [...prev, measurement]);

        // Log if budget exceeded
        if (exceeded) {
          logger.warn(LOG_MESSAGES.PERFORMANCE.BUDGET_EXCEEDED, {
            operation: name,
            duration,
            budget: options?.budget,
            exceeded: duration - (options?.budget || 0),
          });
        } else {
          logger.debug(LOG_MESSAGES.PERFORMANCE.MEASUREMENT_RECORDED, {
            operation: name,
            duration,
          });
        }

        return result;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        logger.error(LOG_MESSAGES.PERFORMANCE.MEASUREMENT_FAILED, error as Error, {
          operation: name,
          duration,
        });

        throw error;
      }
    },
    []
  );

  const clearMeasurements = useCallback(() => {
    setMeasurements([]);
  }, []);

  const getAverageDuration = useCallback(
    (operationName: string): number => {
      const filtered = measurements.filter((m) => m.name === operationName);
      if (filtered.length === 0) {
        return 0;
      }

      const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
      return sum / filtered.length;
    },
    [measurements]
  );

  return {
    measure,
    measurements,
    clearMeasurements,
    getAverageDuration,
  };
}

// ============================================================================
// FPS Monitor Hook
// ============================================================================

/**
 * Monitors frames per second
 *
 * @param sampleInterval - Interval to sample FPS (ms)
 * @returns Current FPS
 *
 * @example
 * ```typescript
 * const fps = useFPSMonitor(1000);
 *
 * if (fps < 30) {
 *   console.warn('Low FPS detected:', fps);
 * }
 * ```
 */
export function useFPSMonitor(sampleInterval: number = MS.SECOND): number {
  const [fps, setFPS] = useState(PERF_THRESHOLD.TARGET_FPS);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;
    const measureFPS = (): void => {
      frameCountRef.current++;
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    const calculateFPS = (): void => {
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;
      const currentFPS = Math.round((frameCountRef.current * MS.SECOND) / elapsed);

      setFPS(currentFPS);

      // Warn if FPS is low
      if (currentFPS < PERF_THRESHOLD.LOW_FPS_WARNING) {
        logger.warn(LOG_MESSAGES.PERFORMANCE.LOW_FPS, {
          fps: currentFPS,
          target: PERF_THRESHOLD.TARGET_FPS,
        });
      }

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    };

    animationFrameId = requestAnimationFrame(measureFPS);
    const intervalId = setInterval(calculateFPS, sampleInterval);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, [sampleInterval]);

  return fps;
}

// ============================================================================
// Memory Monitor Hook
// ============================================================================

/**
 * Monitors memory usage (if available)
 *
 * @param interval - Interval to check memory (ms)
 * @returns Memory usage information
 *
 * @example
 * ```typescript
 * const memory = useMemoryMonitor(5000);
 *
 * if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
 *   console.warn('High memory usage');
 * }
 * ```
 */
export function useMemoryMonitor(interval: number = 5000): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null {
  const [memory, setMemory] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const checkMemory = (): void => {
      // @ts-expect-error - performance.memory is not standard but available in some environments
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (performance.memory) {
        // @ts-expect-error - performance.memory is not standard but available in some environments
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Non-standard API access
        const memoryInfo = performance.memory as {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };

        setMemory({
          usedJSHeapSize: memoryInfo.usedJSHeapSize,
          totalJSHeapSize: memoryInfo.totalJSHeapSize,
          jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
        });

        // Warn if using > 90% of heap
        if (
          memoryInfo.usedJSHeapSize >
          memoryInfo.jsHeapSizeLimit * PERF_THRESHOLD.MEMORY_WARNING_RATIO
        ) {
          logger.warn(LOG_MESSAGES.PERFORMANCE.HIGH_MEMORY, {
            used: memoryInfo.usedJSHeapSize,
            limit: memoryInfo.jsHeapSizeLimit,
            percentage: (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * MATH.HUNDRED,
          });
        }
      }
    };

    checkMemory();
    const intervalId = setInterval(checkMemory, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return memory;
}

// ============================================================================
// Render Optimization Hook
// ============================================================================

/**
 * Tracks unnecessary re-renders
 *
 * @param componentName - Name of component
 * @param props - Component props to track
 *
 * @example
 * ```typescript
 * const MyComponent = ({ user, onPress }) => {
 *   useRenderTracker('MyComponent', { user, onPress });
 *
 *   return <View>...</View>;
 * };
 * ```
 */
export function useRenderTracker<T extends Record<string, unknown>>(
  componentName: string,
  props: T
): void {
  const renderCount = useRef(0);
  const prevProps = useRef<T>(props);

  useEffect(() => {
    renderCount.current += 1;

    // On development, log re-renders with changed props
    if (__DEV__) {
      const changedProps: string[] = [];

      for (const key in props) {
        if (props[key] !== prevProps.current[key]) {
          changedProps.push(key);
        }
      }

      if (changedProps.length > 0) {
        logger.debug(LOG_MESSAGES.PERFORMANCE.COMPONENT_RERENDERED, {
          component: componentName,
          renderCount: renderCount.current,
          changedProps,
        });
      }

      // Warn if too many renders
      if (renderCount.current > PERF_THRESHOLD.EXCESSIVE_RENDERS) {
        logger.warn(LOG_MESSAGES.PERFORMANCE.EXCESSIVE_RERENDERS, {
          component: componentName,
          renderCount: renderCount.current,
        });
      }
    }

    prevProps.current = props;
  });
}

// ============================================================================
// Network Performance Hook
// ============================================================================

/**
 * Monitors network request performance
 *
 * @returns Network monitoring utilities
 *
 * @example
 * ```typescript
 * const { trackRequest, metrics } = useNetworkMonitor();
 *
 * const fetchData = async () => {
 *   await trackRequest('fetchUsers', async () => {
 *     return await api.get('/users');
 *   });
 * };
 * ```
 */
export function useNetworkMonitor(): {
  trackRequest: <T>(
    name: string,
    fn: () => Promise<T>,
    options?: { budget?: number }
  ) => Promise<T>;
  metrics: {
    requestCount: number;
    averageDuration: number;
    slowestRequest: string | null;
    slowestDuration: number;
  };
} {
  const [metrics, setMetrics] = useState<{
    requestCount: number;
    averageDuration: number;
    slowestRequest: string | null;
    slowestDuration: number;
  }>({
    requestCount: 0,
    averageDuration: 0,
    slowestRequest: null,
    slowestDuration: 0,
  });

  const durations = useRef<Array<{ name: string; duration: number }>>([]);

  const trackRequest = useCallback(
    async <T>(name: string, fn: () => Promise<T>, options?: { budget?: number }): Promise<T> => {
      const startTime = performance.now();

      try {
        const result = await fn();
        const duration = performance.now() - startTime;

        durations.current.push({ name, duration });

        // Update metrics
        const totalDuration = durations.current.reduce((sum, d) => sum + d.duration, 0);
        const avgDuration = totalDuration / durations.current.length;
        const slowest = durations.current.reduce((prev, current) =>
          current.duration > prev.duration ? current : prev
        );

        setMetrics({
          requestCount: durations.current.length,
          averageDuration: avgDuration,
          slowestRequest: slowest.name,
          slowestDuration: slowest.duration,
        });

        // Check budget
        if (options?.budget && duration > options.budget) {
          logger.warn(LOG_MESSAGES.PERFORMANCE.NETWORK_BUDGET_EXCEEDED, {
            request: name,
            duration,
            budget: options.budget,
            exceeded: duration - options.budget,
          });
        }

        return result;
      } catch (error) {
        logger.error(LOG_MESSAGES.PERFORMANCE.NETWORK_REQUEST_FAILED, error as Error, {
          request: name,
        });
        throw error;
      }
    },
    []
  );

  return {
    trackRequest,
    metrics,
  };
}

// ============================================================================
// Comprehensive Performance Report
// ============================================================================

/**
 * Generates a comprehensive performance report
 *
 * @param measurements - Array of performance measurements
 * @returns Performance report
 */
export function generatePerformanceReport(measurements: PerformanceMeasurement[]): {
  totalMeasurements: number;
  averageDuration: number;
  slowestOperation: string | null;
  slowestDuration: number;
  budgetViolations: number;
  violatedOperations: string[];
} {
  if (measurements.length === 0) {
    return {
      totalMeasurements: 0,
      averageDuration: 0,
      slowestOperation: null,
      slowestDuration: 0,
      budgetViolations: 0,
      violatedOperations: [],
    };
  }

  const totalDuration = measurements.reduce((sum, m) => sum + m.duration, 0);
  const averageDuration = totalDuration / measurements.length;

  const slowest = measurements.reduce((prev, current) =>
    current.duration > prev.duration ? current : prev
  );

  const violated = measurements.filter((m) => m.exceeded);

  return {
    totalMeasurements: measurements.length,
    averageDuration,
    slowestOperation: slowest.name,
    slowestDuration: slowest.duration,
    budgetViolations: violated.length,
    violatedOperations: violated.map((m) => m.name),
  };
}
