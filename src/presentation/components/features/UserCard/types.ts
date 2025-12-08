import { User, MemberBalance } from '../../../../types';

export interface UserCardProps {
  user: User;
  clubName?: string | null;
  balance?: MemberBalance;
  onPress?: () => void;
  showAdminActions?: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

export interface RoleConfig {
  color: string;
  bg: string;
}

export interface ThemeColors {
  surface: string;
  surfaceLight: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;
  success: string;
  border: string;
}
