/**
 * Payment Service
 * Handles payment and fee management with mock/backend toggle
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';
import {
  MemberPayment,
  CustomCharge,
  MemberBalance,
  ClubFeeSettings,
  PaymentStatus,
  ChargeType,
  User,
} from '../types';

const PAYMENTS_KEY = '@sda_payments';
const CUSTOM_CHARGES_KEY = '@sda_custom_charges';

interface GenerateFeesRequest {
  clubId: string;
  year: number;
}

interface CreateCustomChargeRequest {
  clubId: string;
  description: string;
  amount: number;
  dueDate: string;
  appliedToUserIds: string[];
}

class PaymentService {
  private useMockData = environment.useMockData;
  // ============================================
  // Storage Management
  // ============================================

  private async getPayments(): Promise<MemberPayment[]> {
    try {
      const data = await AsyncStorage.getItem(PAYMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading payments:', error);
      return [];
    }
  }

  private async savePayments(payments: MemberPayment[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    } catch (error) {
      console.error('Error saving payments:', error);
      throw error;
    }
  }

  private async getCustomCharges(): Promise<CustomCharge[]> {
    try {
      const data = await AsyncStorage.getItem(CUSTOM_CHARGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading custom charges:', error);
      return [];
    }
  }

  private async saveCustomCharges(charges: CustomCharge[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CUSTOM_CHARGES_KEY, JSON.stringify(charges));
    } catch (error) {
      console.error('Error saving custom charges:', error);
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
    logger.info('Generating monthly fees', { clubId, year, memberCount: members.length });

    if (this.useMockData) {
      return this.mockGenerateMonthlyFees(clubId, members, feeSettings, year);
    }

    try {
      const request: GenerateFeesRequest = { clubId, year };
      await apiService.post<void>('/payments/generate', request);
      logger.info('Monthly fees generated', { clubId, year });
    } catch (error) {
      logger.error('Failed to generate monthly fees', error as Error, { clubId, year });
      throw error;
    }
  }

  /**
   * Mock generate monthly fees implementation
   */
  private async mockGenerateMonthlyFees(
    clubId: string,
    members: User[],
    feeSettings: ClubFeeSettings,
    year: number
  ): Promise<void> {
    const payments = await this.getPayments();
    const now = new Date().toISOString();

    // Filter only approved and active members
    const eligibleMembers = members.filter(
      (m) => m.approvalStatus === 'approved' && m.isActive
    );

    logger.debug('Mock: Generating fees for eligible members', {
      clubId,
      year,
      eligibleCount: eligibleMembers.length,
    });

    for (const member of eligibleMembers) {
      for (const month of feeSettings.activeMonths) {
        // Check if payment already exists
        const existingPayment = payments.find(
          (p) =>
            p.userId === member.id &&
            p.clubId === clubId &&
            p.year === year &&
            p.month === month
        );

        if (!existingPayment) {
          // Create due date (last day of the month)
          const dueDate = new Date(year, month, 0); // 0 = last day of previous month, so month gives us last day of that month

          const newPayment: MemberPayment = {
            id: `payment_${clubId}_${member.id}_${year}_${month}_${Date.now()}`,
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

    await this.savePayments(payments);
    logger.info('Mock: Monthly fees generated', { clubId, year, paymentsCreated: payments.length });
  }

  async getClubPayments(clubId: string, year?: number): Promise<MemberPayment[]> {
    logger.debug('Fetching club payments', { clubId, year });

    if (this.useMockData) {
      return this.mockGetClubPayments(clubId, year);
    }

    try {
      const url = year
        ? `/payments?clubId=${clubId}&year=${year}`
        : `/payments?clubId=${clubId}`;
      const payments = await apiService.get<MemberPayment[]>(url);
      logger.debug('Club payments fetched', { clubId, year, count: payments.length });
      return payments;
    } catch (error) {
      logger.error('Failed to fetch club payments', error as Error, { clubId, year });
      throw error;
    }
  }

  /**
   * Mock get club payments implementation
   */
  private async mockGetClubPayments(clubId: string, year?: number): Promise<MemberPayment[]> {
    const payments = await this.getPayments();
    const filtered = payments.filter((p) => {
      if (p.clubId !== clubId) return false;
      if (year && p.year !== year) return false;
      return true;
    });

    logger.debug('Mock: Club payments fetched', { clubId, year, count: filtered.length });
    return filtered;
  }

  async getMemberPayments(userId: string, clubId: string): Promise<MemberPayment[]> {
    logger.debug('Fetching member payments', { userId, clubId });

    if (this.useMockData) {
      return this.mockGetMemberPayments(userId, clubId);
    }

    try {
      const payments = await apiService.get<MemberPayment[]>(
        `/payments/member/${userId}?clubId=${clubId}`
      );
      logger.debug('Member payments fetched', { userId, clubId, count: payments.length });
      return payments;
    } catch (error) {
      logger.error('Failed to fetch member payments', error as Error, { userId, clubId });
      throw error;
    }
  }

  /**
   * Mock get member payments implementation
   */
  private async mockGetMemberPayments(userId: string, clubId: string): Promise<MemberPayment[]> {
    const payments = await this.getPayments();
    const filtered = payments.filter((p) => p.userId === userId && p.clubId === clubId);

    logger.debug('Mock: Member payments fetched', { userId, clubId, count: filtered.length });
    return filtered;
  }

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    paidDate?: string,
    notes?: string
  ): Promise<void> {
    logger.info('Updating payment status', { paymentId, status });

    if (this.useMockData) {
      return this.mockUpdatePaymentStatus(paymentId, status, paidDate, notes);
    }

    try {
      await apiService.patch<void>(`/payments/${paymentId}`, {
        status,
        paidDate,
        notes,
      });
      logger.info('Payment status updated', { paymentId, status });
    } catch (error) {
      logger.error('Failed to update payment status', error as Error, { paymentId, status });
      throw error;
    }
  }

  /**
   * Mock update payment status implementation
   */
  private async mockUpdatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    paidDate?: string,
    notes?: string
  ): Promise<void> {
    const payments = await this.getPayments();
    const payment = payments.find((p) => p.id === paymentId);

    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date().toISOString();
      if (paidDate) payment.paidDate = paidDate;
      if (notes !== undefined) payment.notes = notes;

      await this.savePayments(payments);
      logger.info('Mock: Payment status updated', { paymentId, status });
    } else {
      logger.warn('Mock: Payment not found', { paymentId });
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
    logger.info('Creating custom charge', {
      clubId,
      description,
      amount,
      userCount: appliedToUserIds.length,
    });

    if (this.useMockData) {
      return this.mockCreateCustomCharge(
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
      const charge = await apiService.post<CustomCharge>('/charges/custom', request);
      logger.info('Custom charge created', { chargeId: charge.id, clubId });
      return charge;
    } catch (error) {
      logger.error('Failed to create custom charge', error as Error, { clubId, description });
      throw error;
    }
  }

  /**
   * Mock create custom charge implementation
   */
  private async mockCreateCustomCharge(
    clubId: string,
    description: string,
    amount: number,
    dueDate: string,
    appliedToUserIds: string[],
    createdBy: string
  ): Promise<CustomCharge> {
    const charges = await this.getCustomCharges();
    const now = new Date().toISOString();

    const newCharge: CustomCharge = {
      id: `charge_${clubId}_${Date.now()}`,
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
    await this.saveCustomCharges(charges);

    // Create payment records for this charge
    await this.applyCustomChargeToMembers(newCharge, appliedToUserIds);

    logger.info('Mock: Custom charge created', { chargeId: newCharge.id, clubId });
    return newCharge;
  }

  private async applyCustomChargeToMembers(
    charge: CustomCharge,
    userIds: string[]
  ): Promise<void> {
    const payments = await this.getPayments();
    const now = new Date().toISOString();
    const dueDate = new Date(charge.dueDate);

    // Create payment record for each selected user
    for (const userId of userIds) {
      const newPayment: MemberPayment = {
        id: `payment_${charge.id}_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      await new Promise(resolve => setTimeout(resolve, 5)); // Minimal delay for unique IDs
    }

    await this.savePayments(payments);
  }

  async getClubCustomCharges(clubId: string): Promise<CustomCharge[]> {
    logger.debug('Fetching club custom charges', { clubId });

    if (this.useMockData) {
      return this.mockGetClubCustomCharges(clubId);
    }

    try {
      const charges = await apiService.get<CustomCharge[]>(
        `/charges/custom?clubId=${clubId}`
      );
      logger.debug('Club custom charges fetched', { clubId, count: charges.length });
      return charges;
    } catch (error) {
      logger.error('Failed to fetch club custom charges', error as Error, { clubId });
      throw error;
    }
  }

  /**
   * Mock get club custom charges implementation
   */
  private async mockGetClubCustomCharges(clubId: string): Promise<CustomCharge[]> {
    const charges = await this.getCustomCharges();
    const filtered = charges.filter((c) => c.clubId === clubId && c.isActive);

    logger.debug('Mock: Club custom charges fetched', { clubId, count: filtered.length });
    return filtered;
  }

  async deleteCustomCharge(chargeId: string): Promise<void> {
    logger.info('Deleting custom charge', { chargeId });

    if (this.useMockData) {
      return this.mockDeleteCustomCharge(chargeId);
    }

    try {
      await apiService.delete<void>(`/charges/custom/${chargeId}`);
      logger.info('Custom charge deleted', { chargeId });
    } catch (error) {
      logger.error('Failed to delete custom charge', error as Error, { chargeId });
      throw error;
    }
  }

  /**
   * Mock delete custom charge implementation
   */
  private async mockDeleteCustomCharge(chargeId: string): Promise<void> {
    const charges = await this.getCustomCharges();
    const index = charges.findIndex((c) => c.id === chargeId);

    if (index !== -1) {
      charges[index].isActive = false;
      await this.saveCustomCharges(charges);
      logger.info('Mock: Custom charge deleted', { chargeId });
    } else {
      logger.warn('Mock: Custom charge not found', { chargeId });
    }
  }

  // ============================================
  // Balance Calculations
  // ============================================

  async getMemberBalance(userId: string, clubId: string): Promise<MemberBalance> {
    logger.debug('Fetching member balance', { userId, clubId });

    if (this.useMockData) {
      return this.mockGetMemberBalance(userId, clubId);
    }

    try {
      const balance = await apiService.get<MemberBalance>(
        `/payments/balance/${userId}?clubId=${clubId}`
      );
      logger.debug('Member balance fetched', { userId, clubId, balance: balance.balance });
      return balance;
    } catch (error) {
      logger.error('Failed to fetch member balance', error as Error, { userId, clubId });
      throw error;
    }
  }

  /**
   * Mock get member balance implementation
   */
  private async mockGetMemberBalance(userId: string, clubId: string): Promise<MemberBalance> {
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
        if (!lastPaymentDate || payment.paidDate! > lastPaymentDate) {
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

    logger.debug('Mock: Member balance fetched', {
      userId,
      clubId,
      balance: balance.balance,
    });

    return balance;
  }

  async getAllMembersBalances(
    clubId: string,
    memberIds: string[]
  ): Promise<MemberBalance[]> {
    const balances: MemberBalance[] = [];

    for (const memberId of memberIds) {
      const balance = await this.getMemberBalance(memberId, clubId);
      balances.push(balance);
    }

    return balances;
  }

  // ============================================
  // Update Overdue Payments
  // ============================================

  async updateOverduePayments(): Promise<void> {
    const payments = await this.getPayments();
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
      await this.savePayments(payments);
    }
  }

  // ============================================
  // Notifications
  // ============================================

  async getNotificationMessage(balance: MemberBalance, userName: string): Promise<string> {
    const messages: string[] = [];

    messages.push(`Hello ${userName},`);
    messages.push(`\n📊 *Account Status:*`);
    messages.push(`\n💰 Total Owed: $${balance.totalOwed.toFixed(2)}`);
    messages.push(`✅ Total Paid: $${balance.totalPaid.toFixed(2)}`);

    const balanceAmount = Math.abs(balance.balance).toFixed(2);
    if (balance.balance < 0) {
      messages.push(`\n📍 *Current Balance: $${balanceAmount} (owes)*`);
    } else if (balance.balance > 0) {
      messages.push(`\n📍 Current Balance: $${balanceAmount} (credit)`);
    } else {
      messages.push(`\n📍 Current Balance: $0.00 (paid up)`);
    }

    if (balance.overdueCharges > 0) {
      messages.push(`\n⚠️ *Overdue Charges: $${balance.overdueCharges.toFixed(2)}*`);
      messages.push(`\nPlease pay as soon as possible to avoid late fees.`);
    } else if (balance.pendingCharges > 0) {
      messages.push(`\n⏳ Pending Charges: $${balance.pendingCharges.toFixed(2)}`);
    }

    if (balance.lastPaymentDate) {
      const lastPayment = new Date(balance.lastPaymentDate);
      messages.push(`\n📅 Last Payment: ${lastPayment.toLocaleDateString('en-US')}`);
    }

    messages.push(`\n\nThank you for your participation in the club! 🙏`);
    messages.push(`\n_Automated message from the fee management system_`);

    return messages.join('');
  }

  // ============================================
  // Reset/Clear Data (for testing)
  // ============================================

  async clearAllPaymentData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PAYMENTS_KEY);
      await AsyncStorage.removeItem(CUSTOM_CHARGES_KEY);
    } catch (error) {
      console.error('Error clearing payment data:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();

