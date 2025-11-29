import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { useAuth } from '../../context/AuthContext';
import { Club, MatchFrequency } from '../../types';
import { OrganizationHierarchy } from '../../components/OrganizationHierarchy';

const ClubSettingsScreen = () => {
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: 2,
  });

  useEffect(() => {
    if (user?.clubId) {
      loadClub();
    }
  }, [user]);

  const loadClub = async () => {
    if (!user?.clubId) return;

    try {
      const clubData = await clubService.getClub(user.clubId);
      setClub(clubData);
      setFormData({
        name: clubData.name,
        description: clubData.description,
        matchFrequency: clubData.matchFrequency,
        groupSize: clubData.groupSize,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load club settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.clubId || !formData.name || !formData.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await clubService.updateClub(user.clubId, formData);
      loadClub();
      Alert.alert('Success', 'Club settings updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update club settings');
    }
  };

  if (!club) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Club Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Show club's organizational hierarchy */}
        {club && (
          <View style={styles.hierarchySection}>
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
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Club Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Settings</Text>
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Match Frequency</Text>
            <View style={styles.selectOptions}>
              {Object.values(MatchFrequency).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.selectOption,
                    formData.matchFrequency === freq && styles.selectOptionActive,
                  ]}
                  onPress={() => setFormData({ ...formData, matchFrequency: freq })}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      formData.matchFrequency === freq && styles.selectOptionTextActive,
                    ]}
                  >
                    {freq.replace('_', '-')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Group Size</Text>
            <View style={styles.selectOptions}>
              {[2, 3].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.selectOption,
                    formData.groupSize === size && styles.selectOptionActive,
                  ]}
                  onPress={() => setFormData({ ...formData, groupSize: size })}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      formData.groupSize === size && styles.selectOptionTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    marginBottom: 20,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  selectOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  selectOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectOptionActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  hierarchySection: {
    marginBottom: 16,
  },
});

export default ClubSettingsScreen;

