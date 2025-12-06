import { Alert } from 'react-native';
import { User } from '../../../types';
import {
  ALERT_BUTTON_STYLE,
  DATE_LOCALE_OPTIONS,
  MESSAGES,
  ID_PREFIX,
} from '../../../shared/constants';
import { AgendaItem } from './types';

interface SaveMeetingOptions {
  agendaItems: AgendaItem[];
  meetingDate: Date;
  setIsSaved: (v: boolean) => void;
  setShareModalVisible: (v: boolean) => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function handleSaveMeeting(options: SaveMeetingOptions): void {
  const { agendaItems, meetingDate, setIsSaved, setShareModalVisible, t } = options;

  const unassignedItems = agendaItems.filter((item) => !item.responsibleMemberId);
  if (unassignedItems.length > 0) {
    Alert.alert(
      MESSAGES.TITLES.MISSING_ASSIGNMENTS,
      MESSAGES.WARNINGS.PLEASE_ASSIGN_ALL_ACTIVITIES,
      [{ text: MESSAGES.BUTTONS.OK }]
    );
    return;
  }
  setIsSaved(true);
  Alert.alert(
    MESSAGES.TITLES.MEETING_SAVED_TITLE,
    t('screens.meetingPlanner.meetingSavedSuccess', {
      date: meetingDate.toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.DATE_WITHOUT_YEAR),
    }),
    [{ text: MESSAGES.BUTTONS.OK, onPress: (): void => setShareModalVisible(true) }]
  );
}

interface ConfirmShareOptions {
  clubMembers: User[];
  setShareModalVisible: (v: boolean) => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function confirmShareMeeting(options: ConfirmShareOptions): void {
  const { clubMembers, setShareModalVisible, t } = options;

  Alert.alert(
    MESSAGES.TITLES.MEETING_SHARED_TITLE,
    t('screens.meetingPlanner.meetingSharedSuccess', { count: clubMembers.length }),
    [{ text: MESSAGES.BUTTONS.OK, onPress: (): void => setShareModalVisible(false) }]
  );
}

interface ResetToDefaultOptions {
  getDefaultAgenda: () => Omit<AgendaItem, 'id' | 'order'>[];
  setAgendaItems: (items: AgendaItem[]) => void;
  setIsSaved: (v: boolean) => void;
  t: (key: string) => string;
}

export function handleResetToDefault(options: ResetToDefaultOptions): void {
  const { getDefaultAgenda, setAgendaItems, setIsSaved, t } = options;

  Alert.alert(MESSAGES.TITLES.RESET_TO_DEFAULT_TITLE, MESSAGES.WARNINGS.CONFIRM_RESET_MEETING, [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('screens.meetingPlanner.reset'),
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: (): void => {
        const defaultAgenda = getDefaultAgenda().map((item, index) => ({
          ...item,
          id: `${ID_PREFIX.ITEM}-${Date.now()}-${index}`,
          order: index,
        }));
        setAgendaItems(defaultAgenda);
        setIsSaved(false);
      },
    },
  ]);
}

interface NewMeetingOptions {
  getDefaultAgenda: () => Omit<AgendaItem, 'id' | 'order'>[];
  setAgendaItems: (items: AgendaItem[]) => void;
  setMeetingDate: (d: Date) => void;
  setMeetingTitle: (t: string) => void;
  setIsSaved: (v: boolean) => void;
  defaultTitle: string;
  t: (key: string) => string;
}

export function handleNewMeeting(options: NewMeetingOptions): void {
  const {
    getDefaultAgenda,
    setAgendaItems,
    setMeetingDate,
    setMeetingTitle,
    setIsSaved,
    defaultTitle,
    t,
  } = options;

  Alert.alert(MESSAGES.TITLES.CREATE_NEW_MEETING, MESSAGES.WARNINGS.CONFIRM_NEW_MEETING, [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('screens.meetingPlanner.createNew'),
      onPress: (): void => {
        const defaultAgenda = getDefaultAgenda().map((item, index) => ({
          ...item,
          id: `${ID_PREFIX.ITEM}-${Date.now()}-${index}`,
          order: index,
        }));
        setAgendaItems(defaultAgenda);
        setMeetingDate(new Date());
        setMeetingTitle(defaultTitle);
        setIsSaved(false);
      },
    },
  ]);
}
