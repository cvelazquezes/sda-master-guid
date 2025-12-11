import React, { useMemo } from 'react';
import { View } from 'react-native';
import { createStatsStyles } from './styles';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type StatsSectionProps = {
  stats: { total: number; pending: number; scheduled: number; completed: number };
  labels: {
    overview: string;
    total: string;
    pending: string;
    scheduled: string;
    completed: string;
  };
};

type StatCardProps = {
  value: number;
  label: string;
  color?: string;
  styles: ReturnType<typeof createStatsStyles>;
};

function StatCard({ value, label, color, styles }: StatCardProps): React.JSX.Element {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, color ? { color } : undefined]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function StatsSection({ stats, labels }: StatsSectionProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStatsStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{labels.overview}</Text>
      <View style={styles.statsGrid}>
        <StatCard value={stats.total} label={labels.total} styles={styles} />
        <StatCard
          value={stats.pending}
          label={labels.pending}
          color={colors.warning}
          styles={styles}
        />
      </View>
      <View style={styles.statsGrid}>
        <StatCard
          value={stats.scheduled}
          label={labels.scheduled}
          color={colors.info}
          styles={styles}
        />
        <StatCard
          value={stats.completed}
          label={labels.completed}
          color={colors.success}
          styles={styles}
        />
      </View>
    </View>
  );
}
