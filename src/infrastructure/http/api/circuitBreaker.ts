/**
 * Circuit Breaker Pattern
 * Prevents cascading failures by failing fast when service is down
 */

import {
  LOG_MESSAGES,
  ERROR_MESSAGES,
  CIRCUIT_STATE,
  CIRCUIT_BREAKER_SERVICE,
} from '../../../shared/constants';
import { CIRCUIT_BREAKER } from '../../../shared/constants/validation';
import { logger } from '../../../shared/utils/logger';

export enum CircuitState {
  CLOSED = CIRCUIT_STATE.CLOSED, // Normal operation
  OPEN = CIRCUIT_STATE.OPEN, // Failing, reject requests
  HALF_OPEN = CIRCUIT_STATE.HALF_OPEN, // Testing if service recovered
}

type CircuitBreakerOptions = {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  halfOpenMaxCalls: number;
};

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: CIRCUIT_BREAKER.FAILURE_THRESHOLD,
  successThreshold: CIRCUIT_BREAKER.SUCCESS_THRESHOLD,
  timeout: CIRCUIT_BREAKER.TIMEOUT_MS,
  halfOpenMaxCalls: CIRCUIT_BREAKER.HALF_OPEN_MAX_CALLS,
};

export class CircuitBreaker {
  private _state: CircuitState = CircuitState.CLOSED;
  private _failureCount: number = 0;
  private _successCount: number = 0;
  private _nextAttempt: number = Date.now();
  private _halfOpenCalls: number = 0;
  private _options: CircuitBreakerOptions;

  constructor(
    private _name: string,
    options: Partial<CircuitBreakerOptions> = {}
  ) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Executes function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this._state === CircuitState.OPEN) {
      if (Date.now() < this._nextAttempt) {
        throw new Error(ERROR_MESSAGES.CIRCUIT_BREAKER.IS_OPEN(this._name));
      }
      // Transition to half-open
      this._transitionToHalfOpen();
    }

    // Check half-open call limit
    if (this._state === CircuitState.HALF_OPEN) {
      if (this._halfOpenCalls >= this._options.halfOpenMaxCalls) {
        throw new Error(ERROR_MESSAGES.CIRCUIT_BREAKER.HALF_OPEN_LIMIT(this._name));
      }
      this._halfOpenCalls++;
    }

    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure();
      throw error;
    }
  }

  /**
   * Handles successful execution
   */
  private _onSuccess(): void {
    this._failureCount = 0;

    if (this._state === CircuitState.HALF_OPEN) {
      this._successCount++;
      if (this._successCount >= this._options.successThreshold) {
        this._transitionToClosed();
      }
    }
  }

  /**
   * Handles failed execution
   */
  private _onFailure(): void {
    this._failureCount++;
    this._successCount = 0;

    if (this._state === CircuitState.HALF_OPEN) {
      this._transitionToOpen();
    } else if (this._failureCount >= this._options.failureThreshold) {
      this._transitionToOpen();
    }
  }

  /**
   * Transitions to CLOSED state
   */
  private _transitionToClosed(): void {
    this._state = CircuitState.CLOSED;
    this._failureCount = 0;
    this._successCount = 0;
    this._halfOpenCalls = 0;
    logger.info(LOG_MESSAGES.FORMATTED.CIRCUIT_CLOSED(this._name));
  }

  /**
   * Transitions to OPEN state
   */
  private _transitionToOpen(): void {
    this._state = CircuitState.OPEN;
    this._nextAttempt = Date.now() + this._options.timeout;
    this._halfOpenCalls = 0;
    logger.warn(LOG_MESSAGES.FORMATTED.CIRCUIT_OPENED(this._name));
  }

  /**
   * Transitions to HALF_OPEN state
   */
  private _transitionToHalfOpen(): void {
    this._state = CircuitState.HALF_OPEN;
    this._successCount = 0;
    this._halfOpenCalls = 0;
    logger.info(LOG_MESSAGES.FORMATTED.CIRCUIT_HALF_OPEN(this._name));
  }

  /**
   * Gets current circuit state
   */
  getState(): CircuitState {
    return this._state;
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
      state: this._state,
      failureCount: this._failureCount,
      successCount: this._successCount,
    };
  }

  /**
   * Manually resets the circuit breaker
   */
  reset(): void {
    this._transitionToClosed();
  }
}

// Global circuit breakers for different services
export const apiCircuitBreaker = new CircuitBreaker(CIRCUIT_BREAKER_SERVICE.API);
export const authCircuitBreaker = new CircuitBreaker(CIRCUIT_BREAKER_SERVICE.AUTH);
