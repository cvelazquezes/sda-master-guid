/**
 * UI Constants - Single Source of Truth for UI-related string values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL UI STRING VALUES
 * ============================================================================
 *
 * All UI-related string values should be referenced from here.
 * This ensures type safety, consistency, and easier refactoring.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: animationType="slide", accessibilityRole="button"
 * ✅ ALWAYS use: animationType={ANIMATION.SLIDE}, accessibilityRole={A11Y_ROLE.BUTTON}
 *
 * @version 1.0.0
 */

/**
 * App Info - Version and metadata
 */
export const APP_VERSION = '1.0.0' as const;

/**
 * Animation Types - Used for Modal and other animations
 */
export const ANIMATION = {
  SLIDE: 'slide',
  FADE: 'fade',
  NONE: 'none',
} as const;

/**
 * Animation Duration Constants - in milliseconds
 */
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  MEDIUM: 400,
  SLOW: 500,
} as const;

/**
 * Accessibility Roles - Used for accessibilityRole prop
 */
export const A11Y_ROLE = {
  BUTTON: 'button',
  LINK: 'link',
  HEADER: 'header',
  SEARCH: 'search',
  IMAGE: 'image',
  TEXT: 'text',
  ADJUSTABLE: 'adjustable',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SWITCH: 'switch',
  TAB: 'tab',
  TABLIST: 'tablist',
  TIMER: 'timer',
  TOOLBAR: 'toolbar',
  ALERT: 'alert',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  PROGRESSBAR: 'progressbar',
  SCROLLBAR: 'scrollbar',
  SPINBUTTON: 'spinbutton',
  SUMMARY: 'summary',
  LIST: 'list',
  LISTITEM: 'listitem',
  NONE: 'none',
} as const;

/**
 * Keyboard Types - Used for TextInput keyboardType prop
 */
export const KEYBOARD_TYPE = {
  DEFAULT: 'default',
  EMAIL: 'email-address',
  NUMERIC: 'numeric',
  PHONE: 'phone-pad',
  NUMBER_PAD: 'number-pad',
  DECIMAL_PAD: 'decimal-pad',
  DECIMAL: 'decimal-pad',
  URL: 'url',
  ASCII: 'ascii-capable',
  VISIBLE_PASSWORD: 'visible-password',
} as const;

/**
 * Return Key Types - Used for TextInput returnKeyType prop
 */
export const RETURN_KEY = {
  DONE: 'done',
  GO: 'go',
  NEXT: 'next',
  SEARCH: 'search',
  SEND: 'send',
  NONE: 'none',
  PREVIOUS: 'previous',
  DEFAULT: 'default',
  EMERGENCY_CALL: 'emergency-call',
  GOOGLE: 'google',
  JOIN: 'join',
  ROUTE: 'route',
  YAHOO: 'yahoo',
} as const;

/**
 * Auto Capitalize Types - Used for TextInput autoCapitalize prop
 */
export const AUTO_CAPITALIZE = {
  NONE: 'none',
  SENTENCES: 'sentences',
  WORDS: 'words',
  CHARACTERS: 'characters',
} as const;

/**
 * Auto Complete Types - Used for TextInput autoComplete prop
 */
export const AUTO_COMPLETE = {
  OFF: 'off',
  EMAIL: 'email',
  PASSWORD: 'password',
  NEW_PASSWORD: 'new-password',
  CURRENT_PASSWORD: 'current-password',
  NAME: 'name',
  GIVEN_NAME: 'given-name',
  FAMILY_NAME: 'family-name',
  USERNAME: 'username',
  TEL: 'tel',
} as const;

/**
 * Content Fit Types - Used for Image contentFit prop
 */
export const CONTENT_FIT = {
  COVER: 'cover',
  CONTAIN: 'contain',
  FILL: 'fill',
  NONE: 'none',
  SCALE_DOWN: 'scale-down',
} as const;

/**
 * Status Bar Styles
 */
export const STATUS_BAR = {
  LIGHT: 'light-content',
  DARK: 'dark-content',
  DEFAULT: 'default',
} as const;

/**
 * Text Line Limits - Used for numberOfLines prop
 */
export const TEXT_LINES = {
  single: 1,
  double: 2,
  triple: 3,
  quad: 4,
} as const;

/**
 * Touch Opacity - Used for activeOpacity prop on TouchableOpacity
 */
