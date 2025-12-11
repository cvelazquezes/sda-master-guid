import { FILTER_STATUS, EMPTY_VALUE } from '../../../../shared/constants';

export type UserFilters = {
  division: string;
  union: string;
  association: string;
  church: string;
  clubId: string;
  role: string;
  status: string;
};

export const initialFilters: UserFilters = {
  division: EMPTY_VALUE,
  union: EMPTY_VALUE,
  association: EMPTY_VALUE,
  church: EMPTY_VALUE,
  clubId: EMPTY_VALUE,
  role: FILTER_STATUS.ALL,
  status: FILTER_STATUS.ALL,
};
