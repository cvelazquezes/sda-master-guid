/**
 * Performance Utilities Tests
 */

import { debounce, throttle, memoize, once, batch, rateLimit } from '../performance';

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 1000);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass correct arguments', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 1000);

      debounced('arg1', 'arg2');

      jest.advanceTimersByTime(1000);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should cancel debounced function', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 1000);

      debounced();
      debounced.cancel();

      jest.advanceTimersByTime(1000);

      expect(fn).not.toHaveBeenCalled();
    });

    it('should support leading option', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 1000, { leading: true, trailing: false });

      debounced();
      expect(fn).toHaveBeenCalledTimes(1);

      debounced();
      debounced();

      jest.advanceTimersByTime(1000);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 1000);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);

      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass correct arguments', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 1000);

      throttled('arg1');

      expect(fn).toHaveBeenCalledWith('arg1');
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const fn = jest.fn((n: number) => n * 2);
      const memoized = memoize(fn);

      const result1 = memoized(5);
      const result2 = memoized(5);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should cache different arguments separately', () => {
      const fn = jest.fn((n: number) => n * 2);
      const memoized = memoize(fn);

      memoized(5);
      memoized(10);
      memoized(5);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should support custom resolver', () => {
      const fn = jest.fn((obj: { id: number }) => obj.id * 2);
      const memoized = memoize(fn, (obj) => String(obj.id));

      memoized({ id: 5 });
      memoized({ id: 5 });

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should allow clearing cache', () => {
      const fn = jest.fn((n: number) => n * 2);
      const memoized = memoize(fn);

      memoized(5);
      memoized.clear();
      memoized(5);

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('once', () => {
    it('should only call function once', () => {
      const fn = jest.fn(() => 'result');
      const onced = once(fn);

      const result1 = onced();
      const result2 = onced();
      const result3 = onced();

      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(result3).toBe('result');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments on first call', () => {
      const fn = jest.fn((a: number, b: number) => a + b);
      const onced = once(fn);

      onced(1, 2);
      onced(3, 4);

      expect(fn).toHaveBeenCalledWith(1, 2);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should set called property', () => {
      const fn = jest.fn();
      const onced = once(fn);

      expect(onced.called).toBe(false);
      onced();
      expect(onced.called).toBe(true);
    });
  });

  describe('batch', () => {
    it('should batch multiple calls', () => {
      const fn = jest.fn();
      const batched = batch(fn, 1000);

      batched('item1');
      batched('item2');
      batched('item3');

      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(fn).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('rateLimit', () => {
    it('should limit function calls', () => {
      const fn = jest.fn();
      const limited = rateLimit(fn, 2, 1000);

      limited();
      limited();
      limited(); // Should not execute

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should report remaining calls', () => {
      const fn = jest.fn();
      const limited = rateLimit(fn, 3, 1000);

      expect(limited.remaining()).toBe(3);

      limited();
      expect(limited.remaining()).toBe(2);

      limited();
      expect(limited.remaining()).toBe(1);

      limited();
      expect(limited.remaining()).toBe(0);
    });

    it('should reset after period', () => {
      const fn = jest.fn();
      const limited = rateLimit(fn, 2, 1000);

      limited();
      limited();

      jest.advanceTimersByTime(1000);

      limited();
      limited();

      expect(fn).toHaveBeenCalledTimes(4);
    });
  });
});
