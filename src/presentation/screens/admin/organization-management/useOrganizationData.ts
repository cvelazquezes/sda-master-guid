import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Club } from '../../../../types';
import { clubService } from '../../../../infrastructure/repositories/clubService';
import { HIERARCHY_FIELDS, OrganizationType, EMPTY_VALUE } from '../../../../shared/constants';
import { OrganizationItem, OrgFormData, initialFormData } from './types';

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

interface UseOrganizationDataReturn {
  clubs: Club[];
  organizations: OrganizationItem[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedType: OrganizationType;
  setSelectedType: (t: OrganizationType) => void;
  formData: OrgFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrgFormData>>;
  parentDivisionSearch: string;
  setParentDivisionSearch: (s: string) => void;
  parentUnionSearch: string;
  setParentUnionSearch: (s: string) => void;
  parentAssociationSearch: string;
  setParentAssociationSearch: (s: string) => void;
  resetForm: () => void;
}

interface AddOrgToMapOptions {
  map: Map<string, OrganizationItem>;
  key: string;
  name: string;
  type: OrganizationType;
  parent?: string;
}

function addOrgToMap(options: AddOrgToMapOptions): void {
  const { map, key, name, type, parent } = options;
  if (!name) {
    return;
  }
  if (!map.has(key)) {
    map.set(key, { id: key, name, type, parent, clubCount: 0 });
  }
  const org = map.get(key);
  if (org) {
    org.clubCount++;
  }
}

function buildOrgMap(clubs: Club[]): Map<string, OrganizationItem> {
  const orgMap = new Map<string, OrganizationItem>();
  clubs.forEach((club) => {
    const divKey = `${HIERARCHY_FIELDS.DIVISION}-${club.division}`;
    const unionKey = `${HIERARCHY_FIELDS.UNION}-${club.union}`;
    const assocKey = `${HIERARCHY_FIELDS.ASSOCIATION}-${club.association}`;
    const churchKey = `${HIERARCHY_FIELDS.CHURCH}-${club.church}`;

    addOrgToMap({ map: orgMap, key: divKey, name: club.division, type: HIERARCHY_FIELDS.DIVISION });
    addOrgToMap({
      map: orgMap,
      key: unionKey,
      name: club.union,
      type: HIERARCHY_FIELDS.UNION,
      parent: club.division,
    });
    addOrgToMap({
      map: orgMap,
      key: assocKey,
      name: club.association,
      type: HIERARCHY_FIELDS.ASSOCIATION,
      parent: club.union,
    });
    addOrgToMap({
      map: orgMap,
      key: churchKey,
      name: club.church,
      type: HIERARCHY_FIELDS.CHURCH,
      parent: club.association,
    });
  });
  return orgMap;
}

export function useOrganizationData(t: TranslationFn): UseOrganizationDataReturn {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);
  const [selectedType, setSelectedType] = useState<OrganizationType>(HIERARCHY_FIELDS.DIVISION);
  const [formData, setFormData] = useState<OrgFormData>(initialFormData);
  const [parentDivisionSearch, setParentDivisionSearch] = useState(EMPTY_VALUE);
  const [parentUnionSearch, setParentUnionSearch] = useState(EMPTY_VALUE);
  const [parentAssociationSearch, setParentAssociationSearch] = useState(EMPTY_VALUE);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const clubsList = await clubService.getAllClubs();
      setClubs(clubsList);
    } catch {
      Alert.alert(t('common.error'), t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const organizations = useMemo(() => {
    const orgMap = buildOrgMap(clubs);
    return Array.from(orgMap.values())
      .filter((org) => org.type === selectedType)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [clubs, selectedType]);

  const resetForm = useCallback((): void => {
    setFormData(initialFormData);
    setParentDivisionSearch(EMPTY_VALUE);
    setParentUnionSearch(EMPTY_VALUE);
    setParentAssociationSearch(EMPTY_VALUE);
  }, []);

  return {
    clubs,
    organizations,
    loading,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    formData,
    setFormData,
    parentDivisionSearch,
    setParentDivisionSearch,
    parentUnionSearch,
    setParentUnionSearch,
    parentAssociationSearch,
    setParentAssociationSearch,
    resetForm,
  };
}
