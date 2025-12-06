import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/components';
import { designTokens } from '../../shared/theme';
import { CLASS_SELECTION, ICONS } from '../../shared/constants';
import { styles } from './styles';

interface InfoCardProps {
  selectedCount: number;
}

export const InfoCard: React.FC<InfoCardProps> = ({ selectedCount }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.infoCard}>
      <MaterialCommunityIcons
        name={ICONS.INFORMATION}
        size={designTokens.iconSize.md}
        color={designTokens.colors.primary}
      />
      <Text style={styles.infoText}>
        {t('classes.classInfo')} {selectedCount}/{CLASS_SELECTION.maximum}
      </Text>
    </View>
  );
};
