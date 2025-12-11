import React from 'react';
import { View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { modalStyles } from './modalStyles';
import {
  ANIMATION_TYPE,
  ICONS,
  DATE_FORMATS,
  TOUCH_OPACITY,
  TEXT_LINES,
  KEYBOARD_TYPE,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
} from '../../../../shared/constants';
import { Text, Input } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { User } from '../../../../types';

type ChargeModalProps = {
  visible: boolean;
  onClose: () => void;
  modalWidth: number;
  windowHeight: number;
  chargeDescription: string;
  setChargeDescription: (v: string) => void;
  chargeAmount: string;
  setChargeAmount: (v: string) => void;
  chargeDueDate: string;
  setChargeDueDate: (v: string) => void;
  chargeApplyToAll: boolean;
  setChargeApplyToAll: (v: boolean) => void;
  selectedMemberIds: string[];
  setSelectedMemberIds: (v: string[]) => void;
  members: User[];
  onCreate: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
};

const MODAL_HEIGHT_RATIO = 0.85;

export function ChargeModal({
  visible,
  onClose,
  modalWidth,
  windowHeight,
  chargeDescription,
  setChargeDescription,
  chargeAmount,
  setChargeAmount,
  chargeDueDate,
  setChargeDueDate,
  chargeApplyToAll,
  setChargeApplyToAll,
  selectedMemberIds,
  setSelectedMemberIds,
  members,
  onCreate,
  t,
}: ChargeModalProps): React.JSX.Element {
  const { colors } = useTheme();
  const maxHeight = windowHeight * MODAL_HEIGHT_RATIO;

  return (
    <Modal
      transparent
      accessibilityViewIsModal
      visible={visible}
      animationType={ANIMATION_TYPE.FADE}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.content, { width: modalWidth, maxHeight }]}>
          <ModalHeader colors={colors} t={t} onClose={onClose} />
          <ScrollView style={modalStyles.body} showsVerticalScrollIndicator={false}>
            {/* eslint-disable-next-line no-restricted-syntax -- Input has accessibilityLabel inside */}
            <DescriptionInput value={chargeDescription} t={t} onChange={setChargeDescription} />
            {/* eslint-disable-next-line no-restricted-syntax -- Input has accessibilityLabel inside */}
            <AmountInput value={chargeAmount} t={t} onChange={setChargeAmount} />
            {/* eslint-disable-next-line no-restricted-syntax -- Input has accessibilityLabel inside */}
            <DueDateInput value={chargeDueDate} t={t} onChange={setChargeDueDate} />
            <ApplyToSection
              chargeApplyToAll={chargeApplyToAll}
              setChargeApplyToAll={setChargeApplyToAll}
              selectedMemberIds={selectedMemberIds}
              setSelectedMemberIds={setSelectedMemberIds}
              members={members}
              colors={colors}
              t={t}
            />
          </ScrollView>
          <ModalFooter t={t} onClose={onClose} onCreate={onCreate} />
        </View>
      </View>
    </Modal>
  );
}

type ModalHeaderProps = {
  onClose: () => void;
  colors: Record<string, string>;
  t: (key: string) => string;
};

