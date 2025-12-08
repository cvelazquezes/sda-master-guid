import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../shared/components';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICONS, MODAL_WIDTH, EMPTY_VALUE } from '../../../shared/constants';
import { MATH } from '../../../shared/constants/numbers';
import { styles } from './styles';
import { AgendaItem } from './types';
/* eslint-enable no-magic-numbers */
import { useMeetingPlanner } from './useMeetingPlanner';
import {
  handleAddItem,
  handleEditItem,
  handleSaveItem,
  handleDeleteItem,
  handleSelectMember,
  handleRemoveMember,
  handleMoveItem,
} from './agendaHandlers';
import {
  handleSaveMeeting,
  confirmShareMeeting,
  handleResetToDefault,
  handleNewMeeting,
} from './meetingHandlers';
import { MeetingInfoSection } from './MeetingInfoSection';
import { AgendaCard } from './AgendaCard';
import { EditItemModal } from './EditItemModal';
import { SelectMemberModal } from './SelectMemberModal';
import { ShareModal } from './ShareModal';

// Meeting agenda time durations (in minutes)
const AGENDA_DURATION = {
  VERY_SHORT: MATH.FIVE, // 5 min
  SHORT: MATH.TEN, // 10 min
  MEDIUM: MATH.FIFTEEN, // 15 min
  LONG: MATH.FORTY_FIVE, // 45 min (pathfinder class)
} as const;

function useDefaultAgenda(
  t: ReturnType<typeof useTranslation>['t']
): () => Omit<AgendaItem, 'id' | 'order'>[] {
  return useCallback(
    () => [
      {
        title: t('screens.meetingPlanner.defaultAgenda.welcomeAndHonors'),
        estimatedMinutes: AGENDA_DURATION.SHORT,
      },
      {
        title: t('screens.meetingPlanner.defaultAgenda.openingPrayer'),
        estimatedMinutes: AGENDA_DURATION.VERY_SHORT,
      },
      {
        title: t('screens.meetingPlanner.defaultAgenda.reflectionDevotional'),
        estimatedMinutes: AGENDA_DURATION.MEDIUM,
      },
      {
        title: t('screens.meetingPlanner.defaultAgenda.pathfinderClasses'),
        estimatedMinutes: AGENDA_DURATION.LONG,
      },
      {
        title: t('screens.meetingPlanner.defaultAgenda.announcements'),
        estimatedMinutes: AGENDA_DURATION.SHORT,
      },
      {
        title: t('screens.meetingPlanner.defaultAgenda.closingPrayer'),
        estimatedMinutes: AGENDA_DURATION.VERY_SHORT,
      },
      {
        title: t('screens.meetingPlanner.defaultAgenda.farewell'),
        estimatedMinutes: AGENDA_DURATION.VERY_SHORT,
      },
    ],
    [t]
  );
}

function useEditState(): {
  editModalVisible: boolean;
  setEditModalVisible: (v: boolean) => void;
  selectMemberModalVisible: boolean;
  setSelectMemberModalVisible: (v: boolean) => void;
  shareModalVisible: boolean;
  setShareModalVisible: (v: boolean) => void;
  currentItem: AgendaItem | null;
  setCurrentItem: (v: AgendaItem | null) => void;
  editedTitle: string;
  setEditedTitle: (v: string) => void;
  editedMinutes: string;
  setEditedMinutes: (v: string) => void;
  editedDescription: string;
  setEditedDescription: (v: string) => void;
} {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectMemberModalVisible, setSelectMemberModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<AgendaItem | null>(null);
  const [editedTitle, setEditedTitle] = useState(EMPTY_VALUE);
  const [editedMinutes, setEditedMinutes] = useState(EMPTY_VALUE);
  const [editedDescription, setEditedDescription] = useState(EMPTY_VALUE);
  return {
    editModalVisible,
    setEditModalVisible,
    selectMemberModalVisible,
    setSelectMemberModalVisible,
    shareModalVisible,
    setShareModalVisible,
    currentItem,
    setCurrentItem,
    editedTitle,
    setEditedTitle,
    editedMinutes,
    setEditedMinutes,
    editedDescription,
    setEditedDescription,
  };
}

