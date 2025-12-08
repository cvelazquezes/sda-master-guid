import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { clubService } from '../../../services/clubService';
import { paymentService } from '../../../services/paymentService';
import { User, Club, MemberBalance, CustomCharge, ApprovalStatus } from '../../../types';

interface UseClubFeesReturn {
  club: Club | null;
  setClub: (c: Club | null) => void;
  members: User[];
  balances: MemberBalance[];
  customCharges: CustomCharge[];
  refreshing: boolean;
  loading: boolean;
  loadData: () => Promise<void>;
  onRefresh: () => void;
}

export function useClubFees(
  clubId: string | undefined,
  t: (key: string) => string
): UseClubFeesReturn {
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [balances, setBalances] = useState<MemberBalance[]>([]);
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (): Promise<void> => {
    if (!clubId) {
      return;
    }
    try {
      setLoading(true);
      const [clubData, membersData, chargesData] = await Promise.all([
        clubService.getClub(clubId),
        clubService.getClubMembers(clubId),
        paymentService.getClubCustomCharges(clubId),
      ]);
      setClub(clubData);
      setMembers(membersData.filter((m) => m.approvalStatus === ApprovalStatus.APPROVED));
      setCustomCharges(chargesData);

      const approvedMemberIds = membersData
        .filter((m) => m.approvalStatus === ApprovalStatus.APPROVED)
        .map((m) => m.id);
      const balancesData = await paymentService.getAllMembersBalances(clubId, approvedMemberIds);
      setBalances(balancesData);
    } catch {
      Alert.alert(t('common.error'), t('screens.clubFees.failedToLoad'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadData();
  };

  return {
    club,
    setClub,
    members,
    balances,
    customCharges,
    refreshing,
    loading,
    loadData,
    onRefresh,
  };
}
