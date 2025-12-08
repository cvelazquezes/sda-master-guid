/**
 * UI Constants - Single Source of Truth for UI behavior values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR UI BEHAVIOR
 * ============================================================================
 *
 * Contains: Animation types, accessibility, input behavior, status values
 *
 * NOTE: Component sizes/variants moved to components.ts
 * NOTE: Layout values moved to layout.ts
 * NOTE: App version moved to app.ts
 *
 * @version 2.0.0
 */
/* eslint-disable no-magic-numbers */

// =============================================================================
// ANIMATION
// =============================================================================

/**
 * Animation Types - Used for Modal and other animations
 */
export const ANIMATION_TYPE = {
  SLIDE: 'slide',
  FADE: 'fade',
  NONE: 'none',
} as const;

// =============================================================================
// ACCESSIBILITY
// =============================================================================

/**
 * Accessibility Roles - Used for accessibilityRole prop
 */
export const A11Y_ROLE = {
  NONE: 'none',
  BUTTON: 'button',
  LINK: 'link',
  SEARCH: 'search',
  IMAGE: 'image',
  IMAGEBUTTON: 'imagebutton',
  KEYBOARDKEY: 'keyboardkey',
  TEXT: 'text',
  ADJUSTABLE: 'adjustable',
  HEADER: 'header',
  SUMMARY: 'summary',
  ALERT: 'alert',
  CHECKBOX: 'checkbox',
  COMBOBOX: 'combobox',
  MENU: 'menu',
  MENUBAR: 'menubar',
  MENUITEM: 'menuitem',
  PROGRESSBAR: 'progressbar',
  RADIO: 'radio',
  RADIOGROUP: 'radiogroup',
  SCROLLBAR: 'scrollbar',
  SPINBUTTON: 'spinbutton',
  SWITCH: 'switch',
  TAB: 'tab',
  TABLIST: 'tablist',
  TIMER: 'timer',
  TOOLBAR: 'toolbar',
  LIST: 'list',
  LISTITEM: 'listitem',
} as const;

/** Type for accessibility roles derived from constants */
export type AccessibilityRoleType = (typeof A11Y_ROLE)[keyof typeof A11Y_ROLE];

/**
 * Accessibility checked state
 */
export const A11Y_CHECKED = {
  TRUE: true,
  FALSE: false,
  MIXED: 'mixed',
} as const;

/**
 * Alert/notification types for accessibility
 */
export const A11Y_ALERT_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export type A11yAlertType = (typeof A11Y_ALERT_TYPE)[keyof typeof A11Y_ALERT_TYPE];

/**
 * Accessibility label templates
 */
export const A11Y_LABEL = {
  LOADING: 'Loading',
  REQUIRED_FIELD: 'Required field',
  REQUIRED_SUFFIX: '(required)',
  HEADING_LEVEL: (level: number) => `Heading level ${level}`,
  TAB_POSITION: (label: string, index: number, total: number) =>
    `${label}, tab ${index + 1} of ${total}`,
  ITEM_POSITION: (title: string, index: number, total: number, description?: string) => {
    const parts = [title, `item ${index + 1} of ${total}`, description];
    return parts.filter(Boolean).join(', ');
  },
  ALERT_MESSAGE: (type: string, message: string) => `${type}: ${message}`,
} as const;

/**
 * Accessibility number format labels
 */
export const A11Y_NUMBER_LABEL = {
  MILLION: 'million',
  THOUSAND: 'thousand',
} as const;

// =============================================================================
// INPUT BEHAVIOR
// =============================================================================

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
 * Keyboard Avoiding Behavior - Used for KeyboardAvoidingView
 */
export const KEYBOARD_BEHAVIOR = {
  PADDING: 'padding',
  HEIGHT: 'height',
  POSITION: 'position',
} as const;

// =============================================================================
// IMAGE & MEDIA
// =============================================================================

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

