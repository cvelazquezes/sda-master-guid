# ADR-002: API Design & Integration Patterns

## Status

**Accepted** - December 2024

## Context

The SDA Master Guid application requires a well-designed API architecture to:

1. **Support offline-first** mobile development with mock data
2. **Provide resilient** network communication with retry logic
3. **Handle errors** consistently across all services
4. **Enable seamless** transition between mock and backend modes
5. **Scale horizontally** as the user base grows

### Key Requirements

- RESTful API design following OpenAPI 3.0 specification
- Circuit breaker pattern for resilience
- Retry policies for transient failures
- Rate limiting for API protection
- Consistent error handling
- Support for mock/backend toggle

## Decision

### 1. API Client Architecture

We implement a layered API architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                          │
│  (authService, clubService, matchService, paymentService)   │
├─────────────────────────────────────────────────────────────┤
│                      API Service                            │
│              (apiService: get, post, patch, delete)         │
├─────────────────────────────────────────────────────────────┤
│                    Request Pipeline                         │
│         ┌───────────────┐  ┌───────────────────┐           │
│         │ Rate Limiter  │─►│  Circuit Breaker  │           │
│         └───────────────┘  └───────────────────┘           │
│                                    │                        │
│                            ┌───────────────┐               │
│                            │ Retry Policy  │               │
│                            └───────────────┘               │
├─────────────────────────────────────────────────────────────┤
│                      Axios Client                           │
│        (interceptors, headers, timeout, base URL)           │
└─────────────────────────────────────────────────────────────┘
```

### 2. Service Layer Pattern

Each domain service follows a consistent pattern:

```typescript
class ServiceName {
  private useMockData = environment.useMockData;

  async methodName(params): Promise<ReturnType> {
    if (this.useMockData) {
      return this.mockMethodName(params);
    }

    try {
      const response = await apiService.method('/endpoint', params);
      logger.info('Operation successful', { context });
      return response;
    } catch (error) {
      logger.error('Operation failed', error, { context });
      throw error;
    }
  }

  private async mockMethodName(params): Promise<ReturnType> {
    await this.sleep(MOCK_API_DELAY_MS);
    // Mock implementation
    return mockData;
  }
}
```

### 3. Circuit Breaker Pattern

Prevents cascading failures when the backend is unavailable:

```typescript
interface CircuitBreakerConfig {
  failureThreshold: 5; // Failures before opening
  successThreshold: 2; // Successes before closing
  timeout: 30000; // Time in open state (ms)
}

// States: CLOSED -> OPEN -> HALF_OPEN -> CLOSED
```

**Behavior:**

- **CLOSED**: Normal operation, requests pass through
- **OPEN**: All requests fail immediately (fast fail)
- **HALF_OPEN**: Limited requests allowed to test recovery

### 4. Retry Policy

Handles transient failures with exponential backoff:

```typescript
interface RetryPolicyConfig {
  maxAttempts: 3;
  baseDelay: 1000; // Initial delay (ms)
  maxDelay: 5000; // Maximum delay (ms)
  backoffMultiplier: 2; // Exponential multiplier
  retryableErrors: [
    'ECONNABORTED', // Timeout
    'ETIMEDOUT', // Timeout
    'Network request failed', // Network error
  ];
}
```

**Retry Logic:**

```
Attempt 1 → Fail → Wait 1s
Attempt 2 → Fail → Wait 2s
Attempt 3 → Fail → Throw Error
```

### 5. Rate Limiting

Client-side rate limiting to prevent API abuse:

```typescript
interface RateLimitConfig {
  maxRequests: 100; // Max requests per window
  windowMs: 60000; // Time window (1 minute)
}

// Uses token bucket algorithm
```

### 6. Error Handling Strategy

Consistent error types across the application:

```typescript
// Custom Error Classes
class AppError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, any>;
}

class AuthenticationError extends AppError {
  /* 401 */
}
class ForbiddenError extends AppError {
  /* 403 */
}
class NotFoundError extends AppError {
  /* 404 */
}
class ConflictError extends AppError {
  /* 409 */
}
class ValidationError extends AppError {
  /* 422 */
}
class RateLimitError extends AppError {
  /* 429 */
}
class NetworkError extends AppError {
  /* Network failures */
}
class TimeoutError extends AppError {
  /* Timeouts */
}
```

**Error Transformation:**

```typescript
function toAppError(error: AxiosError): AppError {
  const status = error.response?.status;
  const data = error.response?.data;

  switch (status) {
    case 401:
      return new AuthenticationError(data?.message);
    case 403:
      return new ForbiddenError(data?.message);
    case 404:
      return new NotFoundError(data?.message);
    case 409:
      return new ConflictError(data?.message);
    case 422:
      return new ValidationError(data?.message, data?.details);
    case 429:
      return new RateLimitError(data?.message);
    default:
      return new AppError(data?.message || 'Unknown error');
  }
}
```

### 7. Request/Response Format

**Standard Request Headers:**

```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}',
  'X-App-Version': '1.0.0',
  'X-Request-ID': 'req_abc123',
  'X-CSRF-Token': '{csrfToken}',  // For state-changing operations
}
```

**Standard Response Format:**

```typescript
// Success Response
{
  data: T | T[],
  pagination?: {
    page: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean,
  },
  meta: {
    requestId: string,
    timestamp: string,
    version: string,
  }
}

// Error Response
{
  error: {
    code: string,
    message: string,
    details?: Array<{ field, message, code }>,
    requestId: string,
    timestamp: string,
  }
}
```

### 8. Mock Data Strategy

Development-friendly mock implementation:

```typescript
// Environment-based toggle
const environment = {
  apiUrl: process.env.API_URL || 'http://localhost:3000/v1',
  useMockData: __DEV__ || process.env.USE_MOCK_DATA === 'true',
};

