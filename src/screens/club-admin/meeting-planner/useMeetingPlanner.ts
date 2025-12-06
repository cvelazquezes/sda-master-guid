import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { userService } from '../../../services/userService';
import { User } from '../../../types';
import { ID_PREFIX, MESSAGES } from '../../../shared/constants';
import { LOG_MESSAGES } from '../../../shared/constants/logMessages';
import { logger } from '../../../shared/utils/logger';
import { AgendaItem } from './types';

interface UseMeetingPlannerReturn {
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
  clubMembers: User[];
  meetingDate: Date;
  setMeetingDate: (d: Date) => void;
  meetingTitle: string;
  setMeetingTitle: (t: string) => void;
  isSaved: boolean;
  setIsSaved: (s: boolean) => void;
}

export function useMeetingPlanner(
  clubId: string | undefined,
  getDefaultAgenda: () => Omit<AgendaItem, 'id' | 'order'>[],
  defaultTitle: string
): UseMeetingPlannerReturn {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [clubMembers, setClubMembers] = useState<User[]>([]);
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTitle, setMeetingTitle] = useState(defaultTitle);
  const [isSaved, setIsSaved] = useState(false);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      const defaultAgenda = getDefaultAgenda().map((item, index) => ({
        ...item,
        id: `${ID_PREFIX.ITEM}-${index}`,
        order: index,
      }));
      setAgendaItems(defaultAgenda);

      if (clubId) {
        const members = await userService.getUsersByClub(clubId);
        setClubMembers(members.filter((m) => m.isActive));
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.MEETING_PLANNER.FAILED_TO_LOAD_DATA, error as Error);
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_MEETING_DATA);
    }
  }, [clubId, getDefaultAgenda]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    agendaItems,
    setAgendaItems,
    clubMembers,
    meetingDate,
    setMeetingDate,
    meetingTitle,
    setMeetingTitle,
    isSaved,
    setIsSaved,
  };
}
