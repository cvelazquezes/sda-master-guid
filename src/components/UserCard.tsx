import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { User, UserRole } from '../types';

interface UserCardProps {
  user: User;
  onPress?: () => void;
  showAdminActions?: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

const UserCardComponent: React.FC<UserCardProps> = ({
  user,
  onPress,
  showAdminActions = false,
  onToggleStatus,
  onDelete,
}) => {
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return styles.roleBadgeAdmin;
      case 'club_admin':
        return styles.roleBadgeClubAdmin;
      default:
        return styles.roleBadgeUser;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '#f44336';
      case 'club_admin':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  };

  const CardContent = (
    <View style={[styles.card, !user.isActive && styles.cardInactive]}>
      <View style={styles.cardContent}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: user.isActive ? getRoleColor(user.role) : '#f5f5f5' }]}>
          <Text style={[styles.avatarText, !user.isActive && styles.avatarTextInactive]}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={[styles.userName, !user.isActive && styles.textInactive]} numberOfLines={1}>
              {user.name}
            </Text>
            <View style={[styles.roleBadge, user.isActive ? getRoleBadgeStyle(user.role) : styles.roleBadgeInactive]}>
              <Text style={[styles.roleText, !user.isActive && styles.roleTextInactive]}>
                {user.role === 'club_admin' ? 'CLUB ADMIN' : user.role.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[styles.userEmail, !user.isActive && styles.textInactive]} numberOfLines={1}>
            {user.email}
          </Text>

          {/* WhatsApp */}
          {user.whatsappNumber && (
            <View style={styles.whatsappContainer}>
              <MaterialCommunityIcons 
                name="whatsapp" 
                size={14} 
                color={user.isActive ? '#25D366' : '#999'} 
              />
              <Text style={[styles.whatsappText, !user.isActive && styles.textInactive]} numberOfLines={1}>
                {user.whatsappNumber}
              </Text>
            </View>
          )}

          {/* Status */}
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <MaterialCommunityIcons
                name={user.isActive ? 'check-circle' : 'cancel'}
                size={14}
                color={user.isActive ? '#4caf50' : '#f44336'}
              />
              <Text style={styles.statusText}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
            {user.isPaused && (
              <View style={styles.statusBadge}>
                <MaterialCommunityIcons name="pause-circle" size={14} color="#ff9800" />
                <Text style={styles.statusText}>Paused</Text>
              </View>
            )}
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
                  user.isActive ? styles.pauseButton : styles.resumeButton
                ]}
                onPress={onToggleStatus}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={user.isActive ? 'Pause user' : 'Resume user'}
                accessibilityHint={`Double tap to ${user.isActive ? 'pause' : 'resume'} ${user.name}`}
              >
                <MaterialCommunityIcons
                  name={user.isActive ? 'pause-circle' : 'play-circle'}
                  size={24}
                  color={user.isActive ? '#f57c00' : '#4caf50'}
                />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.iconButton, styles.deleteButton]}
                onPress={onDelete}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${user.name}`}
                accessibilityHint="Double tap to delete this user"
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
        accessibilityLabel={`View details for ${user.name}`}
        accessibilityHint="Double tap to open user details"
        accessibilityState={{ disabled: !user.isActive }}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

// Memoize component with custom comparison for performance
export const UserCard = memo(UserCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.user.isActive === nextProps.user.isActive &&
    prevProps.user.isPaused === nextProps.user.isPaused &&
    prevProps.user.role === nextProps.user.role &&
    prevProps.showAdminActions === nextProps.showAdminActions
  );
});

UserCard.displayName = 'UserCard';

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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarTextInactive: {
    color: '#999',
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  textInactive: {
    color: '#999',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeAdmin: {
    backgroundColor: '#ffebee',
  },
  roleBadgeClubAdmin: {
    backgroundColor: '#fff3e0',
  },
  roleBadgeUser: {
    backgroundColor: '#e3f2fd',
  },
  roleBadgeInactive: {
    backgroundColor: '#f5f5f5',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  roleTextInactive: {
    color: '#999',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  whatsappContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  whatsappText: {
    fontSize: 12,
    color: '#25D366',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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

