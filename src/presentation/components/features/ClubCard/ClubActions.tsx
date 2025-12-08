import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../primitives';
import { useTheme } from '../../../state/ThemeContext';
import { COMPONENT_SIZE, ICONS } from '../../../../shared/constants';
import { formatDeleteLabel } from '../../../../shared/utils/formatters';
import { ClubActionsProps } from './types';
import { styles } from './styles';

export const ClubActions: React.FC<ClubActionsProps> = ({
  club,
  showAdminActions,
  onToggleStatus,
  onDelete,
  onPress,
  colors,
}) => {
  const { t } = useTranslation();
  const { iconSizes } = useTheme();

  if (showAdminActions && (onToggleStatus || onDelete)) {
    return (
      <View style={styles.actionsContainer}>
        {onToggleStatus && (
          <IconButton
            icon={club.isActive ? ICONS.CANCEL : ICONS.CHECK_CIRCLE}
            onPress={onToggleStatus}
            size={COMPONENT_SIZE.md}
            color={club.isActive ? colors.error : colors.success}
            accessibilityLabel={
              club.isActive ? t('accessibility.deactivateClub') : t('accessibility.activateClub')
            }
          />
        )}
        {onDelete && (
          <IconButton
            icon={ICONS.DELETE_OUTLINE}
            onPress={onDelete}
            size={COMPONENT_SIZE.md}
            color={colors.error}
            accessibilityLabel={formatDeleteLabel(club.name, t)}
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
        color={colors.textTertiary}
        style={styles.chevron}
      />
    );
  }

  return null;
};