function getModalWidth(windowWidth: number): number {
  if (windowWidth > MODAL_WIDTH.BREAKPOINTS.LARGE) {
    return Math.min(MODAL_WIDTH.MAX.LARGE, windowWidth * MODAL_WIDTH.RATIO.HALF);
  }
  if (windowWidth > MODAL_WIDTH.BREAKPOINTS.MEDIUM) {
    return Math.min(MODAL_WIDTH.MAX.MEDIUM, windowWidth * MODAL_WIDTH.RATIO.SEVENTY);
  }
  if (windowWidth > MODAL_WIDTH.BREAKPOINTS.SMALL) {
    return windowWidth * MODAL_WIDTH.RATIO.EIGHTY_FIVE;
  }
  return windowWidth * MODAL_WIDTH.RATIO.NINETY_FIVE;
}

function getShareModalWidth(windowWidth: number): number {
  if (windowWidth > MODAL_WIDTH.BREAKPOINTS.MEDIUM) {
    return Math.min(MODAL_WIDTH.MAX.SHARE, windowWidth * MODAL_WIDTH.RATIO.HALF);
  }
  if (windowWidth > MODAL_WIDTH.BREAKPOINTS.SMALL) {
    return windowWidth * MODAL_WIDTH.RATIO.SEVENTY_FIVE;
  }
  return windowWidth * MODAL_WIDTH.RATIO.NINETY;
}

const MeetingPlannerScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const getDefaultAgenda = useDefaultAgenda(t);
  const defaultTitle = t('screens.meetingPlanner.defaultMeetingTitle');
  const {
    agendaItems,
    setAgendaItems,
    clubMembers,
    meetingDate,
    setMeetingDate,
    meetingTitle,
    setMeetingTitle,
    isSaved,
    setIsSaved,
  } = useMeetingPlanner(user?.clubId, getDefaultAgenda, defaultTitle);
  const editState = useEditState();
  const totalTime = agendaItems.reduce((sum, i) => sum + i.estimatedMinutes, 0);

  return (
    <View style={styles.container}>
      <Header
        onNew={(): void =>
          handleNewMeeting(
            getDefaultAgenda,
            setAgendaItems,
            setMeetingDate,
            setMeetingTitle,
            setIsSaved,
            defaultTitle,
            t
          )
        }
        onReset={(): void => handleResetToDefault(getDefaultAgenda, setAgendaItems, setIsSaved, t)}
        onAdd={(): void =>
          handleAddItem(
            agendaItems,
            editState.setCurrentItem,
            editState.setEditedTitle,
            editState.setEditedMinutes,
            editState.setEditedDescription,
            editState.setEditModalVisible,
            t
          )
        }
        t={t}
      />
      <MeetingInfoSection
        meetingDate={meetingDate}
        setMeetingDate={setMeetingDate}
        meetingTitle={meetingTitle}
        setMeetingTitle={setMeetingTitle}
        totalTime={totalTime}
        t={t}
      />
      <AgendaList
        agendaItems={agendaItems}
        setAgendaItems={setAgendaItems}
        editState={editState}
        t={t}
      />
      {agendaItems.length > 0 && (
        <Footer
          isSaved={isSaved}
          setIsSaved={setIsSaved}
          onSave={(): void =>
            handleSaveMeeting(
              agendaItems,
              meetingDate,
              setIsSaved,
              editState.setShareModalVisible,
              t
            )
          }
          onShare={(): void => editState.setShareModalVisible(true)}
          t={t}
        />
      )}
      <EditItemModal
        visible={editState.editModalVisible}
        onClose={(): void => editState.setEditModalVisible(false)}
        modalWidth={getModalWidth(windowWidth)}
        windowHeight={windowHeight}
        currentItem={editState.currentItem}
        agendaItems={agendaItems}
        editedTitle={editState.editedTitle}
        setEditedTitle={editState.setEditedTitle}
        editedMinutes={editState.editedMinutes}
        setEditedMinutes={editState.setEditedMinutes}
        editedDescription={editState.editedDescription}
        setEditedDescription={editState.setEditedDescription}
        onSave={(): void =>
          handleSaveItem(
            editState.currentItem,
            editState.editedTitle,
            editState.editedMinutes,
            editState.editedDescription,
            agendaItems,
            setAgendaItems,
            editState.setEditModalVisible,
            editState.setCurrentItem
          )
        }
        t={t}
      />
      <SelectMemberModal
        visible={editState.selectMemberModalVisible}
        onClose={(): void => editState.setSelectMemberModalVisible(false)}
        modalWidth={getModalWidth(windowWidth)}
        windowHeight={windowHeight}
        clubMembers={clubMembers}
        onSelectMember={(m): void =>
          handleSelectMember(
            m,
            editState.currentItem,
            agendaItems,
            setAgendaItems,
            editState.setSelectMemberModalVisible,
            editState.setCurrentItem
          )
        }
        t={t}
      />
      <ShareModal
        visible={editState.shareModalVisible}
        onClose={(): void => editState.setShareModalVisible(false)}
        shareModalWidth={getShareModalWidth(windowWidth)}
        meetingDate={meetingDate}
        totalTime={totalTime}
        agendaItems={agendaItems}
        clubMembersCount={clubMembers.length}
        onConfirmShare={(): void =>
          confirmShareMeeting(clubMembers, editState.setShareModalVisible, t)
        }
        t={t}
      />
    </View>
  );
};

