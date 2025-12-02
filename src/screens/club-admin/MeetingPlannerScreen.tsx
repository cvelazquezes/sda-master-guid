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
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { User } from '../../types';
import { mobileTypography, mobileIconSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { MESSAGES } from '../../shared/constants';

interface AgendaItem {
  id: string;
  title: string;
  estimatedMinutes: number;
  responsibleMemberId?: string;
  responsibleMemberName?: string;
  description?: string;
  order: number;
}

interface MeetingPlan {
  id: string;
  date: Date;
  title: string;
  agenda: AgendaItem[];
  isShared: boolean;
  createdAt: Date;
}

const DEFAULT_AGENDA: Omit<AgendaItem, 'id' | 'order'>[] = [
  { title: 'Welcome and Honors', estimatedMinutes: 10 },
  { title: 'Opening Prayer', estimatedMinutes: 5 },
  { title: 'Reflection/Devotional', estimatedMinutes: 15 },
  { title: 'Pathfinder Classes', estimatedMinutes: 45 },
  { title: 'Announcements', estimatedMinutes: 10 },
  { title: 'Closing Prayer', estimatedMinutes: 5 },
  { title: 'Farewell', estimatedMinutes: 5 },
];

const MeetingPlannerScreen = () => {
  const { user } = useAuth();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [clubMembers, setClubMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectMemberModalVisible, setSelectMemberModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<AgendaItem | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedMinutes, setEditedMinutes] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTitle, setMeetingTitle] = useState('Club Meeting');
  const [isSaved, setIsSaved] = useState(false);

  // Calculate responsive modal widths
  const getModalWidth = () => {
    if (windowWidth > 1200) return Math.min(700, windowWidth * 0.5);
    if (windowWidth > 768) return Math.min(600, windowWidth * 0.7);
    if (windowWidth > 480) return windowWidth * 0.85;
    return windowWidth * 0.95;
  };

  const getShareModalWidth = () => {
    if (windowWidth > 768) return Math.min(500, windowWidth * 0.5);
    if (windowWidth > 480) return windowWidth * 0.75;
    return windowWidth * 0.9;
  };

  const modalWidth = getModalWidth();
  const shareModalWidth = getShareModalWidth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load default agenda
      const defaultAgenda = DEFAULT_AGENDA.map((item, index) => ({
        ...item,
        id: `item-${index}`,
        order: index,
      }));
      setAgendaItems(defaultAgenda);

      // Load club members
      if (user?.clubId) {
        const members = await userService.getUsersByClub(user.clubId);
        setClubMembers(members.filter(m => m.isActive));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
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
      id: `item-${Date.now()}`,
      title: 'New Activity',
      estimatedMinutes: 10,
      order: agendaItems.length,
    };
    setCurrentItem(newItem);
    setEditedTitle(newItem.title);
    setEditedMinutes(newItem.estimatedMinutes.toString());
    setEditedDescription('');
    setEditModalVisible(true);
  };

  const handleEditItem = (item: AgendaItem) => {
    setCurrentItem(item);
    setEditedTitle(item.title);
    setEditedMinutes(item.estimatedMinutes.toString());
    setEditedDescription(item.description || '');
    setEditModalVisible(true);
  };

  const handleSaveItem = () => {
    if (!currentItem || !editedTitle.trim()) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_ENTER_TITLE);
      return;
    }

    const minutes = parseInt(editedMinutes) || 10;
    const updatedItem = {
      ...currentItem,
      title: editedTitle.trim(),
      estimatedMinutes: minutes,
      description: editedDescription.trim(),
    };

    if (agendaItems.find(i => i.id === currentItem.id)) {
      // Update existing item
      setAgendaItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    } else {
      // Add new item
      setAgendaItems(prev => [...prev, updatedItem]);
    }

    setEditModalVisible(false);
    setCurrentItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      MESSAGES.TITLES.DELETE_ACTIVITY,
      MESSAGES.WARNINGS.CONFIRM_DELETE_ACTIVITY,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: MESSAGES.BUTTONS.DELETE,
          style: 'destructive',
          onPress: () => {
            setAgendaItems(prev => prev.filter(i => i.id !== itemId));
          },
        },
      ]
    );
  };

  const handleAssignMember = (item: AgendaItem) => {
    setCurrentItem(item);
    setSelectMemberModalVisible(true);
  };

  const handleSelectMember = (member: User) => {
    if (!currentItem) return;

    setAgendaItems(prev =>
      prev.map(i =>
        i.id === currentItem.id
          ? { ...i, responsibleMemberId: member.id, responsibleMemberName: member.name }
          : i
      )
    );
    setSelectMemberModalVisible(false);
    setCurrentItem(null);
  };

  const handleRemoveMember = (itemId: string) => {
    setAgendaItems(prev =>
      prev.map(i =>
        i.id === itemId
          ? { ...i, responsibleMemberId: undefined, responsibleMemberName: undefined }
          : i
      )
    );
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...agendaItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    newItems.forEach((item, idx) => {
      item.order = idx;
    });

    setAgendaItems(newItems);
  };

  const handleSaveMeeting = () => {
    // Validate that all activities have responsible members
    const unassignedItems = agendaItems.filter(item => !item.responsibleMemberId);
    
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
      `Meeting plan for ${meetingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} has been saved successfully!`,
      [
        { text: MESSAGES.BUTTONS.OK, onPress: () => setShareModalVisible(true) }
      ]
    );
  };

  const handleShareMeeting = () => {
    setShareModalVisible(true);
  };

  const confirmShareMeeting = () => {
    // In a real app, this would send notifications/emails to all members
    Alert.alert(
      MESSAGES.TITLES.MEETING_SHARED_TITLE,
      `The meeting plan has been shared with all ${clubMembers.length} club members. They will receive a notification with the complete agenda and their responsibilities.`,
      [{ text: MESSAGES.BUTTONS.OK, onPress: () => setShareModalVisible(false) }]
    );
  };

  const handleResetToDefault = () => {
    Alert.alert(
      MESSAGES.TITLES.RESET_TO_DEFAULT_TITLE,
      MESSAGES.WARNINGS.CONFIRM_RESET_MEETING,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultAgenda = DEFAULT_AGENDA.map((item, index) => ({
              ...item,
              id: `item-${Date.now()}-${index}`,
              order: index,
            }));
            setAgendaItems(defaultAgenda);
            setIsSaved(false);
          },
        },
      ]
    );
  };

  const handleNewMeeting = () => {
    Alert.alert(
      MESSAGES.TITLES.CREATE_NEW_MEETING,
      MESSAGES.WARNINGS.CONFIRM_NEW_MEETING,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: 'Create New',
          onPress: () => {
            const defaultAgenda = DEFAULT_AGENDA.map((item, index) => ({
              ...item,
              id: `item-${Date.now()}-${index}`,
              order: index,
            }));
            setAgendaItems(defaultAgenda);
            setMeetingDate(new Date());
            setMeetingTitle('Club Meeting');
            setIsSaved(false);
          },
        },
      ]
    );
  };

  const getNextSaturday = () => {
    const today = new Date();
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
    return nextSaturday;
  };

  const getNextSunday = () => {
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7 || 7));
    return nextSunday;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meeting Planner</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNewMeeting} style={styles.headerButton}>
            <MaterialCommunityIcons name="file-document-outline" size={mobileIconSizes.large} color={designTokens.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResetToDefault} style={styles.headerButton}>
            <MaterialCommunityIcons name="refresh" size={mobileIconSizes.large} color={designTokens.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddItem} style={styles.headerButton}>
            <MaterialCommunityIcons name="plus" size={mobileIconSizes.large} color={designTokens.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Meeting Info */}
      <View style={styles.meetingInfoSection}>
        <View style={styles.meetingInfoRow}>
          <MaterialCommunityIcons name="calendar" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
          <Text style={styles.meetingInfoLabel}>Meeting Date:</Text>
          <Text style={styles.meetingDate}>
            {meetingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
        
        <View style={styles.quickDateButtons}>
          <TouchableOpacity 
            style={styles.quickDateButton} 
            onPress={() => setMeetingDate(getNextSaturday())}
          >
            <Text style={styles.quickDateText}>Next Saturday</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickDateButton} 
            onPress={() => setMeetingDate(getNextSunday())}
          >
            <Text style={styles.quickDateText}>Next Sunday</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.meetingTitleInput}
          value={meetingTitle}
          onChangeText={setMeetingTitle}
          placeholder="Enter meeting title"
        />
      </View>

      {/* Total Time Banner */}
      <View style={styles.totalTimeBanner}>
        <MaterialCommunityIcons name="clock-outline" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
        <Text style={styles.totalTimeText}>
          Total Meeting Time: <Text style={styles.totalTimeBold}>{getTotalTime()} minutes</Text>
        </Text>
      </View>

      {/* Agenda Items */}
      <ScrollView style={styles.content}>
        {agendaItems.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-blank" size={64} color={designTokens.colors.borderLight} />
            <Text style={styles.emptyText}>No activities yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add activities</Text>
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
                  <Text style={styles.agendaTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.timeChip}>
                    <MaterialCommunityIcons name="clock-outline" size={mobileIconSizes.tiny} color={designTokens.colors.textSecondary} />
                    <Text style={styles.timeText}>{item.estimatedMinutes}m</Text>
                  </View>
                </View>

                {item.description && (
                  <Text style={styles.agendaDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}

                {/* Responsible Member */}
                <View style={styles.responsibleSection}>
                  {item.responsibleMemberId ? (
                    <View style={styles.memberChip}>
                      <MaterialCommunityIcons name="account" size={mobileIconSizes.small} color={designTokens.colors.primary} />
                      <Text style={styles.memberName} numberOfLines={1}>
                        {item.responsibleMemberName}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
                        <MaterialCommunityIcons name="close-circle" size={mobileIconSizes.small} color={designTokens.colors.textTertiary} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.assignButton}
                      onPress={() => handleAssignMember(item)}
                    >
                      <MaterialCommunityIcons name="account-plus" size={mobileIconSizes.small} color={designTokens.colors.primary} />
                      <Text style={styles.assignText}>Assign Member</Text>
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
                    onPress={() => handleMoveItem(index, 'up')}
                    disabled={index === 0}
                  >
                    <MaterialCommunityIcons
                      name="chevron-up"
                      size={mobileIconSizes.medium}
                      color={index === 0 ? designTokens.colors.borderLight : designTokens.colors.textSecondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.moveButton, index === agendaItems.length - 1 && styles.moveButtonDisabled]}
                    onPress={() => handleMoveItem(index, 'down')}
                    disabled={index === agendaItems.length - 1}
                  >
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={mobileIconSizes.medium}
                      color={index === agendaItems.length - 1 ? designTokens.colors.borderLight : designTokens.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Edit/Delete */}
                <TouchableOpacity style={styles.actionButton} onPress={() => handleEditItem(item)}>
                  <MaterialCommunityIcons name="pencil" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteItem(item.id)}>
                  <MaterialCommunityIcons name="delete" size={mobileIconSizes.medium} color={designTokens.colors.error} />
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
              <MaterialCommunityIcons name="content-save" size={mobileIconSizes.large} color={designTokens.colors.textInverse} />
              <Text style={styles.saveButtonText}>Save Meeting Plan</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsSaved(false)}>
                <MaterialCommunityIcons name="pencil" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={handleShareMeeting}>
                <MaterialCommunityIcons name="share-variant" size={mobileIconSizes.large} color={designTokens.colors.textInverse} />
                <Text style={styles.shareButtonText}>Share with Members</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Edit Item Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: modalWidth, maxHeight: windowHeight * 0.85, alignSelf: 'center' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentItem && agendaItems.find(i => i.id === currentItem.id) ? 'Edit' : 'Add'} Activity
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={mobileIconSizes.large} color={designTokens.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Activity Title *</Text>
              <TextInput
                style={styles.input}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="e.g., Welcome and Honors"
              />

              <Text style={styles.inputLabel}>Estimated Time (minutes) *</Text>
              <TextInput
                style={styles.input}
                value={editedMinutes}
                onChangeText={setEditedMinutes}
                placeholder="10"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder="Add notes or instructions..."
                multiline
                numberOfLines={4}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleSaveItem}>
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Select Member Modal */}
      <Modal
        visible={selectMemberModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectMemberModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: modalWidth, maxHeight: windowHeight * 0.85, alignSelf: 'center' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Responsible Member</Text>
              <TouchableOpacity onPress={() => setSelectMemberModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={mobileIconSizes.large} color={designTokens.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {clubMembers.length === 0 ? (
                <Text style={styles.noMembersText}>No active members available</Text>
              ) : (
                clubMembers.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberOption}
                    onPress={() => handleSelectMember(member)}
                  >
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>{member.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberOptionName}>{member.name}</Text>
                      <Text style={styles.memberOptionEmail}>{member.email}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={mobileIconSizes.medium} color={designTokens.colors.borderLight} />
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
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
          <View style={[styles.shareModalContent, { width: shareModalWidth }]}>
            <View style={styles.shareHeader}>
              <View style={styles.shareIconContainer}>
                <MaterialCommunityIcons name="share-variant" size={40} color={designTokens.colors.primary} />
              </View>
              <Text style={styles.shareTitle}>Share Meeting Plan</Text>
              <Text style={styles.shareSubtitle}>
                Send this meeting agenda to all {clubMembers.length} club members
              </Text>
            </View>

            <View style={styles.shareInfo}>
              <View style={styles.shareInfoRow}>
                <MaterialCommunityIcons name="calendar" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <View style={styles.shareInfoText}>
                  <Text style={styles.shareInfoLabel}>Meeting Date</Text>
                  <Text style={styles.shareInfoValue}>
                    {meetingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
              </View>

              <View style={styles.shareInfoRow}>
                <MaterialCommunityIcons name="clock-outline" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <View style={styles.shareInfoText}>
                  <Text style={styles.shareInfoLabel}>Total Duration</Text>
                  <Text style={styles.shareInfoValue}>{getTotalTime()} minutes</Text>
                </View>
              </View>

              <View style={styles.shareInfoRow}>
                <MaterialCommunityIcons name="format-list-numbered" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <View style={styles.shareInfoText}>
                  <Text style={styles.shareInfoLabel}>Activities</Text>
                  <Text style={styles.shareInfoValue}>{agendaItems.length} items</Text>
                </View>
              </View>
            </View>

            <View style={styles.shareActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShareModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, styles.shareConfirmButton]}
                onPress={confirmShareMeeting}
              >
                <MaterialCommunityIcons name="send" size={mobileIconSizes.medium} color={designTokens.colors.textInverse} />
                <Text style={styles.confirmButtonText}>Send to All Members</Text>
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
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerTitle: {
    ...mobileTypography.heading1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: designTokens.spacing.sm,
  },
  meetingInfoSection: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
    gap: 12,
  },
  meetingInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  meetingInfoLabel: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textSecondary,
  },
  meetingDate: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: 1,
  },
  quickDateButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  quickDateButton: {
    flex: 1,
    backgroundColor: designTokens.colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: designTokens.borderRadius.md,
    alignItems: 'center',
  },
  quickDateText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.primary,
  },
  meetingTitleInput: {
    ...mobileTypography.bodyLarge,
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: designTokens.colors.inputBackground,
  },
  totalTimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
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
    flex: 1,
  },
  agendaCard: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: designTokens.borderRadius.lg,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderBadge: {
    width: 32,
    height: 32,
    borderRadius: designTokens.borderRadius.xl,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textInverse,
  },
  agendaContent: {
    flex: 1,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  agendaTitle: {
    ...mobileTypography.bodyMediumBold,
    flex: 1,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: designTokens.borderRadius.lg,
    gap: 4,
  },
  timeText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    fontWeight: '600',
  },
  agendaDescription: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: 8,
  },
  responsibleSection: {
    marginTop: 8,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: designTokens.borderRadius.xl,
    alignSelf: 'flex-start',
    gap: 6,
  },
  memberName: {
    ...mobileTypography.label,
    color: designTokens.colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: designTokens.borderRadius.md,
    borderWidth: 1,
    borderColor: designTokens.colors.primary,
    borderStyle: 'dashed',
    alignSelf: 'flex-start',
    gap: 6,
  },
  assignText: {
    ...mobileTypography.label,
    color: designTokens.colors.primary,
    fontWeight: '600',
  },
  agendaActions: {
    marginLeft: 12,
    gap: 8,
  },
  moveButtons: {
    gap: 4,
  },
  moveButton: {
    padding: designTokens.spacing.xs,
  },
  moveButtonDisabled: {
    opacity: 0.3,
  },
  actionButton: {
    padding: designTokens.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    padding: designTokens.spacing.xl,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.borderLight,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: designTokens.colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
  },
  saveButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textInverse,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: designTokens.colors.backgroundSecondary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  editButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.primary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: designTokens.colors.success,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 10,
    flex: 1,
  },
  shareButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textInverse,
  },
  shareModalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xxl,
    padding: designTokens.spacing.xxl,
    alignSelf: 'center',
  },
  shareHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  shareIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: designTokens.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareTitle: {
    ...mobileTypography.heading2,
    textAlign: 'center',
    marginBottom: 8,
  },
  shareSubtitle: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
  },
  shareInfo: {
    backgroundColor: designTokens.colors.inputBackground,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    gap: 16,
    marginBottom: 24,
  },
  shareInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shareInfoText: {
    flex: 1,
  },
  shareInfoLabel: {
    ...mobileTypography.label,
    color: designTokens.colors.textSecondary,
    marginBottom: 4,
  },
  shareInfoValue: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
  },
  shareActions: {
    flexDirection: 'row',
    gap: 12,
  },
  shareConfirmButton: {
    flex: 1.5,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: designTokens.colors.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: designTokens.spacing.xl,
    borderBottomWidth: 1,
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
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    ...mobileTypography.bodyLarge,
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: designTokens.colors.inputBackground,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: designTokens.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.borderLight,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: designTokens.borderRadius.md,
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.inputBackground,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.xxl,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textInverse,
  },
  memberInfo: {
    flex: 1,
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
    textAlign: 'center',
    paddingVertical: 40,
  },
});

export default MeetingPlannerScreen;

