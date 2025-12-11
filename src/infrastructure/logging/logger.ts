/**
 * Logger
 *
 * Infrastructure logging service.
 * Provides consistent logging across the application.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

/**
 * Logger class for application logging
 */
class Logger {
  private _isDevelopment: boolean;

  constructor() {
    this._isDevelopment = __DEV__;
  }

  // eslint-disable-next-line complexity -- Logging requires multiple conditionals
  private _log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this._isDevelopment && level === 'debug') {
      return; // Skip debug logs in production
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'debug':
        console.debug(logMessage, context || '');
        break;
      case 'info':
        console.info(logMessage, context || '');
        break;
      case 'warn':
        console.warn(logMessage, context || '');
        break;
      case 'error':
        console.error(logMessage, context || '');
        break;
      default:
        console.log(logMessage, context || '');
    }
  }

  debug(message: string, context?: LogContext): void {
    this._log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this._log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this._log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error
      ? { ...context, error: { message: error.message, stack: error.stack } }
      : context;
    this._log('error', message, errorContext);
  }
}

export const logger = new Logger();
