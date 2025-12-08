import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../state/ThemeContext';
import { Club, MatchFrequency } from '../../../../types';
import { ClubCard } from '../../../components/features/ClubCard';
import { ClubDetailModal } from '../../../components/features/ClubDetailModal';
import { PageHeader, SearchBar, EmptyState, Button } from '../../../components/primitives';
import { BREAKPOINTS, HIERARCHY_FIELDS, ICONS } from '../../../../shared/constants';
import { styles } from './styles';
import { useClubsData } from './useClubsData';
import {
  getUniqueClubValues,
  filterClubs,
  getActiveFilterCount,
  updateFilterWithCascade,
} from './filterUtils';
import { getFormUniqueValues, updateFormFieldWithCascade } from './formUtils';
import { handleCreateClub, handleToggleClubStatus, handleDeleteClub } from './clubHandlers';
import { FilterModal } from './FilterModal';
import { CreateClubModal } from './CreateClubModal';

interface FrequencyOption {
  id: MatchFrequency;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
}

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
  const { colors } = useTheme();
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
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <PageHeader
        title={t('screens.clubsManagement.title')}
        subtitle={t('screens.clubsManagement.subtitle', {
          filtered: filteredClubs.length,
          total: clubs.length,
        })}
        showActions
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('placeholders.searchClubs')}
        onFilterPress={(): void => setFilterVisible(true)}
        filterActive={getActiveFilterCount(filters, searchQuery) > 0}
      />
      <View style={styles.content}>
        <Button
          title={t('screens.clubsManagement.createNewClub')}
          onPress={(): void => setModalVisible(true)}
          icon={ICONS.PLUS}
        />
        <ClubsList
          loading={loading}
          clubs={filteredClubs}
          totalClubs={clubs.length}
          onSelectClub={onSelectClub}
          loadClubs={loadClubs}
          t={t}
        />
      </View>
      <FilterModal
        visible={filterVisible}
        onClose={(): void => setFilterVisible(false)}
        isMobile={isMobile}
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        onClearFilters={clearFilters}
        availableDivisions={filterVals.divisions}
        availableUnions={filterVals.unions}
        availableAssociations={filterVals.associations}
        availableChurches={filterVals.churches}
        colors={colors}
        t={t}
      />
      <CreateClubModal
        visible={modalVisible}
        onClose={onCloseCreateModal}
        isMobile={isMobile}
        formData={formData}
        setFormData={setFormData}
        onUpdateField={onUpdateFormField}
        onCreateClub={onCreateClub}
        availableDivisions={formVals.divisions}
        availableUnions={formVals.unions}
        availableAssociations={formVals.associations}
        availableChurches={formVals.churches}
        frequencyOptions={frequencyOptions}
        colors={colors}
        t={t}
      />
      <ClubDetailModal visible={detailVisible} club={selectedClub} onClose={onCloseDetail} />
    </ScrollView>
  );
};

interface HierarchyValues {
  divisions: string[];
  unions: string[];
  associations: string[];
  churches: string[];
}

function canAutoSelect(arr: string[], current: string | number | undefined): boolean {
  return arr.length === 1 && !current;
}

function getFilterUpdates(
  vals: HierarchyValues,
  current: Record<string, string | number | undefined>
): Record<string, string> {
  const updates: Record<string, string> = {};
  if (canAutoSelect(vals.divisions, current.division)) {
    updates.division = vals.divisions[0];
  }
  if (canAutoSelect(vals.unions, current.union)) {
    updates.union = vals.unions[0];
  }
  if (canAutoSelect(vals.associations, current.association)) {
    updates.association = vals.associations[0];
  }
  if (canAutoSelect(vals.churches, current.church)) {
    updates.church = vals.churches[0];
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
  if (canAutoSelect(vals.divisions, curr.division)) {
    updates.division = vals.divisions[0];
  }
  if (canAutoSelectWithParent(vals.unions, curr.union, curr.division)) {
    updates.union = vals.unions[0];
  }
  if (canAutoSelectWithParent(vals.associations, curr.association, curr.union)) {
    updates.association = vals.associations[0];
  }
  if (canAutoSelectWithParent(vals.churches, curr.church, curr.association)) {
    updates.church = vals.churches[0];
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

interface UseFormAutoSelectOptions {
  visible: boolean;
  count: number;
  form: Record<string, string | number>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string | number>>>;
  vals: HierarchyValues;
}

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

interface ClubsListProps {
  loading: boolean;
  clubs: Club[];
  totalClubs: number;
  onSelectClub: (club: Club) => void;
  loadClubs: () => void;
  t: (key: string) => string;
}

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
          club={club}
          onPress={(): void => onSelectClub(club)}
          showAdminActions
          onToggleStatus={(): void => handleToggleClubStatus(club.id, club.isActive, loadClubs)}
          onDelete={(): void => handleDeleteClub(club.id, club.name, loadClubs)}
        />
      ))}
    </>
  );
}

export default ClubsManagementScreen;
