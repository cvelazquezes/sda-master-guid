import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS, TEXT_LINES, MOVE_DIRECTION } from '../../../../shared/constants';
import { createAgendaCardStyles, createAssignButtonStyles } from './styles';
import type { AgendaItem } from './types';

type AgendaCardStylesType = ReturnType<typeof createAgendaCardStyles>;
type AssignButtonStylesType = ReturnType<typeof createAssignButtonStyles>;

type AgendaCardProps = {
  item: AgendaItem;
  index: number;
  totalItems: number;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onRemoveMember: () => void;
  onMove: (direction: typeof MOVE_DIRECTION.UP | typeof MOVE_DIRECTION.DOWN) => void;
  t: (key: string) => string;
};

export function AgendaCard({
  item,
  index,
  totalItems,
  onEdit,
  onDelete,
  onAssign,
  onRemoveMember,
  onMove,
  t,
}: AgendaCardProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useTheme();

  const agendaCardStyles = useMemo(
    () => createAgendaCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const assignButtonStyles = useMemo(
    () => createAssignButtonStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  return (
    <View style={agendaCardStyles.card}>
      <View style={agendaCardStyles.orderBadge}>
        <Text style={agendaCardStyles.orderText}>{index + 1}</Text>
      </View>
      <AgendaContent item={item} onAssign={onAssign} onRemoveMember={onRemoveMember} t={t} agendaCardStyles={agendaCardStyles} assignButtonStyles={assignButtonStyles} />
      <AgendaActions
        index={index}
        totalItems={totalItems}
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={onMove}
        agendaCardStyles={agendaCardStyles}
      />
    </View>
  );
}

type AgendaContentProps = {
  item: AgendaItem;
  onAssign: () => void;
  onRemoveMember: () => void;
  t: (key: string) => string;
  agendaCardStyles: AgendaCardStylesType;
  assignButtonStyles: AssignButtonStylesType;
};

function AgendaContent({
  item,
  onAssign,
  onRemoveMember,
  t,
  agendaCardStyles,
  assignButtonStyles,
}: AgendaContentProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={agendaCardStyles.content}>
      <View style={agendaCardStyles.header}>
        <Text style={agendaCardStyles.title} numberOfLines={TEXT_LINES.double}>
          {item.title}
        </Text>
        <View style={agendaCardStyles.timeChip}>
          <MaterialCommunityIcons
            name={ICONS.CLOCK_OUTLINE}
            size={iconSizes.xxs}
            color={colors.textSecondary}
          />
          <Text style={agendaCardStyles.timeText}>{item.estimatedMinutes}m</Text>
        </View>
      </View>
      {item.description && (
        <Text style={agendaCardStyles.description} numberOfLines={TEXT_LINES.double}>
          {item.description}
        </Text>
      )}
      <ResponsibleSection item={item} onAssign={onAssign} onRemoveMember={onRemoveMember} t={t} agendaCardStyles={agendaCardStyles} assignButtonStyles={assignButtonStyles} />
    </View>
  );
}

type ResponsibleSectionProps = {
  item: AgendaItem;
  onAssign: () => void;
  onRemoveMember: () => void;
  t: (key: string) => string;
  agendaCardStyles: AgendaCardStylesType;
  assignButtonStyles: AssignButtonStylesType;
};

function ResponsibleSection({
  item,
  onAssign,
  onRemoveMember,
  t,
  agendaCardStyles,
  assignButtonStyles,
}: ResponsibleSectionProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={agendaCardStyles.responsibleSection}>
      {item.responsibleMemberId ? (
        <View style={agendaCardStyles.memberChip}>
          <MaterialCommunityIcons name={ICONS.ACCOUNT} size={iconSizes.sm} color={colors.primary} />
          <Text style={agendaCardStyles.memberName} numberOfLines={TEXT_LINES.single}>
            {item.responsibleMemberName}
          </Text>
          <TouchableOpacity onPress={onRemoveMember}>
            <MaterialCommunityIcons
              name={ICONS.CLOSE_CIRCLE}
              size={iconSizes.sm}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={assignButtonStyles.button} onPress={onAssign}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_PLUS}
            size={iconSizes.sm}
            color={colors.primary}
          />
          <Text style={assignButtonStyles.text}>{t('screens.meetingPlanner.assignMember')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

type AgendaActionsProps = {
  index: number;
  totalItems: number;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: typeof MOVE_DIRECTION.UP | typeof MOVE_DIRECTION.DOWN) => void;
  agendaCardStyles: AgendaCardStylesType;
};

function AgendaActions({
  index,
  totalItems,
  onEdit,
  onDelete,
  onMove,
  agendaCardStyles,
}: AgendaActionsProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;
  const upColor = isFirst ? colors.borderLight : colors.textSecondary;
  const downColor = isLast ? colors.borderLight : colors.textSecondary;

  return (
    <View style={agendaCardStyles.actions}>
      <View style={agendaCardStyles.moveButtons}>
        <TouchableOpacity
          style={[agendaCardStyles.moveButton, isFirst && agendaCardStyles.moveButtonDisabled]}
          onPress={(): void => onMove(MOVE_DIRECTION.UP)}
          disabled={isFirst}
        >
          <MaterialCommunityIcons name={ICONS.CHEVRON_UP} size={iconSizes.md} color={upColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[agendaCardStyles.moveButton, isLast && agendaCardStyles.moveButtonDisabled]}
          onPress={(): void => onMove(MOVE_DIRECTION.DOWN)}
          disabled={isLast}
        >
          <MaterialCommunityIcons name={ICONS.CHEVRON_DOWN} size={iconSizes.md} color={downColor} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={agendaCardStyles.actionButton} onPress={onEdit}>
        <MaterialCommunityIcons name={ICONS.PENCIL} size={iconSizes.md} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={agendaCardStyles.actionButton} onPress={onDelete}>
        <MaterialCommunityIcons name={ICONS.DELETE} size={iconSizes.md} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}
