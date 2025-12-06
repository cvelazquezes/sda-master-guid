/**
 * User-Facing Messages & Strings
 * Centralized messages for alerts, errors, and user feedback
 * Ready for internationalization (i18n) implementation
 */

export const MESSAGES = {
  // Error Messages
  ERRORS: {
    // Authentication
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    AUTHENTICATION_REQUIRED: 'Authentication required',

    // Form Validation
    MISSING_FIELDS: 'Please fill in all fields',
    MISSING_REQUIRED_FIELDS: 'Please fill in all required fields',
    MISSING_CLUB_SELECTION: 'Please fill in all fields including club selection',
    MISSING_CLASS_SELECTION: 'Please select at least one Pathfinder class',
    MINIMUM_ONE_CLASS_REQUIRED: 'At least one class must be selected',
    MAXIMUM_CLASSES_REACHED: 'You can select up to 3 classes',
    PLEASE_SELECT_ONE_CLASS: 'Please select at least one class',
    NO_MONTHS_SELECTED: 'Please select at least one month',
    PASSWORD_MISMATCH: 'Passwords do not match',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    PASSWORD_TOO_SHORT_8: 'Password must be at least 8 characters long',
    PASSWORD_REQUIREMENTS:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    PASSWORD_MUST_DIFFER: 'New password must be different from current password',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_EMAIL_ADDRESS: 'Invalid email address',
    INVALID_WHATSAPP:
      'Please enter a valid WhatsApp number with country code (e.g., +1 555 123 4567)',
    NAME_TOO_SHORT: 'Name must be at least 2 characters long',
    NAME_TOO_LONG: 'Name must not exceed 100 characters',
    CLUB_ID_REQUIRED: 'Club ID is required',
    INVALID_TIMEZONE: 'Invalid timezone format',
    INVALID_LANGUAGE_CODE: 'Language code must be 2 characters',
    AT_LEAST_ONE_FIELD: 'At least one field must be provided for update',
    CURRENT_PASSWORD_REQUIRED: 'Current password is required',

    // Charges & Payments
    INVALID_AMOUNT: 'Please enter a valid amount',
    MISSING_DESCRIPTION: 'Please enter a description',
    MISSING_DATE: 'Please enter a due date',
    INVALID_DATE_FORMAT: 'Please use YYYY-MM-DD format (e.g., 2025-12-31)',
    NO_MEMBERS_SELECTED: 'Please select at least one member or choose "All Members"',
    FAILED_TO_CREATE_CHARGE: 'Failed to create charge. Please try again.',

    // Data Loading
    FAILED_TO_LOAD_CLUBS: 'Failed to load clubs',
    FAILED_TO_LOAD_DATA: 'Failed to load data',
    FAILED_TO_LOAD_MEMBERS: 'Failed to load members',
    FAILED_TO_CREATE_CLUB: 'Failed to create club',
    FAILED_TO_UPDATE_CLUB_STATUS: 'Failed to update club status',
    FAILED_TO_DELETE_CLUB: 'Failed to delete club',
    FAILED_TO_LOAD_CLUB_INFO: 'Failed to load club information',
    FAILED_TO_LOAD_CLUB_SETTINGS: 'Failed to load club settings',
    FAILED_TO_UPDATE_CLUB_SETTINGS: 'Failed to update club settings',
    FAILED_TO_LOAD_DIRECTIVE: 'Failed to load club directive data',
    FAILED_TO_SEND_NOTIFICATION: 'Failed to send notification',
    FAILED_TO_UPDATE_MATCH_STATUS: 'Failed to update match status',
    FAILED_TO_LOAD_MEETING_DATA: 'Failed to load meeting planner data',
    PLEASE_ENTER_TITLE: 'Please enter a title',

    // Member Management
    FAILED_TO_UPDATE_MEMBER_STATUS: 'Failed to update member status',
    FAILED_TO_DELETE_MEMBER: 'Failed to delete member',
    FAILED_TO_APPROVE_MEMBER: 'Failed to approve member',
    FAILED_TO_REJECT_MEMBER: 'Failed to reject member',
    FAILED_TO_UPDATE_CLASSES: 'Failed to update classes',

    // User Management (Admin)
    FAILED_TO_UPDATE_USER_STATUS: 'Failed to update user status',
    FAILED_TO_DELETE_USER: 'Failed to delete user',
    FAILED_TO_APPROVE_USER: 'Failed to approve user',
    FAILED_TO_REJECT_USER: 'Failed to reject user',

    // Organization Management
    PLEASE_ENTER_NAME: 'Please enter a name',
    PLEASE_SELECT_PARENT_DIVISION: 'Please select a parent Division',
    PLEASE_SELECT_PARENT_UNION: 'Please select a parent Union',
    PLEASE_SELECT_PARENT_ASSOCIATION: 'Please select a parent Association',
    OPERATION_FAILED: 'Operation failed',
    FETCH_FAILED: 'Failed to fetch data',

    // Activities
    FAILED_TO_LOAD_ACTIVITIES: 'Failed to load activities',
    FAILED_TO_SKIP_ACTIVITY: 'Failed to skip activity',
    COULD_NOT_OPEN_WHATSAPP: 'Could not open WhatsApp',

    // Settings
    FAILED_TO_UPDATE_SETTINGS: 'Failed to update settings',
    FAILED_TO_LOGOUT: 'Failed to logout. Please try again.',

    // Generic
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
  },

  // Success Messages
  SUCCESS: {
    // Registration & Authentication
    REGISTRATION_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',

    // Charges & Payments
    CHARGE_CREATED: 'Charge created successfully',
    PAYMENT_RECORDED: 'Payment recorded successfully',

    // User Management
    USER_APPROVED: 'User approved successfully',
    USER_REJECTED: 'User rejected',
    USER_UPDATED: 'User updated successfully',
    MEMBER_STATUS_UPDATED: 'Member status updated successfully',
    MEMBER_DELETED: 'Member deleted successfully',
    CLASSES_UPDATED: 'Classes updated successfully',

    // Club Management
    CLUB_CREATED: 'Club created successfully',
    CLUB_UPDATED: 'Club updated successfully',
    CLUB_DELETED: 'Club deleted successfully',
    MATCH_STATUS_UPDATED: 'Match status updated',
    ACTIVITIES_GENERATED: 'Social activities generated successfully!',
    MEMBER_ASSIGNED: 'Member assigned to position successfully',
    MEMBER_REMOVED: 'Member removed from position',
    DIRECTIVE_SAVED: 'Directive has been saved successfully',
    MEETING_SAVED: 'Meeting plan has been saved successfully',
    MEETING_SHARED: 'Meeting plan has been shared with all members',
    RESET_TO_DEFAULT: 'Meeting plan has been reset to default template',
    NEW_MEETING_CREATED: 'New meeting plan created',

    // Organization Management
    ORGANIZATION_CREATED: 'Organization created successfully',
    ORGANIZATION_DELETED: 'Organization deleted successfully',

    // Settings
    ACCOUNT_PAUSED: 'Account paused. You will no longer receive notifications.',
    ACCOUNT_ACTIVATED: 'Account activated. You will receive notifications again.',
    LOGOUT_SUCCESS_MESSAGE: 'You have been logged out successfully',

    // Generic
    CHANGES_SAVED: 'Changes saved successfully',
    ACTION_COMPLETED: 'Action completed successfully',
  },

  // Warning Messages
  WARNINGS: {
    UNSAVED_CHANGES: 'You have unsaved changes',
    CONFIRM_DELETE: 'Are you sure you want to delete?',
    CONFIRM_ACTION: 'Are you sure you want to proceed?',
    ACCOUNT_INACTIVE: 'Your account is inactive',
    CANNOT_BE_UNDONE: 'This action cannot be undone.',
    CONFIRM_LOGOUT: 'Are you sure you want to logout?',
    CONFIRM_SKIP: 'Skip this activity? This cannot be undone.',
    CONFIRM_DELETE_ACTIVITY: 'Are you sure you want to delete this activity?',
    CONFIRM_RESET_MEETING:
      'Are you sure you want to reset to the default template? All current changes will be lost.',
    CONFIRM_NEW_MEETING: 'Create a new meeting plan? Current unsaved changes will be lost.',
    CONFIRM_REMOVE_MEMBER: 'Are you sure you want to remove this member from the position?',
    CONFIRM_GENERATE_MATCHES:
      'This will generate new social activity matches for all club members. Continue?',
    NOTIFY_PARTICIPANTS_MESSAGE:
      'Send WhatsApp notifications to all participants about this match?',
    MEMBER_ALREADY_IN_POSITION:
      'This member is already assigned to a position. Please remove them first before assigning to a new position.',
    PLEASE_ASSIGN_ALL_ACTIVITIES: 'Please assign all activities to members before saving.',
  },

  // Info Messages
  INFO: {
    LOADING: 'Loading...',
    LOADING_CLUBS: 'Loading clubs...',
    LOADING_DATA: 'Loading data...',
    PROCESSING: 'Processing...',
    PLEASE_WAIT: 'Please wait...',
    NO_DATA: 'No data available',
    NO_RESULTS: 'No results found',
    NO_WHATSAPP_PROVIDED: 'This member has not provided a WhatsApp number',
  },

  // Titles
  TITLES: {
    ERROR: 'Error',
    SUCCESS: 'Success',
    WARNING: 'Warning',
    CONFIRM: 'Confirm',
    INFO: 'Information',
    LOGIN_FAILED: 'Login Failed',
    REGISTRATION_FAILED: 'Registration Failed',
    INVALID_AMOUNT: 'Invalid Amount',
    INVALID_DATE: 'Invalid Date',
    MISSING_DESCRIPTION: 'Missing Description',
    MISSING_DATE: 'Missing Date',
    NO_MEMBERS_SELECTED: 'No Members Selected',
    NO_WHATSAPP: 'No WhatsApp',
    MINIMUM_REQUIRED: 'Minimum Required',
    MAXIMUM_REACHED: 'Maximum Reached',
    REQUIRED: 'Required',
    NO_MONTHS_SELECTED_TITLE: 'No Months Selected',
    DELETE_MEMBER: 'Delete Member',
    APPROVE_MEMBER: 'Approve Member',
    REJECT_MEMBER: 'Reject Member',
    DELETE_CLUB: 'Delete Club',
    DELETE_USER: 'Delete User',
    APPROVE_USER: 'Approve User',
    REJECT_USER: 'Reject User',
    SKIP_ACTIVITY: 'Skip Activity',
    LOGOUT: 'Logout',
    ACCOUNT_STATUS: 'Account Status',
    MEMBER_ALREADY_ASSIGNED: 'Member Already Assigned',
    MEMBER_ASSIGNED_TO_POSITION: 'Member Assigned',
    REMOVE_MEMBER: 'Remove Member',
    NO_ASSIGNMENTS: 'No Assignments',
    DIRECTIVE_SAVED_TITLE: 'Directive Saved',
    DELETE_ACTIVITY: 'Delete Activity',
    MISSING_ASSIGNMENTS: 'Missing Assignments',
    MEETING_SAVED_TITLE: 'Meeting Saved',
    MEETING_SHARED_TITLE: 'Meeting Shared',
    RESET_TO_DEFAULT_TITLE: 'Reset to Default',
    CREATE_NEW_MEETING: 'Create New Meeting',
    NOTIFY_PARTICIPANTS: 'Notify Participants',
    GENERATE_ACTIVITIES: 'Generate Social Activities',
  },

  // Button Labels
  BUTTONS: {
    OK: 'OK',
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
    SAVE: 'Save',
    DELETE: 'Delete',
    EDIT: 'Edit',
    ADD: 'Add',
    SUBMIT: 'Submit',
    RETRY: 'Retry',
    CLOSE: 'Close',
    APPROVE: 'Approve',
    REJECT: 'Reject',
    SKIP: 'Skip',
    YES: 'Yes',
    NO: 'No',
  },

  // Placeholders
  PLACEHOLDERS: {
    // Auth
    EMAIL: 'Enter your email',
    PASSWORD: 'Enter your password',
    FULL_NAME: 'Full Name',
    WHATSAPP: 'WhatsApp Number (e.g., +1 555 123 4567)',
    CONFIRM_PASSWORD: 'Confirm Password',

    // Search
    SEARCH: 'Search...',
    SEARCH_USERS: 'Search users...',
    SEARCH_CLUBS: 'Search clubs...',
    SEARCH_MEMBERS: 'Search members...',

    // Forms
    SELECT_OPTION: 'Select an option',
    ENTER_AMOUNT: 'Enter amount',
    ENTER_DESCRIPTION: 'Enter description',
    CLUB_NAME: 'Club Name',
    CLUB_DESCRIPTION: 'Description',
    ENTER_CLUB_NAME: 'Enter club name',
    ENTER_CLUB_DESCRIPTION: 'Enter club description',
    ENTER_DIVISION: 'Enter division',
    ENTER_UNION: 'Enter union',
    ENTER_ASSOCIATION: 'Enter association',
    ENTER_CHURCH_NAME: 'Enter church name',
    ENTER_GROUP_SIZE: 'Enter group size',
  },
} as const;

