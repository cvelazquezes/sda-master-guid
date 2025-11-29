import { User, Club, Match, MatchRound, UserRole, MatchFrequency, MatchStatus } from '../types';

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
    timezone: 'America/New_York',
    language: 'en',
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
    memberCount: 2,
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
    memberCount: 1,
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
  // Update club member counts
  mockClubs.forEach((club) => {
    club.memberCount = getUsersByClub(club.id).length;
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
