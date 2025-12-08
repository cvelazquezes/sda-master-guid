/**
 * Logger
 *
 * Infrastructure logging service.
 * Provides consistent logging across the application.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger class for application logging
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = __DEV__;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.isDevelopment && level === 'debug') {
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
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error
      ? { ...context, error: { message: error.message, stack: error.stack } }
      : context;
    this.log('error', message, errorContext);
  }
}

export const logger = new Logger();

