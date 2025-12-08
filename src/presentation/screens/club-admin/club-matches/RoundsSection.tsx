import React from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';
import { Text } from '../../../components/primitives';
import { MatchRound } from '../../../../types';
import { useTheme } from '../../../state/ThemeContext';
import { DATE_FORMATS, ROUND_STATUS, DISPLAY_LIMITS } from '../../../../shared/constants';
import { roundsStyles as styles } from './styles';

interface RoundsSectionProps {
  matchRounds: MatchRound[];
  title: string;
}

function RoundCard({ round }: { round: MatchRound }): React.JSX.Element {
  const { colors } = useTheme();
  const isActive = round.status === ROUND_STATUS.ACTIVE;
  const badgeBg = isActive ? colors.successLight : colors.backgroundSecondary;
  const textColor = isActive ? colors.success : colors.textSecondary;
  const formattedDate = format(new Date(round.createdAt), DATE_FORMATS.DATE_FNS_DATE_DISPLAY);

  return (
    <View style={styles.roundCard}>
      <View style={styles.roundHeader}>
        <View>
          <Text style={styles.roundTitle}>Round {round.id}</Text>
          <Text style={styles.roundDate}>Created {formattedDate}</Text>
        </View>
        <View style={[styles.roundStatusBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.roundStatusText, { color: textColor }]}>
            {round.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.roundMatches}>{round.matches.length} matches generated</Text>
    </View>
  );
}

export function RoundsSection({
  matchRounds,
  title,
}: RoundsSectionProps): React.JSX.Element | null {
  if (matchRounds.length === 0) {
    return null;
  }
  const displayedRounds = matchRounds.slice(0, DISPLAY_LIMITS.MAX_PREVIEW_ITEMS);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {displayedRounds.map((round) => (
        <RoundCard key={round.id} round={round} />
      ))}
    </View>
  );
}
