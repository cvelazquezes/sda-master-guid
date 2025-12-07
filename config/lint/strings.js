/**
 * Magic Strings ESLint Rules - GENERALIZED Enforcement
 *
 * ============================================================================
 * PHILOSOPHY: CATCH ALL STRING LITERALS, ALLOW SPECIFIC EXCEPTIONS
 * ============================================================================
 *
 * Instead of trying to catch specific patterns (which is endless),
 * these rules catch ALL string literals and template literals that
 * should be constants.
 *
 * WHAT GETS CAUGHT:
 * - Any string literal >= 4 characters in function arguments
 * - Any template literal in function arguments
 * - Any string literal that looks like a constant (UPPER_CASE, PascalCase)
 * - Any string literal in specific contexts (new Error, throw, etc.)
 *
 * EXCEPTIONS (handled in overrides.js):
 * - Constants definition files
 * - Type definition files
 * - Test files
 * - Config files
 *
 * @version 2.0.0 - Generalized approach
 */
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'error',

      // =========================================================================
      // GENERAL RULES - Catch ALL string literals in key contexts
      // =========================================================================

      // -----------------------------------------------------------------------
      // 1. String literal (>= 4 chars) in function calls
      //    EXCLUDES: t('key'), i18n.t('key'), require('path'), import('path')
      //    Catches: logger.info('message'), console.log('test'), etc.
      // -----------------------------------------------------------------------
      {
        selector:
          'CallExpression:not([callee.name="t"]):not([callee.object.name="i18n"]):not([callee.name="require"]):not([callee.type="Import"]):not([callee.object.name="console"]) > Literal[value=/^[A-Za-z].{3,}$/]',
        message:
          'String literal (>= 4 chars) in function call should be a constant. Move to @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 2. ANY template literal in function calls
      //    Catches: logger.info(`User ${id}`), throw new Error(`Failed: ${x}`)
      // -----------------------------------------------------------------------
      {
        selector: 'CallExpression > TemplateLiteral',
        message:
          'Template literal in function call should use a formatted constant. Use LOG_MESSAGES.FORMATTED.* or similar from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 3. ANY string literal in new Expression (constructors)
      //    Catches: new Error('msg'), new CircuitBreaker('API')
      // -----------------------------------------------------------------------
      {
        selector: 'NewExpression > Literal[value=/^.{3,}$/]',
        message: 'String literal in constructor should be a constant. Move to @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 4. ANY template literal in new Expression
      //    Catches: new Error(`Circuit breaker is ${state}`)
      // -----------------------------------------------------------------------
      {
        selector: 'NewExpression > TemplateLiteral',
        message:
          'Template literal in constructor should use a formatted constant. Use ERROR_MESSAGES.FORMATTED.* or similar from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 5. UPPER_CASE strings (look like constants that should be imported)
      //    Catches: 'ECONNRESET', 'ETIMEDOUT', 'CLOSED', 'OPEN', etc.
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/^[A-Z][A-Z0-9_]{2,}$/]',
        message:
          'UPPER_CASE string should be a constant. Import from @/shared/constants or define there',
      },

      // -----------------------------------------------------------------------
      // 6. PascalCase strings (service names, class names, error names)
      //    Catches: 'AuthService', 'CanceledError', 'NetworkError', etc.
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/^[A-Z][a-z]+([A-Z][a-z]+)+$/]',
        message:
          'PascalCase string should be a constant (likely a service/error name). Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 7. kebab-case strings in arrays (often query keys, IDs)
      //    Catches: ['current-user'], ['auth-token'], etc.
      //    Excludes: import paths handled by ImportDeclaration exclusion
      // -----------------------------------------------------------------------
      {
        selector: 'ArrayExpression > Literal[value=/^[a-z]+-[a-z-]+$/]',
        message: 'kebab-case string in array should be a constant. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 8. snake_case strings >= 4 chars (often storage keys, config keys)
      //    Catches: 'auth_token', 'csrf_token', etc.
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/^[a-z]+_[a-z_]+$/]',
        message: 'snake_case string should be a constant. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 9. Storage keys with @ prefix (AsyncStorage, SecureStore)
      //    Catches: '@feature_flags', '@user_settings', etc.
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/^@[a-z_]+$/]',
        message:
          'Storage key with @ prefix should be a constant. Use STORAGE_KEYS.* from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 10. camelCase strings >= 8 chars in property values (config keys, flag names)
      //     Catches: key: 'enableOfflineMode', name: 'featureFlagName'
      // -----------------------------------------------------------------------
      {
        selector: 'Property > Literal[value=/^[a-z]+[A-Z][a-zA-Z]{5,}$/]',
        message:
          'camelCase string in property value should be a constant. Use FEATURE_FLAG_KEY.* or similar from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 11. Short lowercase strings in arrays (user groups, tags, roles)
      //     Catches: ['beta', 'internal'], ['admin', 'user']
      // -----------------------------------------------------------------------
      {
        selector: 'ArrayExpression > Literal[value=/^[a-z]{4,12}$/]',
        message:
          'Short string in array should be a constant. Use USER_GROUP.* or similar from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 12. Environment name strings in comparisons
      //     Catches: === 'development', === 'production', === 'staging'
      // -----------------------------------------------------------------------
      {
        selector:
          "BinaryExpression[operator='==='] > Literal[value=/^(development|production|staging|test)$/]",
        message:
          'Use isDevelopment(), isProduction(), isStaging() helpers instead of string comparison. Import from @/shared/config/environment',
      },

      // -----------------------------------------------------------------------
      // 13. typeof comparison strings
      //     Catches: typeof x === 'boolean', typeof x === 'string', etc.
      // -----------------------------------------------------------------------
      {
        selector:
          "BinaryExpression[operator='==='][left.operator='typeof'] > Literal[value=/^(string|number|boolean|object|function|undefined|symbol|bigint)$/]",
        message: 'Use TYPEOF.* constant for typeof comparison. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 14. Health status strings
      //     Catches: 'healthy', 'unhealthy', 'degraded'
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/^(healthy|unhealthy|degraded)$/]',
        message: 'Use HEALTH_STATUS.* constant for health status. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 15. Query scope strings in property values
      //     Catches: scope: 'my', scope: 'all', scope: 'club'
      // -----------------------------------------------------------------------
      {
        selector: "Property[key.name='scope'] > Literal[value=/^(my|all|club)$/]",
        message: 'Use QUERY_SCOPE.* constant for query scope. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 16. Platform.OS comparisons
      //     Catches: Platform.OS === 'web', Platform.OS !== 'ios'
      // -----------------------------------------------------------------------
      {
        selector:
          "BinaryExpression[left.object.name='Platform'][left.property.name='OS'] > Literal[value=/^(web|ios|android)$/]",
        message:
          'Use PLATFORM_OS.* constant for platform comparison. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 17. Query parameter names in URLSearchParams
      //     Catches: params.get('limit'), params.append('cursor', ...)
      // -----------------------------------------------------------------------
      {
        selector:
          'CallExpression[callee.property.name=/^(get|append|set|has|delete)$/] > Literal[value=/^(limit|cursor|order|page|pageSize|sortBy|sortOrder)$/]',
        message:
          'Use QUERY_PARAM.* constant for query parameter names. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 18. Encoding strings
      //     Catches: toString('base64'), from(x, 'utf-8')
      // -----------------------------------------------------------------------
      {
        selector: 'CallExpression > Literal[value=/^(base64|utf-8|utf8|hex|ascii|binary)$/]',
        message: 'Use ENCODING.* constant for encoding type. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 19. Sort order strings
      //     Catches: order: 'asc', sortOrder: 'desc'
      // -----------------------------------------------------------------------
      {
        selector: 'Property[key.name=/order$/i] > Literal[value=/^(asc|desc)$/]',
        message: 'Use SORT_ORDER.* constant for sort order. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 20. StatusBar style strings (JSX)
      //     Catches: <StatusBar style="auto" />
      // -----------------------------------------------------------------------
      {
        selector: "JSXAttribute[name.name='style'] > Literal[value=/^(auto|light|dark|inverted)$/]",
        message:
          'Use STATUS_BAR_STYLE.* constant for StatusBar style. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 21. Network status strings
      //     Catches: 'online', 'offline', 'unknown'
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/^(online|offline)$/]',
        message: 'Use NETWORK_STATUS.* constant for network status. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 22. User role strings
      //     Catches: role: 'user', role: 'club_admin', role: 'super_admin'
      // -----------------------------------------------------------------------
      {
        selector: "Property[key.name='role'] > Literal[value=/^(user|club_admin|super_admin)$/]",
        message: 'Use USER_ROLE.* constant for user role. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 23. Match status strings
      //     Catches: status: 'scheduled', status: 'completed'
      // -----------------------------------------------------------------------
      {
        selector:
          "Property[key.name='status'] > Literal[value=/^(scheduled|in_progress|completed|cancelled)$/]",
        message: 'Use MATCH_STATUS.* constant for match status. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // 24. Language code strings
      //     Catches: language: 'en', lang: 'es'
      // -----------------------------------------------------------------------
      {
        selector: 'Property[key.name=/^(language|lang)$/] > Literal[value=/^(en|es|pt|fr)$/]',
        message: 'Use LANGUAGE.* constant for language code. Import from @/shared/constants',
      },

      // =========================================================================
      // SPECIFIC CONTEXT RULES - High-value patterns worth calling out
      // =========================================================================

      // -----------------------------------------------------------------------
      // Alert.alert() - UI messages must be translated/constant
      // -----------------------------------------------------------------------
      {
        selector:
          'CallExpression[callee.object.name="Alert"][callee.property.name="alert"] > Literal',
        message:
          'Alert messages must use MESSAGES.* constants or t() for i18n. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // throw new *Error() - Error messages must be constants
      // -----------------------------------------------------------------------
      {
        selector: 'ThrowStatement NewExpression[callee.name=/Error$/] > Literal',
        message:
          'Error messages must use ERROR_MESSAGES.* constants. Import from @/shared/constants',
      },
      {
        selector: 'ThrowStatement NewExpression[callee.name=/Error$/] > TemplateLiteral',
        message:
          'Error messages must use ERROR_MESSAGES.FORMATTED.* functions. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // logger.*() - Log messages must be constants
      // -----------------------------------------------------------------------
      {
        selector: 'CallExpression[callee.object.name="logger"] > Literal',
        message:
          'Logger messages must use LOG_MESSAGES.* constants. Import from @/shared/constants',
      },
      {
        selector: 'CallExpression[callee.object.name="logger"] > TemplateLiteral',
        message:
          'Logger messages must use LOG_MESSAGES.FORMATTED.* functions. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // JSX Props that are user-facing (must be i18n or constants)
      // -----------------------------------------------------------------------
      {
        selector: 'JSXAttribute[name.name="testID"] > Literal',
        message: 'testID must use TEST_IDS.* constant. Import from @/shared/constants',
      },
      {
        selector: 'JSXAttribute[name.name="accessibilityLabel"] > Literal[value=/^[A-Z].{3,}/]',
        message: 'accessibilityLabel must use t() or MESSAGES.* constant',
      },
      {
        selector: 'JSXAttribute[name.name="placeholder"] > Literal[value=/^[A-Z].{3,}/]',
        message: 'placeholder must use t() or MESSAGES.PLACEHOLDERS.* constant',
      },

      // -----------------------------------------------------------------------
      // Navigation - Screen names must be constants
      // -----------------------------------------------------------------------
      {
        selector:
          'CallExpression[callee.property.name=/^(navigate|push|replace)$/] > Literal[value=/^[A-Z]/]',
        message: 'Screen names must use SCREENS.* constant. Import from @/shared/constants',
      },
      {
        selector: 'JSXAttribute[name.name="name"] > Literal[value=/^[A-Z][a-zA-Z]+$/]',
        message: 'Screen/Tab names must use SCREENS.* or TABS.* constant',
      },

      // -----------------------------------------------------------------------
      // API endpoints - Must use API_ENDPOINTS constants
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.property.name=/^(get|post|put|patch|delete)$/] > Literal[value^='/']",
        message: 'API endpoints must use API_ENDPOINTS.* constants. Import from @/shared/constants',
      },
      {
        selector:
          'CallExpression[callee.property.name=/^(get|post|put|patch|delete)$/] > TemplateLiteral',
        message:
          'API endpoints must use API_ENDPOINTS.*.BY_ID() or similar functions. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // HTTP - Headers and methods
      // -----------------------------------------------------------------------
      {
        selector: 'Property[key.name="method"] > Literal[value=/^(GET|POST|PUT|PATCH|DELETE)$/]',
        message: 'HTTP methods must use HTTP_METHOD.* constant. Import from @/shared/constants',
      },
      {
        selector:
          "MemberExpression[property.type='Literal'][property.value=/^(Content-Type|Authorization|Accept)$/]",
        message: 'HTTP headers must use HEADER.* constant. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // Comparison with 'in' operator using string - usually checking properties
      // -----------------------------------------------------------------------
      {
        selector: "BinaryExpression[operator='in'] > Literal[value=/^[a-z]{4,}$/]:first-child",
        message: 'Property name in "in" check should be a constant if used multiple times',
      },

      // =========================================================================
      // COLOR AND STYLE LITERALS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Hex color strings (#XXXXXX or #XXX)
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
        message: 'Hex color should be a constant. Use theme colors or define in @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // CSS color keywords in style properties
      // -----------------------------------------------------------------------
      {
        selector: "Property[key.name='backgroundColor'] > Literal[value='transparent']",
        message: 'Use SHADOW_COLOR.NONE or theme color constant instead of "transparent"',
      },
      {
        selector: "Property[key.name='shadowColor'] > Literal[value='transparent']",
        message: 'Use SHADOW_COLOR.NONE constant instead of "transparent"',
      },
      {
        selector: "Property[key.name='shadowColor'] > Literal[value=/^#/]",
        message: 'Use SHADOW_COLOR.DEFAULT or theme constant instead of hex color',
      },
      {
        selector: "Property[key.name='color'] > Literal[value='inherit']",
        message: 'Use TEXT_COLOR.INHERIT constant instead of "inherit"',
      },

      // =========================================================================
      // JSX COMPONENT PROP LITERALS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Text component variant/color/weight props
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXAttribute[name.name='variant'] > Literal[value=/^(body|bodySmall|bodyLarge|h[1-4]|heading|label|caption|button|badge|helper|display)/]",
        message: 'Use TEXT_VARIANT.* constant for variant prop. Import from @/shared/constants',
      },
      {
        selector:
          "JSXAttribute[name.name='color'] > Literal[value=/^(primary|secondary|tertiary|disabled|error|warning|success|info|onPrimary|onSecondary|inverse|link|inherit)/]",
        message: 'Use TEXT_COLOR.* constant for color prop. Import from @/shared/constants',
      },
      {
        selector:
          "JSXAttribute[name.name='weight'] > Literal[value=/^(light|regular|medium|semibold|bold|extrabold)$/]",
        message: 'Use TEXT_WEIGHT.* constant for weight prop. Import from @/shared/constants',
      },
      {
        selector: "JSXAttribute[name.name='align'] > Literal[value=/^(left|center|right|auto)$/]",
        message: 'Use TEXT_ALIGN.* constant for align prop. Import from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // Component size/variant props
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXAttribute[name.name='size'] > Literal[value=/^(xs|sm|md|lg|xl|small|medium|large)$/]",
        message:
          'Use COMPONENT_SIZE.* or BUTTON_SIZE.* constant for size prop. Import from @/shared/constants',
      },

      // =========================================================================
      // ERROR CLASS AND ERROR NAME PATTERNS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Error class name assignment (this.name = '...')
      // -----------------------------------------------------------------------
      {
        selector:
          "AssignmentExpression[left.object.type='ThisExpression'][left.property.name='name'] > Literal[value=/Error$/]",
        message: 'Use ERROR_NAME.* constant for error class name. Import from @/shared/constants',
      },

      // =========================================================================
      // OBJECT PROPERTY ACCESS PATTERNS
      // =========================================================================

      // -----------------------------------------------------------------------
      // 'in' operator property checks with common property names
      // -----------------------------------------------------------------------
      {
        selector:
          "BinaryExpression[operator='in'] > Literal[value=/^(response|message|code|status|data|error)$/]:first-child",
        message:
          'Use OBJECT_PROPERTY.* constant for property check. Import from @/shared/constants',
      },

      // =========================================================================
      // TIME FORMAT AND REGEX PATTERNS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Time format strings in regex
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='regex'] > Literal[value=/^\\^\\\\d/]",
        message: 'Use TIME_REGEX or define pattern constant for time/date regex',
      },

      // =========================================================================
      // EMPTY STRING LITERALS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Empty string literals ('' or "")
      // Catches: || '', ?? '', === '', !== '', = ''
      // Use EMPTY_VALUE constant instead
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=""]',
        message:
          'Empty string literal should be a constant. Use EMPTY_VALUE from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // Single space string literals (' ')
      // Catches: {' '} in JSX for spacing between elements
      // Use SINGLE_SPACE constant instead
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=" "]',
        message:
          'Single space literal should be a constant. Use SINGLE_SPACE from @/shared/constants',
      },

      // =========================================================================
      // TYPE DEFINITIONS THAT SHOULD BE IMPORTED
      // =========================================================================

      // -----------------------------------------------------------------------
      // Local IconName type definition
      // Catches: type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name']
      // Use shared IconName type instead
      // -----------------------------------------------------------------------
      {
        selector: "TSTypeAliasDeclaration[id.name='IconName']",
        message:
          'IconName type should be imported from @/shared/constants, not defined locally. Import { IconName } from @/shared/constants',
      },

      // =========================================================================
      // REGEX CONSTANTS THAT SHOULD BE IMPORTED
      // =========================================================================

      // -----------------------------------------------------------------------
      // Local regex constant definitions
      // Catches: const EMAIL_REGEX = /.../, const PHONE_REGEX = /.../, etc.
      // Use shared regex constants from @/shared/constants
      // -----------------------------------------------------------------------
      {
        selector:
          "VariableDeclarator[id.name=/^(EMAIL_REGEX|PHONE_REGEX|UUID_REGEX|TIME_REGEX|IDEMPOTENCY_KEY_REGEX)$/][init.type='Literal']",
        message:
          'Regex constant should be imported from @/shared/constants, not defined locally. Import { EMAIL_REGEX, PHONE_REGEX, UUID_REGEX } from @/shared/constants',
      },

      // =========================================================================
      // ZOD VALIDATION PATTERNS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Inline regex in Zod .regex() calls
      // Catches: .regex(/[A-Z]/, ...), .regex(/^\+?[1-9]/, ...)
      // Use PASSWORD.REGEX.*, PHONE.REGEX, NAME.REGEX from @/shared/constants/validation
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='regex'] > Literal[regex]",
        message:
          'Inline regex in Zod validation should be a constant. Use PASSWORD.REGEX.*, PHONE.REGEX, NAME.REGEX from @/shared/constants/validation',
      },

      // -----------------------------------------------------------------------
      // Number literals in Zod .min() calls
      // Catches: .min(1, ...), .min(8, ...)
      // Use NUMERIC.MIN_REQUIRED, PASSWORD.MIN_LENGTH, TEXT.NAME_MIN from @/shared/constants/validation
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='min'] > Literal[value]",
        message:
          'Number literal in .min() should be a constant. Use NUMERIC.MIN_REQUIRED, PASSWORD.MIN_LENGTH, TEXT.* from @/shared/constants/validation',
      },

      // -----------------------------------------------------------------------
      // Number literals in Zod .max() calls
      // Catches: .max(100, ...), .max(128, ...)
      // Use PASSWORD.MAX_LENGTH, TEXT.NAME_MAX, TEXT.MEDIUM_TEXT_MAX from @/shared/constants/validation
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='max'] > Literal[value]",
        message:
          'Number literal in .max() should be a constant. Use PASSWORD.MAX_LENGTH, TEXT.* from @/shared/constants/validation',
      },

      // -----------------------------------------------------------------------
      // Number literals in Zod .length() calls
      // Catches: .length(2), .length(36)
      // Use TEXT.LANGUAGE_CODE_LENGTH, UUID.LENGTH from @/shared/constants/validation
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='length'] > Literal[value]",
        message:
          'Number literal in .length() should be a constant. Use TEXT.LANGUAGE_CODE_LENGTH, UUID.LENGTH from @/shared/constants/validation',
      },

      // =========================================================================
      // STRING DELIMITER PATTERNS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Dot delimiter in .join() calls
      // Catches: .join('.')
      // Use STRING_DELIMITER.DOT from @/shared/constants
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='join'] > Literal[value='.']",
        message:
          'Dot delimiter should be a constant. Use STRING_DELIMITER.DOT from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // Comma delimiter in .join() calls
      // Catches: .join(',')
      // Use STRING_DELIMITER.COMMA from @/shared/constants
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='join'] > Literal[value=',']",
        message:
          'Comma delimiter should be a constant. Use STRING_DELIMITER.COMMA from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // Colon delimiter in .split()/.join() calls
      // Catches: .split(':'), .join(':')
      // Use SORT_PARSE.DELIMITER from @/shared/constants
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name=/^(split|join)$/] > Literal[value=':']",
        message:
          'Colon delimiter should be a constant. Use SORT_PARSE.DELIMITER from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // Hyphen/dash prefix in .startsWith() calls
      // Catches: .startsWith('-')
      // Use SORT_PARSE.DESC_PREFIX from @/shared/constants
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='startsWith'] > Literal[value='-']",
        message:
          'Hyphen prefix should be a constant. Use SORT_PARSE.DESC_PREFIX from @/shared/constants',
      },

      // -----------------------------------------------------------------------
      // Common delimiters in .includes() calls
      // Catches: .includes(':'), .includes('/')
      // Use appropriate delimiter constant from @/shared/constants
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='includes'] > Literal[value=':']",
        message:
          'Colon in .includes() should be a constant. Use SORT_PARSE.DELIMITER from @/shared/constants',
      },
    ],
  },
};
