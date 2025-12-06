import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../shared/components';
import { User } from '../../types';
import { designTokens } from '../../shared/theme';
import { COMPONENT_SIZE, ICONS } from '../../shared/constants';
import { formatDeleteLabel } from '../../shared/utils/formatters';
import { styles } from './styles';

interface UserActionsProps {
  user: User;
  showAdminActions: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
  errorColor: string;
  successColor: string;
  textTertiaryColor: string;
}

export const UserActions: React.FC<UserActionsProps> = ({
  user,
  showAdminActions,
  onToggleStatus,
  onDelete,
  onPress,
  errorColor,
  successColor,
  textTertiaryColor,
}) => {
  const { t } = useTranslation();

  if (showAdminActions && (onToggleStatus || onDelete)) {
    return (
      <View style={styles.actionsContainer}>
        {onToggleStatus && (
          <IconButton
            icon={user.isActive ? ICONS.CANCEL : ICONS.CHECK_CIRCLE}
            onPress={onToggleStatus}
            size={COMPONENT_SIZE.md}
            color={user.isActive ? errorColor : successColor}
            accessibilityLabel={
              user.isActive ? t('accessibility.deactivateUser') : t('accessibility.activateUser')
            }
          />
        )}
        {onDelete && (
          <IconButton
            icon={ICONS.DELETE_OUTLINE}
            onPress={onDelete}
            size={COMPONENT_SIZE.md}
            color={errorColor}
            accessibilityLabel={formatDeleteLabel(user.name, t)}
          />
        )}
      </View>
    );
  }

  if (onPress) {
    return (
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={designTokens.icon.sizes.lg}
        color={textTertiaryColor}
        style={styles.chevron}
      />
    );
  }

  return null;
};
