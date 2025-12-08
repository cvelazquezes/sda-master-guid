import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { statsStyles as styles } from './styles';

interface StatsSectionProps {
  stats: { total: number; pending: number; scheduled: number; completed: number };
  labels: {
    overview: string;
    total: string;
    pending: string;
    scheduled: string;
    completed: string;
  };
}

interface StatCardProps {
  value: number;
  label: string;
  color?: string;
}

function StatCard({ value, label, color }: StatCardProps): React.JSX.Element {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, color ? { color } : undefined]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function StatsSection({ stats, labels }: StatsSectionProps): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{labels.overview}</Text>
      <View style={styles.statsGrid}>
        <StatCard value={stats.total} label={labels.total} />
        <StatCard value={stats.pending} label={labels.pending} color={colors.warning} />
      </View>
      <View style={styles.statsGrid}>
        <StatCard value={stats.scheduled} label={labels.scheduled} color={colors.info} />
        <StatCard value={stats.completed} label={labels.completed} color={colors.success} />
      </View>
    </View>
  );
}
