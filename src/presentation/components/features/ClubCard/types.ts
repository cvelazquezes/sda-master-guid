import type { Club } from '../../../../types';

export type ClubCardProps = {
  club: Club;
  onPress?: () => void;
  showAdminActions?: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export type ClubIconProps = {
  isActive: boolean;
  primaryColor: string;
  inactiveColor: string;
  activeBackground: string;
  inactiveBackground: string;
};

export type ClubInfoProps = {
  club: Club;
  textPrimaryColor: string;
  textSecondaryColor: string;
  textTertiaryColor: string;
  primaryColor: string;
};

export type ClubActionsProps = {
  club: Club;
  showAdminActions: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
  colors: {
    error: string;
    success: string;
    textTertiary: string;
  };
};
