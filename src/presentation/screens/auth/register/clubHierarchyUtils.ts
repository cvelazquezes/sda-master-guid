import { Club } from '../../../../types';

export const getUniqueDivisions = (clubs: Club[]): string[] => {
  const values = clubs.map((club) => club.division).filter(Boolean);
  return Array.from(new Set(values)).sort();
};

export const getUniqueUnions = (clubs: Club[], division: string): string[] => {
  if (!division) {
    return [];
  }
  const filtered = clubs.filter((c) => c.division === division && c.isActive);
  const values = filtered.map((c) => c.union).filter(Boolean);
  return Array.from(new Set(values)).sort();
};

export const getUniqueAssociations = (clubs: Club[], division: string, union: string): string[] => {
  if (!union) {
    return [];
  }
  const filtered = clubs.filter((c) => c.division === division && c.union === union && c.isActive);
  const values = filtered.map((c) => c.association).filter(Boolean);
  return Array.from(new Set(values)).sort();
};

export const getUniqueChurches = (
  clubs: Club[],
  division: string,
  union: string,
  association: string
): string[] => {
  if (!association) {
    return [];
  }
  const filtered = clubs.filter(
    (c) =>
      c.division === division && c.union === union && c.association === association && c.isActive
  );
  const values = filtered.map((c) => c.church).filter(Boolean);
  return Array.from(new Set(values)).sort();
};

interface GetFilteredClubsOptions {
  clubs: Club[];
  division: string;
  union: string;
  association: string;
  church: string;
}

export const getFilteredClubs = (options: GetFilteredClubsOptions): Club[] => {
  const { clubs, division, union, association, church } = options;
  if (!church) {
    return [];
  }
  return clubs.filter(
    (c) =>
      c.division === division &&
      c.union === union &&
      c.association === association &&
      c.church === church &&
      c.isActive
  );
};
