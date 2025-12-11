/**
 * Notification Service
 * Handles WhatsApp and push notifications with mock/backend toggle
 */

import { Alert, Linking, Platform } from 'react-native';
import {
  DEBOUNCE,
  ALERT_BUTTON_STYLE,
  EMPTY_VALUE,
  API_ENDPOINTS,
  EXTERNAL_URLS,
} from '../../shared/constants';
import { LANGUAGE } from '../../shared/constants/app';
import { LOCALE } from '../../shared/constants/locale';
import { LOG_MESSAGES } from '../../shared/constants/logMessages';
import { ID_GENERATION } from '../../shared/constants/numbers';
import {
  NOTIFICATION_CHANNEL,
  PLATFORM,
  ID_PREFIX,
  REGEX_PATTERN,
} from '../../shared/constants/ui';
import { NUMERIC } from '../../shared/constants/validation';
import i18n, { t } from '../../shared/i18n';
import { logger } from '../../shared/utils/logger';
import { environment } from '../config/environment';
import { apiService } from '../http/api';
import type { MemberBalance, User } from '../../types';

type NotificationChannelType = (typeof NOTIFICATION_CHANNEL)[keyof typeof NOTIFICATION_CHANNEL];

type SendNotificationRequest = {
  userId: string;
  message: string;
  type: NotificationChannelType;
};

type BulkNotificationRequest = {
  userIds: string[];
  messages: Record<string, string>; // userId -> message
  type: NotificationChannelType;
};

type ScheduleNotificationRequest = {
  userId: string;
  title: string;
  body: string;
  scheduledDate: string;
};

class NotificationService {
  private _useMockData: boolean = environment.mock.useMockApi;

  /**
   * Send WhatsApp notification with payment reminder
   * In mock mode: Opens WhatsApp client directly
   * In backend mode: Sends via backend API (which can use WhatsApp Business API)
   */
  async sendWhatsAppNotification(user: User, message: string): Promise<boolean> {
    logger.info(LOG_MESSAGES.NOTIFICATION.SENDING_WHATSAPP, {
      userId: user.id,
      userName: user.name,
    });

    if (this._useMockData) {
      return this._mockSendWhatsAppNotification(user, message);
    }

    try {
      const request: SendNotificationRequest = {
        userId: user.id,
        message,
        type: NOTIFICATION_CHANNEL.WHATSAPP,
      };
      await apiService.post<undefined>(API_ENDPOINTS.NOTIFICATIONS.SEND, request);
      logger.info(LOG_MESSAGES.NOTIFICATION.WHATSAPP_SENT, { userId: user.id });
      return true;
    } catch (error) {
      logger.error(LOG_MESSAGES.NOTIFICATION.WHATSAPP_FAILED, error as Error, {
        userId: user.id,
      });
      // Fallback to direct WhatsApp link
      return this._mockSendWhatsAppNotification(user, message);
    }
  }

