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

  // Authentication
  AUTH: {
    LOGIN_ATTEMPT: 'Login attempt',
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_FAILED: 'Login failed',
    LOGOUT_INITIATED: 'Logout initiated',
    LOGOUT_SUCCESS: 'Logout successful',
    LOGOUT_ERROR: 'Logout error',
    REGISTRATION_ATTEMPT: 'Registration attempt',
    REGISTRATION_SUCCESS: 'Registration successful',
    REGISTRATION_FAILED: 'Registration failed',
    MOCK_LOGIN_SUCCESS: 'Mock login successful',
    MOCK_REGISTRATION_SUCCESS: 'Mock registration successful - pending approval',
    TOKEN_REFRESH_SUCCESS: 'Token refresh successful',
    TOKEN_REFRESH_FAILED: 'Token refresh failed',
    UNAUTHORIZED: 'Unauthorized request - clearing auth tokens',
    TOKEN_RETRIEVAL_FAILED: 'Failed to get auth token',
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
    NETWORK_CHANGED: 'Network status changed',
    BACK_ONLINE: 'Device back online, syncing queue',
    QUEUE_FULL: 'Offline queue full, removing oldest request',
    REQUEST_QUEUED: 'Request queued for offline sync',
    SYNC_STARTED: 'Starting offline queue sync',
    REQUEST_SYNCED: 'Request synced successfully',
    SYNC_FAILED: 'Failed to sync request',
    MAX_RETRIES: 'Max retries reached, removing from queue',
    SYNC_COMPLETED: 'Offline queue sync completed',
    LISTENER_ERROR: 'Error in network listener',
    QUEUE_CLEARED: 'Offline queue cleared',
    QUEUE_SAVE_FAILED: 'Failed to save offline queue',
    QUEUE_LOADED: 'Offline queue loaded',
    QUEUE_LOAD_FAILED: 'Failed to load offline queue',
  },

  // Idempotency Service
  IDEMPOTENCY: {
    STORE_FAILED: 'Failed to store idempotency key in persistent storage',
    RETRIEVE_FAILED: 'Failed to retrieve idempotency key from persistent storage',
    REMOVE_FAILED: 'Failed to remove idempotency key from persistent storage',
    CLEAR_FAILED: 'Failed to clear idempotency keys from persistent storage',
    CLEANUP_FAILED: 'Failed to cleanup expired idempotency keys',
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
} as const;

export type LogMessageCategory = keyof typeof LOG_MESSAGES;
