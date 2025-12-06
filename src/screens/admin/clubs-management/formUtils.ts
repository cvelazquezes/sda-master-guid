import { Club } from '../../../types';
import { HIERARCHY_FIELDS, EMPTY_VALUE } from '../../../shared/constants';
import { ClubFormData, HierarchyField } from './types';

export function getFormUniqueValues(
  clubs: Club[],
  field: HierarchyField,
  formData: ClubFormData
): string[] {
  let filteredClubs = clubs;

  if (field === HIERARCHY_FIELDS.UNION && formData.division) {
    filteredClubs = clubs.filter((club) => club.division === formData.division);
  } else if (field === HIERARCHY_FIELDS.ASSOCIATION && formData.union) {
    filteredClubs = clubs.filter((club) => {
      if (formData.division && club.division !== formData.division) {
        return false;
      }
      if (club.union !== formData.union) {
        return false;
      }
      return true;
    });
  } else if (field === HIERARCHY_FIELDS.CHURCH && formData.association) {
    filteredClubs = clubs.filter((club) => {
      if (formData.division && club.division !== formData.division) {
        return false;
      }
      if (formData.union && club.union !== formData.union) {
        return false;
      }
      if (club.association !== formData.association) {
        return false;
      }
      return true;
    });
  }

  const values = filteredClubs.map((club) => club[field]).filter(Boolean);
  return Array.from(new Set(values)).sort();
}

export function updateFormFieldWithCascade(
  formData: ClubFormData,
  field: string,
  value: string
): ClubFormData {
  const newFormData = { ...formData };

  if (field === HIERARCHY_FIELDS.DIVISION) {
    newFormData.division = value;
    newFormData.union = EMPTY_VALUE;
    newFormData.association = EMPTY_VALUE;
    newFormData.church = EMPTY_VALUE;
  } else if (field === HIERARCHY_FIELDS.UNION) {
    newFormData.union = value;
    newFormData.association = EMPTY_VALUE;
    newFormData.church = EMPTY_VALUE;
  } else if (field === HIERARCHY_FIELDS.ASSOCIATION) {
    newFormData.association = value;
    newFormData.church = EMPTY_VALUE;
  } else if (field === HIERARCHY_FIELDS.CHURCH) {
    newFormData.church = value;
  }

  return newFormData;
}
