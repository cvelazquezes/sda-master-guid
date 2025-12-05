# ADR-001: Authentication & Authorization Architecture

## Status

**Accepted** - December 2024

## Context

The SDA Master Guid application requires a robust authentication and authorization system to:

1. **Authenticate users** across multiple platforms (iOS, Android, Web)
2. **Authorize operations** based on user roles (admin, club_admin, user)
3. **Manage user registration** with approval workflows
4. **Secure sensitive data** such as payment information and personal details

### Key Requirements

- Multi-platform support (React Native mobile app)
- Role-based access control (RBAC) with three distinct roles
- User registration with approval workflow
- Secure token management
- Support for mock data during development

## Decision

### 1. Authentication Strategy

We implement **JWT-based authentication** with the following structure:

```typescript
// Token Structure
interface JWTPayload {
  sub: string; // User ID
  email: string; // User email
  role: UserRole; // 'admin' | 'club_admin' | 'user'
  clubId: string | null; // Club ID (null for admin)
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}
```

**Token Lifecycle:**

- Access Token: 24-hour expiry
- Refresh Token: 7-day expiry
- Tokens stored in secure storage (react-native-keychain)

### 2. Role-Based Access Control

Three user roles with hierarchical permissions:

| Role         | Description          | Capabilities                                               |
| ------------ | -------------------- | ---------------------------------------------------------- |
| `admin`      | System Administrator | Full system access, manage all clubs and users             |
| `club_admin` | Club Administrator   | Manage club members, matches, fees, notifications          |
| `user`       | Regular Member       | View own data, club members, and participate in activities |

**Permission Matrix:**

| Resource           | admin | club_admin   | user              |
| ------------------ | ----- | ------------ | ----------------- |
| View all users     | ✅    | Club only    | Club members only |
| Approve users      | ✅    | Club members | ❌                |
| Manage clubs       | ✅    | Own club     | ❌                |
| Generate matches   | ✅    | Own club     | ❌                |
| Manage payments    | ✅    | Own club     | View own          |
| Send notifications | ✅    | Own club     | ❌                |

### 3. Registration & Approval Workflow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Register  │───►│   Pending    │───►│  Approved   │
└─────────────┘    └──────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Rejected   │
                   └─────────────┘
```

**Approval Rules:**

- Regular users: Approved by `club_admin` of their selected club
- Club admins: Approved by system `admin`
- System admins: Created directly in database

**User States:**

```typescript
enum ApprovalStatus {
  PENDING = 'pending', // Awaiting approval
  APPROVED = 'approved', // Can access system
  REJECTED = 'rejected', // Registration denied
}

// isActive is independent from approvalStatus
// A user can be approved but inactive (on pause)
```

### 4. Secure Storage Strategy

```typescript
// Platform-specific secure storage
// Mobile: react-native-keychain
// Web: httpOnly cookies (server-side sessions recommended)

interface SecureStorage {
  saveTokens(accessToken: string, refreshToken: string): Promise<void>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  saveUserId(userId: string): Promise<void>;
  getUserId(): Promise<string | null>;
  clearAuth(): Promise<void>;
}
```

### 5. API Security Headers

```typescript
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
```

### 6. Request Flow

```
┌─────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────┐
│ Client  │───►│ Rate Limiter │───►│ Auth Check  │───►│  API    │
└─────────┘    └──────────────┘    └─────────────┘    └─────────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │ Role Check  │
                                   └─────────────┘
```

**Interceptor Chain:**

1. Rate limiting check (100 req/min per user)
2. Auth token validation
3. CSRF token verification (for state-changing operations)
4. Role/permission validation
5. Request execution

## Consequences

### Positive

1. **Security**: JWT + secure storage provides strong security for mobile apps
2. **Scalability**: Stateless authentication scales horizontally
3. **Flexibility**: Role-based system allows fine-grained access control
4. **Audit Trail**: Token-based auth provides clear audit capabilities
5. **Developer Experience**: Mock mode enables offline development

### Negative

1. **Complexity**: Three-tier role system adds complexity
2. **Token Management**: Requires careful handling of token refresh
3. **Web Security**: Web platform requires additional considerations (httpOnly cookies)

### Mitigations

1. **Auth Context**: Centralized `AuthContext` manages all auth state
2. **Automatic Refresh**: API client handles token refresh automatically
3. **Clear Documentation**: Role permissions clearly documented

## Implementation Details

### AuthContext Provider

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (/* params */) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}
```

### API Client Integration

```typescript
// Request interceptor adds auth token
client.interceptors.request.use(async (config) => {
  const token = await secureStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await secureStorage.clearAuth();
      throw new AuthenticationError('Session expired');
    }
    throw toAppError(error);
  }
);
```

## Related Decisions

- ADR-002: API Design & Integration Patterns
- ADR-003: Data Models & Validation (future)

## References

- [OWASP Mobile Security Guide](https://owasp.org/www-project-mobile-security-testing-guide/)
- [JWT Best Practices](https://auth0.com/blog/jwt-security-best-practices/)
- [React Native Secure Storage](https://github.com/oblador/react-native-keychain)
