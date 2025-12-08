import { PathfinderClass } from '../../../../types';
import { FILTER_STATUS, PAYMENT_STATUS, ENTITY_STATUS, MEMBER_TAB } from '../../../../shared/constants';

export type StatusFilterValue =
  | typeof FILTER_STATUS.ALL
  | typeof ENTITY_STATUS.ACTIVE
  | typeof ENTITY_STATUS.INACTIVE;

export type PaymentFilterValue =
  | typeof FILTER_STATUS.ALL
  | typeof PAYMENT_STATUS.PAID
  | typeof PAYMENT_STATUS.PENDING
  | typeof PAYMENT_STATUS.OVERDUE;

export type MemberTabValue = typeof MEMBER_TAB.APPROVED | typeof MEMBER_TAB.PENDING;

export interface MembersFilterState {
  searchQuery: string;
  statusFilter: StatusFilterValue;
  paymentFilter: PaymentFilterValue;
  classFilter: PathfinderClass[];
  activeTab: MemberTabValue;
}

export interface MembersModalState {
  filterModalVisible: boolean;
  detailVisible: boolean;
  classEditModalVisible: boolean;
}
