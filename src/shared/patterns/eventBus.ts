/**
 * Event Bus (Pub/Sub Pattern)
 * Enables loosely-coupled communication following Google/AWS EventBridge patterns
 */

import { logger } from '../utils/logger';
import { captureError, addBreadcrumb } from '../services/sentry';

// ============================================================================
// Types
// ============================================================================

export interface DomainEvent<TPayload = any> {
  type: string;
  payload: TPayload;
  metadata: {
    eventId: string;
    timestamp: number;
    source: string;
    version: string;
    correlationId?: string;
    causationId?: string;
  };
}

export type EventHandler<TEvent extends DomainEvent = DomainEvent> = (
  event: TEvent
) => Promise<void> | void;

export interface EventSubscription {
  eventType: string;
  handler: EventHandler;
  id: string;
}

// ============================================================================
// Event Bus
// ============================================================================

class EventBus {
  private subscriptions = new Map<string, Map<string, EventHandler>>();
  private eventHistory: DomainEvent[] = [];
  private readonly MAX_HISTORY_SIZE = 100;
  private middleware: Array<
    (event: DomainEvent, next: () => Promise<void>) => Promise<void>
  > = [];

  /**
   * Subscribes to an event type
   */
  subscribe<TEvent extends DomainEvent>(
    eventType: string,
    handler: EventHandler<TEvent>
  ): () => void {
    const subscriptionId = this.generateSubscriptionId();

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, new Map());
    }

    this.subscriptions.get(eventType)!.set(subscriptionId, handler as EventHandler);

    logger.debug('Event subscription added', {
      eventType,
      subscriptionId,
      totalSubscriptions: this.subscriptions.get(eventType)!.size,
    });

    // Return unsubscribe function
    return () => {
      this.unsubscribe(eventType, subscriptionId);
    };
  }

  /**
   * Unsubscribes from an event type
   */
  unsubscribe(eventType: string, subscriptionId: string): void {
    const handlers = this.subscriptions.get(eventType);

    if (handlers) {
      handlers.delete(subscriptionId);

      if (handlers.size === 0) {
        this.subscriptions.delete(eventType);
      }

      logger.debug('Event subscription removed', {
        eventType,
        subscriptionId,
      });
    }
  }

  /**
   * Publishes an event
   */
  async publish<TEvent extends DomainEvent>(event: TEvent): Promise<void> {
    // Ensure event has metadata
    if (!event.metadata) {
      event.metadata = {
        eventId: this.generateEventId(),
        timestamp: Date.now(),
        source: 'app',
        version: '1.0',
      };
    }

    logger.debug('Publishing event', {
      type: event.type,
      eventId: event.metadata.eventId,
    });

    addBreadcrumb(`Event published: ${event.type}`, 'event', 'info', {
      eventId: event.metadata.eventId,
    });

    // Add to history
    this.addToHistory(event);

    // Get handlers for this event type
    const handlers = this.subscriptions.get(event.type);

    if (!handlers || handlers.size === 0) {
      logger.debug('No subscribers for event', { type: event.type });
      return;
    }

    // Execute handlers through middleware
    await this.executeWithMiddleware(event, async () => {
      await this.notifySubscribers(event, handlers);
    });
  }

  /**
   * Notifies all subscribers
   */
  private async notifySubscribers(
    event: DomainEvent,
    handlers: Map<string, EventHandler>
  ): Promise<void> {
    const handlerPromises = Array.from(handlers.entries()).map(
      async ([subscriptionId, handler]) => {
        try {
          await handler(event);

          logger.debug('Event handler executed', {
            type: event.type,
            subscriptionId,
          });
        } catch (error) {
          logger.error('Event handler failed', error as Error, {
            type: event.type,
            subscriptionId,
            eventId: event.metadata.eventId,
          });

          captureError(error as Error, {
            level: 'error',
            tags: {
              eventType: event.type,
              eventId: event.metadata.eventId,
              subscriptionId,
            },
          });

          // Don't throw - other handlers should continue
        }
      }
    );

    await Promise.all(handlerPromises);
  }

  /**
   * Adds middleware to the event pipeline
   */
  use(
    middleware: (event: DomainEvent, next: () => Promise<void>) => Promise<void>
  ): void {
    this.middleware.push(middleware);
  }

  /**
   * Executes event through middleware pipeline
   */
  private async executeWithMiddleware(
    event: DomainEvent,
    handler: () => Promise<void>
  ): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        await middleware(event, next);
      } else {
        await handler();
      }
    };

    await next();
  }

  /**
   * Adds event to history
   */
  private addToHistory(event: DomainEvent): void {
    this.eventHistory.push(event);

    // Trim history if too large
    if (this.eventHistory.length > this.MAX_HISTORY_SIZE) {
      this.eventHistory = this.eventHistory.slice(-this.MAX_HISTORY_SIZE);
    }
  }

  /**
   * Gets event history
   */
  getHistory(options?: {
    eventType?: string;
    limit?: number;
    since?: number;
  }): DomainEvent[] {
    let history = [...this.eventHistory];

    // Filter by event type
    if (options?.eventType) {
      history = history.filter((e) => e.type === options.eventType);
    }

    // Filter by timestamp
    if (options?.since) {
      history = history.filter((e) => e.metadata.timestamp >= options.since!);
    }

    // Limit results
    if (options?.limit) {
      history = history.slice(-options.limit);
    }

    return history;
  }

  /**
   * Clears event history
   */
  clearHistory(): void {
    this.eventHistory = [];
    logger.debug('Event history cleared');
  }

  /**
   * Gets all subscriptions
   */
  getSubscriptions(): EventSubscription[] {
    const subscriptions: EventSubscription[] = [];

    for (const [eventType, handlers] of this.subscriptions.entries()) {
      for (const [id, handler] of handlers.entries()) {
        subscriptions.push({
          eventType,
          handler,
          id,
        });
      }
    }

    return subscriptions;
  }

  /**
   * Clears all subscriptions
   */
  clear(): void {
    this.subscriptions.clear();
    this.eventHistory = [];
    this.middleware = [];
    logger.debug('Event bus cleared');
  }

  /**
   * Generates event ID
   */
  private generateEventId(): string {
    return `evt-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Generates subscription ID
   */
  private generateSubscriptionId(): string {
    return `sub-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Gets statistics
   */
  getStats(): {
    totalSubscriptions: number;
    eventTypes: string[];
    historySize: number;
  } {
    return {
      totalSubscriptions: Array.from(this.subscriptions.values()).reduce(
        (sum, handlers) => sum + handlers.size,
        0
      ),
      eventTypes: Array.from(this.subscriptions.keys()),
      historySize: this.eventHistory.length,
    };
  }
}

