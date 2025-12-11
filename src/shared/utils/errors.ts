/**
 * Custom Error Classes
 * Provides type-safe error handling
 */

/* eslint-disable max-classes-per-file -- Error classes are intentionally co-located */

import { ERROR_MESSAGES, ERROR_CODES, ERROR_NAME, TYPEOF } from '../constants';
import { HTTP_STATUS } from '../constants/http';

/**
 * Base application error
 */
export class AppError extends Error {
  public cause?: Error;

  constructor(
    message: string,
    public code: string = ERROR_CODES.GENERAL.APP_ERROR,
    public statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    cause?: Error | unknown
  ) {
    super(message);
    this.name = ERROR_NAME.APP_ERROR;
    this.cause = cause instanceof Error ? cause : undefined;
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends AppError {
  public cause?: Error;

  constructor(
    message: string = ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED,
    cause?: Error | unknown
  ) {
    super(message, ERROR_CODES.GENERAL.AUTHENTICATION_ERROR, HTTP_STATUS.UNAUTHORIZED);
    this.name = ERROR_NAME.AUTHENTICATION_ERROR;
    this.cause = cause instanceof Error ? cause : undefined;
  }
}

/**
 * Authorization errors
 */
export class AuthorizationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS) {
    super(message, ERROR_CODES.GENERAL.AUTHORIZATION_ERROR, HTTP_STATUS.FORBIDDEN);
    this.name = ERROR_NAME.AUTHORIZATION_ERROR;
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
    super(message, ERROR_CODES.GENERAL.VALIDATION_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.name = ERROR_NAME.VALIDATION_ERROR;
  }
}

/**
 * Network errors
 */
export class NetworkError extends AppError {
  constructor(
    message: string = ERROR_MESSAGES.NETWORK.REQUEST_FAILED,
    public endpoint?: string
  ) {
    super(message, ERROR_CODES.GENERAL.NETWORK_ERROR, HTTP_STATUS.SERVICE_UNAVAILABLE);
    this.name = ERROR_NAME.NETWORK_ERROR;
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends AppError {
  constructor(message: string = ERROR_MESSAGES.TIMEOUT.REQUEST_TIMEOUT) {
    super(message, ERROR_CODES.GENERAL.TIMEOUT_ERROR, HTTP_STATUS.REQUEST_TIMEOUT);
    this.name = ERROR_NAME.TIMEOUT_ERROR;
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = ERROR_MESSAGES.NOT_FOUND.RESOURCE,
    public resource?: string
  ) {
    super(message, ERROR_CODES.GENERAL.NOT_FOUND_ERROR, HTTP_STATUS.NOT_FOUND);
    this.name = ERROR_NAME.NOT_FOUND_ERROR;
  }
}

/**
 * Conflict errors (e.g., duplicate entries)
 */
export class ConflictError extends AppError {
  constructor(message: string = ERROR_MESSAGES.CONFLICT.RESOURCE) {
    super(message, ERROR_CODES.GENERAL.CONFLICT_ERROR, HTTP_STATUS.CONFLICT);
    this.name = ERROR_NAME.CONFLICT_ERROR;
  }
}

/**
 * Rate limit errors
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS,
    public retryAfter?: number
  ) {
    super(message, ERROR_CODES.GENERAL.RATE_LIMIT_ERROR, HTTP_STATUS.TOO_MANY_REQUESTS);
    this.name = ERROR_NAME.RATE_LIMIT_ERROR;
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
  if (typeof error === TYPEOF.STRING) {
    return error;
  }
  return ERROR_MESSAGES.APP.UNKNOWN_ERROR;
}

/**
 * Converts unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, ERROR_CODES.GENERAL.UNKNOWN_ERROR);
  }

  return new AppError(ERROR_MESSAGES.APP.UNKNOWN_ERROR, ERROR_CODES.GENERAL.UNKNOWN_ERROR);
}
