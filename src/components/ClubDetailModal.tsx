import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Club } from '../types';
import { OrganizationHierarchy } from './OrganizationHierarchy';

interface ClubDetailModalProps {
  visible: boolean;
  club: Club | null;
  onClose: () => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({ visible, club, onClose }) => {
  if (!club) return null;

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
              <View style={styles.icon}>
                <MaterialCommunityIcons name="account-group" size={28} color="#6200ee" />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>{club.name}</Text>
                <Text style={styles.headerSubtitle}>Club Details</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="label" size={20} color="#6200ee" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{club.name}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="text" size={20} color="#6200ee" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{club.description}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name={club.isActive ? 'check-circle' : 'cancel'}
                  size={20}
                  color={club.isActive ? '#4caf50' : '#f44336'}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoValue}>{club.isActive ? 'Active' : 'Inactive'}</Text>
                </View>
              </View>
            </View>

            {/* Match Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Match Settings</Text>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color="#6200ee" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Match Frequency</Text>
                  <Text style={styles.infoValue}>{club.matchFrequency.replace('_', '-')}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account-multiple" size={20} color="#6200ee" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Group Size</Text>
                  <Text style={styles.infoValue}>{club.groupSize} people per match</Text>
                </View>
              </View>

              {club.memberCount !== undefined && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account-group" size={20} color="#6200ee" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Members</Text>
                    <Text style={styles.infoValue}>{club.memberCount} members</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Organizational Hierarchy */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Organizational Hierarchy</Text>
              <OrganizationHierarchy
                data={{
                  division: club.division,
                  union: club.union,
                  association: club.association,
                  church: club.church,
                }}
                title="Club Organization"
                initialExpanded={true}
              />
            </View>
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
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
});
