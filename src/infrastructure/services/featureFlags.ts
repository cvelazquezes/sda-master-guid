/**
 * Feature Flags Service
 * Enables gradual rollouts and A/B testing following LaunchDarkly/Optimizely patterns
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOG_MESSAGES,
  STORAGE_KEYS,
  FEATURE_FLAG_KEY,
  USER_GROUP,
  TYPEOF,
} from '../../shared/constants';
import { logger } from '../../shared/utils/logger';
import { environment } from '../config/environment';

const { isDevelopment } = environment;

// Feature flag rollout percentages
// Note: Using literal values here to avoid module initialization order issues
const ROLLOUT_PERCENTAGE = {
  SMALL: 10, // 10%
  MEDIUM: 25, // 25%
  FULL: 100, // 100%
  HASH_BITSHIFT: 5, // For bit shifting in hash
} as const;

// ============================================================================
// React Hook
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type FeatureFlagValue = boolean | string | number | object;

export type FeatureFlag = {
  key: string;
  value: FeatureFlagValue;
  enabled: boolean;
  rolloutPercentage?: number;
  userGroups?: string[];
  userIds?: string[];
  expiresAt?: number;
};

export type FeatureFlagConfig = {
  flags: Record<string, FeatureFlag>;
  version: string;
  lastUpdated: number;
};

// ============================================================================
// Feature Flags Service
// ============================================================================

class FeatureFlagsService {
  private _flags: Map<string, FeatureFlag> = new Map<string, FeatureFlag>();
  private readonly _storageKey: string = STORAGE_KEYS.FEATURE_FLAGS.DATA;
  private _userId: string | null = null;
  private _userGroups: string[] = [];

  /**
   * Initializes the feature flags service
   */
  async initialize(userId?: string, userGroups?: string[]): Promise<void> {
    this._userId = userId || null;
    this._userGroups = userGroups || [];

    // Load flags from storage
    await this._loadFromStorage();

    // Load default flags
    this._loadDefaultFlags();

    logger.info(LOG_MESSAGES.FEATURE_FLAGS.INITIALIZED, {
      flagCount: this._flags.size,
      userId: this._userId,
      groups: this._userGroups.length,
    });
  }

  /**
   * Loads default feature flags
   */
  private _loadDefaultFlags(): void {
    const defaultFlags: Record<string, FeatureFlag> = {
      // Performance features
      [FEATURE_FLAG_KEY.ENABLE_OFFLINE_MODE]: {
        key: FEATURE_FLAG_KEY.ENABLE_OFFLINE_MODE,
        value: environment.features.enableOfflineMode,
        enabled: true,
      },
      [FEATURE_FLAG_KEY.ENABLE_PERFORMANCE_MONITORING]: {
        key: FEATURE_FLAG_KEY.ENABLE_PERFORMANCE_MONITORING,
        value: environment.features.enablePerformanceMonitoring,
        enabled: true,
      },

      // Security features
      [FEATURE_FLAG_KEY.ENABLE_BIOMETRICS]: {
        key: FEATURE_FLAG_KEY.ENABLE_BIOMETRICS,
        value: environment.features.enableBiometrics,
        enabled: true,
      },

      // Communication features
      [FEATURE_FLAG_KEY.ENABLE_PUSH_NOTIFICATIONS]: {
        key: FEATURE_FLAG_KEY.ENABLE_PUSH_NOTIFICATIONS,
        value: environment.features.enablePushNotifications,
        enabled: true,
      },

      // Experimental features (disabled by default)
      [FEATURE_FLAG_KEY.ENABLE_AB_TESTING]: {
        key: FEATURE_FLAG_KEY.ENABLE_AB_TESTING,
        value: false,
        enabled: false,
        rolloutPercentage: ROLLOUT_PERCENTAGE.SMALL, // 10% rollout
      },
      [FEATURE_FLAG_KEY.ENABLE_ADVANCED_ANALYTICS]: {
        key: FEATURE_FLAG_KEY.ENABLE_ADVANCED_ANALYTICS,
        value: false,
        enabled: false,
        userGroups: [USER_GROUP.BETA, USER_GROUP.INTERNAL],
      },
      [FEATURE_FLAG_KEY.ENABLE_NEW_MATCH_UI]: {
        key: FEATURE_FLAG_KEY.ENABLE_NEW_MATCH_UI,
        value: false,
        enabled: false,
        rolloutPercentage: ROLLOUT_PERCENTAGE.MEDIUM, // 25% rollout
      },

      // Admin features
      [FEATURE_FLAG_KEY.ENABLE_ADMIN_DEBUG_TOOLS]: {
        key: FEATURE_FLAG_KEY.ENABLE_ADMIN_DEBUG_TOOLS,
        value: isDevelopment,
        enabled: isDevelopment,
        userGroups: [USER_GROUP.SUPER_ADMIN],
      },
    };

    // Merge with existing flags (don't overwrite)
    for (const [key, flag] of Object.entries(defaultFlags)) {
      if (!this._flags.has(key)) {
        this._flags.set(key, flag);
      }
    }
  }

  private _isExpired(flag: FeatureFlag, featureKey: string): boolean {
    if (flag.expiresAt && Date.now() > flag.expiresAt) {
      logger.debug(LOG_MESSAGES.FEATURE_FLAGS.FLAG_EXPIRED(featureKey));
      return true;
    }
    return false;
  }

  private _checkUserTargeting(flag: FeatureFlag): boolean | null {
    if (flag.userIds && this._userId) {
      return flag.userIds.includes(this._userId);
    }
    return null;
  }

  private _checkGroupTargeting(flag: FeatureFlag): boolean {
    if (!flag.userGroups || this._userGroups.length === 0) {
      return true;
    }
    return flag.userGroups.some((group) => this._userGroups.includes(group));
  }

  private _checkRollout(flag: FeatureFlag): boolean | null {
    if (flag.rolloutPercentage !== undefined && this._userId) {
      const userHash = this._hashUserId(this._userId);
      return userHash % ROLLOUT_PERCENTAGE.FULL < flag.rolloutPercentage;
    }
    return null;
  }

  /**
   * Checks if a feature is enabled for the current user
   */
  isEnabled(featureKey: string): boolean {
    const flag = this._flags.get(featureKey);
    if (!flag) {
      logger.warn(LOG_MESSAGES.FEATURE_FLAGS.FLAG_NOT_FOUND, { featureKey });
      return false;
    }
    if (!flag.enabled || this._isExpired(flag, featureKey)) {
      return false;
    }

    const userTarget = this._checkUserTargeting(flag);
    if (userTarget !== null) {
      return userTarget;
    }

    if (!this._checkGroupTargeting(flag)) {
      return false;
    }

    const rollout = this._checkRollout(flag);
    if (rollout !== null) {
      return rollout;
    }

    return typeof flag.value === TYPEOF.BOOLEAN ? flag.value : flag.enabled;
  }

  /**
   * Gets a feature flag value with type safety
   */
  getValue<T extends FeatureFlagValue>(featureKey: string, defaultValue: T): T {
    if (!this.isEnabled(featureKey)) {
      return defaultValue;
    }

    const flag = this._flags.get(featureKey);
    if (!flag) {
      return defaultValue;
    }

    return (flag.value as T) || defaultValue;
  }

  /**
   * Sets a feature flag programmatically
   */
  async setFlag(flag: FeatureFlag): Promise<void> {
    this._flags.set(flag.key, flag);
    await this._saveToStorage();
    logger.debug(LOG_MESSAGES.FEATURE_FLAGS.FLAG_SET(flag.key), flag);
  }

  /**
   * Updates multiple feature flags
   */
  async updateFlags(flags: FeatureFlag[]): Promise<void> {
    for (const flag of flags) {
      this._flags.set(flag.key, flag);
    }
    await this._saveToStorage();
    logger.info(LOG_MESSAGES.FEATURE_FLAGS.FLAGS_UPDATED(flags.length));
  }

  /**
   * Removes a feature flag
   */
  async removeFlag(featureKey: string): Promise<void> {
    this._flags.delete(featureKey);
    await this._saveToStorage();
    logger.debug(LOG_MESSAGES.FEATURE_FLAGS.FLAG_REMOVED(featureKey));
  }

  /**
   * Gets all feature flags
   */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this._flags.values());
  }

  /**
   * Gets all enabled flags for the current user
   */
  getEnabledFlags(): string[] {
    return Array.from(this._flags.keys()).filter((key) => this.isEnabled(key));
  }

  /**
   * Updates user context
   */
  async setUserContext(userId: string, userGroups: string[] = []): Promise<void> {
    this._userId = userId;
    this._userGroups = userGroups;
    logger.debug(LOG_MESSAGES.FEATURE_FLAGS.USER_CONTEXT_UPDATED, { userId, groups: userGroups });
  }

  /**
   * Clears user context
   */
  clearUserContext(): void {
    this._userId = null;
    this._userGroups = [];
  }

  /**
   * Saves flags to persistent storage
   */
  private async _saveToStorage(): Promise<void> {
    try {
      const config: FeatureFlagConfig = {
        flags: Object.fromEntries(this._flags),
        version: '1.0',
        lastUpdated: Date.now(),
      };

      await AsyncStorage.setItem(this._storageKey, JSON.stringify(config));
    } catch (error) {
      logger.error(LOG_MESSAGES.FEATURE_FLAGS.SAVE_FAILED, error as Error);
    }
  }

  /**
   * Loads flags from persistent storage
   */
  private async _loadFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this._storageKey);
      if (stored) {
        const config = JSON.parse(stored) as FeatureFlagConfig;

        // Load flags into memory
        for (const [key, flag] of Object.entries(config.flags)) {
          this._flags.set(key, flag);
        }

        logger.debug(LOG_MESSAGES.FEATURE_FLAGS.LOADED, {
          count: this._flags.size,
          version: config.version,
        });
      }
    } catch (error) {
      logger.warn(LOG_MESSAGES.FEATURE_FLAGS.LOAD_FAILED, error as Error);
    }
  }

  /**
   * Hashes user ID for consistent rollout percentage
   */
  private _hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << ROLLOUT_PERCENTAGE.HASH_BITSHIFT) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Clears all flags
   */
  async clear(): Promise<void> {
    this._flags.clear();
    await AsyncStorage.removeItem(this._storageKey);
    logger.info(LOG_MESSAGES.FEATURE_FLAGS.CLEARED);
  }

  /**
   * Gets statistics
   */
  getStats(): {
    totalFlags: number;
    enabledFlags: number;
    userId: string | null;
    userGroups: string[];
  } {
    return {
      totalFlags: this._flags.size,
      enabledFlags: this.getEnabledFlags().length,
      userId: this._userId,
      userGroups: this._userGroups,
    };
  }
}

