/**
 * ClubCard Component
 * Displays club information in a card format
 * Supports dynamic theming (light/dark mode)
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Club } from '../types';
import { mobileTypography } from '../shared/theme';
import { designTokens } from '../shared/theme/designTokens';
import { StatusIndicator, IconButton } from '../shared/components';

interface ClubCardProps {
  club: Club;
  onPress?: () => void;
  showAdminActions?: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

const ClubCardComponent: React.FC<ClubCardProps> = ({
  club,
  onPress,
  showAdminActions = false,
  onToggleStatus,
  onDelete,
}) => {
  const { colors, isDark } = useTheme();

  const CardContent = (
    <View style={[
      styles.card,
      { 
        backgroundColor: colors.surface,
        shadowColor: '#000',
        shadowOpacity: isDark ? 0.4 : 0.2,
        elevation: isDark ? 8 : 5,
      },
      !club.isActive && { backgroundColor: colors.surfaceLight, opacity: 0.8 }
    ]}>
      {/* Icon */}
      <View style={[
        styles.icon,
        { backgroundColor: club.isActive ? colors.primaryAlpha10 : colors.surfaceLight }
      ]}>
        <MaterialCommunityIcons
          name="account-group"
          size={designTokens.icon.sizes.lg}
          color={club.isActive ? colors.primary : colors.textTertiary}
        />
      </View>

      {/* Club Info */}
      <View style={styles.clubInfo}>
        <View style={styles.clubHeader}>
          <Text 
            style={[
              styles.clubName, 
              { color: club.isActive ? colors.textPrimary : colors.textTertiary }
            ]} 
            numberOfLines={1}
          >
            {club.name}
          </Text>
          <StatusIndicator
            status={club.isActive ? 'active' : 'inactive'}
            showIcon
          />
        </View>

        <Text 
          style={[
            styles.clubDescription, 
            { color: club.isActive ? colors.textSecondary : colors.textTertiary }
          ]} 
          numberOfLines={1}
        >
          {club.description}
        </Text>

        {/* Organizational Hierarchy */}
        <View style={styles.hierarchyContainer}>
          {club.church && (
            <View style={styles.hierarchyItem}>
              <MaterialCommunityIcons
                name="church"
                size={designTokens.icon.sizes.xs}
                color={club.isActive ? colors.primary : colors.textTertiary}
              />
              <Text 
                style={[
                  styles.hierarchyText, 
                  { color: club.isActive ? colors.textSecondary : colors.textTertiary }
                ]} 
                numberOfLines={1}
              >
                {club.church}
              </Text>
            </View>
          )}
          {club.association && (
            <View style={styles.hierarchyItem}>
              <MaterialCommunityIcons
                name="office-building"
                size={designTokens.icon.sizes.xs}
                color={club.isActive ? colors.primary : colors.textTertiary}
              />
              <Text 
                style={[
                  styles.hierarchyText, 
                  { color: club.isActive ? colors.textSecondary : colors.textTertiary }
                ]} 
                numberOfLines={1}
              >
                {club.association}
              </Text>
            </View>
          )}
        </View>

        {/* Club Details */}
        <View style={styles.clubDetails}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={designTokens.icon.sizes.xs}
              color={club.isActive ? colors.textSecondary : colors.textTertiary}
            />
            <Text style={[styles.detailText, { color: club.isActive ? colors.textSecondary : colors.textTertiary }]}>
              {club.matchFrequency.replace('_', '-')}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={designTokens.icon.sizes.xs}
              color={club.isActive ? colors.textSecondary : colors.textTertiary}
            />
            <Text style={[styles.detailText, { color: club.isActive ? colors.textSecondary : colors.textTertiary }]}>
              {club.groupSize}/group
            </Text>
          </View>
          {club.memberCount !== undefined && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="account-group"
                size={designTokens.icon.sizes.xs}
                color={club.isActive ? colors.textSecondary : colors.textTertiary}
              />
              <Text style={[styles.detailText, { color: club.isActive ? colors.textSecondary : colors.textTertiary }]}>
                {club.memberCount} members
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      {showAdminActions && (onToggleStatus || onDelete) ? (
        <View style={styles.actionsContainer}>
          {onToggleStatus && (
            <IconButton
              icon={club.isActive ? 'cancel' : 'check-circle'}
              onPress={onToggleStatus}
              size="md"
              color={club.isActive ? colors.error : colors.success}
              accessibilityLabel={club.isActive ? 'Deactivate club' : 'Activate club'}
            />
          )}
          {onDelete && (
            <IconButton
              icon="delete-outline"
              onPress={onDelete}
              size="md"
              color={colors.error}
              accessibilityLabel={`Delete ${club.name}`}
            />
          )}
        </View>
      ) : onPress ? (
        <MaterialCommunityIcons
          name="chevron-right"
          size={designTokens.icon.sizes.lg}
          color={colors.textTertiary}
          style={styles.chevron}
        />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${club.name}`}
        accessibilityHint="Double tap to open club details"
        accessibilityState={{ disabled: !club.isActive }}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

// Memoize component with custom comparison for performance
export const ClubCard = memo(ClubCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.club.id === nextProps.club.id &&
    prevProps.club.name === nextProps.club.name &&
    prevProps.club.description === nextProps.club.description &&
    prevProps.club.isActive === nextProps.club.isActive &&
    prevProps.club.memberCount === nextProps.club.memberCount &&
    prevProps.club.division === nextProps.club.division &&
    prevProps.club.union === nextProps.club.union &&
    prevProps.club.association === nextProps.club.association &&
    prevProps.club.church === nextProps.club.church &&
    prevProps.showAdminActions === nextProps.showAdminActions
  );
});

ClubCard.displayName = 'ClubCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    minHeight: 80,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.md,
    flexShrink: 0,
  },
  clubInfo: {
    flex: 1,
    marginRight: designTokens.spacing.md,
    minWidth: 0,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: designTokens.spacing.sm,
  },
  clubName: {
    ...mobileTypography.bodyMediumBold,
    flex: 1,
  },
  clubDescription: {
    ...mobileTypography.bodySmall,
    marginBottom: 4,
  },
  hierarchyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designTokens.spacing.sm,
    marginBottom: 4,
  },
  hierarchyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hierarchyText: {
    ...mobileTypography.caption,
  },
  clubDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designTokens.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...mobileTypography.caption,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  chevron: {
    flexShrink: 0,
  },
});
