import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { ICONS, ENTITY_STATUS, TEXT_LINES } from '../../../../shared/constants';
import { useTheme } from '../../../state/ThemeContext';
import { Text, StatusIndicator } from '../../primitives';

type UserMetaInfoProps = {
  clubName?: string | null;
  whatsappNumber?: string;
  isActive: boolean;
  primaryColor: string;
  successColor: string;
  textSecondaryColor: string;
  textTertiaryColor: string;
};

export const UserMetaInfo: React.FC<UserMetaInfoProps> = ({
  clubName,
  whatsappNumber,
  isActive,
  primaryColor,
  successColor,
  textSecondaryColor,
  textTertiaryColor,
}) => {
  const { iconSizes } = useTheme();
  const textColor = isActive ? textSecondaryColor : textTertiaryColor;

  return (
    <View style={styles.detailsRow}>
      {clubName && (
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_GROUP}
            size={iconSizes.xs}
            color={isActive ? primaryColor : textTertiaryColor}
          />
          <Text style={[styles.metaText, { color: textColor }]} numberOfLines={TEXT_LINES.single}>
            {clubName}
          </Text>
        </View>
      )}
      {whatsappNumber && (
        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name={ICONS.WHATSAPP}
            size={iconSizes.xs}
            color={isActive ? successColor : textTertiaryColor}
          />
          <Text style={[styles.metaText, { color: textColor }]} numberOfLines={TEXT_LINES.single}>
            {whatsappNumber}
          </Text>
        </View>
      )}
      <StatusIndicator showIcon status={isActive ? ENTITY_STATUS.ACTIVE : ENTITY_STATUS.INACTIVE} />
    </View>
  );
};
