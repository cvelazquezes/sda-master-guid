import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { designTokens } from '../../shared/theme';
import { ICONS } from '../../shared/constants';
import {
  formatMatchFrequency,
  formatMembersCount,
  formatGroupSize,
} from '../../shared/utils/formatters';
import { styles } from './styles';

interface ClubDetailsProps {
  matchFrequency: string;
  groupSize: number;
  memberCount?: number;
  textColor: string;
}

export const ClubDetails: React.FC<ClubDetailsProps> = ({
  matchFrequency,
  groupSize,
  memberCount,
  textColor,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.clubDetails}>
      <View style={styles.detailItem}>
        <MaterialCommunityIcons
          name={ICONS.CALENDAR_CLOCK}
          size={designTokens.icon.sizes.xs}
          color={textColor}
        />
        <Text style={[styles.detailText, { color: textColor }]}>
          {formatMatchFrequency(matchFrequency, t)}
        </Text>
      </View>
      <View style={styles.detailItem}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_MULTIPLE}
          size={designTokens.icon.sizes.xs}
          color={textColor}
        />
        <Text style={[styles.detailText, { color: textColor }]}>
          {formatGroupSize(groupSize, t)}
        </Text>
      </View>
      {memberCount !== undefined && (
        <View style={styles.detailItem}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_GROUP}
            size={designTokens.icon.sizes.xs}
            color={textColor}
          />
          <Text style={[styles.detailText, { color: textColor }]}>
            {formatMembersCount(memberCount, t)}
          </Text>
        </View>
      )}
    </View>
  );
};
