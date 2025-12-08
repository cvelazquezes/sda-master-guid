/**
 * Magic Strings ESLint Rules - Enterprise Best Practices
 *
 * ============================================================================
 * PHILOSOPHY: Catch strings that cause REAL problems, ignore obvious ones
 * ============================================================================
 *
 * MUST BE CONSTANTS (High Bug Risk):
 * 1. User-facing text → i18n compliance
 * 2. API endpoints → centralized, typed
 * 3. Navigation routes → type safety
 * 4. Query/cache keys → prevent typos
 * 5. Storage keys → prevent collisions
 * 6. Domain values → type safety (roles, status)
 * 7. Error codes → consistency
 *
 * ALLOWED INLINE (Low Bug Risk):
 * - CSS property values ('center', 'row', 'flex')
 * - DOM event names ('click', 'submit', 'change')
 * - typeof comparisons ('string', 'number')
 * - Empty strings ('')
 * - Single characters
 * - File extensions
 *
 * @version 3.1.0 - Comprehensive enterprise standards
 *
 * Sources:
 * - Google TypeScript Style Guide
 * - Airbnb JavaScript Style Guide
 * - React Query Best Practices
 * - React Native Community Guidelines
 */
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'error',

      // =========================================================================
      // TIER 1: CRITICAL - User-Facing Strings (i18n Compliance)
      // All user-visible text MUST be internationalized
      // =========================================================================

      /**
       * Alert.alert() - UI messages must be translated
       */
      {
        selector:
          'CallExpression[callee.object.name="Alert"][callee.property.name="alert"] > Literal[value=/^[A-Z].{3,}/]',
        message:
          '❌ I18N: Alert messages must use t() for internationalization.\n' +
          '✅ FIX: Alert.alert(t("alerts.title"), t("alerts.message"))',
      },

      /**
       * Toast/Snackbar messages
       */
      {
        selector:
          'CallExpression[callee.property.name=/^(show|toast|snackbar)$/i] > Literal[value=/^[A-Z].{3,}/]',
        message:
          '❌ I18N: Toast/notification messages must use t().\n' +
          '✅ FIX: toast.show(t("notifications.success"))',
      },

      /**
       * Placeholder text must be translated
       */
      {
        selector: 'JSXAttribute[name.name="placeholder"] > Literal[value=/^[A-Z].{3,}/]',
        message:
          '❌ I18N: Placeholder text must use t() for internationalization.\n' +
          '✅ FIX: placeholder={t("placeholders.email")}',
      },

      /**
       * Accessibility labels must be translated
       */
      {
        selector: 'JSXAttribute[name.name="accessibilityLabel"] > Literal[value=/^[A-Z].{3,}/]',
        message:
          '❌ I18N: Accessibility labels must use t().\n' +
          '✅ FIX: accessibilityLabel={t("a11y.closeButton")}',
      },

      /**
       * Button/component titles must be translated
       */
      {
        selector: 'JSXAttribute[name.name="title"] > Literal[value=/^[A-Z].{3,}/]',
        message:
          '❌ I18N: Titles must use t() for internationalization.\n' +
          '✅ FIX: title={t("buttons.submit")}',
      },

      /**
       * Label text must be translated
       */
      {
        selector: 'JSXAttribute[name.name="label"] > Literal[value=/^[A-Z].{3,}/]',
        message:
          '❌ I18N: Labels must use t() for internationalization.\n' +
          '✅ FIX: label={t("labels.email")}',
      },

      /**
       * Hint/helper text must be translated
       */
      {
        selector:
          'JSXAttribute[name.name=/^(hint|helperText|description)$/] > Literal[value=/^[A-Z].{3,}/]',
        message:
          '❌ I18N: Helper text must use t() for internationalization.\n' +
          '✅ FIX: hint={t("hints.passwordRequirements")}',
      },

      // =========================================================================
      // TIER 1: CRITICAL - Navigation (Type Safety)
      // Prevents runtime crashes from typos
      // =========================================================================

      /**
       * Navigation screen names must be constants
       */
      {
        selector:
          'CallExpression[callee.property.name=/^(navigate|push|replace|reset|goBack|popTo)$/] > Literal[value=/^[A-Z][a-zA-Z]+$/]',
        message:
          '❌ NAVIGATION: Screen names must be constants for type safety.\n' +
          '✅ FIX: navigation.navigate(SCREENS.HOME)\n' +
          '📖 WHY: Typos cause runtime crashes, constants catch at compile time',
      },

      /**
       * Stack.Screen names must be constants
       */
      {
        selector: 'JSXAttribute[name.name="name"] > Literal[value=/^[A-Z][a-zA-Z]+(Screen|Tab)$/]',
        message:
          '❌ NAVIGATION: Screen names must use SCREENS.* constants.\n' +
          '✅ FIX: <Stack.Screen name={SCREENS.HOME} ... />',
      },

      /**
       * initialRouteName must be constant
       */
      {
        selector:
          'JSXAttribute[name.name="initialRouteName"] > Literal[value=/^[A-Z][a-zA-Z]+$/]',
        message:
          '❌ NAVIGATION: initialRouteName must use SCREENS.* constant.\n' +
          '✅ FIX: initialRouteName={SCREENS.HOME}',
      },

      // =========================================================================
      // TIER 1: CRITICAL - API Patterns
      // Centralized endpoints prevent inconsistencies
      // =========================================================================

      /**
       * API endpoints must be constants
       */
      {
        selector:
          "CallExpression[callee.property.name=/^(get|post|put|patch|delete|request)$/] > Literal[value^='/']",
        message:
          '❌ API: Endpoints must use API_ENDPOINTS.* constants.\n' +
          '✅ FIX: api.get(API_ENDPOINTS.USERS.LIST)\n' +
          '📖 WHY: Centralized endpoints make API changes easier',
      },

      /**
       * API endpoints with template literals must use functions
       */
      {
        selector:
          "CallExpression[callee.property.name=/^(get|post|put|patch|delete|request)$/] > TemplateLiteral[quasis.0.value.raw^='/']",
        message:
          '❌ API: Dynamic endpoints must use API_ENDPOINTS.*.BY_ID() functions.\n' +
          '✅ FIX: api.get(API_ENDPOINTS.USERS.BY_ID(userId))',
      },

      /**
       * HTTP methods must be constants
       */
      {
        selector: 'Property[key.name="method"] > Literal[value=/^(GET|POST|PUT|PATCH|DELETE)$/]',
        message:
          '❌ HTTP: Methods should use HTTP_METHOD.* constants.\n' +
          '✅ FIX: method: HTTP_METHOD.POST',
      },

      /**
       * HTTP headers should be constants
       */
      {
        selector:
          "Property[key.value=/^(Content-Type|Authorization|Accept|X-Request-ID|X-Correlation-ID)$/]",
        message:
          '⚠️ HTTP: Common headers should use HTTP_HEADER.* constants.\n' +
          '✅ FIX: [HTTP_HEADER.CONTENT_TYPE]: "application/json"',
      },

      // =========================================================================
      // TIER 1: CRITICAL - Query/Cache Keys
      // Prevents cache invalidation bugs
      // =========================================================================

      /**
       * React Query keys must be constants
       */
      {
        selector:
          "CallExpression[callee.name=/^(useQuery|useMutation|useInfiniteQuery)$/] > ArrayExpression > Literal[value=/^[a-z].{2,}/]",
        message:
          '❌ QUERY: React Query keys must use QUERY_KEYS.* constants.\n' +
          '✅ FIX: useQuery({ queryKey: [QUERY_KEYS.USERS, userId] })\n' +
          '📖 WHY: Typos cause cache misses and stale data bugs',
      },

      /**
       * queryKey property must use constants
       */
      {
        selector:
          "Property[key.name='queryKey'] > ArrayExpression > Literal[value=/^[a-z].{2,}/]",
        message:
          '❌ QUERY: Query keys must use QUERY_KEYS.* constants.\n' +
          '✅ FIX: queryKey: [QUERY_KEYS.USERS, userId]',
      },

      /**
       * Query invalidation keys must be constants
       */
      {
        selector:
          "CallExpression[callee.property.name='invalidateQueries'] > ObjectExpression > Property[key.name='queryKey'] > ArrayExpression > Literal",
        message:
          '❌ QUERY: Invalidation keys must use QUERY_KEYS.* constants.\n' +
          '✅ FIX: queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] })',
      },

      // =========================================================================
      // TIER 1: CRITICAL - Storage Keys
      // Prevents data collision and loss
      // =========================================================================

      /**
       * AsyncStorage keys must be constants
       */
      {
        selector:
          "CallExpression[callee.object.name='AsyncStorage'] > Literal[value=/^[@a-z].{2,}/]",
        message:
          '❌ STORAGE: AsyncStorage keys must use STORAGE_KEYS.* constants.\n' +
          '✅ FIX: AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN)\n' +
          '📖 WHY: Typos cause data loss, constants are autocompleted',
      },

      /**
       * SecureStore keys must be constants
       */
      {
        selector:
          "CallExpression[callee.object.name='SecureStore'] > Literal[value=/^[@a-z].{2,}/]",
        message:
          '❌ STORAGE: SecureStore keys must use STORAGE_KEYS.* constants.\n' +
          '✅ FIX: SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN)',
      },

      /**
       * Storage key patterns with @ prefix
       */
      {
        selector: 'Literal[value=/^@[a-z][a-z_]{3,}$/]',
        message:
          '⚠️ STORAGE: Storage keys should use STORAGE_KEYS.* constants.\n' +
          '✅ FIX: STORAGE_KEYS.USER_PREFERENCES',
      },

      // =========================================================================
      // TIER 2: HIGH - Security Patterns
      // Prevents security vulnerabilities
      // =========================================================================

      /**
       * Potential hardcoded API keys
       */
      {
        selector: 'Literal[value=/^(sk_|pk_|api[_-]?key|secret[_-]?key|access[_-]?token)/i]',
        message:
          '🔴 SECURITY: Potential hardcoded secret detected!\n' +
          '✅ FIX: Use environment variables via Constants.expoConfig.extra',
      },

      /**
       * Potential hardcoded AWS credentials
       */
      {
        selector: 'Literal[value=/^(AKIA|ASIA)[A-Z0-9]{16}$/]',
        message:
          '🔴 SECURITY: Potential AWS access key detected!\n' +
          '✅ FIX: Never commit secrets. Use environment variables.',
      },

      /**
       * Potential hardcoded JWT tokens
       */
      {
        selector: 'Literal[value=/^eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$/]',
        message:
          '🔴 SECURITY: Potential hardcoded JWT token detected!\n' +
          '✅ FIX: Tokens should come from secure storage or API',
      },

      /**
       * Hardcoded passwords
       */
      {
        selector: "Property[key.name=/password/i] > Literal[value=/^.{4,}$/]",
        message:
          '🔴 SECURITY: Potential hardcoded password detected!\n' +
          '✅ FIX: Use secure storage or environment variables',
      },

      // =========================================================================
      // TIER 2: HIGH - Domain Values (Type Safety)
      // Business logic values must be typed
      // =========================================================================

      /**
       * User roles must be constants
       */
      {
        selector:
          "Property[key.name='role'] > Literal[value=/^(user|admin|club_admin|super_admin|moderator|member|guest)$/]",
        message:
          '❌ DOMAIN: User roles must use USER_ROLE.* constants.\n' +
          '✅ FIX: role: USER_ROLE.ADMIN',
      },

      /**
       * Status values must be constants
       */
      {
        selector:
          "Property[key.name='status'] > Literal[value=/^(pending|active|inactive|completed|cancelled|scheduled|in_progress|draft|published|archived)$/]",
        message:
          '❌ DOMAIN: Status values must use STATUS.* constants.\n' +
          '✅ FIX: status: STATUS.ACTIVE',
      },

      /**
       * Health status must be constants
       */
      {
        selector: 'Literal[value=/^(healthy|unhealthy|degraded)$/]',
        message:
          '❌ INFRASTRUCTURE: Use HEALTH_STATUS.* constant.\n' +
          '✅ FIX: status: HEALTH_STATUS.HEALTHY',
      },

      /**
       * Payment status must be constants
       */
      {
        selector:
          "Property[key.name=/^(paymentStatus|transactionStatus)$/] > Literal[value=/^.{4,}$/]",
        message:
          '❌ DOMAIN: Payment status must use PAYMENT_STATUS.* constants.\n' +
          '✅ FIX: paymentStatus: PAYMENT_STATUS.COMPLETED',
      },

      // =========================================================================
      // TIER 2: HIGH - Error Handling
      // Consistent error codes and messages
      // =========================================================================

      /**
       * Error constructor with long messages must use constants
       */
      {
        selector: 'ThrowStatement NewExpression[callee.name=/Error$/] > Literal[value=/^.{15,}$/]',
        message:
          '❌ ERROR: Long error messages must use ERROR_MESSAGES.* constants.\n' +
          '✅ FIX: throw new Error(ERROR_MESSAGES.AUTH.UNAUTHORIZED)',
      },

      /**
       * Error codes must be constants
       */
      {
        selector:
          "Property[key.name=/^(code|errorCode)$/] > Literal[value=/^[A-Z][A-Z_]{2,}$/]",
        message:
          '❌ ERROR: Error codes must use ERROR_CODE.* constants.\n' +
          '✅ FIX: code: ERROR_CODE.UNAUTHORIZED',
      },

      /**
       * Logger error messages should use constants (for searchability)
       */
      {
        selector:
          'CallExpression[callee.object.name="logger"][callee.property.name="error"] > Literal[value=/^.{15,}$/]',
        message:
          '⚠️ LOGGING: Long error messages should use LOG_MESSAGES.* constants.\n' +
          '✅ FIX: logger.error(LOG_MESSAGES.AUTH.LOGIN_FAILED, error)',
      },

      // =========================================================================
      // TIER 2: HIGH - Design System Compliance
      // Component props must use design tokens
      // =========================================================================

      /**
       * Text variant must use constants
       */
      {
        selector:
          "JSXAttribute[name.name='variant'] > Literal[value=/^(body|bodySmall|bodyLarge|h[1-4]|heading|label|labelLarge|labelSmall|caption|captionBold|button|buttonSmall|badge|helper|display|subtitle|overline)/]",
        message:
          '❌ DESIGN SYSTEM: Use TEXT_VARIANT.* constant for variant prop.\n' +
          '✅ FIX: variant={TEXT_VARIANT.BODY}',
      },

      /**
       * Text color semantic values must use constants
       */
      {
        selector:
          "JSXAttribute[name.name='color'] > Literal[value=/^(primary|secondary|tertiary|quaternary|disabled|placeholder|inverse|onPrimary|onSecondary|onAccent|link|success|warning|error|info|inherit|muted|accent)/]",
        message:
          '❌ DESIGN SYSTEM: Use TEXT_COLOR.* constant for semantic colors.\n' +
          '✅ FIX: color={TEXT_COLOR.PRIMARY}',
      },

      /**
       * Text weight must use constants
       */
      {
        selector:
          "JSXAttribute[name.name='weight'] > Literal[value=/^(light|regular|medium|semibold|bold|extrabold|thin|black)$/]",
        message:
          '❌ DESIGN SYSTEM: Use TEXT_WEIGHT.* constant for weight prop.\n' +
          '✅ FIX: weight={TEXT_WEIGHT.BOLD}',
      },

      /**
       * Text align must use constants
       */
      {
        selector: "JSXAttribute[name.name='align'] > Literal[value=/^(left|center|right|auto|justify)$/]",
        message:
          '❌ DESIGN SYSTEM: Use TEXT_ALIGN.* constant for align prop.\n' +
          '✅ FIX: align={TEXT_ALIGN.CENTER}',
      },

      /**
       * Component size must use constants
       */
      {
        selector:
          "JSXAttribute[name.name='size'] > Literal[value=/^(xs|sm|md|lg|xl|xxl|small|medium|large|tiny|huge)$/]",
        message:
          '❌ DESIGN SYSTEM: Use COMPONENT_SIZE.* constant for size prop.\n' +
          '✅ FIX: size={COMPONENT_SIZE.MD}',
      },

      /**
       * Hex colors in styles must use theme
       */
      {
        selector: "Property[key.name=/color/i] > Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message:
          '❌ THEME: Hex colors must use theme colors from useTheme().\n' +
          '✅ FIX: color: theme.colors.primary',
      },

      // =========================================================================
      // TIER 2: HIGH - Testing
      // Consistent test IDs for automation
      // =========================================================================

      /**
       * testID must use constants
       */
      {
        selector: 'JSXAttribute[name.name="testID"] > Literal[value=/^[a-z].{3,}/]',
        message:
          '❌ TESTING: testID must use TEST_IDS.* constants.\n' +
          '✅ FIX: testID={TEST_IDS.LOGIN.EMAIL_INPUT}\n' +
          '📖 WHY: Consistent IDs make E2E tests maintainable',
      },

      // =========================================================================
      // TIER 3: MEDIUM - Environment & Configuration
      // =========================================================================

      /**
       * Environment string comparisons
       */
      {
        selector:
          "BinaryExpression[operator='==='] > Literal[value=/^(development|production|staging|test|local)$/]",
        message:
          '⚠️ ENVIRONMENT: Use helper functions for environment checks.\n' +
          '✅ FIX: isDevelopment(), isProduction(), isStaging()',
      },

      /**
       * Platform comparisons should use constants
       */
      {
        selector:
          "BinaryExpression[left.object.name='Platform'][left.property.name='OS'] > Literal[value=/^(ios|android|web)$/]",
        message:
          '⚠️ PLATFORM: Consider using PLATFORM.* constants.\n' +
          '✅ FIX: Platform.OS === PLATFORM.IOS',
      },

      // =========================================================================
      // TIER 3: MEDIUM - Event Tracking & Analytics
      // Consistent event names for analytics
      // =========================================================================

      /**
       * Analytics event names should be constants
       */
      {
        selector:
          "CallExpression[callee.property.name=/^(track|logEvent|capture)$/] > Literal[value=/^[a-z_]{4,}$/]",
        message:
          '⚠️ ANALYTICS: Event names should use ANALYTICS_EVENT.* constants.\n' +
          '✅ FIX: analytics.track(ANALYTICS_EVENT.BUTTON_CLICK)',
      },

      /**
       * Firebase/Sentry event names
       */
      {
        selector:
          "CallExpression[callee.object.name=/^(analytics|Sentry|firebase)$/] > Literal[value=/^[a-z][a-z_]{3,}$/]",
        message:
          '⚠️ ANALYTICS: Event/tag names should use constants.\n' +
          '✅ FIX: Use ANALYTICS_EVENT.* or SENTRY_TAG.* constants',
      },

      // =========================================================================
      // DEPRECATED PATTERNS
      // =========================================================================

      /**
       * Prevent with statements
       */
      {
        selector: 'WithStatement',
        message: '❌ DEPRECATED: with statement is forbidden in strict mode.',
      },

      /**
       * Prevent labels (usually code smell)
       */
      {
        selector: 'LabeledStatement',
        message: '⚠️ CODE SMELL: Labels are rarely needed. Consider refactoring.',
      },
    ],
  },
};
