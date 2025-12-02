import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { designTokens } from '../shared/theme/designTokens';
import { mobileTypography, mobileFontSizes } from '../shared/theme/mobileTypography';

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
  title = 'Organizational Information',
  initialExpanded = false,
  compact = false,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const hasData = data.division || data.union || data.association || data.church;

  if (!hasData) {
    return null;
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {data.division && (
          <View style={styles.compactItem}>
            <MaterialCommunityIcons name="earth" size={14} color={designTokens.colors.textSecondary} />
            <Text style={styles.compactText} numberOfLines={1}>
              {data.division}
            </Text>
          </View>
        )}
        {data.church && (
          <View style={styles.compactItem}>
            <MaterialCommunityIcons name="church" size={14} color={designTokens.colors.textSecondary} />
            <Text style={styles.compactText} numberOfLines={1}>
              {data.church}
            </Text>
          </View>
        )}
        {data.clubName && (
          <View style={styles.compactItem}>
            <MaterialCommunityIcons name="account-group" size={14} color={designTokens.colors.textSecondary} />
            <Text style={styles.compactText} numberOfLines={1}>
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
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="sitemap" size={20} color={designTokens.colors.primary} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={designTokens.colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {data.division && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons name="earth" size={18} color={designTokens.colors.textSecondary} />
                <Text style={styles.levelLabel}>Division</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Level 1</Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.division}</Text>
            </View>
          )}

          {data.union && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons name="domain" size={18} color={designTokens.colors.textSecondary} />
                <Text style={styles.levelLabel}>Union</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Level 2</Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.union}</Text>
            </View>
          )}

          {data.association && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons name="office-building" size={18} color={designTokens.colors.textSecondary} />
                <Text style={styles.levelLabel}>Association</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Level 3</Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.association}</Text>
            </View>
          )}

          {data.church && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons name="church" size={18} color={designTokens.colors.textSecondary} />
                <Text style={styles.levelLabel}>Church</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Level 4</Text>
                </View>
              </View>
              <Text style={styles.hierarchyValue}>{data.church}</Text>
            </View>
          )}

          {data.clubName && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons name="account-group" size={18} color={designTokens.colors.textSecondary} />
                <Text style={styles.levelLabel}>Club</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Level 5</Text>
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.primary,
  },
  content: {
    padding: designTokens.spacing.lg,
    gap: 12,
  },
  hierarchyItem: {
    gap: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelLabel: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
  },
  levelBadge: {
    backgroundColor: designTokens.colors.infoLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: designTokens.borderRadius.lg,
  },
  levelBadgeText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: '600',
    color: designTokens.colors.info,
  },
  hierarchyValue: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    marginLeft: 26,
    fontWeight: '500',
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  compactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: designTokens.borderRadius.lg,
    gap: 4,
  },
  compactText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    fontWeight: '500',
    maxWidth: 120,
  },
});

