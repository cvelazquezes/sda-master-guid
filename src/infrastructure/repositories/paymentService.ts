/* eslint-disable max-lines -- Payment service requires comprehensive fee management logic */
/**
 * Payment Service
 * Handles payment and fee management with mock/backend toggle
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../../shared/config/storage';
import { LOG_MESSAGES, API_ENDPOINTS } from '../../shared/constants';
import { LANGUAGE } from '../../shared/constants/app';
import { LOCALE } from '../../shared/constants/locale';
import { MATH, ID_GENERATION, MS } from '../../shared/constants/numbers';
import { ID_PREFIX, EMPTY_VALUE } from '../../shared/constants/ui';
import { NUMERIC } from '../../shared/constants/validation';
import i18n, { t } from '../../shared/i18n';
import { logger } from '../../shared/utils/logger';
import {
  PaymentStatus,
  ChargeType,
  ApprovalStatus,
  type ClubFeeSettings,
  type CustomCharge,
  type MemberBalance,
  type MemberPayment,
  type User,
} from '../../types';
import { environment } from '../config/environment';
import { apiService } from '../http/api';

// Payment service constants
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- MS constant is properly typed as number
const PAYMENT_DELAY_MS: number = MS.FIVE; // Delay for unique ID generation

type GenerateFeesRequest = {
  clubId: string;
  year: number;
};

type CreateCustomChargeRequest = {
  clubId: string;
  description: string;
  amount: number;
  dueDate: string;
  appliedToUserIds: string[];
};

class PaymentService {
  private _useMockData: boolean = environment.mock.useMockApi;
  // ============================================
  // Storage Management
  // ============================================

  private async _getPayments(): Promise<MemberPayment[]> {
    try {
      const data = await AsyncStorage.getItem(storageKeys.PAYMENTS);
      return data ? (JSON.parse(data) as MemberPayment[]) : [];
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.ERROR_LOADING_PAYMENTS, error as Error);
      return [];
    }
  }

  private async _savePayments(payments: MemberPayment[]): Promise<void> {
    try {
      await AsyncStorage.setItem(storageKeys.PAYMENTS, JSON.stringify(payments));
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.ERROR_SAVING_PAYMENTS, error as Error);
      throw error;
    }
  }

  private async _getCustomCharges(): Promise<CustomCharge[]> {
    try {
      const data = await AsyncStorage.getItem(storageKeys.CUSTOM_CHARGES);
      return data ? (JSON.parse(data) as CustomCharge[]) : [];
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.ERROR_LOADING_CHARGES, error as Error);
      return [];
    }
  }

  private async _saveCustomCharges(charges: CustomCharge[]): Promise<void> {
    try {
      await AsyncStorage.setItem(storageKeys.CUSTOM_CHARGES, JSON.stringify(charges));
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.ERROR_SAVING_CHARGES, error as Error);
      throw error;
    }
  }

  // ============================================
  // Monthly Fee Management
  // ============================================

  async generateMonthlyFees(
    clubId: string,
    members: User[],
    feeSettings: ClubFeeSettings,
    year: number
  ): Promise<void> {
    logger.info(LOG_MESSAGES.PAYMENT.GENERATING_FEES, {
      clubId,
      year,
      memberCount: members.length,
    });

    if (this._useMockData) {
      return this._mockGenerateMonthlyFees(clubId, members, feeSettings, year);
    }

    try {
      const request: GenerateFeesRequest = { clubId, year };
      await apiService.post<undefined>(API_ENDPOINTS.PAYMENTS.GENERATE, request);
      logger.info(LOG_MESSAGES.PAYMENT.FEES_GENERATED, { clubId, year });
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.GENERATE_FEES_FAILED, error as Error, { clubId, year });
      throw error;
    }
  }

  /**
   * Mock generate monthly fees implementation
   */
  private async _mockGenerateMonthlyFees(
    clubId: string,
    members: User[],
    feeSettings: ClubFeeSettings,
    year: number
  ): Promise<void> {
    const payments = await this._getPayments();
    const now = new Date().toISOString();

    // Filter only approved and active members
    const eligibleMembers = members.filter(
      (m) => m.approvalStatus === ApprovalStatus.APPROVED && m.isActive
    );

    logger.debug(LOG_MESSAGES.PAYMENT.MOCK_GENERATING_FEES, {
      clubId,
      year,
      eligibleCount: eligibleMembers.length,
    });

    for (const member of eligibleMembers) {
      for (const month of feeSettings.activeMonths) {
        // Check if payment already exists
        const existingPayment = payments.find(
          (p) =>
            p.userId === member.id && p.clubId === clubId && p.year === year && p.month === month
        );

        if (!existingPayment) {
          // Create due date (last day of the month)
          // 0 = last day of previous month, so month gives us last day of that month
          const dueDate = new Date(year, month, 0);

          const newPayment: MemberPayment = {
            id: `${ID_PREFIX.PAYMENT}_${clubId}_${member.id}_${year}_${month}_${Date.now()}`,
            userId: member.id,
            clubId,
            year,
            month,
            amount: feeSettings.monthlyFeeAmount,
            status: PaymentStatus.PENDING,
            dueDate: dueDate.toISOString(),
            createdAt: now,
            updatedAt: now,
          };

          payments.push(newPayment);
        }
      }
    }

    await this._savePayments(payments);
    logger.info(LOG_MESSAGES.PAYMENT.MOCK_FEES_GENERATED, {
      clubId,
      year,
      paymentsCreated: payments.length,
    });
  }

  async getClubPayments(clubId: string, year?: number): Promise<MemberPayment[]> {
    logger.debug(LOG_MESSAGES.PAYMENT.FETCHING_CLUB_PAYMENTS, { clubId, year });

    if (this._useMockData) {
      return this._mockGetClubPayments(clubId, year);
    }

    try {
      const payments = await apiService.get<MemberPayment[]>(
        API_ENDPOINTS.PAYMENTS.BY_CLUB(clubId, year)
      );
      logger.debug(LOG_MESSAGES.PAYMENT.CLUB_PAYMENTS_FETCHED, {
        clubId,
        year,
        count: payments.length,
      });
      return payments;
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.FETCH_CLUB_PAYMENTS_FAILED, error as Error, {
        clubId,
        year,
      });
      throw error;
    }
  }

  /**
   * Mock get club payments implementation
   */
  private async _mockGetClubPayments(clubId: string, year?: number): Promise<MemberPayment[]> {
    const payments = await this._getPayments();
    const filtered = payments.filter((p) => {
      if (p.clubId !== clubId) {
        return false;
      }
      if (year && p.year !== year) {
        return false;
      }
      return true;
    });

    logger.debug(LOG_MESSAGES.PAYMENT.MOCK_CLUB_PAYMENTS_FETCHED, {
      clubId,
      year,
      count: filtered.length,
    });
    return filtered;
  }

  async getMemberPayments(userId: string, clubId: string): Promise<MemberPayment[]> {
    logger.debug(LOG_MESSAGES.PAYMENT.FETCHING_MEMBER_PAYMENTS, { userId, clubId });

    if (this._useMockData) {
      return this._mockGetMemberPayments(userId, clubId);
    }

    try {
      const payments = await apiService.get<MemberPayment[]>(
        API_ENDPOINTS.PAYMENTS.BY_MEMBER(userId, clubId)
      );
      logger.debug(LOG_MESSAGES.PAYMENT.MEMBER_PAYMENTS_FETCHED, {
        userId,
        clubId,
        count: payments.length,
      });
      return payments;
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.FETCH_MEMBER_PAYMENTS_FAILED, error as Error, {
        userId,
        clubId,
      });
      throw error;
    }
  }

  /**
   * Mock get member payments implementation
   */
  private async _mockGetMemberPayments(userId: string, clubId: string): Promise<MemberPayment[]> {
    const payments = await this._getPayments();
    const filtered = payments.filter((p) => p.userId === userId && p.clubId === clubId);

    logger.debug(LOG_MESSAGES.PAYMENT.MOCK_MEMBER_PAYMENTS_FETCHED, {
      userId,
      clubId,
      count: filtered.length,
    });
    return filtered;
  }

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    paidDate?: string,
    notes?: string
  ): Promise<void> {
    logger.info(LOG_MESSAGES.PAYMENT.UPDATING_STATUS, { paymentId, status });

    if (this._useMockData) {
      return this._mockUpdatePaymentStatus(paymentId, status, paidDate, notes);
    }

    try {
      await apiService.patch<undefined>(API_ENDPOINTS.PAYMENTS.BY_ID(paymentId), {
        status,
        paidDate,
        notes,
      });
      logger.info(LOG_MESSAGES.PAYMENT.STATUS_UPDATED, { paymentId, status });
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.STATUS_UPDATE_FAILED, error as Error, {
        paymentId,
        status,
      });
      throw error;
    }
  }

  /**
   * Mock update payment status implementation
   */
  private async _mockUpdatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    paidDate?: string,
    notes?: string
  ): Promise<void> {
    const payments = await this._getPayments();
    const payment = payments.find((p) => p.id === paymentId);

    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date().toISOString();
      if (paidDate) {
        payment.paidDate = paidDate;
      }
      if (notes !== undefined) {
        payment.notes = notes;
      }

      await this._savePayments(payments);
      logger.info(LOG_MESSAGES.PAYMENT.MOCK_STATUS_UPDATED, { paymentId, status });
    } else {
      logger.warn(LOG_MESSAGES.PAYMENT.MOCK_PAYMENT_NOT_FOUND, { paymentId });
    }
  }

  // ============================================
  // Custom Charges Management
  // ============================================

  async createCustomCharge(
    clubId: string,
    description: string,
    amount: number,
    dueDate: string,
    appliedToUserIds: string[], // User IDs to apply charge to
    createdBy: string
  ): Promise<CustomCharge> {
    logger.info(LOG_MESSAGES.PAYMENT.CREATING_CUSTOM_CHARGE, {
      clubId,
      description,
      amount,
      userCount: appliedToUserIds.length,
    });

    if (this._useMockData) {
      return this._mockCreateCustomCharge(
        clubId,
        description,
        amount,
        dueDate,
        appliedToUserIds,
        createdBy
      );
    }

    try {
      const request: CreateCustomChargeRequest = {
        clubId,
        description,
        amount,
        dueDate,
        appliedToUserIds,
      };
      const charge = await apiService.post<CustomCharge>(API_ENDPOINTS.CHARGES.CUSTOM, request);
      logger.info(LOG_MESSAGES.PAYMENT.CUSTOM_CHARGE_CREATED, { chargeId: charge.id, clubId });
      return charge;
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.CREATE_CUSTOM_CHARGE_FAILED, error as Error, {
        clubId,
        description,
      });
      throw error;
    }
  }

  /**
   * Mock create custom charge implementation
   */
  private async _mockCreateCustomCharge(
    clubId: string,
    description: string,
    amount: number,
    dueDate: string,
    appliedToUserIds: string[],
    createdBy: string
  ): Promise<CustomCharge> {
    const charges = await this._getCustomCharges();
    const now = new Date().toISOString();

    const newCharge: CustomCharge = {
      id: `${ID_PREFIX.CHARGE}_${clubId}_${Date.now()}`,
      clubId,
      description,
      amount,
      type: ChargeType.CUSTOM,
      appliedToUserIds,
      createdDate: now,
      dueDate,
      isActive: true,
      createdBy,
      createdAt: now,
    };

    charges.push(newCharge);
    await this._saveCustomCharges(charges);

    // Create payment records for this charge
    await this._applyCustomChargeToMembers(newCharge, appliedToUserIds);

    logger.info(LOG_MESSAGES.PAYMENT.MOCK_CUSTOM_CHARGE_CREATED, {
      chargeId: newCharge.id,
      clubId,
    });
    return newCharge;
  }

  private async _applyCustomChargeToMembers(
    charge: CustomCharge,
    userIds: string[]
  ): Promise<void> {
    const payments = await this._getPayments();
    const now = new Date().toISOString();
    const dueDate = new Date(charge.dueDate);

    // Create payment record for each selected user
    for (const userId of userIds) {
      const newPayment: MemberPayment = {
        id: `${ID_PREFIX.PAYMENT}_${charge.id}_${userId}_${Date.now()}_${Math.random()
          .toString(MATH.THIRTY_SIX as number)
          .substr(MATH.HALF as number, ID_GENERATION.RANDOM_SUFFIX_LENGTH as number)}`,
        userId,
        clubId: charge.clubId,
        year: dueDate.getFullYear(),
        month: dueDate.getMonth() + 1,
        amount: charge.amount,
        status: PaymentStatus.PENDING,
        dueDate: charge.dueDate,
        notes: charge.description,
        createdAt: now,
        updatedAt: now,
      };

      payments.push(newPayment);

      // Small delay to ensure unique IDs
      // eslint-disable-next-line no-await-in-loop -- Intentional delay to ensure unique timestamp-based IDs
      await new Promise((resolve) => {
        setTimeout(resolve, PAYMENT_DELAY_MS);
      });
    }

    await this._savePayments(payments);
  }

  async getClubCustomCharges(clubId: string): Promise<CustomCharge[]> {
    logger.debug(LOG_MESSAGES.PAYMENT.FETCHING_CUSTOM_CHARGES, { clubId });

    if (this._useMockData) {
      return this._mockGetClubCustomCharges(clubId);
    }

    try {
      const charges = await apiService.get<CustomCharge[]>(API_ENDPOINTS.CHARGES.BY_CLUB(clubId));
      logger.debug(LOG_MESSAGES.PAYMENT.CUSTOM_CHARGES_FETCHED, { clubId, count: charges.length });
      return charges;
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.FETCH_CUSTOM_CHARGES_FAILED, error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get club custom charges implementation
   */
  private async _mockGetClubCustomCharges(clubId: string): Promise<CustomCharge[]> {
    const charges = await this._getCustomCharges();
    const filtered = charges.filter((c) => c.clubId === clubId && c.isActive);

    logger.debug(LOG_MESSAGES.PAYMENT.MOCK_CUSTOM_CHARGES_FETCHED, {
      clubId,
      count: filtered.length,
    });
    return filtered;
  }

  async deleteCustomCharge(chargeId: string): Promise<void> {
    logger.info(LOG_MESSAGES.PAYMENT.DELETING_CUSTOM_CHARGE, { chargeId });

    if (this._useMockData) {
      return this._mockDeleteCustomCharge(chargeId);
    }

    try {
      await apiService.delete<undefined>(API_ENDPOINTS.CHARGES.BY_ID(chargeId));
      logger.info(LOG_MESSAGES.PAYMENT.CUSTOM_CHARGE_DELETED, { chargeId });
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.DELETE_CUSTOM_CHARGE_FAILED, error as Error, { chargeId });
      throw error;
    }
  }

  /**
   * Mock delete custom charge implementation
   */
  private async _mockDeleteCustomCharge(chargeId: string): Promise<void> {
    const charges = await this._getCustomCharges();
    const index = charges.findIndex((c) => c.id === chargeId);

    if (index !== -1) {
      charges[index].isActive = false;
      await this._saveCustomCharges(charges);
      logger.info(LOG_MESSAGES.PAYMENT.MOCK_CUSTOM_CHARGE_DELETED, { chargeId });
    } else {
      logger.warn(LOG_MESSAGES.PAYMENT.MOCK_CUSTOM_CHARGE_NOT_FOUND, { chargeId });
    }
  }

  // ============================================
  // Balance Calculations
  // ============================================

  async getMemberBalance(userId: string, clubId: string): Promise<MemberBalance> {
    logger.debug(LOG_MESSAGES.PAYMENT.FETCHING_BALANCE, { userId, clubId });

    if (this._useMockData) {
      return this._mockGetMemberBalance(userId, clubId);
    }

    try {
      const balance = await apiService.get<MemberBalance>(
        API_ENDPOINTS.PAYMENTS.BALANCE(userId, clubId)
      );
      logger.debug(LOG_MESSAGES.PAYMENT.BALANCE_FETCHED, {
        userId,
        clubId,
        balance: balance.balance,
      });
      return balance;
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.FETCH_BALANCE_FAILED, error as Error, { userId, clubId });
      throw error;
    }
  }

  /**
   * Mock get member balance implementation
   */
  private async _mockGetMemberBalance(userId: string, clubId: string): Promise<MemberBalance> {
    const payments = await this.getMemberPayments(userId, clubId);
    const now = new Date();

    let totalOwed = 0;
    let totalPaid = 0;
    let pendingCharges = 0;
    let overdueCharges = 0;
    let lastPaymentDate: string | undefined;

    for (const payment of payments) {
      totalOwed += payment.amount;

      if (payment.status === PaymentStatus.PAID) {
        totalPaid += payment.amount;
        if (payment.paidDate && (!lastPaymentDate || payment.paidDate > lastPaymentDate)) {
          lastPaymentDate = payment.paidDate;
        }
      } else if (payment.status === PaymentStatus.PENDING) {
        pendingCharges += payment.amount;
        const dueDate = new Date(payment.dueDate);
        if (dueDate < now) {
          overdueCharges += payment.amount;
        }
      } else if (payment.status === PaymentStatus.OVERDUE) {
        overdueCharges += payment.amount;
      }
    }

    const balance: MemberBalance = {
      userId,
      clubId,
      totalOwed,
      totalPaid,
      balance: totalPaid - totalOwed,
      pendingCharges,
      overdueCharges,
      lastPaymentDate,
    };

    logger.debug(LOG_MESSAGES.PAYMENT.MOCK_BALANCE_FETCHED, {
      userId,
      clubId,
      balance: balance.balance,
    });

    return balance;
  }

  async getAllMembersBalances(clubId: string, memberIds: string[]): Promise<MemberBalance[]> {
    // Use Promise.all for parallel execution instead of sequential
    const balances = await Promise.all(
      memberIds.map((memberId) => this.getMemberBalance(memberId, clubId))
    );
    return balances;
  }

  // ============================================
  // Update Overdue Payments
  // ============================================

  async updateOverduePayments(): Promise<void> {
    const payments = await this._getPayments();
    const now = new Date();
    let updated = false;

    for (const payment of payments) {
      if (payment.status === PaymentStatus.PENDING) {
        const dueDate = new Date(payment.dueDate);
        if (dueDate < now) {
          payment.status = PaymentStatus.OVERDUE;
          payment.updatedAt = new Date().toISOString();
          updated = true;
        }
      }
    }

    if (updated) {
      await this._savePayments(payments);
    }
  }

  // ============================================
  // Notifications
  // ============================================

  async getNotificationMessage(balance: MemberBalance, userName: string): Promise<string> {
    // Using imported t function
    const locale = i18n.language === LANGUAGE.ES ? LOCALE.ES_ES : LOCALE.EN_US;
    const messages: string[] = [];

    messages.push(t('services.notification.paymentReminder.greetingSimple', { userName }));
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
        t('services.notification.paymentReminder.currentBalanceOwes', { amount: balanceAmount })
      );
    } else if (balance.balance > 0) {
      messages.push(
        t('services.notification.paymentReminder.currentBalanceCredit', { amount: balanceAmount })
      );
    } else {
      messages.push(t('services.notification.paymentReminder.currentBalancePaidUp'));
    }

    if (balance.overdueCharges > 0) {
      messages.push(
        t('services.notification.paymentReminder.overdueCharges', {
          amount: balance.overdueCharges.toFixed(NUMERIC.DECIMAL_PLACES),
        })
      );
      messages.push(t('services.notification.paymentReminder.overdueWarningLateFees'));
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
    messages.push(t('services.notification.paymentReminder.automatedMessageFull'));

    return messages.join(EMPTY_VALUE);
  }

  // ============================================
  // Reset/Clear Data (for testing)
  // ============================================

  async clearAllPaymentData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(storageKeys.PAYMENTS);
      await AsyncStorage.removeItem(storageKeys.CUSTOM_CHARGES);
    } catch (error) {
      logger.error(LOG_MESSAGES.PAYMENT.ERROR_CLEARING_DATA, error as Error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
