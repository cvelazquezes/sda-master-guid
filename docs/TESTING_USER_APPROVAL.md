# Testing the User Approval Feature

## Quick Start Guide

This guide will help you test the newly implemented user approval feature.

## Overview

The user approval feature ensures that when users register, their accounts are pending until a club administrator approves them.

## Test Scenarios

### Scenario 1: New User Registration

1. **Start the app** (if not already running):

   ```bash
   npm start
   ```

2. **Open the app** on your device or emulator

3. **Navigate to Register screen**
   - Click "Register" on the login screen

4. **Fill in registration form**:
   - Name: Test User
   - Email: testuser@sda.com
   - WhatsApp: +1 555 999 8888
   - Select any club through the hierarchy
   - Password: test123
   - Confirm Password: test123

5. **Submit registration**
   - Click "Register" button

6. **Expected Result**:
   - ✅ You should see the "Pending Approval Screen"
   - ✅ Screen shows your name and contact info
   - ✅ Shows 3-step process explanation
   - ✅ Has a logout button

### Scenario 2: Login as Pending User

1. **Logout** from the pending approval screen

2. **Login with pending credentials**:
   - Email: `pending1@sda.com`
   - Password: any password (we're in mock mode)

3. **Expected Result**:
   - ✅ Should see the "Pending Approval Screen" again
   - ✅ Cannot access main app features

### Scenario 3: Club Admin Views Pending Members

1. **Logout** if logged in

2. **Login as Club Admin**:
   - Email: `clubadmin@sda.com`
   - Password: any password

3. **Navigate to Club Admin section**:
   - Click on "Club Admin" tab at the bottom
   - Click on "Manage Members" card

4. **View Pending Members**:
   - You should see two tabs: "Approved" and "Pending"
   - The "Pending" tab should have a badge showing the count
   - Click on "Pending" tab

5. **Expected Result**:
   - ✅ See list of pending members (Sarah Johnson, Michael Brown)
   - ✅ Each member card shows:
     - Name
     - Email
     - WhatsApp number
     - Two buttons: "Reject" and "Approve"

### Scenario 4: Approve a Pending Member

1. **While viewing pending members** (from Scenario 3):
   - Click "Approve" button on Sarah Johnson's card

2. **Confirm approval**:
   - Click "Approve" in the confirmation dialog

3. **Expected Result**:
   - ✅ Success alert: "Sarah Johnson has been approved!"
   - ✅ Sarah Johnson disappears from Pending tab
   - ✅ Pending count badge decreases
   - ✅ Switch to "Approved" tab to see Sarah Johnson there

### Scenario 5: Reject a Pending Member

1. **Go back to Pending tab**

2. **Click "Reject"** on Michael Brown's card

3. **Confirm rejection**:
   - Click "Reject" in the confirmation dialog

4. **Expected Result**:
   - ✅ Success alert: "Michael Brown's application has been rejected"
   - ✅ Michael Brown disappears from the list
   - ✅ Pending count badge decreases

### Scenario 6: Approved User Can Login

1. **Logout** from club admin

2. **Login as approved user**:
   - Email: `user@sda.com`
   - Password: any password

3. **Expected Result**:
   - ✅ Full access to the app
   - ✅ See Home, Matches, and Settings tabs
   - ✅ Can view matches and participate in chats

### Scenario 7: Newly Approved User Logs In

1. **Logout**

2. **Login as Sarah Johnson** (who we approved in Scenario 4):
   - Email: `pending1@sda.com`
   - Password: any password

3. **Expected Result**:
   - ✅ Full access to the app (no longer pending)
   - ✅ Can see all features

## Test Accounts

### Pre-configured Test Accounts

| Role           | Email             | Status   | Club   |
| -------------- | ----------------- | -------- | ------ |
| Platform Admin | admin@sda.com     | Approved | N/A    |
| Club Admin     | clubadmin@sda.com | Approved | Club 1 |
| Regular User   | user@sda.com      | Approved | Club 1 |
| Pending User 1 | pending1@sda.com  | Pending  | Club 1 |
| Pending User 2 | pending2@sda.com  | Pending  | Club 1 |
| Pending User 3 | pending3@sda.com  | Pending  | Club 4 |

**Note**: In mock mode, any password will work for login.

## Visual Indicators

### Pending Approval Screen

- 🟠 Orange clock icon
- Clean, informative layout
- Clear step-by-step explanation

### Pending Members Tab

- 🟠 Orange left border on member cards
- 🔴 Red badge with count
- Clock icon next to "Pending"

### Action Buttons

- 🟢 Green "Approve" button
- 🔴 Red "Reject" button

## Verification Checklist

After testing, verify:

- [ ] New registrations create pending users
- [ ] Pending users see the pending approval screen
- [ ] Pending users cannot access main app features
- [ ] Club admins can see pending members in a separate tab
- [ ] Badge shows correct count of pending members
- [ ] Approve action works and moves user to approved
- [ ] Reject action works and removes user from pending
- [ ] Approved users can access all features
- [ ] Rejected users cannot login (treated as not found)
- [ ] Member count only includes approved members
- [ ] Match generation only includes approved members

## Troubleshooting

### Issue: Can't see pending members

- Make sure you're logged in as club admin
- Make sure you're in the correct club
- Check that there are actually pending members in the mock data

### Issue: Approval doesn't work

- Check console for errors
- Verify the userService.approveUser method is working
- Check that the user belongs to the admin's club

### Issue: Pending screen not showing

- Verify the user's approvalStatus is 'pending'
- Check AppNavigator routing logic
- Clear app cache and restart

## Next Steps

After testing manually, consider:

1. Writing automated tests for the approval workflow
2. Testing on both iOS and Android
3. Testing with real API integration (when available)
4. Adding loading states for async operations
5. Adding optimistic UI updates

## Need Help?

If you encounter any issues:

1. Check the console for error messages
2. Review the implementation in `docs/USER_APPROVAL_FEATURE.md`
3. Verify mock data in `src/services/mockData.ts`
4. Check navigation logic in `src/navigation/AppNavigator.tsx`
