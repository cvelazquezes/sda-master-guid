/**
 * Menu Item IDs - Unique identifiers for menu items across the app
 *
 * Used as React keys and for tracking/analytics purposes.
 *
 * @version 1.0.0
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

export type MenuItemId = (typeof MENU_ITEM_IDS)[keyof typeof MENU_ITEM_IDS];

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

export type DirectivePositionId =
  (typeof DIRECTIVE_POSITION_IDS)[keyof typeof DIRECTIVE_POSITION_IDS];
