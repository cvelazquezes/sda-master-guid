import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { UserDetailModal } from '../../components/UserDetailModal';
import { User, PathfinderClass } from '../../types';
import { ClassSelectionModal } from '../../components/ClassSelectionModal';

const ClubMembersScreen = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');

  // Class editing
  const [classEditModalVisible, setClassEditModalVisible] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<User | null>(null);

  useEffect(() => {
    if (user?.clubId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      const membersData = await clubService.getClubMembers(user.clubId);
      setMembers(membersData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleToggleMemberStatus = async (memberId: string, isActive: boolean) => {
    try {
      await userService.updateUser(memberId, { isActive: !isActive });
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update member status');
    }
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    Alert.alert('Delete Member', `Are you sure you want to delete ${memberName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await userService.deleteUser(memberId);
            loadData();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete member');
          }
        },
      },
    ]);
  };

  const handleApproveMember = async (memberId: string, memberName: string) => {
    Alert.alert('Approve Member', `Approve ${memberName} to join the club?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          try {
            await userService.approveUser(memberId);
            Alert.alert('Success', `${memberName} has been approved!`);
            loadData();
          } catch (error) {
            Alert.alert('Error', 'Failed to approve member');
          }
        },
      },
    ]);
  };

  const handleRejectMember = (memberId: string, memberName: string) => {
    Alert.alert('Reject Member', `Reject ${memberName}'s application? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            await userService.rejectUser(memberId);
            Alert.alert('Success', `${memberName}'s application has been rejected`);
            loadData();
          } catch (error) {
            Alert.alert('Error', 'Failed to reject member');
          }
        },
      },
    ]);
  };

  const handleEditClasses = (member: User) => {
    setMemberToEdit(member);
    setClassEditModalVisible(true);
  };

  const handleSaveClasses = async (classes: PathfinderClass[]) => {
    if (!memberToEdit) return;

    try {
      await userService.updateUser(memberToEdit.id, { classes });
      Alert.alert('Success', 'Classes updated successfully');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update classes');
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setFilterModalVisible(false);
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  // Filtered and searched members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Approval status filter
      const matchesApprovalStatus =
        (activeTab === 'approved' && member.approvalStatus === 'approved') ||
        (activeTab === 'pending' && member.approvalStatus === 'pending');

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower);

      // Status filter (only for approved members)
      const matchesStatus =
        activeTab === 'pending' || // Don't filter pending members by active/paused status
        statusFilter === 'all' ||
        (statusFilter === 'active' && !member.isPaused) ||
        (statusFilter === 'paused' && member.isPaused);

      return matchesApprovalStatus && matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter, activeTab]);

  const pendingCount = useMemo(() => {
    return members.filter((m) => m.approvalStatus === 'pending').length;
  }, [members]);

  const approvedCount = useMemo(() => {
    return members.filter((m) => m.approvalStatus === 'approved').length;
  }, [members]);

  // Auto-select tab if only one has members
  useEffect(() => {
    if (members.length > 0 && pendingCount === 0 && approvedCount > 0) {
      setActiveTab('approved');
    } else if (members.length > 0 && approvedCount === 0 && pendingCount > 0) {
      setActiveTab('pending');
    }
  }, [members, pendingCount, approvedCount]);

  // Auto-select status filter based on available data
  useEffect(() => {
    if (activeTab === 'approved' && members.length > 0) {
      const approvedMembers = members.filter((m) => m.approvalStatus === 'approved');
      const hasActive = approvedMembers.some((m) => !m.isPaused);
      const hasPaused = approvedMembers.some((m) => m.isPaused);

      // If only one type exists, auto-select it
      if (hasActive && !hasPaused && statusFilter === 'all') {
        setStatusFilter('active');
      } else if (hasPaused && !hasActive && statusFilter === 'all') {
        setStatusFilter('paused');
      }
    }
  }, [activeTab, members, statusFilter]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Club Members</Text>
        <Text style={styles.subtitle}>
          {approvedCount} approved • {pendingCount} pending
        </Text>
      </View>

      {/* Tabs for Approved/Pending */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'approved' && styles.tabActive]}
          onPress={() => setActiveTab('approved')}
        >
          <MaterialCommunityIcons
            name="account-check"
            size={20}
            color={activeTab === 'approved' ? '#6200ee' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'approved' && styles.tabTextActive]}>
            Approved ({approvedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <MaterialCommunityIcons
            name="clock-alert-outline"
            size={20}
            color={activeTab === 'pending' ? '#6200ee' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            Pending ({pendingCount})
          </Text>
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {activeTab === 'approved' && (
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <MaterialCommunityIcons name="filter-variant" size={20} color="#6200ee" />
            <Text style={styles.filterButtonText}>Filters</Text>
            {statusFilter !== 'all' && <View style={styles.filterBadge} />}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {filteredMembers.length > 0 ? (
          activeTab === 'pending' ? (
            // Pending members with approve/reject actions
            filteredMembers.map((member) => (
              <View key={member.id} style={styles.pendingMemberCard}>
                <View style={styles.pendingMemberInfo}>
                  <View style={styles.pendingMemberHeader}>
                    <MaterialCommunityIcons name="account-clock" size={24} color="#FF9800" />
                    <View style={styles.pendingMemberDetails}>
                      <Text style={styles.pendingMemberName}>{member.name}</Text>
                      <Text style={styles.pendingMemberEmail}>{member.email}</Text>
                      <View style={styles.pendingMemberContact}>
                        <MaterialCommunityIcons name="whatsapp" size={16} color="#25D366" />
                        <Text style={styles.pendingMemberPhone}>{member.whatsappNumber}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.pendingMemberActions}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleRejectMember(member.id, member.name)}
                    >
                      <MaterialCommunityIcons name="close-circle" size={20} color="#fff" />
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApproveMember(member.id, member.name)}
                    >
                      <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            // Approved members with normal actions
            filteredMembers.map((member) => (
              <View key={member.id} style={styles.approvedMemberCard}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMember(member);
                    setDetailVisible(true);
                  }}
                  style={styles.approvedMemberMain}
                >
                  <View style={styles.approvedMemberHeader}>
                    <View style={styles.approvedMemberInfo}>
                      <Text style={styles.approvedMemberName}>{member.name}</Text>
                      <Text style={styles.approvedMemberEmail}>{member.email}</Text>
                      {member.classes && member.classes.length > 0 && (
                        <View style={styles.classesRow}>
                          <MaterialCommunityIcons name="school" size={14} color="#6200ee" />
                          <Text style={styles.classesText}>{member.classes.join(', ')}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.memberStatusBadge}>
                      <MaterialCommunityIcons
                        name={member.isPaused ? 'pause-circle' : 'check-circle'}
                        size={16}
                        color={member.isPaused ? '#ff9800' : '#4caf50'}
                      />
                      <Text style={styles.memberStatusText}>
                        {member.isPaused ? 'Paused' : 'Active'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={styles.approvedMemberActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditClasses(member)}
                  >
                    <MaterialCommunityIcons name="school-outline" size={18} color="#6200ee" />
                    <Text style={styles.actionButtonText}>Edit Classes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleToggleMemberStatus(member.id, member.isActive)}
                  >
                    <MaterialCommunityIcons
                      name={member.isPaused ? 'play' : 'pause'}
                      size={18}
                      color="#ff9800"
                    />
                    <Text style={styles.actionButtonText}>
                      {member.isPaused ? 'Resume' : 'Pause'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteMember(member.id, member.name)}
                  >
                    <MaterialCommunityIcons name="delete-outline" size={18} color="#f44336" />
                    <Text style={[styles.actionButtonText, { color: '#f44336' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name={activeTab === 'pending' ? 'clock-check-outline' : 'account-search'}
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyStateText}>
              {activeTab === 'pending' ? 'No pending approvals' : 'No members found'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {activeTab === 'pending'
                ? 'All member registrations have been processed'
                : 'Try adjusting your search or filters'}
            </Text>
          </View>
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Members</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Status Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Status</Text>

                <TouchableOpacity
                  style={[styles.filterOption, statusFilter === 'all' && styles.filterOptionActive]}
                  onPress={() => setStatusFilter('all')}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="account-group"
                      size={20}
                      color={statusFilter === 'all' ? '#6200ee' : '#666'}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        statusFilter === 'all' && styles.filterOptionTextActive,
                      ]}
                    >
                      All Members
                    </Text>
                  </View>
                  {statusFilter === 'all' && (
                    <MaterialCommunityIcons name="check" size={20} color="#6200ee" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    statusFilter === 'active' && styles.filterOptionActive,
                  ]}
                  onPress={() => setStatusFilter('active')}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={statusFilter === 'active' ? '#6200ee' : '#4caf50'}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        statusFilter === 'active' && styles.filterOptionTextActive,
                      ]}
                    >
                      Active Only
                    </Text>
                  </View>
                  {statusFilter === 'active' && (
                    <MaterialCommunityIcons name="check" size={20} color="#6200ee" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    statusFilter === 'paused' && styles.filterOptionActive,
                  ]}
                  onPress={() => setStatusFilter('paused')}
                >
                  <View style={styles.filterOptionContent}>
                    <MaterialCommunityIcons
                      name="pause-circle"
                      size={20}
                      color={statusFilter === 'paused' ? '#6200ee' : '#ff9800'}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        statusFilter === 'paused' && styles.filterOptionTextActive,
                      ]}
                    >
                      Paused Only
                    </Text>
                  </View>
                  {statusFilter === 'paused' && (
                    <MaterialCommunityIcons name="check" size={20} color="#6200ee" />
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Member Detail Modal */}
      <UserDetailModal
        visible={detailVisible}
        user={selectedMember}
        onClose={() => {
          setDetailVisible(false);
          setSelectedMember(null);
        }}
      />

      {/* Class Edit Modal */}
      <ClassSelectionModal
        visible={classEditModalVisible}
        initialClasses={memberToEdit?.classes || []}
        onSave={handleSaveClasses}
        onClose={() => {
          setClassEditModalVisible(false);
          setMemberToEdit(null);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 6,
    position: 'relative',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200ee',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
  },
  content: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: 400,
  },
  filterSection: {
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  filterOptionActive: {
    backgroundColor: '#f0e6ff',
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterOptionText: {
    fontSize: 16,
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#6200ee',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    position: 'relative',
  },
  tabActive: {
    borderBottomColor: '#6200ee',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
  },
  tabTextActive: {
    color: '#6200ee',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pendingMemberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  pendingMemberInfo: {
    gap: 16,
  },
  pendingMemberHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  pendingMemberDetails: {
    flex: 1,
    gap: 4,
  },
  pendingMemberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pendingMemberEmail: {
    fontSize: 14,
    color: '#666',
  },
  pendingMemberContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  pendingMemberPhone: {
    fontSize: 14,
    color: '#666',
  },
  pendingMemberActions: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  approvedMemberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  approvedMemberMain: {
    padding: 16,
  },
  approvedMemberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  approvedMemberInfo: {
    flex: 1,
    marginRight: 12,
  },
  approvedMemberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  approvedMemberEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  classesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classesText: {
    fontSize: 13,
    color: '#6200ee',
    fontWeight: '500',
  },
  memberStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  memberStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  approvedMemberActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
});

export default ClubMembersScreen;
