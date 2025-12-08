import React, { useMemo } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { createRoundsStyles } from './styles';
import { DATE_FORMATS, ROUND_STATUS, DISPLAY_LIMITS } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { MatchRound } from '../../../../types';

type RoundsSectionProps = {
  matchRounds: MatchRound[];
  title: string;
};

function RoundCard({
  round,
  styles,
}: {
  round: MatchRound;
  styles: ReturnType<typeof createRoundsStyles>;
}): React.JSX.Element {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isActive = round.status === ROUND_STATUS.ACTIVE;
  const badgeBg = isActive ? colors.successLight : colors.backgroundSecondary;
  const textColor = isActive ? colors.success : colors.textSecondary;
  const formattedDate = format(new Date(round.createdAt), DATE_FORMATS.DATE_FNS_DATE_DISPLAY);

  return (
    <View style={styles.roundCard}>
      <View style={styles.roundHeader}>
        <View>
          <Text style={styles.roundTitle}>{t('screens.clubMatches.round', { id: round.id })}</Text>
          <Text style={styles.roundDate}>
            {t('screens.clubMatches.createdOn', { date: formattedDate })}
          </Text>
        </View>
        <View style={[styles.roundStatusBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.roundStatusText, { color: textColor }]}>
            {round.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.roundMatches}>
        {t('screens.clubMatches.matchesGenerated', { count: round.matches.length })}
      </Text>
    </View>
  );
}

export function RoundsSection({
  matchRounds,
  title,
}: RoundsSectionProps): React.JSX.Element | null {
  const { colors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createRoundsStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  if (matchRounds.length === 0) {
    return null;
  }
  const displayedRounds = matchRounds.slice(0, DISPLAY_LIMITS.MAX_PREVIEW_ITEMS);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {displayedRounds.map((round) => (
        <RoundCard key={round.id} round={round} styles={styles} />
      ))}
    </View>
  );
}
