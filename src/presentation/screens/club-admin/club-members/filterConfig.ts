import { PathfinderClass, PATHFINDER_CLASSES } from '../../../../types';
import { designTokens } from '../../../theme';
import {
  ICONS,
  FILTER_STATUS,
  PAYMENT_STATUS,
  ENTITY_STATUS,
  FILTER_SECTION,
} from '../../../../shared/constants';
import { type FilterSection, type Tab } from '../../../components/primitives';
import { StatusFilterValue, PaymentFilterValue } from './types';

export function createTabs(
  approvedCount: number,
  pendingCount: number,
  t: (key: string, options?: Record<string, unknown>) => string
): Tab[] {
  return [
    {
      id: 'approved',
      label: t('screens.clubMembers.approvedTab', { count: approvedCount }),
      icon: ICONS.ACCOUNT_CHECK,
    },
    {
      id: 'pending',
      label: t('screens.clubMembers.pendingTab', { count: pendingCount }),
      icon: ICONS.CLOCK_ALERT_OUTLINE,
      badge: pendingCount,
    },
  ];
}

function createStatusSection(
  statusFilter: StatusFilterValue,
  t: (key: string) => string
): FilterSection {
  return {
    id: FILTER_SECTION.STATUS,
    title: t('screens.clubMembers.memberStatus'),
    selectedValue: statusFilter,
    options: [
      {
        id: FILTER_STATUS.ALL,
        label: t('screens.clubMembers.allMembers'),
        value: FILTER_STATUS.ALL,
        icon: ICONS.ACCOUNT_GROUP,
      },
      {
        id: ENTITY_STATUS.ACTIVE,
        label: t('screens.clubMembers.activeOnly'),
        value: ENTITY_STATUS.ACTIVE,
        icon: ICONS.CHECK_CIRCLE,
        color: designTokens.colors.success,
      },
      {
        id: ENTITY_STATUS.INACTIVE,
        label: t('screens.clubMembers.inactiveOnly'),
        value: ENTITY_STATUS.INACTIVE,
        icon: ICONS.CANCEL,
        color: designTokens.colors.error,
      },
    ],
  };
}

function createPaymentSection(
  paymentFilter: PaymentFilterValue,
  t: (key: string) => string
): FilterSection {
  return {
    id: FILTER_SECTION.PAYMENT,
    title: t('screens.clubMembers.paymentStatus'),
    selectedValue: paymentFilter,
    options: [
      {
        id: FILTER_STATUS.ALL,
        label: t('screens.clubMembers.allPayments'),
        value: FILTER_STATUS.ALL,
        icon: ICONS.CASH_MULTIPLE,
      },
      {
        id: PAYMENT_STATUS.PAID,
        label: t('screens.clubMembers.paidUpFilter'),
        value: PAYMENT_STATUS.PAID,
        icon: ICONS.CHECK_CIRCLE,
        color: designTokens.colors.success,
      },
      {
        id: PAYMENT_STATUS.PENDING,
        label: t('screens.clubMembers.pendingPayments'),
        value: PAYMENT_STATUS.PENDING,
        icon: ICONS.CLOCK_ALERT_OUTLINE,
        color: designTokens.colors.warning,
      },
      {
        id: PAYMENT_STATUS.OVERDUE,
        label: t('screens.clubMembers.overduePayments'),
        value: PAYMENT_STATUS.OVERDUE,
        icon: ICONS.ALERT_CIRCLE,
        color: designTokens.colors.error,
      },
    ],
  };
}

function createClassSection(
  classFilter: PathfinderClass[],
  availableClasses: PathfinderClass[],
  t: (key: string) => string
): FilterSection | null {
  if (availableClasses.length === 0) {
    return null;
  }
  return {
    id: FILTER_SECTION.CLASS,
    title: t('screens.clubMembers.pathfinderClass'),
    selectedValue: classFilter,
    multiSelect: true,
    infoBanner: { icon: ICONS.INFORMATION, text: t('screens.clubMembers.classFilterInfo') },
    options: PATHFINDER_CLASSES.filter((c) => availableClasses.includes(c)).map((cls) => ({
      id: cls,
      label: cls,
      value: cls,
      icon: ICONS.SCHOOL_OUTLINE,
    })),
  };
}

interface CreateFilterSectionsOptions {
  statusFilter: StatusFilterValue;
  paymentFilter: PaymentFilterValue;
  classFilter: PathfinderClass[];
  availableClasses: PathfinderClass[];
  t: (key: string) => string;
}

export function createFilterSections(options: CreateFilterSectionsOptions): FilterSection[] {
  const { statusFilter, paymentFilter, classFilter, availableClasses, t } = options;
  const sections: FilterSection[] = [
    createStatusSection(statusFilter, t),
    createPaymentSection(paymentFilter, t),
  ];
  const classSection = createClassSection(classFilter, availableClasses, t);
  if (classSection) {
    sections.push(classSection);
  }
  return sections;
}

interface HandleFilterSelectOptions {
  sectionId: string;
  value: string;
  classFilter: PathfinderClass[];
  setStatusFilter: (v: StatusFilterValue) => void;
  setPaymentFilter: (v: PaymentFilterValue) => void;
  setClassFilter: (v: PathfinderClass[]) => void;
}

export function handleFilterSelect(options: HandleFilterSelectOptions): void {
  const { sectionId, value, classFilter, setStatusFilter, setPaymentFilter, setClassFilter } =
    options;
  if (sectionId === FILTER_SECTION.STATUS) {
    setStatusFilter(value as StatusFilterValue);
  } else if (sectionId === FILTER_SECTION.PAYMENT) {
    setPaymentFilter(value as PaymentFilterValue);
  } else if (sectionId === FILTER_SECTION.CLASS) {
    if (classFilter.includes(value as PathfinderClass)) {
      setClassFilter(classFilter.filter((c) => c !== value));
    } else {
      setClassFilter([...classFilter, value as PathfinderClass]);
    }
  }
}
