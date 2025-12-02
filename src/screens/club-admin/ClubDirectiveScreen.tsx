import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { User } from '../../types';
import { mobileTypography, mobileIconSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { SelectionModal, SelectionItem } from '../../shared/components';
import { MESSAGES } from '../../shared/constants';

// Directive positions that can be assigned
interface DirectivePosition {
  id: string;
  title: string;
  titleSpanish: string;
  icon: string;
  color: string;
  description: string;
  memberId?: string;
  memberName?: string;
  memberEmail?: string;
}

const DIRECTIVE_POSITIONS: Omit<DirectivePosition, 'memberId' | 'memberName' | 'memberEmail'>[] = [
  {
    id: 'vice-director',
    title: 'Vice Director',
    titleSpanish: 'Subdirector',
    icon: 'account-star',
    color: designTokens.colors.warning,
    description: 'Assists the director and leads in their absence',
  },
  {
    id: 'associate-director',
    title: 'Associate Director',
    titleSpanish: 'Director Asociado',
    icon: 'account-supervisor',
    color: designTokens.colors.info,
    description: 'Supports club operations and special projects',
  },
  {
    id: 'treasurer',
    title: 'Treasurer',
    titleSpanish: 'Tesorero',
    icon: 'cash-multiple',
    color: designTokens.colors.success,
    description: 'Manages club finances and fees',
  },
  {
    id: 'counselor',
    title: 'Counselor',
    titleSpanish: 'Consejero',
    icon: 'account-heart',
    color: designTokens.colors.primary,
    description: 'Provides guidance and mentorship to members',
  },
  {
    id: 'secretary',
    title: 'Secretary',
    titleSpanish: 'Secretario',
    icon: 'clipboard-text',
    color: designTokens.colors.info,
    description: 'Maintains records and meeting minutes',
  },
  {
    id: 'events-coordinator',
    title: 'Events Coordinator',
    titleSpanish: 'Coordinador de Eventos',
    icon: 'calendar-star',
    color: designTokens.colors.error,
    description: 'Organizes club activities and special events',
  },
];

const ClubDirectiveScreen = () => {
  const { user } = useAuth();
  const [positions, setPositions] = useState<DirectivePosition[]>([]);
  const [clubMembers, setClubMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectMemberModalVisible, setSelectMemberModalVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<DirectivePosition | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Initialize positions
      const initialPositions = DIRECTIVE_POSITIONS.map(pos => ({ ...pos }));
      setPositions(initialPositions);

      // Load club members (exclude club_admin role as they're already directors)
      if (user?.clubId) {
        const members = await userService.getUsersByClub(user.clubId);
        // Filter active members who are not club admins
        const eligibleMembers = members.filter(
          m => m.isActive && m.role === 'user'
        );
        setClubMembers(eligibleMembers);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DIRECTIVE);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAssignMember = (position: DirectivePosition) => {
    setCurrentPosition(position);
    setSelectMemberModalVisible(true);
  };

  const handleSelectMember = (member: User) => {
    if (!currentPosition) return;

    // Check if member is already assigned to another position
    const existingPosition = positions.find(
      pos => pos.memberId === member.id && pos.id !== currentPosition.id
    );

    if (existingPosition) {
      Alert.alert(
        MESSAGES.TITLES.MEMBER_ALREADY_ASSIGNED,
        MESSAGES.WARNINGS.MEMBER_ALREADY_IN_POSITION,
        [
          { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
          {
            text: 'Reassign',
            onPress: () => {
              // Remove from old position
              setPositions(prev =>
                prev.map(pos =>
                  pos.id === existingPosition.id
                    ? { ...pos, memberId: undefined, memberName: undefined, memberEmail: undefined }
                    : pos
                )
              );
              // Assign to new position
              assignMemberToPosition(member);
            },
          },
        ]
      );
      return;
    }

    assignMemberToPosition(member);
  };

  const assignMemberToPosition = (member: User) => {
    if (!currentPosition) return;

    setPositions(prev =>
      prev.map(pos =>
        pos.id === currentPosition.id
          ? {
              ...pos,
              memberId: member.id,
              memberName: member.name,
              memberEmail: member.email,
            }
          : pos
      )
    );

    setSelectMemberModalVisible(false);
    setCurrentPosition(null);

    // Show success message
    Alert.alert(
      MESSAGES.TITLES.MEMBER_ASSIGNED_TO_POSITION,
      `${member.name} has been assigned as ${currentPosition.title}.`,
      [{ text: MESSAGES.BUTTONS.OK }]
    );
  };

  const handleRemoveMember = (position: DirectivePosition) => {
    Alert.alert(
      MESSAGES.TITLES.REMOVE_MEMBER,
      MESSAGES.WARNINGS.CONFIRM_REMOVE_MEMBER,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPositions(prev =>
              prev.map(pos =>
                pos.id === position.id
                  ? { ...pos, memberId: undefined, memberName: undefined, memberEmail: undefined }
                  : pos
              )
            );
          },
        },
      ]
    );
  };

  const handleSaveDirective = () => {
    const assignedCount = positions.filter(pos => pos.memberId).length;
    
    if (assignedCount === 0) {
      Alert.alert(
        MESSAGES.TITLES.NO_ASSIGNMENTS,
        'Please assign at least one member to a directive position before saving.',
        [{ text: MESSAGES.BUTTONS.OK }]
      );
      return;
    }

    Alert.alert(
      MESSAGES.TITLES.DIRECTIVE_SAVED_TITLE,
      `Club directive with ${assignedCount} member${assignedCount !== 1 ? 's' : ''} has been saved successfully. All club members will be notified of the directive structure.`,
      [{ text: MESSAGES.BUTTONS.OK }]
    );
  };

  const getAssignedPositions = () => positions.filter(pos => pos.memberId);
  const getUnassignedPositions = () => positions.filter(pos => !pos.memberId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Club Directive</Text>
        <Text style={styles.headerSubtitle}>Assign leadership positions to members</Text>
      </View>

      {/* Summary Banner */}
      <View style={styles.summaryBanner}>
        <View style={styles.summaryItem}>
          <MaterialCommunityIcons name="account-check" size={mobileIconSizes.medium} color={designTokens.colors.success} />
          <Text style={styles.summaryText}>
            <Text style={styles.summaryBold}>{getAssignedPositions().length}</Text> Assigned
          </Text>
        </View>
        <View style={styles.summarySeparator} />
        <View style={styles.summaryItem}>
          <MaterialCommunityIcons name="account-clock" size={mobileIconSizes.medium} color={designTokens.colors.warning} />
          <Text style={styles.summaryText}>
            <Text style={styles.summaryBold}>{getUnassignedPositions().length}</Text> Vacant
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Assigned Positions Section */}
        {getAssignedPositions().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Positions</Text>
            {getAssignedPositions().map(position => (
              <View key={position.id} style={styles.positionCard}>
                {/* Position Icon & Info */}
                <View style={[styles.positionIcon, { backgroundColor: `${position.color}20` }]}>
                  <MaterialCommunityIcons
                    name={position.icon as any}
                    size={mobileIconSizes.xlarge}
                    color={position.color}
                  />
                </View>

                <View style={styles.positionContent}>
                  <View style={styles.positionHeader}>
                    <Text style={styles.positionTitle}>{position.title}</Text>
                    <Text style={styles.positionSpanish}>{position.titleSpanish}</Text>
                  </View>

                  {/* Assigned Member */}
                  <View style={styles.memberCard}>
                    <View style={[styles.memberAvatar, { backgroundColor: position.color }]}>
                      <Text style={styles.memberAvatarText}>
                        {position.memberName?.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{position.memberName}</Text>
                      <Text style={styles.memberEmail}>{position.memberEmail}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveMember(position)}
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={mobileIconSizes.medium}
                        color={designTokens.colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Vacant Positions Section */}
        {getUnassignedPositions().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vacant Positions</Text>
            {getUnassignedPositions().map(position => (
              <View key={position.id} style={styles.positionCard}>
                {/* Position Icon & Info */}
                <View style={[styles.positionIcon, { backgroundColor: `${position.color}20` }]}>
                  <MaterialCommunityIcons
                    name={position.icon as any}
                    size={mobileIconSizes.xlarge}
                    color={position.color}
                  />
                </View>

                <View style={styles.positionContent}>
                  <View style={styles.positionHeader}>
                    <Text style={styles.positionTitle}>{position.title}</Text>
                    <Text style={styles.positionSpanish}>{position.titleSpanish}</Text>
                  </View>
                  <Text style={styles.positionDescription}>{position.description}</Text>

                  {/* Assign Button */}
                  <TouchableOpacity
                    style={styles.assignButton}
                    onPress={() => handleAssignMember(position)}
                  >
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={mobileIconSizes.small}
                      color={designTokens.colors.primary}
                    />
                    <Text style={styles.assignButtonText}>Assign Member</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="information" size={mobileIconSizes.medium} color={designTokens.colors.info} />
          <Text style={styles.infoText}>
            Club directive members help organize and lead club activities. Assign members to build a strong leadership team.
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      {getAssignedPositions().length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDirective}>
            <MaterialCommunityIcons name="content-save" size={mobileIconSizes.large} color={designTokens.colors.textInverse} />
            <Text style={styles.saveButtonText}>Save Directive</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Select Member Modal */}
      <SelectionModal
        visible={selectMemberModalVisible}
        onClose={() => setSelectMemberModalVisible(false)}
        title="Assign Member"
        subtitle={currentPosition ? `${currentPosition.title} - ${currentPosition.titleSpanish}` : undefined}
        items={clubMembers.map(member => {
          const assignedPosition = positions.find(pos => pos.memberId === member.id);
          const isAssigned = !!assignedPosition;
          const isSamePosition = assignedPosition?.id === currentPosition?.id;

          return {
            id: member.id,
            title: member.name,
            subtitle: member.email,
            avatar: member.name.charAt(0).toUpperCase(),
            iconColor: assignedPosition?.color || designTokens.colors.primary,
            badge: isAssigned ? assignedPosition.title : undefined,
            badgeColor: assignedPosition?.color,
            disabled: isAssigned && isSamePosition,
          };
        })}
        onSelectItem={(item) => {
          const member = clubMembers.find(m => m.id === item.id);
          if (member) {
            handleSelectMember(member);
          }
        }}
        emptyMessage="No available members. All eligible members have been assigned or are inactive."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  header: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerTitle: {
    ...mobileTypography.heading1,
  },
  headerSubtitle: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginTop: 4,
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
  summaryBold: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
  },
  summarySeparator: {
    width: 1,
    height: 30,
    backgroundColor: designTokens.colors.borderLight,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: designTokens.spacing.xl,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: 16,
  },
  positionCard: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    marginBottom: 12,
    borderRadius: designTokens.borderRadius.lg,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  positionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  positionContent: {
    flex: 1,
  },
  positionHeader: {
    marginBottom: 6,
  },
  positionTitle: {
    ...mobileTypography.bodyLargeBold,
  },
  positionSpanish: {
    ...mobileTypography.label,
    color: designTokens.colors.textSecondary,
    fontStyle: 'italic',
  },
  positionDescription: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.inputBackground,
    padding: 10, // Custom spacing
    borderRadius: 10,
    marginTop: 8,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  memberAvatarText: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textInverse,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...mobileTypography.bodyMediumBold,
  },
  memberEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    padding: 6, // Custom spacing
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: designTokens.borderRadius.md,
    borderWidth: 1,
    borderColor: designTokens.colors.primary,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
  },
  assignButtonText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.primary,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.infoLight,
    padding: designTokens.spacing.lg,
    margin: designTokens.spacing.xl,
    borderRadius: 10,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: designTokens.colors.info,
  },
  infoText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.info,
    flex: 1,
    lineHeight: 20,
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
});

export default ClubDirectiveScreen;