/**
 * Opacity Hex Values - For adding transparency to colors
 * Usage: `${color}${OPACITY.LIGHT}` → e.g., "#FF0000" + "20" = "#FF000020"
 */
export const OPACITY = {
  LIGHT: '20',
  MEDIUM: '50',
  STRONG: '80',
  FULL: 'FF',
} as const;

export const TOUCH_OPACITY = {
  default: 0.7,
  light: 0.8,
  heavy: 0.5,
  minimal: 0.9,
} as const;

/**
 * Component Size - Used for size prop on components
 */
export const COMPONENT_SIZE = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

/**
 * Component Variant - Used for variant prop on components
 */
export const COMPONENT_VARIANT = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  ghost: 'ghost',
  danger: 'danger',
  outline: 'outline',
  outlined: 'outlined',
  elevated: 'elevated',
  flat: 'flat',
  neutral: 'neutral',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
} as const;

/**
 * Icon Position - Used for icon placement in buttons and other components
 */
export const ICON_POSITION = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

/**
 * Orientation - Used for dividers and layouts
 */
export const ORIENTATION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
} as const;

/**
 * List Thresholds - Used for optimized list configurations
 */
export const LIST_THRESHOLDS = {
  ON_END_REACHED: 0.5,
  ITEM_VISIBLE_PERCENT: 50,
  MINIMUM_VIEW_TIME: 300,
} as const;

/**
 * Spacing Keys - Used for referencing spacing values by name
 */
export const SPACING_KEY = {
  XXS: 'xxs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl',
} as const;

/**
 * Modal Configuration - Used for modal size calculations
 */
export const MODAL_CONFIG = {
  PERCENTAGE_SYMBOL: '%',
  MAX_HEIGHT_RATIO: 0.9,
  PERCENTAGE_DIVISOR: 100,
} as const;

/**
 * Modal Width Breakpoints and Ratios - Used for responsive modal sizing
 */
export const MODAL_WIDTH = {
  BREAKPOINTS: {
    LARGE: 1200,
    MEDIUM: 768,
    SMALL: 480,
  },
  MAX: {
    LARGE: 700,
    MEDIUM: 600,
    SHARE: 500,
  },
  RATIO: {
    HALF: 0.5,
    SEVENTY: 0.7,
    SEVENTY_FIVE: 0.75,
    EIGHTY_FIVE: 0.85,
    NINETY: 0.9,
    NINETY_FIVE: 0.95,
  },
} as const;

/**
 * Move Direction - Used for item reordering
 */
export const MOVE_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
} as const;

/**
 * ID Prefixes - Used for generating unique IDs
 */
export const ID_PREFIX = {
  ITEM: 'item',
  PAYMENT: 'payment',
  CHARGE: 'charge',
  NOTIFICATION: 'notification',
} as const;

/**
 * Regex Patterns - Common regex patterns for validation and formatting
 */
export const REGEX_PATTERN = {
  /**
   * Matches any character that is NOT a digit (0-9) or plus sign (+)
   * Used for phone number cleaning
   */
  NON_PHONE_CHARS: /[^0-9+]/g,
} as const;

/**
 * Text Input Configuration
 */
export const TEXT_INPUT = {
  NUMBER_OF_LINES: {
    SINGLE: 1,
    DOUBLE: 2,
    MULTI: 4,
  },
} as const;

/**
 * Entity Status - Used for status prop on components
 */
export const STATUS = {
  active: 'active',
  inactive: 'inactive',
  pending: 'pending',
  paused: 'paused',
} as const;

/**
 * Activity Indicator Size - Used for ActivityIndicator size prop
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: size="large"
 * ✅ ALWAYS use: size={ACTIVITY_INDICATOR_SIZE.large}
 */
export const ACTIVITY_INDICATOR_SIZE = {
  small: 'small',
  large: 'large',
} as const;

/**
 * Language - Used for i18n configuration
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: fallbackLng: 'en'
 * ✅ ALWAYS use: fallbackLng: LANGUAGE.ENGLISH
 */
export const LANGUAGE = {
  ENGLISH: 'en',
  SPANISH: 'es',
} as const;

export const DEFAULT_LANGUAGE = LANGUAGE.ENGLISH;

/**
 * i18n Configuration - Settings for i18next
 */
export const I18N_CONFIG = {
  DETECTOR_TYPE: 'languageDetector',
  COMPATIBILITY_JSON: 'v4',
  ESCAPE_VALUE: false,
  USE_SUSPENSE: false,
} as const;

