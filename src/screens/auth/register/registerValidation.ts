import { Alert } from 'react-native';
import { PathfinderClass } from '../../../types';
import { LIMITS, MESSAGES, VALIDATION, EMPTY_VALUE } from '../../../shared/constants';

interface FormData {
  name: string;
  email: string;
  whatsappNumber: string;
  password: string;
  confirmPassword: string;
  isClubAdmin: boolean;
  selectedClasses: PathfinderClass[];
  clubId: string;
}

function showError(message: string): boolean {
  Alert.alert(MESSAGES.TITLES.ERROR, message);
  return false;
}

function hasRequiredFields(form: FormData): boolean {
  return Boolean(form.name && form.email && form.whatsappNumber && form.password && form.clubId);
}

function isValidWhatsapp(number: string): boolean {
  const normalized = number.replace(VALIDATION.WHATSAPP.NORMALIZE_PATTERN, EMPTY_VALUE);
  return VALIDATION.WHATSAPP.REGEX.test(normalized);
}

export function validateRegistration(form: FormData): boolean {
  if (!hasRequiredFields(form)) {
    return showError(MESSAGES.ERRORS.MISSING_CLUB_SELECTION);
  }
  if (!form.isClubAdmin && form.selectedClasses.length === LIMITS.MIN_ARRAY_LENGTH) {
    return showError(MESSAGES.ERRORS.MISSING_CLASS_SELECTION);
  }
  if (!isValidWhatsapp(form.whatsappNumber)) {
    return showError(MESSAGES.ERRORS.INVALID_WHATSAPP);
  }
  if (form.password !== form.confirmPassword) {
    return showError(MESSAGES.ERRORS.PASSWORD_MISMATCH);
  }
  if (form.password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
    return showError(MESSAGES.ERRORS.PASSWORD_TOO_SHORT);
  }
  return true;
}
