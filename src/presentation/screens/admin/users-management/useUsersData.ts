import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { initialFilters, type UserFilters } from './types';
import { clubService } from '../../../../infrastructure/repositories/clubService';
import { userService } from '../../../../infrastructure/repositories/userService';
import { MESSAGES, EMPTY_VALUE } from '../../../../shared/constants';
import { type User, type Club, ApprovalStatus } from '../../../../types';

type UseUsersDataReturn = {
  users: User[];
  clubs: Club[];
  refreshing: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: 'approved' | 'pending';
  setActiveTab: (t: 'approved' | 'pending') => void;
  filters: UserFilters;
  setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
  loadData: () => Promise<void>;
  onRefresh: () => void;
  clearFilters: () => void;
  pendingCount: number;
  approvedCount: number;
};

export function useUsersData(): UseUsersDataReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  // eslint-disable-next-line react/hook-use-state, @typescript-eslint/naming-convention -- setter used for side effects only
  const [_loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      const [usersData, clubsData] = await Promise.all([
        userService.getAllUsers(),
        clubService.getAllClubs(),
      ]);
      setUsers(usersData);
      setClubs(clubsData);
    } catch {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DATA);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadData();
  };

  const clearFilters = (): void => {
    setFilters(initialFilters);
    setSearchQuery(EMPTY_VALUE);
  };

  const pendingCount = users.filter((u) => u.approvalStatus === ApprovalStatus.PENDING).length;
  const approvedCount = users.filter((u) => u.approvalStatus === ApprovalStatus.APPROVED).length;

  return {
    users,
    clubs,
    refreshing,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    loadData,
    onRefresh,
    clearFilters,
    pendingCount,
    approvedCount,
  };
}
