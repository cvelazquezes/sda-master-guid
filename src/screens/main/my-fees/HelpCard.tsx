import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { designTokens } from '../../../shared/theme';
import { ICONS } from '../../../shared/constants';
import { styles } from './styles';

interface HelpCardProps {
  colors: Record<string, string>;
  t: (key: string) => string;
}

export function HelpCard({ colors, t }: HelpCardProps): React.JSX.Element {
  return (
    <View style={[styles.helpCard, { backgroundColor: colors.surface }]}>
      <MaterialCommunityIcons
        name={ICONS.LIFEBUOY}
        size={designTokens.iconSize.lg}
        color={colors.primary}
      />
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
        size={designTokens.iconSize.lg}
        color={colors.textTertiary}
      />
    </View>
  );
}
