import type { User, MemberBalance } from '../../../../types';

export type UserCardProps = {
  user: User;
  clubName?: string | null;
  balance?: MemberBalance;
  onPress?: () => void;
  showAdminActions?: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export type RoleConfig = {
  color: string;
  bg: string;
};

export type ThemeColors = {
  surface: string;
  surfaceLight: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  error: string;
  errorLight: string;
  errorAlpha20?: string;
  warning: string;
  warningLight: string;
  warningAlpha20?: string;
  info: string;
  infoLight: string;
  infoAlpha20?: string;
  success: string;
  border: string;
};
