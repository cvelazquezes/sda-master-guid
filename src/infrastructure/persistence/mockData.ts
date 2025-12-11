import { EMPTY_VALUE } from '../../shared/constants';
import {
  UserRole,
  MatchFrequency,
  MatchStatus,
  ApprovalStatus,
  type Club,
  type Match,
  type MatchRound,
  type User,
} from '../../types';

// Mock Users - One of each type
// Note: Users get their organizational hierarchy from their club
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@sda.com',
    name: 'Admin User',
    whatsappNumber: EMPTY_VALUE, // Admin doesn't need WhatsApp
    role: UserRole.ADMIN,
    clubId: null, // Admin doesn't need a club
    isActive: true,
    approvalStatus: ApprovalStatus.APPROVED, // Admin is auto-approved
    classes: [], // Admin doesn't need classes
    timezone: 'America/New_York',
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'clubadmin@sda.com',
    name: 'Club Admin',
    whatsappNumber: '+52 55 9999 0000',
    role: UserRole.CLUB_ADMIN,
    clubId: '4', // Member of Elphis Kalein (Narvarte)
    isActive: true,
    approvalStatus: ApprovalStatus.APPROVED, // Club admin is auto-approved
    classes: ['Guide', 'Voyager'],
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'pending1@sda.com',
    name: 'Ana García',
    whatsappNumber: '+52 55 1111 2222',
    role: UserRole.USER,
    clubId: '4', // Member of Elphis Kalein (Narvarte)
    isActive: false,
    approvalStatus: ApprovalStatus.PENDING, // Pending approval
    classes: ['Friend', 'Companion'],
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'pending2@sda.com',
    name: 'Luis Hernández',
    whatsappNumber: '+52 55 3333 4444',
    role: UserRole.USER,
    clubId: '5', // Member of Panteras (Portales)
    isActive: false,
    approvalStatus: ApprovalStatus.PENDING, // Pending approval
    classes: ['Explorer'],
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'carlos.martinez@sda.com',
    name: 'Carlos Martínez',
    whatsappNumber: '+52 55 1234 5678',
    role: UserRole.USER,
    clubId: '4', // Member of Narvarte church club (Elphis Kalein)
    isActive: true,
    approvalStatus: ApprovalStatus.APPROVED, // Approved member
    classes: ['Friend', 'Companion', 'Explorer'],
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    email: 'maria.lopez@sda.com',
    name: 'María López',
    whatsappNumber: '+52 55 2345 6789',
    role: UserRole.USER,
    clubId: '5', // Member of Portales church club (Panteras)
    isActive: true,
    approvalStatus: ApprovalStatus.APPROVED, // Approved member
    classes: ['Voyager'],
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Clubs - Diverse organizational hierarchy
export const mockClubs: Club[] = [
  // División Interamericana > Unión Mexicana Central > Asociación Metropolitana Mexicana
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
    feeSettings: {
      monthlyFeeAmount: 50.0,
      currency: 'MXN',
      activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // January to October
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 2, // Carlos Martínez + Club Admin
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
    feeSettings: {
      monthlyFeeAmount: 75.0,
      currency: 'MXN',
      activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // All year
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 1, // María López
  },

  // División Interamericana > Unión Mexicana Central > Asociación del Bajío
  {
    id: '6',
    name: 'Conquistadores León',
    description: 'Club de actividades y aventura en León',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: 3,
    church: 'Iglesia Adventista de León',
    association: 'Asociación del Bajío',
    union: 'Unión Mexicana Central',
    division: 'División Interamericana',
    feeSettings: {
      monthlyFeeAmount: 60.0,
      currency: 'MXN',
      activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 0,
  },
  {
    id: '7',
    name: 'Águilas Querétaro',
    description: 'Club de compañerismo y servicio en Querétaro',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.MONTHLY,
    groupSize: 2,
    church: 'Iglesia Adventista de Querétaro',
    association: 'Asociación del Bajío',
    union: 'Unión Mexicana Central',
    division: 'División Interamericana',
    feeSettings: {
      monthlyFeeAmount: 55.0,
      currency: 'MXN',
      activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      isActive: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 0,
  },

  // División Interamericana > Unión del Norte de México > Asociación de Chihuahua
  {
    id: '8',
    name: 'Pioneros del Desierto',
    description: 'Club de exploradores en Chihuahua',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.BIWEEKLY,
    groupSize: 2,
    church: 'Iglesia Adventista de Chihuahua Central',
    association: 'Asociación de Chihuahua',
    union: 'Unión del Norte de México',
    division: 'División Interamericana',
    feeSettings: {
      monthlyFeeAmount: 65.0,
      currency: 'MXN',
      activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 0,
  },
  {
    id: '9',
    name: 'Centinelas del Norte',
    description: 'Club de liderazgo juvenil en Chihuahua',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: 2,
    church: 'Iglesia Adventista de Chihuahua Norte',
    association: 'Asociación de Chihuahua',
    union: 'Unión del Norte de México',
    division: 'División Interamericana',
    feeSettings: {
      monthlyFeeAmount: 70.0,
      currency: 'MXN',
      activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 0,
  },

  // División Sudamericana > Unión Austral > Asociación Argentina del Sur
  {
    id: '10',
    name: 'Amigos de Buenos Aires',
    description: 'Club de café y compañerismo en Buenos Aires',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: 2,
    church: 'Iglesia Adventista de Buenos Aires Central',
    association: 'Asociación Argentina del Sur',
    union: 'Unión Austral',
    division: 'División Sudamericana',
    feeSettings: {
      monthlyFeeAmount: 1500.0,
      currency: 'ARS',
      activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 0,
  },
  {
    id: '11',
    name: 'Guardianes del Sur',
    description: 'Club de servicio comunitario en Buenos Aires',
    adminId: '2',
    isActive: true,
    matchFrequency: MatchFrequency.BIWEEKLY,
    groupSize: 3,
    church: 'Iglesia Adventista de Belgrano',
    association: 'Asociación Argentina del Sur',
    union: 'Unión Austral',
    division: 'División Sudamericana',
    feeSettings: {
      monthlyFeeAmount: 1200.0,
      currency: 'ARS',
      activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      isActive: true,
    },
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
export const initializeMockData = (): {
  users: typeof mockUsers;
  clubs: typeof mockClubs;
  matches: typeof mockMatches;
  rounds: typeof mockMatchRounds;
} => {
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
