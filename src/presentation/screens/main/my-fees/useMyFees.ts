import { useState, useEffect, useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { clubService } from '../../../../infrastructure/repositories/clubService';
import { paymentService } from '../../../../infrastructure/repositories/paymentService';
import { Club, MemberBalance, MemberPayment, CustomCharge } from '../../../../types';
import { DURATION, DISPLAY_LIMITS } from '../../../../shared/constants';
import { LOG_MESSAGES } from '../../../../shared/constants/logMessages';
import { logger } from '../../../../shared/utils/logger';

interface UseMyFeesReturn {
  club: Club | null;
  balance: MemberBalance | null;
  payments: MemberPayment[];
  customCharges: CustomCharge[];
  refreshing: boolean;
  loading: boolean;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  onRefresh: () => void;
}

export function useMyFees(userId: string | undefined, clubId: string | undefined): UseMyFeesReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [balance, setBalance] = useState<MemberBalance | null>(null);
  const [payments, setPayments] = useState<MemberPayment[]>([]);
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(DISPLAY_LIMITS.TIMEOUT_DAYS)).current;

  const loadData = useCallback(async (): Promise<void> => {
    if (!clubId || !userId) {
      return;
    }
    try {
      setLoading(true);
      const [clubData, balanceData, paymentsData, chargesData] = await Promise.all([
        clubService.getClub(clubId),
        paymentService.getMemberBalance(userId, clubId),
        paymentService.getMemberPayments(userId, clubId),
        paymentService.getClubCustomCharges(clubId),
      ]);
      setClub(clubData);
      setBalance(balanceData);
      setPayments(paymentsData);
      const userCharges = chargesData.filter(
        (charge) => charge.appliedToUserIds.length === 0 || charge.appliedToUserIds.includes(userId)
      );
      setCustomCharges(userCharges);
    } catch (error) {
      logger.error(LOG_MESSAGES.MY_FEES.FAILED_TO_LOAD_DATA, error as Error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: DURATION.SLOW,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: DURATION.SLOW,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, fadeAnim, slideAnim]);

  const onRefresh = useCallback((): void => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  return {
    club,
    balance,
    payments,
    customCharges,
    refreshing,
    loading,
    fadeAnim,
    slideAnim,
    onRefresh,
  };
}
