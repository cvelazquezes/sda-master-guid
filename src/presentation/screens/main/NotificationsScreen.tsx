import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  ICONS,
  NOTIFICATION_TYPE,
  TEXT_LINES,
  TOUCH_OPACITY,
  BORDERS,
  DIMENSIONS,
  FLEX,
  SHADOW_OFFSET,
  MOCK_DATA,
} from '../../../shared/constants';
import { MS } from '../../../shared/constants/numbers';
import { RELATIVE_TIME } from '../../../shared/constants/timing';
import { Text, PageHeader } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../../theme';
import { designTokens } from '../../theme/designTokens';

type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

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

// Time multipliers for mock data
// Note: Using literal values to avoid module initialization order issues
const TIME_MULTIPLIER = {
  TWO: 2,
  THREE: 3,
} as const;

const formatTimestamp = (date: Date, t: TranslationFn): string => {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / MS.MINUTE);
  const diffHours = Math.floor(diffMs / MS.HOUR);
  const diffDays = Math.floor(diffMs / MS.DAY);
  if (diffMins < RELATIVE_TIME.MINUTES_THRESHOLD) {
    return t('screens.notifications.timeAgo.minutes', { count: diffMins });
  }
  if (diffHours < RELATIVE_TIME.HOURS_THRESHOLD) {
    return t('screens.notifications.timeAgo.hours', { count: diffHours });
  }
  if (diffDays < RELATIVE_TIME.DAYS_THRESHOLD) {
    return t('screens.notifications.timeAgo.days', { count: diffDays });
  }
  return date.toLocaleDateString();
};

// Notification card component
type NotificationCardProps = {
  notification: Notification;
  onPress: () => void;
  t: TranslationFn;
};

function NotificationCard({ notification, onPress, t }: NotificationCardProps): React.JSX.Element {
  const color = getNotificationColor(notification.type);
  const cardStyles = [styles.notificationCard, !notification.read && styles.notificationCardUnread];
  return (
    <TouchableOpacity style={cardStyles} activeOpacity={TOUCH_OPACITY.default} onPress={onPress}>
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
type UseNotificationsReturn = {
  notifications: Notification[];
  refreshing: boolean;
  refresh: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
};

// Mock notifications factory
const createMockNotifications = (t: TranslationFn): Notification[] => {
  const now = Date.now();
  return [
    {
      id: MOCK_DATA.NOTIFICATIONS.IDS.ACTIVITY,
      type: NOTIFICATION_TYPE.ACTIVITY,
      title: t('screens.notifications.mockTitles.newActivity'),
      message: t('screens.notifications.mockMessages.newActivity'),
      timestamp: new Date(now - MS.HOUR * TIME_MULTIPLIER.TWO),
      read: false,
    },
    {
      id: MOCK_DATA.NOTIFICATIONS.IDS.FEE,
      type: NOTIFICATION_TYPE.FEE,
      title: t('screens.notifications.mockTitles.paymentDue'),
      message: t('screens.notifications.mockMessages.paymentDue'),
      timestamp: new Date(now - MS.DAY),
      read: false,
    },
    {
      id: MOCK_DATA.NOTIFICATIONS.IDS.CLUB,
      type: NOTIFICATION_TYPE.CLUB,
      title: t('screens.notifications.mockTitles.clubUpdate'),
      message: t('screens.notifications.mockMessages.clubUpdate'),
      timestamp: new Date(now - MS.DAY * TIME_MULTIPLIER.TWO),
      read: true,
    },
    {
      id: MOCK_DATA.NOTIFICATIONS.IDS.SYSTEM,
      type: NOTIFICATION_TYPE.SYSTEM,
      title: t('screens.notifications.mockTitles.welcome'),
      message: t('screens.notifications.mockMessages.welcome'),
      timestamp: new Date(now - MS.DAY * TIME_MULTIPLIER.THREE),
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

  const markAllAction =
    unreadCount > 0 ? (
      <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
        <Text style={styles.markAllText}>{t('screens.notifications.markAllAsRead')}</Text>
      </TouchableOpacity>
    ) : null;

  return (
    <View style={styles.container}>
      <PageHeader
        title={t('screens.notifications.title')}
        subtitle={t('screens.notifications.subtitle')}
        showActions={false}
        actions={markAllAction}
      />
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
            <NotificationCard key={n.id} notification={n} t={t} onPress={() => markAsRead(n.id)} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name={ICONS.BELL_OFF_OUTLINE}
              size={mobileIconSizes.xxlarge / 2}
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
    flex: FLEX.ONE,
    backgroundColor: designTokens.colors.backgroundSecondary,
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
    flex: FLEX.ONE,
  },
  notificationCard: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: SHADOW_OFFSET.MD,
    shadowOpacity: designTokens.shadows.sm.shadowOpacity,
    shadowRadius: designTokens.shadows.sm.shadowRadius,
    elevation: designTokens.shadows.sm.elevation,
    position: layoutConstants.position.relative,
  },
  notificationCardUnread: {
    backgroundColor: designTokens.colors.infoLight,
    borderLeftWidth: BORDERS.WIDTH.MEDIUM,
    borderLeftColor: designTokens.colors.primary,
  },
  unreadDot: {
    position: layoutConstants.position.absolute,
    top: designTokens.spacing.md,
    right: designTokens.spacing.md,
    width: DIMENSIONS.PROGRESS_BAR.STANDARD,
    height: DIMENSIONS.PROGRESS_BAR.STANDARD,
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
    flex: FLEX.ONE,
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
    flex: FLEX.ONE,
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