/**
 * Locale Configuration - Date/time locale identifiers
 */
export const LOCALE = {
  ENGLISH_US: 'en-US',
  SPANISH_MX: 'es-MX',
} as const;

/**
 * Notification Type - Types of notifications
 */
export const NOTIFICATION_CHANNEL = {
  WHATSAPP: 'whatsapp',
  PUSH: 'push',
  BOTH: 'both',
} as const;

/**
 * Match Round Status
 */
export const MATCH_ROUND_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

/**
 * URL Templates - External service URLs
 */
export const URL_TEMPLATE = {
  WHATSAPP_APP: 'whatsapp://send?phone={{phone}}&text={{message}}',
  WHATSAPP_WEB: 'https://wa.me/{{phone}}?text={{message}}',
} as const;

/**
 * Platform identifiers
 */
export const PLATFORM = {
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
} as const;

/**
 * Theme Mode - Used for theme switching
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: mode: 'light', mode: 'dark'
 * ✅ ALWAYS use: mode: THEME_MODE.LIGHT
 */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

/**
 * Screen Presentation - Used for navigation screen presentation options
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: presentation: 'modal'
 * ✅ ALWAYS use: presentation: PRESENTATION.MODAL
 */
export const PRESENTATION = {
  CARD: 'card',
  MODAL: 'modal',
  TRANSPARENT_MODAL: 'transparentModal',
  CONTAINED_MODAL: 'containedModal',
  CONTAINED_TRANSPARENT_MODAL: 'containedTransparentModal',
  FULL_SCREEN_MODAL: 'fullScreenModal',
  FORM_SHEET: 'formSheet',
} as const;

/**
 * Badge Display - Used for notification badge display
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: count > 9 ? '9+' : count
 * ✅ ALWAYS use: count > BADGE.MAX_COUNT ? BADGE.OVERFLOW_TEXT : count
 */
export const BADGE = {
  MAX_COUNT: 9,
  OVERFLOW_TEXT: '9+',
} as const;

/**
 * Button Size - Used for StandardButton size prop
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: size="large"
 * ✅ ALWAYS use: size={BUTTON_SIZE.large}
 */
export const BUTTON_SIZE = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

/**
 * Alert Button Style - Used for Alert.alert button options
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: style: 'destructive'
 * ✅ ALWAYS use: style: ALERT_BUTTON_STYLE.DESTRUCTIVE
 */
export const ALERT_BUTTON_STYLE = {
  DEFAULT: 'default',
  CANCEL: 'cancel',
  DESTRUCTIVE: 'destructive',
} as const;

/**
 * Hierarchy Fields - Field names for organizational hierarchy
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: field === 'division'
 * ✅ ALWAYS use: field === HIERARCHY_FIELDS.DIVISION
 */
export const HIERARCHY_FIELDS = {
  DIVISION: 'division',
  UNION: 'union',
  ASSOCIATION: 'association',
  CHURCH: 'church',
  CLUB: 'club',
  CLUB_ID: 'clubId',
  STATUS: 'status',
  ROLE: 'role',
} as const;

/**
 * Filter Status - Common filter status values
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: status: 'all'
 * ✅ ALWAYS use: status: FILTER_STATUS.ALL
 */
export const FILTER_STATUS: {
  ALL: string;
  ACTIVE: string;
  INACTIVE: string;
} = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Empty String - Use for initializing form fields and filters
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: name: ''  (when used as default/empty value)
 * ✅ ALWAYS use: name: EMPTY_VALUE
 */
export const EMPTY_VALUE: string = '';

/**
 * Ellipsis - Used for text truncation
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: '...'
 * ✅ ALWAYS use: ELLIPSIS
 */
export const ELLIPSIS = '...';

/**
 * List Separator - Used for joining list items
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: array.join(', ')
 * ✅ ALWAYS use: array.join(LIST_SEPARATOR)
 */
export const LIST_SEPARATOR = ', ';

/**
 * Fee Screen Tabs - Used for tab navigation in ClubFeesScreen
 */
export const FEE_TABS = {
  SETTINGS: 'settings',
  BALANCES: 'balances',
  CHARGES: 'charges',
} as const;

/**
 * My Fees Tab IDs - For member fee screen tabs
 */
export const MY_FEES_TAB = {
  OVERVIEW: 'overview',
  HISTORY: 'history',
  CHARGES: 'charges',
} as const;

/**
 * All Months - Array of all month numbers (1-12)
 * Used for "Select All" months functionality
 */
