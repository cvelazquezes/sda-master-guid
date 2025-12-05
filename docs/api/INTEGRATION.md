# API Integration Guide

This document provides comprehensive guidance for integrating with the SDA Master Guid API.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [User Flows](#user-flows)
4. [Club Management](#club-management)
5. [Match Generation](#match-generation)
6. [Payment Management](#payment-management)
7. [Notifications](#notifications)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

---

## Getting Started

### Base URLs

| Environment | URL                                        |
| ----------- | ------------------------------------------ |
| Production  | `https://api.sdamasterguid.com/v1`         |
| Staging     | `https://api.staging.sdamasterguid.com/v1` |
| Development | `http://localhost:3000/v1`                 |

### Required Headers

```http
Content-Type: application/json
Authorization: Bearer <access_token>
X-App-Version: 1.0.0
X-Request-ID: req_<unique_id>
```

### SDK Integration

```typescript
import { apiService } from './services/api';
import { authService } from './services/authService';
import { clubService } from './services/clubService';
import { matchService } from './services/matchService';
import { paymentService } from './services/paymentService';
import { notificationService } from './services/notificationService';
```

---

## Authentication

### Login Flow

```typescript
// 1. Login with credentials
const { user, token } = await authService.login(email, password);

// 2. Check approval status
if (user.approvalStatus === 'pending') {
  // Show pending approval screen
  navigateTo('PendingApproval');
} else if (user.approvalStatus === 'approved') {
  // Navigate to main app
  navigateTo('Home');
} else {
  // User rejected - show message
  showMessage('Registration was rejected');
}
```

### Registration Flow

```typescript
// Regular user registration
const { user, token } = await authService.register(
  email,
  password,
  name,
  whatsappNumber,
  clubId,
  ['Friend', 'Companion'], // Pathfinder classes
  false // isClubAdmin
);

// Club admin registration
const { user, token } = await authService.register(
  email,
  password,
  name,
  whatsappNumber,
  clubId,
  [], // No classes for club admin
  true // isClubAdmin
);

// After registration, user has 'pending' status
// Navigate to pending approval screen
```

### Token Refresh

```typescript
// Automatically handled by API interceptors
// Manual refresh if needed:
const { accessToken, refreshToken } = await apiService.post('/auth/refresh', {
  refreshToken: currentRefreshToken,
});
```

### Logout

```typescript
await authService.logout();
// Clears tokens from secure storage
// Resets auth context
```

---

## User Flows

### Get Current User Profile

```typescript
const user = await authService.getCurrentUser();

// User object
{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'club_admin' | 'user';
  clubId: string | null;
  whatsappNumber: string;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  classes: PathfinderClass[];
  timezone: string;
  language: string;
}
```

### Update User Profile

```typescript
const updatedUser = await authService.updateUser({
  name: 'New Name',
  timezone: 'America/Mexico_City',
  language: 'es',
});
```

### User Approval Workflow (Club Admin / Admin)

```typescript
// Get pending users for club
const pendingUsers = await userService.getUsersByClub(clubId);
const pending = pendingUsers.filter((u) => u.approvalStatus === 'pending');

// Approve user
const approvedUser = await userService.approveUser(userId);
// Sets approvalStatus: 'approved' and isActive: true

// Reject user
const rejectedUser = await userService.rejectUser(userId);
// Sets approvalStatus: 'rejected' and isActive: false

// Deactivate approved user (temporary pause)
const deactivatedUser = await userService.deactivateUser(userId);
// Sets isActive: false (keeps approvalStatus: 'approved')

// Reactivate user
const activatedUser = await userService.activateUser(userId);
// Sets isActive: true
```

---

## Club Management

### List Clubs

```typescript
// Get all clubs
const clubs = await clubService.getAllClubs();

// Each club includes:
{
  id: string;
  name: string;
  description: string;
  adminId: string;
  isActive: boolean;
  matchFrequency: 'weekly' | 'biweekly' | 'monthly';
  groupSize: 2 | 3 | 4;
  church: string;
  association: string;
  union: string;
  division: string;
  feeSettings?: ClubFeeSettings;
  memberCount: number;
}
```

### Get Club Details

```typescript
const club = await clubService.getClub(clubId);
```

### Get Club Members

```typescript
const members = await clubService.getClubMembers(clubId);

// Filter by approval status
const approved = members.filter((m) => m.approvalStatus === 'approved');
const pending = members.filter((m) => m.approvalStatus === 'pending');
const active = members.filter((m) => m.isActive);
```

### Create Club (Admin Only)

```typescript
const newClub = await clubService.createClub(
  'Elphis Kalein', // name
  'Club de compañerismo', // description
  'weekly', // matchFrequency
  2, // groupSize
  'Iglesia Adventista de Narvarte', // church
  'Asociación Metropolitana Mexicana', // association
  'Unión Mexicana Central', // union
  'División Interamericana' // division
);
```

### Update Club Settings (Club Admin / Admin)

```typescript
const updatedClub = await clubService.updateClub(clubId, {
  matchFrequency: 'biweekly',
  groupSize: 3,
  feeSettings: {
    monthlyFeeAmount: 50.0,
    currency: 'MXN',
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isActive: true,
  },
});
```

---

## Match Generation

### Generate Match Round

```typescript
// Generate matches for all active, approved members
const matchRound = await matchService.generateMatches(clubId);

// Returns:
{
  id: string;
  clubId: string;
  matches: Match[];
  scheduledDate: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
}

// Each match:
{
  id: string;
  clubId: string;
  participants: string[]; // User IDs
  status: 'pending' | 'scheduled' | 'completed' | 'skipped' | 'cancelled';
  scheduledDate?: string;
}
```

### Match Generation Algorithm

```
1. Get all members where:
   - clubId matches
   - approvalStatus === 'approved'
   - isActive === true

2. Shuffle members randomly

3. Group into pairs/trios based on club.groupSize

4. Create Match records with status: 'pending'

5. Create MatchRound with all matches
```

### Get Club Matches

```typescript
// All club matches
const matches = await matchService.getMatches(clubId);

// User's own matches
const myMatches = await matchService.getMyMatches();

// Match rounds
const rounds = await matchService.getMatchRounds(clubId);
```

### Update Match

```typescript
// Schedule a match
const scheduled = await matchService.scheduleMatch(matchId, '2024-12-15T14:00:00Z');
// Sets scheduledDate and status: 'scheduled'

// Complete a match
const completed = await matchService.updateMatchStatus(matchId, 'completed');

// Skip a match
const skipped = await matchService.skipMatch(matchId);
// Sets status: 'skipped'
```

---

## Payment Management

### Generate Monthly Fees

```typescript
// Generate fees for all eligible members for a year
await paymentService.generateMonthlyFees(
  clubId,
  members, // Array of club members
  club.feeSettings, // Fee configuration
  2024 // Year
);

// This creates MemberPayment records for each:
// - Active month in feeSettings.activeMonths
// - Approved and active member
// - With status: 'pending'
```

### Get Club Payments

```typescript
// All payments for a club
const payments = await paymentService.getClubPayments(clubId);

// Filter by year
const payments2024 = await paymentService.getClubPayments(clubId, 2024);

// MemberPayment structure:
{
  id: string;
  userId: string;
  clubId: string;
  year: number;
  month: number; // 1-12
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'exempt';
  paidDate?: string;
  dueDate: string;
  notes?: string;
}
```

### Get Member Payments & Balance

```typescript
// Get all payments for a member
const memberPayments = await paymentService.getMemberPayments(userId, clubId);

// Get member's current balance
const balance = await paymentService.getMemberBalance(userId, clubId);

// MemberBalance structure:
{
  userId: string;
  clubId: string;
  totalOwed: number;     // Total amount of all charges
  totalPaid: number;     // Total amount paid
  balance: number;       // totalPaid - totalOwed (negative = owes money)
  pendingCharges: number;
  overdueCharges: number;
  lastPaymentDate?: string;
}
```

### Update Payment Status

```typescript
// Mark payment as paid
await paymentService.updatePaymentStatus(
  paymentId,
  'paid',
  new Date().toISOString(), // paidDate
  'Paid via bank transfer' // notes
);

// Mark as exempt
await paymentService.updatePaymentStatus(paymentId, 'exempt', undefined, 'Scholarship');
```

### Custom Charges

```typescript
// Create custom charge (e.g., camp fee, uniform, etc.)
const charge = await paymentService.createCustomCharge(
  clubId,
  'Uniforme de conquistador', // description
  150.0, // amount
  '2024-03-15T00:00:00Z', // dueDate
  [userId1, userId2, userId3], // appliedToUserIds
  currentUserId // createdBy (club admin)
);

// Get all custom charges for club
const customCharges = await paymentService.getClubCustomCharges(clubId);

// Delete custom charge
await paymentService.deleteCustomCharge(chargeId);
```

---

## Notifications

### Send WhatsApp Notification

```typescript
// Format payment reminder message
const message = notificationService.formatPaymentReminder(
  user, // User object
  balance, // MemberBalance object
  clubName // Club name string
);

// Send notification
const success = await notificationService.sendWhatsAppNotification(user, message);

// With confirmation dialog
await notificationService.confirmAndSend(
  user,
  message,
  () => console.log('Sent successfully'),
  () => console.log('Failed to send')
);
```

### Custom Charge Notification

```typescript
const message = notificationService.formatCustomChargeNotification(
  user,
  'Uniforme de conquistador', // description
  150.0, // amount
  '2024-03-15T00:00:00Z', // dueDate
  'Elphis Kalein' // clubName
);

await notificationService.sendWhatsAppNotification(user, message);
```

### Bulk Notifications

```typescript
// Prepare messages for each user
const messages = new Map<string, string>();
for (const user of users) {
  const balance = await paymentService.getMemberBalance(user.id, clubId);
  const message = notificationService.formatPaymentReminder(user, balance, clubName);
  messages.set(user.id, message);
}

// Send to all
const { success, failed } = await notificationService.sendBulkNotifications(
  users,
  messages,
  (current, total) => {
    setProgress((current / total) * 100);
  }
);
```

### Schedule Notification

```typescript
const notificationId = await notificationService.scheduleNotification(
  userId,
  'Payment Reminder', // title
  'Your payment is due soon!', // body
  new Date('2024-12-01') // scheduledDate
);

// Cancel if needed
await notificationService.cancelScheduledNotification(notificationId);
```

---

## Error Handling

### Error Types

```typescript
import {
  AuthenticationError, // 401 - Invalid credentials or expired token
  ForbiddenError, // 403 - Insufficient permissions
  NotFoundError, // 404 - Resource not found
  ConflictError, // 409 - Duplicate resource
  ValidationError, // 422 - Invalid input data
  RateLimitError, // 429 - Too many requests
  NetworkError, // Network connectivity issues
  TimeoutError, // Request timeout
} from '../utils/errors';
```

### Handling Errors

```typescript
try {
  const result = await someApiCall();
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Redirect to login
    navigation.navigate('Login');
  } else if (error instanceof ValidationError) {
    // Show validation errors
    setErrors(error.details);
  } else if (error instanceof RateLimitError) {
    // Show rate limit message
    Alert.alert('Too many requests', 'Please try again later');
  } else if (error instanceof NetworkError) {
    // Show offline message
    setOffline(true);
  } else {
    // Generic error
    Alert.alert('Error', error.message);
  }
}
```

### Retry Behavior

The API client automatically retries failed requests with exponential backoff:

- **Max Attempts**: 3
- **Retryable Errors**: Network errors, timeouts
- **Non-Retryable**: 4xx errors (except 429)
- **Backoff**: 1s → 2s → 4s

### Circuit Breaker

When the backend is consistently failing:

- Opens after 5 consecutive failures
- Fast-fails all requests for 30 seconds
- Allows test requests in half-open state
- Closes after 2 successful requests

---

## Best Practices

### 1. Always Check Approval Status

```typescript
// After login
if (user.approvalStatus !== 'approved') {
  navigation.navigate('PendingApproval');
  return;
}
```

### 2. Filter Active Members

```typescript
// For match generation, fees, etc.
const eligibleMembers = members.filter((m) => m.approvalStatus === 'approved' && m.isActive);
```

### 3. Handle Offline Mode

```typescript
// Check network before API calls
import NetInfo from '@react-native-community/netinfo';

const state = await NetInfo.fetch();
if (!state.isConnected) {
  // Show offline message or use cached data
}
```

### 4. Use Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const data = await apiCall();
    setData(data);
  } catch (err) {
    setError(err);
  } finally {
    setIsLoading(false);
  }
};
```

### 5. Validate Input Before Sending

```typescript
import { validateOrThrow, LoginSchema } from '../utils/validation';

// Throws ValidationError if invalid
const validatedData = validateOrThrow(LoginSchema, { email, password });
```

### 6. Log Important Operations

```typescript
import { logger } from '../utils/logger';

logger.info('Payment marked as paid', { paymentId, userId });
logger.error('Failed to generate matches', error, { clubId });
```

### 7. Use Environment Configuration

```typescript
import { environment } from '../config/environment';

// Toggle between mock and real API
if (environment.useMockData) {
  // Development mode
} else {
  // Production mode
}
```

---

## API Reference

For complete API documentation, see:

- [OpenAPI Specification](./openapi.yaml)
- [Postman Collection](./postman-collection.json) (if available)

## Related Documentation

- [ADR-001: Authentication & Authorization](../adr/001-authentication-authorization.md)
- [ADR-002: API Design & Integration](../adr/002-api-design-integration.md)
- [Application Flows](./FLOWS.md)
