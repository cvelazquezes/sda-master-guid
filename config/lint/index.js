/**
 * ESLint Configuration Index
 * Exports all modular ESLint configurations
 */
const baseRules = require('./base');
const typescriptRules = require('./typescript');
const reactRules = require('./react');
const importRules = require('./imports');
const stringsRules = require('./strings');
const loggingRules = require('./logging');
const overridesConfig = require('./overrides');

module.exports = {
  baseRules,
  typescriptRules,
  reactRules,
  importRules,
  stringsRules,
  loggingRules,
  overridesConfig,
};
