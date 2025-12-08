import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  createScreenStyles,
  createHeaderStyles,
  createBannerStyles,
  createNotificationCardStyles,
  createEmptyStyles,
} from './notifications/styles';
import {
  ICONS,
  NOTIFICATION_TYPE,
  TEXT_LINES,
  TOUCH_OPACITY,
  MOCK_DATA,
} from '../../../shared/constants';
import { MS } from '../../../shared/constants/numbers';
import { RELATIVE_TIME } from '../../../shared/constants/timing';
import { Text, PageHeader } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { useTheme } from '../../state/ThemeContext';

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

const getNotificationColor = (
  type: NotificationType,
  colors: { primary: string; warning: string; info: string; textSecondary: string }
): string => {
  const colorMap: Record<NotificationType, string> = {
    [NOTIFICATION_TYPE.ACTIVITY]: colors.primary,
    [NOTIFICATION_TYPE.FEE]: colors.warning,
    [NOTIFICATION_TYPE.CLUB]: colors.info,
    [NOTIFICATION_TYPE.SYSTEM]: colors.textSecondary,
  };
  return colorMap[type] || colors.textSecondary;
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
  styles: ReturnType<typeof createNotificationCardStyles>;
  colors: { primary: string; warning: string; info: string; textSecondary: string };
  iconSizes: { large: number };
};

function NotificationCard({
  notification,
  onPress,
  t,
  styles,
  colors,
  iconSizes,
}: NotificationCardProps): React.JSX.Element {
  const color = getNotificationColor(notification.type, colors);
  const cardStyles = [styles.card, !notification.read && styles.cardUnread];
  return (
    <TouchableOpacity style={cardStyles} activeOpacity={TOUCH_OPACITY.default} onPress={onPress}>
      {!notification.read && <View style={styles.unreadDot} />}
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <MaterialCommunityIcons
          name={getNotificationIcon(notification.type)}
          size={iconSizes.large}
          color={color}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={TEXT_LINES.single}>
            {notification.title}
          </Text>
          <Text style={styles.time}>{formatTimestamp(notification.timestamp, t)}</Text>
        </View>
        <Text style={styles.message} numberOfLines={TEXT_LINES.double}>
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
  const { colors, spacing, radii, typography, iconSizes } = useTheme();
  const { notifications, refreshing, refresh, markAsRead, markAllAsRead, unreadCount } =
    useNotifications(t);

  // Create theme-aware styles
  const screenStyles = useMemo(() => createScreenStyles(colors), [colors]);
  const headerStyles = useMemo(
    () => createHeaderStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );
  const bannerStyles = useMemo(
    () => createBannerStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );
  const notificationCardStyles = useMemo(
    () => createNotificationCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const emptyStyles = useMemo(
    () => createEmptyStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );

  const markAllAction =
    unreadCount > 0 ? (
      <TouchableOpacity style={headerStyles.markAllButton} onPress={markAllAsRead}>
        <Text style={headerStyles.markAllText}>{t('screens.notifications.markAllAsRead')}</Text>
      </TouchableOpacity>
    ) : null;

  return (
    <View style={screenStyles.container}>
      <PageHeader
        title={t('screens.notifications.title')}
        subtitle={t('screens.notifications.subtitle')}
        showActions={false}
        actions={markAllAction}
      />
      {unreadCount > 0 && (
        <View style={bannerStyles.unreadBanner}>
          <MaterialCommunityIcons
            name={ICONS.BELL_BADGE}
            size={iconSizes.md}
            color={colors.primary}
          />
          <Text style={bannerStyles.unreadText}>
            {t('screens.notifications.unreadCount', { count: unreadCount })}
          </Text>
        </View>
      )}
      <ScrollView
        style={screenStyles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              t={t}
              styles={notificationCardStyles}
              colors={colors}
              iconSizes={iconSizes}
              onPress={() => markAsRead(n.id)}
            />
          ))
        ) : (
          <View style={emptyStyles.container}>
            <MaterialCommunityIcons
              name={ICONS.BELL_OFF_OUTLINE}
              size={iconSizes.xxl / 2}
              color={colors.textSecondary}
            />
            <Text style={emptyStyles.title}>{t('screens.notifications.noNotifications')}</Text>
            <Text style={emptyStyles.subtitle}>{t('screens.notifications.allCaughtUp')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;
