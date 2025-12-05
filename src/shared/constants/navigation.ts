/**
 * Navigation Constants - Single Source of Truth for navigation values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL NAVIGATION VALUES
 * ============================================================================
 *
 * Contains: Screen names, tab names, titles, menu item IDs
 * Consolidated from: navigation.ts + menuItemIds.ts
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: name="Login", name="Home"
 * ✅ ALWAYS use: name={SCREENS.LOGIN}, name={SCREENS.HOME}
 *
 * @version 2.0.0
 */

// =============================================================================
// SCREEN NAMES
// =============================================================================

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

// =============================================================================
// TAB NAMES
// =============================================================================

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

// =============================================================================
// SCREEN TITLES
// =============================================================================

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

// =============================================================================
// NAVIGATION KEYS
// =============================================================================

/**
 * Navigation Keys - Used for navigation state keys
 */
export const NAV_KEYS = {
  UNAUTHENTICATED: 'unauthenticated',
} as const;

// =============================================================================
// MENU ITEM IDS
// =============================================================================

/**
 * Menu Item IDs - Unique identifiers for menu items
 * Used as React keys and for tracking/analytics purposes.
 */
export const MENU_ITEM_IDS = {
  // Admin Dashboard & More
  ORGANIZATION: 'organization',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',

  // Club Admin Dashboard & More
  ACTIVITIES: 'activities',
  GENERATE_MATCHES: 'generate-matches',
  MATCH_MANAGEMENT: 'match-management',
  DIRECTIVE: 'directive',
  SETTINGS: 'settings',

  // User More
  CLUB_INFO: 'club-info',
  CONTACT_ADMIN: 'contact-admin',
  FEEDBACK: 'feedback',

  // Common
  HELP: 'help',
} as const;

// =============================================================================
// DIRECTIVE POSITION IDS
// =============================================================================

/**
 * Directive Position IDs - Unique identifiers for club directive positions
 */
export const DIRECTIVE_POSITION_IDS = {
  VICE_DIRECTOR: 'vice-director',
  ASSOCIATE_DIRECTOR: 'associate-director',
  TREASURER: 'treasurer',
  COUNSELOR: 'counselor',
  SECRETARY: 'secretary',
  EVENTS_COORDINATOR: 'events-coordinator',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ScreenName = (typeof SCREENS)[keyof typeof SCREENS];
export type TabName = (typeof TABS)[keyof typeof TABS];
export type ScreenTitle = (typeof SCREEN_TITLES)[keyof typeof SCREEN_TITLES];
export type MenuItemId = (typeof MENU_ITEM_IDS)[keyof typeof MENU_ITEM_IDS];
export type DirectivePositionId =
  (typeof DIRECTIVE_POSITION_IDS)[keyof typeof DIRECTIVE_POSITION_IDS];
