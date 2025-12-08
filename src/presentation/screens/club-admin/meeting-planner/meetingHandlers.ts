import { Alert } from 'react-native';
import { User } from '../../../../types';
import { ALERT_BUTTON_STYLE, DATE_LOCALE_OPTIONS, ID_PREFIX } from '../../../../shared/constants';
import { AgendaItem } from './types';

type TranslationFn = (key: string, opts?: Record<string, unknown>) => string;

interface SaveMeetingOptions {
  agendaItems: AgendaItem[];
  meetingDate: Date;
  setIsSaved: (v: boolean) => void;
  setShareModalVisible: (v: boolean) => void;
  t: TranslationFn;
}

export function handleSaveMeeting(options: SaveMeetingOptions): void {
  const { agendaItems, meetingDate, setIsSaved, setShareModalVisible, t } = options;

  const unassignedItems = agendaItems.filter((item) => !item.responsibleMemberId);
  if (unassignedItems.length > 0) {
    Alert.alert(t('titles.missingAssignments'), t('warnings.pleaseAssignAllActivities'), [
      { text: t('common.ok') },
    ]);
    return;
  }
  setIsSaved(true);
  Alert.alert(
    t('titles.meetingSaved'),
    t('screens.meetingPlanner.meetingSavedSuccess', {
      date: meetingDate.toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.DATE_WITHOUT_YEAR),
    }),
    [{ text: t('common.ok'), onPress: (): void => setShareModalVisible(true) }]
  );
}

interface ConfirmShareOptions {
  clubMembers: User[];
  setShareModalVisible: (v: boolean) => void;
  t: TranslationFn;
}

export function confirmShareMeeting(options: ConfirmShareOptions): void {
  const { clubMembers, setShareModalVisible, t } = options;

  Alert.alert(
    t('titles.meetingShared'),
    t('screens.meetingPlanner.meetingSharedSuccess', { count: clubMembers.length }),
    [{ text: t('common.ok'), onPress: (): void => setShareModalVisible(false) }]
  );
}

interface ResetToDefaultOptions {
  getDefaultAgenda: () => Omit<AgendaItem, 'id' | 'order'>[];
  setAgendaItems: (items: AgendaItem[]) => void;
  setIsSaved: (v: boolean) => void;
  t: TranslationFn;
}

export function handleResetToDefault(options: ResetToDefaultOptions): void {
  const { getDefaultAgenda, setAgendaItems, setIsSaved, t } = options;

  Alert.alert(t('titles.resetToDefault'), t('warnings.confirmResetMeeting'), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
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
  setMeetingTitle: (title: string) => void;
  setIsSaved: (v: boolean) => void;
  defaultTitle: string;
  t: TranslationFn;
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

  Alert.alert(t('titles.createNewMeeting'), t('warnings.confirmNewMeeting'), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
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
