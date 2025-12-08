import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { clubService } from '../../../../infrastructure/repositories/clubService';
import { paymentService } from '../../../../infrastructure/repositories/paymentService';
import { User, Club, MemberBalance, ApprovalStatus } from '../../../../types';

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

interface UseClubMembersReturn {
  members: User[];
  balances: MemberBalance[];
  refreshing: boolean;
  loadData: () => Promise<void>;
  onRefresh: () => void;
}

export function useClubMembers(clubId: string | undefined, t: TranslationFn): UseClubMembersReturn {
  const [members, setMembers] = useState<User[]>([]);
  const [, setClub] = useState<Club | null>(null);
  const [balances, setBalances] = useState<MemberBalance[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (): Promise<void> => {
    if (!clubId) {
      return;
    }
    try {
      const [membersData, clubData] = await Promise.all([
        clubService.getClubMembers(clubId),
        clubService.getClub(clubId),
      ]);
      setMembers(membersData);
      setClub(clubData);

      const approvedMemberIds = membersData
        .filter((m) => m.approvalStatus === ApprovalStatus.APPROVED)
        .map((m) => m.id);

      if (approvedMemberIds.length > 0) {
        const balancesData = await paymentService.getAllMembersBalances(clubId, approvedMemberIds);
        setBalances(balancesData);
      }
    } catch {
      Alert.alert(t('common.error'), t('errors.failedToLoadData'));
    } finally {
      setRefreshing(false);
    }
  }, [clubId, t]);

  useEffect(() => {
    if (clubId) {
      loadData();
    }
  }, [clubId, loadData]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadData();
  };

  return { members, balances, refreshing, loadData, onRefresh };
}
