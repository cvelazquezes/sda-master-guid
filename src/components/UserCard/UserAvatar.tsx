import React from 'react';
import { View } from 'react-native';
import { Text } from '../../shared/components';
import { designTokens } from '../../shared/theme';
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
  return (
    <View
      style={[
        styles.avatar,
        { backgroundColor: isActive ? backgroundColor : inactiveBackgroundColor },
      ]}
    >
      <Text
        style={[
          styles.avatarText,
          { color: designTokens.colors.white },
          !isActive && { color: inactiveTextColor },
        ]}
      >
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};
