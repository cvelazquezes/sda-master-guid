/**
 * Domain Configuration
 *
 * Business rules, limits, thresholds, and domain-specific constants.
 * This is the SINGLE SOURCE OF TRUTH for all business logic values.
 *
 * ❌ NEVER write: if (members > 100) { ... }
 * ✅ ALWAYS use: if (members > domainConfig.club.maxMembers) { ... }
 */

// ============================================================================
// USER DOMAIN
// ============================================================================

export const userRules = {
  /** User roles in the system */
  roles: {
    ADMIN: 'admin',
    CLUB_ADMIN: 'club_admin',
    USER: 'user',
  } as const,

  /** User status values */
  status: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended',
  } as const,

  /** Age constraints */
  age: {
    min: 0,
    max: 150,
    minForRegistration: 5,
    adultAge: 18,
  },

  /** Name constraints */
  name: {
    minLength: 2,
    maxLength: 100,
  },

  /** Profile constraints */
  profile: {
    bioMaxLength: 500,
    maxProfilePhotoSize: 5 * 1024 * 1024, // 5MB
  },
} as const;

// ============================================================================
// CLUB DOMAIN
// ============================================================================

export const clubRules = {
  /** Club status values */
  status: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PAUSED: 'paused',
    PENDING: 'pending',
  } as const,

  /** Member limits */
  members: {
    min: 2,
    max: 100,
    defaultMaxPerClub: 50,
  },

  /** Club name constraints */
  name: {
    minLength: 3,
    maxLength: 100,
  },

  /** Club description constraints */
  description: {
    minLength: 10,
    maxLength: 500,
  },

  /** Club fees */
  fees: {
    defaultMonthlyFee: 20.0,
    minFee: 0,
    maxFee: 1000,
    currency: 'USD',
  },
} as const;

// ============================================================================
// MATCH DOMAIN
// ============================================================================

export const matchRules = {
  /** Match status values */
  status: {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    POSTPONED: 'postponed',
  } as const,

  /** Participant limits */
  participants: {
    min: 2,
    max: 10,
    defaultMax: 4,
  },

  /** Duration constraints (in hours) */
  duration: {
    min: 0.5,
    max: 8,
    default: 2,
  },

  /** Scheduling constraints */
  scheduling: {
    maxDaysInAdvance: 90,
    minHoursBeforeStart: 1,
    cancellationDeadlineHours: 24,
  },
} as const;

// ============================================================================
// PAYMENT DOMAIN
// ============================================================================

export const paymentRules = {
  /** Payment status values */
  status: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled',
  } as const,

  /** Payment methods */
  methods: {
    CASH: 'cash',
    CARD: 'card',
    TRANSFER: 'transfer',
    DIGITAL_WALLET: 'digital_wallet',
  } as const,

  /** Amount constraints */
  amounts: {
    minAmount: 0.01,
    maxAmount: 999999.99,
    maxOutstandingBalance: 1000.0,
  },

  /** Grace period for late payments (days) */
  gracePeriod: {
    lateFee: 7,
    suspension: 30,
    termination: 90,
  },

  /** Currency settings */
  currency: {
    default: 'USD',
    supported: ['USD', 'EUR', 'GBP'] as const,
    decimalPlaces: 2,
  },
} as const;

// ============================================================================
// PATHFINDER CLASSES DOMAIN
// ============================================================================

export const pathfinderRules = {
  /** Class status values */
  status: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    SKIPPED: 'skipped',
    IN_PROGRESS: 'in_progress',
  } as const,

  /** Class levels */
  levels: {
    FRIEND: 'friend',
    COMPANION: 'companion',
    EXPLORER: 'explorer',
    RANGER: 'ranger',
    VOYAGER: 'voyager',
    GUIDE: 'guide',
    MASTER_GUIDE: 'master_guide',
  } as const,

  /** Requirements */
  requirements: {
    minClassesForPromotion: 1,
    maxActiveClasses: 3,
  },
} as const;

