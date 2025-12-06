/**
 * Feature Flags Service
 * Enables gradual rollouts and A/B testing following LaunchDarkly/Optimizely patterns
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';
import { environment } from '../config/environment';
import { MATH } from '../constants/numbers';

// Feature flag rollout percentages
/* eslint-disable no-magic-numbers -- Rollout percentage constants */
const ROLLOUT_PERCENTAGE = {
  SMALL: MATH.TEN, // 10%
  MEDIUM: 25, // 25%
  FULL: MATH.HUNDRED, // 100%
  HASH_BITSHIFT: MATH.FIVE, // For bit shifting in hash
} as const;
/* eslint-enable no-magic-numbers */

// ============================================================================
// React Hook
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type FeatureFlagValue = boolean | string | number | object;

export interface FeatureFlag {
  key: string;
  value: FeatureFlagValue;
  enabled: boolean;
  rolloutPercentage?: number;
  userGroups?: string[];
  userIds?: string[];
  expiresAt?: number;
}

export interface FeatureFlagConfig {
  flags: Record<string, FeatureFlag>;
  version: string;
  lastUpdated: number;
}

// ============================================================================
// Feature Flags Service
// ============================================================================

class FeatureFlagsService {
  private flags = new Map<string, FeatureFlag>();
  private readonly STORAGE_KEY = '@feature_flags';
  private userId: string | null = null;
  private userGroups: string[] = [];

  /**
   * Initializes the feature flags service
   */
  async initialize(userId?: string, userGroups?: string[]): Promise<void> {
    this.userId = userId || null;
    this.userGroups = userGroups || [];

    // Load flags from storage
    await this.loadFromStorage();

    // Load default flags
    this.loadDefaultFlags();

    logger.info('Feature flags initialized', {
      flagCount: this.flags.size,
      userId: this.userId,
      groups: this.userGroups.length,
    });
  }

  /**
   * Loads default feature flags
   */
  private loadDefaultFlags(): void {
    const defaultFlags: Record<string, FeatureFlag> = {
      // Performance features
      enableOfflineMode: {
        key: 'enableOfflineMode',
        value: environment.features.enableOfflineMode,
        enabled: true,
      },
      enablePerformanceMonitoring: {
        key: 'enablePerformanceMonitoring',
        value: environment.features.enablePerformanceMonitoring,
        enabled: true,
      },

      // Security features
      enableBiometrics: {
        key: 'enableBiometrics',
        value: environment.features.enableBiometrics,
        enabled: true,
      },

      // Communication features
      enablePushNotifications: {
        key: 'enablePushNotifications',
        value: environment.features.enablePushNotifications,
        enabled: true,
      },

      // Experimental features (disabled by default)
      enableABTesting: {
        key: 'enableABTesting',
        value: false,
        enabled: false,
        rolloutPercentage: ROLLOUT_PERCENTAGE.SMALL, // 10% rollout
      },
      enableAdvancedAnalytics: {
        key: 'enableAdvancedAnalytics',
        value: false,
        enabled: false,
        userGroups: ['beta', 'internal'],
      },
      enableNewMatchUI: {
        key: 'enableNewMatchUI',
        value: false,
        enabled: false,
        rolloutPercentage: ROLLOUT_PERCENTAGE.MEDIUM, // 25% rollout
      },

      // Admin features
      enableAdminDebugTools: {
        key: 'enableAdminDebugTools',
        value: environment.name === 'development',
        enabled: environment.name === 'development',
        userGroups: ['super_admin'],
      },
    };

    // Merge with existing flags (don't overwrite)
    for (const [key, flag] of Object.entries(defaultFlags)) {
      if (!this.flags.has(key)) {
        this.flags.set(key, flag);
      }
    }
  }

  private isExpired(flag: FeatureFlag, featureKey: string): boolean {
    if (flag.expiresAt && Date.now() > flag.expiresAt) {
      logger.debug(`Feature flag expired: ${featureKey}`);
      return true;
    }
    return false;
  }

  private checkUserTargeting(flag: FeatureFlag): boolean | null {
    if (flag.userIds && this.userId) {
      return flag.userIds.includes(this.userId);
    }
    return null;
  }

