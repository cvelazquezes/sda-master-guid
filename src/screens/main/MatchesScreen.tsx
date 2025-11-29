import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchService } from '../../services/matchService';
import { Match, MatchStatus } from '../../types';
import { format } from 'date-fns';

const MatchesScreen = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    try {
      const matchesData = await matchService.getMyMatches();
      setMatches(matchesData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const handleSkipMatch = async (matchId: string) => {
    Alert.alert(
      'Skip Match',
      'Are you sure you want to skip this match?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: async () => {
            try {
              await matchService.skipMatch(matchId);
              loadMatches();
            } catch (error) {
              Alert.alert('Error', 'Failed to skip match');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.PENDING:
        return '#ff9800';
      case MatchStatus.SCHEDULED:
        return '#2196f3';
      case MatchStatus.COMPLETED:
        return '#4caf50';
      case MatchStatus.SKIPPED:
        return '#999';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.PENDING:
        return 'clock-outline';
      case MatchStatus.SCHEDULED:
        return 'calendar-clock';
      case MatchStatus.COMPLETED:
        return 'check-circle';
      case MatchStatus.SKIPPED:
        return 'cancel';
      default:
        return 'help-circle';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Matches</Text>
        <Text style={styles.subtitle}>View and manage your coffee chats</Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="coffee-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>No matches yet</Text>
          <Text style={styles.emptySubtext}>
            Matches will appear here when they're generated
          </Text>
        </View>
      ) : (
        matches.map((match) => (
          <View key={match.id} style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <View style={styles.matchStatusBadge}>
                <MaterialCommunityIcons
                  name={getStatusIcon(match.status) as any}
                  size={20}
                  color={getStatusColor(match.status)}
                />
                <Text
                  style={[styles.matchStatus, { color: getStatusColor(match.status) }]}
                >
                  {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </Text>
              </View>
              {match.status === MatchStatus.PENDING && (
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => handleSkipMatch(match.id)}
                >
                  <MaterialCommunityIcons name="close" size={18} color="#f44336" />
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.matchBody}>
              <View style={styles.matchInfoRow}>
                <MaterialCommunityIcons name="account-group" size={20} color="#666" />
                <Text style={styles.matchInfoText}>
                  {match.participants.length} participant(s)
                </Text>
              </View>

              {match.scheduledDate && (
                <View style={styles.matchInfoRow}>
                  <MaterialCommunityIcons name="calendar" size={20} color="#666" />
                  <Text style={styles.matchInfoText}>
                    {format(new Date(match.scheduledDate), 'MMM dd, yyyy HH:mm')}
                  </Text>
                </View>
              )}

              <View style={styles.matchInfoRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                <Text style={styles.matchInfoText}>
                  Created: {format(new Date(match.createdAt), 'MMM dd, yyyy')}
                </Text>
              </View>
            </View>

            {match.status === MatchStatus.PENDING && (
              <TouchableOpacity style={styles.scheduleButton}>
                <MaterialCommunityIcons name="calendar-plus" size={20} color="#fff" />
                <Text style={styles.scheduleButtonText}>Schedule Meeting</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
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
  matchCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchStatus: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffebee',
  },
  skipButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#f44336',
    fontWeight: '600',
  },
  matchBody: {
    marginTop: 8,
  },
  matchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  matchInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  scheduleButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
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
});

export default MatchesScreen;

