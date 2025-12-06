import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// ✅ Import Text from UI primitives
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { useAuth } from '../../context/AuthContext';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { TIMING } from '../../shared/constants/timing';
import {
  ICONS,
  NOTIFICATION_TYPE,
  TEXT_LINES,
  TOUCH_OPACITY,
  borderValues,
  dimensionValues,
  flexValues,
  shadowOffsetValues,
} from '../../shared/constants';
import { TIME_MULTIPLIER, MATH } from '../../shared/constants/http';

type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Helper functions extracted outside component
const getNotificationIcon = (
  type: NotificationType
): keyof typeof MaterialCommunityIcons.glyphMap => {
  const icons: Record<NotificationType, string> = {
    [NOTIFICATION_TYPE.ACTIVITY]: ICONS.ACCOUNT_HEART,
    [NOTIFICATION_TYPE.FEE]: ICONS.CASH,
    [NOTIFICATION_TYPE.CLUB]: ICONS.ACCOUNT_GROUP,
    [NOTIFICATION_TYPE.SYSTEM]: ICONS.BELL,
  };
  return (icons[type] || ICONS.BELL) as keyof typeof MaterialCommunityIcons.glyphMap;
};

const getNotificationColor = (type: NotificationType): string => {
  const colors: Record<NotificationType, string> = {
    [NOTIFICATION_TYPE.ACTIVITY]: designTokens.colors.primary,
    [NOTIFICATION_TYPE.FEE]: designTokens.colors.warning,
    [NOTIFICATION_TYPE.CLUB]: designTokens.colors.info,
    [NOTIFICATION_TYPE.SYSTEM]: designTokens.colors.textSecondary,
  };
  return colors[type] || designTokens.colors.textSecondary;
};

type TranslationFn = ReturnType<typeof useTranslation>['t'];

const formatTimestamp = (date: Date, t: TranslationFn): string => {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / TIMING.MS_PER.MINUTE);
  const diffHours = Math.floor(diffMs / TIMING.MS_PER.HOUR);
  const diffDays = Math.floor(diffMs / TIMING.MS_PER.DAY);
  if (diffMins < TIMING.RELATIVE_TIME.MINUTES) {
    return t('screens.notifications.timeAgo.minutes', { count: diffMins });
  }
  if (diffHours < TIMING.RELATIVE_TIME.HOURS) {
    return t('screens.notifications.timeAgo.hours', { count: diffHours });
  }
  if (diffDays < TIMING.RELATIVE_TIME.DAYS) {
    return t('screens.notifications.timeAgo.days', { count: diffDays });
  }
  return date.toLocaleDateString();
};

// Notification card component
interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
  t: TranslationFn;
}

function NotificationCard({ notification, onPress, t }: NotificationCardProps): React.JSX.Element {
  const color = getNotificationColor(notification.type);
  const cardStyles = [styles.notificationCard, !notification.read && styles.notificationCardUnread];
  return (
    <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={TOUCH_OPACITY.default}>
      {!notification.read && <View style={styles.unreadDot} />}
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons
          name={getNotificationIcon(notification.type)}
          size={mobileIconSizes.large}
          color={color}
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle} numberOfLines={TEXT_LINES.single}>
            {notification.title}
          </Text>
          <Text style={styles.notificationTime}>{formatTimestamp(notification.timestamp, t)}</Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={TEXT_LINES.double}>
          {notification.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Custom hook for notifications
interface UseNotificationsReturn {
  notifications: Notification[];
  refreshing: boolean;
  refresh: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

// Mock notifications factory
const createMockNotifications = (t: TranslationFn): Notification[] => {
  const now = Date.now();
  return [
    {
      id: '1',
      type: NOTIFICATION_TYPE.ACTIVITY,
      title: t('screens.notifications.mockTitles.newActivity'),
      message: t('screens.notifications.mockMessages.newActivity'),
      timestamp: new Date(now - TIMING.MS_PER.HOUR * TIME_MULTIPLIER.TWO),
      read: false,
    },
    {
      id: '2',
      type: NOTIFICATION_TYPE.FEE,
      title: t('screens.notifications.mockTitles.paymentDue'),
      message: t('screens.notifications.mockMessages.paymentDue'),
      timestamp: new Date(now - TIMING.MS_PER.DAY),
      read: false,
    },
    {
      id: '3',
      type: NOTIFICATION_TYPE.CLUB,
      title: t('screens.notifications.mockTitles.clubUpdate'),
      message: t('screens.notifications.mockMessages.clubUpdate'),
      timestamp: new Date(now - TIMING.MS_PER.DAY * TIME_MULTIPLIER.TWO),
      read: true,
    },
    {
      id: '4',
      type: NOTIFICATION_TYPE.SYSTEM,
      title: t('screens.notifications.mockTitles.welcome'),
      message: t('screens.notifications.mockMessages.welcome'),
      timestamp: new Date(now - TIMING.MS_PER.DAY * TIME_MULTIPLIER.THREE),
      read: true,
    },
  ];
};

function useNotifications(t: TranslationFn): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    setNotifications(createMockNotifications(t));
    setRefreshing(false);
  }, [t]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const refresh = (): void => {
    setRefreshing(true);
    loadNotifications();
  };
  const markAsRead = (id: string): void =>
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllAsRead = (): void => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, refreshing, refresh, markAsRead, markAllAsRead, unreadCount };
}

const NotificationsScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  useAuth();
  const { notifications, refreshing, refresh, markAsRead, markAllAsRead, unreadCount } =
    useNotifications(t);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('screens.notifications.title')}</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>{t('screens.notifications.markAllAsRead')}</Text>
          </TouchableOpacity>
        )}
      </View>
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <MaterialCommunityIcons
            name={ICONS.BELL_BADGE}
            size={mobileIconSizes.medium}
            color={designTokens.colors.primary}
          />
          <Text style={styles.unreadText}>
            {t('screens.notifications.unreadCount', { count: unreadCount })}
          </Text>
        </View>
      )}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} onPress={() => markAsRead(n.id)} t={t} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name={ICONS.BELL_OFF_OUTLINE}
              size={mobileIconSizes.xxlarge * MATH.HALF}
              color={designTokens.colors.borderMedium}
            />
            <Text style={styles.emptyText}>{t('screens.notifications.noNotifications')}</Text>
            <Text style={styles.emptySubtext}>{t('screens.notifications.allCaughtUp')}</Text>
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
