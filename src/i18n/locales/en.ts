/**
 * English Translations
 * Base language for the SDA Master Guide app
 */

export const en = {
  // Common
  common: {
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    confirm: 'Confirm',
    cancel: 'Cancel',
    ok: 'OK',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    submit: 'Submit',
    retry: 'Retry',
    close: 'Close',
    loading: 'Loading...',
    pleaseWait: 'Please wait...',
    noData: 'No data available',
    noResults: 'No results found',
  },

  // Authentication
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    loginFailed: 'Login Failed',
    loginSuccess: 'Login Successful',
    registrationFailed: 'Registration Failed',
    registrationSuccess: 'Registration successful',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    whatsappNumber: 'WhatsApp Number (e.g., +1 555 123 4567)',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
  },

  // Errors
  errors: {
    failedToLoadData: 'Failed to load data',
    failedToLoadClubs: 'Failed to load clubs',
    failedToLoadMembers: 'Failed to load members',
    missingFields: 'Please fill in all fields',
    missingRequiredFields: 'Please fill in all required fields',
    missingClubSelection: 'Please fill in all fields including club selection',
    missingClassSelection: 'Please select at least one Pathfinder class',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    invalidEmail: 'Please enter a valid email address',
    invalidWhatsapp: 'Please enter a valid WhatsApp number with country code (e.g., +1 555 123 4567)',
    invalidAmount: 'Please enter a valid amount',
    missingDescription: 'Please enter a description',
    missingDate: 'Please enter a due date',
    invalidDateFormat: 'Please use YYYY-MM-DD format (e.g., 2025-12-31)',
    noMembersSelected: 'Please select at least one member or choose "All Members"',
    somethingWentWrong: 'Something went wrong. Please try again.',
    networkError: 'Network error. Please check your connection.',
  },

  // Success Messages
  success: {
    changesSaved: 'Changes saved successfully',
    actionCompleted: 'Action completed successfully',
    userApproved: 'User approved successfully',
    userRejected: 'User rejected',
    userUpdated: 'User updated successfully',
    clubCreated: 'Club created successfully',
    clubUpdated: 'Club updated successfully',
    chargeCreated: 'Charge created successfully',
    paymentRecorded: 'Payment recorded successfully',
  },

  // Warnings
  warnings: {
    unsavedChanges: 'You have unsaved changes',
    confirmDelete: 'Are you sure you want to delete?',
    confirmAction: 'Are you sure you want to proceed?',
    accountInactive: 'Your account is inactive',
  },

  // Placeholders
  placeholders: {
    search: 'Search...',
    searchUsers: 'Search users...',
    searchClubs: 'Search clubs...',
    searchMembers: 'Search members...',
    selectOption: 'Select an option',
    enterAmount: 'Enter amount',
    enterClubName: 'Enter club name',
    enterClubDescription: 'Enter club description',
    enterDivision: 'Enter division',
    enterUnion: 'Enter union',
    enterAssociation: 'Enter association',
    enterChurchName: 'Enter church name',
    enterGroupSize: 'Enter group size',
  },

  // Navigation
  navigation: {
    home: 'Home',
    activities: 'Activities',
    members: 'Members',
    settings: 'Settings',
    dashboard: 'Dashboard',
    meetings: 'Meetings',
    finances: 'Finances',
    more: 'More',
  },

  // Settings
  settings: {
    title: 'Settings',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemDefault: 'System Default',
    notifications: 'Notifications',
    privacy: 'Privacy',
    about: 'About',
    version: 'Version',
    accountSettings: 'Account Settings',
    appSettings: 'App Settings',
  },

  // Club Management
  club: {
    clubs: 'Clubs',
    createClub: 'Create Club',
    editClub: 'Edit Club',
    clubName: 'Club Name',
    clubDescription: 'Description',
    members: 'Members',
    activities: 'Activities',
    fees: 'Fees',
    directive: 'Directive',
    settings: 'Club Settings',
  },

  // User Management
  users: {
    users: 'Users',
    activeUsers: 'Active Users',
    pendingUsers: 'Pending Users',
    approveUser: 'Approve User',
    rejectUser: 'Reject User',
    deleteUser: 'Delete User',
    editUser: 'Edit User',
    role: 'Role',
    status: 'Status',
  },

  // Fees
  fees: {
    fees: 'Fees',
    myFees: 'My Fees',
    clubFees: 'Club Fees',
    monthlyFee: 'Monthly Fee',
    customCharge: 'Custom Charge',
    amount: 'Amount',
    dueDate: 'Due Date',
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
  },
};

export type TranslationKeys = typeof en;

