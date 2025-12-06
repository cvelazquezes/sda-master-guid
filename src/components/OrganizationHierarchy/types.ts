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
