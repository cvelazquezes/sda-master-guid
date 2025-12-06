import { UserRole, ApprovalStatus } from '../../../types';
import { ICONS } from '../../../shared/constants';

interface RoleConfig {
  label: string;
  icon: string;
  color: string;
}

export function getRoleConfig(
  role: UserRole | undefined,
  colors: { error: string; warning: string; success: string; primary: string },
  t: (key: string) => string
): RoleConfig {
  switch (role) {
    case UserRole.ADMIN:
      return {
        label: t('screens.account.platformAdministrator'),
        icon: ICONS.SHIELD_CROWN,
        color: colors.error,
      };
    case UserRole.CLUB_ADMIN:
      return {
        label: t('screens.account.clubAdministrator'),
        icon: ICONS.ACCOUNT_TIE,
        color: colors.warning,
      };
    case UserRole.USER:
      return {
        label: t('screens.account.clubMember'),
        icon: ICONS.ACCOUNT,
        color: colors.success,
      };
    default:
      return {
        label: t('roles.user'),
        icon: ICONS.ACCOUNT,
        color: colors.primary,
      };
  }
}

export function getApprovalStatusLabel(
  status: string | undefined,
  colors: { success: string; warning: string; error: string; textTertiary: string },
  t: (key: string) => string
): { label: string; color: string } {
  switch (status) {
    case ApprovalStatus.APPROVED:
      return { label: t('screens.account.statusApproved'), color: colors.success };
    case ApprovalStatus.PENDING:
      return { label: t('screens.account.statusPending'), color: colors.warning };
    case ApprovalStatus.REJECTED:
      return { label: t('screens.account.statusRejected'), color: colors.error };
    default:
      return { label: t('screens.account.statusUnknown'), color: colors.textTertiary };
  }
}
