/**
 * Types - Public API for domain types
 *
 * Re-exports all types from core/domain for easy access.
 * This maintains a single import location for all domain types.
 */

// Re-export enums from core/domain/value-objects
export {
  UserRole,
  ApprovalStatus,
  UserStatus,
  MatchFrequency,
  MatchStatus,
  PaymentStatus,
  ChargeType,
  FeeStatus,
  PaymentMethod,
  OrganizationType,
  PATHFINDER_CLASSES,
} from '../core/domain/value-objects';

export type { PathfinderClass } from '../core/domain/value-objects';

// ============================================================================
// INTERFACES - Domain model interfaces
// ============================================================================

import {
  UserRole,
  ApprovalStatus,
  MatchFrequency,
  MatchStatus,
  PaymentStatus,
  ChargeType,
  PathfinderClass,
} from '../core/domain/value-objects';

export interface User {
  id: string;
  email: string;
  name: string;
  whatsappNumber: string;
  role: UserRole;
  clubId: string | null;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  classes: PathfinderClass[];
  timezone: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  adminId: string;
  isActive: boolean;
  matchFrequency: MatchFrequency;
  groupSize: number;
  church: string;
  association: string;
  union: string;
  division: string;
  feeSettings?: ClubFeeSettings;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

export interface ClubFeeSettings {
  monthlyFeeAmount: number;
  currency: string;
  activeMonths: number[];
  isActive: boolean;
  lastNotificationDate?: string;
}

export interface MemberPayment {
  id: string;
  userId: string;
  clubId: string;
  year: number;
  month: number;
  amount: number;
  status: PaymentStatus;
  paidDate?: string;
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomCharge {
  id: string;
  clubId: string;
  description: string;
  amount: number;
  type: ChargeType;
  appliedToUserIds: string[];
  createdDate: string;
  dueDate: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface MemberBalance {
  userId: string;
  clubId: string;
  totalOwed: number;
  totalPaid: number;
  balance: number;
  pendingCharges: number;
  overdueCharges: number;
  lastPaymentDate?: string;
}

export interface Match {
  id: string;
  clubId: string;
  participants: string[];
  status: MatchStatus;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchRound {
  id: string;
  clubId: string;
  matches: Match[];
  scheduledDate: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    whatsappNumber: string,
    clubId: string,
    classes?: PathfinderClass[],
    isClubAdmin?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