// Type-safe message keys
export type MessageCategory = keyof typeof MESSAGES;
export type ErrorMessageKey = keyof typeof MESSAGES.ERRORS;
export type SuccessMessageKey = keyof typeof MESSAGES.SUCCESS;

// Helper function to get message
export function getMessage(category: MessageCategory, key: string): string {
  return (MESSAGES[category] as Record<string, string>)[key] || key;
}

// Helper functions for dynamic messages
export const dynamicMessages = {
  confirmDeleteMember: (memberName: string) => `Are you sure you want to delete ${memberName}?`,
  confirmApproveMember: (memberName: string) => `Approve ${memberName} to join the club?`,
  confirmRejectMember: (memberName: string) =>
    `Reject ${memberName}'s application? This cannot be undone.`,
  memberApproved: (memberName: string) => `${memberName} has been approved!`,
  memberRejected: (memberName: string) => `${memberName}'s application has been rejected`,
  confirmDeleteClub: (clubName: string) => `Are you sure you want to delete ${clubName}?`,
  confirmDeleteUser: (userName: string) => `Are you sure you want to delete ${userName}?`,
  confirmApproveUser: (userName: string, roleLabel: string) =>
    `Approve ${userName} as ${roleLabel}?`,
  confirmRejectUser: (userName: string) =>
    `Reject ${userName}'s application? This cannot be undone.`,
  userApproved: (userName: string) => `${userName} has been approved!`,
  userRejected: (userName: string) => `${userName}'s application has been rejected`,
  organizationDeleted: (typeName: string) => `${typeName} deleted successfully`,
  confirmDeleteOrganization: (typeName: string, orgName: string) =>
    `Delete ${orgName}? This cannot be undone.`,
} as const;
