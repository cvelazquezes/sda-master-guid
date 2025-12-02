import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { mobileTypography, mobileIconSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';

interface Notification {
  id: string;
  type: 'activity' | 'fee' | 'club' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationsScreen = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    // Mock notifications - replace with actual API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'activity',
        title: 'New Social Activity',
        message: 'You have a new social activity scheduled for next week',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      },
      {
        id: '2',
        type: 'fee',
        title: 'Payment Due',
        message: 'Your monthly fee of $50.00 is due on December 15',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: false,
      },
      {
        id: '3',
        type: 'club',
        title: 'Club Update',
        message: 'Your club administrator has shared an important update',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
      },
      {
        id: '4',
        type: 'system',
        title: 'Welcome!',
        message: 'Welcome to SDA Master Guid. Start connecting with fellow members.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'activity':
        return 'account-heart';
      case 'fee':
        return 'cash';
      case 'club':
        return 'account-group';
      case 'system':
        return 'bell';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'activity':
        return designTokens.colors.primary;
      case 'fee':
        return designTokens.colors.warning;
      case 'club':
        return designTokens.colors.info;
      case 'system':
        return designTokens.colors.textSecondary;
      default:
        return designTokens.colors.textSecondary;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread Count Banner */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <MaterialCommunityIcons name="bell-badge" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
          <Text style={styles.unreadText}>
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.notificationCardUnread,
              ]}
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.7}
            >
              {/* Unread indicator dot */}
              {!notification.read && <View style={styles.unreadDot} />}

              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${getNotificationColor(notification.type)}15` },
                ]}
              >
                <MaterialCommunityIcons
                  name={getNotificationIcon(notification.type)}
                  size={mobileIconSizes.large}
                  color={getNotificationColor(notification.type)}
                />
              </View>

              {/* Content */}
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle} numberOfLines={1}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={mobileIconSizes.xxlarge * 2}
              color={designTokens.colors.borderMedium}
            />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerTitle: {
    ...mobileTypography.heading1,
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markAllText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.primary,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  unreadText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: designTokens.borderRadius.lg,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  notificationCardUnread: {
    backgroundColor: designTokens.colors.infoLight,
    borderLeftWidth: 3,
    borderLeftColor: designTokens.colors.primary,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: designTokens.borderRadius.xs,
    backgroundColor: designTokens.colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  notificationTitle: {
    ...mobileTypography.bodyMediumBold,
    flex: 1,
  },
  notificationTime: {
    ...mobileTypography.caption,
    color: designTokens.colors.textTertiary,
  },
  notificationMessage: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default NotificationsScreen;

