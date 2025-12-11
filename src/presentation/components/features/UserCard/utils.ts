import { UserRole, type MemberBalance } from '../../../../types';
import type { RoleConfig, ThemeColors } from './types';
import type { TFunction } from 'i18next';

export const getRoleConfig = (role: UserRole, colors: ThemeColors): RoleConfig => {
  switch (role) {
    case UserRole.ADMIN:
      return { color: colors.error, bg: colors.errorAlpha20 || colors.errorLight };
    case UserRole.CLUB_ADMIN:
      return { color: colors.warning, bg: colors.warningAlpha20 || colors.warningLight };
    default:
      return { color: colors.info, bg: colors.infoAlpha20 || colors.infoLight };
  }
};

export const getRoleLabel = (role: UserRole, t: TFunction): string => {
  switch (role) {
    case UserRole.ADMIN:
      return t('components.userCard.roles.admin');
    case UserRole.CLUB_ADMIN:
      return t('components.userCard.roles.clubAdmin');
    default:
      return t('components.userCard.roles.user');
  }
};

export const getBalanceColor = (
  balance: MemberBalance | undefined,
  colors: ThemeColors
): string => {
  if (!balance) {
    return colors.textSecondary;
  }
  if (balance.balance >= 0) {
    return colors.success;
  }
  if (balance.overdueCharges > 0) {
    return colors.error;
  }
  return colors.warning;
};
