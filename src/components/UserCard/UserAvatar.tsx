import React from 'react';
import { View } from 'react-native';
import { Text } from '../../shared/components';
import { useTheme } from '../../contexts/ThemeContext';
import { TEXT_VARIANT } from '../../shared/constants';
import { styles } from './styles';

interface UserAvatarProps {
  name: string;
  isActive: boolean;
  backgroundColor: string;
  inactiveBackgroundColor: string;
  inactiveTextColor: string;
}

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
