/**
 * Custom Error Classes
 * Provides type-safe error handling
 */

import { HTTP_STATUS } from '../constants/http';

/**
 * Base application error
 */
export class AppError extends Error {
  public cause?: Error;

  constructor(
    message: string,
    public code: string = 'APP_ERROR',
    public statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    cause?: Error | unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.cause = cause instanceof Error ? cause : undefined;
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends AppError {
  public cause?: Error;

  constructor(message: string = 'Authentication failed', cause?: Error | unknown) {
    super(message, 'AUTHENTICATION_ERROR', HTTP_STATUS.UNAUTHORIZED);
    this.name = 'AuthenticationError';
    this.cause = cause instanceof Error ? cause : undefined;
  }
}

// Alias for backward compatibility
export const AuthError = AuthenticationError;

/**
 * Authorization errors
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', HTTP_STATUS.FORBIDDEN);
    this.name = 'AuthorizationError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.name = 'ValidationError';
  }
}

/**
 * Network errors
 */
export class NetworkError extends AppError {
  constructor(
    message: string = 'Network request failed',
    public endpoint?: string
  ) {
    super(message, 'NETWORK_ERROR', HTTP_STATUS.SERVICE_UNAVAILABLE);
    this.name = 'NetworkError';
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends AppError {
  constructor(message: string = 'Request timed out') {
    super(message, 'TIMEOUT_ERROR', HTTP_STATUS.REQUEST_TIMEOUT);
    this.name = 'TimeoutError';
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    public resource?: string
  ) {
    super(message, 'NOT_FOUND_ERROR', HTTP_STATUS.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict errors (e.g., duplicate entries)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 'CONFLICT_ERROR', HTTP_STATUS.CONFLICT);
    this.name = 'ConflictError';
  }
}

/**
 * Rate limit errors
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = 'Rate limit exceeded',
    public retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT_ERROR', HTTP_STATUS.TOO_MANY_REQUESTS);
    this.name = 'RateLimitError';
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Extracts error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Converts unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
}
