import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { User } from '../../types';
import {
  mobileTypography,
  mobileIconSizes,
  designTokens,
  layoutConstants,
} from '../../shared/theme';
import { LOG_MESSAGES } from '../../shared/constants/logMessages';
import { logger } from '../../shared/utils/logger';
import {
  ALERT_BUTTON_STYLE,
  ANIMATION,
  DATE_LOCALE_OPTIONS,
  DAY_OF_WEEK,
  EMPTY_VALUE,
  ICONS,
  ID_PREFIX,
  KEYBOARD_TYPE,
  MEETING_AGENDA,
  MESSAGES,
  MODAL_WIDTH,
  MOVE_DIRECTION,
  TEXT_INPUT,
  TEXT_LINES,
  borderValues,
  dimensionValues,
  flexValues,
  shadowOffsetValues,
  textAlignVertical,
} from '../../shared/constants';

interface AgendaItem {
  id: string;
  title: string;
  estimatedMinutes: number;
  responsibleMemberId?: string;
  responsibleMemberName?: string;
  description?: string;
  order: number;
}

// Reserved for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MeetingPlan {
  id: string;
  date: Date;
  title: string;
  agenda: AgendaItem[];
  isShared: boolean;
  createdAt: Date;
}

const MeetingPlannerScreen = () => {
  const { t } = useTranslation();

  // Default agenda items with translations
  const getDefaultAgenda = (): Omit<AgendaItem, 'id' | 'order'>[] => [
    { title: t('screens.meetingPlanner.defaultAgenda.welcomeAndHonors'), estimatedMinutes: 10 },
    { title: t('screens.meetingPlanner.defaultAgenda.openingPrayer'), estimatedMinutes: 5 },
    { title: t('screens.meetingPlanner.defaultAgenda.reflectionDevotional'), estimatedMinutes: 15 },
    { title: t('screens.meetingPlanner.defaultAgenda.pathfinderClasses'), estimatedMinutes: 45 },
    { title: t('screens.meetingPlanner.defaultAgenda.announcements'), estimatedMinutes: 10 },
    { title: t('screens.meetingPlanner.defaultAgenda.closingPrayer'), estimatedMinutes: 5 },
    { title: t('screens.meetingPlanner.defaultAgenda.farewell'), estimatedMinutes: 5 },
  ];
  const { user } = useAuth();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [clubMembers, setClubMembers] = useState<User[]>([]);
  const [, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectMemberModalVisible, setSelectMemberModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<AgendaItem | null>(null);
  const [editedTitle, setEditedTitle] = useState(EMPTY_VALUE);
  const [editedMinutes, setEditedMinutes] = useState(EMPTY_VALUE);
  const [editedDescription, setEditedDescription] = useState(EMPTY_VALUE);
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTitle, setMeetingTitle] = useState(t('screens.meetingPlanner.defaultMeetingTitle'));
  const [isSaved, setIsSaved] = useState(false);

  // Calculate responsive modal widths
  const getModalWidth = () => {
    if (windowWidth > MODAL_WIDTH.BREAKPOINTS.LARGE)
      return Math.min(MODAL_WIDTH.MAX.LARGE, windowWidth * MODAL_WIDTH.RATIO.HALF);
    if (windowWidth > MODAL_WIDTH.BREAKPOINTS.MEDIUM)
      return Math.min(MODAL_WIDTH.MAX.MEDIUM, windowWidth * MODAL_WIDTH.RATIO.SEVENTY);
    if (windowWidth > MODAL_WIDTH.BREAKPOINTS.SMALL)
      return windowWidth * MODAL_WIDTH.RATIO.EIGHTY_FIVE;
    return windowWidth * MODAL_WIDTH.RATIO.NINETY_FIVE;
  };

  const getShareModalWidth = () => {
    if (windowWidth > MODAL_WIDTH.BREAKPOINTS.MEDIUM)
      return Math.min(MODAL_WIDTH.MAX.SHARE, windowWidth * MODAL_WIDTH.RATIO.HALF);
    if (windowWidth > MODAL_WIDTH.BREAKPOINTS.SMALL)
      return windowWidth * MODAL_WIDTH.RATIO.SEVENTY_FIVE;
    return windowWidth * MODAL_WIDTH.RATIO.NINETY;
  };

  const modalWidth = getModalWidth();
  const shareModalWidth = getShareModalWidth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load default agenda
      const defaultAgenda = getDefaultAgenda().map((item, index) => ({
        ...item,
        id: `${ID_PREFIX.ITEM}-${index}`,
        order: index,
      }));
      setAgendaItems(defaultAgenda);

      // Load club members
      if (user?.clubId) {
        const members = await userService.getUsersByClub(user.clubId);
        setClubMembers(members.filter((m) => m.isActive));
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.MEETING_PLANNER.FAILED_TO_LOAD_DATA, error as Error);
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_MEETING_DATA);
    } finally {
      setLoading(false);
    }
  };

  const getTotalTime = () => {
    return agendaItems.reduce((total, item) => total + item.estimatedMinutes, 0);
  };

  const handleAddItem = () => {
    const newItem: AgendaItem = {
      id: `${ID_PREFIX.ITEM}-${Date.now()}`,
      title: t('screens.meetingPlanner.newActivity'),
      estimatedMinutes: MEETING_AGENDA.defaultMinutes,
      order: agendaItems.length,
    };
    setCurrentItem(newItem);
    setEditedTitle(newItem.title);
    setEditedMinutes(newItem.estimatedMinutes.toString());
    setEditedDescription(EMPTY_VALUE);
    setEditModalVisible(true);
  };

  const handleEditItem = (item: AgendaItem) => {
    setCurrentItem(item);
    setEditedTitle(item.title);
    setEditedMinutes(item.estimatedMinutes.toString());
    setEditedDescription(item.description || EMPTY_VALUE);
    setEditModalVisible(true);
  };

  const handleSaveItem = () => {
    if (!currentItem || !editedTitle.trim()) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_ENTER_TITLE);
      return;
    }

    const minutes = parseInt(editedMinutes) || MEETING_AGENDA.defaultMinutes;
    const updatedItem = {
      ...currentItem,
      title: editedTitle.trim(),
      estimatedMinutes: minutes,
      description: editedDescription.trim(),
    };

    if (agendaItems.find((i) => i.id === currentItem.id)) {
      // Update existing item
      setAgendaItems((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
    } else {
      // Add new item
      setAgendaItems((prev) => [...prev, updatedItem]);
    }

    setEditModalVisible(false);
    setCurrentItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(MESSAGES.TITLES.DELETE_ACTIVITY, MESSAGES.WARNINGS.CONFIRM_DELETE_ACTIVITY, [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: MESSAGES.BUTTONS.DELETE,
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: () => {
          setAgendaItems((prev) => prev.filter((i) => i.id !== itemId));
        },
      },
    ]);
  };

  const handleAssignMember = (item: AgendaItem) => {
    setCurrentItem(item);
    setSelectMemberModalVisible(true);
  };

  const handleSelectMember = (member: User) => {
    if (!currentItem) return;

    setAgendaItems((prev) =>
      prev.map((i) =>
        i.id === currentItem.id
          ? { ...i, responsibleMemberId: member.id, responsibleMemberName: member.name }
          : i
      )
    );
    setSelectMemberModalVisible(false);
    setCurrentItem(null);
  };

  const handleRemoveMember = (itemId: string) => {
    setAgendaItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, responsibleMemberId: undefined, responsibleMemberName: undefined }
          : i
      )
    );
  };

  const handleMoveItem = (
    index: number,
    direction: typeof MOVE_DIRECTION.UP | typeof MOVE_DIRECTION.DOWN
  ) => {
    const newItems = [...agendaItems];
    const targetIndex = direction === MOVE_DIRECTION.UP ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    newItems.forEach((item, idx) => {
      item.order = idx;
    });

    setAgendaItems(newItems);
  };

  const handleSaveMeeting = () => {
    // Validate that all activities have responsible members
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
      [{ text: MESSAGES.BUTTONS.OK, onPress: () => setShareModalVisible(true) }]
    );
  };

  const handleShareMeeting = () => {
    setShareModalVisible(true);
  };

  const confirmShareMeeting = () => {
    // In a real app, this would send notifications/emails to all members
    Alert.alert(
      MESSAGES.TITLES.MEETING_SHARED_TITLE,
      t('screens.meetingPlanner.meetingSharedSuccess', { count: clubMembers.length }),
      [{ text: MESSAGES.BUTTONS.OK, onPress: () => setShareModalVisible(false) }]
    );
  };

  const handleResetToDefault = () => {
    Alert.alert(MESSAGES.TITLES.RESET_TO_DEFAULT_TITLE, MESSAGES.WARNINGS.CONFIRM_RESET_MEETING, [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('screens.meetingPlanner.reset'),
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: () => {
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
  };

  const handleNewMeeting = () => {
    Alert.alert(MESSAGES.TITLES.CREATE_NEW_MEETING, MESSAGES.WARNINGS.CONFIRM_NEW_MEETING, [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('screens.meetingPlanner.createNew'),
        onPress: () => {
          const defaultAgenda = getDefaultAgenda().map((item, index) => ({
            ...item,
            id: `${ID_PREFIX.ITEM}-${Date.now()}-${index}`,
            order: index,
          }));
          setAgendaItems(defaultAgenda);
          setMeetingDate(new Date());
          setMeetingTitle(t('screens.meetingPlanner.defaultMeetingTitle'));
          setIsSaved(false);
        },
      },
    ]);
  };

  const getNextSaturday = () => {
    const today = new Date();
    const nextSaturday = new Date(today);
    nextSaturday.setDate(
      today.getDate() +
        ((DAY_OF_WEEK.SATURDAY - today.getDay() + DAY_OF_WEEK.DAYS_IN_WEEK) %
          DAY_OF_WEEK.DAYS_IN_WEEK || DAY_OF_WEEK.DAYS_IN_WEEK)
    );
    return nextSaturday;
  };

  const getNextSunday = () => {
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(
      today.getDate() +
        ((DAY_OF_WEEK.DAYS_IN_WEEK - today.getDay()) % DAY_OF_WEEK.DAYS_IN_WEEK ||
          DAY_OF_WEEK.DAYS_IN_WEEK)
    );
    return nextSunday;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('screens.meetingPlanner.title')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNewMeeting} style={styles.headerButton}>
            <MaterialCommunityIcons
              name={ICONS.FILE_DOCUMENT_OUTLINE}
              size={mobileIconSizes.large}
              color={designTokens.colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResetToDefault} style={styles.headerButton}>
            <MaterialCommunityIcons
              name={ICONS.REFRESH}
              size={mobileIconSizes.large}
              color={designTokens.colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddItem} style={styles.headerButton}>
            <MaterialCommunityIcons
              name={ICONS.PLUS}
              size={mobileIconSizes.large}
              color={designTokens.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Meeting Info */}
      <View style={styles.meetingInfoSection}>
        <View style={styles.meetingInfoRow}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR}
            size={mobileIconSizes.medium}
            color={designTokens.colors.primary}
          />
          <Text style={styles.meetingInfoLabel}>{t('screens.meetingPlanner.meetingDate')}</Text>
          <Text style={styles.meetingDate}>
            {meetingDate.toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.FULL_DATE)}
          </Text>
        </View>

        <View style={styles.quickDateButtons}>
          <TouchableOpacity
            style={styles.quickDateButton}
            onPress={() => setMeetingDate(getNextSaturday())}
          >
            <Text style={styles.quickDateText}>{t('screens.meetingPlanner.nextSaturday')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickDateButton}
            onPress={() => setMeetingDate(getNextSunday())}
          >
            <Text style={styles.quickDateText}>{t('screens.meetingPlanner.nextSunday')}</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.meetingTitleInput}
          value={meetingTitle}
          onChangeText={setMeetingTitle}
          placeholder={t('screens.meetingPlanner.titlePlaceholder')}
        />
      </View>

      {/* Total Time Banner */}
      <View style={styles.totalTimeBanner}>
        <MaterialCommunityIcons
          name={ICONS.CLOCK_OUTLINE}
          size={mobileIconSizes.medium}
          color={designTokens.colors.primary}
        />
        <Text style={styles.totalTimeText}>
          Total Meeting Time: <Text style={styles.totalTimeBold}>{getTotalTime()} minutes</Text>
        </Text>
      </View>

      {/* Agenda Items */}
      <ScrollView style={styles.content}>
        {agendaItems.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name={ICONS.CALENDAR_BLANK}
              size={designTokens.iconSize['3xl']}
              color={designTokens.colors.borderLight}
            />
            <Text style={styles.emptyText}>{t('screens.meetingPlanner.noActivities')}</Text>
            <Text style={styles.emptySubtext}>{t('screens.meetingPlanner.tapToAdd')}</Text>
          </View>
        ) : (
          agendaItems.map((item, index) => (
            <View key={item.id} style={styles.agendaCard}>
              {/* Order Number */}
              <View style={styles.orderBadge}>
                <Text style={styles.orderText}>{index + 1}</Text>
              </View>

              {/* Content */}
              <View style={styles.agendaContent}>
                <View style={styles.agendaHeader}>
                  <Text style={styles.agendaTitle} numberOfLines={TEXT_LINES.double}>
                    {item.title}
                  </Text>
                  <View style={styles.timeChip}>
                    <MaterialCommunityIcons
                      name={ICONS.CLOCK_OUTLINE}
                      size={mobileIconSizes.tiny}
                      color={designTokens.colors.textSecondary}
                    />
                    <Text style={styles.timeText}>{item.estimatedMinutes}m</Text>
                  </View>
                </View>

                {item.description && (
                  <Text style={styles.agendaDescription} numberOfLines={TEXT_LINES.double}>
                    {item.description}
                  </Text>
                )}

                {/* Responsible Member */}
                <View style={styles.responsibleSection}>
                  {item.responsibleMemberId ? (
                    <View style={styles.memberChip}>
                      <MaterialCommunityIcons
                        name={ICONS.ACCOUNT}
                        size={mobileIconSizes.small}
                        color={designTokens.colors.primary}
                      />
                      <Text style={styles.memberName} numberOfLines={TEXT_LINES.single}>
                        {item.responsibleMemberName}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
                        <MaterialCommunityIcons
                          name={ICONS.CLOSE_CIRCLE}
                          size={mobileIconSizes.small}
                          color={designTokens.colors.textTertiary}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.assignButton}
                      onPress={() => handleAssignMember(item)}
                    >
                      <MaterialCommunityIcons
                        name={ICONS.ACCOUNT_PLUS}
                        size={mobileIconSizes.small}
                        color={designTokens.colors.primary}
                      />
                      <Text style={styles.assignText}>
                        {t('screens.meetingPlanner.assignMember')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.agendaActions}>
                {/* Move Up/Down */}
                <View style={styles.moveButtons}>
                  <TouchableOpacity
                    style={[styles.moveButton, index === 0 && styles.moveButtonDisabled]}
                    onPress={() => handleMoveItem(index, MOVE_DIRECTION.UP)}
                    disabled={index === 0}
                  >
                    <MaterialCommunityIcons
                      name={ICONS.CHEVRON_UP}
                      size={mobileIconSizes.medium}
                      color={
                        index === 0
                          ? designTokens.colors.borderLight
                          : designTokens.colors.textSecondary
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.moveButton,
                      index === agendaItems.length - 1 && styles.moveButtonDisabled,
                    ]}
                    onPress={() => handleMoveItem(index, MOVE_DIRECTION.DOWN)}
                    disabled={index === agendaItems.length - 1}
                  >
                    <MaterialCommunityIcons
                      name={ICONS.CHEVRON_DOWN}
                      size={mobileIconSizes.medium}
                      color={
                        index === agendaItems.length - 1
                          ? designTokens.colors.borderLight
                          : designTokens.colors.textSecondary
                      }
                    />
                  </TouchableOpacity>
                </View>

                {/* Edit/Delete */}
                <TouchableOpacity style={styles.actionButton} onPress={() => handleEditItem(item)}>
                  <MaterialCommunityIcons
                    name={ICONS.PENCIL}
                    size={mobileIconSizes.medium}
                    color={designTokens.colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteItem(item.id)}
                >
                  <MaterialCommunityIcons
                    name={ICONS.DELETE}
                    size={mobileIconSizes.medium}
                    color={designTokens.colors.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Action Buttons */}
      {agendaItems.length > 0 && (
        <View style={styles.footer}>
          {!isSaved ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeeting}>
              <MaterialCommunityIcons
                name={ICONS.CONTENT_SAVE}
                size={mobileIconSizes.large}
                color={designTokens.colors.textInverse}
              />
              <Text style={styles.saveButtonText}>
                {t('screens.meetingPlanner.saveMeetingPlan')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsSaved(false)}>
                <MaterialCommunityIcons
                  name={ICONS.PENCIL}
                  size={mobileIconSizes.medium}
                  color={designTokens.colors.primary}
                />
                <Text style={styles.editButtonText}>{t('screens.meetingPlanner.edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={handleShareMeeting}>
                <MaterialCommunityIcons
                  name={ICONS.SHARE_VARIANT}
                  size={mobileIconSizes.large}
                  color={designTokens.colors.textInverse}
                />
                <Text style={styles.shareButtonText}>
                  {t('screens.meetingPlanner.shareWithMembers')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Edit Item Modal */}
      <Modal
        visible={editModalVisible}
        animationType={ANIMATION.SLIDE}
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                width: modalWidth,
                maxHeight: windowHeight * 0.85,
                alignSelf: layoutConstants.alignSelf.center,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentItem && agendaItems.find((i) => i.id === currentItem.id)
                  ? t('screens.meetingPlanner.editActivity')
                  : t('screens.meetingPlanner.addActivity')}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <MaterialCommunityIcons
                  name={ICONS.CLOSE}
                  size={mobileIconSizes.large}
                  color={designTokens.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>
                {t('screens.meetingPlanner.activityTitleLabel')}
              </Text>
              <TextInput
                style={styles.input}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder={t('screens.meetingPlanner.activityTitlePlaceholder')}
              />

              <Text style={styles.inputLabel}>{t('screens.meetingPlanner.estimatedTime')}</Text>
              <TextInput
                style={styles.input}
                value={editedMinutes}
                onChangeText={setEditedMinutes}
                placeholder={t('screens.meetingPlanner.minutesPlaceholder')}
                keyboardType={KEYBOARD_TYPE.NUMERIC}
              />

              <Text style={styles.inputLabel}>
                {t('screens.meetingPlanner.descriptionOptional')}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder={t('screens.meetingPlanner.notesPlaceholder')}
                multiline
                numberOfLines={TEXT_INPUT.NUMBER_OF_LINES.MULTI}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSaveItem}
              >
                <Text style={styles.confirmButtonText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Select Member Modal */}
      <Modal
        visible={selectMemberModalVisible}
        animationType={ANIMATION.SLIDE}
        transparent={true}
        onRequestClose={() => setSelectMemberModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                width: modalWidth,
                maxHeight: windowHeight * 0.85,
                alignSelf: layoutConstants.alignSelf.center,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('screens.meetingPlanner.assignResponsible')}</Text>
              <TouchableOpacity onPress={() => setSelectMemberModalVisible(false)}>
                <MaterialCommunityIcons
                  name={ICONS.CLOSE}
                  size={mobileIconSizes.large}
                  color={designTokens.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {clubMembers.length === 0 ? (
                <Text style={styles.noMembersText}>
                  {t('screens.meetingPlanner.noMembersAvailable')}
                </Text>
              ) : (
                clubMembers.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberOption}
                    onPress={() => handleSelectMember(member)}
                  >
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {member.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberOptionName}>{member.name}</Text>
                      <Text style={styles.memberOptionEmail}>{member.email}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={ICONS.CHEVRON_RIGHT}
                      size={mobileIconSizes.medium}
                      color={designTokens.colors.borderLight}
                    />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Share Meeting Modal */}
      <Modal
        visible={shareModalVisible}
        animationType={ANIMATION.FADE}
        transparent={true}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View
          style={[styles.modalOverlay, { justifyContent: layoutConstants.justifyContent.center }]}
        >
          <View style={[styles.shareModalContent, { width: shareModalWidth }]}>
            <View style={styles.shareHeader}>
              <View style={styles.shareIconContainer}>
                <MaterialCommunityIcons
                  name={ICONS.SHARE_VARIANT}
                  size={designTokens.iconSize['2xl']}
                  color={designTokens.colors.primary}
                />
              </View>
              <Text style={styles.shareTitle}>{t('screens.meetingPlanner.shareMeetingPlan')}</Text>
              <Text style={styles.shareSubtitle}>
                {t('screens.meetingPlanner.sendAgendaToMembers', { count: clubMembers.length })}
              </Text>
            </View>

            <View style={styles.shareInfo}>
              <View style={styles.shareInfoRow}>
                <MaterialCommunityIcons
                  name={ICONS.CALENDAR}
                  size={mobileIconSizes.medium}
                  color={designTokens.colors.primary}
                />
                <View style={styles.shareInfoText}>
                  <Text style={styles.shareInfoLabel}>
                    {t('screens.meetingPlanner.meetingDate')}
                  </Text>
                  <Text style={styles.shareInfoValue}>
                    {meetingDate.toLocaleDateString(
                      undefined,
                      DATE_LOCALE_OPTIONS.DATE_WITHOUT_YEAR
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.shareInfoRow}>
                <MaterialCommunityIcons
                  name={ICONS.CLOCK_OUTLINE}
                  size={mobileIconSizes.medium}
                  color={designTokens.colors.primary}
                />
                <View style={styles.shareInfoText}>
                  <Text style={styles.shareInfoLabel}>
                    {t('screens.meetingPlanner.totalDuration')}
                  </Text>
                  <Text style={styles.shareInfoValue}>{getTotalTime()} minutes</Text>
                </View>
              </View>

              <View style={styles.shareInfoRow}>
                <MaterialCommunityIcons
                  name={ICONS.FORMAT_LIST_NUMBERED}
                  size={mobileIconSizes.medium}
                  color={designTokens.colors.primary}
                />
                <View style={styles.shareInfoText}>
                  <Text style={styles.shareInfoLabel}>
                    {t('screens.meetingPlanner.activities')}
                  </Text>
                  <Text style={styles.shareInfoValue}>{agendaItems.length} items</Text>
                </View>
              </View>
            </View>

            <View style={styles.shareActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShareModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, styles.shareConfirmButton]}
                onPress={confirmShareMeeting}
              >
                <MaterialCommunityIcons
                  name={ICONS.SEND}
                  size={mobileIconSizes.medium}
                  color={designTokens.colors.textInverse}
                />
                <Text style={styles.confirmButtonText}>
                  {t('screens.meetingPlanner.sendToAll')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingHorizontal: designTokens.spacing.xl,
    paddingVertical: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerTitle: {
    ...mobileTypography.heading1,
  },
  headerActions: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  headerButton: {
    padding: designTokens.spacing.sm,
  },
  meetingInfoSection: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingHorizontal: designTokens.spacing.xl,
    paddingVertical: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
    gap: designTokens.spacing.md,
  },
  meetingInfoRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  meetingInfoLabel: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textSecondary,
  },
  meetingDate: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: flexValues.one,
  },
  quickDateButtons: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  quickDateButton: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.primaryLight,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
    alignItems: layoutConstants.alignItems.center,
  },
  quickDateText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.primary,
  },
  meetingTitleInput: {
    ...mobileTypography.bodyLarge,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.md,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  totalTimeBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primaryLight,
    paddingHorizontal: designTokens.spacing.xl,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.md,
  },
  totalTimeText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.primary,
  },
  totalTimeBold: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.primary,
  },
  content: {
    flex: flexValues.one,
  },
  agendaCard: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: shadowOffsetValues.md,
    shadowOpacity: designTokens.shadows.sm.shadowOpacity,
    shadowRadius: designTokens.shadows.sm.shadowRadius,
    elevation: designTokens.shadows.sm.elevation,
  },
  orderBadge: {
    width: dimensionValues.size.orderBadge,
    height: dimensionValues.size.orderBadge,
    borderRadius: designTokens.borderRadius.xl,
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  orderText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textInverse,
  },
  agendaContent: {
    flex: flexValues.one,
  },
  agendaHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.flexStart,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
  },
  agendaTitle: {
    ...mobileTypography.bodyMediumBold,
    flex: flexValues.one,
  },
  timeChip: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundSecondary,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.xs,
  },
  timeText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  agendaDescription: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.sm,
  },
  responsibleSection: {
    marginTop: designTokens.spacing.sm,
  },
  memberChip: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primaryLight,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    alignSelf: layoutConstants.alignSelf.flexStart,
    gap: designTokens.spacing.sm,
  },
  memberName: {
    ...mobileTypography.label,
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
    flex: flexValues.one,
  },
  assignButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.primary,
    borderStyle: borderValues.style.dashed,
    alignSelf: layoutConstants.alignSelf.flexStart,
    gap: designTokens.spacing.sm,
  },
  assignText: {
    ...mobileTypography.label,
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  agendaActions: {
    marginLeft: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  moveButtons: {
    gap: designTokens.spacing.xs,
  },
  moveButton: {
    padding: designTokens.spacing.xs,
  },
  moveButtonDisabled: {
    opacity: designTokens.opacity.low,
  },
  actionButton: {
    padding: designTokens.spacing.xs,
  },
  emptyState: {
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing['7xl'],
    paddingHorizontal: designTokens.spacing['4xl'],
  },
  emptyText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.lg,
  },
  emptySubtext: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textTertiary,
    textAlign: layoutConstants.textAlign.center,
    marginTop: designTokens.spacing.sm,
  },
  footer: {
    padding: designTokens.spacing.xl,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  saveButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    gap: designTokens.spacing.md,
  },
  saveButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textInverse,
  },
  footerButtons: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  editButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    backgroundColor: designTokens.colors.backgroundSecondary,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.xl,
    gap: designTokens.spacing.sm,
  },
  editButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.primary,
  },
  shareButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    backgroundColor: designTokens.colors.success,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.xl,
    gap: designTokens.spacing.md,
    flex: flexValues.one,
  },
  shareButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textInverse,
  },
  shareModalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xxl,
    padding: designTokens.spacing.xxl,
    alignSelf: layoutConstants.alignSelf.center,
  },
  shareHeader: {
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xxl,
  },
  shareIconContainer: {
    width: dimensionValues.size.shareIconLarge,
    height: dimensionValues.size.shareIconLarge,
    borderRadius: designTokens.borderRadius.full,
    backgroundColor: designTokens.colors.primaryLight,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.lg,
  },
  shareTitle: {
    ...mobileTypography.heading2,
    textAlign: layoutConstants.textAlign.center,
    marginBottom: designTokens.spacing.sm,
  },
  shareSubtitle: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    textAlign: layoutConstants.textAlign.center,
  },
  shareInfo: {
    backgroundColor: designTokens.colors.inputBackground,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.xxl,
  },
  shareInfoRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  shareInfoText: {
    flex: flexValues.one,
  },
  shareInfoLabel: {
    ...mobileTypography.label,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  shareInfoValue: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
  },
  shareActions: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  shareConfirmButton: {
    flex: flexValues.oneAndHalf,
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.success,
  },
  modalOverlay: {
    flex: flexValues.one,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.flexEnd,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderTopLeftRadius: designTokens.borderRadius.xl,
    borderTopRightRadius: designTokens.borderRadius.xl,
  },
  modalHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  modalTitle: {
    ...mobileTypography.heading2,
  },
  modalBody: {
    padding: designTokens.spacing.xl,
  },
  inputLabel: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.sm,
    marginTop: designTokens.spacing.md,
  },
  input: {
    ...mobileTypography.bodyLarge,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.md,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  textArea: {
    minHeight: dimensionValues.minHeight.textarea,
    textAlignVertical: textAlignVertical.top,
  },
  modalFooter: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
    padding: designTokens.spacing.xl,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  modalButton: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    alignItems: layoutConstants.alignItems.center,
  },
  cancelButton: {
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  cancelButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textSecondary,
  },
  confirmButton: {
    backgroundColor: designTokens.colors.primary,
  },
  confirmButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textInverse,
  },
  memberOption: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.inputBackground,
    marginBottom: designTokens.spacing.sm,
  },
  memberAvatar: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius.xxl,
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  memberAvatarText: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textInverse,
  },
  memberInfo: {
    flex: flexValues.one,
  },
  memberOptionName: {
    ...mobileTypography.bodyMediumBold,
  },
  memberOptionEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  noMembersText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textTertiary,
    textAlign: layoutConstants.textAlign.center,
    paddingVertical: designTokens.spacing['4xl'],
  },
});

export default MeetingPlannerScreen;
