import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Match, MatchStatus } from '../types';
import { format } from 'date-fns';
import { DesignConstants } from '../shared/theme/designConstants';
import { mobileTypography, mobileIconSizes } from '../shared/theme';
import { designTokens } from '../shared/theme/designTokens';

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
  const getStatusConfig = (status: MatchStatus) => {
    return DesignConstants.status[status] || DesignConstants.status.pending;
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
            <MaterialCommunityIcons name="close" size={mobileIconSizes.small} color={designTokens.colors.error} />
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Match Details */}
      <View style={styles.body}>
        {/* Participants */}
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="account-group" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Participants</Text>
            <Text style={styles.infoValue}>{match.participants.length} members</Text>
          </View>
        </View>

        {/* Scheduled Date */}
        {match.scheduledDate && (
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="calendar" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Scheduled</Text>
              <Text style={styles.infoValue}>
                {format(new Date(match.scheduledDate), 'MMM dd, yyyy · HH:mm')}
              </Text>
            </View>
          </View>
        )}

        {/* Created Date */}
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="clock-outline" size={mobileIconSizes.medium} color={designTokens.colors.textSecondary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {format(new Date(match.createdAt), 'MMM dd, yyyy')}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      {showActions && match.status === MatchStatus.PENDING && onSchedule && (
        <TouchableOpacity style={styles.scheduleButton} onPress={onSchedule}>
          <MaterialCommunityIcons name="calendar-plus" size={mobileIconSizes.medium} color={designTokens.colors.textInverse} />
          <Text style={styles.scheduleButtonText}>Schedule Meetup</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress && !showActions) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="View activity details"
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

MatchCard.displayName = 'MatchCard';

const styles = StyleSheet.create({
  card: {
    ...DesignConstants.card,
    ...DesignConstants.card.shadow,
    backgroundColor: DesignConstants.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignConstants.spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: designTokens.borderRadius.xl,
    gap: 6,
  },
  statusText: {
    ...mobileTypography.labelBold,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.errorLight,
    gap: 6,
  },
  skipButtonText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.error,
  },
  body: {
    gap: DesignConstants.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignConstants.spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: designTokens.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    ...mobileTypography.caption,
    color: DesignConstants.colors.text.tertiary,
    marginBottom: 2,
  },
  infoValue: {
    ...mobileTypography.bodyMediumBold,
    color: DesignConstants.colors.text.primary,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignConstants.colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: DesignConstants.spacing.md,
    gap: 8,
  },
  scheduleButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textInverse,
  },
});