function AgendaList({
  agendaItems,
  setAgendaItems,
  editState,
  t,
}: {
  agendaItems: AgendaItem[];
  setAgendaItems: (v: AgendaItem[]) => void;
  editState: ReturnType<typeof useEditState>;
  t: (k: string) => string;
}): React.JSX.Element {
  return (
    <ScrollView style={styles.content}>
      {agendaItems.length === 0 ? (
        <EmptyState t={t} />
      ) : (
        agendaItems.map((item, index) => (
          <AgendaCard
            key={item.id}
            item={item}
            index={index}
            totalItems={agendaItems.length}
            onEdit={(): void =>
              handleEditItem(
                item,
                editState.setCurrentItem,
                editState.setEditedTitle,
                editState.setEditedMinutes,
                editState.setEditedDescription,
                editState.setEditModalVisible
              )
            }
            onDelete={(): void => handleDeleteItem(item.id, agendaItems, setAgendaItems)}
            onAssign={(): void => {
              editState.setCurrentItem(item);
              editState.setSelectMemberModalVisible(true);
            }}
            onRemoveMember={(): void => handleRemoveMember(item.id, agendaItems, setAgendaItems)}
            onMove={(dir): void => handleMoveItem(index, dir, agendaItems, setAgendaItems)}
            t={t}
          />
        ))
      )}
    </ScrollView>
  );
}

interface HeaderProps {
  onNew: () => void;
  onReset: () => void;
  onAdd: () => void;
  t: (key: string) => string;
}

function Header({ onNew, onReset, onAdd, t }: HeaderProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{t('screens.meetingPlanner.title')}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={onNew} style={styles.headerButton}>
          <MaterialCommunityIcons
            name={ICONS.FILE_DOCUMENT_OUTLINE}
            size={iconSizes.lg}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onReset} style={styles.headerButton}>
          <MaterialCommunityIcons
            name={ICONS.REFRESH}
            size={iconSizes.lg}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onAdd} style={styles.headerButton}>
          <MaterialCommunityIcons name={ICONS.PLUS} size={iconSizes.lg} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState({ t }: { t: (key: string) => string }): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name={ICONS.CALENDAR_BLANK}
        size={iconSizes['3xl']}
        color={colors.borderLight}
      />
      <Text style={styles.emptyText}>{t('screens.meetingPlanner.noActivities')}</Text>
      <Text style={styles.emptySubtext}>{t('screens.meetingPlanner.tapToAdd')}</Text>
    </View>
  );
}

interface FooterProps {
  isSaved: boolean;
  setIsSaved: (v: boolean) => void;
  onSave: () => void;
  onShare: () => void;
  t: (key: string) => string;
}

function Footer({ isSaved, setIsSaved, onSave, onShare, t }: FooterProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  if (!isSaved) {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <MaterialCommunityIcons
            name={ICONS.CONTENT_SAVE}
            size={iconSizes.lg}
            color={colors.textInverse}
          />
          <Text style={styles.saveButtonText}>{t('screens.meetingPlanner.saveMeetingPlan')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.footer}>
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.editButton} onPress={(): void => setIsSaved(false)}>
          <MaterialCommunityIcons name={ICONS.PENCIL} size={iconSizes.md} color={colors.primary} />
          <Text style={styles.editButtonText}>{t('screens.meetingPlanner.edit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <MaterialCommunityIcons
            name={ICONS.SHARE_VARIANT}
            size={iconSizes.lg}
            color={colors.textInverse}
          />
          <Text style={styles.shareButtonText}>{t('screens.meetingPlanner.shareWithMembers')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MeetingPlannerScreen;
