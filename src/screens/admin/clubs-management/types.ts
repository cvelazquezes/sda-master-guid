import { MatchFrequency } from '../../../types';
import {
  FILTER_STATUS,
  EMPTY_VALUE,
  CLUB_SETTINGS,
  HIERARCHY_FIELDS,
} from '../../../shared/constants';

export interface ClubFilters {
  division: string;
  union: string;
  association: string;
  church: string;
  clubId: string;
  status: (typeof FILTER_STATUS)[keyof typeof FILTER_STATUS];
}

export interface ClubFormData {
  name: string;
  description: string;
  matchFrequency: MatchFrequency;
  groupSize: number;
  church: string;
  association: string;
  union: string;
  division: string;
}

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
  groupSize: CLUB_SETTINGS.defaultGroupSize,
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