function ModalHeader({ onClose, colors, t }: ModalHeaderProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={modalStyles.header}>
      <Text style={modalStyles.title}>{t('screens.clubFees.createCustomCharge')}</Text>
      <TouchableOpacity
        style={modalStyles.closeButton}
        accessibilityRole="button"
        accessibilityLabel="Close modal"
        onPress={onClose}
      >
        <MaterialCommunityIcons
          name={ICONS.CLOSE}
          size={iconSizes.lg}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

type InputProps = {
  value: string;
  onChange: (v: string) => void;
  colors: Record<string, string>;
  t: (key: string) => string;
};

function DescriptionInput({ value, onChange, t }: Omit<InputProps, 'colors'>): React.JSX.Element {
  return (
    <Input
      multiline
      label={t('screens.clubFees.description')}
      value={value}
      placeholder={t('screens.clubFees.descriptionPlaceholder')}
      numberOfLines={TEXT_LINES.double}
      accessibilityLabel="Description"
      onChangeText={onChange}
    />
  );
}

function AmountInput({ value, onChange, t }: Omit<InputProps, 'colors'>): React.JSX.Element {
  return (
    <Input
      label={t('screens.clubFees.amount')}
      value={value}
      keyboardType={KEYBOARD_TYPE.DECIMAL_PAD}
      placeholder={`$ ${t('screens.clubFees.amountPlaceholder')}`}
      accessibilityLabel="Amount"
      onChangeText={onChange}
    />
  );
}

function DueDateInput({ value, onChange, t }: Omit<InputProps, 'colors'>): React.JSX.Element {
  return (
    <Input
      label={t('screens.clubFees.dueDateLabel')}
      value={value}
      placeholder={DATE_FORMATS.ISO_DATE}
      helperText={t('screens.clubFees.dueDateFormat')}
      accessibilityLabel="Due date"
      onChangeText={onChange}
    />
  );
}

type ApplyToSectionProps = {
  chargeApplyToAll: boolean;
  setChargeApplyToAll: (v: boolean) => void;
  selectedMemberIds: string[];
  setSelectedMemberIds: (v: string[]) => void;
  members: User[];
  colors: Record<string, string>;
  t: (key: string, opts?: Record<string, unknown>) => string;
};

function ApplyToSection({
  chargeApplyToAll,
  setChargeApplyToAll,
  selectedMemberIds,
  setSelectedMemberIds,
  members,
  colors,
  t,
}: ApplyToSectionProps): React.JSX.Element {
  const toggleAll = (): void => {
    setChargeApplyToAll(true);
    setSelectedMemberIds([]);
  };
  const toggleSelect = (): void => setChargeApplyToAll(false);

  return (
    <View style={modalStyles.inputGroup}>
      <Text style={modalStyles.label}>{t('screens.clubFees.applyTo')}</Text>
      <View style={modalStyles.applyToContainer}>
        <ApplyToOption
          icon={ICONS.ACCOUNT_GROUP}
          label={t('screens.clubFees.allMembersOption')}
          active={chargeApplyToAll}
          colors={colors}
          onPress={toggleAll}
        />
        <ApplyToOption
          icon={ICONS.ACCOUNT_MULTIPLE_CHECK}
          label={t('screens.clubFees.selectMembersOption')}
          active={!chargeApplyToAll}
          colors={colors}
          onPress={toggleSelect}
        />
      </View>
      {!chargeApplyToAll && (
        <MemberSelection
          selectedMemberIds={selectedMemberIds}
          setSelectedMemberIds={setSelectedMemberIds}
          members={members}
          t={t}
        />
      )}
    </View>
  );
}

type ApplyToOptionProps = {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
  colors: Record<string, string>;
};

function ApplyToOption({
  icon,
  label,
  active,
  onPress,
  colors,
}: ApplyToOptionProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const optionStyle = [modalStyles.applyToOption, active && modalStyles.applyToOptionActive];
  const textStyle = [modalStyles.applyToText, active && modalStyles.applyToTextActive];
  const iconColor = active ? colors.primary : colors.textSecondary;
  return (
    <TouchableOpacity
      style={optionStyle}
      activeOpacity={TOUCH_OPACITY.default}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon as typeof ICONS.ACCOUNT_GROUP}
        size={iconSizes.md}
        color={iconColor}
      />
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

function MemberItem({
  member,
  isSelected,
  onToggle,
}: {
  member: User;
  isSelected: boolean;
  onToggle: () => void;
}): React.JSX.Element {
  const { colors, iconSizes } = useTheme();
  const itemStyle = [modalStyles.memberItem, isSelected && modalStyles.memberItemSelected];
  const checkboxStyle = [
    modalStyles.checkbox,
    isSelected && [modalStyles.checkboxSelected, { backgroundColor: colors.primary }],
  ];
  return (
    <TouchableOpacity
      key={member.id}
      style={itemStyle}
      activeOpacity={TOUCH_OPACITY.default}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={member.name}
      onPress={onToggle}
    >
      <View style={modalStyles.memberItemLeft}>
        <View style={checkboxStyle}>
          {isSelected && (
            <MaterialCommunityIcons
              name={ICONS.CHECK}
              size={iconSizes.sm}
              color={colors.textOnPrimary}
            />
          )}
        </View>
        <View style={modalStyles.memberItemInfo}>
          <Text variant={TEXT_VARIANT.BODY} weight={TEXT_WEIGHT.SEMIBOLD}>
            {member.name}
          </Text>
          <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.SECONDARY}>
            {member.email}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

type MemberSelectionProps = {
  selectedMemberIds: string[];
  setSelectedMemberIds: (v: string[]) => void;
  members: User[];
  t: (key: string, opts?: Record<string, unknown>) => string;
};

function MemberSelection({
  selectedMemberIds,
  setSelectedMemberIds,
  members,
  t,
}: MemberSelectionProps): React.JSX.Element {
  const toggleMember = (id: string): void => {
    setSelectedMemberIds(
      selectedMemberIds.includes(id)
        ? selectedMemberIds.filter((m) => m !== id)
        : [...selectedMemberIds, id]
    );
  };
  const toggleSelectAll = (): void => {
    setSelectedMemberIds(
      selectedMemberIds.length === members.length ? [] : members.map((m) => m.id)
    );
  };
  const label =
    selectedMemberIds.length === members.length
      ? t('screens.clubFees.clearAll')
      : t('screens.clubFees.selectAll');

  return (
    <View style={modalStyles.memberSelectionContainer}>
      <View style={modalStyles.memberSelectionHeader}>
        <Text style={modalStyles.memberSelectionTitle}>
          {t('screens.clubFees.selectedOfTotal', {
            selected: selectedMemberIds.length,
            total: members.length,
          })}
        </Text>
        <TouchableOpacity
          style={modalStyles.selectAllButton}
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={toggleSelectAll}
        >
          <Text style={modalStyles.selectAllText}>{label}</Text>
        </TouchableOpacity>
      </View>
      <View style={modalStyles.membersList}>
        {members.map((m) => (
          <MemberItem
            key={m.id}
            member={m}
            isSelected={selectedMemberIds.includes(m.id)}
            onToggle={(): void => toggleMember(m.id)}
          />
        ))}
      </View>
    </View>
  );
}

type ModalFooterProps = {
  onClose: () => void;
  onCreate: () => void;
  t: (key: string) => string;
};

function ModalFooter({ onClose, onCreate, t }: ModalFooterProps): React.JSX.Element {
  const { colors, iconSizes } = useTheme();
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity
        style={modalStyles.cancelButton}
        activeOpacity={TOUCH_OPACITY.default}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        onPress={onClose}
      >
        <Text
          variant={TEXT_VARIANT.BODY}
          weight={TEXT_WEIGHT.SEMIBOLD}
          color={TEXT_COLOR.SECONDARY}
        >
          {t('common.cancel')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[modalStyles.createButton, { backgroundColor: colors.primary }]}
        activeOpacity={TOUCH_OPACITY.light}
        accessibilityRole="button"
        accessibilityLabel="Create charge"
        onPress={onCreate}
      >
        <MaterialCommunityIcons
          name={ICONS.PLUS_CIRCLE}
          size={iconSizes.md}
          color={colors.textOnPrimary}
        />
        <Text
          variant={TEXT_VARIANT.BODY}
          weight={TEXT_WEIGHT.SEMIBOLD}
          color={TEXT_COLOR.ON_PRIMARY}
        >
          {t('screens.clubFees.createCharge')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
