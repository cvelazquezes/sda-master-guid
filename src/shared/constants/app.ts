/**
 * App Constants - Application metadata and version info
 *
 * @version 1.0.0
 */

/**
 * Application Version
 */
export const APP_VERSION = '1.0.0' as const;

/**
 * Application Info
 */
export const APP_INFO = {
  name: 'SDA Master Guide',
  version: APP_VERSION,
  bundleId: 'com.sda.masterguide',
} as const;

// Type exports
export type AppVersion = typeof APP_VERSION;
