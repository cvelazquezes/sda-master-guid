/**
 * Logging ESLint Rules - Enforce Use of Logger Service
 *
 * ALL CONSOLE CALLS MUST USE THE LOGGER SERVICE.
 * Direct console usage is FORBIDDEN in production code.
 *
 * This configuration enforces:
 * - No direct console.log, console.warn, console.error, etc.
 * - Use logger.info(), logger.warn(), logger.error() instead
 * - Structured logging with sanitization
 *
 * WHY?
 * 1. Sensitive data sanitization - logger redacts passwords, tokens, etc.
 * 2. Structured logging - consistent format across the app
 * 3. Production-ready - logs are sent to external services (Sentry, etc.)
 * 4. Performance tracking - logger.performance() for metrics
 * 5. Easy to disable in production builds
 *
 * USAGE:
 * ❌ BAD:  console.log('User logged in', user);
 * ✅ GOOD: logger.info('User logged in', user);
 *
 * ❌ BAD:  console.error('Failed to fetch', error);
 * ✅ GOOD: logger.error('Failed to fetch', error);
 *
 * ❌ BAD:  console.warn('Deprecated API');
 * ✅ GOOD: logger.warn('Deprecated API');
 *
 * @version 2.0.0 - Added console reassignment prevention
 */
module.exports = {
  rules: {
    // =========================================================================
    // CONSOLE USAGE - STRICT BAN
    // =========================================================================

    /**
     * NO DIRECT CONSOLE USAGE!
     *
     * All console methods are forbidden.
     * Use the logger service from @/utils/logger instead.
     *
     * The logger provides:
     * - logger.debug() - Development debugging
     * - logger.info()  - General information
     * - logger.warn()  - Warnings
     * - logger.error() - Errors with stack traces
     * - logger.performance() - Performance metrics
     */
    'no-console': 'error',

    // =========================================================================
    // LOGGING BEST PRACTICES VIA AST PATTERNS
    // =========================================================================

    /**
     * Additional checks for common logging anti-patterns
     */
    'no-restricted-properties': [
      'error',

      // -----------------------------------------------------------------------
      // Disallow window.console
      // -----------------------------------------------------------------------
      {
        object: 'window',
        property: 'console',
        message:
          '❌ LOGGING: Use logger from @/utils/logger instead of window.console\n' +
          '✅ FIX: import { logger } from "@/utils/logger"; logger.info(...)',
      },

      // -----------------------------------------------------------------------
      // Disallow global.console (Node.js)
      // -----------------------------------------------------------------------
      {
        object: 'global',
        property: 'console',
        message:
          '❌ LOGGING: Use logger from @/utils/logger instead of global.console\n' +
          '✅ FIX: import { logger } from "@/utils/logger"; logger.info(...)',
      },

      // -----------------------------------------------------------------------
      // Disallow globalThis.console (modern JS)
      // -----------------------------------------------------------------------
      {
        object: 'globalThis',
        property: 'console',
        message:
          '❌ LOGGING: Use logger from @/utils/logger instead of globalThis.console\n' +
          '✅ FIX: import { logger } from "@/utils/logger"; logger.info(...)',
      },

      // -----------------------------------------------------------------------
      // Disallow self.console (workers)
      // -----------------------------------------------------------------------
      {
        object: 'self',
        property: 'console',
        message:
          '❌ LOGGING: Use logger from @/utils/logger instead of self.console\n' +
          '✅ FIX: import { logger } from "@/utils/logger"; logger.info(...)',
      },

      // -----------------------------------------------------------------------
      // Disallow process.stdout.write (Node.js bypass)
      // -----------------------------------------------------------------------
      {
        object: 'process.stdout',
        property: 'write',
        message:
          '❌ LOGGING: Use logger from @/utils/logger instead of process.stdout.write\n' +
          '✅ FIX: import { logger } from "@/utils/logger"; logger.info(...)',
      },

      // -----------------------------------------------------------------------
      // Disallow process.stderr.write (Node.js bypass)
      // -----------------------------------------------------------------------
      {
        object: 'process.stderr',
        property: 'write',
        message:
          '❌ LOGGING: Use logger from @/utils/logger instead of process.stderr.write\n' +
          '✅ FIX: import { logger } from "@/utils/logger"; logger.error(...)',
      },
    ],

    // =========================================================================
    // RESTRICTED GLOBALS
    // =========================================================================

    /**
     * Prevent accidental console usage via destructuring or assignment
     */
    'no-restricted-globals': [
      'error',
      {
        name: 'console',
        message:
          '❌ LOGGING: Direct console usage is forbidden.\n\n' +
          '✅ FIX: Import and use logger:\n' +
          '   import { logger } from "@/utils/logger";\n' +
          '   logger.info("message", data);\n' +
          '   logger.warn("warning", data);\n' +
          '   logger.error("error", error);',
      },
    ],

    // =========================================================================
    // CONSOLE REASSIGNMENT PREVENTION
    // =========================================================================

    /**
     * Additional AST rules to catch creative bypasses
     */
    'no-restricted-syntax': [
      'error',

      // -----------------------------------------------------------------------
      // Catch console reassignment: const log = console; log.log()
      // -----------------------------------------------------------------------
      {
        selector: "VariableDeclarator[init.name='console']",
        message:
          '❌ LOGGING: Console reassignment is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },

      // -----------------------------------------------------------------------
      // Catch console property assignment: const log = console.log;
      // -----------------------------------------------------------------------
      {
        selector: "VariableDeclarator[init.object.name='console']",
        message:
          '❌ LOGGING: Console method extraction is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },

      // -----------------------------------------------------------------------
      // Catch console in assignment: log = console;
      // -----------------------------------------------------------------------
      {
        selector: "AssignmentExpression[right.name='console']",
        message:
          '❌ LOGGING: Console reassignment is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },

      // -----------------------------------------------------------------------
      // Catch console method assignment: log = console.log;
      // -----------------------------------------------------------------------
      {
        selector: "AssignmentExpression[right.object.name='console']",
        message:
          '❌ LOGGING: Console method extraction is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },

      // -----------------------------------------------------------------------
      // Catch console destructuring: const { log } = console;
      // -----------------------------------------------------------------------
      {
        selector: "VariableDeclarator[id.type='ObjectPattern'][init.name='console']",
        message:
          '❌ LOGGING: Console destructuring is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },

      // -----------------------------------------------------------------------
      // Catch Function.prototype.bind on console: console.log.bind(console)
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.property.name='bind'][callee.object.object.name='console']",
        message:
          '❌ LOGGING: Console binding is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },

      // -----------------------------------------------------------------------
      // Catch Function.prototype.call on console: console.log.call(null, ...)
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.property.name='call'][callee.object.object.name='console']",
        message:
          '❌ LOGGING: Console.call() is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },

      // -----------------------------------------------------------------------
      // Catch Function.prototype.apply on console: console.log.apply(null, [])
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.property.name='apply'][callee.object.object.name='console']",
        message:
          '❌ LOGGING: Console.apply() is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },

      // -----------------------------------------------------------------------
      // Catch Reflect.apply on console: Reflect.apply(console.log, null, [])
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.object.name='Reflect'][callee.property.name='apply'] > MemberExpression[object.name='console']:first-child",
        message:
          '❌ LOGGING: Reflect.apply with console is forbidden.\n' +
          '✅ FIX: Use logger from @/utils/logger instead',
      },
    ],
  },
};
