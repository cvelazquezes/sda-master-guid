import { Club } from '../../../../types';

export interface ClubCardProps {
  club: Club;
  onPress?: () => void;
  showAdminActions?: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

export interface ClubIconProps {
  isActive: boolean;
  primaryColor: string;
  inactiveColor: string;
  activeBackground: string;
  inactiveBackground: string;
}

export interface ClubInfoProps {
  club: Club;
  textPrimaryColor: string;
  textSecondaryColor: string;
  textTertiaryColor: string;
  primaryColor: string;
}

export interface ClubActionsProps {
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
}
