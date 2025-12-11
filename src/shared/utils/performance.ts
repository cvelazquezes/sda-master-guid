/**
 * Performance Utilities
 *
 * Utilities for optimizing performance including debouncing, throttling,
 * and memoization helpers.
 *
 * Based on best practices from:
 * - Lodash
 * - Underscore.js
 * - React documentation
 */

/**
 * Debounces a function, delaying its execution until after a wait period
 * has elapsed since the last time it was invoked.
 *
 * Perfect for search inputs, resize handlers, etc.
 *
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait before executing
 * @param options - Configuration options
 * @returns Debounced function
 *
 * @example
 * ```typescript
 * const searchAPI = debounce((query: string) => {
 *   fetch(`/api/search?q=${query}`);
 * }, 300);
 *
 * // Called once after user stops typing for 300ms
 * searchAPI('hello');
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  const { leading = false, trailing = true, maxWait } = options;

  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  const context: { value: unknown } = { value: null };
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs ?? ([] as unknown as Parameters<T>);
    const thisArg = context.value;

    lastArgs = null;
    context.value = null;
    lastInvokeTime = time;
    return func.apply(thisArg, args);
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired(): ReturnType<T> | undefined {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    const maxWaitTime = maxWait !== undefined ? maxWait - timeSinceLastInvoke : Infinity;
    return Math.min(timeWaiting, maxWaitTime);
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : undefined;
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timeoutId = null;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    context.value = null;
    return undefined;
  }

  function cancel(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastCallTime = null;
    context.value = null;
    timeoutId = null;
  }

  const debounced = function (this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    context.value = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, wait);
    }
  };

  debounced.cancel = cancel;
  return debounced;
}

/**
 * Throttles a function, ensuring it's only called at most once per time period.
 *
 * Perfect for scroll handlers, mouse move, etc.
 *
 * @param func - Function to throttle
 * @param wait - Milliseconds between function calls
 * @param options - Configuration options
 * @returns Throttled function
 *
 * @example
 * ```typescript
 * const onScroll = throttle(() => {
 *   console.log('Scrolled!');
 * }, 1000);
 *
 * // Called at most once per second, no matter how fast user scrolls
 * window.addEventListener('scroll', onScroll);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  const { leading = true, trailing = true } = options;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}

/**
 * Creates a function that delays invoking func until after delay milliseconds have elapsed
 *
 * @param func - Function to delay
 * @param delay - Milliseconds to delay
 * @returns Delayed function with cancel method
 *
 * @example
 * ```typescript
 * const delayedSave = delay(() => saveData(), 2000);
 * delayedSave(); // Will execute after 2 seconds
 * delayedSave.cancel(); // Cancel if needed
 * ```
 */
export function delay<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;

  function cancel(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function delayed(...args: Parameters<T>): void {
    cancel();
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  }

  delayed.cancel = cancel;
  return delayed;
}

/**
 * Memoizes a function, caching the result of function calls
 *
 * @param func - Function to memoize
 * @param resolver - Custom key resolver (optional)
 * @returns Memoized function with cache access
 *
 * @example
 * ```typescript
 * const expensive = memoize((n: number) => {
 *   // Expensive calculation
 *   return n * n;
 * });
 *
 * expensive(5); // Calculated
 * expensive(5); // Returned from cache
 * ```
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T & { cache: Map<string, ReturnType<T>>; clear: () => void } {
  const cache = new Map<string, ReturnType<T>>();

  function clear(): void {
    cache.clear();
  }

  function memoized(...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  memoized.clear = clear;

  return memoized as T & { cache: Map<string, ReturnType<T>>; clear: () => void };
}

/**
 * Creates a function that is restricted to invoking func once.
 * Repeat calls return the value of the first invocation.
 *
 * @param func - Function to restrict
 * @returns Function that can only be called once
 *
 * @example
 * ```typescript
 * const initialize = once(() => {
 *   console.log('Initialized!');
 *   return { status: 'ready' };
 * });
 *
 * initialize(); // Logs "Initialized!", returns { status: 'ready' }
 * initialize(); // Returns cached { status: 'ready' }, doesn't log
 * ```
 */
export function once<T extends (...args: unknown[]) => unknown>(func: T): T & { called: boolean } {
  let called = false;
  let result: ReturnType<T>;

  function onced(...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = func(...args);
    }
    return result;
  }

  Object.defineProperty(onced, 'called', {
    get: () => called,
    enumerable: true,
  });

  return onced as T & { called: boolean };
}

/**
 * Batches multiple synchronous calls into a single asynchronous execution
 *
 * @param func - Function to batch
 * @param wait - Milliseconds to wait before executing batch
 * @returns Batched function
 *
 * @example
 * ```typescript
 * const batchUpdate = batch((ids: string[]) => {
 *   api.updateMany(ids);
 * }, 100);
 *
 * batchUpdate(['1']);
 * batchUpdate(['2']);
 * batchUpdate(['3']);
 * // After 100ms, calls api.updateMany(['1', '2', '3'])
 * ```
 */
export function batch<T>(func: (items: T[]) => void, wait: number): (item: T) => void {
  let items: T[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  return function (item: T) {
    items.push(item);

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(items);
      items = [];
      timeoutId = null;
    }, wait);
  };
}

/**
 * Rate limiter - limits function calls to X per time period
 *
 * @param func - Function to rate limit
 * @param limit - Maximum calls per period
 * @param period - Time period in milliseconds
 * @returns Rate limited function
 *
 * @example
 * ```typescript
 * const rateLimitedAPI = rateLimit(callAPI, 10, 1000);
 * // Maximum 10 calls per second
 * ```
 */
export function rateLimit<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
  period: number
): T & { remaining: () => number } {
  const calls: number[] = [];

  function removeOldCalls(): void {
    const now = Date.now();
    const cutoff = now - period;
    while (calls.length > 0 && calls[0] < cutoff) {
      calls.shift();
    }
  }

  function remaining(): number {
    removeOldCalls();
    return Math.max(0, limit - calls.length);
  }

  function rateLimited(...args: Parameters<T>): ReturnType<T> | undefined {
    removeOldCalls();

    if (calls.length < limit) {
      calls.push(Date.now());
      return func(...args);
    }

    console.warn('Rate limit exceeded');
    return undefined;
  }

  Object.defineProperty(rateLimited, 'remaining', {
    value: remaining,
    writable: false,
  });

  return rateLimited as T & { remaining: () => number };
}

/**
 * Performance measurement utility
 *
 * @param label - Label for the measurement
 * @returns Object with mark and measure methods
 *
 * @example
 * ```typescript
 * const perf = performance('API Call');
 * perf.start();
 * await fetchData();
 * perf.end(); // Logs: "API Call: 123ms"
 * ```
 */
export function performanceMeasure(label: string): { start: () => void; end: () => number } {
  let startTime: number;

  return {
    start(): void {
      startTime = Date.now();
    },
    end(): number {
      const duration = Date.now() - startTime;
      console.info(`[Performance] ${label}: ${duration}ms`);
      return duration;
    },
  };
}
