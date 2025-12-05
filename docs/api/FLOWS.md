# Application Flows

This document describes all user journeys and application flows in the SDA Master Guid system.

## Table of Contents

1. [Authentication Flows](#authentication-flows)
2. [User Management Flows](#user-management-flows)
3. [Club Management Flows](#club-management-flows)
4. [Match Generation Flows](#match-generation-flows)
5. [Payment Flows](#payment-flows)
6. [Notification Flows](#notification-flows)
7. [Navigation Flows](#navigation-flows)

---

## Authentication Flows

### 1. Login Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            LOGIN FLOW                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  User   │────►│ Login Form  │────►│  Validate    │────►│ Check User  │
│ Opens   │     │ Email/Pass  │     │ Credentials  │     │   Status    │
│  App    │     └─────────────┘     └──────────────┘     └──────┬──────┘
└─────────┘                                                      │
                                                                 ▼
                    ┌────────────────────────────────────────────┴───────┐
                    │                                                    │
                    ▼                                                    ▼
            ┌───────────────┐                                  ┌─────────────────┐
            │ approvalStatus│                                  │ approvalStatus  │
            │ === 'pending' │                                  │ === 'approved'  │
            └───────┬───────┘                                  └────────┬────────┘
                    │                                                   │
                    ▼                                                   ▼
            ┌───────────────┐                                  ┌─────────────────┐
            │   Pending     │                                  │   Main App      │
            │   Approval    │                                  │   (Dashboard)   │
            │   Screen      │                                  │                 │
            └───────────────┘                                  └─────────────────┘
                                                                        │
                                                                        ▼
                                                               ┌─────────────────┐
                                                               │  Role-based     │
                                                               │  Navigation     │
                                                               │                 │
                                                               │ admin ─► Admin  │
                                                               │ club_admin ─►   │
                                                               │   ClubAdmin     │
                                                               │ user ─► User    │
                                                               └─────────────────┘
```

### 2. Registration Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        REGISTRATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  User   │────►│  Select     │────►│  Enter       │────►│  Enter      │
│ Opens   │     │  Club       │     │  Personal    │     │  Pathfinder │
│Register │     │             │     │  Info        │     │  Classes    │
└─────────┘     └─────────────┘     └──────────────┘     └──────┬──────┘
                                                                 │
                                                                 ▼
                                                        ┌─────────────────┐
                                                        │  Is Club Admin? │
                                                        └────────┬────────┘
                                                                 │
                              ┌──────────────────────────────────┼────────────────┐
                              ▼                                  ▼                │
                      ┌───────────────┐                 ┌─────────────────┐      │
                      │ isClubAdmin:  │                 │ isClubAdmin:    │      │
                      │    false      │                 │    true         │      │
                      └───────┬───────┘                 └────────┬────────┘      │
                              │                                  │               │
                              ▼                                  ▼               │
                      ┌───────────────┐                 ┌─────────────────┐      │
                      │ Create User   │                 │ Create User     │      │
                      │ role: 'user'  │                 │ role: 'club_    │      │
                      │ classes: [...]│                 │       admin'    │      │
                      └───────┬───────┘                 │ classes: []     │      │
                              │                         └────────┬────────┘      │
                              │                                  │               │
                              └───────────────┬──────────────────┘               │
                                              ▼                                  │
                                      ┌───────────────┐                          │
                                      │ approvalStatus│                          │
                                      │ = 'pending'   │                          │
                                      │ isActive:false│                          │
                                      └───────┬───────┘                          │
                                              │                                  │
                                              ▼                                  │
                                      ┌───────────────┐                          │
                                      │ Show Pending  │                          │
                                      │ Approval      │                          │
                                      │ Screen        │                          │
                                      └───────────────┘                          │
                                                                                 │
                 ┌───────────────────────────────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ APPROVAL BY:  │
         │               │
         │ user ─────►   │
         │   club_admin  │
         │               │
         │ club_admin ─► │
         │   admin       │
         └───────────────┘
```

### 3. Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      TOKEN REFRESH FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│ API Request │────►│   401       │────►│  Check       │
│             │     │ Unauthorized│     │  Refresh     │
│             │     │             │     │  Token       │
└─────────────┘     └─────────────┘     └──────┬───────┘
                                               │
                           ┌───────────────────┼───────────────────┐
                           ▼                   │                   ▼
                   ┌───────────────┐           │           ┌───────────────┐
                   │ Token Valid   │           │           │ Token Invalid │
                   └───────┬───────┘           │           └───────┬───────┘
                           │                   │                   │
                           ▼                   │                   ▼
                   ┌───────────────┐           │           ┌───────────────┐
                   │ POST /auth/   │           │           │ Clear Auth    │
                   │    refresh    │           │           │ Navigate to   │
                   └───────┬───────┘           │           │ Login         │
                           │                   │           └───────────────┘
                           ▼                   │
                   ┌───────────────┐           │
                   │ Store New     │           │
                   │ Tokens        │           │
                   └───────┬───────┘           │
                           │                   │
                           ▼                   │
                   ┌───────────────┐           │
                   │ Retry         │           │
                   │ Original      │           │
                   │ Request       │           │
                   └───────────────┘           │
```

---

## User Management Flows

### 4. User Approval Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      USER APPROVAL FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌───────────────────────────────────────┐
                    │        New User Registered            │
                    │   (approvalStatus: 'pending')         │
                    └──────────────────┬────────────────────┘
                                       │
                                       ▼
                    ┌───────────────────────────────────────┐
                    │       Notification Sent to            │
                    │       Approver (Club Admin/Admin)     │
                    └──────────────────┬────────────────────┘
                                       │
                                       ▼
                    ┌───────────────────────────────────────┐
                    │        Approver Reviews               │
                    │        User Information               │
                    └──────────────────┬────────────────────┘
                                       │
                       ┌───────────────┴───────────────┐
                       │                               │
                       ▼                               ▼
              ┌─────────────────┐            ┌─────────────────┐
              │     APPROVE     │            │     REJECT      │
              │                 │            │                 │
              │ POST /users/    │            │ POST /users/    │
              │   {id}/approve  │            │   {id}/reject   │
              └────────┬────────┘            └────────┬────────┘
                       │                              │
                       ▼                              ▼
              ┌─────────────────┐            ┌─────────────────┐
              │ approvalStatus: │            │ approvalStatus: │
              │   'approved'    │            │   'rejected'    │
              │ isActive: true  │            │ isActive: false │
              └────────┬────────┘            └────────┬────────┘
                       │                              │
                       ▼                              ▼
              ┌─────────────────┐            ┌─────────────────┐
              │ User notified   │            │ User notified   │
              │ Can access app  │            │ Cannot access   │
              └─────────────────┘            └─────────────────┘
```

### 5. User Status Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   USER STATUS MANAGEMENT                                 │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │  APPROVED USER  │
                              │  isActive: true │
                              └────────┬────────┘
                                       │
               ┌───────────────────────┼───────────────────────┐
               │                       │                       │
               ▼                       ▼                       ▼
      ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
      │   DEACTIVATE    │    │  PARTICIPATION  │    │    DELETE       │
      │                 │    │  IN ACTIVITIES  │    │   (Soft)        │
      │ POST /users/    │    │                 │    │                 │
      │  {id}/deactivate│    │ - Matches ✓     │    │ DELETE /users/  │
      └────────┬────────┘    │ - Fees ✓        │    │    {id}         │
               │             │ - Notifications │    └────────┬────────┘
               ▼             │   ✓             │             │
      ┌─────────────────┐    └─────────────────┘             ▼
      │ isActive: false │                           ┌─────────────────┐
      │                 │                           │ User removed    │
      │ User cannot:    │                           │ Data preserved  │
      │ - Login         │                           │ for audit       │
      │ - Be in matches │                           └─────────────────┘
      │ - Receive notif │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │   REACTIVATE    │
      │                 │
      │ POST /users/    │
      │  {id}/activate  │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ isActive: true  │
      │ Full access     │
      │ restored        │
      └─────────────────┘
```

---

## Club Management Flows

### 6. Club Creation Flow (Admin Only)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CLUB CREATION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Admin  │────►│ Enter Club  │────►│ Select SDA   │────►│ Configure   │
│ Opens   │     │ Name &      │     │ Hierarchy    │     │ Settings    │
│ Create  │     │ Description │     │              │     │             │
└─────────┘     └─────────────┘     └──────────────┘     └──────┬──────┘
                                                                 │
                                                                 ▼
                                    ┌─────────────────────────────────────┐
                                    │         SDA HIERARCHY               │
                                    │                                     │
                                    │  División Interamericana            │
                                    │    └── Unión Mexicana Central       │
                                    │          └── Asociación Metro.      │
                                    │                └── Iglesia Narvarte │
                                    └─────────────────────────────────────┘
                                                                 │
                                                                 ▼
                                    ┌─────────────────────────────────────┐
                                    │         CLUB SETTINGS               │
                                    │                                     │
                                    │  matchFrequency: weekly/biweekly/   │
                                    │                   monthly           │
                                    │  groupSize: 2/3/4                   │
                                    │  feeSettings: {                     │
                                    │    monthlyFeeAmount: 50.00          │
                                    │    currency: 'MXN'                  │
                                    │    activeMonths: [1,2,3,...,10]     │
                                    │    isActive: true                   │
                                    │  }                                  │
                                    └─────────────────────────────────────┘
                                                                 │
                                                                 ▼
                                    ┌─────────────────────────────────────┐
                                    │        POST /clubs                  │
                                    │                                     │
                                    │   Creates new club                  │
                                    │   Returns club with ID              │
                                    └─────────────────────────────────────┘
```

### 7. Club Membership Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   CLUB MEMBERSHIP FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌───────────────────────────────┐
                        │    User Selects Club          │
                        │    During Registration        │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │   User Created with clubId    │
                        │   approvalStatus: 'pending'   │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │   Club Admin Approves User    │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │   User is Club Member         │
                        │   - Sees club members         │
                        │   - Participates in matches   │
                        │   - Has fees assigned         │
                        └───────────────────────────────┘


                              LEAVING A CLUB

                        ┌───────────────────────────────┐
                        │   POST /clubs/{id}/leave      │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │   User's clubId set to null   │
                        │   Cannot participate until    │
                        │   joining new club            │
                        └───────────────────────────────┘
```

---

## Match Generation Flows

### 8. Match Generation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MATCH GENERATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────────────────────────────────────────────┐
│ Club Admin  │────►│         POST /matches/generate                      │
│ Initiates   │     │              { clubId }                             │
│ Generation  │     └────────────────────────┬────────────────────────────┘
└─────────────┘                              │
                                             ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   1. FETCH ELIGIBLE MEMBERS                         │
                     │                                                     │
                     │   SELECT * FROM users                               │
                     │   WHERE clubId = :clubId                            │
                     │     AND approvalStatus = 'approved'                 │
                     │     AND isActive = true                             │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   2. VALIDATE MEMBER COUNT                          │
                     │                                                     │
                     │   IF members.length < club.groupSize                │
                     │     THROW ValidationError(                          │
                     │       "Not enough active members"                   │
                     │     )                                               │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   3. SHUFFLE MEMBERS                                │
                     │                                                     │
                     │   shuffled = members.sort(() => Math.random() - 0.5)│
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   4. GROUP INTO MATCHES                             │
                     │                                                     │
                     │   groupSize = 2 (pairs) or 3 (trios)                │
                     │                                                     │
                     │   [A, B, C, D, E, F] with groupSize=2               │
                     │        ↓                                            │
                     │   Match 1: [A, B]                                   │
                     │   Match 2: [C, D]                                   │
                     │   Match 3: [E, F]                                   │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   5. CREATE MATCH RECORDS                           │
                     │                                                     │
                     │   Match {                                           │
                     │     id: auto-generated                              │
                     │     clubId: clubId                                  │
                     │     participants: [userId1, userId2]                │
                     │     status: 'pending'                               │
                     │   }                                                 │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   6. CREATE MATCH ROUND                             │
                     │                                                     │
                     │   MatchRound {                                      │
                     │     id: auto-generated                              │
                     │     clubId: clubId                                  │
                     │     matches: [match1, match2, match3]               │
                     │     scheduledDate: now + 7 days                     │
                     │     status: 'active'                                │
                     │   }                                                 │
                     └─────────────────────────────────────────────────────┘
```

### 9. Match Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      MATCH LIFECYCLE                                     │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │     PENDING     │ ◄── Initial state
                              │                 │
                              └────────┬────────┘
                                       │
                   ┌───────────────────┼───────────────────┐
                   │                   │                   │
                   ▼                   ▼                   ▼
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │   SCHEDULED     │ │    SKIPPED      │ │   CANCELLED     │
          │                 │ │                 │ │                 │
          │ scheduledDate   │ │ Participants    │ │ Admin cancelled │
          │ is set          │ │ unavailable     │ │                 │
          └────────┬────────┘ └─────────────────┘ └─────────────────┘
                   │                 (final)            (final)
                   │
                   ▼
          ┌─────────────────┐
          │   COMPLETED     │
          │                 │
          │ Meeting took    │
          │ place           │
          └─────────────────┘
               (final)


         STATE TRANSITIONS:

         pending   ─► scheduled  (scheduleMatch)
         pending   ─► skipped    (skipMatch)
         pending   ─► cancelled  (updateMatchStatus)
         scheduled ─► completed  (updateMatchStatus)
         scheduled ─► skipped    (skipMatch)
         scheduled ─► cancelled  (updateMatchStatus)
```

---

## Payment Flows

### 10. Monthly Fee Generation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  MONTHLY FEE GENERATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────────────────────────────────────────────┐
│ Club Admin  │────►│  paymentService.generateMonthlyFees(                │
│ Initiates   │     │    clubId, members, feeSettings, year               │
│ Generation  │     │  )                                                  │
└─────────────┘     └────────────────────────┬────────────────────────────┘
                                             │
                                             ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   1. FILTER ELIGIBLE MEMBERS                        │
                     │                                                     │
                     │   eligibleMembers = members.filter(m =>             │
                     │     m.approvalStatus === 'approved' &&              │
                     │     m.isActive === true                             │
                     │   )                                                 │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   2. FOR EACH MEMBER AND ACTIVE MONTH               │
                     │                                                     │
                     │   activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]     │
                     │                                                     │
                     │   for member in eligibleMembers:                    │
                     │     for month in activeMonths:                      │
                     │       if not exists(member, month, year):           │
                     │         createPayment(member, month, year)          │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   3. CREATE PAYMENT RECORD                          │
                     │                                                     │
                     │   MemberPayment {                                   │
                     │     id: auto-generated                              │
                     │     userId: member.id                               │
                     │     clubId: clubId                                  │
                     │     year: 2024                                      │
                     │     month: 1-12                                     │
                     │     amount: feeSettings.monthlyFeeAmount            │
                     │     status: 'pending'                               │
                     │     dueDate: lastDayOfMonth                         │
                     │   }                                                 │
                     └─────────────────────────────────────────────────────┘
```

### 11. Payment Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PAYMENT LIFECYCLE                                   │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │     PENDING     │ ◄── Initial state
                              │                 │
                              └────────┬────────┘
                                       │
                   ┌───────────────────┼───────────────────┐
                   │                   │                   │
                   ▼                   ▼                   ▼
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │      PAID       │ │    OVERDUE      │ │     EXEMPT      │
          │                 │ │                 │ │                 │
          │ paidDate set    │ │ dueDate passed  │ │ Scholarship,    │
          │ Payment         │ │ Auto-updated    │ │ waived fee      │
          │ received        │ │ by system       │ │                 │
          └─────────────────┘ └────────┬────────┘ └─────────────────┘
               (final)                 │              (final)
                                       │
                                       ▼
                              ┌─────────────────┐
                              │      PAID       │
                              │                 │
                              │ Late payment    │
                              │ received        │
                              └─────────────────┘
                                   (final)


         BALANCE CALCULATION:

         balance = totalPaid - totalOwed

         balance < 0  ─► User owes money
         balance = 0  ─► User is current
         balance > 0  ─► User has credit
```

### 12. Custom Charge Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CUSTOM CHARGE FLOW                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────────────────────────────────────────────┐
│ Club Admin  │────►│  Enter Charge Details                               │
│ Creates     │     │  - Description (e.g., "Camp Fee")                   │
│ Charge      │     │  - Amount                                           │
│             │     │  - Due Date                                         │
│             │     │  - Select Members                                   │
└─────────────┘     └────────────────────────┬────────────────────────────┘
                                             │
                                             ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   1. CREATE CUSTOM CHARGE                           │
                     │                                                     │
                     │   CustomCharge {                                    │
                     │     id: auto-generated                              │
                     │     clubId: clubId                                  │
                     │     description: "Camp Fee"                         │
                     │     amount: 200.00                                  │
                     │     type: 'custom'                                  │
                     │     appliedToUserIds: [user1, user2, user3]         │
                     │     dueDate: "2024-06-01"                           │
                     │     isActive: true                                  │
                     │     createdBy: clubAdminId                          │
                     │   }                                                 │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   2. CREATE PAYMENT RECORDS FOR SELECTED MEMBERS    │
                     │                                                     │
                     │   for userId in appliedToUserIds:                   │
                     │     MemberPayment {                                 │
                     │       userId: userId                                │
                     │       clubId: clubId                                │
                     │       amount: charge.amount                         │
                     │       status: 'pending'                             │
                     │       dueDate: charge.dueDate                       │
                     │       notes: charge.description                     │
                     │     }                                               │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   3. OPTIONAL: SEND NOTIFICATIONS                   │
                     │                                                     │
                     │   for user in selectedUsers:                        │
                     │     notificationService.sendWhatsAppNotification(   │
                     │       user,                                         │
                     │       formatCustomChargeNotification(...)           │
                     │     )                                               │
                     └─────────────────────────────────────────────────────┘
```

---

## Notification Flows

### 13. Payment Reminder Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   PAYMENT REMINDER FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────────────────────────────────────────────┐
│ Club Admin  │────►│  Select Members with Outstanding Balance            │
│ Initiates   │     │                                                     │
│ Reminders   │     │  members.filter(m => balance.balance < 0)           │
└─────────────┘     └────────────────────────┬────────────────────────────┘
                                             │
                                             ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   FOR EACH MEMBER                                   │
                     │                                                     │
                     │   1. Get member balance                             │
                     │   2. Format reminder message                        │
                     │   3. Send via WhatsApp                              │
                     └────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   MESSAGE FORMAT                                    │
                     │                                                     │
                     │   🏕️ *{clubName}*                                   │
                     │                                                     │
                     │   Hola {userName},                                  │
                     │                                                     │
                     │   📊 *Estado de tu cuenta:*                         │
                     │                                                     │
                     │   💰 Total adeudado: ${totalOwed}                   │
                     │   ✅ Total pagado: ${totalPaid}                     │
                     │   📍 *Saldo pendiente: ${balance}*                  │
                     │                                                     │
                     │   ⚠️ *Cargos vencidos: ${overdueCharges}*          │
                     │                                                     │
                     │   Gracias por tu participación! 🙏                  │
                     └─────────────────────────────────────────────────────┘
                                              │
                                              ▼
                     ┌─────────────────────────────────────────────────────┐
                     │   DELIVERY                                          │
                     │                                                     │
                     │   Mock Mode:                                        │
                     │     Opens WhatsApp app with pre-filled message      │
                     │                                                     │
                     │   Production Mode:                                  │
                     │     Sends via WhatsApp Business API                 │
                     └─────────────────────────────────────────────────────┘
```

---

## Navigation Flows

### 14. Role-Based Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ROLE-BASED NAVIGATION                                 │
└─────────────────────────────────────────────────────────────────────────┘


                    ADMIN NAVIGATION
                    ════════════════

                    ┌─────────────────────────────────────────────┐
                    │  Bottom Tabs                                │
                    │                                             │
                    │  [Home] [Users] [Clubs] [More]              │
                    └─────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────────────────────────────┐
                    │  Stack Screens                              │
                    │                                             │
                    │  - UsersManagement                          │
                    │  - ClubsManagement                          │
                    │  - OrganizationManagement                   │
                    │  - Account (modal)                          │
                    │  - Notifications (modal)                    │
                    └─────────────────────────────────────────────┘


                    CLUB ADMIN NAVIGATION
                    ════════════════════

                    ┌─────────────────────────────────────────────┐
                    │  Bottom Tabs                                │
                    │                                             │
                    │  [Home] [Members] [Meetings] [Finances]     │
                    │  [More]                                     │
                    └─────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────────────────────────────┐
                    │  Stack Screens                              │
                    │                                             │
                    │  - ClubSettings                             │
                    │  - ClubMatches                              │
                    │  - GenerateMatches                          │
                    │  - ClubDirective                            │
                    │  - MyFees                                   │
                    │  - Account (modal)                          │
                    │  - Notifications (modal)                    │
                    └─────────────────────────────────────────────┘


                    USER NAVIGATION
                    ════════════════

                    ┌─────────────────────────────────────────────┐
                    │  Bottom Tabs                                │
                    │                                             │
                    │  [Home] [Members] [Meetings] [Finances]     │
                    │  [More]                                     │
                    └─────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────────────────────────────┐
                    │  Stack Screens                              │
                    │                                             │
                    │  - MyFees                                   │
                    │  - Account (modal)                          │
                    │  - Notifications (modal)                    │
                    └─────────────────────────────────────────────┘
```

### 15. Auth State Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   AUTH STATE NAVIGATION                                  │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────────┐
                    │             APP START                       │
                    └────────────────────┬────────────────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────────┐
                    │        Check Stored Auth Token              │
                    └────────────────────┬────────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         │                               │
                         ▼                               ▼
                ┌─────────────────┐            ┌─────────────────┐
                │  No Token       │            │  Token Found    │
                │                 │            │                 │
                │  ─► AuthStack   │            │  ─► Validate    │
                │     (Login)     │            │     Token       │
                └─────────────────┘            └────────┬────────┘
                                                        │
                                        ┌───────────────┴───────────────┐
                                        │                               │
                                        ▼                               ▼
                               ┌─────────────────┐            ┌─────────────────┐
                               │  Token Invalid  │            │  Token Valid    │
                               │                 │            │                 │
                               │  ─► AuthStack   │            │  ─► Load User   │
                               │     (Login)     │            │                 │
                               └─────────────────┘            └────────┬────────┘
                                                                       │
                                                       ┌───────────────┴───────────┐
                                                       │                           │
                                                       ▼                           ▼
                                              ┌─────────────────┐        ┌─────────────────┐
                                              │ approvalStatus  │        │ approvalStatus  │
                                              │ === 'pending'   │        │ === 'approved'  │
                                              │                 │        │                 │
                                              │ ─► PendingStack │        │ ─► AppStack     │
                                              │    (Waiting)    │        │    (Main App)   │
                                              └─────────────────┘        └─────────────────┘
```

---

## Summary

This document covers all major application flows:

| Flow Category   | Flows Covered                             |
| --------------- | ----------------------------------------- |
| Authentication  | Login, Registration, Token Refresh        |
| User Management | Approval, Status Management               |
| Club Management | Creation, Membership                      |
| Matches         | Generation, Lifecycle                     |
| Payments        | Fee Generation, Custom Charges, Lifecycle |
| Notifications   | Payment Reminders                         |
| Navigation      | Role-based, Auth State                    |

For implementation details, see:

- [API Integration Guide](./INTEGRATION.md)
- [OpenAPI Specification](./openapi.yaml)
- [ADR-001: Authentication](../adr/001-authentication-authorization.md)
- [ADR-002: API Design](../adr/002-api-design-integration.md)
