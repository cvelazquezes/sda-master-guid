import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as utils from './clubHierarchyUtils';
import { useHierarchyHandlers, type HierarchyHandlers } from './hierarchyHandlers';
import { clubService } from '../../../../infrastructure/repositories/clubService';
import { EMPTY_VALUE } from '../../../../shared/constants';
import type { Club } from '../../../../types';

type HierarchyState = {
  division: string;
  union: string;
  association: string;
  church: string;
  clubId: string;
};

// Auto-selection hook
function useAutoSelect(
  clubs: Club[],
  h: HierarchyState,
  setters: {
    setDivision: (v: string) => void;
    setUnion: (v: string) => void;
    setAssociation: (v: string) => void;
    setChurch: (v: string) => void;
    setClubId: (v: string) => void;
  }
): void {
  useEffect(() => {
    if (clubs.length > 0 && !h.division) {
      const list = utils.getUniqueDivisions(clubs);
      if (list.length === 1) {
        setters.setDivision(list[0]);
      }
    }
  }, [clubs, h.division, setters]);

  useEffect(() => {
    if (h.division && !h.union) {
      const list = utils.getUniqueUnions(clubs, h.division);
      if (list.length === 1) {
        setters.setUnion(list[0]);
      }
    }
  }, [clubs, h.division, h.union, setters]);

  useEffect(() => {
    if (h.union && !h.association) {
      const list = utils.getUniqueAssociations(clubs, h.division, h.union);
      if (list.length === 1) {
        setters.setAssociation(list[0]);
      }
    }
  }, [clubs, h.division, h.union, h.association, setters]);

  useEffect(() => {
    if (h.association && !h.church) {
      const list = utils.getUniqueChurches(clubs, h.division, h.union, h.association);
      if (list.length === 1) {
        setters.setChurch(list[0]);
      }
    }
  }, [clubs, h.division, h.union, h.association, h.church, setters]);

  useEffect(() => {
    if (h.church && !h.clubId) {
      const list = utils.getFilteredClubs(clubs, h.division, h.union, h.association, h.church);
      if (list.length === 1) {
        setters.setClubId(list[0].id);
      }
    }
  }, [clubs, h.division, h.union, h.association, h.church, h.clubId, setters]);
}

export type UseClubHierarchyReturn = {
  clubs: Club[];
  loadingClubs: boolean;
  hierarchy: HierarchyState;
  getUniqueDivisions: () => string[];
  getUniqueUnions: () => string[];
  getUniqueAssociations: () => string[];
  getUniqueChurches: () => string[];
  getFilteredClubs: () => Club[];
  setClubId: (id: string) => void;
} & HierarchyHandlers;

export function useClubHierarchy(): UseClubHierarchyReturn {
  const { t } = useTranslation();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [division, setDivision] = useState(EMPTY_VALUE);
  const [union, setUnion] = useState(EMPTY_VALUE);
  const [association, setAssociation] = useState(EMPTY_VALUE);
  const [church, setChurch] = useState(EMPTY_VALUE);
  const [clubId, setClubId] = useState(EMPTY_VALUE);
  const hierarchy = { division, union, association, church, clubId };

  useEffect(() => {
    clubService
      .getAllClubs()
      .then((list) => setClubs(list.filter((c) => c.isActive)))
      .catch(() => Alert.alert(t('common.error'), t('errors.failedToLoadClubs')))
      .finally(() => setLoadingClubs(false));
  }, [t]);

  const setters = { setDivision, setUnion, setAssociation, setChurch, setClubId };
  useAutoSelect(clubs, hierarchy, setters);
  const handlers = useHierarchyHandlers(
    setDivision,
    setUnion,
    setAssociation,
    setChurch,
    setClubId
  );

  const getDivisions = useCallback(() => utils.getUniqueDivisions(clubs), [clubs]);
  const getUnions = useCallback(() => utils.getUniqueUnions(clubs, division), [clubs, division]);
  const getAssocs = useCallback(
    () => utils.getUniqueAssociations(clubs, division, union),
    [clubs, division, union]
  );
  const getChurches = useCallback(
    () => utils.getUniqueChurches(clubs, division, union, association),
    [clubs, division, union, association]
  );
  const getFiltered = useCallback(
    () => utils.getFilteredClubs(clubs, division, union, association, church),
    [clubs, division, union, association, church]
  );

  return {
    clubs,
    loadingClubs,
    hierarchy,
    getUniqueDivisions: getDivisions,
    getUniqueUnions: getUnions,
    getUniqueAssociations: getAssocs,
    getUniqueChurches: getChurches,
    getFilteredClubs: getFiltered,
    setClubId,
    ...handlers,
  };
}
