import { User, Club, ApprovalStatus, UserStatus } from '../../../../types';
import { FILTER_STATUS, HIERARCHY_FIELDS, EMPTY_VALUE } from '../../../../shared/constants';
import { UserFilters } from './types';

export function getUniqueClubValues(
  clubs: Club[],
  field: keyof Club,
  filters: UserFilters
): string[] {
  if (!clubs || !Array.isArray(clubs)) {
    return [];
  }
  let filteredClubs = clubs;
  if (field === HIERARCHY_FIELDS.UNION && filters.division) {
    filteredClubs = clubs.filter((club) => club.division === filters.division);
  } else if (field === HIERARCHY_FIELDS.ASSOCIATION && filters.union) {
    filteredClubs = clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) {
        return false;
      }
      return club.union === filters.union;
    });
  } else if (field === HIERARCHY_FIELDS.CHURCH && filters.association) {
    filteredClubs = clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) {
        return false;
      }
      if (filters.union && club.union !== filters.union) {
        return false;
      }
      return club.association === filters.association;
    });
  }
  const values = filteredClubs.map((club) => club[field]).filter(Boolean);
  return Array.from(new Set(values as string[])).sort();
}

export function getAvailableClubs(clubs: Club[], filters: UserFilters): Club[] {
  if (!clubs || !Array.isArray(clubs)) {
    return [];
  }
  if (!filters.church) {
    return [];
  }
  return clubs
    .filter((club) => {
      if (filters.division && club.division !== filters.division) {
        return false;
      }
      if (filters.union && club.union !== filters.union) {
        return false;
      }
      if (filters.association && club.association !== filters.association) {
        return false;
      }
      return club.church === filters.church;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getActiveFilterCount(filters: UserFilters, searchQuery: string): number {
  let count = 0;
  if (filters.division) {
    count++;
  }
  if (filters.union) {
    count++;
  }
  if (filters.association) {
    count++;
  }
  if (filters.church) {
    count++;
  }
  if (filters.clubId) {
    count++;
  }
  if (filters.role !== FILTER_STATUS.ALL) {
    count++;
  }
  if (filters.status !== FILTER_STATUS.ALL) {
    count++;
  }
  if (searchQuery) {
    count++;
  }
  return count;
}

function matchesTabFilter(user: User, activeTab: string): boolean {
  const isPending = activeTab === ApprovalStatus.PENDING;
  const isApproved = activeTab === ApprovalStatus.APPROVED;
  return (
    (isApproved && user.approvalStatus === ApprovalStatus.APPROVED) ||
    (isPending && user.approvalStatus === ApprovalStatus.PENDING)
  );
}

function matchesUserSearch(user: User, searchQuery: string): boolean {
  if (!searchQuery) {
    return true;
  }
  const query = searchQuery.toLowerCase();
  return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
}

function checkClubField(
  club: Club | undefined,
  filterVal: string | undefined,
  field: keyof Club
): boolean {
  return !filterVal || (club !== undefined && club[field] === filterVal);
}

function matchesUserHierarchy(user: User, clubs: Club[], f: UserFilters): boolean {
  const club = clubs.find((c) => c.id === user.clubId);
  return (
    checkClubField(club, f.division, 'division') &&
    checkClubField(club, f.union, 'union') &&
    checkClubField(club, f.association, 'association') &&
    checkClubField(club, f.church, 'church') &&
    (!f.clubId || user.clubId === f.clubId)
  );
}

function matchesUserRoleAndStatus(user: User, filters: UserFilters, activeTab: string): boolean {
  if (filters.role !== FILTER_STATUS.ALL && user.role !== filters.role) {
    return false;
  }
  if (activeTab === ApprovalStatus.APPROVED) {
    if (filters.status === UserStatus.ACTIVE && !user.isActive) {
      return false;
    }
    if (filters.status === UserStatus.INACTIVE && user.isActive) {
      return false;
    }
  }
  return true;
}

interface FilterUsersOptions {
  users: User[];
  clubs: Club[];
  filters: UserFilters;
  searchQuery: string;
  activeTab: string;
}

export function filterUsers(options: FilterUsersOptions): User[] {
  const { users, clubs, filters, searchQuery, activeTab } = options;
  if (!users || !Array.isArray(users)) {
    return [];
  }
  return users.filter((user) => {
    if (!matchesTabFilter(user, activeTab)) {
      return false;
    }
    if (!matchesUserSearch(user, searchQuery)) {
      return false;
    }
    if (!matchesUserHierarchy(user, clubs, filters)) {
      return false;
    }
    if (!matchesUserRoleAndStatus(user, filters, activeTab)) {
      return false;
    }
    return true;
  });
}

function clearChildFilters(filters: UserFilters, level: string): void {
  if (level === HIERARCHY_FIELDS.DIVISION) {
    filters.union = EMPTY_VALUE;
    filters.association = EMPTY_VALUE;
    filters.church = EMPTY_VALUE;
    filters.clubId = EMPTY_VALUE;
  } else if (level === HIERARCHY_FIELDS.UNION) {
    filters.association = EMPTY_VALUE;
    filters.church = EMPTY_VALUE;
    filters.clubId = EMPTY_VALUE;
  } else if (level === HIERARCHY_FIELDS.ASSOCIATION) {
    filters.church = EMPTY_VALUE;
    filters.clubId = EMPTY_VALUE;
  } else if (level === HIERARCHY_FIELDS.CHURCH) {
    filters.clubId = EMPTY_VALUE;
  }
}

export function updateFilterWithCascade(
  filters: UserFilters,
  _clubs: Club[],
  field: string,
  value: string
): UserFilters {
  const newFilters = { ...filters };

  const hierarchyFields = [
    HIERARCHY_FIELDS.DIVISION,
    HIERARCHY_FIELDS.UNION,
    HIERARCHY_FIELDS.ASSOCIATION,
    HIERARCHY_FIELDS.CHURCH,
  ];

  if (hierarchyFields.includes(field)) {
    (newFilters as Record<string, string>)[field] = value;
    if (!value) {
      clearChildFilters(newFilters, field);
    }
  } else if (field === HIERARCHY_FIELDS.CLUB_ID) {
    newFilters.clubId = value;
  } else if (field === HIERARCHY_FIELDS.ROLE) {
    newFilters.role = value;
  } else if (field === HIERARCHY_FIELDS.STATUS) {
    newFilters.status = value;
  }

  return newFilters;
}
