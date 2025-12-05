/**
 * Navigation Constants - Single Source of Truth for all screen and tab names
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL NAVIGATION STRING VALUES
 * ============================================================================
 *
 * All navigation-related string values should be referenced from here.
 * This ensures type safety, consistency, and easier refactoring.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: name="Login", name="Home"
 * ✅ ALWAYS use: name={SCREENS.LOGIN}, name={SCREENS.HOME}
 *
 * @version 1.0.0
 */

/**
 * Screen Names - Used in Stack.Screen components
 */
export const SCREENS = {
  // Auth Screens
  LOGIN: 'Login',
  REGISTER: 'Register',
  PENDING_APPROVAL: 'PendingApproval',

  // Main Navigation
  MAIN: 'Main',
  HOME: 'Home',
  ACTIVITIES: 'Activities',
  ACCOUNT: 'Account',
  NOTIFICATIONS: 'Notifications',

  // Admin Screens
  USERS_MANAGEMENT: 'UsersManagement',
  CLUBS_MANAGEMENT: 'ClubsManagement',
  ORGANIZATION_MANAGEMENT: 'OrganizationManagement',

  // Club Admin Screens
  CLUB_SETTINGS: 'ClubSettings',
  CLUB_MATCHES: 'ClubMatches',
  GENERATE_MATCHES: 'GenerateMatches',
  CLUB_DIRECTIVE: 'ClubDirective',

  // User Screens
  MY_FEES: 'MyFees',
} as const;

/**
 * Tab Names - Used in Tab.Screen components
 */
export const TABS = {
  // Admin Tabs
  USERS: 'Users',
  CLUBS: 'Clubs',

  // Shared Tabs
  MEMBERS: 'Members',
  MEETINGS: 'Meetings',
  FINANCES: 'Finances',
  MORE: 'More',
} as const;

/**
 * Screen Titles - Display titles for navigation headers
 */
export const SCREEN_TITLES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',

  // Main
  HOME: 'Home',
  MY_ACCOUNT: 'My Account',
  NOTIFICATIONS: 'Notifications',

  // Admin
  USERS: 'Users',
  CLUBS: 'Clubs',
  USER_MANAGEMENT: 'User Management',
  CLUB_MANAGEMENT: 'Club Management',
  ORGANIZATION: 'Organization',

  // Club Admin
  MEMBERS: 'Members',
  MEETINGS: 'Meetings',
  FINANCES: 'Finances',
  MORE: 'More',
  CLUB_SETTINGS: 'Club Settings',
  ACTIVITY_MANAGEMENT: 'Activity Management',
  GENERATE_ACTIVITIES: 'Generate Activities',
  CLUB_DIRECTIVE: 'Club Directive',

  // User
  MY_FEES: 'My Fees',
} as const;

/**
 * Navigation Keys - Used for navigation state keys
 */
export const NAV_KEYS = {
  UNAUTHENTICATED: 'unauthenticated',
} as const;

// Type exports
export type ScreenName = (typeof SCREENS)[keyof typeof SCREENS];
export type TabName = (typeof TABS)[keyof typeof TABS];
export type ScreenTitle = (typeof SCREEN_TITLES)[keyof typeof SCREEN_TITLES];