export const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/**
 * Round Status - Status values for match rounds
 */
export const ROUND_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

/**
 * Notification Types - For categorizing notifications
 */
export const NOTIFICATION_TYPE = {
  ACTIVITY: 'activity',
  FEE: 'fee',
  CLUB: 'club',
  SYSTEM: 'system',
} as const;

/**
 * Payment Status - Status values for payment filters
 */
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
} as const;

/**
 * Balance Status - For financial balance states
 */
export const BALANCE_STATUS = {
  GOOD: 'good',
  OVERDUE: 'overdue',
  PENDING: 'pending',
  NEUTRAL: 'neutral',
} as const;

/**
 * Member Tab IDs - Tab identifiers for member management
 */
export const MEMBER_TAB = {
  APPROVED: 'approved',
  PENDING: 'pending',
} as const;

/**
 * Filter Section IDs
 */
export const FILTER_SECTION = {
  STATUS: 'status',
  PAYMENT: 'payment',
  CLASS: 'class',
} as const;

/**
 * Platform OS - Used for platform-specific behavior
 */
export const PLATFORM_OS = {
  IOS: 'ios',
  ANDROID: 'android',
} as const;

/**
 * Keyboard Avoiding Behavior - Used for KeyboardAvoidingView
 */
export const KEYBOARD_BEHAVIOR = {
  PADDING: 'padding',
  HEIGHT: 'height',
  POSITION: 'position',
} as const;

/**
 * Test IDs - Used for testing
 */
export const TEST_IDS = {
  EMAIL_INPUT: 'email-input',
  PASSWORD_INPUT: 'password-input',
  LOGIN_BUTTON: 'login-button',
  REGISTER_BUTTON: 'register-button',
} as const;

/**
 * Form Field Names - Used for error field detection
 */
export const FORM_FIELDS = {
  EMAIL: 'email',
  PASSWORD: 'Password',
} as const;

/**
 * SafeAreaView Edges - Standard edge configurations
 */
export const SAFE_AREA_EDGES = {
  TOP_LEFT_RIGHT: ['top', 'left', 'right'] as const,
  ALL: ['top', 'bottom', 'left', 'right'] as const,
  TOP_BOTTOM: ['top', 'bottom'] as const,
  NONE: [] as const,
} as const;

/**
 * Organization Types Array - For iteration and type checking
 */
export const ORGANIZATION_TYPES = ['division', 'union', 'association', 'church'] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

// Type exports
export type AnimationType = (typeof ANIMATION)[keyof typeof ANIMATION];
export type A11yRole = (typeof A11Y_ROLE)[keyof typeof A11Y_ROLE];
export type KeyboardType = (typeof KEYBOARD_TYPE)[keyof typeof KEYBOARD_TYPE];
export type ReturnKeyType = (typeof RETURN_KEY)[keyof typeof RETURN_KEY];
export type AutoCapitalizeType = (typeof AUTO_CAPITALIZE)[keyof typeof AUTO_CAPITALIZE];
export type ContentFitType = (typeof CONTENT_FIT)[keyof typeof CONTENT_FIT];
export type StatusBarStyle = (typeof STATUS_BAR)[keyof typeof STATUS_BAR];
export type TextLines = (typeof TEXT_LINES)[keyof typeof TEXT_LINES];
export type TouchOpacity = (typeof TOUCH_OPACITY)[keyof typeof TOUCH_OPACITY];
export type ComponentSize = (typeof COMPONENT_SIZE)[keyof typeof COMPONENT_SIZE];
export type ComponentVariant = (typeof COMPONENT_VARIANT)[keyof typeof COMPONENT_VARIANT];
export type EntityStatus = (typeof STATUS)[keyof typeof STATUS];
export type ActivityIndicatorSize =
  (typeof ACTIVITY_INDICATOR_SIZE)[keyof typeof ACTIVITY_INDICATOR_SIZE];
export type ThemeModeValue = (typeof THEME_MODE)[keyof typeof THEME_MODE];
export type PresentationType = (typeof PRESENTATION)[keyof typeof PRESENTATION];
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];
export type AlertButtonStyle = (typeof ALERT_BUTTON_STYLE)[keyof typeof ALERT_BUTTON_STYLE];
export type HierarchyField = (typeof HIERARCHY_FIELDS)[keyof typeof HIERARCHY_FIELDS];
export type FilterStatus = (typeof FILTER_STATUS)[keyof typeof FILTER_STATUS];
