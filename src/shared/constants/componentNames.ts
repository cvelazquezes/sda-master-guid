/**
 * Component Names Constants
 *
 * Centralized displayName values for React components.
 * Used for debugging, React DevTools, and error stack traces.
 */

export const COMPONENT_NAMES = {
  // Card Components
  CLUB_CARD: 'ClubCard',
  MATCH_CARD: 'MatchCard',
  USER_CARD: 'UserCard',
} as const;

export type ComponentName = (typeof COMPONENT_NAMES)[keyof typeof COMPONENT_NAMES];
