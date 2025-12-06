import { Club } from '../../../types';
import { HIERARCHY_FIELDS, ICONS, OrganizationType } from '../../../shared/constants';

export function getTypeLabel(type: OrganizationType, t: (key: string) => string): string {
  const labels: Record<OrganizationType, string> = {
    [HIERARCHY_FIELDS.DIVISION]: t('components.organizationHierarchy.levels.division'),
    [HIERARCHY_FIELDS.UNION]: t('components.organizationHierarchy.levels.union'),
    [HIERARCHY_FIELDS.ASSOCIATION]: t('components.organizationHierarchy.levels.association'),
    [HIERARCHY_FIELDS.CHURCH]: t('components.organizationHierarchy.levels.church'),
  };
  return labels[type];
}

export function getTypeIcon(type: OrganizationType): string {
  const icons: Record<OrganizationType, string> = {
    [HIERARCHY_FIELDS.DIVISION]: ICONS.EARTH,
    [HIERARCHY_FIELDS.UNION]: ICONS.DOMAIN,
    [HIERARCHY_FIELDS.ASSOCIATION]: ICONS.OFFICE_BUILDING,
    [HIERARCHY_FIELDS.CHURCH]: ICONS.CHURCH,
  };
  return icons[type];
}

export function getTypeColor(
  type: OrganizationType,
  colors: { primary: string; info: string; warning: string; success: string }
): string {
  const typeColors: Record<OrganizationType, string> = {
    [HIERARCHY_FIELDS.DIVISION]: colors.primary,
    [HIERARCHY_FIELDS.UNION]: colors.info,
    [HIERARCHY_FIELDS.ASSOCIATION]: colors.warning,
    [HIERARCHY_FIELDS.CHURCH]: colors.success,
  };
  return typeColors[type];
}

export function getAvailableDivisions(clubs: Club[]): string[] {
  const divisionMap = new Map<string, string>();
  clubs.forEach((club) => {
    if (club.division) {
      divisionMap.set(club.division, club.division);
    }
  });
  return Array.from(divisionMap.values()).sort();
}

export function getAvailableUnions(clubs: Club[], divisionFilter?: string): string[] {
  const unionMap = new Map<string, string>();
  clubs.forEach((club) => {
    if (club.union) {
      if (!divisionFilter || club.division === divisionFilter) {
        unionMap.set(club.union, club.union);
      }
    }
  });
  return Array.from(unionMap.values()).sort();
}

export function getAvailableAssociations(clubs: Club[], unionFilter?: string): string[] {
  const assocMap = new Map<string, string>();
  clubs.forEach((club) => {
    if (club.association) {
      if (!unionFilter || club.union === unionFilter) {
        assocMap.set(club.association, club.association);
      }
    }
  });
  return Array.from(assocMap.values()).sort();
}

export function filterBySearch(items: string[], searchQuery: string): string[] {
  if (!searchQuery.trim()) {
    return items;
  }
  return items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
}

export function getAvailableParents(clubs: Club[], selectedType: OrganizationType): string[] {
  if (selectedType === HIERARCHY_FIELDS.UNION) {
    return getAvailableDivisions(clubs);
  }
  if (selectedType === HIERARCHY_FIELDS.ASSOCIATION) {
    return getAvailableUnions(clubs);
  }
  if (selectedType === HIERARCHY_FIELDS.CHURCH) {
    return getAvailableAssociations(clubs);
  }
  return [];
}
