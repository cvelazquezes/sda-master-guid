import { OrganizationType, EMPTY_VALUE } from '../../../../shared/constants';

export interface OrganizationItem {
  id: string;
  name: string;
  type: OrganizationType;
  parent?: string;
  clubCount: number;
}

export interface OrgFormData {
  name: string;
  parentDivision: string;
  parentUnion: string;
  parentAssociation: string;
}

export const initialFormData: OrgFormData = {
  name: EMPTY_VALUE,
  parentDivision: EMPTY_VALUE,
  parentUnion: EMPTY_VALUE,
  parentAssociation: EMPTY_VALUE,
};
