# Pathfinder Classes Feature

## Overview

This feature allows club members to be assigned 1-3 Pathfinder classes. Users can select their classes during registration, and club administrators can edit them later.

## Pathfinder Classes

The available Pathfinder classes are:

- **Friend** - Entry level
- **Companion** - Beginner level
- **Explorer** - Intermediate level
- **Ranger** - Advanced level
- **Voyager** - Expert level
- **Guide** - Master level

## Implementation Details

### 1. Data Model

#### User Type Enhancement

Added `classes` field to the User interface:

```typescript
classes: PathfinderClass[]; // Array of 1-3 Pathfinder classes
```

#### Available Classes

Defined as a constant array:

```typescript
export const PATHFINDER_CLASSES = [
  'Friend',
  'Companion',
  'Explorer',
  'Ranger',
  'Voyager',
  'Guide',
] as const;

export type PathfinderClass = (typeof PATHFINDER_CLASSES)[number];
```

### 2. Components

#### ClassSelectionModal

A reusable modal component for selecting classes:

- **Features:**
  - Visual checkbox selection
  - Enforces min 1, max 3 classes
  - Shows selection count
  - Number badges for selected order
  - Save/Cancel actions

- **Props:**
  - `visible`: boolean
  - `initialClasses`: PathfinderClass[]
  - `onSave`: (classes: PathfinderClass[]) => void
  - `onClose`: () => void

### 3. User Experience

#### Registration Flow

1. User fills in basic information
2. Selects club via organizational hierarchy
3. **Selects 1-3 Pathfinder classes** (NEW)
4. Enters password and completes registration

**UI Features:**

- Button showing selected classes
- Opens modal on click
- Validates at least 1 class selected
- Default: "Friend" if none selected

#### Club Admin Management

Club admins can:

1. View classes on member cards
2. Click "Edit Classes" button
3. Modify classes using the selection modal
4. Changes saved immediately

**UI Features:**

- Classes displayed as comma-separated list
- School icon indicator
- Purple color theme (#6200ee)
- Three-button action bar per member:
  - Edit Classes
  - Pause/Resume
  - Delete

#### User Detail Modal

Shows classes as badges:

- Purple background (#f0e6ff)
- School icon
- Horizontal layout with wrapping
- Only shown for non-admin users

### 4. Mock Data

All existing users have been assigned classes:

- **Club Admin**: Guide, Voyager
- **John Doe**: Explorer, Ranger
- **Carlos Martínez**: Friend, Companion, Explorer
- **María López**: Voyager
- **Pending users**: Various combinations (1-3 classes)

### 5. Service Layer

#### Updated Methods

**authService.register():**

- Now accepts optional `classes` parameter
- Defaults to `['Friend']` if not provided

**userService:**

- Supports updating classes via `updateUser()`

## Usage Examples

### Register with Classes

```typescript
await register(
  'user@example.com',
  'password123',
  'John Doe',
  '+1 555 123 4567',
  'club-id-123',
  ['Explorer', 'Ranger'] // Classes
);
```

### Edit Classes (Club Admin)

```typescript
await userService.updateUser(userId, {
  classes: ['Guide', 'Voyager', 'Ranger'],
});
```

### Display Classes

```typescript
{user.classes && user.classes.length > 0 && (
  <View style={styles.classesContainer}>
    {user.classes.map((pathfinderClass, index) => (
      <View key={index} style={styles.classBadge}>
        <MaterialCommunityIcons name="school" size={16} color="#6200ee" />
        <Text>{pathfinderClass}</Text>
      </View>
    ))}
  </View>
)}
```

## Validation Rules

1. **Minimum**: 1 class required
2. **Maximum**: 3 classes allowed
3. **Default**: 'Friend' if none provided
4. **Admin users**: Can have empty classes array

## UI Components Style Guide

### Colors

- Primary: #6200ee (Purple)
- Background: #f0e6ff (Light Purple)
- Text: #6200ee (Purple)
- Icon: school (Material Community Icons)

### Badge Style

- Rounded corners (borderRadius: 20)
- Padding: 8px vertical, 12px horizontal
- Flex row with icon + text
- Gap: 6px between items

## Testing

### Test Scenarios

1. **Registration with Classes**
   - Register new user
   - Select 1, 2, or 3 classes
   - Verify registration succeeds
   - Check classes are saved

2. **Edit Classes (Club Admin)**
   - Login as club admin
   - Navigate to Club Members
   - Click "Edit Classes" on a member
   - Modify classes
   - Verify changes are saved

3. **View Classes**
   - Open User Detail Modal
   - Verify classes are displayed
   - Check formatting and icons

4. **Validation**
   - Try to save with 0 classes (should fail)
   - Try to select 4+ classes (should prevent)
   - Verify min/max enforcement

### Test Credentials

**Club Admin:** clubadmin@sda.com
**Regular User:** user@sda.com
**Pending with Classes:** pending1@sda.com (Friend, Companion)

## Future Enhancements

1. **Class Descriptions**
   - Add descriptions for each class
   - Show requirements/age groups
   - Include class levels/progression

2. **Class-based Matching**
   - Match users with similar classes
   - Filter matches by class level
   - Group activities by class

3. **Class Progress Tracking**
   - Track completion status
   - Show badges earned
   - Display achievement history

4. **Bulk Class Management**
   - Import classes from CSV
   - Export class roster
   - Bulk update multiple users

5. **Class Statistics**
   - Show distribution chart
   - Track class popularity
   - Generate reports by class

## Database Schema

For production implementation:

```sql
-- Add classes column to users table
ALTER TABLE users ADD COLUMN classes TEXT[];

-- Add check constraint for array length
ALTER TABLE users ADD CONSTRAINT check_classes_count
  CHECK (array_length(classes, 1) >= 1 AND array_length(classes, 1) <= 3);

-- Add check constraint for valid classes
ALTER TABLE users ADD CONSTRAINT check_valid_classes
  CHECK (
    classes <@ ARRAY['Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide']
  );

-- Create index for class filtering
CREATE INDEX idx_users_classes ON users USING GIN (classes);
```

## API Endpoints

### POST /auth/register

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "whatsappNumber": "+1 555 123 4567",
  "clubId": "club-123",
  "classes": ["Explorer", "Ranger"]
}
```

### PATCH /users/:userId

```json
{
  "classes": ["Guide", "Voyager"]
}
```

### GET /users/:userId

```json
{
  "id": "user-123",
  "name": "John Doe",
  "classes": ["Explorer", "Ranger"],
  ...
}
```

## Files Modified

1. `src/types/index.ts` - Added PathfinderClass type and PATHFINDER_CLASSES constant
2. `src/services/mockData.ts` - Added classes to all mock users
3. `src/services/authService.ts` - Updated register to accept classes
4. `src/context/AuthContext.tsx` - Updated register signature
5. `src/components/ClassSelectionModal.tsx` - New reusable modal component
6. `src/components/UserDetailModal.tsx` - Display classes
7. `src/screens/auth/RegisterScreen.tsx` - Class selection UI
8. `src/screens/club-admin/ClubMembersScreen.tsx` - Class editing UI

## Conclusion

This feature provides a complete solution for managing Pathfinder classes:

- ✅ User registration with class selection
- ✅ Club admin class editing
- ✅ Visual class display
- ✅ Validation (1-3 classes)
- ✅ Reusable components
- ✅ Clean UI/UX
- ✅ Type-safe implementation
- ✅ Mock data ready for testing
