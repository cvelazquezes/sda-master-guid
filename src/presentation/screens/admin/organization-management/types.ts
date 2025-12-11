import { EMPTY_VALUE, type OrganizationType } from '../../../../shared/constants';

export type OrganizationItem = {
  id: string;
  name: string;
  type: OrganizationType;
  parent?: string;
  clubCount: number;
};

export type OrgFormData = {
  name: string;
  parentDivision: string;
  parentUnion: string;
  parentAssociation: string;
};

export const initialFormData: OrgFormData = {
  name: EMPTY_VALUE,
  parentDivision: EMPTY_VALUE,
  parentUnion: EMPTY_VALUE,
  parentAssociation: EMPTY_VALUE,
};
