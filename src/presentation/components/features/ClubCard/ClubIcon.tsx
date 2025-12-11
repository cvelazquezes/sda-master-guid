import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { ICONS } from '../../../../shared/constants';
import { useTheme } from '../../../state/ThemeContext';
import type { ClubIconProps } from './types';

export const ClubIcon: React.FC<ClubIconProps> = ({
  isActive,
  primaryColor,
  inactiveColor,
  activeBackground,
  inactiveBackground,
}) => {
  const { iconSizes } = useTheme();
  return (
    <View
      style={[styles.icon, { backgroundColor: isActive ? activeBackground : inactiveBackground }]}
    >
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_GROUP}
        size={iconSizes.lg}
        color={isActive ? primaryColor : inactiveColor}
      />
    </View>
  );
};
