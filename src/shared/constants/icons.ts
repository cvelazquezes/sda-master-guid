/**
 * Icon Constants - Single Source of Truth for all MaterialCommunityIcons names
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL ICON NAME STRING VALUES
 * ============================================================================
 *
 * All icon name values should be referenced from here.
 * This ensures type safety, consistency, and easier refactoring.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: name="school", name="close"
 * ✅ ALWAYS use: name={ICONS.SCHOOL}, name={ICONS.CLOSE}
 *
 * @version 1.0.0
 */

/**
 * MaterialCommunityIcons Names
 * Organized by category for easier discovery
 */
export const ICONS = {
  // Navigation & Actions
  CHEVRON_DOWN: 'chevron-down',
  CHEVRON_UP: 'chevron-up',
  CHEVRON_RIGHT: 'chevron-right',
  CHEVRON_LEFT: 'chevron-left',
  CLOSE: 'close',
  CLOSE_CIRCLE: 'close-circle',
  CHECK: 'check',
  CHECK_CIRCLE: 'check-circle',
  PAUSE_CIRCLE: 'pause-circle',
  PLAY_CIRCLE: 'play-circle',
  CHECKBOX_MARKED: 'checkbox-marked',
  CHECKBOX_BLANK_OUTLINE: 'checkbox-blank-outline',
  RADIOBOX_MARKED: 'radiobox-marked',
  RADIOBOX_BLANK: 'radiobox-blank',
  PLUS: 'plus',
  PLUS_CIRCLE: 'plus-circle',
  PENCIL: 'pencil',
  DELETE: 'delete',
  REFRESH: 'refresh',
  SEND: 'send',
  SHARE_VARIANT: 'share-variant',

  // User & Account
  ACCOUNT: 'account',
  ACCOUNT_ALERT: 'account-alert',
  ACCOUNT_CHECK: 'account-check',
  ACCOUNT_CIRCLE: 'account-circle',
  ACCOUNT_CIRCLE_OUTLINE: 'account-circle-outline',
  ACCOUNT_CLOCK: 'account-clock',
  ACCOUNT_COG: 'account-cog',
  ACCOUNT_COG_OUTLINE: 'account-cog-outline',
  ACCOUNT_GROUP: 'account-group',
  ACCOUNT_GROUP_OUTLINE: 'account-group-outline',
  ACCOUNT_HEART: 'account-heart',
  ACCOUNT_HEART_OUTLINE: 'account-heart-outline',
  ACCOUNT_STAR: 'account-star',
  ACCOUNT_TIE: 'account-tie',
  ACCOUNT_SUPERVISOR: 'account-supervisor',
  ACCOUNT_MULTIPLE: 'account-multiple',
  ACCOUNT_MULTIPLE_CHECK: 'account-multiple-check',
  ACCOUNT_OFF: 'account-off',
  ACCOUNT_OFF_OUTLINE: 'account-off-outline',
  ACCOUNT_PLUS: 'account-plus',
  CLIPBOARD_TEXT: 'clipboard-text',
  CALENDAR_STAR: 'calendar-star',

  // Communication
  BELL: 'bell',
  BELL_BADGE: 'bell-badge',
  BELL_OFF_OUTLINE: 'bell-off-outline',
  BELL_OUTLINE: 'bell-outline',
  BELL_RING: 'bell-ring',
  BELL_RING_OUTLINE: 'bell-ring-outline',
  WHATSAPP: 'whatsapp',
  TRANSLATE: 'translate',

  // Content & Documents
  CONTENT_SAVE: 'content-save',
  FILE_DOCUMENT: 'file-document',
  FILE_DOCUMENT_OUTLINE: 'file-document-outline',
  FORMAT_LIST_NUMBERED: 'format-list-numbered',

  // Calendar & Time
  CALENDAR: 'calendar',
  CALENDAR_ACCOUNT: 'calendar-account',
  CALENDAR_BLANK: 'calendar-blank',
  CALENDAR_CLOCK: 'calendar-clock',
  CALENDAR_MONTH: 'calendar-month',
  CALENDAR_OUTLINE: 'calendar-outline',
  CALENDAR_PLUS: 'calendar-plus',
  CALENDAR_RANGE: 'calendar-range',
  CALENDAR_WEEK: 'calendar-week',
  CLOCK: 'clock',
  CLOCK_ALERT_OUTLINE: 'clock-alert-outline',
  CLOCK_OUTLINE: 'clock-outline',
  CLOCK_CHECK_OUTLINE: 'clock-check-outline',
  ACCOUNT_SEARCH: 'account-search',

  // Finance & Wallet
  CASH: 'cash',
  CASH_MULTIPLE: 'cash-multiple',
  WALLET: 'wallet',
  WALLET_OUTLINE: 'wallet-outline',

  // Settings & System
  COG: 'cog',
  COG_OUTLINE: 'cog-outline',
  LOADING: 'loading',

  // Info & Status
  ALERT: 'alert',
  ALERT_CIRCLE: 'alert-circle',
  ALERT_CIRCLE_OUTLINE: 'alert-circle-outline',
  CHECK_CIRCLE_OUTLINE: 'check-circle-outline',
  CIRCLE: 'circle',
  INFORMATION: 'information',
  INFORMATION_OUTLINE: 'information-outline',

  // Location & Domain
  DOMAIN: 'domain',
  EARTH: 'earth',
  OFFICE_BUILDING: 'office-building',
  SITEMAP: 'sitemap',

  // Education & Church
  CHURCH: 'church',
  SCHOOL: 'school',
  SCHOOL_OUTLINE: 'school-outline',

  // Theme & Appearance
  BRIGHTNESS_6: 'brightness-6',
  WEATHER_SUNNY: 'weather-sunny',
  WEATHER_NIGHT: 'weather-night',
  THEME_LIGHT_DARK: 'theme-light-dark',

  // Security & Shield
  SHIELD_ACCOUNT: 'shield-account',
  SHIELD_CHECK_OUTLINE: 'shield-check-outline',
  SHIELD_CROWN: 'shield-crown',

  // Misc
  CANCEL: 'cancel',
  CALENDAR_CHECK: 'calendar-check',
  CHART_BAR: 'chart-bar',
  CHART_DONUT: 'chart-donut',
  CHART_LINE: 'chart-line',
  CLIPBOARD: 'clipboard',
  CLIPBOARD_OUTLINE: 'clipboard-outline',
  DELETE_OUTLINE: 'delete-outline',
  DOTS_HORIZONTAL: 'dots-horizontal',
  DOTS_VERTICAL: 'dots-vertical',
  DOWNLOAD: 'download',
  EMAIL: 'email',
  EMAIL_OUTLINE: 'email-outline',
  EYE: 'eye',
  EYE_OFF: 'eye-off',
  FILTER: 'filter',
  FILTER_OFF: 'filter-off',
  FILTER_VARIANT: 'filter-variant',
  FREQUENTLY_ASKED_QUESTIONS: 'frequently-asked-questions',
  HEART: 'heart',
  HEART_OUTLINE: 'heart-outline',
  HELP: 'help',
  HELP_CIRCLE: 'help-circle',
  HELP_CIRCLE_OUTLINE: 'help-circle-outline',
  HISTORY: 'history',
  HOME: 'home',
  HOME_OUTLINE: 'home-outline',
  IMAGE: 'image',
  IMAGE_OUTLINE: 'image-outline',
  INBOX: 'inbox',
  INBOX_OUTLINE: 'inbox-outline',
  LABEL: 'label',
  LIFEBUOY: 'lifebuoy',
  LINK: 'link',
  LINK_VARIANT: 'link-variant',
  LOCK: 'lock',
  LOCK_CHECK: 'lock-check',
  LOCK_OUTLINE: 'lock-outline',
  LOGIN: 'login',
  LOGOUT: 'logout',
  MAGNIFY: 'magnify',
  MAP_MARKER: 'map-marker',
  MAP_MARKER_OUTLINE: 'map-marker-outline',
  MENU: 'menu',
  MESSAGE: 'message',
  MESSAGE_TEXT: 'message-text',
  MESSAGE_TEXT_OUTLINE: 'message-text-outline',
  MESSAGE_REPLY_TEXT: 'message-reply-text',
  PALETTE_OUTLINE: 'palette-outline',
  PHONE: 'phone',
  PHONE_OUTLINE: 'phone-outline',
  CAMERA: 'camera',
  CAMERA_OUTLINE: 'camera-outline',
  REDO: 'redo',
  SETTINGS: 'settings',
  SORT: 'sort',
  STAR: 'star',
  STAR_OUTLINE: 'star-outline',
  SYNC: 'sync',
  TEXT: 'text',
  UNDO: 'undo',
  UPLOAD: 'upload',
  VIEW_LIST: 'view-list',
  VIEW_DASHBOARD_OUTLINE: 'view-dashboard-outline',
  RECEIPT: 'receipt',
} as const;

// Type export
export type IconName = (typeof ICONS)[keyof typeof ICONS];
