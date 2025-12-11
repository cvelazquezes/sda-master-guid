import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { handleCreateClub, handleToggleClubStatus, handleDeleteClub } from './clubHandlers';
import { CreateClubModal } from './CreateClubModal';
import { FilterModal } from './FilterModal';
import {
  getUniqueClubValues,
  filterClubs,
  getActiveFilterCount,
  updateFilterWithCascade,
} from './filterUtils';
import { getFormUniqueValues, updateFormFieldWithCascade } from './formUtils';
import { createStyles } from './styles';
import { useClubsData } from './useClubsData';
import { BREAKPOINTS, HIERARCHY_FIELDS, ICONS } from '../../../../shared/constants';
import { type Club, MatchFrequency } from '../../../../types';
import { ClubCard } from '../../../components/features/ClubCard';
import { ClubDetailModal } from '../../../components/features/ClubDetailModal';
import { PageHeader, SearchBar, EmptyState, Button } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type FrequencyOption = {
  id: MatchFrequency;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
};

function useFrequencyOptions(
  t: (k: string) => string,
  colors: Record<string, string>
): FrequencyOption[] {
  return [
    {
      id: MatchFrequency.WEEKLY,
      title: t('components.frequencyOptions.weekly'),
      subtitle: t('components.frequencyOptions.weeklySubtitle'),
      icon: ICONS.CALENDAR_WEEK,
      iconColor: colors.primary,
    },
    {
      id: MatchFrequency.BIWEEKLY,
      title: t('components.frequencyOptions.biweekly'),
      subtitle: t('components.frequencyOptions.biweeklySubtitle'),
      icon: ICONS.CALENDAR_RANGE,
      iconColor: colors.info,
    },
    {
      id: MatchFrequency.MONTHLY,
      title: t('components.frequencyOptions.monthly'),
      subtitle: t('components.frequencyOptions.monthlySubtitle'),
      icon: ICONS.CALENDAR_MONTH,
      iconColor: colors.warning,
    },
  ];
}

const ClubsManagementScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles(colors, spacing), [colors, spacing]);
  const isMobile = width < BREAKPOINTS.MOBILE;
  const {
    clubs,
    loading,
    refreshing,
    filters,
    setFilters,
    formData,
    setFormData,
    searchQuery,
    setSearchQuery,
    loadClubs,
    onRefresh,
    resetForm,
    clearFilters,
  } = useClubsData();

  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const filterVals = {
    divisions: getUniqueClubValues(clubs, HIERARCHY_FIELDS.DIVISION, filters),
    unions: getUniqueClubValues(clubs, HIERARCHY_FIELDS.UNION, filters),
    associations: getUniqueClubValues(clubs, HIERARCHY_FIELDS.ASSOCIATION, filters),
    churches: getUniqueClubValues(clubs, HIERARCHY_FIELDS.CHURCH, filters),
  };
  const formVals = {
    divisions: getFormUniqueValues(clubs, HIERARCHY_FIELDS.DIVISION, formData),
    unions: getFormUniqueValues(clubs, HIERARCHY_FIELDS.UNION, formData),
    associations: getFormUniqueValues(clubs, HIERARCHY_FIELDS.ASSOCIATION, formData),
    churches: getFormUniqueValues(clubs, HIERARCHY_FIELDS.CHURCH, formData),
  };

  useFilterAutoSelect(filterVisible, filters, setFilters, filterVals);
  useFormAutoSelect(modalVisible, clubs.length, formData, setFormData, formVals);

  const onUpdateFilter = (f: string, v: string): void =>
    setFilters(updateFilterWithCascade(filters, f, v));
  const onUpdateFormField = (f: string, v: string): void =>
    setFormData(updateFormFieldWithCascade(formData, f, v));
  const onCreateClub = (): void =>
    handleCreateClub(formData, setModalVisible, resetForm, loadClubs);
  const onCloseCreateModal = (): void => {
    setModalVisible(false);
    resetForm();
  };
  const onSelectClub = (c: Club): void => {
    setSelectedClub(c);
    setDetailVisible(true);
  };
  const onCloseDetail = (): void => {
    setDetailVisible(false);
    setSelectedClub(null);
  };

  const filteredClubs = filterClubs(clubs, filters, searchQuery);
  const frequencyOptions = useFrequencyOptions(t, colors);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <PageHeader
        showActions
        title={t('screens.clubsManagement.title')}
        subtitle={t('screens.clubsManagement.subtitle', {
          filtered: filteredClubs.length,
          total: clubs.length,
        })}
      />
      <SearchBar
        value={searchQuery}
        placeholder={t('placeholders.searchClubs')}
        filterActive={getActiveFilterCount(filters, searchQuery) > 0}
        onChangeText={setSearchQuery}
        onFilterPress={(): void => setFilterVisible(true)}
      />
      <View style={styles.content}>
        <Button
          title={t('screens.clubsManagement.createNewClub')}
          icon={ICONS.PLUS}
          onPress={(): void => setModalVisible(true)}
        />
        <ClubsList
          loading={loading}
          clubs={filteredClubs}
          totalClubs={clubs.length}
          loadClubs={loadClubs}
          t={t}
          onSelectClub={onSelectClub}
        />
      </View>
      <FilterModal
        visible={filterVisible}
        isMobile={isMobile}
        filters={filters}
        availableDivisions={filterVals.divisions}
        availableUnions={filterVals.unions}
        availableAssociations={filterVals.associations}
        availableChurches={filterVals.churches}
        colors={colors}
        t={t}
        onClose={(): void => setFilterVisible(false)}
        onUpdateFilter={onUpdateFilter}
        onClearFilters={clearFilters}
      />
      <CreateClubModal
        visible={modalVisible}
        isMobile={isMobile}
        formData={formData}
        setFormData={setFormData}
        availableDivisions={formVals.divisions}
        availableUnions={formVals.unions}
        availableAssociations={formVals.associations}
        availableChurches={formVals.churches}
        frequencyOptions={frequencyOptions}
        colors={colors}
        t={t}
        onClose={onCloseCreateModal}
        onUpdateField={onUpdateFormField}
        onCreateClub={onCreateClub}
      />
      <ClubDetailModal visible={detailVisible} club={selectedClub} onClose={onCloseDetail} />
    </ScrollView>
  );
};

