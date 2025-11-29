import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Club } from '../types';

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
  const CardContent = (
    <View style={[styles.card, !club.isActive && styles.cardInactive]}>
      <View style={styles.cardContent}>
        {/* Icon */}
        <View style={[styles.icon, { backgroundColor: club.isActive ? '#f0e6ff' : '#f5f5f5' }]}>
          <MaterialCommunityIcons
            name="account-group"
            size={28}
            color={club.isActive ? '#6200ee' : '#999'}
          />
        </View>

        {/* Club Info */}
        <View style={styles.clubInfo}>
          <Text style={[styles.clubName, !club.isActive && styles.textInactive]} numberOfLines={1}>
            {club.name}
          </Text>
          <Text style={[styles.clubDescription, !club.isActive && styles.textInactive]} numberOfLines={2}>
            {club.description}
          </Text>

          {/* Club Details */}
          <View style={styles.clubDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name="calendar-clock" 
                size={14} 
                color={club.isActive ? '#666' : '#999'} 
              />
              <Text style={[styles.detailText, !club.isActive && styles.textInactive]}>
                {club.matchFrequency.replace('_', '-')}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name="account-multiple" 
                size={14} 
                color={club.isActive ? '#666' : '#999'} 
              />
              <Text style={[styles.detailText, !club.isActive && styles.textInactive]}>
                {club.groupSize} per group
              </Text>
            </View>
            {club.memberCount !== undefined && (
              <View style={styles.detailItem}>
                <MaterialCommunityIcons 
                  name="account-group" 
                  size={14} 
                  color={club.isActive ? '#666' : '#999'} 
                />
                <Text style={[styles.detailText, !club.isActive && styles.textInactive]}>
                  {club.memberCount} members
                </Text>
              </View>
            )}
          </View>

          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, club.isActive && styles.statusBadgeActive]}>
              <MaterialCommunityIcons
                name={club.isActive ? 'check-circle' : 'cancel'}
                size={14}
                color={club.isActive ? '#4caf50' : '#f44336'}
              />
              <Text style={styles.statusText}>
                {club.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Chevron for views with tap-to-details */}
        {onPress && (
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        )}
      </View>

      {/* Admin Actions Footer - Only visible when showAdminActions is true */}
      {showAdminActions && (onToggleStatus || onDelete) && (
        <View style={styles.actionsFooter}>
          <View style={styles.actionsDivider} />
          <View style={styles.actionsRow}>
            {onToggleStatus && (
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  club.isActive ? styles.pauseButton : styles.resumeButton
                ]}
                onPress={onToggleStatus}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={club.isActive ? 'Deactivate club' : 'Activate club'}
                accessibilityHint={`Double tap to ${club.isActive ? 'deactivate' : 'activate'} ${club.name}`}
              >
                <MaterialCommunityIcons
                  name={club.isActive ? 'pause-circle' : 'play-circle'}
                  size={24}
                  color={club.isActive ? '#f57c00' : '#4caf50'}
                />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.iconButton, styles.deleteButton]}
                onPress={onDelete}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${club.name}`}
                accessibilityHint="Double tap to delete this club"
              >
                <MaterialCommunityIcons name="delete" size={24} color="#f44336" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
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
    prevProps.showAdminActions === nextProps.showAdminActions
  );
});

ClubCard.displayName = 'ClubCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardInactive: {
    backgroundColor: '#fafafa',
    opacity: 0.7,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clubInfo: {
    flex: 1,
    marginRight: 8,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  clubDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  textInactive: {
    color: '#999',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusBadgeActive: {
    // Additional styling for active clubs if needed
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  actionsFooter: {
    backgroundColor: '#fafafa',
  },
  actionsDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    backgroundColor: '#fff3e0',
  },
  resumeButton: {
    backgroundColor: '#e8f5e9',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
});

