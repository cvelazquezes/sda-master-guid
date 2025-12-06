import { Club } from '../../../types';
import { FILTER_STATUS, HIERARCHY_FIELDS, EMPTY_VALUE } from '../../../shared/constants';
import { ClubFilters, HierarchyField } from './types';

export function getUniqueClubValues(
  clubs: Club[],
  field: HierarchyField,
  filters: ClubFilters
): string[] {
  let filteredClubs = clubs;

  if (field === HIERARCHY_FIELDS.UNION && filters.division) {
    filteredClubs = clubs.filter((club) => club.division === filters.division);
  } else if (field === HIERARCHY_FIELDS.ASSOCIATION && filters.union) {
    filteredClubs = clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) {
        return false;
      }
      if (club.union !== filters.union) {
        return false;
      }
      return true;
    });
  } else if (field === HIERARCHY_FIELDS.CHURCH && filters.association) {
    filteredClubs = clubs.filter((club) => {
      if (filters.division && club.division !== filters.division) {
        return false;
      }
      if (filters.union && club.union !== filters.union) {
        return false;
      }
      if (club.association !== filters.association) {
        return false;
      }
      return true;
    });
  }

  const values = filteredClubs.map((club) => club[field]).filter(Boolean);
  return Array.from(new Set(values)).sort();
}

function matchesSearchQuery(club: Club, searchQuery: string): boolean {
  if (!searchQuery) {
    return true;
  }
  const query = searchQuery.toLowerCase();
  return club.name.toLowerCase().includes(query) || club.description.toLowerCase().includes(query);
}

function matchesFilter(filterValue: string | undefined, clubValue: string): boolean {
  return !filterValue || clubValue === filterValue;
}

function matchesHierarchyFilters(club: Club, f: ClubFilters): boolean {
  return (
    matchesFilter(f.division, club.division) &&
    matchesFilter(f.union, club.union) &&
    matchesFilter(f.association, club.association) &&
    matchesFilter(f.church, club.church) &&
    matchesFilter(f.clubId, club.id)
  );
}

function matchesStatusFilter(club: Club, status: string): boolean {
  if (status === FILTER_STATUS.ACTIVE && !club.isActive) {
    return false;
  }
  if (status === FILTER_STATUS.INACTIVE && club.isActive) {
    return false;
  }
  return true;
}

export function filterClubs(clubs: Club[], filters: ClubFilters, searchQuery: string): Club[] {
  return clubs.filter((club) => {
    if (!matchesSearchQuery(club, searchQuery)) {
      return false;
    }
    if (!matchesHierarchyFilters(club, filters)) {
      return false;
    }
    if (!matchesStatusFilter(club, filters.status)) {
      return false;
    }
    return true;
  });
}

export function getActiveFilterCount(filters: ClubFilters, searchQuery: string): number {
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
  if (filters.status !== FILTER_STATUS.ALL) {
    count++;
  }
  if (searchQuery) {
    count++;
  }
  return count;
}

export function updateFilterWithCascade(
  filters: ClubFilters,
  field: string,
  value: string
): ClubFilters {
  const newFilters = { ...filters };

  if (field === HIERARCHY_FIELDS.DIVISION) {
    newFilters.division = value;
    newFilters.union = EMPTY_VALUE;
    newFilters.association = EMPTY_VALUE;
    newFilters.church = EMPTY_VALUE;
  } else if (field === HIERARCHY_FIELDS.UNION) {
    newFilters.union = value;
    newFilters.association = EMPTY_VALUE;
    newFilters.church = EMPTY_VALUE;
  } else if (field === HIERARCHY_FIELDS.ASSOCIATION) {
    newFilters.association = value;
    newFilters.church = EMPTY_VALUE;
  } else if (field === HIERARCHY_FIELDS.CHURCH) {
    newFilters.church = value;
  } else if (field === HIERARCHY_FIELDS.STATUS) {
    newFilters.status = value as (typeof FILTER_STATUS)[keyof typeof FILTER_STATUS];
  }

  return newFilters;
}
