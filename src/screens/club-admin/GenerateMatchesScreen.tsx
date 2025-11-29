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
import { matchService } from '../../services/matchService';
import { clubService } from '../../services/clubService';
import { useAuth } from '../../context/AuthContext';
import { MatchRound, Club } from '../../types';
import { format } from 'date-fns';

const GenerateMatchesScreen = () => {
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [matchRounds, setMatchRounds] = useState<MatchRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.clubId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.clubId) return;

    try {
      const [clubData, roundsData] = await Promise.all([
        clubService.getClub(user.clubId),
        matchService.getMatchRounds(user.clubId),
      ]);
      setClub(clubData);
      setMatchRounds(roundsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
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

  const handleGenerateMatches = () => {
    if (!user?.clubId) return;

    Alert.alert(
      'Generate Matches',
      'This will create a new match round for all active club members. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            setGenerating(true);
            try {
              await matchService.generateMatches(user.clubId!);
              Alert.alert('Success', 'Matches generated successfully!');
              loadData();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to generate matches'
              );
            } finally {
              setGenerating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Generate Matches</Text>
        {club && (
          <Text style={styles.subtitle}>
            {club.name} • {club.matchFrequency.replace('_', '-')} matches
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.generateButton, generating && styles.generateButtonDisabled]}
          onPress={handleGenerateMatches}
          disabled={generating}
        >
          <MaterialCommunityIcons name="coffee" size={24} color="#fff" />
          <Text style={styles.generateButtonText}>
            {generating ? 'Generating...' : 'Generate New Match Round'}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Rounds History</Text>
          {matchRounds.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="coffee-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No match rounds yet</Text>
              <Text style={styles.emptySubtext}>
                Generate your first match round to get started
              </Text>
            </View>
          ) : (
            matchRounds.map((round) => (
              <View key={round.id} style={styles.roundCard}>
                <View style={styles.roundHeader}>
                  <View style={styles.roundInfo}>
                    <MaterialCommunityIcons name="calendar-clock" size={24} color="#6200ee" />
                    <View style={styles.roundDetails}>
                      <Text style={styles.roundDate}>
                        {format(new Date(round.scheduledDate), 'MMM dd, yyyy')}
                      </Text>
                      <Text style={styles.roundStatus}>
                        {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.roundBadge}>
                    <Text style={styles.roundBadgeText}>
                      {round.matches.length} match(es)
                    </Text>
                  </View>
                </View>
                <Text style={styles.roundCreated}>
                  Created: {format(new Date(round.createdAt), 'MMM dd, yyyy HH:mm')}
                </Text>
              </View>
            ))
          )}
        </View>
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  roundCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roundDetails: {
    marginLeft: 12,
  },
  roundDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  roundStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  roundBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roundBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196f3',
  },
  roundCreated: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default GenerateMatchesScreen;

