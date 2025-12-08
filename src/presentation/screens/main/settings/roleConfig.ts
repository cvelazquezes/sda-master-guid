import { UserRole } from '../../../../types';
import { ICONS } from '../../../../shared/constants';

interface RoleConfig {
  label: string;
  color: string;
  bg: string;
  icon: string;
}

interface RoleColors {
  error: string;
  warning: string;
  info: string;
  errorLight?: string;
  warningLight?: string;
  infoLight?: string;
}

export function getRoleConfig(
  role: UserRole | undefined,
  colors: RoleColors,
  t: (key: string) => string
): RoleConfig {
  switch (role) {
    case UserRole.ADMIN:
      return {
        label: t('roles.administrator'),
        color: colors.error,
        bg: colors.errorLight || `${colors.error}15`,
        icon: ICONS.SHIELD_CROWN,
      };
    case UserRole.CLUB_ADMIN:
      return {
        label: t('roles.clubAdmin'),
        color: colors.warning,
        bg: colors.warningLight || `${colors.warning}15`,
        icon: ICONS.ACCOUNT_STAR,
      };
    default:
      return {
        label: t('roles.member'),
        color: colors.info,
        bg: colors.infoLight || `${colors.info}15`,
        icon: ICONS.ACCOUNT,
      };
  }
}
