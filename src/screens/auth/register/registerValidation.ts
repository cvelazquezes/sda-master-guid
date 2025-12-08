import { Alert } from 'react-native';
import { PathfinderClass } from '../../../types';
import { LIMITS, PHONE, PASSWORD, EMPTY_VALUE } from '../../../shared/constants';

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

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

function showError(t: TranslationFn, messageKey: string): boolean {
  Alert.alert(t('common.error'), t(messageKey));
  return false;
}

function hasRequiredFields(form: FormData): boolean {
  return Boolean(form.name && form.email && form.whatsappNumber && form.password && form.clubId);
}

function isValidWhatsapp(number: string): boolean {
  const normalized = number.replace(PHONE.NORMALIZE_PATTERN, EMPTY_VALUE);
  return PHONE.REGEX.test(normalized);
}

export function validateRegistration(form: FormData, t: TranslationFn): boolean {
  if (!hasRequiredFields(form)) {
    return showError(t, 'errors.missingClubSelection');
  }
  if (!form.isClubAdmin && form.selectedClasses.length === LIMITS.MIN_ARRAY_LENGTH) {
    return showError(t, 'errors.missingClassSelection');
  }
  if (!isValidWhatsapp(form.whatsappNumber)) {
    return showError(t, 'errors.invalidWhatsapp');
  }
  if (form.password !== form.confirmPassword) {
    return showError(t, 'errors.passwordMismatch');
  }
  if (form.password.length < PASSWORD.MIN_LENGTH) {
    return showError(t, 'errors.passwordTooShort');
  }
  return true;
}
