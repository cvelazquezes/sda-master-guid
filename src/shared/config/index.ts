/**
 * System Configuration - Single Source of Truth
 *
 * This module is the ONLY place where system/domain values should be defined.
 * All business logic, infrastructure, and behavioral decisions MUST consume these configs.
 *
 * @module config
 * @version 1.0.0
 *
 * ⚠️ STRONG COMPLIANCE RULE:
 * ❌ Do NOT hardcode business limits, timeouts, status codes, country codes, etc.
 * ✅ Do use config/domain constants for ALL non-visual shared values
 *
 * Architecture:
 * - domain.ts: Business rules, limits, thresholds
 * - api.ts: HTTP/network configuration
 * - features.ts: Feature flags, country rules, business conditions
 * - storage.ts: Storage keys, cache policies
 * - environment.ts: Environment-specific settings
 *
 * RELATIONSHIP WITH DESIGN TOKENS:
 * - Design Tokens → Visual/UX values (colors, spacing, motion)
 * - System Config → Behavioral/Technical values (limits, timeouts, rules)
 *
 * Together they form the COMPLETE single source of truth.
 */

// Domain/Business Rules
// Re-export combined config for convenience
import { domainConfig } from './domain';
import { apiConfig } from './api';
import { featureConfig } from './features';
import { storageConfig } from './storage';
import { environmentConfig } from './environment';

export * from './domain';

// API/Network Configuration
export * from './api';

// Feature Flags & Business Conditions
export * from './features';

// Storage Configuration
export * from './storage';

// Environment Configuration
export { environmentConfig, getEnvironment, isProduction, isDevelopment } from './environment';

/**
 * Complete system configuration
 * Access all config from a single object
 */
export const systemConfig = {
  domain: domainConfig,
  api: apiConfig,
  features: featureConfig,
  storage: storageConfig,
  environment: environmentConfig,
} as const;

export default systemConfig;
