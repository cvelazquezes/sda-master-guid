export enum UserRole {
  ADMIN = 'admin',
  CLUB_ADMIN = 'club_admin',
  USER = 'user',
}

export enum MatchFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
}

export enum MatchStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
  EXEMPT = 'exempt',
}

export enum ChargeType {
  MONTHLY_FEE = 'monthly_fee',
  CUSTOM = 'custom',
}

// Available Pathfinder classes
export const PATHFINDER_CLASSES = [
  'Friend',
  'Companion',
  'Explorer',
  'Ranger',
  'Voyager',
  'Guide',
] as const;

export type PathfinderClass = (typeof PATHFINDER_CLASSES)[number];

export interface User {
  id: string;
  email: string;
  name: string;
  whatsappNumber: string; // Required for all users except admin
  role: UserRole;
  clubId: string | null; // Required for all users except admin (hierarchy comes from club)
  isActive: boolean; // Activity status: true = active, false = inactive
  approvalStatus: ApprovalStatus; // Registration/approval status for club membership (independent from activity status)
  classes: PathfinderClass[]; // Pathfinder classes (min 1, max 3)
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
  groupSize: number; // 2 or 3
  // SDA organizational hierarchy
  church: string;
  association: string;
  union: string;
  division: string;
  // Payment settings
  feeSettings?: ClubFeeSettings;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

export interface ClubFeeSettings {
  monthlyFeeAmount: number;
  currency: string; // e.g., 'MXN', 'USD'
  activeMonths: number[]; // Array of months (1-12) when fee applies
  isActive: boolean;
  lastNotificationDate?: string;
}

export interface MemberPayment {
  id: string;
  userId: string;
  clubId: string;
  year: number;
  month: number; // 1-12
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
  appliedToUserIds: string[]; // Empty array means all members
  createdDate: string;
  dueDate: string;
  isActive: boolean;
  createdBy: string; // Club admin user ID
  createdAt: string;
}

export interface MemberBalance {
  userId: string;
  clubId: string;
  totalOwed: number;
  totalPaid: number;
  balance: number; // negative = owes, positive = credit
  pendingCharges: number;
  overdueCharges: number;
  lastPaymentDate?: string;
}

export interface Match {
  id: string;
  clubId: string;
  participants: string[]; // User IDs
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
