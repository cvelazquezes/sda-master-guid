/**
 * Notification Service
 * Handles WhatsApp and push notifications with mock/backend toggle
 */

import { Alert, Linking, Platform } from 'react-native';
import { apiService } from './api';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';
import { MemberBalance, User } from '../types';
import { TIMING } from '../shared/constants';

interface SendNotificationRequest {
  userId: string;
  message: string;
  type: 'whatsapp' | 'push' | 'both';
}

interface BulkNotificationRequest {
  userIds: string[];
  messages: Record<string, string>; // userId -> message
  type: 'whatsapp' | 'push' | 'both';
}

interface ScheduleNotificationRequest {
  userId: string;
  title: string;
  body: string;
  scheduledDate: string;
}

class NotificationService {
  private useMockData = environment.useMockData;

  /**
   * Send WhatsApp notification with payment reminder
   * In mock mode: Opens WhatsApp client directly
   * In backend mode: Sends via backend API (which can use WhatsApp Business API)
   */
  async sendWhatsAppNotification(user: User, message: string): Promise<boolean> {
    logger.info('Sending WhatsApp notification', { userId: user.id, userName: user.name });

    if (this.useMockData) {
      return this.mockSendWhatsAppNotification(user, message);
    }

    try {
      const request: SendNotificationRequest = {
        userId: user.id,
        message,
        type: 'whatsapp',
      };
      await apiService.post<void>('/notifications/send', request);
      logger.info('WhatsApp notification sent via backend', { userId: user.id });
      return true;
    } catch (error) {
      logger.error('Failed to send WhatsApp notification', error as Error, {
        userId: user.id,
      });
      // Fallback to direct WhatsApp link
      return this.mockSendWhatsAppNotification(user, message);
    }
  }