  private checkGroupTargeting(flag: FeatureFlag): boolean {
    if (!flag.userGroups || this.userGroups.length === 0) {
      return true;
    }
    return flag.userGroups.some((group) => this.userGroups.includes(group));
  }

  private checkRollout(flag: FeatureFlag): boolean | null {
    if (flag.rolloutPercentage !== undefined && this.userId) {
      const userHash = this.hashUserId(this.userId);
      return userHash % ROLLOUT_PERCENTAGE.FULL < flag.rolloutPercentage;
    }
    return null;
  }

  /**
   * Checks if a feature is enabled for the current user
   */
  isEnabled(featureKey: string): boolean {
    const flag = this.flags.get(featureKey);
    if (!flag) {
      logger.warn(`Feature flag not found: ${featureKey}`);
      return false;
    }
    if (!flag.enabled || this.isExpired(flag, featureKey)) {
      return false;
    }

    const userTarget = this.checkUserTargeting(flag);
    if (userTarget !== null) {
      return userTarget;
    }

    if (!this.checkGroupTargeting(flag)) {
      return false;
    }

    const rollout = this.checkRollout(flag);
    if (rollout !== null) {
      return rollout;
    }

    return typeof flag.value === 'boolean' ? flag.value : flag.enabled;
  }

  /**
   * Gets a feature flag value with type safety
   */
  getValue<T extends FeatureFlagValue>(featureKey: string, defaultValue: T): T {
    if (!this.isEnabled(featureKey)) {
      return defaultValue;
    }

    const flag = this.flags.get(featureKey);
    if (!flag) {
      return defaultValue;
    }

    return (flag.value as T) || defaultValue;
  }

  /**
   * Sets a feature flag programmatically
   */
  async setFlag(flag: FeatureFlag): Promise<void> {
    this.flags.set(flag.key, flag);
    await this.saveToStorage();
    logger.debug(`Feature flag set: ${flag.key}`, flag);
  }

  /**
   * Updates multiple feature flags
   */
  async updateFlags(flags: FeatureFlag[]): Promise<void> {
    for (const flag of flags) {
      this.flags.set(flag.key, flag);
    }
    await this.saveToStorage();
    logger.info(`Updated ${flags.length} feature flags`);
  }

  /**
   * Removes a feature flag
   */
  async removeFlag(featureKey: string): Promise<void> {
    this.flags.delete(featureKey);
    await this.saveToStorage();
    logger.debug(`Feature flag removed: ${featureKey}`);
  }

  /**
   * Gets all feature flags
   */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  /**
   * Gets all enabled flags for the current user
   */
  getEnabledFlags(): string[] {
    return Array.from(this.flags.keys()).filter((key) => this.isEnabled(key));
  }

  /**
   * Updates user context
   */
  async setUserContext(userId: string, userGroups: string[] = []): Promise<void> {
    this.userId = userId;
    this.userGroups = userGroups;
    logger.debug('User context updated', { userId, groups: userGroups });
  }

  /**
   * Clears user context
   */
  clearUserContext(): void {
    this.userId = null;
    this.userGroups = [];
  }

  /**
   * Saves flags to persistent storage
   */
  private async saveToStorage(): Promise<void> {
    try {
      const config: FeatureFlagConfig = {
        flags: Object.fromEntries(this.flags),
        version: '1.0',
        lastUpdated: Date.now(),
      };

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      logger.error('Failed to save feature flags', error as Error);
    }
  }

  /**
   * Loads flags from persistent storage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const config: FeatureFlagConfig = JSON.parse(stored);

        // Load flags into memory
        for (const [key, flag] of Object.entries(config.flags)) {
          this.flags.set(key, flag);
        }

        logger.debug('Feature flags loaded from storage', {
          count: this.flags.size,
          version: config.version,
        });
      }
    } catch (error) {
      logger.warn('Failed to load feature flags from storage', error as Error);
    }
  }

  /**
   * Hashes user ID for consistent rollout percentage
   */
  private hashUserId(userId: string): number {
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
    this.flags.clear();
    await AsyncStorage.removeItem(this.STORAGE_KEY);
    logger.info('Feature flags cleared');
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
      totalFlags: this.flags.size,
      enabledFlags: this.getEnabledFlags().length,
      userId: this.userId,
      userGroups: this.userGroups,
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
