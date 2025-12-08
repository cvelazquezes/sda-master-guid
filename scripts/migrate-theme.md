# Theme Migration Checklist

## Files Fixed ✅

### Screens

- [x] `src/screens/club-admin/ClubDirectiveScreen.tsx`
- [x] `src/screens/main/ActivitiesScreen.tsx`
- [x] `src/screens/main/NotificationsScreen.tsx`
- [x] `src/screens/main/settings/MenuItem.tsx`
- [x] `src/screens/main/settings/ProfileHeader.tsx`
- [x] `src/screens/main/settings/QuickActions.tsx`
- [x] `src/screens/main/settings/SettingsSections.tsx`
- [x] `src/screens/main/my-fees/LoadingState.tsx`
- [x] `src/screens/main/my-fees/HelpCard.tsx`
- [x] `src/screens/main/my-fees/BalanceHeader.tsx`
- [x] `src/screens/main/my-fees/FeeTabs.tsx`
- [x] `src/screens/main/my-fees/OverviewTab.tsx`
- [x] `src/screens/main/my-fees/ChargesTab.tsx`
- [x] `src/screens/main/my-fees/HistoryTab.tsx`

### Components

- [x] `src/components/MatchCard.tsx`

## Remaining Files (Need Migration)

### Priority 1: Main Screens (~25 files)

- [ ] `src/screens/club-admin/club-fees/BalancesTab.tsx`
- [ ] `src/screens/club-admin/club-fees/ChargesTab.tsx`
- [ ] `src/screens/club-admin/club-fees/SettingsTab.tsx`
- [ ] `src/screens/club-admin/club-fees/ChargeModal.tsx`
- [ ] `src/screens/club-admin/club-fees/index.tsx`
- [ ] `src/screens/club-admin/club-fees/FeeTabs.tsx`
- [ ] `src/screens/club-admin/club-settings/index.tsx`
- [ ] `src/screens/club-admin/club-settings/BasicInfoSection.tsx`
- [ ] `src/screens/club-admin/club-settings/ActivitySettingsSection.tsx`
- [ ] `src/screens/club-admin/club-settings/UserPreferencesSection.tsx`
- [ ] `src/screens/club-admin/meeting-planner/index.tsx`
- [ ] `src/screens/club-admin/meeting-planner/MeetingInfoSection.tsx`
- [ ] `src/screens/club-admin/meeting-planner/EditItemModal.tsx`
- [ ] `src/screens/club-admin/meeting-planner/AgendaCard.tsx`
- [ ] `src/screens/club-admin/meeting-planner/ShareModal.tsx`
- [ ] `src/screens/club-admin/meeting-planner/SelectMemberModal.tsx`
- [ ] `src/screens/club-admin/club-matches/index.tsx`
- [ ] `src/screens/club-admin/club-matches/MatchDetailModal.tsx`
- [ ] `src/screens/club-admin/club-matches/StatsSection.tsx`
- [ ] `src/screens/club-admin/club-matches/RoundsSection.tsx`
- [ ] `src/screens/club-admin/club-matches/FilterSection.tsx`
- [ ] `src/screens/club-admin/club-members/ApprovedMemberCard.tsx`
- [ ] `src/screens/club-admin/club-members/PendingMemberCard.tsx`

### Priority 2: Admin Screens (~10 files)

- [ ] `src/screens/admin/organization-management/index.tsx`
- [ ] `src/screens/admin/organization-management/HierarchySelector.tsx`
- [ ] `src/screens/admin/organization-management/OrgCard.tsx`
- [ ] `src/screens/admin/organization-management/OrgModal.tsx`
- [ ] `src/screens/admin/organization-management/TypeSelector.tsx`
- [ ] `src/screens/admin/clubs-management/CreateClubModal.tsx`
- [ ] `src/screens/admin/clubs-management/index.tsx`
- [ ] `src/screens/admin/clubs-management/FilterModal.tsx`
- [ ] `src/screens/admin/clubs-management/HierarchyFilterItem.tsx`
- [ ] `src/screens/admin/clubs-management/StatusFilterSection.tsx`
- [ ] `src/screens/admin/users-management/PendingUserCard.tsx`
- [ ] `src/screens/admin/users-management/FilterModal.tsx`

