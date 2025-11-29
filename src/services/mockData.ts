import {
  User,
  Club,
  Match,
  MatchRound,
  UserRole,
  MatchFrequency,
  MatchStatus,
  ApprovalStatus,
} from '../types';

// Mock Users - One of each type
// Note: Users get their organizational hierarchy from their club
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@sda.com',
    name: 'Admin User',
    whatsappNumber: '', // Admin doesn't need WhatsApp
    role: UserRole.ADMIN,
    clubId: null, // Admin doesn't need a club
    isActive: true,
    isPaused: false,
    approvalStatus: ApprovalStatus.APPROVED, // Admin is auto-approved
    timezone: 'America/New_York',
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'clubadmin@sda.com',
    name: 'Club Admin',
    whatsappNumber: '+1 (555) 123-4567',
    role: UserRole.CLUB_ADMIN,
    clubId: '1', // Member of Club 1 (hierarchy from club)
    isActive: true,
    isPaused: false,
    approvalStatus: ApprovalStatus.APPROVED, // Club admin is auto-approved
    timezone: 'America/New_York',
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'user@sda.com',
    name: 'John Doe',
    whatsappNumber: '+1 (555) 234-5678',
    role: UserRole.USER,
    clubId: '1', // Member of Club 1 (hierarchy from club)
    isActive: true,
    isPaused: false,
    approvalStatus: ApprovalStatus.APPROVED, // Approved member
    timezone: 'America/New_York',
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'pending1@sda.com',
    name: 'Sarah Johnson',
    whatsappNumber: '+1 (555) 345-6789',
    role: UserRole.USER,
    clubId: '1', // Member of Club 1 (hierarchy from club)
    isActive: false,
    isPaused: false,
    approvalStatus: ApprovalStatus.PENDING, // Pending approval
    timezone: 'America/New_York',
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'pending2@sda.com',
    name: 'Michael Brown',
    whatsappNumber: '+1 (555) 456-7890',
    role: UserRole.USER,
    clubId: '1', // Member of Club 1 (hierarchy from club)
    isActive: false,
    isPaused: false,
    approvalStatus: ApprovalStatus.PENDING, // Pending approval
    timezone: 'America/New_York',
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    email: 'pending3@sda.com',
    name: 'Emily Davis',
    whatsappNumber: '+1 (555) 567-8901',
    role: UserRole.USER,
    clubId: '4', // Member of Narvarte church club (Elphis Kalein)
    isActive: false,
    isPaused: false,
    approvalStatus: ApprovalStatus.PENDING, // Pending approval
    timezone: 'America/Mexico_City',
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    email: 'carlos.martinez@sda.com',
    name: 'Carlos Martínez',
    whatsappNumber: '+52 55 1234 5678',
    role: UserRole.USER,
    clubId: '4', // Member of Narvarte church club (Elphis Kalein)
    isActive: true,
    isPaused: false,
    approvalStatus: ApprovalStatus.APPROVED, // Approved member
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    email: 'maria.lopez@sda.com',
    name: 'María López',
    whatsappNumber: '+52 55 2345 6789',
    role: UserRole.USER,
    clubId: '5', // Member of Portales church club (Panteras)
    isActive: true,
    isPaused: false,
    approvalStatus: ApprovalStatus.APPROVED, // Approved member
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Clubs
export const mockClubs: Club[] = [
  {
    id: '1',
    name: 'SDA Master Guid - Main',
    description: 'Main coffee chat club for SDA members',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: 2,
    church: 'First SDA Church',
    association: 'Greater New York Conference',
    union: 'Atlantic Union Conference',
    division: 'North American Division',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 2, // Only approved members (John Doe + Club Admin)
  },
  {
    id: '2',
    name: 'SDA Master Guid - Secondary',
    description: 'Secondary club for additional members',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.BIWEEKLY,
    groupSize: 3,
    church: 'Central SDA Church',
    association: 'Southern California Conference',
    union: 'Pacific Union Conference',
    division: 'North American Division',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 0,
  },
  {
    id: '3',
    name: 'SDA Master Guid - Monthly',
    description: 'Monthly coffee chat club',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.MONTHLY,
    groupSize: 2,
    church: 'Mountain View SDA Church',
    association: 'Potomac Conference',
    union: 'Columbia Union Conference',
    division: 'North American Division',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 0,
  },
  {
    id: '4',
    name: 'Elphis Kalein',
    description: 'Club de café y compañerismo para miembros de Narvarte',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: 2,
    church: 'Iglesia Adventista de Narvarte',
    association: 'Asociación Metropolitana Mexicana',
    union: 'Unión Mexicana Central',
    division: 'División Interamericana',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 1, // Only approved members (Carlos Martínez)
  },
  {
    id: '5',
    name: 'Panteras',
    description: 'Club de café y compañerismo para miembros de Portales',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.BIWEEKLY,
    groupSize: 2,
    church: 'Iglesia Adventista de Portales',
    association: 'Asociación Metropolitana Mexicana',
    union: 'Unión Mexicana Central',
    division: 'División Interamericana',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 1,
  },
];

// Mock Matches
export const mockMatches: Match[] = [
  {
    id: '1',
    clubId: '1',
    participants: ['3', '4'],
    status: MatchStatus.PENDING,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    clubId: '1',
    participants: ['3'],
    status: MatchStatus.SCHEDULED,
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    clubId: '1',
    participants: ['4'],
    status: MatchStatus.COMPLETED,
    scheduledDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Match Rounds
export const mockMatchRounds: MatchRound[] = [
  {
    id: '1',
    clubId: '1',
    matches: [mockMatches[0], mockMatches[1]],
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper function to get user by email
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((user) => user.email === email);
};

// Helper function to get users by club
export const getUsersByClub = (clubId: string): User[] => {
  return mockUsers.filter((user) => user.clubId === clubId);
};

// Helper function to get matches for user
export const getMatchesForUser = (userId: string): Match[] => {
  return mockMatches.filter((match) => match.participants.includes(userId));
};

// Helper function to get matches by club
export const getMatchesByClub = (clubId: string): Match[] => {
  return mockMatches.filter((match) => match.clubId === clubId);
};

// Helper function to get match rounds by club
export const getMatchRoundsByClub = (clubId: string): MatchRound[] => {
  return mockMatchRounds.filter((round) => round.clubId === clubId);
};

// Initialize mock data - ensures data is ready
export const initializeMockData = () => {
  // Update club member counts (only count approved members)
  mockClubs.forEach((club) => {
    club.memberCount = getUsersByClub(club.id).filter(
      (u) => u.approvalStatus === ApprovalStatus.APPROVED
    ).length;
  });

  // Ensure all data is properly initialized
  return {
    users: mockUsers,
    clubs: mockClubs,
    matches: mockMatches,
    matchRounds: mockMatchRounds,
  };
};

// Pre-initialize data on module load
initializeMockData();
