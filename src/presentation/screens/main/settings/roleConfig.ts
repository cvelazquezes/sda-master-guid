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
  errorAlpha20?: string;
  warningAlpha20?: string;
  infoAlpha20?: string;
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
        bg: colors.errorAlpha20 || `${colors.error}20`,
        icon: ICONS.SHIELD_CROWN,
      };
    case UserRole.CLUB_ADMIN:
      return {
        label: t('roles.clubAdmin'),
        color: colors.warning,
        bg: colors.warningAlpha20 || `${colors.warning}20`,
        icon: ICONS.ACCOUNT_STAR,
      };
    default:
      return {
        label: t('roles.member'),
        color: colors.info,
        bg: colors.infoAlpha20 || `${colors.info}20`,
        icon: ICONS.ACCOUNT,
      };
  }
}