### Priority 3: Shared Screens (~12 files)

- [ ] `src/screens/shared/profile/ProfileHeader.tsx`
- [ ] `src/screens/shared/profile/ContactInfoSection.tsx`
- [ ] `src/screens/shared/profile/PreferencesSection.tsx`
- [ ] `src/screens/shared/profile/AccountStatusSection.tsx`
- [ ] `src/screens/shared/profile/LogoutSection.tsx`
- [ ] `src/screens/shared/profile/profileUtils.ts`
- [ ] `src/screens/shared/account/ContactInfoSection.tsx`
- [ ] `src/screens/shared/account/PreferencesSection.tsx`
- [ ] `src/screens/shared/account/ProfileHeader.tsx`
- [ ] `src/screens/shared/account/ActivityStatusSection.tsx`
- [ ] `src/screens/shared/account/ClubMembershipSection.tsx`
- [ ] `src/screens/shared/account/AboutSection.tsx`
- [ ] `src/screens/shared/account/LogoutSection.tsx`

### Priority 4: Components (~22 files)

- [ ] `src/components/UserCard/UserBalanceSection.tsx`
- [ ] `src/components/ErrorBoundary.tsx`
- [ ] `src/components/UserDetailModal.tsx`
- [ ] `src/components/ClubDetailModal.tsx`
- [ ] `src/components/classSelection/useClassSelection.ts`
- [ ] `src/components/classSelection/InfoCard.tsx`
- [ ] `src/components/classSelection/ModalFooter.tsx`
- [ ] `src/components/classSelection/ModalHeader.tsx`
- [ ] `src/components/classSelection/ClassOptionItem.tsx`
- [ ] `src/components/OrganizationHierarchy/HierarchyItem.tsx`
- [ ] `src/components/OrganizationHierarchy/CompactView.tsx`
- [ ] `src/components/OrganizationHierarchy/index.tsx`
- [ ] `src/components/ClubCard/ClubHierarchy.tsx`
- [ ] `src/components/ClubCard/ClubIcon.tsx`
- [ ] `src/components/ClubCard/ClubDetails.tsx`
- [ ] `src/components/ClubCard/ClubActions.tsx`
- [ ] `src/components/UserCard/UserActions.tsx`
- [ ] `src/components/UserCard/UserMetaInfo.tsx`

### Style Files (Can be deferred - static styles)

- [ ] `src/screens/club-admin/club-fees/styles.ts`
- [ ] `src/screens/club-admin/club-fees/modalStyles.ts`
- [ ] `src/screens/club-admin/meeting-planner/styles.ts`
- [ ] `src/screens/club-admin/club-matches/styles.ts`
- [ ] `src/screens/admin/organization-management/styles.ts`
- [ ] `src/screens/shared/profile/styles.ts`
- [ ] `src/screens/shared/account/styles.ts`
- [ ] `src/screens/main/settings/styles.ts`
- [ ] `src/screens/main/my-fees/styles.ts`
- [ ] `src/components/classSelection/styles.ts`
- [ ] `src/components/UserCard/styles.ts`
- [ ] `src/components/OrganizationHierarchy/styles.ts`
- [ ] `src/components/ClubCard/styles.ts`

## Migration Pattern

### Before (❌ WRONG):

```typescript
import { designTokens } from '../shared/theme';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../shared/theme';

// Usage
size={designTokens.iconSize.md}
padding: designTokens.spacing.lg,
flexDirection: layoutConstants.flexDirection.row,
```

### After (✅ CORRECT):

```typescript
import { useTheme } from '../contexts/ThemeContext';

const { colors, spacing, radii, iconSizes, typography } = useTheme();

// Usage
size={iconSizes.md}
padding: spacing.lg,
flexDirection: 'row',  // literal value, not layoutConstants
```

## Notes

- Style files (\*.styles.ts) are lower priority as they define static styles
- Components receiving `colors` as props only need iconSizes from useTheme()
- `layoutConstants` should be replaced with literal values ('row', 'center', etc.)
