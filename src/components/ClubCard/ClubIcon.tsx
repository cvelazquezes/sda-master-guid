import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { designTokens } from '../../shared/theme';
import { ICONS } from '../../shared/constants';
import { ClubIconProps } from './types';
import { styles } from './styles';

export const ClubIcon: React.FC<ClubIconProps> = ({
  isActive,
  primaryColor,
  inactiveColor,
  activeBackground,
  inactiveBackground,
}) => {
  return (
    <View
      style={[styles.icon, { backgroundColor: isActive ? activeBackground : inactiveBackground }]}
    >
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_GROUP}
        size={designTokens.icon.sizes.lg}
        color={isActive ? primaryColor : inactiveColor}
      />
    </View>
  );
};
