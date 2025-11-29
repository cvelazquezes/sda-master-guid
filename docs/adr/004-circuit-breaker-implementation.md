# ADR-004: Implement Circuit Breaker Pattern

## Status

**Accepted** - 2024

## Context

The mobile app makes API calls to backend services that may fail or become slow. Without proper resilience patterns, cascading failures can occur:

- User experiences frozen UI while waiting for timeouts
- Multiple retry attempts overload failing services
- Poor user experience during partial outages

We needed a resilience pattern that:

- Prevents cascading failures
- Fails fast when service is down
- Automatically recovers when service is healthy
- Provides visibility into service health

## Decision

We will implement the **Circuit Breaker pattern** (inspired by Netflix Hystrix) with three states:

- **CLOSED**: Normal operation, requests go through
- **OPEN**: Service is failing, requests fail immediately
- **HALF_OPEN**: Testing if service recovered

## Architecture

### Circuit Breaker States

```
         Failure Threshold Reached
    CLOSED ──────────────────────────> OPEN
      ↑                                  │
      │                                  │ Timeout Elapsed
      │                                  ↓
      └──────────────────────── HALF_OPEN
           Success Threshold Reached
```

### Configuration

```typescript
interface CircuitBreakerConfig {
  failureThreshold: number; // 5 failures to open
  successThreshold: number; // 3 successes to close
  timeout: number; // 60 seconds before retry
  halfOpenMaxCalls: number; // 3 test calls in HALF_OPEN
}
```

## Implementation

### Location

`src/shared/api/api/circuitBreaker.ts`

### Key Features

1. **Failure Tracking**

   ```typescript
   private failureCount = 0;
   private successCount = 0;
   ```

2. **State Management**

   ```typescript
   enum CircuitState {
     CLOSED, // Normal operation
     OPEN, // Failing, reject immediately
     HALF_OPEN, // Testing recovery
   }
   ```

3. **Automatic Recovery**

   ```typescript
   private nextAttempt = Date.now();
   // After timeout, transition to HALF_OPEN
   ```

4. **Statistics**
   ```typescript
   getStats(): {
     state: CircuitState;
     failureCount: number;
     successCount: number;
     lastFailureTime: number;
   }
   ```

## Usage

### API Client Integration

```typescript
// src/shared/api/api.ts
async function makeRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  return await apiCircuitBreaker.execute(async () => {
    return await retryPolicy.execute(requestFn);
  });
}
```

### Combined with Retry Policy

```typescript
// Circuit Breaker wraps Retry Policy
// 1. Circuit Breaker checks if request should proceed
// 2. If CLOSED/HALF_OPEN, Retry Policy handles retries
// 3. If failures exceed threshold, Circuit opens
```

## Consequences

### Positive

- ✅ **Fast Failure**: Users don't wait for timeouts
- ✅ **Service Protection**: Don't overwhelm failing services
- ✅ **Automatic Recovery**: Self-healing system
- ✅ **Visibility**: Stats show service health
- ✅ **Better UX**: Clear error messages instead of hanging

### Negative

- ⚠️ **False Positives**: May open circuit too early
- ⚠️ **Complexity**: Additional layer in request flow

### Mitigation

- Tune thresholds based on production metrics
- Monitor circuit breaker stats
- Add manual override for testing

## Configuration Values

### Production Settings

```typescript
{
  failureThreshold: 5,        // Open after 5 failures
  successThreshold: 3,        // Close after 3 successes
  timeout: 60000,             // Wait 60s before retry
  halfOpenMaxCalls: 3         // Test with 3 calls
}
```

### Development Settings

```typescript
{
  failureThreshold: 3,        // Open faster
  successThreshold: 2,        // Close faster
  timeout: 10000,             // Shorter timeout
  halfOpenMaxCalls: 2         // Fewer test calls
}
```

## Monitoring

### Key Metrics

1. **Circuit State Duration**: How long in each state
2. **Open Circuit Events**: When and why circuit opens
3. **Recovery Time**: Time from OPEN → CLOSED
4. **Request Success Rate**: Overall health

### Alerting

- Alert when circuit opens (indicates service issues)
- Alert if circuit stays open > 5 minutes
- Alert if circuit flaps (open/close repeatedly)

## Testing Strategy

### Unit Tests

```typescript
describe('CircuitBreaker', () => {
  it('opens after threshold failures', async () => {
    // Fail 5 times
    // Assert state is OPEN
  });

  it('transitions to HALF_OPEN after timeout', async () => {
    // Open circuit
    // Wait timeout duration
    // Assert state is HALF_OPEN
  });

  it('closes after successful HALF_OPEN calls', async () => {
    // Open circuit
    // Transition to HALF_OPEN
    // Succeed 3 times
    // Assert state is CLOSED
  });
});
```

### Integration Tests

```typescript
it('protects API from cascading failures', async () => {
  // Simulate failing API
  // Make multiple requests
  // Verify circuit opens
  // Verify subsequent requests fail fast
});
```

## Alternatives Considered

### 1. No Circuit Breaker

```
+ Simple implementation
- Poor user experience during outages
- Cascading failures
- Service overload
```

**Rejected**: Not acceptable for production

### 2. Simple Retry Only

```
+ Easier to implement
- Doesn't protect against cascading failures
- No fast failure
- Overloads failing services
```

**Rejected**: Insufficient protection

### 3. Manual Service Discovery

```
+ More control
- Complex implementation
- Requires service registry
- Overkill for mobile app
```

**Rejected**: Too complex

## Success Criteria

- ✅ Circuit opens within 5 failures
- ✅ Requests fail immediately when circuit is open
- ✅ Circuit recovers automatically
- ✅ No cascading failures observed
- ✅ Improved user experience during outages

## Related Decisions

- ADR-005: Retry Policy with Exponential Backoff
- ADR-006: Rate Limiting Strategy
- ADR-007: Health Check Implementation

## References

- [Netflix Hystrix](https://github.com/Netflix/Hystrix/wiki)
- [Martin Fowler - Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Google SRE Book](https://sre.google/sre-book/handling-overload/)
