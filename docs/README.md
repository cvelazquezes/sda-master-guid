# SDA Master Guid Documentation

Welcome to the SDA Master Guid documentation. This documentation covers the backend API, architecture decisions, and application flows.

## Documentation Structure

```
docs/
├── README.md                          # This file
├── api/
│   ├── openapi.yaml                   # OpenAPI 3.0 Specification
│   ├── INTEGRATION.md                 # API Integration Guide
│   └── FLOWS.md                       # Application Flow Diagrams
└── adr/
    ├── 001-authentication-authorization.md
    └── 002-api-design-integration.md
```

## Quick Links

### API Documentation

| Document                                    | Description                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| [OpenAPI Specification](./api/openapi.yaml) | Complete REST API specification with all endpoints, schemas, and examples |
| [Integration Guide](./api/INTEGRATION.md)   | Practical guide for integrating with the API from the mobile app          |
| [Application Flows](./api/FLOWS.md)         | Visual flow diagrams for all user journeys and processes                  |

### Architecture Decision Records (ADRs)

| ADR                                                                                  | Status   | Summary                                                   |
| ------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------- |
| [ADR-001: Authentication & Authorization](./adr/001-authentication-authorization.md) | Accepted | JWT-based auth with role-based access control             |
| [ADR-002: API Design & Integration](./adr/002-api-design-integration.md)             | Accepted | RESTful API patterns with circuit breaker and retry logic |

## Application Overview

### User Roles

The application supports three user roles:

| Role           | Description          | Key Capabilities                                      |
| -------------- | -------------------- | ----------------------------------------------------- |
| **Admin**      | System administrator | Manage all users, clubs, and organization hierarchy   |
| **Club Admin** | Club administrator   | Manage club members, matches, fees, and notifications |
| **User**       | Regular member       | View matches, fees, and club members                  |

### Core Features

1. **Authentication & Registration**
   - Email/password authentication
   - Registration with approval workflow
   - Role-based access control

2. **Club Management**
   - SDA organizational hierarchy (Division → Union → Association → Church)
   - Club settings and configuration
   - Member management

3. **Match Generation**
   - Automated random matching algorithm
   - Configurable group sizes (2-4 participants)
   - Match lifecycle management

4. **Payment Management**
   - Monthly fee generation
   - Custom charges
   - Balance tracking
   - Payment status management

5. **Notifications**
   - WhatsApp integration for reminders
   - Push notifications
   - Bulk notification support

## API Endpoints Summary

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PATCH /auth/me` - Update current user

### Users

- `GET /users` - List users
- `GET /users/{id}` - Get user by ID
- `PATCH /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `POST /users/{id}/approve` - Approve user
- `POST /users/{id}/reject` - Reject user
- `POST /users/{id}/activate` - Activate user
- `POST /users/{id}/deactivate` - Deactivate user

### Clubs

- `GET /clubs` - List clubs
- `POST /clubs` - Create club
- `GET /clubs/{id}` - Get club by ID
- `PATCH /clubs/{id}` - Update club
- `DELETE /clubs/{id}` - Delete club
- `GET /clubs/{id}/members` - Get club members
- `POST /clubs/{id}/join` - Join club
- `POST /clubs/{id}/leave` - Leave club

### Matches

- `GET /matches` - List matches
- `GET /matches/me` - Get my matches
- `GET /matches/{id}` - Get match by ID
- `PATCH /matches/{id}` - Update match
- `PATCH /matches/{id}/status` - Update match status
- `POST /matches/generate` - Generate matches
- `GET /matches/rounds` - Get match rounds

### Payments

- `GET /payments` - Get club payments
- `POST /payments/generate` - Generate monthly fees
- `GET /payments/member/{id}` - Get member payments
- `PATCH /payments/{id}` - Update payment
- `GET /payments/balance/{id}` - Get member balance
- `GET /charges/custom` - Get custom charges
- `POST /charges/custom` - Create custom charge
- `DELETE /charges/custom/{id}` - Delete custom charge

### Notifications

- `POST /notifications/send` - Send notification
- `POST /notifications/bulk` - Send bulk notifications
- `POST /notifications/schedule` - Schedule notification
- `DELETE /notifications/scheduled/{id}` - Cancel scheduled notification

### Organization

- `GET /organization/divisions` - List divisions
- `GET /organization/unions` - List unions
- `GET /organization/associations` - List associations
- `GET /organization/churches` - List churches
- `GET /organization/hierarchy` - Get full hierarchy

## Development Mode

The application supports mock data mode for development:

```typescript
// In src/config/environment.ts
const environment = {
  apiUrl: 'http://localhost:3000/v1',
  useMockData: true, // Toggle mock mode
};
```

When `useMockData` is `true`:

- All API calls use local mock data
- No backend server required
- Artificial delays simulate network latency
- Data persists in memory/AsyncStorage

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [...],
    "requestId": "req_abc123",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

Common error codes:

- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource conflict
- `VALIDATION_ERROR` (422) - Invalid input
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests

## Testing with Mock Users

Default mock users for development:

| Email                   | Role            | Password |
| ----------------------- | --------------- | -------- |
| admin@sda.com           | Admin           | any      |
| clubadmin@sda.com       | Club Admin      | any      |
| pending1@sda.com        | User (Pending)  | any      |
| carlos.martinez@sda.com | User (Approved) | any      |

Note: In mock mode, any password works.

## Contributing

When adding new features:

1. Update the OpenAPI specification (`docs/api/openapi.yaml`)
2. Update the integration guide if needed (`docs/api/INTEGRATION.md`)
3. Add/update flow diagrams (`docs/api/FLOWS.md`)
4. Create ADRs for significant architecture decisions

## Version History

| Version | Date     | Changes                                               |
| ------- | -------- | ----------------------------------------------------- |
| 2.0.0   | Dec 2024 | Added payments, notifications, organization endpoints |
| 1.0.0   | Initial  | Authentication, users, clubs, matches                 |
