import { Alert } from 'react-native';
import { User } from '../../../types';
import {
  ALERT_BUTTON_STYLE,
  MESSAGES,
  ID_PREFIX,
  MEETING_AGENDA,
  EMPTY_VALUE,
  MOVE_DIRECTION,
} from '../../../shared/constants';
import { AgendaItem } from './types';

interface EditModalSetters {
  setCurrentItem: (i: AgendaItem | null) => void;
  setEditedTitle: (t: string) => void;
  setEditedMinutes: (m: string) => void;
  setEditedDescription: (d: string) => void;
  setEditModalVisible: (v: boolean) => void;
}

interface AddItemOptions extends EditModalSetters {
  agendaItems: AgendaItem[];
  t: (key: string) => string;
}

export function handleAddItem(options: AddItemOptions): void {
  const {
    agendaItems,
    setCurrentItem,
    setEditedTitle,
    setEditedMinutes,
    setEditedDescription,
    setEditModalVisible,
    t,
  } = options;

  const newItem: AgendaItem = {
    id: `${ID_PREFIX.ITEM}-${Date.now()}`,
    title: t('screens.meetingPlanner.newActivity'),
    estimatedMinutes: MEETING_AGENDA.DEFAULT_MINUTES,
    order: agendaItems.length,
  };
  setCurrentItem(newItem);
  setEditedTitle(newItem.title);
  setEditedMinutes(newItem.estimatedMinutes.toString());
  setEditedDescription(EMPTY_VALUE);
  setEditModalVisible(true);
}

interface EditItemOptions extends Omit<EditModalSetters, 'setCurrentItem'> {
  item: AgendaItem;
  setCurrentItem: (i: AgendaItem) => void;
}

export function handleEditItem(options: EditItemOptions): void {
  const {
    item,
    setCurrentItem,
    setEditedTitle,
    setEditedMinutes,
    setEditedDescription,
    setEditModalVisible,
  } = options;

  setCurrentItem(item);
  setEditedTitle(item.title);
  setEditedMinutes(item.estimatedMinutes.toString());
  setEditedDescription(item.description || EMPTY_VALUE);
  setEditModalVisible(true);
}

interface SaveItemOptions {
  currentItem: AgendaItem | null;
  editedTitle: string;
  editedMinutes: string;
  editedDescription: string;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
  setEditModalVisible: (v: boolean) => void;
  setCurrentItem: (i: AgendaItem | null) => void;
}

export function handleSaveItem(options: SaveItemOptions): void {
  const {
    currentItem,
    editedTitle,
    editedMinutes,
    editedDescription,
    agendaItems,
    setAgendaItems,
    setEditModalVisible,
    setCurrentItem,
  } = options;

  if (!currentItem || !editedTitle.trim()) {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_ENTER_TITLE);
    return;
  }
  const minutes = parseInt(editedMinutes) || MEETING_AGENDA.DEFAULT_MINUTES;
  const updatedItem: AgendaItem = {
    ...currentItem,
    title: editedTitle.trim(),
    estimatedMinutes: minutes,
    description: editedDescription.trim(),
  };
  if (agendaItems.find((i) => i.id === currentItem.id)) {
    setAgendaItems(agendaItems.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
  } else {
    setAgendaItems([...agendaItems, updatedItem]);
  }
  setEditModalVisible(false);
  setCurrentItem(null);
}

interface DeleteItemOptions {
  itemId: string;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
}

export function handleDeleteItem(options: DeleteItemOptions): void {
  const { itemId, agendaItems, setAgendaItems } = options;

  Alert.alert(MESSAGES.TITLES.DELETE_ACTIVITY, MESSAGES.WARNINGS.CONFIRM_DELETE_ACTIVITY, [
    { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: MESSAGES.BUTTONS.DELETE,
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: (): void => {
        setAgendaItems(agendaItems.filter((i) => i.id !== itemId));
      },
    },
  ]);
}

interface SelectMemberOptions {
  member: User;
  currentItem: AgendaItem | null;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
  setSelectMemberModalVisible: (v: boolean) => void;
  setCurrentItem: (i: AgendaItem | null) => void;
}

export function handleSelectMember(options: SelectMemberOptions): void {
  const {
    member,
    currentItem,
    agendaItems,
    setAgendaItems,
    setSelectMemberModalVisible,
    setCurrentItem,
  } = options;

  if (!currentItem) {
    return;
  }
  setAgendaItems(
    agendaItems.map((i) =>
      i.id === currentItem.id
        ? { ...i, responsibleMemberId: member.id, responsibleMemberName: member.name }
        : i
    )
  );
  setSelectMemberModalVisible(false);
  setCurrentItem(null);
}

interface RemoveMemberOptions {
  itemId: string;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
}

export function handleRemoveMember(options: RemoveMemberOptions): void {
  const { itemId, agendaItems, setAgendaItems } = options;

  setAgendaItems(
    agendaItems.map((i) =>
      i.id === itemId
        ? { ...i, responsibleMemberId: undefined, responsibleMemberName: undefined }
        : i
    )
  );
}

interface MoveItemOptions {
  index: number;
  direction: typeof MOVE_DIRECTION.UP | typeof MOVE_DIRECTION.DOWN;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
}

export function handleMoveItem(options: MoveItemOptions): void {
  const { index, direction, agendaItems, setAgendaItems } = options;

  const newItems = [...agendaItems];
  const targetIndex = direction === MOVE_DIRECTION.UP ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= newItems.length) {
    return;
  }
  [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
  newItems.forEach((item, idx) => {
    item.order = idx;
  });
  setAgendaItems(newItems);
}
