import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Match, MatchStatus, User, MatchRound } from '../../../../types';
import { FILTER_STATUS } from '../../../../shared/constants';
import { calculateStats } from './matchUtils';
import {
  loadClubData,
  fetchMatchParticipants,
  showNotifyAlert,
  handleStatusUpdate,
} from './matchHandlers';

export interface UseClubMatchesReturn {
  matchRounds: MatchRound[];
  filteredMatches: Match[];
  refreshing: boolean;
  selectedMatch: Match | null;
  matchParticipants: User[];
  detailModalVisible: boolean;
  filterStatus: MatchStatus | typeof FILTER_STATUS.ALL;
  setFilterStatus: (status: MatchStatus | typeof FILTER_STATUS.ALL) => void;
  onRefresh: () => void;
  handleViewMatchDetails: (match: Match) => Promise<void>;
  handleNotifyMatch: (match: Match) => void;
  handleUpdateMatchStatus: (matchId: string, status: MatchStatus) => Promise<void>;
  closeModal: () => void;
  stats: ReturnType<typeof calculateStats>;
}

type FilterStatusType = MatchStatus | typeof FILTER_STATUS.ALL;

export function useClubMatches(clubId?: string): UseClubMatchesReturn {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchRounds, setMatchRounds] = useState<MatchRound[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchParticipants, setMatchParticipants] = useState<User[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatusType>(FILTER_STATUS.ALL);

  const loadData = useCallback((): void => {
    if (clubId) {
      loadClubData(clubId, setMatches, setMatchRounds, setRefreshing);
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      loadData();
    }
  }, [clubId, loadData]);

  useEffect(() => {
    const filtered =
      filterStatus === FILTER_STATUS.ALL
        ? matches
        : matches.filter((m) => m.status === filterStatus);
    setFilteredMatches(filtered);
  }, [matches, filterStatus]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadData();
  };
  const closeModal = (): void => {
    setDetailModalVisible(false);
    setSelectedMatch(null);
    setMatchParticipants([]);
  };

  const handleViewMatchDetails = async (match: Match): Promise<void> => {
    setSelectedMatch(match);
    setDetailModalVisible(true);
    fetchMatchParticipants(match, setMatchParticipants);
  };

  const handleNotifyMatch = (match: Match): void => {
    showNotifyAlert(match, t('screens.clubMatches.whatsappGroupMessage'));
  };

  const handleUpdateMatchStatus = (matchId: string, status: MatchStatus): Promise<void> =>
    handleStatusUpdate(matchId, status, loadData, closeModal);

  return {
    matchRounds,
    filteredMatches,
    refreshing,
    selectedMatch,
    matchParticipants,
    detailModalVisible,
    filterStatus,
    setFilterStatus,
    onRefresh,
    handleViewMatchDetails,
    handleNotifyMatch,
    handleUpdateMatchStatus,
    closeModal,
    stats: calculateStats(matches),
  };
}
