import { Alert } from 'react-native';
import { paymentService } from '../../../services/paymentService';
import { User } from '../../../types';
import { MESSAGES, NUMERIC, FORMAT_REGEX, EMPTY_VALUE } from '../../../shared/constants';

interface CreateCustomChargeOptions {
  clubId: string;
  userId: string;
  members: User[];
  chargeDescription: string;
  chargeAmount: string;
  chargeDueDate: string;
  chargeApplyToAll: boolean;
  selectedMemberIds: string[];
  loadData: () => void;
  resetForm: () => void;
  closeModal: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export async function createCustomCharge(options: CreateCustomChargeOptions): Promise<void> {
  const {
    clubId,
    userId,
    members,
    chargeDescription,
    chargeAmount,
    chargeDueDate,
    chargeApplyToAll,
    selectedMemberIds,
    loadData,
    resetForm,
    closeModal,
    t,
  } = options;

  const amount = parseFloat(chargeAmount);
  if (isNaN(amount) || amount <= NUMERIC.MIN_AMOUNT) {
    Alert.alert(MESSAGES.TITLES.INVALID_AMOUNT, MESSAGES.ERRORS.INVALID_AMOUNT);
    return;
  }
  if (!chargeDescription.trim()) {
    Alert.alert(MESSAGES.TITLES.MISSING_DESCRIPTION, MESSAGES.ERRORS.MISSING_DESCRIPTION);
    return;
  }
  if (!chargeDueDate) {
    Alert.alert(MESSAGES.TITLES.MISSING_DATE, MESSAGES.ERRORS.MISSING_DATE);
    return;
  }
  if (!FORMAT_REGEX.DATE.ISO.test(chargeDueDate)) {
    Alert.alert(MESSAGES.TITLES.INVALID_DATE, MESSAGES.ERRORS.INVALID_DATE_FORMAT);
    return;
  }

  const targetUserIds = chargeApplyToAll ? members.map((m) => m.id) : selectedMemberIds;
  if (targetUserIds.length === 0) {
    Alert.alert(MESSAGES.TITLES.NO_MEMBERS_SELECTED, MESSAGES.ERRORS.NO_MEMBERS_SELECTED);
    return;
  }

  try {
    await paymentService.createCustomCharge(
      clubId,
      chargeDescription,
      amount,
      chargeDueDate,
      targetUserIds,
      userId
    );
    const memberText = chargeApplyToAll
      ? t('screens.clubFees.allMembers')
      : t('screens.clubFees.memberCount', { count: targetUserIds.length });
    Alert.alert(
      MESSAGES.TITLES.SUCCESS,
      t('screens.clubFees.chargeCreated', {
        amount: amount.toFixed(NUMERIC.DECIMAL_PLACES),
        members: memberText,
      })
    );
    closeModal();
    resetForm();
    loadData();
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_CREATE_CHARGE);
  }
}

interface ResetFormSetters {
  setChargeDescription: (v: string) => void;
  setChargeAmount: (v: string) => void;
  setChargeDueDate: (v: string) => void;
  setChargeApplyToAll: (v: boolean) => void;
  setSelectedMemberIds: (v: string[]) => void;
}

export function createResetForm(setters: ResetFormSetters): () => void {
  return (): void => {
    setters.setChargeDescription(EMPTY_VALUE);
    setters.setChargeAmount(EMPTY_VALUE);
    setters.setChargeDueDate(EMPTY_VALUE);
    setters.setChargeApplyToAll(true);
    setters.setSelectedMemberIds([]);
  };
}
