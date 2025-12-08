import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { useTheme } from '../../contexts/ThemeContext';
import { ICONS, TOUCH_OPACITY } from '../../shared/constants';
import { OrganizationHierarchyProps } from './types';
import { CompactView } from './CompactView';
import { ExpandedView } from './ExpandedView';
import { styles } from './styles';

export const OrganizationHierarchy: React.FC<OrganizationHierarchyProps> = ({
  data,
  title,
  initialExpanded = false,
  compact = false,
}) => {
  const { t } = useTranslation();
  const { colors, iconSizes } = useTheme();
  const [expanded, setExpanded] = useState(initialExpanded);
  const displayTitle = title ?? t('components.organizationHierarchy.defaultTitle');

  const hasData = data.division || data.union || data.association || data.church;

  if (!hasData) {
    return null;
  }

  if (compact) {
    return <CompactView data={data} colors={colors} />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <TouchableOpacity
        style={[styles.header, { backgroundColor: colors.surfaceLight }]}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={TOUCH_OPACITY.default}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name={ICONS.SITEMAP} size={iconSizes.md} color={colors.primary} />
          <Text style={[styles.title, { color: colors.primary }]}>{displayTitle}</Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN}
          size={iconSizes.lg}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      {expanded && <ExpandedView data={data} colors={colors} />}
    </View>
  );
};

export type { HierarchyData, OrganizationHierarchyProps } from './types';