type HierarchyValues = {
  divisions: string[];
  unions: string[];
  associations: string[];
  churches: string[];
};

function canAutoSelect(arr: string[], current: string | number | undefined): boolean {
  return arr.length === 1 && !current;
}

function getFilterUpdates(
  vals: HierarchyValues,
  current: Record<string, string | number | undefined>
): Record<string, string> {
  const updates: Record<string, string> = {};
  const [firstDivision] = vals.divisions;
  const [firstUnion] = vals.unions;
  const [firstAssociation] = vals.associations;
  const [firstChurch] = vals.churches;
  if (canAutoSelect(vals.divisions, current.division)) {
    updates.division = firstDivision;
  }
  if (canAutoSelect(vals.unions, current.union)) {
    updates.union = firstUnion;
  }
  if (canAutoSelect(vals.associations, current.association)) {
    updates.association = firstAssociation;
  }
  if (canAutoSelect(vals.churches, current.church)) {
    updates.church = firstChurch;
  }
  return updates;
}

function canAutoSelectWithParent(
  arr: string[],
  current: string | number | undefined,
  parent: string | number | undefined
): boolean {
  return arr.length === 1 && !current && Boolean(parent);
}

function getFormUpdates(
  vals: HierarchyValues,
  curr: Record<string, string | number | undefined>
): Record<string, string> {
  const updates: Record<string, string> = {};
  const [firstDivision] = vals.divisions;
  const [firstUnion] = vals.unions;
  const [firstAssociation] = vals.associations;
  const [firstChurch] = vals.churches;
  if (canAutoSelect(vals.divisions, curr.division)) {
    updates.division = firstDivision;
  }
  if (canAutoSelectWithParent(vals.unions, curr.union, curr.division)) {
    updates.union = firstUnion;
  }
  if (canAutoSelectWithParent(vals.associations, curr.association, curr.union)) {
    updates.association = firstAssociation;
  }
  if (canAutoSelectWithParent(vals.churches, curr.church, curr.association)) {
    updates.church = firstChurch;
  }
  return updates;
}

function useFilterAutoSelect(
  visible: boolean,
  filters: Record<string, string>,
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  vals: HierarchyValues
): void {
  useEffect(() => {
    if (!visible) {
      return;
    }
    const updates = getFilterUpdates(vals, filters);
    if (Object.keys(updates).length > 0) {
      setFilters((p) => ({ ...p, ...updates }));
    }
  }, [visible, vals, filters, setFilters]);
}

type UseFormAutoSelectOptions = {
  visible: boolean;
  count: number;
  form: Record<string, string | number>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string | number>>>;
  vals: HierarchyValues;
};

function useFormAutoSelect(options: UseFormAutoSelectOptions): void {
  const { visible, count, form, setForm, vals } = options;
  useEffect(() => {
    if (!visible || count === 0) {
      return;
    }
    const updates = getFormUpdates(vals, form);
    if (Object.keys(updates).length > 0) {
      setForm((p) => ({ ...p, ...updates }));
    }
  }, [visible, count, vals, form, setForm]);
}

type ClubsListProps = {
  loading: boolean;
  clubs: Club[];
  totalClubs: number;
  onSelectClub: (club: Club) => void;
  loadClubs: () => void;
  t: (key: string) => string;
};

function ClubsList({
  loading,
  clubs,
  totalClubs,
  onSelectClub,
  loadClubs,
  t,
}: ClubsListProps): React.JSX.Element {
  if (loading) {
    return (
      <EmptyState
        icon={ICONS.LOADING}
        title={t('screens.clubsManagement.loadingClubs')}
        description={t('screens.clubsManagement.pleaseWait')}
      />
    );
  }

  if (clubs.length === 0) {
    const desc =
      totalClubs === 0
        ? t('screens.clubsManagement.noClubsInSystem')
        : t('screens.clubsManagement.tryAdjustingFilters');
    return (
      <EmptyState
        icon={ICONS.ACCOUNT_GROUP_OUTLINE}
        title={t('screens.clubsManagement.noClubsFound')}
        description={desc}
      />
    );
  }

  return (
    <>
      {clubs.map((club) => (
        <ClubCard
          key={club.id}
          showAdminActions
          club={club}
          onPress={(): void => onSelectClub(club)}
          onToggleStatus={(): void => handleToggleClubStatus(club.id, club.isActive, loadClubs)}
          onDelete={(): void => handleDeleteClub(club.id, club.name, loadClubs)}
        />
      ))}
    </>
  );
}

export default ClubsManagementScreen;