// ============================================================================
// Global Instance
// ============================================================================

export const featureFlagsService = new FeatureFlagsService();

/**
 * React hook to check if a feature is enabled
 */
export function useFeatureFlag(featureKey: string): boolean {
  const [isEnabled, setIsEnabled] = useState(() => featureFlagsService.isEnabled(featureKey));

  useEffect(() => {
    // Re-check on mount
    setIsEnabled(featureFlagsService.isEnabled(featureKey));
  }, [featureKey]);

  return isEnabled;
}

/**
 * React hook to get a feature flag value
 */
export function useFeatureValue<T extends FeatureFlagValue>(
  featureKey: string,
  defaultValue: T
): T {
  const [value, setValue] = useState<T>(() =>
    featureFlagsService.getValue(featureKey, defaultValue)
  );

  useEffect(() => {
    setValue(featureFlagsService.getValue(featureKey, defaultValue));
  }, [featureKey, defaultValue]);

  return value;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a feature flag for gradual rollout
 */
export function createRolloutFlag(
  key: string,
  rolloutPercentage: number,
  value: FeatureFlagValue = true
): FeatureFlag {
  return {
    key,
    value,
    enabled: true,
    rolloutPercentage: Math.max(0, Math.min(ROLLOUT_PERCENTAGE.FULL, rolloutPercentage)),
  };
}

/**
 * Creates a feature flag for specific user groups
 */
export function createGroupFlag(
  key: string,
  userGroups: string[],
  value: FeatureFlagValue = true
): FeatureFlag {
  return {
    key,
    value,
    enabled: true,
    userGroups,
  };
}

/**
 * Creates a time-limited feature flag
 */
export function createTimeLimitedFlag(
  key: string,
  expiresInDays: number,
  value: FeatureFlagValue = true
): FeatureFlag {
  const millisecondsPerDay = 86400000;
  return {
    key,
    value,
    enabled: true,
    expiresAt: Date.now() + expiresInDays * millisecondsPerDay,
  };
}
