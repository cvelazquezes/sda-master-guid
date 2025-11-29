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
import { UserCard } from '../../components/UserCard';

const ClubMembersScreen = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

  useEffect(() => {
    if (user?.clubId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      const [membersData, clubData] = await Promise.all([
        clubService.getClubMembers(user.clubId),
        clubService.getClub(user.clubId),
      ]);
      setMembers(membersData);
      setClub(clubData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
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
      loadMembers();
    } catch (error) {
      Alert.alert('Error', 'Failed to update member status');
    }
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${memberName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteUser(memberId);
              loadMembers();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete member');
            }
          },
        },
      ]
    );
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
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !member.isPaused) ||
        (statusFilter === 'paused' && member.isPaused);

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);


  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Club Members</Text>
        <Text style={styles.subtitle}>
          Showing {filteredMembers.length} of {members.length} member(s)
        </Text>
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

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialCommunityIcons name="filter-variant" size={20} color="#6200ee" />
          <Text style={styles.filterButtonText}>Filters</Text>
          {statusFilter !== 'all' && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <UserCard
              key={member.id}
              user={member}
              onPress={() => {
                setSelectedMember(member);
                setDetailVisible(true);
              }}
              showAdminActions={true}
              onToggleStatus={() => handleToggleMemberStatus(member.id, member.isActive)}
              onDelete={() => handleDeleteMember(member.id, member.name)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-search" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No members found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
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
                  style={[
                    styles.filterOption,
                    statusFilter === 'all' && styles.filterOptionActive,
                  ]}
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
});

export default ClubMembersScreen;