// Mock data storage
export const mockUsers: User[] = [...];
export const mockClubs: Club[] = [...];
export const mockMatches: Match[] = [...];

// Helper functions
export const getUserByEmail = (email: string): User | undefined;
export const getUsersByClub = (clubId: string): User[];
export const getMatchesForUser = (userId: string): Match[];
```

### 9. Logging Strategy

Structured logging for debugging and monitoring:

```typescript
interface Logger {
  debug(message: string, context?: object): void;
  info(message: string, context?: object): void;
  warn(message: string, context?: object): void;
  error(message: string, error: Error, context?: object): void;
}

// Usage
logger.info('Login successful', { userId: user.id });
logger.error('Login failed', error, { email });
```

## API Endpoints Summary

### Authentication

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| POST   | `/auth/login`    | User login           |
| POST   | `/auth/register` | User registration    |
| POST   | `/auth/refresh`  | Refresh access token |
| POST   | `/auth/logout`   | User logout          |
| GET    | `/auth/me`       | Get current user     |
| PATCH  | `/auth/me`       | Update current user  |

### Users

| Method | Endpoint                 | Description     |
| ------ | ------------------------ | --------------- |
| GET    | `/users`                 | List users      |
| GET    | `/users/{id}`            | Get user        |
| PATCH  | `/users/{id}`            | Update user     |
| DELETE | `/users/{id}`            | Delete user     |
| POST   | `/users/{id}/approve`    | Approve user    |
| POST   | `/users/{id}/reject`     | Reject user     |
| POST   | `/users/{id}/activate`   | Activate user   |
| POST   | `/users/{id}/deactivate` | Deactivate user |

### Clubs

| Method | Endpoint              | Description      |
| ------ | --------------------- | ---------------- |
| GET    | `/clubs`              | List clubs       |
| POST   | `/clubs`              | Create club      |
| GET    | `/clubs/{id}`         | Get club         |
| PATCH  | `/clubs/{id}`         | Update club      |
| DELETE | `/clubs/{id}`         | Delete club      |
| GET    | `/clubs/{id}/members` | Get club members |
| POST   | `/clubs/{id}/join`    | Join club        |
| POST   | `/clubs/{id}/leave`   | Leave club       |

### Matches

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/matches`             | List matches        |
| GET    | `/matches/me`          | Get my matches      |
| GET    | `/matches/{id}`        | Get match           |
| PATCH  | `/matches/{id}`        | Update match        |
| PATCH  | `/matches/{id}/status` | Update match status |
| POST   | `/matches/generate`    | Generate matches    |
| GET    | `/matches/rounds`      | Get match rounds    |

### Payments

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/payments`              | Get club payments     |
| POST   | `/payments/generate`     | Generate monthly fees |
| GET    | `/payments/member/{id}`  | Get member payments   |
| PATCH  | `/payments/{id}`         | Update payment        |
| GET    | `/payments/balance/{id}` | Get member balance    |
| GET    | `/charges/custom`        | Get custom charges    |
| POST   | `/charges/custom`        | Create custom charge  |
| DELETE | `/charges/custom/{id}`   | Delete custom charge  |

### Notifications

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| POST   | `/notifications/send`           | Send notification       |
| POST   | `/notifications/bulk`           | Send bulk notifications |
| POST   | `/notifications/schedule`       | Schedule notification   |
| DELETE | `/notifications/scheduled/{id}` | Cancel scheduled        |

### Organization

| Method | Endpoint                     | Description        |
| ------ | ---------------------------- | ------------------ |
| GET    | `/organization/divisions`    | List divisions     |
| GET    | `/organization/unions`       | List unions        |
| GET    | `/organization/associations` | List associations  |
| GET    | `/organization/churches`     | List churches      |
| GET    | `/organization/hierarchy`    | Get full hierarchy |

## Consequences

### Positive

1. **Resilience**: Circuit breaker prevents cascade failures
2. **Reliability**: Retry policy handles transient failures
3. **Performance**: Rate limiting protects against abuse
4. **Developer Experience**: Mock mode enables offline development
5. **Maintainability**: Consistent patterns across services
6. **Debugging**: Structured logging aids troubleshooting

### Negative

1. **Complexity**: Multiple patterns add complexity
2. **Overhead**: Request pipeline adds latency
3. **Mock Divergence**: Mock data may diverge from backend

### Mitigations

1. **Abstraction**: Service layer hides complexity
2. **Configuration**: Timeouts and delays are configurable
3. **Testing**: Integration tests verify mock/backend parity

## Implementation Files

```
src/services/
├── api.ts                    # Main API client
├── authService.ts            # Authentication service
├── clubService.ts            # Club management service
├── matchService.ts           # Match management service
├── userService.ts            # User management service
├── paymentService.ts         # Payment service
├── notificationService.ts    # Notification service
├── mockData.ts               # Mock data definitions
└── mockDataPersistence.ts    # Mock data persistence

src/utils/api/
├── retryPolicy.ts            # Retry logic
└── circuitBreaker.ts         # Circuit breaker

src/shared/services/
└── rateLimit.ts              # Rate limiting
```

## Related Decisions

- ADR-001: Authentication & Authorization Architecture
- ADR-003: Data Models & Validation (future)
- ADR-004: State Management (future)

## References

- [OpenAPI Specification 3.0](https://swagger.io/specification/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Exponential Backoff](https://cloud.google.com/iot/docs/how-tos/exponential-backoff)
- [Token Bucket Algorithm](https://en.wikipedia.org/wiki/Token_bucket)
