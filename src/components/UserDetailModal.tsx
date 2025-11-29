import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { User, Club } from '../types';
import { OrganizationHierarchy } from './OrganizationHierarchy';
import { clubService } from '../services/clubService';

interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ visible, user, onClose }) => {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user?.clubId) {
      loadClub();
    }
  }, [visible, user]);

  const loadClub = async () => {
    if (!user?.clubId) return;
    setLoading(true);
    try {
      const clubData = await clubService.getClub(user.clubId);
      setClub(clubData);
    } catch (error) {
      console.error('Failed to load club:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>{user.name}</Text>
                <Text style={styles.headerSubtitle}>User Details</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={20} color="#6200ee" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="email" size={20} color="#6200ee" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              </View>

              {user.whatsappNumber && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>WhatsApp</Text>
                    <Text style={styles.infoValue}>{user.whatsappNumber}</Text>
                  </View>
                </View>
              )}

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="shield-account" size={20} color="#6200ee" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Role</Text>
                  <Text style={styles.infoValue}>{user.role.replace('_', ' ').toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {/* Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>

              <View style={styles.statusRow}>
                <MaterialCommunityIcons
                  name={user.isActive ? 'check-circle' : 'cancel'}
                  size={20}
                  color={user.isActive ? '#4caf50' : '#f44336'}
                />
                <Text style={styles.statusText}>{user.isActive ? 'Active' : 'Inactive'}</Text>
              </View>

              <View style={styles.statusRow}>
                <MaterialCommunityIcons
                  name={user.isPaused ? 'pause-circle' : 'play-circle'}
                  size={20}
                  color={user.isPaused ? '#ff9800' : '#4caf50'}
                />
                <Text style={styles.statusText}>
                  Matches: {user.isPaused ? 'Paused' : 'Active'}
                </Text>
              </View>
            </View>

            {/* Organizational Hierarchy */}
            {user.role !== 'admin' && club && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Organization & Club</Text>
                <OrganizationHierarchy
                  data={{
                    division: club.division,
                    union: club.union,
                    association: club.association,
                    church: club.church,
                    clubName: club.name,
                  }}
                  title="Organizational Hierarchy"
                  initialExpanded={true}
                />
              </View>
            )}

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#6200ee" />
                <Text style={styles.loadingText}>Loading club information...</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 600,
    height: 600,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
});