  /**
   * Mock send WhatsApp notification - Opens WhatsApp directly
   */
  private async mockSendWhatsAppNotification(user: User, message: string): Promise<boolean> {
    try {
      if (!user.whatsappNumber) {
        logger.warn('User has no WhatsApp number', { userId: user.id, userName: user.name });
        return false;
      }

      // Clean phone number (remove spaces, dashes, etc.)
      const cleanNumber = user.whatsappNumber.replace(/[^0-9+]/g, '');

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);

      // WhatsApp deep link URL
      const whatsappUrl = `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`;

      // Check if WhatsApp can be opened
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        logger.info('Mock: WhatsApp notification opened', { userId: user.id });
        return true;
      } else {
        // Fallback to web WhatsApp
        const webWhatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
        await Linking.openURL(webWhatsappUrl);
        logger.info('Mock: Web WhatsApp notification opened', { userId: user.id });
        return true;
      }
    } catch (error) {
      logger.error('Mock: Error sending WhatsApp notification', error as Error, {
        userId: user.id,
      });
      return false;
    }
  }

  /**
   * Format payment reminder message
   */
  formatPaymentReminder(
    user: User,
    balance: MemberBalance,
    clubName: string
  ): string {
    const messages: string[] = [];

    messages.push(`🏕️ *${clubName}*`);
    messages.push(`\nHola ${user.name},`);
    messages.push(`\n📊 *Estado de tu cuenta:*`);
    messages.push(`\n💰 Total adeudado: $${balance.totalOwed.toFixed(2)}`);
    messages.push(`✅ Total pagado: $${balance.totalPaid.toFixed(2)}`);

    const balanceAmount = Math.abs(balance.balance).toFixed(2);
    if (balance.balance < 0) {
      messages.push(`\n📍 *Saldo pendiente: $${balanceAmount}*`);
    } else {
      messages.push(`\n📍 Saldo: $${balanceAmount} (crédito)`);
    }

    if (balance.overdueCharges > 0) {
      messages.push(`\n⚠️ *Cargos vencidos: $${balance.overdueCharges.toFixed(2)}*`);
      messages.push(`\nPor favor, ponte al corriente lo antes posible.`);
    } else if (balance.pendingCharges > 0) {
      messages.push(`\n⏳ Cargos pendientes: $${balance.pendingCharges.toFixed(2)}`);
    }

    if (balance.lastPaymentDate) {
      const lastPayment = new Date(balance.lastPaymentDate);
      messages.push(`\n📅 Último pago: ${lastPayment.toLocaleDateString('es-MX')}`);
    }

    messages.push(`\n\nGracias por tu participación en el club! 🙏`);
    messages.push(`\n_Mensaje automático del sistema de cuotas_`);

    return messages.join('');
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
    const messages: string[] = [];
    const due = new Date(dueDate);

    messages.push(`🏕️ *${clubName}*`);
    messages.push(`\nHola ${user.name},`);
    messages.push(`\n📋 *Nuevo cargo registrado:*`);
    messages.push(`\n${description}`);
    messages.push(`\n💰 Monto: $${amount.toFixed(2)}`);
    messages.push(`📅 Fecha de vencimiento: ${due.toLocaleDateString('es-MX')}`);
    messages.push(`\n\nPor favor, considera este cargo en tu próximo pago.`);
    messages.push(`\nGracias por tu comprensión! 🙏`);
    messages.push(`\n_Mensaje automático del sistema de cuotas_`);

    return messages.join('');
  }

  /**
   * Send notification via push notification
   */
  async sendPushNotification(userId: string, title: string, body: string): Promise<boolean> {
    logger.info('Sending push notification', { userId, title });

    if (this.useMockData) {
      return this.mockSendPushNotification(userId, title, body);
    }

    try {
      const request: SendNotificationRequest = {
        userId,
        message: `${title}\n${body}`,
        type: 'push',
      };
      await apiService.post<void>('/notifications/send', request);
      logger.info('Push notification sent via backend', { userId, title });
      return true;
    } catch (error) {
      logger.error('Failed to send push notification', error as Error, { userId, title });
      return false;
    }
  }

  /**
   * Mock send push notification - Simulated
   */
  private async mockSendPushNotification(
    userId: string,
    title: string,
    body: string
  ): Promise<boolean> {
    // TODO: Integrate with Expo Push Notifications or Firebase Cloud Messaging
    logger.debug('Mock: Push notification (simulated)', { userId, title, body });

    // For now, just show a local alert
    if (Platform.OS !== 'web') {
      // In a real implementation, you would use expo-notifications here
      logger.info('Mock: Push notification sent (simulated)', { userId });
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
    Alert.alert(
      'Enviar Notificación',
      `¿Enviar mensaje de WhatsApp a ${user.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar',
          onPress: async () => {
            const success = await this.sendWhatsAppNotification(user, message);
            
            if (success) {
              Alert.alert('Éxito', 'Notificación enviada');
              onSuccess?.();
            } else {
              Alert.alert('Error', 'No se pudo enviar la notificación');
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
    logger.info('Sending bulk notifications', { userCount: users.length });

    if (this.useMockData) {
      return this.mockSendBulkNotifications(users, messages, onProgress);
    }

    try {
      const messageRecord: Record<string, string> = {};
      messages.forEach((msg, userId) => {
        messageRecord[userId] = msg;
      });

      const request: BulkNotificationRequest = {
        userIds: users.map((u) => u.id),
        messages: messageRecord,
        type: 'whatsapp',
      };

      await apiService.post<void>('/notifications/bulk', request);
      logger.info('Bulk notifications sent via backend', { userCount: users.length });

      // Simulate progress for UI
      for (let i = 0; i < users.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, TIMING.DEBOUNCE.FAST));
        onProgress?.(i + 1, users.length);
      }

      return { success: users.length, failed: 0 };
    } catch (error) {
      logger.error('Failed to send bulk notifications', error as Error, {
        userCount: users.length,
      });
      // Fallback to mock implementation
      return this.mockSendBulkNotifications(users, messages, onProgress);
    }
  }

  /**
   * Mock send bulk notifications
   */
  private async mockSendBulkNotifications(
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
        const sent = await this.mockSendWhatsAppNotification(user, message);

        if (sent) {
          success++;
        } else {
          failed++;
        }

        // Small delay between messages to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, TIMING.DEBOUNCE.SLOW));

        onProgress?.(i + 1, users.length);
      }
    }

    logger.info('Mock: Bulk notifications sent', { success, failed, total: users.length });
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
    logger.info('Scheduling notification', { userId, title, scheduledDate });

    if (this.useMockData) {
      return this.mockScheduleNotification(userId, title, body, scheduledDate);
    }

    try {
      const request: ScheduleNotificationRequest = {
        userId,
        title,
        body,
        scheduledDate: scheduledDate.toISOString(),
      };
      const response = await apiService.post<{ notificationId: string }>(
        '/notifications/schedule',
        request
      );
      logger.info('Notification scheduled via backend', {
        userId,
        notificationId: response.notificationId,
      });
      return response.notificationId;
    } catch (error) {
      logger.error('Failed to schedule notification', error as Error, { userId, title });
      // Return mock ID as fallback
      return this.mockScheduleNotification(userId, title, body, scheduledDate);
    }
  }

  /**
   * Mock schedule notification
   */
  private async mockScheduleNotification(
    userId: string,
    title: string,
    body: string,
    scheduledDate: Date
  ): Promise<string> {
    // TODO: Implement with expo-notifications
    const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    logger.info('Mock: Notification scheduled', { userId, notificationId, scheduledDate });
    return notificationId;
  }

  /**
   * Cancel scheduled notification
   */
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    logger.info('Cancelling scheduled notification', { notificationId });

    if (this.useMockData) {
      return this.mockCancelScheduledNotification(notificationId);
    }

    try {
      await apiService.delete<void>(`/notifications/scheduled/${notificationId}`);
      logger.info('Scheduled notification cancelled via backend', { notificationId });
    } catch (error) {
      logger.error('Failed to cancel scheduled notification', error as Error, {
        notificationId,
      });
      // Fallback to mock
      this.mockCancelScheduledNotification(notificationId);
    }
  }

  /**
   * Mock cancel scheduled notification
   */
  private async mockCancelScheduledNotification(notificationId: string): Promise<void> {
    // TODO: Implement with expo-notifications
    logger.info('Mock: Scheduled notification cancelled', { notificationId });
  }
}

export const notificationService = new NotificationService();

