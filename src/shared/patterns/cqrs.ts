/**
 * CQRS Pattern Implementation
 * Separates read (Query) and write (Command) operations following Microsoft/AWS patterns
 */

import { logger } from '../utils/logger';
import { captureError } from '../services/sentry';

// ============================================================================
// Types
// ============================================================================

export interface Command<TPayload = any> {
  type: string;
  payload: TPayload;
  metadata?: {
    userId?: string;
    timestamp?: number;
    correlationId?: string;
  };
}

export interface Query<TParams = any> {
  type: string;
  params: TParams;
  metadata?: {
    userId?: string;
    timestamp?: number;
  };
}

export type CommandHandler<TCommand extends Command, TResult = void> = (
  command: TCommand
) => Promise<TResult>;

export type QueryHandler<TQuery extends Query, TResult = any> = (
  query: TQuery
) => Promise<TResult>;

// ============================================================================
// Command Bus
// ============================================================================

class CommandBus {
  private handlers = new Map<string, CommandHandler<any, any>>();
  private middleware: Array<
    (command: Command, next: () => Promise<any>) => Promise<any>
  > = [];

  /**
   * Registers a command handler
   */
  register<TCommand extends Command, TResult>(
    commandType: string,
    handler: CommandHandler<TCommand, TResult>
  ): void {
    if (this.handlers.has(commandType)) {
      logger.warn(`Command handler already registered: ${commandType}`);
    }

    this.handlers.set(commandType, handler);
    logger.debug(`Command handler registered: ${commandType}`);
  }

  /**
   * Adds middleware to the command pipeline
   */
  use(
    middleware: (command: Command, next: () => Promise<any>) => Promise<any>
  ): void {
    this.middleware.push(middleware);
  }

  /**
   * Executes a command
   */
  async execute<TCommand extends Command, TResult>(
    command: TCommand
  ): Promise<TResult> {
    const handler = this.handlers.get(command.type);

    if (!handler) {
      throw new Error(`No handler registered for command: ${command.type}`);
    }

    // Add metadata
    command.metadata = {
      ...command.metadata,
      timestamp: command.metadata?.timestamp || Date.now(),
      correlationId:
        command.metadata?.correlationId ||
        this.generateCorrelationId(),
    };

    logger.debug('Executing command', {
      type: command.type,
      correlationId: command.metadata.correlationId,
    });

    try {
      // Execute through middleware pipeline
      const result = await this.executeWithMiddleware(command, handler);

      logger.debug('Command executed successfully', {
        type: command.type,
        correlationId: command.metadata.correlationId,
      });

      return result;
    } catch (error) {
      logger.error('Command execution failed', error as Error, {
        type: command.type,
        correlationId: command.metadata.correlationId,
      });

      captureError(error as Error, {
        level: 'error',
        tags: {
          commandType: command.type,
          correlationId: command.metadata.correlationId || 'unknown',
        },
      });

      throw error;
    }
  }

