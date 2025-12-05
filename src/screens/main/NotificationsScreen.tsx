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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { ICONS, TOUCH_OPACITY, TEXT_LINES, NOTIFICATION_TYPE } from '../../shared/constants';
import { flexValues, shadowOffsetValues, dimensionValues, borderValues } from '../../shared/constants/layoutConstants';
import { TIMING } from '../../shared/constants/timing';

type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationsScreen = () => {
  const { t } = useTranslation();
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
        type: NOTIFICATION_TYPE.ACTIVITY,
        title: t('screens.notifications.mockTitles.newActivity'),
        message: t('screens.notifications.mockMessages.newActivity'),
        timestamp: new Date(Date.now() - TIMING.MS_PER.HOUR * 2), // 2 hours ago
        read: false,
      },
      {
        id: '2',
        type: NOTIFICATION_TYPE.FEE,
        title: t('screens.notifications.mockTitles.paymentDue'),
        message: t('screens.notifications.mockMessages.paymentDue'),
        timestamp: new Date(Date.now() - TIMING.MS_PER.DAY), // 1 day ago
        read: false,
      },
      {
        id: '3',
        type: NOTIFICATION_TYPE.CLUB,
        title: t('screens.notifications.mockTitles.clubUpdate'),
        message: t('screens.notifications.mockMessages.clubUpdate'),
        timestamp: new Date(Date.now() - TIMING.MS_PER.DAY * 2), // 2 days ago
        read: true,
      },
      {
        id: '4',
        type: NOTIFICATION_TYPE.SYSTEM,
        title: t('screens.notifications.mockTitles.welcome'),
        message: t('screens.notifications.mockMessages.welcome'),
        timestamp: new Date(Date.now() - TIMING.MS_PER.DAY * 3), // 3 days ago
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

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NOTIFICATION_TYPE.ACTIVITY:
        return ICONS.ACCOUNT_HEART;
      case NOTIFICATION_TYPE.FEE:
        return ICONS.CASH;
      case NOTIFICATION_TYPE.CLUB:
        return ICONS.ACCOUNT_GROUP;
      case NOTIFICATION_TYPE.SYSTEM:
        return ICONS.BELL;
      default:
        return ICONS.BELL;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NOTIFICATION_TYPE.ACTIVITY:
        return designTokens.colors.primary;
      case NOTIFICATION_TYPE.FEE:
        return designTokens.colors.warning;
      case NOTIFICATION_TYPE.CLUB:
        return designTokens.colors.info;
      case NOTIFICATION_TYPE.SYSTEM:
        return designTokens.colors.textSecondary;
      default:
        return designTokens.colors.textSecondary;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / TIMING.MS_PER.MINUTE);
    const diffHours = Math.floor(diffMs / TIMING.MS_PER.HOUR);
    const diffDays = Math.floor(diffMs / TIMING.MS_PER.DAY);

    if (diffMins < TIMING.RELATIVE_TIME.MINUTES_THRESHOLD) {
      return t('screens.notifications.timeAgo.minutes', { count: diffMins });
    } else if (diffHours < TIMING.RELATIVE_TIME.HOURS_THRESHOLD) {
      return t('screens.notifications.timeAgo.hours', { count: diffHours });
    } else if (diffDays < TIMING.RELATIVE_TIME.DAYS_THRESHOLD) {
      return t('screens.notifications.timeAgo.days', { count: diffDays });
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('screens.notifications.title')}</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>{t('screens.notifications.markAllAsRead')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread Count Banner */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <MaterialCommunityIcons name={ICONS.BELL_BADGE} size={mobileIconSizes.medium} color={designTokens.colors.primary} />
          <Text style={styles.unreadText}>
            {t('screens.notifications.unreadCount', { count: unreadCount })}
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
              activeOpacity={TOUCH_OPACITY.default}
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
                  <Text style={styles.notificationTitle} numberOfLines={TEXT_LINES.single}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                </View>
                <Text style={styles.notificationMessage} numberOfLines={TEXT_LINES.double}>
                  {notification.message}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name={ICONS.BELL_OFF_OUTLINE}
              size={mobileIconSizes.xxlarge * 2}
              color={designTokens.colors.borderMedium}
            />
            <Text style={styles.emptyText}>{t('screens.notifications.noNotifications')}</Text>
            <Text style={styles.emptySubtext}>
              {t('screens.notifications.allCaughtUp')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingHorizontal: designTokens.spacing.xl,
    paddingVertical: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerTitle: {
    ...mobileTypography.heading1,
  },
  markAllButton: {
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
  },
  markAllText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.primary,
  },
  unreadBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primaryLight,
    paddingHorizontal: designTokens.spacing.xl,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.md,
  },
  unreadText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  content: {
    flex: flexValues.one,
  },
  notificationCard: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: shadowOffsetValues.md,
    shadowOpacity: designTokens.shadows.sm.shadowOpacity,
    shadowRadius: designTokens.shadows.sm.shadowRadius,
    elevation: designTokens.shadows.sm.elevation,
    position: layoutConstants.position.relative,
  },
  notificationCardUnread: {
    backgroundColor: designTokens.colors.infoLight,
    borderLeftWidth: borderValues.width.medium,
    borderLeftColor: designTokens.colors.primary,
  },
  unreadDot: {
    position: layoutConstants.position.absolute,
    top: designTokens.spacing.md,
    right: designTokens.spacing.md,
    width: dimensionValues.progressBar.standard,
    height: dimensionValues.progressBar.standard,
    borderRadius: designTokens.borderRadius.xs,
    backgroundColor: designTokens.colors.primary,
  },
  iconContainer: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  notificationContent: {
    flex: flexValues.one,
  },
  notificationHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.flexStart,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
  },
  notificationTitle: {
    ...mobileTypography.bodyMediumBold,
    flex: flexValues.one,
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
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing['7xl'],
    paddingHorizontal: designTokens.spacing['4xl'],
  },
  emptyText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.lg,
  },
  emptySubtext: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textTertiary,
    textAlign: layoutConstants.textAlign.center,
    marginTop: designTokens.spacing.sm,
  },
});

export default NotificationsScreen;

