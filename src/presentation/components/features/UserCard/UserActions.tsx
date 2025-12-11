import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { COMPONENT_SIZE, ICONS } from '../../../../shared/constants';
import { formatDeleteLabel } from '../../../../shared/utils/formatters';
import { useTheme } from '../../../state/ThemeContext';
import { IconButton } from '../../primitives';
import type { User } from '../../../../types';

type UserActionsProps = {
  user: User;
  showAdminActions: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
  errorColor: string;
  successColor: string;
  textTertiaryColor: string;
};

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
  const { iconSizes } = useTheme();

  if (showAdminActions && (onToggleStatus || onDelete)) {
    return (
      <View style={styles.actionsContainer}>
        {onToggleStatus && (
          <IconButton
            icon={user.isActive ? ICONS.CANCEL : ICONS.CHECK_CIRCLE}
            size={COMPONENT_SIZE.md}
            color={user.isActive ? errorColor : successColor}
            accessibilityLabel={
              user.isActive ? t('accessibility.deactivateUser') : t('accessibility.activateUser')
            }
            onPress={onToggleStatus}
          />
        )}
        {onDelete && (
          <IconButton
            icon={ICONS.DELETE_OUTLINE}
            size={COMPONENT_SIZE.md}
            color={errorColor}
            accessibilityLabel={formatDeleteLabel(user.name, t)}
            onPress={onDelete}
          />
        )}
      </View>
    );
  }

  if (onPress) {
    return (
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={iconSizes.lg}
        color={textTertiaryColor}
        style={styles.chevron}
      />
    );
  }

  return null;
};
