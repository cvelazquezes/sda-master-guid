import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../state/ThemeContext';
import { User, ApprovalStatus, Club } from '../../../../types';
import { UserCard } from '../../../components/features/UserCard';
import { UserDetailModal } from '../../../components/features/UserDetailModal';
import {
  PageHeader,
  SearchBar,
  EmptyState,
  TabBar,
  type Tab,
} from '../../../components/primitives';
import { BREAKPOINTS, ICONS, HIERARCHY_FIELDS } from '../../../../shared/constants';
import { createStyles } from './styles';
import { useUsersData } from './useUsersData';
import {
  getUniqueClubValues,
  getAvailableClubs,
  getActiveFilterCount,
  filterUsers,
  updateFilterWithCascade,
} from './filterUtils';
import {
  handleToggleUserStatus,
  handleApproveUser,
  handleRejectUser,
  handleDeleteUser,
} from './userHandlers';
import { PendingUserCard } from './PendingUserCard';
import { FilterModal } from './FilterModal';
import { UserFilters } from './types';

interface UseFilterAutoSelectOptions {
  filterVisible: boolean;
  filters: UserFilters;
  setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
  divisions: string[];
  unions: string[];
  associations: string[];
  churches: string[];
  clubs: Club[];
}

function useFilterAutoSelect(options: UseFilterAutoSelectOptions): void {
  const { filterVisible, filters, setFilters, divisions, unions, associations, churches, clubs } =
    options;
  useEffect(() => {
    if (!filterVisible) {
      return;
    }
    const u: Record<string, string> = {};
    const canSelect = (arr: string[], val?: string): boolean => arr.length === 1 && !val;
    if (canSelect(divisions, filters.division)) {
      u.division = divisions[0];
    }
    if (canSelect(unions, filters.union)) {
      u.union = unions[0];
    }
    if (canSelect(associations, filters.association)) {
      u.association = associations[0];
    }
    if (canSelect(churches, filters.church)) {
      u.church = churches[0];
    }
    if (clubs.length === 1 && !filters.clubId && filters.church) {
      u.clubId = clubs[0].id;
    }
    if (Object.keys(u).length > 0) {
      setFilters((p) => ({ ...p, ...u }));
    }
  }, [filterVisible, divisions, unions, associations, churches, clubs, filters, setFilters]);
}

function useTabs(
  t: (k: string, o?: Record<string, unknown>) => string,
  approvedCount: number,
  pendingCount: number
): Tab[] {
  return [
    {
      id: ApprovalStatus.APPROVED,
      label: t('screens.usersManagement.approvedTab', { count: approvedCount }),
      icon: ICONS.ACCOUNT_CHECK,
    },
    {
      id: ApprovalStatus.PENDING,
      label: t('screens.usersManagement.pendingTab', { count: pendingCount }),
      icon: ICONS.CLOCK_ALERT_OUTLINE,
      badge: pendingCount,
    },
  ];
}

const UsersManagementScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles(colors, spacing), [colors, spacing]);
  const isMobile = windowWidth < BREAKPOINTS.MOBILE;

  const {
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
  } = useUsersData();
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const availableDivisions = getUniqueClubValues(clubs, HIERARCHY_FIELDS.DIVISION, filters);
  const availableUnions = getUniqueClubValues(clubs, HIERARCHY_FIELDS.UNION, filters);
  const availableAssociations = getUniqueClubValues(clubs, HIERARCHY_FIELDS.ASSOCIATION, filters);
  const availableChurches = getUniqueClubValues(clubs, HIERARCHY_FIELDS.CHURCH, filters);
  const availableClubs = getAvailableClubs(clubs, filters);

  useFilterAutoSelect({
    filterVisible,
    filters,
    setFilters,
    divisions: availableDivisions,
    unions: availableUnions,
    associations: availableAssociations,
    churches: availableChurches,
    clubs: availableClubs,
  });

  const onUpdateFilter = useCallback(
    (field: string, value: string): void => {
      setFilters(updateFilterWithCascade(filters, clubs, field, value));
    },
    [filters, clubs, setFilters]
  );

  const getClubName = useCallback(
    (clubId: string | null): string => {
      if (!clubId) {
        return t('screens.usersManagement.noClub');
      }
      return (
        clubs.find((c: Club) => c.id === clubId)?.name ?? t('screens.usersManagement.unknownClub')
      );
    },
    [clubs, t]
  );

  const filteredUsers = filterUsers(users, clubs, filters, searchQuery, activeTab);
  const tabs = useTabs(t, approvedCount, pendingCount);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <PageHeader
        title={t('screens.usersManagement.title')}
        subtitle={t('screens.usersManagement.subtitle', {
          approved: approvedCount,
          pending: pendingCount,
        })}
        showActions
      />
      <TabBar
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={(tabId): void => setActiveTab(tabId as 'approved' | 'pending')}
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('screens.usersManagement.searchPlaceholder')}
        onFilterPress={
          activeTab === ApprovalStatus.APPROVED ? (): void => setFilterVisible(true) : undefined
        }
        filterActive={getActiveFilterCount(filters, searchQuery) > 0}
      />
      <UsersList
        filteredUsers={filteredUsers}
        users={users}
        clubs={clubs}
        activeTab={activeTab}
        loadData={loadData}
        getClubName={getClubName}
        setSelectedUser={setSelectedUser}
        setDetailVisible={setDetailVisible}
        colors={colors}
        t={t}
        styles={styles}
      />
      <FilterModal
        visible={filterVisible}
        onClose={(): void => setFilterVisible(false)}
        isMobile={isMobile}
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        onClearFilters={clearFilters}
        availableDivisions={availableDivisions}
        availableUnions={availableUnions}
        availableAssociations={availableAssociations}
        availableChurches={availableChurches}
        availableClubs={availableClubs}
        colors={colors}
        t={t}
      />
      <UserDetailModal
        visible={detailVisible}
        user={selectedUser}
        onClose={(): void => {
          setDetailVisible(false);
          setSelectedUser(null);
        }}
      />
    </ScrollView>
  );
};

interface UsersListProps {
  filteredUsers: User[];
  users: User[];
  clubs: Club[];
  activeTab: string;
  loadData: () => void;
  getClubName: (id: string | null) => string;
  setSelectedUser: (u: User) => void;
  setDetailVisible: (v: boolean) => void;
  colors: Record<string, string>;
  t: (k: string) => string;
  styles: ReturnType<typeof createStyles>;
}

function UsersList({
  filteredUsers,
  users,
  clubs,
  activeTab,
  loadData,
  getClubName,
  setSelectedUser,
  setDetailVisible,
  colors,
  t,
  styles,
}: UsersListProps): React.JSX.Element {
  if (filteredUsers.length === 0) {
    const isPending = activeTab === ApprovalStatus.PENDING;
    const icon = isPending ? ICONS.ACCOUNT_CLOCK : ICONS.ACCOUNT_GROUP_OUTLINE;
    const title = isPending
      ? t('screens.usersManagement.noPendingApprovals')
      : t('screens.usersManagement.noUsersFound');
    const desc = isPending
      ? t('screens.usersManagement.allApplicationsProcessed')
      : users.length === 0
        ? t('screens.usersManagement.noUsersRegistered')
        : t('screens.usersManagement.noUsersMatchingFilters');
    return (
      <View style={styles.content}>
        <EmptyState icon={icon} title={title} description={desc} />
      </View>
    );
  }
  return (
    <View style={styles.content}>
      {activeTab === ApprovalStatus.PENDING
        ? filteredUsers.map((u) => (
            <PendingUserCard
              key={u.id}
              user={u}
              clubs={clubs}
              onApprove={(id, n, r): void => handleApproveUser(id, n, r, loadData, t)}
              onReject={(id, n): void => handleRejectUser(id, n, loadData)}
              colors={colors}
              t={t}
            />
          ))
        : filteredUsers.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              clubName={getClubName(u.clubId)}
              onPress={(): void => {
                setSelectedUser(u);
                setDetailVisible(true);
              }}
              showAdminActions
              onToggleStatus={(): void => handleToggleUserStatus(u.id, u.isActive, loadData)}
              onDelete={(): void => handleDeleteUser(u.id, u.name, loadData)}
            />
          ))}
    </View>
  );
}

export default UsersManagementScreen;