  /**
   * Executes command through middleware pipeline
   */
  private async executeWithMiddleware(
    command: Command,
    handler: CommandHandler<any, any>
  ): Promise<any> {
    let index = 0;

    const next = async (): Promise<any> => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        return await middleware(command, next);
      }
      return await handler(command);
    };

    return await next();
  }

  /**
   * Generates a correlation ID
   */
  private generateCorrelationId(): string {
    return `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Unregisters a command handler
   */
  unregister(commandType: string): void {
    this.handlers.delete(commandType);
  }

  /**
   * Clears all handlers
   */
  clear(): void {
    this.handlers.clear();
    this.middleware = [];
  }
}

// ============================================================================
// Query Bus
// ============================================================================

class QueryBus {
  private handlers = new Map<string, QueryHandler<any, any>>();
  private cache = new Map<string, { result: any; timestamp: number }>();
  private readonly CACHE_TTL = 60000; // 1 minute

  /**
   * Registers a query handler
   */
  register<TQuery extends Query, TResult>(
    queryType: string,
    handler: QueryHandler<TQuery, TResult>
  ): void {
    if (this.handlers.has(queryType)) {
      logger.warn(`Query handler already registered: ${queryType}`);
    }

    this.handlers.set(queryType, handler);
    logger.debug(`Query handler registered: ${queryType}`);
  }

  /**
   * Executes a query
   */
  async execute<TQuery extends Query, TResult>(
    query: TQuery,
    options?: {
      useCache?: boolean;
      cacheTTL?: number;
    }
  ): Promise<TResult> {
    const handler = this.handlers.get(query.type);

    if (!handler) {
      throw new Error(`No handler registered for query: ${query.type}`);
    }

    // Add metadata
    query.metadata = {
      ...query.metadata,
      timestamp: query.metadata?.timestamp || Date.now(),
    };

    // Check cache if enabled
    if (options?.useCache !== false) {
      const cacheKey = this.getCacheKey(query);
      const cached = this.cache.get(cacheKey);

      if (cached) {
        const ttl = options?.cacheTTL || this.CACHE_TTL;
        const isValid = Date.now() - cached.timestamp < ttl;

        if (isValid) {
          logger.debug('Query result from cache', { type: query.type });
          return cached.result;
        }
      }
    }

    logger.debug('Executing query', { type: query.type });

    try {
      const result = await handler(query);

      // Cache result if caching enabled
      if (options?.useCache !== false) {
        const cacheKey = this.getCacheKey(query);
        this.cache.set(cacheKey, {
          result,
          timestamp: Date.now(),
        });
      }

      logger.debug('Query executed successfully', { type: query.type });

      return result;
    } catch (error) {
      logger.error('Query execution failed', error as Error, {
        type: query.type,
      });

      captureError(error as Error, {
        level: 'error',
        tags: {
          queryType: query.type,
        },
      });

      throw error;
    }
  }

  /**
   * Generates cache key for query
   */
  private getCacheKey(query: Query): string {
    return `${query.type}:${JSON.stringify(query.params)}`;
  }

  /**
   * Invalidates cache for a query type
   */
  invalidateCache(queryType: string): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.startsWith(`${queryType}:`)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));

    logger.debug(`Cache invalidated for query type: ${queryType}`, {
      keysInvalidated: keysToDelete.length,
    });
  }

  /**
   * Clears all cache
   */
  clearCache(): void {
    this.cache.clear();
    logger.debug('Query cache cleared');
  }

  /**
   * Unregisters a query handler
   */
  unregister(queryType: string): void {
    this.handlers.delete(queryType);
    this.invalidateCache(queryType);
  }

  /**
   * Clears all handlers
   */
  clear(): void {
    this.handlers.clear();
    this.cache.clear();
  }
}

// ============================================================================
// Global Instances
// ============================================================================

export const commandBus = new CommandBus();
export const queryBus = new QueryBus();

// ============================================================================
// Middleware
// ============================================================================

/**
 * Validation middleware
 */
export function validationMiddleware<T>(
  validator: (command: Command<T>) => Promise<void>
) {
  return async (command: Command<T>, next: () => Promise<any>) => {
    await validator(command);
    return await next();
  };
}

/**
 * Logging middleware
 */
export const loggingMiddleware = async (
  command: Command,
  next: () => Promise<any>
) => {
  const startTime = Date.now();

  logger.info('Command started', {
    type: command.type,
    correlationId: command.metadata?.correlationId,
  });

  try {
    const result = await next();
    const duration = Date.now() - startTime;

    logger.info('Command completed', {
      type: command.type,
      correlationId: command.metadata?.correlationId,
      duration,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error('Command failed', error as Error, {
      type: command.type,
      correlationId: command.metadata?.correlationId,
      duration,
    });

    throw error;
  }
};

/**
 * Authorization middleware
 */
export function authorizationMiddleware(
  authorizer: (command: Command) => Promise<boolean>
) {
  return async (command: Command, next: () => Promise<any>) => {
    const authorized = await authorizer(command);

    if (!authorized) {
      throw new Error('Unauthorized to execute command');
    }

    return await next();
  };
}

// ============================================================================
// Decorators
// ============================================================================

/**
 * Decorator to mark a method as a command handler
 */
export function CommandHandlerDecorator(commandType: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    // Register handler on first call
    let registered = false;

    descriptor.value = function (...args: any[]) {
      if (!registered) {
        commandBus.register(commandType, originalMethod.bind(this));
        registered = true;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Decorator to mark a method as a query handler
 */
export function QueryHandlerDecorator(queryType: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    // Register handler on first call
    let registered = false;

    descriptor.value = function (...args: any[]) {
      if (!registered) {
        queryBus.register(queryType, originalMethod.bind(this));
        registered = true;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a command
 */
export function createCommand<TPayload>(
  type: string,
  payload: TPayload,
  metadata?: Command['metadata']
): Command<TPayload> {
  return {
    type,
    payload,
    metadata,
  };
}

/**
 * Creates a query
 */
export function createQuery<TParams>(
  type: string,
  params: TParams,
  metadata?: Query['metadata']
): Query<TParams> {
  return {
    type,
    params,
    metadata,
  };
}

