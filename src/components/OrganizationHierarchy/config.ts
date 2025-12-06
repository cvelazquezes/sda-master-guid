import { ICONS } from '../../shared/constants';
import { HierarchyLevel } from './types';

export const HIERARCHY_LEVELS: HierarchyLevel[] = [
  {
    key: 'division',
    icon: ICONS.EARTH,
    labelKey: 'components.organizationHierarchy.levels.division',
    badgeKey: 'components.organizationHierarchy.levelBadges.level1',
  },
  {
    key: 'union',
    icon: ICONS.DOMAIN,
    labelKey: 'components.organizationHierarchy.levels.union',
    badgeKey: 'components.organizationHierarchy.levelBadges.level2',
  },
  {
    key: 'association',
    icon: ICONS.OFFICE_BUILDING,
    labelKey: 'components.organizationHierarchy.levels.association',
    badgeKey: 'components.organizationHierarchy.levelBadges.level3',
  },
  {
    key: 'church',
    icon: ICONS.CHURCH,
    labelKey: 'components.organizationHierarchy.levels.church',
    badgeKey: 'components.organizationHierarchy.levelBadges.level4',
  },
  {
    key: 'clubName',
    icon: ICONS.ACCOUNT_GROUP,
    labelKey: 'components.organizationHierarchy.levels.club',
    badgeKey: 'components.organizationHierarchy.levelBadges.level5',
  },
];

export const COMPACT_DISPLAY_KEYS: (keyof import('./types').HierarchyData)[] = [
  'division',
  'church',
  'clubName',
];
