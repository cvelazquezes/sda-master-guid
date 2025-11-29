import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import { Match, Club } from '../../types';
import { format } from 'date-fns';
import { ClubDetailModal } from '../../components/ClubDetailModal';
import { ClubCard } from '../../components/ClubCard';

const HomeScreen = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clubDetailVisible, setClubDetailVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      const [matchesData, clubData] = await Promise.all([
        matchService.getMyMatches(),
        clubService.getClub(user.clubId),
      ]);
      setMatches(matchesData.filter((m) => m.status === 'pending' || m.status === 'scheduled'));
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

  if (!user?.clubId) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-alert" size={64} color="#999" />
          <Text style={styles.emptyText}>You are not part of a club</Text>
          <Text style={styles.emptySubtext}>Please contact an administrator</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        
        {club && (
          <ClubCard
            club={club}
            onPress={() => setClubDetailVisible(true)}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        {matches.length === 0 ? (
          <View style={styles.emptyMatches}>
            <MaterialCommunityIcons name="coffee-outline" size={48} color="#999" />
            <Text style={styles.emptyMatchesText}>No upcoming matches</Text>
            <Text style={styles.emptyMatchesSubtext}>
              New matches will appear here when they're generated
            </Text>
          </View>
        ) : (
          matches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <MaterialCommunityIcons name="coffee" size={32} color="#6200ee" />
              <View style={styles.matchInfo}>
                <Text style={styles.matchStatus}>
                  Status: {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </Text>
                {match.scheduledDate && (
                  <Text style={styles.matchDate}>
                    Scheduled: {format(new Date(match.scheduledDate), 'MMM dd, yyyy')}
                  </Text>
                )}
                <Text style={styles.matchParticipants}>
                  {match.participants.length} participant(s)
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {user.isPaused && (
        <View style={styles.pausedBanner}>
          <MaterialCommunityIcons name="pause-circle" size={24} color="#ff9800" />
          <Text style={styles.pausedText}>Your matches are currently paused</Text>
        </View>
      )}

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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchInfo: {
    marginLeft: 12,
    flex: 1,
  },
  matchStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  matchDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  matchParticipants: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyMatches: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyMatchesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyMatchesSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  pausedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  pausedText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
});

export default HomeScreen;