// =============================================================================
// STATUS BAR
// =============================================================================

/**
 * Status Bar Styles
 */
export const STATUS_BAR = {
  LIGHT: 'light-content',
  DARK: 'dark-content',
  DEFAULT: 'default',
} as const;

// =============================================================================
// OPACITY VALUES
// =============================================================================

/**
 * Opacity Hex Values - For adding transparency to colors
 * Usage: `${color}${OPACITY_HEX.LIGHT}` → e.g., "#FF0000" + "20" = "#FF000020"
 */
export const OPACITY_HEX = {
  LIGHT: '20',
  MEDIUM: '50',
  STRONG: '80',
  FULL: 'FF',
} as const;

// =============================================================================
// STATUS VALUES
// =============================================================================

/**
 * Entity Status - Generic status values
 */
export const ENTITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  PAUSED: 'paused',
} as const;

/**
 * Payment Status - Status values for payments
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
 * Round Status - Status values for match rounds
 */
export const ROUND_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

/**
 * Filter Status - Common filter status values
 */
export const FILTER_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

/**
 * Filter Status Labels - Display labels for filter status values
 * Use these as fallback labels when i18n is not available
 */
export const FILTER_STATUS_LABEL = {
  ALL: 'All',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const;

// =============================================================================
// PLATFORM
// =============================================================================

/**
 * Platform identifiers
 */
export const PLATFORM = {
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
} as const;

// PLATFORM_OS is defined in app.ts

// =============================================================================
// THEME
// =============================================================================

/**
 * Theme Mode - Used for theme switching
 */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  DARK_BLUE: 'dark_blue',
  SYSTEM: 'system',
} as const;

/**
 * Color Shade - Standard color palette shade levels
 */
export const COLOR_SHADE = {
  50: 50,
  100: 100,
  200: 200,
  300: 300,
  400: 400,
  500: 500,
  600: 600,
  700: 700,
  800: 800,
  900: 900,
} as const;

// =============================================================================
// LANGUAGE & i18n
// =============================================================================

/**
 * i18n Language - Used for i18n configuration
 * Note: LANGUAGE for validation is exported from app.ts
 */
export const I18N_LANGUAGE = {
  ENGLISH: 'en',
  SPANISH: 'es',
} as const;

export const DEFAULT_LANGUAGE = I18N_LANGUAGE.ENGLISH;

/**
 * i18n Configuration - Settings for i18next
 */
export const I18N_CONFIG = {
  DETECTOR_TYPE: 'languageDetector',
  COMPATIBILITY_JSON: 'v4',
  ESCAPE_VALUE: false,
  USE_SUSPENSE: false,
} as const;

// Note: LOCALE moved to locale.ts

// =============================================================================
// PRESENTATION & NAVIGATION UI
// =============================================================================

/**
 * Screen Presentation - Used for navigation screen presentation options
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
 * Alert Button Style - Used for Alert.alert button options
 */
