import { Alert } from 'react-native';
import {
  ALERT_BUTTON_STYLE,
  ID_PREFIX,
  MEETING_AGENDA,
  EMPTY_VALUE,
  MOVE_DIRECTION,
} from '../../../../shared/constants';
import type { AgendaItem } from './types';
import type { User } from '../../../../types';

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

type EditModalSetters = {
  setCurrentItem: (i: AgendaItem | null) => void;
  setEditedTitle: (t: string) => void;
  setEditedMinutes: (m: string) => void;
  setEditedDescription: (d: string) => void;
  setEditModalVisible: (v: boolean) => void;
};

type AddItemOptions = {
  agendaItems: AgendaItem[];
  t: (key: string) => string;
} & EditModalSetters;

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

type EditItemOptions = {
  item: AgendaItem;
  setCurrentItem: (i: AgendaItem) => void;
} & Omit<EditModalSetters, 'setCurrentItem'>;

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

type SaveItemOptions = {
  currentItem: AgendaItem | null;
  editedTitle: string;
  editedMinutes: string;
  editedDescription: string;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
  setEditModalVisible: (v: boolean) => void;
  setCurrentItem: (i: AgendaItem | null) => void;
  t: TranslationFn;
};

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
    Alert.alert(options.t('common.error'), options.t('errors.pleaseEnterTitle'));
    return;
  }
  const minutes = parseInt(editedMinutes, 10) || MEETING_AGENDA.DEFAULT_MINUTES;
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

type DeleteItemOptions = {
  itemId: string;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
  t: TranslationFn;
};

export function handleDeleteItem(options: DeleteItemOptions): void {
  const { itemId, agendaItems, setAgendaItems, t } = options;

  Alert.alert(t('titles.deleteActivity'), t('warnings.confirmDeleteActivity'), [
    { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
    {
      text: t('common.delete'),
      style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
      onPress: (): void => {
        setAgendaItems(agendaItems.filter((i) => i.id !== itemId));
      },
    },
  ]);
}

type SelectMemberOptions = {
  member: User;
  currentItem: AgendaItem | null;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
  setSelectMemberModalVisible: (v: boolean) => void;
  setCurrentItem: (i: AgendaItem | null) => void;
};

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

type RemoveMemberOptions = {
  itemId: string;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
};

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

type MoveItemOptions = {
  index: number;
  direction: typeof MOVE_DIRECTION.UP | typeof MOVE_DIRECTION.DOWN;
  agendaItems: AgendaItem[];
  setAgendaItems: (items: AgendaItem[]) => void;
};

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
