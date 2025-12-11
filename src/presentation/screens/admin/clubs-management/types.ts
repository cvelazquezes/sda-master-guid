import {
  FILTER_STATUS,
  EMPTY_VALUE,
  CLUB,
  type HIERARCHY_FIELDS,
} from '../../../../shared/constants';
import { MatchFrequency } from '../../../../types';

export type ClubFilters = {
  division: string;
  union: string;
  association: string;
  church: string;
  clubId: string;
  status: (typeof FILTER_STATUS)[keyof typeof FILTER_STATUS];
};

export type ClubFormData = {
  name: string;
  description: string;
  matchFrequency: MatchFrequency;
  groupSize: number;
  church: string;
  association: string;
  union: string;
  division: string;
};

export const initialFilters: ClubFilters = {
  division: EMPTY_VALUE,
  union: EMPTY_VALUE,
  association: EMPTY_VALUE,
  church: EMPTY_VALUE,
  clubId: EMPTY_VALUE,
  status: FILTER_STATUS.ALL,
};

export const initialFormData: ClubFormData = {
  name: EMPTY_VALUE,
  description: EMPTY_VALUE,
  matchFrequency: MatchFrequency.WEEKLY,
  groupSize: CLUB.DEFAULT_GROUP_SIZE,
  church: EMPTY_VALUE,
  association: EMPTY_VALUE,
  union: EMPTY_VALUE,
  division: EMPTY_VALUE,
};

export type HierarchyField =
  | typeof HIERARCHY_FIELDS.DIVISION
  | typeof HIERARCHY_FIELDS.UNION
  | typeof HIERARCHY_FIELDS.ASSOCIATION
  | typeof HIERARCHY_FIELDS.CHURCH;
