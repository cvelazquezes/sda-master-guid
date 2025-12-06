/**
 * Logging Service
 * Provides structured logging with sanitization
 */

import { MS } from '../shared/constants/numbers';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  error?: Error;
}

class Logger {
  private static SENSITIVE_FIELDS = [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'auth',
    'ssn',
    'creditCard',
    'cvv',
  ];

  /**
   * Sanitizes sensitive data from logs
   */
  private sanitize(data: unknown): unknown {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = Logger.SENSITIVE_FIELDS.some((field) =>
        lowerKey.includes(field.toLowerCase())
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Creates a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data ? this.sanitize(data) : undefined,
      error,
    };
  }

  /**
   * Outputs log entry
   */
  private output(entry: LogEntry): void {
    const { level, message, data, error } = entry;

    // In development, use console for better DX
    if (__DEV__) {
      const style = this.getConsoleStyle(level);
      console.info(`[${level.toUpperCase()}] ${message}`, style);
      if (data) {
        console.info('Data:', data);
      }
      if (error) {
        console.error('Error:', error);
      }
      return;
    }

    // In production, send to logging service
    this.sendToLoggingService(entry);
  }

  /**
   * Gets console style for level
   */
  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: 'color: #888',
      info: 'color: #2196f3',
      warn: 'color: #ff9800',
      error: 'color: #f44336',
    };
    return styles[level];
  }

  /**
   * Sends log to external logging service
   */
  private sendToLoggingService(entry: LogEntry): void {
    // TODO: Implement Sentry, LogRocket, or similar
    // For now, just use console.error for errors
    if (entry.level === 'error') {
      console.error(JSON.stringify(entry));
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: unknown): void {
    this.output(this.createLogEntry('debug', message, data));
  }

  /**
   * Info level logging
   */
  info(message: string, data?: unknown): void {
    this.output(this.createLogEntry('info', message, data));
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: unknown): void {
    this.output(this.createLogEntry('warn', message, data));
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, data?: unknown): void {
    this.output(this.createLogEntry('error', message, data, error));
  }

  /**
   * Logs performance metric
   */
  performance(operation: string, duration: number, metadata?: unknown): void {
    this.info(`Performance: ${operation}`, {
      duration,
      ...metadata,
    });

    if (duration > MS.SECOND) {
      this.warn(`Slow operation detected: ${operation}`, {
        duration,
        ...metadata,
      });
    }
  }
}

export const logger = new Logger();
