import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserDetailModal } from '../../components/UserDetailModal';
import { UserRole } from '../../types';

const SettingsScreen = () => {
  const { user, updateUser, logout } = useAuth();
  const [isPaused, setIsPaused] = useState(user?.isPaused || false);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleTogglePause = async (value: boolean) => {
    setLoading(true);
    try {
      await updateUser({ isPaused: value });
      setIsPaused(value);
      Alert.alert(
        'Success',
        value ? 'Your matches are now paused' : 'Your matches are now active'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
      setIsPaused(!value);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Logout button pressed');
              await logout();
              console.log('Logout function completed');
              // Navigation will automatically redirect to login when user becomes null
            } catch (error) {
              console.error('Logout error in handleLogout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setDetailVisible(true)}
        >
          <View style={styles.settingInfo}>
            <MaterialCommunityIcons name="account" size={24} color="#6200ee" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>My Profile</Text>
              <Text style={styles.settingValue}>View full details & organization</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Match Preferences - Only shown for non-admin users */}
      {user?.role !== UserRole.ADMIN && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Preferences</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="pause-circle" size={24} color="#6200ee" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Pause Matches</Text>
                <Text style={styles.settingDescription}>
                  Temporarily stop receiving new matches
                </Text>
              </View>
            </View>
            <Switch
              value={isPaused}
              onValueChange={handleTogglePause}
              disabled={loading}
              trackColor={{ false: '#ccc', true: '#6200ee' }}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialCommunityIcons name="web-clock" size={24} color="#6200ee" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Timezone</Text>
              <Text style={styles.settingValue}>{user?.timezone || 'Not set'}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialCommunityIcons name="translate" size={24} color="#6200ee" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>{user?.language || 'English'}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={24} color="#f44336" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* User Detail Modal */}
      <UserDetailModal
        visible={detailVisible}
        user={user}
        onClose={() => setDetailVisible(false)}
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
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  logoutButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
  },
});

export default SettingsScreen;

