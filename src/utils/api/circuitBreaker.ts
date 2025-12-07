/**
 * Circuit Breaker Pattern
 * Prevents cascading failures by failing fast when service is down
 */

import { logger } from '../logger';
import { CIRCUIT_BREAKER } from '../../shared/constants/validation';
import {
  LOG_MESSAGES,
  ERROR_MESSAGES,
  CIRCUIT_STATE,
  CIRCUIT_BREAKER_SERVICE,
} from '../../shared/constants';

export enum CircuitState {
  CLOSED = CIRCUIT_STATE.CLOSED, // Normal operation
  OPEN = CIRCUIT_STATE.OPEN, // Failing, reject requests
  HALF_OPEN = CIRCUIT_STATE.HALF_OPEN, // Testing if service recovered
}

interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  halfOpenMaxCalls: number;
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: CIRCUIT_BREAKER.FAILURE_THRESHOLD,
  successThreshold: CIRCUIT_BREAKER.SUCCESS_THRESHOLD,
  timeout: CIRCUIT_BREAKER.TIMEOUT_MS,
  halfOpenMaxCalls: CIRCUIT_BREAKER.HALF_OPEN_MAX_CALLS,
};

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();
  private halfOpenCalls = 0;
  private options: CircuitBreakerOptions;

  constructor(
    private name: string,
    options: Partial<CircuitBreakerOptions> = {}
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Executes function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error(ERROR_MESSAGES.CIRCUIT_BREAKER.IS_OPEN(this.name));
      }
      // Transition to half-open
      this.transitionToHalfOpen();
    }

    // Check half-open call limit
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.halfOpenCalls >= this.options.halfOpenMaxCalls) {
        throw new Error(ERROR_MESSAGES.CIRCUIT_BREAKER.HALF_OPEN_LIMIT(this.name));
      }
      this.halfOpenCalls++;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handles successful execution
   */
  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.transitionToClosed();
      }
    }
  }

  /**
   * Handles failed execution
   */
  private onFailure(): void {
    this.failureCount++;
    this.successCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionToOpen();
    } else if (this.failureCount >= this.options.failureThreshold) {
      this.transitionToOpen();
    }
  }

  /**
   * Transitions to CLOSED state
   */
  private transitionToClosed(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenCalls = 0;
    logger.info(LOG_MESSAGES.FORMATTED.CIRCUIT_CLOSED(this.name));
  }

  /**
   * Transitions to OPEN state
   */
  private transitionToOpen(): void {
    this.state = CircuitState.OPEN;
    this.nextAttempt = Date.now() + this.options.timeout;
    this.halfOpenCalls = 0;
    logger.warn(LOG_MESSAGES.FORMATTED.CIRCUIT_OPENED(this.name));
  }

  /**
   * Transitions to HALF_OPEN state
   */
  private transitionToHalfOpen(): void {
    this.state = CircuitState.HALF_OPEN;
    this.successCount = 0;
    this.halfOpenCalls = 0;
    logger.info(LOG_MESSAGES.FORMATTED.CIRCUIT_HALF_OPEN(this.name));
  }

  /**
   * Gets current circuit state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Gets circuit stats
   */
  getStats(): {
    state: CircuitState;
    failureCount: number;
    successCount: number;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
    };
  }

  /**
   * Manually resets the circuit breaker
   */
  reset(): void {
    this.transitionToClosed();
  }
}

// Global circuit breakers for different services
export const apiCircuitBreaker = new CircuitBreaker(CIRCUIT_BREAKER_SERVICE.API);
export const authCircuitBreaker = new CircuitBreaker(CIRCUIT_BREAKER_SERVICE.AUTH);