// ============================================================================
// Global Instance
// ============================================================================

export const eventBus = new EventBus();

// ============================================================================
// Middleware
// ============================================================================

/**
 * Logging middleware
 */
export const eventLoggingMiddleware = async (
  event: DomainEvent,
  next: () => Promise<void>
) => {
  logger.info('Event received', {
    type: event.type,
    eventId: event.metadata.eventId,
    timestamp: event.metadata.timestamp,
  });

  await next();

  logger.info('Event processed', {
    type: event.type,
    eventId: event.metadata.eventId,
  });
};

/**
 * Validation middleware
 */
export function eventValidationMiddleware<T>(
  validator: (event: DomainEvent<T>) => boolean
) {
  return async (event: DomainEvent<T>, next: () => Promise<void>) => {
    if (!validator(event)) {
      throw new Error('Event validation failed');
    }
    await next();
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a domain event
 */
export function createEvent<TPayload>(
  type: string,
  payload: TPayload,
  metadata?: Partial<DomainEvent['metadata']>
): DomainEvent<TPayload> {
  return {
    type,
    payload,
    metadata: {
      eventId: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      timestamp: Date.now(),
      source: 'app',
      version: '1.0',
      ...metadata,
    },
  };
}

/**
 * Subscribes to multiple event types
 */
export function subscribeToMany(
  eventTypes: string[],
  handler: EventHandler
): () => void {
  const unsubscribers = eventTypes.map((type) =>
    eventBus.subscribe(type, handler)
  );

  // Return function to unsubscribe from all
  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
}

// ============================================================================
// Domain Events (Examples)
// ============================================================================

export const DomainEvents = {
  // User events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',

  // Club events
  CLUB_CREATED: 'club.created',
  CLUB_UPDATED: 'club.updated',
  CLUB_DELETED: 'club.deleted',

  // Match events
  MATCH_CREATED: 'match.created',
  MATCH_UPDATED: 'match.updated',
  MATCH_CANCELLED: 'match.cancelled',
  MATCH_COMPLETED: 'match.completed',

  // System events
  SYSTEM_ERROR: 'system.error',
  SYSTEM_READY: 'system.ready',
  NETWORK_ONLINE: 'network.online',
  NETWORK_OFFLINE: 'network.offline',
} as const;

// ============================================================================
// React Hook
// ============================================================================

import { useEffect } from 'react';

/**
 * React hook to subscribe to events
 */
export function useEventSubscription(
  eventType: string | string[],
  handler: EventHandler
): void {
  useEffect(() => {
    const types = Array.isArray(eventType) ? eventType : [eventType];
    const unsubscribers = types.map((type) =>
      eventBus.subscribe(type, handler)
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [eventType, handler]);
}

