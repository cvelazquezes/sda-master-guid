/**
 * ESLint Configuration Index
 * Exports all modular ESLint configurations
 *
 * @version 2.0.0 - Added security and accessibility rules
 *
 * Configuration modules:
 * - base: Core JavaScript rules (code quality, async, security basics)
 * - typescript: TypeScript-specific rules (type safety, naming, async)
 * - react: React and React Native rules (hooks, performance, jsx)
 * - imports: Import organization and architecture rules
 * - strings: High-value string literal rules
 * - logging: Logger service enforcement
 * - security: Security-focused rules (injection, crypto, disclosure)
 * - accessibility: React Native accessibility rules
 * - overrides: File-specific rule exceptions
 */
const baseRules = require('./base');
const typescriptRules = require('./typescript');
const reactRules = require('./react');
const importRules = require('./imports');
const stringsRules = require('./strings');
const loggingRules = require('./logging');
const securityRules = require('./security');
const accessibilityRules = require('./accessibility');
const overridesConfig = require('./overrides');

module.exports = {
  baseRules,
  typescriptRules,
  reactRules,
  importRules,
  stringsRules,
  loggingRules,
  securityRules,
  accessibilityRules,
  overridesConfig,
};
