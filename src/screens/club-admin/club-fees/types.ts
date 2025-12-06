import { FEE_TABS } from '../../../shared/constants';
import { BREAKPOINT, OPACITY_VALUE, MODAL_SIZE } from '../../../shared/constants/numbers';

export type FeeTabValue = (typeof FEE_TABS)[keyof typeof FEE_TABS];

export interface FeeSettingsState {
  feeAmount: string;
  currency: string;
  selectedMonths: number[];
  feeSettingsActive: boolean;
}

export interface ChargeModalState {
  chargeDescription: string;
  chargeAmount: string;
  chargeDueDate: string;
  chargeApplyToAll: boolean;
  selectedMemberIds: string[];
}

export const MONTH_KEYS = [
  'screens.clubFees.months.january',
  'screens.clubFees.months.february',
  'screens.clubFees.months.march',
  'screens.clubFees.months.april',
  'screens.clubFees.months.may',
  'screens.clubFees.months.june',
  'screens.clubFees.months.july',
  'screens.clubFees.months.august',
  'screens.clubFees.months.september',
  'screens.clubFees.months.october',
  'screens.clubFees.months.november',
  'screens.clubFees.months.december',
] as const;

export const BREAKPOINTS = {
  DESKTOP: BREAKPOINT.MD,
  TABLET: BREAKPOINT.SM,
} as const;

export const MODAL_WIDTH_CONFIG = {
  DESKTOP_MAX: MODAL_SIZE.MEDIUM,
  DESKTOP_RATIO: OPACITY_VALUE.MEDIUM_STRONG,
  TABLET_RATIO: OPACITY_VALUE.ALMOST_FULL,
  MOBILE_RATIO: OPACITY_VALUE.NEAR_FULL,
} as const;
