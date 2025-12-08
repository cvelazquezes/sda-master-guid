import React from 'react';
import { View } from 'react-native';
import { Text, StatusIndicator } from '../../primitives';
import { ENTITY_STATUS, TEXT_LINES } from '../../../../shared/constants';
import { ClubInfoProps } from './types';
import { ClubHierarchy } from './ClubHierarchy';
import { ClubDetails } from './ClubDetails';
import { styles } from './styles';

export const ClubInfo: React.FC<ClubInfoProps> = ({
  club,
  textPrimaryColor,
  textSecondaryColor,
  textTertiaryColor,
  primaryColor,
}) => {
  const nameColor = club.isActive ? textPrimaryColor : textTertiaryColor;
  const descriptionColor = club.isActive ? textSecondaryColor : textTertiaryColor;
  const detailColor = club.isActive ? textSecondaryColor : textTertiaryColor;

  return (
    <View style={styles.clubInfo}>
      <View style={styles.clubHeader}>
        <Text style={[styles.clubName, { color: nameColor }]} numberOfLines={TEXT_LINES.single}>
          {club.name}
        </Text>
        <StatusIndicator status={club.isActive ? ENTITY_STATUS.ACTIVE : ENTITY_STATUS.INACTIVE} showIcon />
      </View>

      <Text
        style={[styles.clubDescription, { color: descriptionColor }]}
        numberOfLines={TEXT_LINES.single}
      >
        {club.description}
      </Text>

      <ClubHierarchy
        church={club.church}
        association={club.association}
        isActive={club.isActive}
        primaryColor={primaryColor}
        textColor={detailColor}
      />

      <ClubDetails
        matchFrequency={club.matchFrequency}
        groupSize={club.groupSize}
        memberCount={club.memberCount}
        textColor={detailColor}
      />
    </View>
  );
};
