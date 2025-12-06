import { Alert, Linking } from 'react-native';
import { matchService } from '../../../services/matchService';
import { userService } from '../../../services/userService';
import { Match, MatchRound, MatchStatus } from '../../../types';
import { EMPTY_VALUE, EXTERNAL_URLS, MESSAGES, VALIDATION } from '../../../shared/constants';

interface MatchesDataResult {
  matches: Match[];
  rounds: MatchRound[];
}

interface DateSortable {
  createdAt: string;
}

function sortByDate<T extends DateSortable>(a: T, b: T): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export async function loadMatchesData(clubId: string): Promise<MatchesDataResult> {
  const [matchesData, roundsData] = await Promise.all([
    matchService.getClubMatches(clubId),
    matchService.getMatchRounds(clubId),
  ]);

  return {
    matches: matchesData.sort(sortByDate),
    rounds: roundsData.sort(sortByDate),
  };
}

export async function sendNotification(match: Match, messageText: string): Promise<void> {
  try {
    const participants = await Promise.all(match.participants.map((id) => userService.getUser(id)));
    const phoneNumbers = participants
      .filter((p) => p.whatsappNumber)
      .map((p) => p.whatsappNumber.replace(VALIDATION.WHATSAPP.STRIP_NON_DIGITS, EMPTY_VALUE))
      .join(',');

    if (phoneNumbers) {
      const encodedMsg = encodeURIComponent(messageText);
      const url = `${EXTERNAL_URLS.WHATSAPP_GROUP}?text=${encodedMsg}&phone=${phoneNumbers}`;
      Linking.openURL(url);
    }
  } catch {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_SEND_NOTIFICATION);
  }
}

export async function updateMatchStatus(matchId: string, status: MatchStatus): Promise<void> {
  await matchService.updateMatchStatus(matchId, status);
}

export interface MatchStats {
  total: number;
  pending: number;
  scheduled: number;
  completed: number;
  skipped: number;
}

export function calculateStats(matches: Match[]): MatchStats {
  return {
    total: matches.length,
    pending: matches.filter((m) => m.status === MatchStatus.PENDING).length,
    scheduled: matches.filter((m) => m.status === MatchStatus.SCHEDULED).length,
    completed: matches.filter((m) => m.status === MatchStatus.COMPLETED).length,
    skipped: matches.filter((m) => m.status === MatchStatus.SKIPPED).length,
  };
}
