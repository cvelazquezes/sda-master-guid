/**
 * ClubCard Component
 * Displays club information in a card format
 * Supports dynamic theming (light/dark mode)
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Club } from '../types';
import { mobileTypography, designTokens, layoutConstants } from '../shared/theme';
import { StatusIndicator, IconButton } from '../shared/components';
import {
  formatMatchFrequency,
  formatMembersCount,
  formatGroupSize,
  formatViewDetailsLabel,
  formatDeleteLabel,
} from '../shared/utils/formatters';
import {
  A11Y_ROLE,
  COMPONENT_NAMES,
  COMPONENT_SIZE,
  ICONS,
  STATUS,
  TEXT_LINES,
  TOUCH_OPACITY,
  flexValues,
} from '../shared/constants';

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
  const { t } = useTranslation();

  const shadowConfig = isDark ? designTokens.shadowConfig.dark : designTokens.shadowConfig.light;

  const CardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: designTokens.colors.black,
          shadowOpacity: shadowConfig.opacity,
          elevation: shadowConfig.elevation,
        },
        !club.isActive && {
          backgroundColor: colors.surfaceLight,
          opacity: designTokens.opacity.high,
        },
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.icon,
          { backgroundColor: club.isActive ? colors.primaryAlpha10 : colors.surfaceLight },
        ]}
      >
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_GROUP}
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
              { color: club.isActive ? colors.textPrimary : colors.textTertiary },
            ]}
            numberOfLines={TEXT_LINES.single}
          >
            {club.name}
          </Text>
          <StatusIndicator status={club.isActive ? STATUS.active : STATUS.inactive} showIcon />
        </View>

        <Text
          style={[
            styles.clubDescription,
            { color: club.isActive ? colors.textSecondary : colors.textTertiary },
          ]}
          numberOfLines={TEXT_LINES.single}
        >
          {club.description}
        </Text>

        {/* Organizational Hierarchy */}
        <View style={styles.hierarchyContainer}>
          {club.church && (
            <View style={styles.hierarchyItem}>
              <MaterialCommunityIcons
                name={ICONS.CHURCH}
                size={designTokens.icon.sizes.xs}
                color={club.isActive ? colors.primary : colors.textTertiary}
              />
              <Text
                style={[
                  styles.hierarchyText,
                  { color: club.isActive ? colors.textSecondary : colors.textTertiary },
                ]}
                numberOfLines={TEXT_LINES.single}
              >
                {club.church}
              </Text>
            </View>
          )}
          {club.association && (
            <View style={styles.hierarchyItem}>
              <MaterialCommunityIcons
                name={ICONS.OFFICE_BUILDING}
                size={designTokens.icon.sizes.xs}
                color={club.isActive ? colors.primary : colors.textTertiary}
              />
              <Text
                style={[
                  styles.hierarchyText,
                  { color: club.isActive ? colors.textSecondary : colors.textTertiary },
                ]}
                numberOfLines={TEXT_LINES.single}
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
              name={ICONS.CALENDAR_CLOCK}
              size={designTokens.icon.sizes.xs}
              color={club.isActive ? colors.textSecondary : colors.textTertiary}
            />
            <Text
              style={[
                styles.detailText,
                { color: club.isActive ? colors.textSecondary : colors.textTertiary },
              ]}
            >
              {formatMatchFrequency(club.matchFrequency, t)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name={ICONS.ACCOUNT_MULTIPLE}
              size={designTokens.icon.sizes.xs}
              color={club.isActive ? colors.textSecondary : colors.textTertiary}
            />
            <Text
              style={[
                styles.detailText,
                { color: club.isActive ? colors.textSecondary : colors.textTertiary },
              ]}
            >
              {formatGroupSize(club.groupSize, t)}
            </Text>
          </View>
          {club.memberCount !== undefined && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name={ICONS.ACCOUNT_GROUP}
                size={designTokens.icon.sizes.xs}
                color={club.isActive ? colors.textSecondary : colors.textTertiary}
              />
              <Text
                style={[
                  styles.detailText,
                  { color: club.isActive ? colors.textSecondary : colors.textTertiary },
                ]}
              >
                {formatMembersCount(club.memberCount, t)}
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
              icon={club.isActive ? ICONS.CANCEL : ICONS.CHECK_CIRCLE}
              onPress={onToggleStatus}
              size={COMPONENT_SIZE.md}
              color={club.isActive ? colors.error : colors.success}
              accessibilityLabel={
                club.isActive ? t('accessibility.deactivateClub') : t('accessibility.activateClub')
              }
            />
          )}
          {onDelete && (
            <IconButton
              icon={ICONS.DELETE_OUTLINE}
              onPress={onDelete}
              size={COMPONENT_SIZE.md}
              color={colors.error}
              accessibilityLabel={formatDeleteLabel(club.name, t)}
            />
          )}
        </View>
      ) : onPress ? (
        <MaterialCommunityIcons
          name={ICONS.CHEVRON_RIGHT}
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
        activeOpacity={TOUCH_OPACITY.default}
        accessible={true}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={formatViewDetailsLabel(club.name, t)}
        accessibilityHint={t('accessibility.doubleTapToOpenClubDetails')}
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

ClubCard.displayName = COMPONENT_NAMES.CLUB_CARD;

const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    shadowColor: designTokens.colors.black,
    shadowOffset: { width: 0, height: designTokens.spacing.xxs },
    shadowRadius: designTokens.shadows.md.shadowRadius,
    elevation: designTokens.shadows.md.elevation,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: designTokens.componentSizes.cardMinHeight.md,
  },
  icon: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
    flexShrink: flexValues.shrinkDisabled,
  },
  clubInfo: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
    minWidth: designTokens.spacing.none,
  },
  clubHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xs,
    gap: designTokens.spacing.sm,
  },
  clubName: {
    ...mobileTypography.bodyMediumBold,
    flex: flexValues.one,
  },
  clubDescription: {
    ...mobileTypography.bodySmall,
    marginBottom: designTokens.spacing.xs,
  },
  hierarchyContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  hierarchyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  hierarchyText: {
    ...mobileTypography.caption,
  },
  clubDetails: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.sm,
  },
  detailItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  detailText: {
    ...mobileTypography.caption,
  },
  actionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    flexShrink: flexValues.shrinkDisabled,
  },
  chevron: {
    flexShrink: flexValues.shrinkDisabled,
  },
});
