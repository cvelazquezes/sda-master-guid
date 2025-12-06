import { MY_FEES_TAB } from '../../../shared/constants';

export type MyFeesTabValue =
  | typeof MY_FEES_TAB.OVERVIEW
  | typeof MY_FEES_TAB.HISTORY
  | typeof MY_FEES_TAB.CHARGES;

export interface StatusConfig {
  color: string;
  bg: string;
  icon: string;
  label: string;
}
