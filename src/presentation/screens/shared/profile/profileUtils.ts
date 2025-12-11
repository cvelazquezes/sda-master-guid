import { ICONS } from '../../../../shared/constants';
import { UserRole } from '../../../../types';
import { designTokens } from '../../../theme';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

export function getRoleLabel(role: UserRole | undefined, t: (key: string) => string): string {
  switch (role) {
    case UserRole.ADMIN:
      return t('roles.administrator');
    case UserRole.CLUB_ADMIN:
      return t('roles.clubAdmin');
    case UserRole.USER:
      return t('roles.member');
    default:
      return t('roles.user');
  }
}

export function getRoleIcon(
  role: UserRole | undefined
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (role) {
    case UserRole.ADMIN:
      return ICONS.SHIELD_CROWN;
    case UserRole.CLUB_ADMIN:
      return ICONS.ACCOUNT_TIE;
    case UserRole.USER:
      return ICONS.ACCOUNT;
    default:
      return ICONS.ACCOUNT;
  }
}

export function getRoleColor(role: UserRole | undefined, fallback: string): string {
  switch (role) {
    case UserRole.ADMIN:
      return designTokens.colors.primary[600];
    case UserRole.CLUB_ADMIN:
      return designTokens.colors.primary[500];
    case UserRole.USER:
      return designTokens.colors.primary[400];
    default:
      return fallback;
  }
}
