import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, StatusIndicator } from '../../shared/components';
import { useTheme } from '../../contexts/ThemeContext';
import { ICONS, STATUS, TEXT_LINES } from '../../shared/constants';
import { styles } from './styles';

interface UserMetaInfoProps {
  clubName?: string | null;
  whatsappNumber?: string;
  isActive: boolean;
  primaryColor: string;
  successColor: string;
  textSecondaryColor: string;
  textTertiaryColor: string;
}

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
      <StatusIndicator status={isActive ? STATUS.active : STATUS.inactive} showIcon />
    </View>
  );
};
