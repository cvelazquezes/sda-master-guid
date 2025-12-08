export interface HierarchyData {
  division?: string;
  union?: string;
  association?: string;
  church?: string;
  clubName?: string;
}

export interface OrganizationHierarchyProps {
  data: HierarchyData;
  title?: string;
  initialExpanded?: boolean;
  compact?: boolean;
}

export interface HierarchyLevel {
  key: keyof HierarchyData;
  icon: string;
  labelKey: string;
  badgeKey: string;
}

/**
 * Theme colors interface for component styling
 * Matches the colors returned by useTheme() hook
 */
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  surface: string;
  surfaceLight: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  info: string;
  infoLight: string;
  success: string;
  error: string;
  [key: string]: string;
}