// ============================================================================
// ORGANIZATION HIERARCHY DOMAIN
// ============================================================================

export const organizationRules = {
  /** Hierarchy levels */
  levels: {
    DIVISION: 'division',
    UNION: 'union',
    ASSOCIATION: 'association',
    CHURCH: 'church',
    CLUB: 'club',
  } as const,

  /** Hierarchy order (top to bottom) */
  hierarchyOrder: ['division', 'union', 'association', 'church', 'club'] as const,

  /** Name constraints */
  name: {
    minLength: 2,
    maxLength: 150,
  },
} as const;

// ============================================================================
// NOTIFICATION DOMAIN
// ============================================================================

export const notificationRules = {
  /** Notification types */
  types: {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    SUCCESS: 'success',
    REMINDER: 'reminder',
  } as const,

  /** Priority levels */
  priority: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
  } as const,

  /** Retention settings */
  retention: {
    maxUnreadCount: 99,
    retentionDays: 30,
    maxNotificationsStored: 500,
  },
} as const;

// ============================================================================
// APPROVAL WORKFLOW DOMAIN
// ============================================================================

export const approvalRules = {
  /** Approval status values */
  status: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    EXPIRED: 'expired',
  } as const,

  /** Timeouts */
  timeouts: {
    /** Days before approval request expires */
    expirationDays: 7,
    /** Reminder after this many days */
    reminderDays: 3,
  },

  /** Auto-approval rules */
  autoApproval: {
    enabled: false,
    afterDays: 0,
  },
} as const;

// ============================================================================
// ATTENDANCE DOMAIN
// ============================================================================

export const attendanceRules = {
  /** Attendance status values */
  status: {
    PRESENT: 'present',
    ABSENT: 'absent',
    EXCUSED: 'excused',
    LATE: 'late',
  } as const,

  /** Thresholds */
  thresholds: {
    /** Minutes late before marked as "late" */
    lateAfterMinutes: 15,
    /** Percentage for "good attendance" badge */
    goodAttendancePercentage: 80,
    /** Minimum attendance for promotion */
    minAttendanceForPromotion: 75,
  },
} as const;

// ============================================================================
// SEARCH DOMAIN
// ============================================================================

export const searchRules = {
  /** Query constraints */
  query: {
    minLength: 2,
    maxLength: 100,
  },

  /** Result limits */
  results: {
    defaultLimit: 20,
    maxLimit: 100,
    suggestionLimit: 5,
  },
} as const;

// ============================================================================
// COMBINED DOMAIN CONFIG EXPORT
// ============================================================================

export const domainConfig = {
  user: userRules,
  club: clubRules,
  match: matchRules,
  payment: paymentRules,
  pathfinder: pathfinderRules,
  organization: organizationRules,
  notification: notificationRules,
  approval: approvalRules,
  attendance: attendanceRules,
  search: searchRules,
} as const;

export type DomainConfig = typeof domainConfig;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type UserRole = (typeof userRules.roles)[keyof typeof userRules.roles];
export type UserStatus = (typeof userRules.status)[keyof typeof userRules.status];
export type ClubStatus = (typeof clubRules.status)[keyof typeof clubRules.status];
export type MatchStatus = (typeof matchRules.status)[keyof typeof matchRules.status];
export type PaymentStatus = (typeof paymentRules.status)[keyof typeof paymentRules.status];
export type PaymentMethod = (typeof paymentRules.methods)[keyof typeof paymentRules.methods];
export type PathfinderLevel = (typeof pathfinderRules.levels)[keyof typeof pathfinderRules.levels];
export type OrganizationLevel =
  (typeof organizationRules.levels)[keyof typeof organizationRules.levels];
export type NotificationType =
  (typeof notificationRules.types)[keyof typeof notificationRules.types];
export type ApprovalStatus = (typeof approvalRules.status)[keyof typeof approvalRules.status];
export type AttendanceStatus = (typeof attendanceRules.status)[keyof typeof attendanceRules.status];
