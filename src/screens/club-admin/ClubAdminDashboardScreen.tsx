import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ClubDetailModal } from '../../components/ClubDetailModal';
import { ClubCard } from '../../components/ClubCard';
import { clubService } from '../../services/clubService';
import { Club } from '../../types';

const ClubAdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [clubDetailVisible, setClubDetailVisible] = useState(false);

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
    } catch (error) {
      Alert.alert('Error', 'Failed to load club information');
    }
  };

  const menuItems = [
    {
      id: 'members',
      title: 'Club Members',
      description: 'View and manage club members',
      icon: 'account-group',
      screen: 'ClubMembers',
      color: '#2196f3',
    },
    {
      id: 'matches',
      title: 'Generate Matches',
      description: 'Create new match rounds for your club',
      icon: 'coffee',
      screen: 'GenerateMatches',
      color: '#4caf50',
    },
    {
      id: 'settings',
      title: 'Club Settings',
      description: 'Configure club preferences',
      icon: 'cog',
      screen: 'ClubSettings',
      color: '#ff9800',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Club Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name}</Text>
        
        {/* Show club using standard ClubCard */}
        {club && (
          <View style={styles.clubCardContainer}>
            <ClubCard
              club={club}
              onPress={() => setClubDetailVisible(true)}
            />
          </View>
        )}
      </View>

      <View style={styles.content}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.screen as never)}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              <MaterialCommunityIcons name={item.icon as any} size={32} color={item.color} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Club Detail Modal */}
      <ClubDetailModal
        visible={clubDetailVisible}
        club={club}
        onClose={() => setClubDetailVisible(false)}
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
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  clubCardContainer: {
    marginTop: 16,
  },
});

export default ClubAdminDashboardScreen;

