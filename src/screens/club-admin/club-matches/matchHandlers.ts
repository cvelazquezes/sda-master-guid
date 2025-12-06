import { Alert } from 'react-native';
import { userService } from '../../../services/userService';
import { Match, MatchStatus, User } from '../../../types';
import { logger } from '../../../shared/utils/logger';
import { ALERT_BUTTON_STYLE, LOG_MESSAGES, MESSAGES } from '../../../shared/constants';
import { sendNotification, updateMatchStatus, loadMatchesData } from './matchUtils';

export async function loadClubData(
  clubId: string,
  setMatches: (matches: Match[]) => void,
  setMatchRounds: (rounds: import('../../../types').MatchRound[]) => void,
  setRefreshing: (val: boolean) => void
): Promise<void> {
  try {
    const data = await loadMatchesData(clubId);
    setMatches(data.matches);
    setMatchRounds(data.rounds);
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_ACTIVITIES);
  } finally {
    setRefreshing(false);
  }
}

export async function fetchMatchParticipants(
  match: Match,
  setParticipants: (users: User[]) => void
): Promise<void> {
  try {
    const participants = await Promise.all(match.participants.map((id) => userService.getUser(id)));
    setParticipants(participants);
  } catch (error) {
    const errMsg = LOG_MESSAGES.SCREENS.CLUB_MATCHES.FAILED_TO_LOAD_PARTICIPANTS;
    logger.error(errMsg, error as Error);
  }
}

export function showNotifyAlert(match: Match, messageTemplate: string): void {
  const title = MESSAGES.TITLES.NOTIFY_PARTICIPANTS;
  const message = MESSAGES.WARNINGS.NOTIFY_PARTICIPANTS_MESSAGE;
  Alert.alert(title, message, [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    { text: 'Send', onPress: (): void => sendNotification(match, messageTemplate) },
  ]);
}

export async function handleStatusUpdate(
  matchId: string,
  status: MatchStatus,
  loadData: () => void,
  closeModal: () => void
): Promise<void> {
  try {
    await updateMatchStatus(matchId, status);
    loadData();
    closeModal();
    Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.MATCH_STATUS_UPDATED);
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_MATCH_STATUS);
  }
}
