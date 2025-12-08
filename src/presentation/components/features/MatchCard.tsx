import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Text } from '../primitives';
import { Match, MatchStatus } from '../../../types';
import { useTheme } from '../../state/ThemeContext';
import { mobileTypography, mobileIconSizes, designTokens, layoutConstants } from '../../theme';
import { formatMembersCount } from '../../../shared/utils/formatters';
import {
  A11Y_ROLE,
  COMPONENT_NAMES,
  DATE_FORMATS,
  ICONS,
  TOUCH_OPACITY,
  FLEX,
  SHADOW_COLOR,
} from '../../../shared/constants';

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
  const { colors, isDark } = useTheme();

  const getStatusConfig = (status: MatchStatus): { light: string; text: string; icon?: string } => {
    const baseConfig = designTokens.status[status] || designTokens.status.pending;
    return {
      ...baseConfig,
      light: baseConfig.light,
      text: baseConfig.text,
    };
  };

  const statusConfig = getStatusConfig(match.status);
  const shadowConfig = isDark ? designTokens.shadowConfig.dark : designTokens.shadowConfig.light;

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.surface,
      shadowColor: colors.shadow || SHADOW_COLOR.DEFAULT,
      shadowOpacity: shadowConfig.opacity,
      elevation: shadowConfig.elevation,
    },
  ];

  const CardContent = (
    <View style={cardStyle}>
      {/* Header with Status */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.light }]}>
          <MaterialCommunityIcons
            name={statusConfig.icon as typeof ICONS.CHECK}
            size={mobileIconSizes.small}
            color={statusConfig.text}
          />
          <Text style={[styles.statusText, { color: statusConfig.text }]}>
            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
          </Text>
        </View>

        {/* Skip button for pending matches */}
        {showActions && match.status === MatchStatus.PENDING && onSkip && (
          <TouchableOpacity
            style={[styles.skipButton, { backgroundColor: colors.errorAlpha20 }]}
            onPress={onSkip}
          >
            <MaterialCommunityIcons
              name={ICONS.CLOSE}
              size={mobileIconSizes.small}
              color={colors.error}
            />
            <Text style={[styles.skipButtonText, { color: colors.error }]}>
              {t('components.matchCard.skip')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Match Details */}
      <View style={styles.body}>
        {/* Participants */}
        <View style={styles.infoRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryAlpha20 }]}>
            <MaterialCommunityIcons
              name={ICONS.ACCOUNT_GROUP}
              size={mobileIconSizes.medium}
              color={colors.primary}
            />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>
              {t('components.matchCard.participants')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {formatMembersCount(match.participants.length, t)}
            </Text>
          </View>
        </View>

        {/* Scheduled Date */}
        {match.scheduledDate && (
          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primaryAlpha20 }]}>
              <MaterialCommunityIcons
                name={ICONS.CALENDAR}
                size={mobileIconSizes.medium}
                color={colors.primary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>
                {t('components.matchCard.scheduled')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {format(new Date(match.scheduledDate), DATE_FORMATS.DATE_FNS_DATETIME_DISPLAY)}
              </Text>
            </View>
          </View>
        )}

        {/* Created Date */}
        <View style={styles.infoRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.surfaceLight }]}>
            <MaterialCommunityIcons
              name={ICONS.CLOCK_OUTLINE}
              size={mobileIconSizes.medium}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>
              {t('components.matchCard.created')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {format(new Date(match.createdAt), DATE_FORMATS.DATE_FNS_DATE_DISPLAY)}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      {showActions && match.status === MatchStatus.PENDING && onSchedule && (
        <TouchableOpacity
          style={[styles.scheduleButton, { backgroundColor: colors.primary }]}
          onPress={onSchedule}
        >
          <MaterialCommunityIcons
            name={ICONS.CALENDAR_PLUS}
            size={mobileIconSizes.medium}
            color={colors.textInverse}
          />
          <Text style={[styles.scheduleButtonText, { color: colors.textInverse }]}>
            {t('components.matchCard.scheduleMeetup')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress && !showActions) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={TOUCH_OPACITY.default}
        accessible
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
    shadowOffset: { width: 0, height: designTokens.spacing.xxs },
    shadowRadius: designTokens.shadows.lg.shadowRadius,
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
    gap: designTokens.spacing.sm,
  },
  skipButtonText: {
    ...mobileTypography.labelBold,
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
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  infoTextContainer: {
    flex: FLEX.ONE,
  },
  infoLabel: {
    ...mobileTypography.caption,
    marginBottom: designTokens.spacing.xxs,
  },
  infoValue: {
    ...mobileTypography.bodyMediumBold,
  },
  scheduleButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    marginTop: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  scheduleButtonText: {
    ...mobileTypography.button,
  },
});
