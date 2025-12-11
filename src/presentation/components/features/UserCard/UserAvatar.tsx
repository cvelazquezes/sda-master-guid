import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { TEXT_VARIANT } from '../../../../shared/constants';
import { useTheme } from '../../../state/ThemeContext';
import { Text } from '../../primitives';

type UserAvatarProps = {
  name: string;
  isActive: boolean;
  backgroundColor: string;
  inactiveBackgroundColor: string;
  inactiveTextColor: string;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  isActive,
  backgroundColor,
  inactiveBackgroundColor,
  inactiveTextColor,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.avatar,
        { backgroundColor: isActive ? backgroundColor : inactiveBackgroundColor },
      ]}
    >
      <Text
        variant={TEXT_VARIANT.H3}
        style={[{ color: colors.textOnPrimary }, !isActive && { color: inactiveTextColor }]}
      >
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};
