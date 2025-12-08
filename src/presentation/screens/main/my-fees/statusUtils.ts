import { MemberBalance } from '../../../../types';
import { PAYMENT_STATUS, BALANCE_STATUS, ICONS } from '../../../../shared/constants';
import { StatusConfig } from './types';

export function getStatusConfig(
  status: string,
  colors: Record<string, string>,
  t: (key: string) => string
): StatusConfig {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return {
        color: colors.success,
        bg: colors.successLight || `${colors.success}15`,
        icon: ICONS.CHECK_CIRCLE,
        label: t('screens.myFees.statusPaid'),
      };
    case PAYMENT_STATUS.OVERDUE:
      return {
        color: colors.error,
        bg: colors.errorLight || `${colors.error}15`,
        icon: ICONS.ALERT_CIRCLE,
        label: t('screens.myFees.statusOverdue'),
      };
    case PAYMENT_STATUS.PENDING:
      return {
        color: colors.warning,
        bg: colors.warningLight || `${colors.warning}15`,
        icon: ICONS.CLOCK_OUTLINE,
        label: t('screens.myFees.statusPending'),
      };
    default:
      return {
        color: colors.textSecondary,
        bg: `${colors.textSecondary}15`,
        icon: ICONS.HELP_CIRCLE,
        label: t('screens.myFees.statusUnknown'),
      };
  }
}

export function getBalanceStatus(
  balance: MemberBalance | null,
  colors: Record<string, string>
): { color: string; status: string } {
  if (!balance) {
    return { color: colors.textSecondary, status: BALANCE_STATUS.NEUTRAL };
  }
  if (balance.balance >= 0) {
    return { color: colors.success, status: BALANCE_STATUS.GOOD };
  }
  if (balance.overdueCharges > 0) {
    return { color: colors.error, status: BALANCE_STATUS.OVERDUE };
  }
  return { color: colors.warning, status: BALANCE_STATUS.PENDING };
}
