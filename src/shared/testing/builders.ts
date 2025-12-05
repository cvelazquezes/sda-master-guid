/**
 * Test Data Builders
 * Provides fluent builders for test data following the Test Data Builder pattern
 */

import {
  User,
  Club,
  Match,
  UserRole,
  MatchStatus,
  ApprovalStatus,
  MatchFrequency,
} from '../../types';

// ============================================================================
// User Builder
// ============================================================================

export class UserBuilder {
  private user: Partial<User> = {
    id: `user-${Date.now()}`,
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
    clubId: 'club-1',
    isActive: true,
    whatsappNumber: '+1234567890',
    approvalStatus: ApprovalStatus.APPROVED,
    classes: ['Friend'],
    timezone: 'America/Mexico_City',
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  withId(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  withRole(role: User['role']): UserBuilder {
    this.user.role = role;
    return this;
  }

  withClubId(clubId: string): UserBuilder {
    this.user.clubId = clubId;
    return this;
  }

  withWhatsappNumber(whatsappNumber: string): UserBuilder {
    this.user.whatsappNumber = whatsappNumber;
    return this;
  }

  active(): UserBuilder {
    this.user.isActive = true;
    return this;
  }

  inactive(): UserBuilder {
    this.user.isActive = false;
    return this;
  }

  asUser(): UserBuilder {
    this.user.role = 'user';
    return this;
  }

  asClubAdmin(): UserBuilder {
    this.user.role = 'club_admin';
    return this;
  }

  asSuperAdmin(): UserBuilder {
    this.user.role = 'super_admin';
    return this;
  }

  build(): User {
    return this.user as User;
  }

  buildMany(count: number): User[] {
    return Array.from({ length: count }, (_, i) =>
      new UserBuilder()
        .withId(`user-${i}`)
        .withEmail(`user${i}@example.com`)
        .withName(`User ${i}`)
        .build()
    );
  }
}

// ============================================================================
// Club Builder
// ============================================================================

export class ClubBuilder {
  private club: Partial<Club> = {
    id: `club-${Date.now()}`,
    name: 'Test Club',
    description: 'A test club',
    adminId: 'admin-1',
    isActive: true,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: 2,
    church: 'Test Church',
    association: 'Test Association',
    union: 'Test Union',
    division: 'Test Division',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  withId(id: string): ClubBuilder {
    this.club.id = id;
    return this;
  }

  withName(name: string): ClubBuilder {
    this.club.name = name;
    return this;
  }

  withDescription(description: string): ClubBuilder {
    this.club.description = description;
    return this;
  }

  withAdminId(adminId: string): ClubBuilder {
    this.club.adminId = adminId;
    return this;
  }

  withMatchFrequency(frequency: MatchFrequency): ClubBuilder {
    this.club.matchFrequency = frequency;
    return this;
  }

  withGroupSize(size: number): ClubBuilder {
    this.club.groupSize = size;
    return this;
  }

  build(): Club {
    return this.club as Club;
  }

  buildMany(count: number): Club[] {
    return Array.from({ length: count }, (_, i) =>
      new ClubBuilder().withId(`club-${i}`).withName(`Club ${i}`).build()
    );
  }
}

// ============================================================================
// Match Builder
// ============================================================================

export class MatchBuilder {
  private match: Partial<Match> = {
    id: `match-${Date.now()}`,
    clubId: 'club-1',
    date: new Date().toISOString(),
    courtNumber: 1,
    participants: [],
    status: MatchStatus.SCHEDULED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  withId(id: string): MatchBuilder {
    this.match.id = id;
    return this;
  }

  withClubId(clubId: string): MatchBuilder {
    this.match.clubId = clubId;
    return this;
  }

  withDate(date: Date | string): MatchBuilder {
    this.match.date = typeof date === 'string' ? date : date.toISOString();
    return this;
  }

  onCourtNumber(courtNumber: number): MatchBuilder {
    this.match.courtNumber = courtNumber;
    return this;
  }

  withParticipants(participants: string[]): MatchBuilder {
    this.match.participants = participants;
    return this;
  }

  withStatus(status: Match['status']): MatchBuilder {
    this.match.status = status;
    return this;
  }

  scheduled(): MatchBuilder {
    this.match.status = 'scheduled';
    return this;
  }

  inProgress(): MatchBuilder {
    this.match.status = 'in_progress';
    return this;
  }

  completed(): MatchBuilder {
    this.match.status = 'completed';
    return this;
  }

  cancelled(): MatchBuilder {
    this.match.status = 'cancelled';
    return this;
  }

  withNotes(notes: string): MatchBuilder {
    this.match.notes = notes;
    return this;
  }

  build(): Match {
    return this.match as Match;
  }

  buildMany(count: number): Match[] {
    return Array.from({ length: count }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() + i);

      return new MatchBuilder()
        .withId(`match-${i}`)
        .withDate(date)
        .onCourtNumber((i % 4) + 1)
        .build();
    });
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Creates a new UserBuilder
 */
export function aUser(): UserBuilder {
  return new UserBuilder();
}

/**
 * Creates a new ClubBuilder
 */
export function aClub(): ClubBuilder {
  return new ClubBuilder();
}

/**
 * Creates a new MatchBuilder
 */
export function aMatch(): MatchBuilder {
  return new MatchBuilder();
}

// ============================================================================
// Preset Builders
// ============================================================================

/**
 * Creates a super admin user
 */
export function aSuperAdminUser(): UserBuilder {
  return aUser().asSuperAdmin().withEmail('admin@example.com').withName('Super Admin');
}

/**
 * Creates a club admin user
 */
export function aClubAdminUser(clubId?: string): UserBuilder {
  const builder = aUser().asClubAdmin().withEmail('clubadmin@example.com').withName('Club Admin');

  if (clubId) {
    builder.withClubId(clubId);
  }

  return builder;
}

/**
 * Creates a regular user
 */
export function aRegularUser(clubId?: string): UserBuilder {
  const builder = aUser().asUser().withEmail('user@example.com').withName('Regular User');

  if (clubId) {
    builder.withClubId(clubId);
  }

  return builder;
}

/**
 * Creates an inactive user
 */
export function anInactiveUser(): UserBuilder {
  return aUser().inactive().withEmail('inactive@example.com').withName('Inactive User');
}

/**
 * Creates a club with courts
 */
export function aClubWithCourts(courtCount: number = 4): ClubBuilder {
  return aClub()
    .withNumberOfCourts(courtCount)
    .withCourtNames(Array.from({ length: courtCount }, (_, i) => `Court ${i + 1}`));
}

/**
 * Creates an upcoming match
 */
export function anUpcomingMatch(clubId?: string): MatchBuilder {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const builder = aMatch()
    .scheduled()
    .withDate(tomorrow)
    .withParticipants(['user-1', 'user-2', 'user-3', 'user-4']);

  if (clubId) {
    builder.withClubId(clubId);
  }

  return builder;
}

/**
 * Creates a past match
 */
export function aPastMatch(clubId?: string): MatchBuilder {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const builder = aMatch()
    .completed()
    .withDate(yesterday)
    .withParticipants(['user-1', 'user-2', 'user-3', 'user-4']);

  if (clubId) {
    builder.withClubId(clubId);
  }

  return builder;
}

// ============================================================================
// Bulk Data Generation
// ============================================================================

/**
 * Creates a complete test dataset
 */
export function createTestDataset(): {
  users: User[];
  clubs: Club[];
  matches: Match[];
} {
  const clubs = new ClubBuilder().buildMany(3);

  const users = [
    aSuperAdminUser().withId('super-admin-1').build(),
    aClubAdminUser(clubs[0].id).withId('club-admin-1').build(),
    aClubAdminUser(clubs[1].id).withId('club-admin-2').build(),
    ...new UserBuilder().buildMany(10).map((u, i) => ({
      ...u,
      clubId: clubs[i % clubs.length].id,
    })),
  ];

  const matches = clubs.flatMap((club, _clubIndex) =>
    new MatchBuilder().buildMany(5).map((m, _i) => ({
      ...m,
      clubId: club.id,
      participants: users
        .filter((u) => u.clubId === club.id)
        .slice(0, 4)
        .map((u) => u.id),
    }))
  );

  return { users, clubs, matches };
}

/**
 * Creates random test data
 */
export function createRandomUsers(count: number, clubIds: string[]): User[] {
  return Array.from({ length: count }, (_, i) => {
    const roles: User['role'][] = ['user', 'club_admin', 'super_admin'];
    const role = roles[Math.floor(Math.random() * roles.length)];

    return aUser()
      .withId(`user-${i}`)
      .withEmail(`user${i}@example.com`)
      .withName(`User ${i}`)
      .withRole(role)
      .withClubId(clubIds[i % clubIds.length])
      .build();
  });
}

/**
 * Creates random matches
 */
export function createRandomMatches(count: number, clubIds: string[], userIds: string[]): Match[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 15);

    const statuses: Match['status'][] = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const participants = Array.from(
      { length: Math.floor(Math.random() * 2) + 2 },
      () => userIds[Math.floor(Math.random() * userIds.length)]
    );

    return aMatch()
      .withId(`match-${i}`)
      .withClubId(clubIds[i % clubIds.length])
      .withDate(date)
      .withStatus(status)
      .withParticipants(participants)
      .onCourtNumber(Math.floor(Math.random() * 4) + 1)
      .build();
  });
}