export const ALERT_BUTTON_STYLE = {
  DEFAULT: 'default',
  CANCEL: 'cancel',
  DESTRUCTIVE: 'destructive',
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

// =============================================================================
// NOTIFICATION
// =============================================================================

/**
 * Notification Channel - Types of notification delivery
 */
export const NOTIFICATION_CHANNEL = {
  WHATSAPP: 'whatsapp',
  PUSH: 'push',
  BOTH: 'both',
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
 * Digest Frequency - Email digest frequency options
 */
export const DIGEST_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  NEVER: 'never',
} as const;

/**
 * A/B Test Variants - Standard A/B test variant names
 */
export const AB_TEST_VARIANT = {
  CONTROL: 'control',
  VARIANT_A: 'variant_a',
  VARIANT_B: 'variant_b',
  VARIANT_C: 'variant_c',
} as const;

// =============================================================================
// URL TEMPLATES
// =============================================================================

/**
 * URL Templates - External service URLs
 */
export const URL_TEMPLATE = {
  WHATSAPP_APP: 'whatsapp://send?phone={{phone}}&text={{message}}',
  WHATSAPP_WEB: 'https://wa.me/{{phone}}?text={{message}}',
} as const;

// =============================================================================
// TABS
// =============================================================================

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

// =============================================================================
// FORM FIELDS & TESTING
// =============================================================================

/**
 * Hierarchy Fields - Field names for organizational hierarchy
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
 * Form Field Names - Used for error field detection
 */
export const FORM_FIELDS = {
  EMAIL: 'email',
  PASSWORD: 'Password',
} as const;

/**
 * Test IDs - Used for testing
 */
export const TEST_IDS = {
  EMAIL_INPUT: 'email-input',
  PASSWORD_INPUT: 'password-input',
  LOGIN_BUTTON: 'login-button',
  REGISTER_BUTTON: 'register-button',
  // Dynamic test ID generators
  USER_CARD: (userId: string) => `user-card-${userId}`,
  CLUB_CARD: (clubId: string) => `club-card-${clubId}`,
  MATCH_CARD: (matchId: string) => `match-card-${matchId}`,
} as const;

// =============================================================================
// MISC CONSTANTS
// =============================================================================

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
  /** Matches any character that is NOT a digit (0-9) or plus sign (+) */
  NON_PHONE_CHARS: /[^0-9+]/g,
} as const;

/**
 * Empty String - Use for initializing form fields and filters
 * Note: Typed as string to allow use in state that accepts other string values
 */
export const EMPTY_VALUE: string = '';

/**
 * Single Space - Use for spacing between JSX elements
 * Example: {SINGLE_SPACE} instead of {' '}
 */
export const SINGLE_SPACE = ' ' as const;

/**
 * Ellipsis - Used for text truncation
 */
export const ELLIPSIS = '...' as const;

/**
 * List Separator - Used for joining list items
 */
export const LIST_SEPARATOR = ', ' as const;

/**
 * All Months - Array of all month numbers (1-12)
 */
export const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/**
 * Organization Types Array - For iteration and type checking
 */
export const ORGANIZATION_TYPES = ['division', 'union', 'association', 'church'] as const;

/**
 * Display Limits - For UI display constraints
 */
export const DISPLAY_LIMITS = {
  /** Maximum items to show in preview/summary views */
  MAX_PREVIEW_ITEMS: 3,
  /** Timeout days for various operations */
  TIMEOUT_DAYS: 30,
  /** Percentage scale (100) */
  PERCENTAGE_SCALE: 100,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type AnimationType = (typeof ANIMATION_TYPE)[keyof typeof ANIMATION_TYPE];
export type A11yRole = (typeof A11Y_ROLE)[keyof typeof A11Y_ROLE];
export type KeyboardType = (typeof KEYBOARD_TYPE)[keyof typeof KEYBOARD_TYPE];
export type ReturnKeyType = (typeof RETURN_KEY)[keyof typeof RETURN_KEY];
export type AutoCapitalizeType = (typeof AUTO_CAPITALIZE)[keyof typeof AUTO_CAPITALIZE];
export type ContentFitType = (typeof CONTENT_FIT)[keyof typeof CONTENT_FIT];
export type StatusBarStyle = (typeof STATUS_BAR)[keyof typeof STATUS_BAR];
export type EntityStatus = (typeof ENTITY_STATUS)[keyof typeof ENTITY_STATUS];
export type ThemeModeValue = (typeof THEME_MODE)[keyof typeof THEME_MODE];
export type PresentationType = (typeof PRESENTATION)[keyof typeof PRESENTATION];
export type AlertButtonStyle = (typeof ALERT_BUTTON_STYLE)[keyof typeof ALERT_BUTTON_STYLE];
export type HierarchyField = (typeof HIERARCHY_FIELDS)[keyof typeof HIERARCHY_FIELDS];
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];
