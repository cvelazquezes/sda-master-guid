# User Approval Feature

## Overview

This document describes the implementation of the user approval workflow where new user registrations are pending until approved by a club administrator.

## Feature Description

When a user registers for the app:

1. Their account is created with `approvalStatus: 'pending'`
2. They are shown a "Pending Approval" screen explaining the next steps
3. Club administrators can see pending members in a dedicated tab
4. Club administrators can approve or reject pending members
5. Once approved, users can access the full app functionality

## Implementation Details

### 1. Data Model Changes

#### User Type Enhancement (`src/types/index.ts`)

Added a new enum and field to the User interface:

```typescript
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface User {
  // ... existing fields ...
  approvalStatus: ApprovalStatus; // New field
}
```

### 2. Registration Flow

#### Updated Registration (`src/services/authService.ts`)

- New users are created with `approvalStatus: 'pending'`
- New users are created with `isActive: false`
- Registration completes successfully but user sees pending screen

```typescript
const newUser: User = {
  // ... other fields ...
  isActive: false, // Inactive until approved
  approvalStatus: 'pending', // Pending approval by club admin
};
```

### 3. User Experience

#### Pending Approval Screen (`src/screens/auth/PendingApprovalScreen.tsx`)

New screen shown to users with pending approval status:

- Shows user's registration details
- Explains the approval process (3 steps)
- Displays estimated processing time
- Provides logout option

Features:

- User information display (email, WhatsApp)
- Clear step-by-step explanation of what happens next
- Professional UI with Material Community Icons
- Logout functionality

### 4. Club Admin Interface

#### Enhanced Club Members Screen (`src/screens/club-admin/ClubMembersScreen.tsx`)

Added two tabs:

1. **Approved Members Tab**
   - Shows all approved members
   - Existing functionality (pause/resume, delete)
   - Filter by active/paused status

2. **Pending Members Tab** (NEW)
   - Shows all pending approval requests
   - Displays member information prominently
   - Two action buttons per member:
     - **Approve**: Activates the member
     - **Reject**: Rejects the application

Features:

- Badge indicator showing number of pending approvals
- Special card design for pending members (orange accent)
- WhatsApp contact information displayed
- Confirmation dialogs for approve/reject actions

### 5. Service Layer Updates

#### User Service (`src/services/userService.ts`)

Added two new methods:

```typescript
async approveUser(userId: string): Promise<User> {
  return this.updateUser(userId, {
    approvalStatus: 'approved',
    isActive: true
  });
}

async rejectUser(userId: string): Promise<User> {
  return this.updateUser(userId, {
    approvalStatus: 'rejected',
    isActive: false
  });
}
```

#### Match Service (`src/services/matchService.ts`)

Updated to only include approved members in matches:

```typescript
const members = getUsersByClub(clubId).filter(
  (u) => u.isActive && !u.isPaused && u.approvalStatus === 'approved'
);
```

#### Club Service (`src/services/clubService.ts`)

Updated member count to only count approved members:

```typescript
const approvedMembers = getUsersByClub(clubId).filter((u) => u.approvalStatus === 'approved');
return { ...club, memberCount: approvedMembers.length };
```

### 6. Navigation Updates

#### App Navigator (`src/navigation/AppNavigator.tsx`)

Added logic to route users based on approval status:

```typescript
const getNavigationStack = () => {
  if (!user) {
    return <AuthStack />;
  }

  // If user has pending approval status, show pending screen
  if (user.approvalStatus === 'pending') {
    return <PendingStack />;
  }

  // If user is rejected, redirect to auth
  if (user.approvalStatus === 'rejected') {
    return <AuthStack />;
  }

  // Otherwise show normal app
  return <AppStack />;
};
```

### 7. Mock Data Updates

#### Updated Mock Users (`src/services/mockData.ts`)

- All existing users marked as `approved`
- Added 3 new pending users for testing:
  - Sarah Johnson (pending, Club 1)
  - Michael Brown (pending, Club 1)
  - Emily Davis (pending, Club 4)

