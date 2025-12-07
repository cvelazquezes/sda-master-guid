/**
 * Log Messages Constants
 *
 * Centralized log messages for consistent logging across the application.
 * Used with the logger utility for debugging and error tracking.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: logger.error('Error caught by boundary', error)
 * ✅ ALWAYS use: logger.error(LOG_MESSAGES.ERROR_BOUNDARY.CAUGHT, error)
 *
 * @version 1.0.0
 */

export const LOG_MESSAGES = {
  // Error Boundary
  ERROR_BOUNDARY: {
    CAUGHT: 'Error caught by boundary',
  },

  // Lazy Screen
  LAZY_SCREEN: {
    LOAD_ERROR: 'Lazy load error',
  },

  // Meeting Planner
  MEETING_PLANNER: {
    FAILED_TO_LOAD_DATA: 'Failed to load meeting planner data',
  },

  // Activities Screen
  ACTIVITIES: {
    FAILED_TO_LOAD_PARTICIPANTS: 'Failed to load participants',
  },

  // My Fees Screen
  MY_FEES: {
    FAILED_TO_LOAD_DATA: 'Failed to load fee data',
  },

  SETTINGS: {
    FAILED_TO_LOAD_DATA: 'Failed to load settings data',
  },

  // App initialization
  APP: {
    FEATURE_FLAGS_INITIALIZED: 'Feature flags initialized successfully',
    FEATURE_FLAGS_INIT_FAILED: 'Failed to initialize feature flags',
  },

  // Authentication
  AUTH: {
    LOGIN_ATTEMPT: 'Login attempt',
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_FAILED: 'Login failed',
    LOGIN_ERROR: 'Login error',
    LOGOUT_INITIATED: 'Logout initiated',
    LOGOUT_STARTED: 'Starting logout process',
    LOGOUT_STORAGE_CLEARED: 'Storage cleared',
    LOGOUT_COMPLETE: 'User state cleared - logout complete',
    LOGOUT_SUCCESS: 'Logout successful',
    LOGOUT_ERROR: 'Logout error',
    REGISTRATION_ATTEMPT: 'Registration attempt',
    REGISTRATION_SUCCESS: 'Registration successful',
    REGISTRATION_FAILED: 'Registration failed',
    REGISTRATION_ERROR: 'Registration error',
    UPDATE_USER_ERROR: 'Update user error',
    USER_LOAD_ERROR: 'Error loading user',
    MOCK_LOGIN_SUCCESS: 'Mock login successful',
    MOCK_REGISTRATION_SUCCESS: 'Mock registration successful - pending approval',
    TOKEN_REFRESH_SUCCESS: 'Token refresh successful',
    TOKEN_REFRESH_FAILED: 'Token refresh failed',
    UNAUTHORIZED: 'Unauthorized request - clearing auth tokens',
    TOKEN_RETRIEVAL_FAILED: 'Failed to get auth token',
    CHECKING_STORED_TOKEN: 'Checking for stored token',
    NO_TOKEN_FOUND: 'No token found',
    TOKEN_FOUND_VALIDATING: 'Token found, validating user',
    USER_VALIDATED: 'User validated successfully',
    USER_VALIDATION_FAILED: 'User validation failed',
    CLEARING_INVALID_TOKENS: 'Clearing invalid tokens',
    TOKENS_CLEARED: 'Tokens cleared',
    TOKEN_RETRIEVED: 'Token retrieved from storage',
    WEB_PLATFORM_WARNING: 'Web platform. Use server-side sessions with httpOnly cookies.',
  },

  // Token Storage
  TOKEN_STORAGE: {
    TOKEN_STORED: 'Token stored successfully',
    TOKEN_STORE_FAILED: 'Failed to store token',
    TOKEN_RETRIEVED: 'Token retrieved successfully',
    TOKEN_RETRIEVE_FAILED: 'Failed to retrieve token',
    TOKEN_REMOVED: 'Token removed successfully',
    TOKEN_REMOVE_FAILED: 'Failed to remove token',
    USER_ID_STORED: 'User ID stored successfully',
    USER_ID_STORE_FAILED: 'Failed to store user ID',
    USER_ID_RETRIEVED: 'User ID retrieved successfully',
    USER_ID_RETRIEVE_FAILED: 'Failed to retrieve user ID',
    USER_ID_REMOVED: 'User ID removed successfully',
    USER_ID_REMOVE_FAILED: 'Failed to remove user ID',
    REFRESH_TOKEN_STORED: 'Refresh token stored successfully',
    REFRESH_TOKEN_STORE_FAILED: 'Failed to store refresh token',
    REFRESH_TOKEN_RETRIEVED: 'Refresh token retrieved successfully',
    REFRESH_TOKEN_RETRIEVE_FAILED: 'Failed to retrieve refresh token',
    REFRESH_TOKEN_REMOVED: 'Refresh token removed successfully',
    REFRESH_TOKEN_REMOVE_FAILED: 'Failed to remove refresh token',
    ALL_DATA_CLEARED: 'All auth data cleared successfully',
    CLEAR_ALL_FAILED: 'Failed to clear all auth data',
  },

  // API Repository
  API_REPOSITORY: {
    LOGIN_ERROR: 'API login error:',
    REGISTRATION_ERROR: 'API registration error:',
    LOGOUT_ERROR: 'API logout error:',
    FETCH_USER_FAILED: 'Failed to fetch current user:',
    UPDATE_USER_ERROR: 'API update user error:',
    REFRESH_TOKEN_ERROR: 'API refresh token error:',
  },

  // Service Layer
  SERVICE: {
    INITIALIZED: 'AuthService initialized',
    LOGOUT_STARTED: 'Starting logout process',
    LOGOUT_COMPLETED: 'Logout completed successfully',
    LOGOUT_ERROR: 'Logout error:',
    NO_TOKEN: 'No token found - user not authenticated',
    USER_NOT_FOUND: 'User not found - token may be invalid',
    GET_USER_ERROR: 'Error getting current user:',
    UPDATE_USER_ERROR: 'Error updating user:',
    REFRESHING_SESSION: 'Refreshing session',
    SESSION_REFRESHED: 'Session refreshed successfully',
    SESSION_REFRESH_FAILED: 'Session refresh failed:',
  },

  // User Service
  USER: {
    FETCHING_ALL: 'Fetching all users',
    FETCHED_ALL: 'Users fetched',
    FETCH_FAILED: 'Failed to fetch users',
    FETCHING_ONE: 'Fetching user',
    FETCHED_ONE: 'User fetched',
    FETCH_ONE_FAILED: 'Failed to fetch user',
    NOT_FOUND: 'User not found',
    UPDATING: 'Updating user',
    UPDATED: 'User updated',
    UPDATE_FAILED: 'Failed to update user',
    NOT_FOUND_UPDATE: 'User not found for update',
    DELETING: 'Deleting user',
    DELETED: 'User deleted',
    DELETE_FAILED: 'Failed to delete user',
    NOT_FOUND_DELETE: 'User not found for deletion',
    UPDATING_ROLE: 'Updating user role',
    DEACTIVATING: 'Deactivating user',
    ACTIVATING: 'Activating user',
    APPROVING: 'Approving user',
    REJECTING: 'Rejecting user',
    UPDATING_STATUS: 'Updating user active status',
    FETCHING_BY_CLUB: 'Fetching users by club',
    FETCHED_BY_CLUB: 'Users fetched for club',
    FETCH_BY_CLUB_FAILED: 'Failed to fetch users for club',
    // Mock prefixed
    MOCK_GETTING_ALL: 'Mock: Getting all users',
    MOCK_FETCHED: 'Mock: User fetched',
    MOCK_NOT_FOUND: 'Mock: User not found',
    MOCK_UPDATED: 'Mock: User updated',
    MOCK_NOT_FOUND_UPDATE: 'Mock: User not found for update',
    MOCK_DELETED: 'Mock: User deleted',
    MOCK_NOT_FOUND_DELETE: 'Mock: User not found for deletion',
    MOCK_FETCHED_BY_CLUB: 'Mock: Users fetched for club',
  },

  // Club Service
  CLUB: {
    FETCHING_ALL: 'Fetching all clubs',
    FETCHED_ALL: 'Clubs fetched',
    FETCH_FAILED: 'Failed to fetch clubs',
    FETCHING_ONE: 'Fetching club',
    FETCHED_ONE: 'Club fetched',
    FETCH_ONE_FAILED: 'Failed to fetch club',
    NOT_FOUND: 'Club not found',
    CREATING: 'Creating club',
    CREATED: 'Club created',
    CREATE_FAILED: 'Failed to create club',
    UPDATING: 'Updating club',
    UPDATED: 'Club updated',
    UPDATE_FAILED: 'Failed to update club',
    NOT_FOUND_UPDATE: 'Club not found for update',
    DELETING: 'Deleting club',
    DELETED: 'Club deleted',
    DELETE_FAILED: 'Failed to delete club',
    NOT_FOUND_DELETE: 'Club not found for deletion',
    JOINING: 'Joining club',
    JOINED: 'Joined club',
    JOIN_FAILED: 'Failed to join club',
    LEAVING: 'Leaving club',
    LEFT: 'Left club',
    LEAVE_FAILED: 'Failed to leave club',
    FETCHING_MEMBERS: 'Fetching club members',
    FETCHED_MEMBERS: 'Club members fetched',
    FETCH_MEMBERS_FAILED: 'Failed to fetch club members',
    // Mock prefixed
    MOCK_GETTING_ALL: 'Mock: Getting all clubs',
    MOCK_FETCHED: 'Mock: Club fetched',
    MOCK_NOT_FOUND: 'Mock: Club not found',
    MOCK_CREATED: 'Mock: Club created',
    MOCK_UPDATED: 'Mock: Club updated',
    MOCK_NOT_FOUND_UPDATE: 'Mock: Club not found for update',
    MOCK_DELETED: 'Mock: Club deleted',
    MOCK_NOT_FOUND_DELETE: 'Mock: Club not found for deletion',
    MOCK_JOINED: 'Mock: Joined club',
    MOCK_LEFT: 'Mock: Left club',
    MOCK_FETCHED_MEMBERS: 'Mock: Club members fetched',
  },

  // Match Service
  MATCH: {
    FETCHING: 'Fetching matches',
    FETCHED: 'Matches fetched',
    FETCH_FAILED: 'Failed to fetch matches',
    FETCHING_MY: 'Fetching my matches',
    FETCHED_MY: 'My matches fetched',
    FETCH_MY_FAILED: 'Failed to fetch my matches',
    FETCHING_ONE: 'Fetching match',
    FETCHED_ONE: 'Match fetched',
    FETCH_ONE_FAILED: 'Failed to fetch match',
    NOT_FOUND: 'Match not found',
    UPDATING_STATUS: 'Updating match status',
    STATUS_UPDATED: 'Match status updated',
    STATUS_UPDATE_FAILED: 'Failed to update match status',
    NOT_FOUND_STATUS: 'Match not found for status update',
    SCHEDULING: 'Scheduling match',
    SCHEDULED: 'Match scheduled',
    SCHEDULE_FAILED: 'Failed to schedule match',
    NOT_FOUND_SCHEDULE: 'Match not found for scheduling',
    SKIPPING: 'Skipping match',
    GENERATING: 'Generating matches',
    GENERATED: 'Matches generated',
    GENERATE_FAILED: 'Failed to generate matches',
    NOT_FOUND_GENERATE: 'Club not found for match generation',
    NOT_ENOUGH_MEMBERS: 'Not enough members for match generation',
    FETCHING_ROUNDS: 'Fetching match rounds',
    FETCHED_ROUNDS: 'Match rounds fetched',
    FETCH_ROUNDS_FAILED: 'Failed to fetch match rounds',
    FETCHING_CLUB_MATCHES: 'Fetching club matches',
    FETCHED_CLUB_MATCHES: 'Club matches fetched',
    FETCH_CLUB_MATCHES_FAILED: 'Failed to fetch club matches',
    // Mock prefixed
    MOCK_FETCHED: 'Mock: Matches fetched',
    MOCK_FETCHED_MY: 'Mock: My matches fetched',
    MOCK_NO_USER: 'Mock: No user ID found',
    MOCK_FETCHED_ONE: 'Mock: Match fetched',
    MOCK_NOT_FOUND: 'Mock: Match not found',
    MOCK_STATUS_UPDATED: 'Mock: Match status updated',
    MOCK_NOT_FOUND_STATUS: 'Mock: Match not found for status update',
    MOCK_SCHEDULED: 'Mock: Match scheduled',
    MOCK_NOT_FOUND_SCHEDULE: 'Mock: Match not found for scheduling',
    MOCK_GENERATED: 'Mock: Matches generated',
    MOCK_NOT_FOUND_GENERATE: 'Mock: Club not found for match generation',
    MOCK_NOT_ENOUGH_MEMBERS: 'Mock: Not enough members for match generation',
    MOCK_FETCHED_ROUNDS: 'Mock: Match rounds fetched',
    MOCK_FETCHED_CLUB: 'Mock: Club matches fetched',
  },

  // Payment Service
  PAYMENT: {
    FETCHING_CHARGES: 'Fetching all charges',
    FETCHED_CHARGES: 'All charges fetched',
    FETCH_CHARGES_FAILED: 'Failed to fetch all charges',
    FETCHING_BY_CLUB: 'Fetching charges by club',
    FETCHED_BY_CLUB: 'Charges fetched for club',
    FETCH_BY_CLUB_FAILED: 'Failed to fetch charges for club',
    FETCHING_BY_USER: 'Fetching charges by user',
    FETCHED_BY_USER: 'Charges fetched for user',
    FETCH_BY_USER_FAILED: 'Failed to fetch charges for user',
    CREATING: 'Creating charge',
    CREATED: 'Charge created',
    CREATE_FAILED: 'Failed to create charge',
    RECORDING_PAYMENT: 'Recording payment',
    PAYMENT_RECORDED: 'Payment recorded',
    RECORD_FAILED: 'Failed to record payment',
    DELETING: 'Deleting charge',
    DELETED: 'Charge deleted',
    DELETE_FAILED: 'Failed to delete charge',
    // Monthly Fees
    GENERATING_FEES: 'Generating monthly fees',
    FEES_GENERATED: 'Monthly fees generated',
    GENERATE_FEES_FAILED: 'Failed to generate monthly fees',
    FETCHING_CLUB_PAYMENTS: 'Fetching club payments',
    CLUB_PAYMENTS_FETCHED: 'Club payments fetched',
    FETCH_CLUB_PAYMENTS_FAILED: 'Failed to fetch club payments',
    FETCHING_MEMBER_PAYMENTS: 'Fetching member payments',
    MEMBER_PAYMENTS_FETCHED: 'Member payments fetched',
    FETCH_MEMBER_PAYMENTS_FAILED: 'Failed to fetch member payments',
    UPDATING_STATUS: 'Updating payment status',
    STATUS_UPDATED: 'Payment status updated',
    STATUS_UPDATE_FAILED: 'Failed to update payment status',
    // Custom Charges
    CREATING_CUSTOM_CHARGE: 'Creating custom charge',
    CUSTOM_CHARGE_CREATED: 'Custom charge created',
    CREATE_CUSTOM_CHARGE_FAILED: 'Failed to create custom charge',
    FETCHING_CUSTOM_CHARGES: 'Fetching club custom charges',
    CUSTOM_CHARGES_FETCHED: 'Club custom charges fetched',
    FETCH_CUSTOM_CHARGES_FAILED: 'Failed to fetch club custom charges',
    DELETING_CUSTOM_CHARGE: 'Deleting custom charge',
    CUSTOM_CHARGE_DELETED: 'Custom charge deleted',
    DELETE_CUSTOM_CHARGE_FAILED: 'Failed to delete custom charge',
    // Balance
    FETCHING_BALANCE: 'Fetching member balance',
    BALANCE_FETCHED: 'Member balance fetched',
    FETCH_BALANCE_FAILED: 'Failed to fetch member balance',
    // Storage errors
    ERROR_LOADING_PAYMENTS: 'Error loading payments',
    ERROR_SAVING_PAYMENTS: 'Error saving payments',
    ERROR_LOADING_CHARGES: 'Error loading custom charges',
    ERROR_SAVING_CHARGES: 'Error saving custom charges',
    ERROR_CLEARING_DATA: 'Error clearing payment data',
    // Mock prefixed
    MOCK_FETCHED_CHARGES: 'Mock: All charges fetched',
    MOCK_FETCHED_BY_CLUB: 'Mock: Charges fetched for club',
    MOCK_FETCHED_BY_USER: 'Mock: Charges fetched for user',
    MOCK_CREATED: 'Mock: Charge created',
    MOCK_PAYMENT_RECORDED: 'Mock: Payment recorded',
    MOCK_DELETED: 'Mock: Charge deleted',
    MOCK_CHARGE_NOT_FOUND: 'Mock: Charge not found',
    MOCK_GENERATING_FEES: 'Mock: Generating fees for eligible members',
    MOCK_FEES_GENERATED: 'Mock: Monthly fees generated',
    MOCK_CLUB_PAYMENTS_FETCHED: 'Mock: Club payments fetched',
    MOCK_MEMBER_PAYMENTS_FETCHED: 'Mock: Member payments fetched',
    MOCK_STATUS_UPDATED: 'Mock: Payment status updated',
    MOCK_PAYMENT_NOT_FOUND: 'Mock: Payment not found',
    MOCK_CUSTOM_CHARGE_CREATED: 'Mock: Custom charge created',
    MOCK_CUSTOM_CHARGES_FETCHED: 'Mock: Club custom charges fetched',
    MOCK_CUSTOM_CHARGE_DELETED: 'Mock: Custom charge deleted',
    MOCK_CUSTOM_CHARGE_NOT_FOUND: 'Mock: Custom charge not found',
    MOCK_BALANCE_FETCHED: 'Mock: Member balance fetched',
  },

  // Notification Service
  NOTIFICATION: {
    FETCHING: 'Fetching notifications',
    FETCHED: 'Notifications fetched',
    FETCH_FAILED: 'Failed to fetch notifications',
    FETCHING_UNREAD: 'Fetching unread count',
    FETCHED_UNREAD: 'Unread count fetched',
    FETCH_UNREAD_FAILED: 'Failed to fetch unread count',
    MARKING_READ: 'Marking notification as read',
    MARKED_READ: 'Notification marked as read',
    MARK_READ_FAILED: 'Failed to mark notification as read',
    MARKING_ALL_READ: 'Marking all notifications as read',
    MARKED_ALL_READ: 'All notifications marked as read',
    MARK_ALL_READ_FAILED: 'Failed to mark all notifications as read',
    // WhatsApp
    SENDING_WHATSAPP: 'Sending WhatsApp notification',
    WHATSAPP_SENT: 'WhatsApp notification sent via backend',
    WHATSAPP_FAILED: 'Failed to send WhatsApp notification',
    NO_WHATSAPP_NUMBER: 'User has no WhatsApp number',
    // Push
    SENDING_PUSH: 'Sending push notification',
    PUSH_SENT: 'Push notification sent via backend',
    PUSH_FAILED: 'Failed to send push notification',
    // Bulk
    SENDING_BULK: 'Sending bulk notifications',
    BULK_SENT: 'Bulk notifications sent via backend',
    BULK_FAILED: 'Failed to send bulk notifications',
    // Scheduling
    SCHEDULING: 'Scheduling notification',
    SCHEDULED: 'Notification scheduled via backend',
    SCHEDULE_FAILED: 'Failed to schedule notification',
    CANCELLING: 'Cancelling scheduled notification',
    CANCELLED: 'Scheduled notification cancelled via backend',
    CANCEL_FAILED: 'Failed to cancel scheduled notification',
    // Mock prefixed
    MOCK_FETCHED: 'Mock: Notifications fetched',
    MOCK_UNREAD_COUNT: 'Mock: Unread count',
    MOCK_MARKED_READ: 'Mock: Notification marked as read',
    MOCK_NOT_FOUND: 'Mock: Notification not found',
    MOCK_MARKED_ALL_READ: 'Mock: All notifications marked as read',
    MOCK_WHATSAPP_OPENED: 'Mock: WhatsApp notification opened',
    MOCK_WEB_WHATSAPP_OPENED: 'Mock: Web WhatsApp notification opened',
    MOCK_WHATSAPP_ERROR: 'Mock: Error sending WhatsApp notification',
    MOCK_PUSH_SIMULATED: 'Mock: Push notification (simulated)',
    MOCK_PUSH_SENT: 'Mock: Push notification sent (simulated)',
    MOCK_BULK_SENT: 'Mock: Bulk notifications sent',
    MOCK_SCHEDULED: 'Mock: Notification scheduled',
    MOCK_CANCELLED: 'Mock: Scheduled notification cancelled',
  },

  // Offline Service
  OFFLINE: {
    INITIALIZED: 'Offline service initialized',
    NETWORK_STATUS_CHANGED: 'Network status changed',
    NETWORK_CHANGED: 'Network status changed',
    BACK_ONLINE: 'Device back online, syncing queue',
    QUEUE_FULL: 'Offline queue full, removing oldest request',
    REQUEST_QUEUED: 'Request queued for offline sync',
    REQUEST_QUEUED_FOR_SYNC: 'Device is offline, request queued for sync',
    SYNC_STARTED: 'Starting offline queue sync',
    REQUEST_SYNCED: 'Request synced successfully',
    SYNC_FAILED: 'Failed to sync request',
    MAX_RETRIES: 'Max retries reached, removing from queue',
    SYNC_COMPLETED: 'Offline queue sync completed',
    LISTENER_ERROR: 'Error in network listener',
    QUEUE_CLEARED: 'Offline queue cleared',
    SAVE_FAILED: 'Failed to save offline queue',
    QUEUE_SAVE_FAILED: 'Failed to save offline queue',
    QUEUE_LOADED: 'Offline queue loaded',
    LOAD_FAILED: 'Failed to load offline queue',
    QUEUE_LOAD_FAILED: 'Failed to load offline queue',
  },

  // Rate Limit Service
  RATE_LIMIT: {
    WAITING: (ms: number) => `Rate limit: waiting ${ms}ms for tokens`,
    NOT_FOUND: (name: string) => `Rate limiter not found: ${name}`,
    NOT_FOUND_ERROR: (name: string) => `Rate limiter ${name} not found and no options provided`,
    EXCEEDED: (name: string) => `Rate limit exceeded for ${name}`,
  },

  // Idempotency Service
  IDEMPOTENCY: {
    STORE_FAILED: 'Failed to store idempotency key in persistent storage',
    RETRIEVE_FAILED: 'Failed to retrieve idempotency key from persistent storage',
    REMOVE_FAILED: 'Failed to remove idempotency key from persistent storage',
    CLEAR_FAILED: 'Failed to clear idempotency keys from persistent storage',
    CLEANUP_FAILED: 'Failed to cleanup expired idempotency keys',
    CACHED_RESULT: (key: string) => `Idempotency: Returning cached result for key: ${key}`,
    EXECUTING: (key: string) => `Idempotency: Executing operation for key: ${key}`,
    OPERATION_FAILED: (key: string) => `Idempotency: Operation failed for key: ${key}`,
    EVICTED: (count: number) => `Idempotency: Evicted ${count} oldest entries`,
    CLEANED_UP: (count: number) => `Idempotency: Cleaned up ${count} expired entries`,
  },

  // Health Check Service
  HEALTH: {
    CHECKS_REGISTERED: 'Default health checks registered',
  },

  // React Query
  QUERY: {
    ERROR: 'Query error',
    SUCCESS: 'Query success',
    MUTATION_ERROR: 'Mutation error',
    MUTATION_SUCCESS: 'Mutation success',
  },

  // API
  API: {
    INTERCEPTOR_ERROR: 'Request interceptor error',
  },

  // Components
  COMPONENTS: {
    USER_DETAIL_MODAL: {
      FAILED_TO_LOAD_CLUB: 'Failed to load club',
    },
  },

  // Contexts
  CONTEXTS: {
    THEME: {
      LOAD_ERROR: 'Error loading theme',
      SAVE_ERROR: 'Error saving theme',
      USE_OUTSIDE_PROVIDER: 'useTheme must be used within a ThemeProvider',
    },
    AUTH: {
      USE_OUTSIDE_PROVIDER: 'useAuth must be used within an AuthProvider',
      FAILED_TO_SAVE_AUTH_DATA: 'Failed to save authentication data',
    },
  },

  // Security
  SECURITY: {
    CSRF: {
      FAILED_TO_STORE_TOKEN: 'Failed to store CSRF token',
      TOKEN_GENERATED: 'CSRF token generated',
      TOKEN_VALIDATED: 'CSRF token validated',
      TOKEN_EXPIRED: 'CSRF token expired',
      TOKEN_STORED: 'CSRF token stored',
      STORE_FAILED: 'Failed to store CSRF token',
      RETRIEVE_FAILED: 'Failed to get CSRF token',
      TOKEN_REFRESHING: 'Refreshing CSRF token',
      NO_TOKEN: 'No CSRF token stored',
      TOKEN_CLEARED: 'CSRF token cleared',
      CLEAR_FAILED: 'Failed to clear CSRF token',
      LOAD_FAILED: 'Failed to load CSRF token',
      COOKIE_SET: 'CSRF cookie would be set',
      MISSING_TOKEN: 'Missing CSRF token in request',
    },
  },

  // Pagination
  PAGINATION: {
    INVALID_CURSOR_DATA: 'Invalid cursor data',
    INVALID_CURSOR_STRUCTURE: 'Invalid cursor structure',
    INVALID_CURSOR: 'Invalid cursor',
    CURSOR_DIRECTION_MISMATCH: 'Cursor direction mismatch',
    FETCH_FAILED: 'Pagination failed',
    ENCODE_FAILED: 'Failed to encode cursor',
    DECODE_FAILED: 'Failed to decode cursor',
  },

  // Sentry
  SENTRY: {
    INITIALIZED: 'Sentry initialized successfully',
    INIT_FAILED: 'Failed to initialize Sentry',
    DISABLED: 'Sentry is disabled or DSN not configured',
    ALREADY_INITIALIZED: 'Sentry already initialized',
    NOT_INITIALIZED: 'Sentry not initialized, logging error locally',
    MESSAGE: (message: string) => `Sentry message: ${message}`,
    SECURITY_EVENT: (event: string) => `Security event: ${event}`,
    SECURITY_EVENT_CAPTURED: (event: string) => `Security Event: ${event}`,
  },

  // Validation
  VALIDATION: {
    IDEMPOTENCY_KEY_REQUIRED: 'Idempotency key must be a non-empty string',
    LIMIT_EXCEEDED: (max: number) => `Limit cannot exceed ${max}`,
    LIMIT_AT_LEAST: 'Limit must be at least 1',
    INVALID_CURSOR: 'Invalid cursor',
    ORDER_INVALID: 'Order must be "asc" or "desc"',
  },

  // API Client
  API_CLIENT: {
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
    AUTH_TOKEN_FAILED: 'Failed to get auth token',
    REQUEST_INTERCEPTOR_ERROR: 'Request interceptor error',
    UNAUTHORIZED: 'Unauthorized request - clearing auth tokens',
  },

  // Retry Policy
  RETRY: {
    ATTEMPT: (attempt: number, delay: number) => `Retry attempt ${attempt} after ${delay}ms`,
    MAX_RETRIES_REACHED: 'Max retries reached',
    NON_RETRIABLE_ERROR: 'Non-retriable error encountered',
  },

  // Request Batcher
  REQUEST_BATCHER: {
    BATCH_FAILED: 'Batch request failed',
    EXECUTING_BATCH: (count: number) => `Executing batch of ${count} requests`,
    BATCH_SIZE_MISMATCH: (results: number, keys: number) =>
      `Batch function returned ${results} results for ${keys} keys`,
    REQUEST_DEDUPLICATED: (key: string) => `Request deduplicated: ${key}`,
  },

  // Health Check
  HEALTH_CHECK: {
    REGISTERED: (name: string) => `Registered health check: ${name}`,
    ALREADY_REGISTERED: (name: string) => `Health check ${name} already registered, overwriting`,
    UNREGISTERED: (name: string) => `Unregistered health check: ${name}`,
    CHECK_STARTED: 'Health check started',
    CHECK_COMPLETED: 'Health check completed',
    CHECK_FAILED: (name: string) => `Health check failed: ${name}`,
    TIMEOUT: 'Health check timeout',
  },

  // Feature Flags
  FEATURE_FLAGS: {
    INITIALIZED: 'Feature flags initialized',
    INIT_FAILED: 'Failed to initialize feature flags',
    FLAG_EVALUATED: 'Feature flag evaluated',
    FLAG_NOT_FOUND: 'Feature flag not found',
    SAVE_FAILED: 'Failed to save feature flags',
    LOAD_FAILED: 'Failed to load feature flags from storage',
    CLEARED: 'Feature flags cleared',
    USER_CONTEXT_UPDATED: 'User context updated',
    LOADED: 'Feature flags loaded from storage',
    FLAG_EXPIRED: (key: string) => `Feature flag expired: ${key}`,
    FLAG_SET: (key: string) => `Feature flag set: ${key}`,
    FLAGS_UPDATED: (count: number) => `Updated ${count} feature flags`,
    FLAG_REMOVED: (key: string) => `Feature flag removed: ${key}`,
  },

  // Request Batcher
  REQUEST_BATCHER: {
    BATCH_STARTED: 'Batch request started',
    BATCH_COMPLETED: 'Batch request completed',
    BATCH_FAILED: 'Batch request failed',
    REQUEST_QUEUED: 'Request queued for batching',
  },

  // Secure Storage
  SECURE_STORAGE: {
    ITEM_STORED: 'Item stored successfully',
    ITEM_STORE_FAILED: 'Failed to store item',
    ITEM_RETRIEVED: 'Item retrieved successfully',
    ITEM_RETRIEVE_FAILED: 'Failed to retrieve item',
    ITEM_REMOVED: 'Item removed successfully',
    ITEM_REMOVE_FAILED: 'Failed to remove item',
    STORAGE_CLEARED: 'Storage cleared successfully',
    STORAGE_CLEAR_FAILED: 'Failed to clear storage',
    AUTH_CLEARED: 'Auth data cleared',
  },

  // Performance
  PERFORMANCE: {
    METRIC_RECORDED: 'Performance metric recorded',
    SLOW_OPERATION: 'Slow operation detected',
    MEMORY_WARNING: 'Memory usage warning',
    BUDGET_EXCEEDED_TTI: 'Performance budget exceeded: TTI',
    BUDGET_EXCEEDED_MOUNT: 'Performance budget exceeded: Mount Time',
    BUDGET_EXCEEDED_RENDER: 'Performance budget exceeded: Render Time',
    BUDGET_EXCEEDED: 'Performance budget exceeded',
    MEASUREMENT_RECORDED: 'Performance measurement',
    MEASUREMENT_FAILED: 'Performance measurement failed',
    LOW_FPS: 'Low FPS detected',
    HIGH_MEMORY: 'High memory usage detected',
    COMPONENT_RERENDERED: 'Component re-rendered',
    EXCESSIVE_RERENDERS: 'Excessive re-renders detected',
    NETWORK_BUDGET_EXCEEDED: 'Network request exceeded budget',
    NETWORK_REQUEST_FAILED: 'Network request failed',
  },

  // Mock Operations
  MOCK: {
    LOGIN: 'Mock login',
    LOGOUT: 'Mock logout',
    REGISTRATION: 'Mock registration',
    TOKEN_REFRESHED: 'Mock token refreshed',
    USER_UPDATED: 'Mock user updated',
    GETTING_ALL_USERS: 'Mock: Getting all users',
  },

  // Formatted Log Messages (use with logger.info(LOG_MESSAGES.FORMATTED.USER_LOGIN(email)))
  FORMATTED: {
    // Auth
    LOGIN_ATTEMPT: (email: string) => `Login attempt for: ${email}`,
    LOGIN_SUCCESS: (email: string) => `User ${email} logged in successfully`,
    LOGIN_FAILED: (email: string) => `Login failed for ${email}:`,
    REGISTRATION_ATTEMPT: (email: string) => `Registration attempt for: ${email}`,
    REGISTRATION_SUCCESS: (email: string) => `User ${email} registered successfully`,
    REGISTRATION_FAILED: (email: string) => `Registration failed for ${email}:`,
    USER_FETCHED: (email: string) => `Fetched current user: ${email}`,
    USER_UPDATED_SUCCESS: (userId: string) => `User ${userId} updated successfully`,
    CHECKING_STORED_TOKEN: (email: string) => `Checking stored auth for: ${email}`,
    SESSION_RESTORED: (userId: string) => `Session restored for user: ${userId}`,
    AUTH_DATA_SAVING: (userId: string) => `Saving auth data for user: ${userId}`,
    AUTH_DATA_SAVED: (userId: string) => `Auth data saved for: ${userId}`,

    // Mock operations
    MOCK_LOGIN: (email: string) => `Mock login: ${email}`,
    MOCK_REGISTRATION: (email: string) => `Mock registration: ${email}`,
    MOCK_USER_UPDATED: (userId: string) => `Mock user ${userId} updated`,
    MOCK_TOKEN_GENERATED: (userId: string) => `Mock token generated for user: ${userId}`,

    // HTTP requests
    HTTP_GET: (url: string) => `GET ${url}`,
    HTTP_POST: (url: string) => `POST ${url}`,
    HTTP_PUT: (url: string) => `PUT ${url}`,
    HTTP_PATCH: (url: string) => `PATCH ${url}`,
    HTTP_DELETE: (url: string) => `DELETE ${url}`,

    // Circuit breaker
    CIRCUIT_OPENED: (name: string) => `Circuit breaker '${name}' opened`,
    CIRCUIT_HALF_OPEN: (name: string) => `Circuit breaker '${name}' half-open`,
    CIRCUIT_CLOSED: (name: string) => `Circuit breaker '${name}' closed`,

    // Retry policy
    RETRY_ATTEMPT: (attempt: number, maxRetries: number) =>
      `Retry attempt ${attempt}/${maxRetries}`,
    RETRY_FAILED: (url: string) => `All retries failed for ${url}`,

    // Query client
    QUERY_ERROR: (key: string) => `Query error for ${key}:`,
    QUERY_SUCCESS: (key: string) => `Query success for ${key}`,
    MUTATION_ERROR: (key: string) => `Mutation error for ${key}:`,
    MUTATION_SUCCESS: (key: string) => `Mutation success for ${key}`,

    // Feature flags
    FLAG_EVALUATED: (flag: string, value: boolean) => `Feature flag '${flag}' evaluated: ${value}`,
    FLAG_OVERRIDE: (flag: string, value: boolean) => `Feature flag '${flag}' override: ${value}`,

    // Health check
    HEALTH_CHECK_FAILED: (name: string) => `Health check '${name}' failed`,
    HEALTH_CHECK_PASSED: (name: string) => `Health check '${name}' passed`,
    HEALTH_CHECK_REGISTERED: (name: string) => `Health check '${name}' registered`,

    // Idempotency
    IDEMPOTENCY_KEY_STORED: (key: string) => `Idempotency key stored: ${key}`,
    IDEMPOTENCY_KEY_FOUND: (key: string) => `Idempotency key found: ${key}`,
    IDEMPOTENCY_KEY_EXPIRED: (key: string) => `Idempotency key expired: ${key}`,

    // Rate limit
    RATE_LIMIT_KEY: (key: string) => `Rate limit check for key: ${key}`,
    RATE_LIMIT_REMAINING: (key: string, remaining: number) =>
      `Rate limit for ${key}: ${remaining} remaining`,

    // Request batcher
    BATCH_STARTED: (count: number) => `Batch request started with ${count} items`,
    BATCH_COMPLETED: (count: number) => `Batch request completed: ${count} items`,
    REQUEST_BATCHED: (url: string) => `Request batched: ${url}`,

    // Sentry
    SENTRY_CAPTURE: (eventId: string) => `Sentry captured event: ${eventId}`,
    SENTRY_BREADCRUMB: (category: string) => `Sentry breadcrumb: ${category}`,

    // Secure storage
    STORAGE_SET: (key: string) => `Stored value for key: ${key}`,
    STORAGE_GET: (key: string) => `Retrieved value for key: ${key}`,
    STORAGE_REMOVE: (key: string) => `Removed value for key: ${key}`,
    STORAGE_SET_FAILED: (key: string) => `Failed to store value for key: ${key}`,
    STORAGE_GET_FAILED: (key: string) => `Failed to retrieve value for key: ${key}`,
    STORAGE_REMOVE_FAILED: (key: string) => `Failed to remove value for key: ${key}`,

    // Component performance
    COMPONENT_RENDERED: (name: string) => `Component '${name}' rendered`,
    SLOW_RENDER: (name: string, ms: number) => `Slow render in ${name}: ${ms}ms`,
    LIST_RENDERED: (count: number) => `List rendered with ${count} items`,

    // Service initialization
    SERVICE_CREATED: (name: string, type: string) => `${name} created with ${type} repository`,
  },

  // i18n
  I18N: {
    DETECT_ERROR: 'Error detecting language',
    SAVE_ERROR: 'Error saving language',
    CHANGE_ERROR: 'Error changing language',
  },

  // Screens
  SCREENS: {
    ADMIN_DASHBOARD: {
      FAILED_TO_LOAD_STATS: 'Failed to load stats',
    },
    CLUB_ADMIN_DASHBOARD: {
      FAILED_TO_LOAD_DATA: 'Failed to load dashboard data',
    },
    CLUB_DIRECTIVE: {
      FAILED_TO_LOAD_DATA: 'Failed to load directive data',
    },
    CLUB_FEES: {
      NOTIFICATION_TO_MEMBER: 'Notification to member',
    },
    CLUB_MATCHES: {
      FAILED_TO_LOAD_PARTICIPANTS: 'Failed to load participants',
    },
  },

  // List Components
  LIST: {
    VIEWABLE_ITEMS: 'Viewable items changed',
    END_REACHED: 'List end reached',
    REFRESH_STARTED: 'List refresh started',
  },
} as const;

export type LogMessageCategory = keyof typeof LOG_MESSAGES;
