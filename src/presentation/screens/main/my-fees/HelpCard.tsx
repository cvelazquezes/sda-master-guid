import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS } from '../../../../shared/constants';
import { createStyles } from './styles';

interface HelpCardProps {
  colors: Record<string, string>;
  t: (key: string) => string;
}

export function HelpCard({ colors, t }: HelpCardProps): React.JSX.Element {
  const { iconSizes, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  return (
    <View style={[styles.helpCard, { backgroundColor: colors.surface }]}>
      <MaterialCommunityIcons name={ICONS.LIFEBUOY} size={iconSizes.lg} color={colors.primary} />
      <View style={styles.helpContent}>
        <Text style={[styles.helpTitle, { color: colors.textPrimary }]}>
          {t('screens.myFees.needHelp')}
        </Text>
        <Text style={[styles.helpText, { color: colors.textTertiary }]}>
          {t('screens.myFees.contactAdminForQuestions')}
        </Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={iconSizes.lg}
        color={colors.textTertiary}
      />
    </View>
  );
}