  /**
   * Mock send WhatsApp notification - Opens WhatsApp directly
   */
  private async _mockSendWhatsAppNotification(user: User, message: string): Promise<boolean> {
    try {
      if (!user.whatsappNumber) {
        logger.warn(LOG_MESSAGES.NOTIFICATION.NO_WHATSAPP_NUMBER, {
          userId: user.id,
          userName: user.name,
        });
        return false;
      }

      // Clean phone number (remove spaces, dashes, etc.)
      const cleanNumber = user.whatsappNumber.replace(REGEX_PATTERN.NON_PHONE_CHARS, EMPTY_VALUE);

      // WhatsApp deep link URL
      const whatsappUrl = EXTERNAL_URLS.WHATSAPP.SEND(cleanNumber, message);

      // Check if WhatsApp can be opened
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        logger.info(LOG_MESSAGES.NOTIFICATION.MOCK_WHATSAPP_OPENED, { userId: user.id });
        return true;
      }
      // Fallback to web WhatsApp (wa.me is WhatsApp's web redirect)
      const webWhatsappUrl = EXTERNAL_URLS.WHATSAPP.WEB(cleanNumber, message);
      await Linking.openURL(webWhatsappUrl);
      logger.info(LOG_MESSAGES.NOTIFICATION.MOCK_WEB_WHATSAPP_OPENED, { userId: user.id });
      return true;
    } catch (error) {
      logger.error(LOG_MESSAGES.NOTIFICATION.MOCK_WHATSAPP_ERROR, error as Error, {
        userId: user.id,
      });
      return false;
    }
  }

  /**
   * Format payment reminder message
   */
  formatPaymentReminder(user: User, balance: MemberBalance, clubName: string): string {
    // Using imported t function
    const locale = i18n.language === LANGUAGE.ES ? LOCALE.ES_ES : LOCALE.EN_US;
    const messages: string[] = [];

    messages.push(t('services.notification.paymentReminder.clubHeader', { clubName }));
    messages.push(t('services.notification.paymentReminder.greeting', { userName: user.name }));
    messages.push(t('services.notification.paymentReminder.accountStatusHeader'));
    messages.push(
      t('services.notification.paymentReminder.totalOwed', {
        amount: balance.totalOwed.toFixed(NUMERIC.DECIMAL_PLACES),
      })
    );
    messages.push(
      t('services.notification.paymentReminder.totalPaid', {
        amount: balance.totalPaid.toFixed(NUMERIC.DECIMAL_PLACES),
      })
    );

    const balanceAmount = Math.abs(balance.balance).toFixed(NUMERIC.DECIMAL_PLACES);
    if (balance.balance < 0) {
      messages.push(
        t('services.notification.paymentReminder.pendingBalance', { amount: balanceAmount })
      );
    } else {
      messages.push(
        t('services.notification.paymentReminder.creditBalance', { amount: balanceAmount })
      );
    }

    if (balance.overdueCharges > 0) {
      messages.push(
        t('services.notification.paymentReminder.overdueCharges', {
          amount: balance.overdueCharges.toFixed(NUMERIC.DECIMAL_PLACES),
        })
      );
      messages.push(t('services.notification.paymentReminder.overdueWarning'));
    } else if (balance.pendingCharges > 0) {
      messages.push(
        t('services.notification.paymentReminder.pendingCharges', {
          amount: balance.pendingCharges.toFixed(NUMERIC.DECIMAL_PLACES),
        })
      );
    }

    if (balance.lastPaymentDate) {
      const lastPayment = new Date(balance.lastPaymentDate);
      messages.push(
        t('services.notification.paymentReminder.lastPayment', {
          date: lastPayment.toLocaleDateString(locale),
        })
      );
    }

    messages.push(t('services.notification.paymentReminder.thankYou'));
    messages.push(t('services.notification.paymentReminder.automatedMessage'));

    return messages.join(EMPTY_VALUE);
  }

  /**
   * Format custom charge notification
   */
  formatCustomChargeNotification(
    user: User,
    description: string,
    amount: number,
    dueDate: string,
    clubName: string
  ): string {
    // Using imported t function
    const locale = i18n.language === LANGUAGE.ES ? LOCALE.ES_ES : LOCALE.EN_US;
    const messages: string[] = [];
    const due = new Date(dueDate);

    messages.push(t('services.notification.customCharge.clubHeader', { clubName }));
    messages.push(t('services.notification.customCharge.greeting', { userName: user.name }));
    messages.push(t('services.notification.customCharge.newChargeHeader'));
    messages.push(t('services.notification.customCharge.description', { description }));
    messages.push(
      t('services.notification.customCharge.amount', {
        amount: amount.toFixed(NUMERIC.DECIMAL_PLACES),
      })
    );
    messages.push(
      t('services.notification.customCharge.dueDate', { date: due.toLocaleDateString(locale) })
    );
    messages.push(t('services.notification.customCharge.reminder'));
    messages.push(t('services.notification.customCharge.thankYou'));
    messages.push(t('services.notification.customCharge.automatedMessage'));

    return messages.join(EMPTY_VALUE);
  }

  /**
   * Send notification via push notification
   */
  async sendPushNotification(userId: string, title: string, body: string): Promise<boolean> {
    logger.info(LOG_MESSAGES.NOTIFICATION.SENDING_PUSH, { userId, title });

    if (this._useMockData) {
      return this._mockSendPushNotification(userId, title, body);
    }

    try {
      const request: SendNotificationRequest = {
        userId,
        message: `${title}\n${body}`,
        type: NOTIFICATION_CHANNEL.PUSH,
      };
      await apiService.post<undefined>(API_ENDPOINTS.NOTIFICATIONS.SEND, request);
      logger.info(LOG_MESSAGES.NOTIFICATION.PUSH_SENT, { userId, title });
      return true;
    } catch (error) {
      logger.error(LOG_MESSAGES.NOTIFICATION.PUSH_FAILED, error as Error, { userId, title });
      return false;
    }
  }

  /**
   * Mock send push notification - Simulated
   */
  private async _mockSendPushNotification(
    userId: string,
    title: string,
    body: string
  ): Promise<boolean> {
    // TODO: Integrate with Expo Push Notifications or Firebase Cloud Messaging
    logger.debug(LOG_MESSAGES.NOTIFICATION.MOCK_PUSH_SIMULATED, { userId, title, body });

    // For now, just show a local alert
    if (Platform.OS !== PLATFORM.WEB) {
      // In a real implementation, you would use expo-notifications here
      logger.info(LOG_MESSAGES.NOTIFICATION.MOCK_PUSH_SENT, { userId });
    }

    return true;
  }

  /**
   * Show confirmation dialog before sending notification
   */
  async confirmAndSend(
    user: User,
    message: string,
    onSuccess?: () => void,
    onError?: () => void
  ): Promise<void> {
    // Using imported t function

    Alert.alert(
      t('services.notification.alerts.sendNotification'),
      t('services.notification.alerts.sendWhatsAppConfirm', { userName: user.name }),
      [
        {
          text: t('common.cancel'),
          style: ALERT_BUTTON_STYLE.CANCEL,
        },
        {
          text: t('services.notification.alerts.send'),
          onPress: async () => {
            const success = await this.sendWhatsAppNotification(user, message);

            if (success) {
              Alert.alert(t('common.success'), t('services.notification.alerts.notificationSent'));
              onSuccess?.();
            } else {
              Alert.alert(t('common.error'), t('services.notification.alerts.notificationFailed'));
              onError?.();
            }
          },
        },
      ]
    );
  }

  /**
   * Batch send notifications to multiple users
   */
  async sendBulkNotifications(
    users: User[],
    messages: Map<string, string>,
    onProgress?: (current: number, total: number) => void
  ): Promise<{ success: number; failed: number }> {
    logger.info(LOG_MESSAGES.NOTIFICATION.SENDING_BULK, { userCount: users.length });

    if (this._useMockData) {
      return this._mockSendBulkNotifications(users, messages, onProgress);
    }

    try {
      const messageRecord: Record<string, string> = {};
      messages.forEach((msg, userId) => {
        messageRecord[userId] = msg;
      });

      const request: BulkNotificationRequest = {
        userIds: users.map((u) => u.id),
        messages: messageRecord,
        type: NOTIFICATION_CHANNEL.WHATSAPP,
      };

      await apiService.post<undefined>(API_ENDPOINTS.NOTIFICATIONS.BULK, request);
      logger.info(LOG_MESSAGES.NOTIFICATION.BULK_SENT, { userCount: users.length });

      // Simulate progress for UI
      for (let i = 0; i < users.length; i++) {
        // eslint-disable-next-line no-await-in-loop -- Sequential progress updates for UI feedback
        await new Promise((resolve) => {
          setTimeout(resolve, DEBOUNCE.FAST);
        });
        onProgress?.(i + 1, users.length);
      }

      return { success: users.length, failed: 0 };
    } catch (error) {
      logger.error(LOG_MESSAGES.NOTIFICATION.BULK_FAILED, error as Error, {
        userCount: users.length,
      });
      // Fallback to mock implementation
      return this._mockSendBulkNotifications(users, messages, onProgress);
    }
  }

  /**
   * Mock send bulk notifications
   */
  private async _mockSendBulkNotifications(
    users: User[],
    messages: Map<string, string>,
    onProgress?: (current: number, total: number) => void
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const message = messages.get(user.id);

      if (message) {
        // eslint-disable-next-line no-await-in-loop -- Sequential notification sending with rate limiting
        const sent = await this._mockSendWhatsAppNotification(user, message);

        if (sent) {
          success++;
        } else {
          failed++;
        }

        // Small delay between messages to avoid rate limiting
        // eslint-disable-next-line no-await-in-loop -- Intentional delay for rate limiting
        await new Promise((resolve) => {
          setTimeout(resolve, DEBOUNCE.SLOW);
        });

        onProgress?.(i + 1, users.length);
      }
    }

    logger.info(LOG_MESSAGES.NOTIFICATION.MOCK_BULK_SENT, { success, failed, total: users.length });
    return { success, failed };
  }

  /**
   * Schedule notification for later
   */
  async scheduleNotification(
    userId: string,
    title: string,
    body: string,
    scheduledDate: Date
  ): Promise<string> {
    logger.info(LOG_MESSAGES.NOTIFICATION.SCHEDULING, { userId, title, scheduledDate });

    if (this._useMockData) {
      return this._mockScheduleNotification(userId, title, body, scheduledDate);
    }

    try {
      const request: ScheduleNotificationRequest = {
        userId,
        title,
        body,
        scheduledDate: scheduledDate.toISOString(),
      };
      const response = await apiService.post<{ notificationId: string }>(
        API_ENDPOINTS.NOTIFICATIONS.SCHEDULE,
        request
      );
      logger.info(LOG_MESSAGES.NOTIFICATION.SCHEDULED, {
        userId,
        notificationId: response.notificationId,
      });
      return response.notificationId;
    } catch (error) {
      logger.error(LOG_MESSAGES.NOTIFICATION.SCHEDULE_FAILED, error as Error, { userId, title });
      // Return mock ID as fallback
      return this._mockScheduleNotification(userId, title, body, scheduledDate);
    }
  }

  /**
   * Mock schedule notification
   */
  private async _mockScheduleNotification(
    userId: string,
    title: string,
    body: string,
    scheduledDate: Date
  ): Promise<string> {
    // TODO: Implement with expo-notifications
    const notificationId = `${ID_PREFIX.NOTIFICATION}_${Date.now()}_${Math.random().toString(ID_GENERATION.RADIX).substr(ID_GENERATION.SUBSTRING_START, ID_GENERATION.SUFFIX_LENGTH)}`;
    logger.info(LOG_MESSAGES.NOTIFICATION.MOCK_SCHEDULED, {
      userId,
      notificationId,
      scheduledDate,
    });
    return notificationId;
  }

  /**
   * Cancel scheduled notification
   */
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    logger.info(LOG_MESSAGES.NOTIFICATION.CANCELLING, { notificationId });

    if (this._useMockData) {
      return this._mockCancelScheduledNotification(notificationId);
    }

    try {
      await apiService.delete<undefined>(API_ENDPOINTS.NOTIFICATIONS.SCHEDULED(notificationId));
      logger.info(LOG_MESSAGES.NOTIFICATION.CANCELLED, { notificationId });
    } catch (error) {
      logger.error(LOG_MESSAGES.NOTIFICATION.CANCEL_FAILED, error as Error, {
        notificationId,
      });
      // Fallback to mock
      this._mockCancelScheduledNotification(notificationId);
    }
  }

  /**
   * Mock cancel scheduled notification
   */
  private async _mockCancelScheduledNotification(notificationId: string): Promise<void> {
    // TODO: Implement with expo-notifications
    logger.info(LOG_MESSAGES.NOTIFICATION.MOCK_CANCELLED, { notificationId });
  }
}

export const notificationService = new NotificationService();
