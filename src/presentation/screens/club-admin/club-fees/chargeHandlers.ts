import { Alert } from 'react-native';
import { paymentService } from '../../../../infrastructure/repositories/paymentService';
import { User } from '../../../../types';
import { NUMERIC, FORMAT_REGEX, EMPTY_VALUE } from '../../../../shared/constants';

type TranslationFn = (key: string, opts?: Record<string, unknown>) => string;

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
  t: TranslationFn;
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
    Alert.alert(t('titles.invalidAmount'), t('errors.invalidAmount'));
    return;
  }
  if (!chargeDescription.trim()) {
    Alert.alert(t('titles.missingDescription'), t('errors.missingDescription'));
    return;
  }
  if (!chargeDueDate) {
    Alert.alert(t('titles.missingDate'), t('errors.missingDate'));
    return;
  }
  if (!FORMAT_REGEX.DATE.ISO.test(chargeDueDate)) {
    Alert.alert(t('titles.invalidDate'), t('errors.invalidDateFormat'));
    return;
  }

  const targetUserIds = chargeApplyToAll ? members.map((m) => m.id) : selectedMemberIds;
  if (targetUserIds.length === 0) {
    Alert.alert(t('titles.noMembersSelected'), t('errors.noMembersSelected'));
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
      t('common.success'),
      t('screens.clubFees.chargeCreated', {
        amount: amount.toFixed(NUMERIC.DECIMAL_PLACES),
        members: memberText,
      })
    );
    closeModal();
    resetForm();
    loadData();
  } catch {
    Alert.alert(t('common.error'), t('errors.failedToCreateCharge'));
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
