import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../state/AuthContext';
import { useTheme } from '../../../state/ThemeContext';
import { UserDetailModal } from '../../../components/features/UserDetailModal';
import { User, PathfinderClass } from '../../../../types';
import { ClassSelectionModal } from '../../../components/features/ClassSelectionModal';
import { PageHeader, SearchBar, TabBar, FilterModal } from '../../../components/primitives';
import { MEMBER_TAB } from '../../../../shared/constants';
import { createStyles } from './styles';
import { useClubMembers } from './useClubMembers';
import { useFilterState } from './useFilterState';
import {
  toggleMemberStatus,
  showDeleteMemberAlert,
  showApproveMemberAlert,
  showRejectMemberAlert,
  saveClasses,
} from './memberHandlers';
import { createTabs, createFilterSections } from './filterConfig';
import {
  filterMembers,
  countPendingMembers,
  countApprovedMembers,
  getAvailableClasses,
} from './memberFilters';
import { MembersList } from './MembersList';

function useLabels(t: (key: string) => string): Record<string, string> {
  return {
    pending: t('screens.usersManagement.pendingLabel'),
    reject: t('screens.clubMembers.rejectMember'),
    approve: t('screens.clubMembers.approveMember'),
    clubAdmin: t('components.userCard.roles.clubAdmin'),
    user: t('components.userCard.roles.user'),
    active: t('screens.clubMembers.active'),
    inactive: t('screens.clubMembers.inactive'),
    overdue: t('screens.clubMembers.overdue'),
    pendingStatus: t('screens.clubMembers.pendingStatus'),
    paidUp: t('screens.members.paidUp'),
    editClasses: t('screens.clubMembers.editClasses'),
    deactivate: t('screens.clubMembers.deactivateMember'),
    activate: t('screens.clubMembers.activateMember'),
    delete: t('screens.clubMembers.deleteMember'),
  };
}

function useMemberModals(): {
  detailVisible: boolean;
  selectedMember: User | null;
  classEditModalVisible: boolean;
  memberToEdit: User | null;
  openDetail: (m: User) => void;
  closeDetail: () => void;
  openClassEdit: (m: User) => void;
  closeClassEdit: () => void;
} {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [classEditModalVisible, setClassEditModalVisible] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<User | null>(null);
  const openDetail = (m: User): void => {
    setSelectedMember(m);
    setDetailVisible(true);
  };
  const closeDetail = (): void => {
    setDetailVisible(false);
    setSelectedMember(null);
  };
  const openClassEdit = (m: User): void => {
    setMemberToEdit(m);
    setClassEditModalVisible(true);
  };
  const closeClassEdit = (): void => {
    setClassEditModalVisible(false);
    setMemberToEdit(null);
  };
  return {
    detailVisible,
    selectedMember,
    classEditModalVisible,
    memberToEdit,
    openDetail,
    closeDetail,
    openClassEdit,
    closeClassEdit,
  };
}

const ClubMembersScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors, spacing } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing),
    [colors, spacing]
  );
  const { members, balances, refreshing, loadData, onRefresh } = useClubMembers(user?.clubId, t);
  const filterState = useFilterState();
  const modals = useMemberModals();

  const filteredMembers = useMemo(
    () =>
      filterMembers({
        members,
        searchQuery: filterState.searchQuery,
        statusFilter: filterState.statusFilter,
        activeTab: filterState.activeTab,
        classFilter: filterState.classFilter,
      }),
    [
      members,
      filterState.searchQuery,
      filterState.statusFilter,
      filterState.activeTab,
      filterState.classFilter,
    ]
  );
  const pendingCount = useMemo(() => countPendingMembers(members), [members]);
  const approvedCount = useMemo(() => countApprovedMembers(members), [members]);
  const availableClasses = useMemo(() => getAvailableClasses(members), [members]);
  const tabs = createTabs(approvedCount, pendingCount, t);
  const filterSections = createFilterSections({
    statusFilter: filterState.statusFilter,
    paymentFilter: filterState.paymentFilter,
    classFilter: filterState.classFilter,
    availableClasses,
    t,
  });
  const labels = useLabels(t);
  const handleSaveClasses = useCallback(
    (classes: PathfinderClass[]): void => {
      if (modals.memberToEdit) {
        saveClasses(modals.memberToEdit.id, classes, loadData);
      }
    },
    [modals.memberToEdit, loadData]
  );
  const showFilter =
    filterState.activeTab === MEMBER_TAB.APPROVED
      ? (): void => filterState.setFilterModalVisible(true)
      : undefined;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <PageHeader
        title={t('screens.clubMembers.title')}
        subtitle={t('screens.clubMembers.subtitle', {
          approved: approvedCount,
          pending: pendingCount,
        })}
        showActions
      />
      <TabBar
        tabs={tabs}
        activeTabId={filterState.activeTab}
        onTabChange={filterState.onTabChange}
      />
      <SearchBar
        value={filterState.searchQuery}
        onChangeText={filterState.setSearchQuery}
        placeholder={t('placeholders.searchMembers')}
        onFilterPress={showFilter}
        filterActive={filterState.hasActiveFilters}
      />
      <View style={styles.content}>
        <MembersList
          members={filteredMembers}
          balances={balances}
          activeTab={filterState.activeTab}
          onApprove={(id, name): void => showApproveMemberAlert(id, name, loadData)}
          onReject={(id, name): void => showRejectMemberAlert(id, name, loadData)}
          onPress={modals.openDetail}
          onEditClasses={modals.openClassEdit}
          onToggleStatus={(id, isActive): void => {
            toggleMemberStatus(id, isActive, loadData);
          }}
          onDelete={(id, name): void => showDeleteMemberAlert(id, name, loadData)}
          labels={labels}
          t={t}
        />
      </View>
      <FilterModal
        visible={filterState.filterModalVisible}
        title={t('screens.clubMembers.filterMembers')}
        sections={filterSections}
        onClose={(): void => filterState.setFilterModalVisible(false)}
        onClear={filterState.clearFilters}
        onApply={filterState.applyFilters}
        onSelectOption={filterState.onFilterSelect}
      />
      <UserDetailModal
        visible={modals.detailVisible}
        user={modals.selectedMember}
        onClose={modals.closeDetail}
      />
      <ClassSelectionModal
        visible={modals.classEditModalVisible}
        initialClasses={modals.memberToEdit?.classes || []}
        onSave={handleSaveClasses}
        onClose={modals.closeClassEdit}
      />
    </ScrollView>
  );
};

export default ClubMembersScreen;
