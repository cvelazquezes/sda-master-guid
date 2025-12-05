import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { mobileFontSizes, designTokens, layoutConstants } from '../shared/theme';
import { ICONS, TOUCH_OPACITY, TEXT_LINES, dimensionValues } from '../shared/constants';

interface HierarchyData {
  division?: string;
  union?: string;
  association?: string;
  church?: string;
  clubName?: string;
}

interface OrganizationHierarchyProps {
  data: HierarchyData;
  title?: string;
  initialExpanded?: boolean;
  compact?: boolean;
}

export const OrganizationHierarchy: React.FC<OrganizationHierarchyProps> = ({
  data,
  title,
  initialExpanded = false,
  compact = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(initialExpanded);
  const displayTitle = title ?? t('components.organizationHierarchy.defaultTitle');

  const hasData = data.division || data.union || data.association || data.church;

  if (!hasData) {
    return null;
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {data.division && (
          <View style={styles.compactItem}>
            <MaterialCommunityIcons
              name={ICONS.EARTH}
              size={designTokens.iconSize.xs}
              color={designTokens.colors.textSecondary}
            />
            <Text style={styles.compactText} numberOfLines={TEXT_LINES.single}>
              {data.division}
            </Text>
          </View>
        )}
        {data.church && (
          <View style={styles.compactItem}>
            <MaterialCommunityIcons
              name={ICONS.CHURCH}
              size={designTokens.iconSize.xs}
              color={designTokens.colors.textSecondary}
            />
            <Text style={styles.compactText} numberOfLines={TEXT_LINES.single}>
              {data.church}
            </Text>
          </View>
        )}
        {data.clubName && (
          <View style={styles.compactItem}>
            <MaterialCommunityIcons
              name={ICONS.ACCOUNT_GROUP}
              size={designTokens.iconSize.xs}
              color={designTokens.colors.textSecondary}
            />
            <Text style={styles.compactText} numberOfLines={TEXT_LINES.single}>
              {data.clubName}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={TOUCH_OPACITY.default}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name={ICONS.SITEMAP}
            size={designTokens.iconSize.md}
            color={designTokens.colors.primary}
          />
          <Text style={styles.title}>{displayTitle}</Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN}
          size={designTokens.iconSize.lg}
          color={designTokens.colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {data.division && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons
                  name={ICONS.EARTH}
                  size={designTokens.iconSize.sm}
                  color={designTokens.colors.textSecondary}
                />
                <Text style={styles.levelLabel}>
                  {t('components.organizationHierarchy.levels.division')}
                </Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>
                    {t('components.organizationHierarchy.levelBadges.level1')}
                  </Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.division}</Text>
            </View>
          )}

          {data.union && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons
                  name={ICONS.DOMAIN}
                  size={designTokens.iconSize.sm}
                  color={designTokens.colors.textSecondary}
                />
                <Text style={styles.levelLabel}>
                  {t('components.organizationHierarchy.levels.union')}
                </Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>
                    {t('components.organizationHierarchy.levelBadges.level2')}
                  </Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.union}</Text>
            </View>
          )}

          {data.association && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons
                  name={ICONS.OFFICE_BUILDING}
                  size={designTokens.iconSize.sm}
                  color={designTokens.colors.textSecondary}
                />
                <Text style={styles.levelLabel}>
                  {t('components.organizationHierarchy.levels.association')}
                </Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>
                    {t('components.organizationHierarchy.levelBadges.level3')}
                  </Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.association}</Text>
            </View>
          )}

          {data.church && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons
                  name={ICONS.CHURCH}
                  size={designTokens.iconSize.sm}
                  color={designTokens.colors.textSecondary}
                />
                <Text style={styles.levelLabel}>
                  {t('components.organizationHierarchy.levels.church')}
                </Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>
                    {t('components.organizationHierarchy.levelBadges.level4')}
                  </Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.church}</Text>
            </View>
          )}

          {data.clubName && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons
                  name={ICONS.ACCOUNT_GROUP}
                  size={designTokens.iconSize.sm}
                  color={designTokens.colors.textSecondary}
                />
                <Text style={styles.levelLabel}>
                  {t('components.organizationHierarchy.levels.club')}
                </Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>
                    {t('components.organizationHierarchy.levelBadges.level5')}
                  </Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.clubName}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.md,
    overflow: layoutConstants.overflow.hidden,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  headerLeft: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  title: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.primary,
  },
  content: {
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  hierarchyItem: {
    gap: designTokens.spacing.sm,
  },
  levelContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  levelLabel: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
  },
  levelBadge: {
    backgroundColor: designTokens.colors.infoLight,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.lg,
  },
  levelBadgeText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.info,
  },
  hierarchyValue: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    marginLeft: designTokens.spacing.xxl,
    fontWeight: designTokens.fontWeight.medium,
  },
  // Compact styles
  compactContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.sm,
    marginTop: designTokens.spacing.sm,
  },
  compactItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.borderLight,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.xs,
  },
  compactText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    fontWeight: designTokens.fontWeight.medium,
    maxWidth: dimensionValues.maxWidth.label,
  },
});
