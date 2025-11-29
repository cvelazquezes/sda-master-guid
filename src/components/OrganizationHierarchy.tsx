import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
            <MaterialCommunityIcons name="earth" size={14} color="#666" />
            <Text style={styles.compactText} numberOfLines={1}>
              {data.division}
            </Text>
          </View>
        )}
        {data.church && (
          <View style={styles.compactItem}>
            <MaterialCommunityIcons name="church" size={14} color="#666" />
            <Text style={styles.compactText} numberOfLines={1}>
              {data.church}
            </Text>
          </View>
        )}
        {data.clubName && (
          <View style={styles.compactItem}>
            <MaterialCommunityIcons name="account-group" size={14} color="#666" />
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
          <MaterialCommunityIcons name="sitemap" size={20} color="#6200ee" />
          <Text style={styles.title}>{title}</Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {data.division && (
            <View style={styles.hierarchyItem}>
              <View style={styles.levelContainer}>
                <MaterialCommunityIcons name="earth" size={18} color="#666" />
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
                <MaterialCommunityIcons name="domain" size={18} color="#666" />
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
                <MaterialCommunityIcons name="office-building" size={18} color="#666" />
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
                <MaterialCommunityIcons name="church" size={18} color="#666" />
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
                <MaterialCommunityIcons name="account-group" size={18} color="#666" />
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
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6200ee',
  },
  content: {
    padding: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  levelBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1976d2',
  },
  hierarchyValue: {
    fontSize: 15,
    color: '#555',
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
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  compactText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    maxWidth: 120,
  },
});