## Testing

### Test Scenarios

1. **New User Registration**
   - Register a new user
   - Verify redirect to Pending Approval Screen
   - Verify user can logout

2. **Club Admin Approval**
   - Login as club admin (clubadmin@sda.com)
   - Navigate to Club Members
   - Switch to "Pending" tab
   - Verify pending members are displayed
   - Approve a pending member
   - Verify member moves to Approved tab

3. **Club Admin Rejection**
   - Login as club admin
   - Navigate to Pending tab
   - Reject a pending member
   - Verify member is removed

4. **Approved User Login**
   - Login as approved user (user@sda.com)
   - Verify full app access

5. **Pending User Login**
   - Login with pending user credentials:
     - pending1@sda.com
     - pending2@sda.com
     - pending3@sda.com
   - Verify Pending Approval Screen is shown

### Test Credentials

**Club Admin:**

- Email: clubadmin@sda.com
- Password: any (mock mode)

**Approved User:**

- Email: user@sda.com
- Password: any (mock mode)

**Pending Users:**

- Email: pending1@sda.com (Sarah Johnson)
- Email: pending2@sda.com (Michael Brown)
- Email: pending3@sda.com (Emily Davis)
- Password: any (mock mode)

## UI Components

### Color Scheme

- **Pending Status**: Orange (#FF9800)
- **Approved Status**: Green (#4caf50)
- **Rejected Status**: Red (#f44336)
- **Primary**: Purple (#6200ee)

### Icons Used

- `clock-alert-outline`: Pending status
- `account-check`: Approved members
- `account-clock`: Pending member card
- `check-circle`: Approve action
- `close-circle`: Reject action
- `whatsapp`: WhatsApp contact

## Future Enhancements

1. **Email Notifications**
   - Send email when user registers (to club admin)
   - Send email when user is approved/rejected

2. **WhatsApp Notifications**
   - Automated WhatsApp message on approval
   - Link to download app or login

3. **Approval History**
   - Track who approved/rejected
   - Timestamp of actions
   - Audit log

4. **Bulk Actions**
   - Approve multiple users at once
   - Export pending users list

5. **Custom Rejection Messages**
   - Allow club admin to add reason for rejection
   - Display reason to rejected users

6. **Auto-expiry**
   - Automatically expire pending applications after X days
   - Send reminder to club admin

## API Integration Notes

For production implementation with real API:

1. **POST /auth/register**
   - Should create user with `approvalStatus: 'pending'`
   - Should return user object with pending status

2. **PATCH /users/:userId**
   - Support updating `approvalStatus` field
   - Only allow club admins to modify approval status
   - Validate that user belongs to admin's club

3. **GET /clubs/:clubId/members**
   - Return all members (pending and approved)
   - Frontend handles filtering

4. **Notifications**
   - Trigger notification on user registration
   - Trigger notification on approval/rejection

## Security Considerations

1. **Authorization**
   - Only club admins can approve/reject members
   - Users can only be approved for their own club
   - Regular users cannot see pending members

2. **Validation**
   - Validate user belongs to correct club
   - Prevent self-approval
   - Prevent status manipulation by regular users

3. **Rate Limiting**
   - Limit registration attempts
   - Limit approval/rejection actions

## Database Schema Considerations

```sql
-- Add approval_status column to users table
ALTER TABLE users ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE users ADD CONSTRAINT check_approval_status
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Add index for filtering
CREATE INDEX idx_users_approval_status ON users(approval_status);
CREATE INDEX idx_users_club_approval ON users(club_id, approval_status);
```

## Conclusion

This feature provides a robust user approval workflow that:

- ✅ Prevents unauthorized access to club features
- ✅ Gives club admins control over membership
- ✅ Provides clear feedback to users
- ✅ Maintains data integrity
- ✅ Scales well with multiple clubs
- ✅ Follows best practices for user management
