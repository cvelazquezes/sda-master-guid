import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Match, MatchStatus } from '../types';
import { format } from 'date-fns';
import { mobileTypography, mobileIconSizes, designTokens, layoutConstants } from '../shared/theme';
import { A11Y_ROLE, ICONS, TOUCH_OPACITY, COMPONENT_NAMES, DATE_FORMATS } from '../shared/constants';
import { flexValues } from '../shared/constants/layoutConstants';
import { formatMembersCount } from '../shared/utils/formatters';

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
  onSkip?: () => void;
  onSchedule?: () => void;
  showActions?: boolean;
}

const MatchCardComponent: React.FC<MatchCardProps> = ({
  match,
  onPress,
  onSkip,
  onSchedule,
  showActions = false,
}) => {
  const { t } = useTranslation();

  const getStatusConfig = (status: MatchStatus) => {
    return designTokens.status[status] || designTokens.status.pending;
  };

  const statusConfig = getStatusConfig(match.status);

  const CardContent = (
    <View style={styles.card}>
      {/* Header with Status */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <MaterialCommunityIcons
            name={statusConfig.icon as any}
            size={mobileIconSizes.small}
            color={statusConfig.color}
          />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
          </Text>
        </View>

        {/* Skip button for pending matches */}
        {showActions && match.status === MatchStatus.PENDING && onSkip && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <MaterialCommunityIcons name={ICONS.CLOSE} size={mobileIconSizes.small} color={designTokens.colors.error} />
            <Text style={styles.skipButtonText}>{t('components.matchCard.skip')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Match Details */}
      <View style={styles.body}>
        {/* Participants */}
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name={ICONS.ACCOUNT_GROUP} size={mobileIconSizes.medium} color={designTokens.colors.primary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{t('components.matchCard.participants')}</Text>
            <Text style={styles.infoValue}>{formatMembersCount(match.participants.length, t)}</Text>
          </View>
        </View>

        {/* Scheduled Date */}
        {match.scheduledDate && (
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name={ICONS.CALENDAR} size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>{t('components.matchCard.scheduled')}</Text>
              <Text style={styles.infoValue}>
                {format(new Date(match.scheduledDate), DATE_FORMATS.DATE_FNS_DATETIME_DISPLAY)}
              </Text>
            </View>
          </View>
        )}

        {/* Created Date */}
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name={ICONS.CLOCK_OUTLINE} size={mobileIconSizes.medium} color={designTokens.colors.textSecondary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{t('components.matchCard.created')}</Text>
            <Text style={styles.infoValue}>
              {format(new Date(match.createdAt), DATE_FORMATS.DATE_FNS_DATE_DISPLAY)}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      {showActions && match.status === MatchStatus.PENDING && onSchedule && (
        <TouchableOpacity style={styles.scheduleButton} onPress={onSchedule}>
          <MaterialCommunityIcons name={ICONS.CALENDAR_PLUS} size={mobileIconSizes.medium} color={designTokens.colors.textInverse} />
          <Text style={styles.scheduleButtonText}>{t('components.matchCard.scheduleMeetup')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress && !showActions) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={TOUCH_OPACITY.default}
        accessible={true}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={t('accessibility.viewActivityDetails')}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

// Memoize component with custom comparison for performance
export const MatchCard = memo(MatchCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.match.id === nextProps.match.id &&
    prevProps.match.status === nextProps.match.status &&
    prevProps.match.scheduledDate === nextProps.match.scheduledDate &&
    prevProps.showActions === nextProps.showActions
  );
});

MatchCard.displayName = COMPONENT_NAMES.MATCH_CARD;

const styles = StyleSheet.create({
  card: {
    ...designTokens.card,
    ...designTokens.card.shadow,
    backgroundColor: designTokens.colors.background.primary,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.md,
  },
  statusBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    gap: designTokens.spacing.sm,
  },
  statusText: {
    ...mobileTypography.labelBold,
  },
  skipButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.errorLight,
    gap: designTokens.spacing.sm,
  },
  skipButtonText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.error,
  },
  body: {
    gap: designTokens.spacing.md,
  },
  infoRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  iconBox: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius.xl,
    backgroundColor: designTokens.colors.primaryLight,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  infoTextContainer: {
    flex: flexValues.one,
  },
  infoLabel: {
    ...mobileTypography.caption,
    color: designTokens.colors.text.tertiary,
    marginBottom: designTokens.spacing.xxs,
  },
  infoValue: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.text.primary,
  },
  scheduleButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    marginTop: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  scheduleButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textInverse,
  },
});

