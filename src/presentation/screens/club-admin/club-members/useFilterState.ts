import { useState } from 'react';
import { handleFilterSelect } from './filterConfig';
import { FILTER_STATUS, EMPTY_VALUE, MEMBER_TAB } from '../../../../shared/constants';
import type { StatusFilterValue, PaymentFilterValue, MemberTabValue } from './types';
import type { PathfinderClass } from '../../../../types';

type UseFilterStateReturn = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: StatusFilterValue;
  setStatusFilter: (v: StatusFilterValue) => void;
  paymentFilter: PaymentFilterValue;
  setPaymentFilter: (v: PaymentFilterValue) => void;
  classFilter: PathfinderClass[];
  setClassFilter: (v: PathfinderClass[]) => void;
  activeTab: MemberTabValue;
  setActiveTab: (v: MemberTabValue) => void;
  filterModalVisible: boolean;
  setFilterModalVisible: (v: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  applyFilters: () => void;
  onFilterSelect: (sectionId: string, value: string) => void;
  onTabChange: (tabId: string) => void;
};

export function useFilterState(): UseFilterStateReturn {
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(FILTER_STATUS.ALL);
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilterValue>(FILTER_STATUS.ALL);
  const [classFilter, setClassFilter] = useState<PathfinderClass[]>([]);
  const [activeTab, setActiveTab] = useState<MemberTabValue>(MEMBER_TAB.APPROVED);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const hasActiveFilters =
    statusFilter !== FILTER_STATUS.ALL ||
    classFilter.length > 0 ||
    paymentFilter !== FILTER_STATUS.ALL;

  const clearFilters = (): void => {
    setStatusFilter(FILTER_STATUS.ALL);
    setClassFilter([]);
    setPaymentFilter(FILTER_STATUS.ALL);
    setFilterModalVisible(false);
  };

  const applyFilters = (): void => {
    setFilterModalVisible(false);
  };

  const onFilterSelect = (sectionId: string, value: string): void => {
    handleFilterSelect(
      sectionId,
      value,
      classFilter,
      setStatusFilter,
      setPaymentFilter,
      setClassFilter
    );
  };

  const onTabChange = (tabId: string): void => {
    setActiveTab(tabId as MemberTabValue);
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    paymentFilter,
    setPaymentFilter,
    classFilter,
    setClassFilter,
    activeTab,
    setActiveTab,
    filterModalVisible,
    setFilterModalVisible,
    hasActiveFilters,
    clearFilters,
    applyFilters,
    onFilterSelect,
    onTabChange,
  };
}
