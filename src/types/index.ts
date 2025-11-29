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

export interface User {
  id: string;
  email: string;
  name: string;
  whatsappNumber: string; // Required for all users except admin
  role: UserRole;
  clubId: string | null; // Required for all users except admin (hierarchy comes from club)
  isActive: boolean;
  isPaused: boolean;
  approvalStatus: ApprovalStatus; // Approval status for club membership
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
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
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
    clubId: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}
