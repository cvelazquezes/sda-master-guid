import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Club } from '../../../../types';
import { clubService } from '../../../../infrastructure/repositories/clubService';
import { EMPTY_VALUE, MESSAGES } from '../../../../shared/constants';
import { ClubFilters, ClubFormData, initialFilters, initialFormData } from './types';

interface UseClubsDataReturn {
  clubs: Club[];
  loading: boolean;
  refreshing: boolean;
  filters: ClubFilters;
  setFilters: React.Dispatch<React.SetStateAction<ClubFilters>>;
  formData: ClubFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClubFormData>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  loadClubs: () => Promise<void>;
  onRefresh: () => void;
  resetForm: () => void;
  clearFilters: () => void;
}

export function useClubsData(): UseClubsDataReturn {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<ClubFilters>(initialFilters);
  const [formData, setFormData] = useState<ClubFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);

  const loadClubs = useCallback(async (): Promise<void> => {
    try {
      const clubsData = await clubService.getAllClubs();
      setClubs(clubsData);
    } catch {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_CLUBS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadClubs();
  };

  const resetForm = (): void => {
    setFormData(initialFormData);
  };

  const clearFilters = (): void => {
    setFilters(initialFilters);
    setSearchQuery(EMPTY_VALUE);
  };

  return {
    clubs,
    loading,
    refreshing,
    filters,
    setFilters,
    formData,
    setFormData,
    searchQuery,
    setSearchQuery,
    loadClubs,
    onRefresh,
    resetForm,
    clearFilters,
  };
}
