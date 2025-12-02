import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { useTheme } from '../../contexts/ThemeContext';
import { Club } from '../../types';
import {
  ScreenHeader,
  SearchBar,
  EmptyState,
  StandardButton,
  StandardInput,
} from '../../shared/components';
import { mobileTypography, mobileFontSizes, mobileIconSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { MESSAGES, dynamicMessages } from '../../shared/constants';

type OrganizationType = 'division' | 'union' | 'association' | 'church';

interface OrganizationItem {
  id: string;
  name: string;
  type: OrganizationType;
  parent?: string;
  clubCount: number;
}

export const OrganizationManagementScreen = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = windowWidth < 768;
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<OrganizationType>('division');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationItem | null>(null);
  
  // Parent search queries
  const [parentDivisionSearch, setParentDivisionSearch] = useState('');
  const [parentUnionSearch, setParentUnionSearch] = useState('');
  const [parentAssociationSearch, setParentAssociationSearch] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    parentDivision: '',
    parentUnion: '',
    parentAssociation: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    buildOrganizationsList();
  }, [clubs, selectedType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const clubsList = await clubService.getAllClubs();
      setClubs(clubsList);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const buildOrganizationsList = () => {
    const orgMap = new Map<string, OrganizationItem>();

    clubs.forEach((club) => {
      // Count clubs for each organization
      const divisionKey = `division-${club.division}`;
      const unionKey = `union-${club.union}`;
      const associationKey = `association-${club.association}`;
      const churchKey = `church-${club.church}`;

      // Division
      if (club.division) {
        if (!orgMap.has(divisionKey)) {
          orgMap.set(divisionKey, {
            id: divisionKey,
            name: club.division,
            type: 'division',
            clubCount: 0,
          });
        }
        orgMap.get(divisionKey)!.clubCount++;
      }

      // Union
      if (club.union) {
        if (!orgMap.has(unionKey)) {
          orgMap.set(unionKey, {
            id: unionKey,
            name: club.union,
            type: 'union',
            parent: club.division,
            clubCount: 0,
          });
        }
        orgMap.get(unionKey)!.clubCount++;
      }

      // Association
      if (club.association) {
        if (!orgMap.has(associationKey)) {
          orgMap.set(associationKey, {
            id: associationKey,
            name: club.association,
            type: 'association',
            parent: club.union,
            clubCount: 0,
          });
        }
        orgMap.get(associationKey)!.clubCount++;
      }

      // Church
      if (club.church) {
        if (!orgMap.has(churchKey)) {
          orgMap.set(churchKey, {
            id: churchKey,
            name: club.church,
            type: 'church',
            parent: club.association,
            clubCount: 0,
          });
        }
        orgMap.get(churchKey)!.clubCount++;
      }
    });

    const filtered = Array.from(orgMap.values())
      .filter((org) => org.type === selectedType)
      .sort((a, b) => a.name.localeCompare(b.name));

    setOrganizations(filtered);
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get all unique divisions
  const getAvailableDivisions = () => {
    const divisionMap = new Map<string, string>();
    clubs.forEach((club) => {
      if (club.division) {
        divisionMap.set(club.division, club.division);
      }
    });
    return Array.from(divisionMap.values()).sort();
  };

  // Get unions filtered by selected division
  const getAvailableUnions = (divisionFilter?: string) => {
    const unionMap = new Map<string, string>();
    clubs.forEach((club) => {
      if (club.union) {
        if (!divisionFilter || club.division === divisionFilter) {
          unionMap.set(club.union, club.union);
        }
      }
    });
    return Array.from(unionMap.values()).sort();
  };

  // Get associations filtered by selected union
  const getAvailableAssociations = (unionFilter?: string) => {
    const assocMap = new Map<string, string>();
    clubs.forEach((club) => {
      if (club.association) {
        if (!unionFilter || club.union === unionFilter) {
          assocMap.set(club.association, club.association);
        }
      }
    });
    return Array.from(assocMap.values()).sort();
  };

  // Filter by search query
  const filterBySearch = (items: string[], searchQuery: string) => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Legacy function for compatibility
  const getAvailableParents = () => {
    if (selectedType === 'union') return getAvailableDivisions();
    if (selectedType === 'association') return getAvailableUnions();
    if (selectedType === 'church') return getAvailableAssociations();
    return [];
  };

  const resetForm = () => {
    setFormData({
      name: '',
      parentDivision: '',
      parentUnion: '',
      parentAssociation: '',
    });
    setParentDivisionSearch('');
    setParentUnionSearch('');
    setParentAssociationSearch('');
    setEditMode(false);
    setSelectedOrg(null);
  };

  const handleCreate = () => {
    setEditMode(false);
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (org: OrganizationItem) => {
    setEditMode(true);
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      parentDivision: org.type === 'union' ? org.parent || '' : '',
      parentUnion: org.type === 'association' ? org.parent || '' : '',
      parentAssociation: org.type === 'church' ? org.parent || '' : '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_ENTER_NAME);
      return;
    }

    // Validate parent requirement
    if (selectedType === 'union' && !formData.parentDivision) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_DIVISION);
      return;
    }
    if (selectedType === 'association' && !formData.parentUnion) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_UNION);
      return;
    }
    if (selectedType === 'church' && !formData.parentAssociation) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PLEASE_SELECT_PARENT_ASSOCIATION);
      return;
    }

    try {
      // Note: This is a simplified implementation
      // In a real app, you would need backend endpoints to manage organizations
      // For now, we'll just show a success message
      
      Alert.alert(
        MESSAGES.TITLES.SUCCESS,
        editMode
          ? `${getTypeLabel(selectedType)} "${formData.name}" updated successfully`
          : `${getTypeLabel(selectedType)} "${formData.name}" created successfully`,
        [
          {
            text: MESSAGES.BUTTONS.OK,
            onPress: () => {
              setModalVisible(false);
              resetForm();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.OPERATION_FAILED);
    }
  };

  const handleDelete = (org: OrganizationItem) => {
    Alert.alert(
      'Delete ' + getTypeLabel(org.type),
      `Are you sure you want to delete "${org.name}"?\n\nThis ${org.type} is used by ${org.clubCount} club(s). Deleting it will affect these clubs.`,
      [
        { text: MESSAGES.BUTTONS.CANCEL, style: 'cancel' },
        {
          text: MESSAGES.BUTTONS.DELETE,
          style: 'destructive',
          onPress: async () => {
            // Note: Backend implementation needed
            Alert.alert(MESSAGES.TITLES.SUCCESS, dynamicMessages.organizationDeleted(getTypeLabel(org.type)));
          },
        },
      ]
    );
  };

  const getTypeLabel = (type: OrganizationType): string => {
    const labels = {
      division: 'Division',
      union: 'Union',
      association: 'Association',
      church: 'Church',
    };
    return labels[type];
  };

  const getTypeIcon = (type: OrganizationType): string => {
    const icons = {
      division: 'earth',
      union: 'domain',
      association: 'office-building',
      church: 'church',
    };
    return icons[type];
  };

  const getTypeColor = (type: OrganizationType): string => {
    const typeColors: Record<OrganizationType, string> = {
      division: colors.primary,
      union: colors.info,
      association: colors.warning,
      church: colors.success,
    };
    return typeColors[type];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} edges={['top', 'left', 'right']}>
      <ScreenHeader
        title="Organization Management"
        subtitle={`Manage ${getTypeLabel(selectedType).toLowerCase()}s in your organization hierarchy`}
      />

      {/* Type Selector */}
      <View style={styles.typeSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeSelector}>
          {(['division', 'union', 'association', 'church'] as OrganizationType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, selectedType === type && styles.typeButtonActive]}
              onPress={() => setSelectedType(type)}
              accessibilityRole="button"
              accessibilityLabel={`View ${getTypeLabel(type)}s`}
              accessibilityState={{ selected: selectedType === type }}
            >
              <MaterialCommunityIcons
                name={getTypeIcon(type) as any}
                size={20}
                color={selectedType === type ? colors.textInverse : getTypeColor(type)}
              />
              <Text style={[styles.typeButtonText, selectedType === type && styles.typeButtonTextActive]}>
                {getTypeLabel(type)}s
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search and Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${getTypeLabel(selectedType).toLowerCase()}s...`}
            style={{ flex: 1 }}
          />
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
          accessibilityRole="button"
          accessibilityLabel={`Create new ${getTypeLabel(selectedType).toLowerCase()}`}
        >
          <MaterialCommunityIcons name="plus" size={20} color={colors.textInverse} />
          <Text style={styles.createButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Organizations List */}
      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : filteredOrganizations.length === 0 ? (
          <EmptyState
            icon={getTypeIcon(selectedType)}
            title={`No ${getTypeLabel(selectedType)}s Found`}
            message={
              searchQuery
                ? 'Try adjusting your search'
                : `Add your first ${getTypeLabel(selectedType).toLowerCase()} to get started`
            }
          />
        ) : (
          filteredOrganizations.map((org) => (
            <TouchableOpacity 
              key={org.id} 
              style={[styles.orgCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
              onPress={() => handleEdit(org)}
            >
              <View style={styles.orgCardHeader}>
                <View style={styles.orgCardTitle}>
                  <MaterialCommunityIcons
                    name={getTypeIcon(org.type) as any}
                    size={mobileIconSizes.medium}
                    color={getTypeColor(org.type)}
                  />
                  <View style={styles.orgCardInfo}>
                    <Text style={[styles.orgName, { color: colors.textPrimary }]}>{org.name}</Text>
                    {org.parent && (
                      <Text style={[styles.orgParent, { color: colors.textSecondary }]}>
                        {org.parent}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(org)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${org.name}`}
                >
                  <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
              <View style={[styles.orgCardFooter, { borderTopColor: colors.border }]}>
                <MaterialCommunityIcons name="account-group" size={14} color={colors.textTertiary} />
                <Text style={[styles.orgClubCount, { color: colors.textSecondary }]}>{org.clubCount} club{org.clubCount !== 1 ? 's' : ''}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType={isMobile ? "slide" : "fade"}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.backdrop }, isMobile && styles.modalOverlayMobile]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }, isMobile && styles.modalContentMobile]}>
            {/* Modal Handle - Mobile Only */}
            {isMobile && (
              <View style={[styles.modalHandle, { backgroundColor: colors.borderLight }]} />
            )}
            
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editMode ? 'Edit' : 'Create'} {getTypeLabel(selectedType)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Info Banner */}
              <View style={[styles.hierarchyInfoBanner, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons name="information" size={16} color={colors.primary} />
                <Text style={[styles.hierarchyInfoText, { color: colors.primary }]}>
                  {selectedType === 'division' 
                    ? 'Divisions are the top level of your organization hierarchy.'
                    : selectedType === 'union'
                    ? 'Unions belong to a Division. First select the parent Division, then enter the Union name.'
                    : selectedType === 'association'
                    ? 'Associations belong to a Union. First select the parent Union, then enter the Association name.'
                    : 'Churches belong to an Association. First select the parent Association, then enter the Church name.'}
                </Text>
              </View>

              {/* Union: Select Division to be the parent */}
              {selectedType === 'union' && getAvailableDivisions().length > 0 && (
                <View style={styles.filterSection}>
                  <View style={styles.filterSectionHeader}>
                    <Text style={styles.filterSectionTitle}>Parent Division *</Text>
                    {!formData.parentDivision && getAvailableDivisions().length > 1 && (
                      <Text style={styles.resultsCount}>
                        {filterBySearch(getAvailableDivisions(), parentDivisionSearch).length} of {getAvailableDivisions().length}
                      </Text>
                    )}
                  </View>
                  
                  {getAvailableDivisions().length === 1 ? (
                    <View style={styles.hierarchyItem}>
                      <MaterialCommunityIcons name="earth" size={18} color={colors.primary} />
                      <View style={styles.hierarchyInfo}>
                        <Text style={styles.hierarchyLabel}>Division</Text>
                        <Text style={styles.hierarchyValue}>{getAvailableDivisions()[0]}</Text>
                      </View>
                      <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                    </View>
                  ) : formData.parentDivision ? (
                    <TouchableOpacity
                      style={[styles.filterOption, styles.filterOptionActive]}
                      onPress={() => setFormData({ ...formData, parentDivision: '' })}
                    >
                      <View style={styles.filterOptionContent}>
                        <MaterialCommunityIcons name="earth" size={20} color={colors.primary} />
                        <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>{formData.parentDivision}</Text>
                      </View>
                      <MaterialCommunityIcons name="close-circle" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <StandardInput
                        placeholder="Search divisions..."
                        icon="magnify"
                        value={parentDivisionSearch}
                        onChangeText={setParentDivisionSearch}
                      />
                      {filterBySearch(getAvailableDivisions(), parentDivisionSearch).length === 0 ? (
                        <Text style={styles.noResultsText}>No divisions found matching "{parentDivisionSearch}"</Text>
                      ) : (
                        filterBySearch(getAvailableDivisions(), parentDivisionSearch).map((division) => (
                          <TouchableOpacity
                            key={division}
                            style={styles.filterOption}
                            onPress={() => setFormData({ ...formData, parentDivision: division })}
                          >
                            <View style={styles.filterOptionContent}>
                              <MaterialCommunityIcons name="earth" size={20} color={colors.textTertiary} />
                              <Text style={styles.filterOptionText}>{division}</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      )}
                    </>
                  )}
                </View>
              )}

              {/* Association: Cascading selection Division → Union */}
              {selectedType === 'association' && getAvailableDivisions().length > 0 && (
                <>
                  {/* Step 1: Select Division */}
                  <View style={styles.filterSection}>
                    <View style={styles.filterSectionHeader}>
                      <Text style={styles.filterSectionTitle}>1. Select Division *</Text>
                      {!formData.parentDivision && getAvailableDivisions().length > 1 && (
                        <Text style={styles.resultsCount}>
                          {filterBySearch(getAvailableDivisions(), parentDivisionSearch).length} of {getAvailableDivisions().length}
                        </Text>
                      )}
                    </View>
                    
                    {getAvailableDivisions().length === 1 ? (
                      <View style={styles.hierarchyItem}>
                        <MaterialCommunityIcons name="earth" size={18} color={colors.primary} />
                        <View style={styles.hierarchyInfo}>
                          <Text style={styles.hierarchyLabel}>Division</Text>
                          <Text style={styles.hierarchyValue}>{getAvailableDivisions()[0]}</Text>
                        </View>
                        <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                      </View>
                    ) : formData.parentDivision ? (
                      <TouchableOpacity
                        style={[styles.filterOption, styles.filterOptionActive]}
                        onPress={() => setFormData({ ...formData, parentDivision: '', parentUnion: '' })}
                      >
                        <View style={styles.filterOptionContent}>
                          <MaterialCommunityIcons name="earth" size={20} color={colors.primary} />
                          <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>{formData.parentDivision}</Text>
                        </View>
                        <MaterialCommunityIcons name="close-circle" size={20} color={colors.textTertiary} />
                      </TouchableOpacity>
                    ) : (
                      <>
                        <StandardInput
                          placeholder="Search divisions..."
                          icon="magnify"
                          value={parentDivisionSearch}
                          onChangeText={setParentDivisionSearch}
                        />
                        {filterBySearch(getAvailableDivisions(), parentDivisionSearch).map((division) => (
                          <TouchableOpacity
                            key={division}
                            style={styles.filterOption}
                            onPress={() => setFormData({ ...formData, parentDivision: division, parentUnion: '' })}
                          >
                            <View style={styles.filterOptionContent}>
                              <MaterialCommunityIcons name="earth" size={20} color={colors.textTertiary} />
                              <Text style={styles.filterOptionText}>{division}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </>
                    )}
                  </View>

                  {/* Step 2: Select Union (filtered by Division) */}
                  {formData.parentDivision && (
                    <View style={styles.filterSection}>
                      <View style={styles.filterSectionHeader}>
                        <Text style={styles.filterSectionTitle}>2. Select Union *</Text>
                        {!formData.parentUnion && getAvailableUnions(formData.parentDivision).length > 1 && (
                          <Text style={styles.resultsCount}>
                            {filterBySearch(getAvailableUnions(formData.parentDivision), parentUnionSearch).length} of {getAvailableUnions(formData.parentDivision).length}
                          </Text>
                        )}
                      </View>
                      
                      {getAvailableUnions(formData.parentDivision).length === 0 ? (
                        <Text style={styles.noResultsText}>No unions found in {formData.parentDivision}</Text>
                      ) : getAvailableUnions(formData.parentDivision).length === 1 ? (
                        <View style={styles.hierarchyItem}>
                          <MaterialCommunityIcons name="domain" size={18} color={colors.info} />
                          <View style={styles.hierarchyInfo}>
                            <Text style={styles.hierarchyLabel}>Union</Text>
                            <Text style={styles.hierarchyValue}>{getAvailableUnions(formData.parentDivision)[0]}</Text>
                          </View>
                          <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                        </View>
                      ) : formData.parentUnion ? (
                        <TouchableOpacity
                          style={[styles.filterOption, styles.filterOptionActive]}
                          onPress={() => setFormData({ ...formData, parentUnion: '' })}
                        >
                          <View style={styles.filterOptionContent}>
                            <MaterialCommunityIcons name="domain" size={20} color={colors.primary} />
                            <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>{formData.parentUnion}</Text>
                          </View>
                          <MaterialCommunityIcons name="close-circle" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                      ) : (
                        <>
                          <StandardInput
                            placeholder="Search unions..."
                            icon="magnify"
                            value={parentUnionSearch}
                            onChangeText={setParentUnionSearch}
                          />
                          {filterBySearch(getAvailableUnions(formData.parentDivision), parentUnionSearch).map((union) => (
                            <TouchableOpacity
                              key={union}
                              style={styles.filterOption}
                              onPress={() => setFormData({ ...formData, parentUnion: union })}
                            >
                              <View style={styles.filterOptionContent}>
                                <MaterialCommunityIcons name="domain" size={20} color={colors.textTertiary} />
                                <Text style={styles.filterOptionText}>{union}</Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}
                    </View>
                  )}
                </>
              )}

              {/* Church: Cascading selection Division → Union → Association */}
              {selectedType === 'church' && getAvailableDivisions().length > 0 && (
                <>
                  {/* Step 1: Select Division */}
                  <View style={styles.filterSection}>
                    <View style={styles.filterSectionHeader}>
                      <Text style={styles.filterSectionTitle}>1. Select Division *</Text>
                      {!formData.parentDivision && getAvailableDivisions().length > 1 && (
                        <Text style={styles.resultsCount}>
                          {filterBySearch(getAvailableDivisions(), parentDivisionSearch).length} of {getAvailableDivisions().length}
                        </Text>
                      )}
                    </View>
                    
                    {getAvailableDivisions().length === 1 ? (
                      <View style={styles.hierarchyItem}>
                        <MaterialCommunityIcons name="earth" size={18} color={colors.primary} />
                        <View style={styles.hierarchyInfo}>
                          <Text style={styles.hierarchyLabel}>Division</Text>
                          <Text style={styles.hierarchyValue}>{getAvailableDivisions()[0]}</Text>
                        </View>
                        <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                      </View>
                    ) : formData.parentDivision ? (
                      <TouchableOpacity
                        style={[styles.filterOption, styles.filterOptionActive]}
                        onPress={() => setFormData({ ...formData, parentDivision: '', parentUnion: '', parentAssociation: '' })}
                      >
                        <View style={styles.filterOptionContent}>
                          <MaterialCommunityIcons name="earth" size={20} color={colors.primary} />
                          <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>{formData.parentDivision}</Text>
                        </View>
                        <MaterialCommunityIcons name="close-circle" size={20} color={colors.textTertiary} />
                      </TouchableOpacity>
                    ) : (
                      <>
                        <StandardInput
                          placeholder="Search divisions..."
                          icon="magnify"
                          value={parentDivisionSearch}
                          onChangeText={setParentDivisionSearch}
                        />
                        {filterBySearch(getAvailableDivisions(), parentDivisionSearch).map((division) => (
                          <TouchableOpacity
                            key={division}
                            style={styles.filterOption}
                            onPress={() => setFormData({ ...formData, parentDivision: division, parentUnion: '', parentAssociation: '' })}
                          >
                            <View style={styles.filterOptionContent}>
                              <MaterialCommunityIcons name="earth" size={20} color={colors.textTertiary} />
                              <Text style={styles.filterOptionText}>{division}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </>
                    )}
                  </View>

                  {/* Step 2: Select Union (filtered by Division) */}
                  {formData.parentDivision && (
                    <View style={styles.filterSection}>
                      <View style={styles.filterSectionHeader}>
                        <Text style={styles.filterSectionTitle}>2. Select Union *</Text>
                        {!formData.parentUnion && getAvailableUnions(formData.parentDivision).length > 1 && (
                          <Text style={styles.resultsCount}>
                            {filterBySearch(getAvailableUnions(formData.parentDivision), parentUnionSearch).length} of {getAvailableUnions(formData.parentDivision).length}
                          </Text>
                        )}
                      </View>
                      
                      {getAvailableUnions(formData.parentDivision).length === 0 ? (
                        <Text style={styles.noResultsText}>No unions found in {formData.parentDivision}</Text>
                      ) : getAvailableUnions(formData.parentDivision).length === 1 ? (
                        <View style={styles.hierarchyItem}>
                          <MaterialCommunityIcons name="domain" size={18} color={colors.info} />
                          <View style={styles.hierarchyInfo}>
                            <Text style={styles.hierarchyLabel}>Union</Text>
                            <Text style={styles.hierarchyValue}>{getAvailableUnions(formData.parentDivision)[0]}</Text>
                          </View>
                          <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                        </View>
                      ) : formData.parentUnion ? (
                        <TouchableOpacity
                          style={[styles.filterOption, styles.filterOptionActive]}
                          onPress={() => setFormData({ ...formData, parentUnion: '', parentAssociation: '' })}
                        >
                          <View style={styles.filterOptionContent}>
                            <MaterialCommunityIcons name="domain" size={20} color={colors.primary} />
                            <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>{formData.parentUnion}</Text>
                          </View>
                          <MaterialCommunityIcons name="close-circle" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                      ) : (
                        <>
                          <StandardInput
                            placeholder="Search unions..."
                            icon="magnify"
                            value={parentUnionSearch}
                            onChangeText={setParentUnionSearch}
                          />
                          {filterBySearch(getAvailableUnions(formData.parentDivision), parentUnionSearch).map((union) => (
                            <TouchableOpacity
                              key={union}
                              style={styles.filterOption}
                              onPress={() => setFormData({ ...formData, parentUnion: union, parentAssociation: '' })}
                            >
                              <View style={styles.filterOptionContent}>
                                <MaterialCommunityIcons name="domain" size={20} color={colors.textTertiary} />
                                <Text style={styles.filterOptionText}>{union}</Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}
                    </View>
                  )}

                  {/* Step 3: Select Association (filtered by Union) */}
                  {formData.parentUnion && (
                    <View style={styles.filterSection}>
                      <View style={styles.filterSectionHeader}>
                        <Text style={styles.filterSectionTitle}>3. Select Association *</Text>
                        {!formData.parentAssociation && getAvailableAssociations(formData.parentUnion).length > 1 && (
                          <Text style={styles.resultsCount}>
                            {filterBySearch(getAvailableAssociations(formData.parentUnion), parentAssociationSearch).length} of {getAvailableAssociations(formData.parentUnion).length}
                          </Text>
                        )}
                      </View>
                      
                      {getAvailableAssociations(formData.parentUnion).length === 0 ? (
                        <Text style={styles.noResultsText}>No associations found in {formData.parentUnion}</Text>
                      ) : getAvailableAssociations(formData.parentUnion).length === 1 ? (
                        <View style={styles.hierarchyItem}>
                          <MaterialCommunityIcons name="office-building" size={18} color={colors.warning} />
                          <View style={styles.hierarchyInfo}>
                            <Text style={styles.hierarchyLabel}>Association</Text>
                            <Text style={styles.hierarchyValue}>{getAvailableAssociations(formData.parentUnion)[0]}</Text>
                          </View>
                          <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                        </View>
                      ) : formData.parentAssociation ? (
                        <TouchableOpacity
                          style={[styles.filterOption, styles.filterOptionActive]}
                          onPress={() => setFormData({ ...formData, parentAssociation: '' })}
                        >
                          <View style={styles.filterOptionContent}>
                            <MaterialCommunityIcons name="office-building" size={20} color={colors.primary} />
                            <Text style={[styles.filterOptionText, styles.filterOptionTextActive]}>{formData.parentAssociation}</Text>
                          </View>
                          <MaterialCommunityIcons name="close-circle" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                      ) : (
                        <>
                          <StandardInput
                            placeholder="Search associations..."
                            icon="magnify"
                            value={parentAssociationSearch}
                            onChangeText={setParentAssociationSearch}
                          />
                          {filterBySearch(getAvailableAssociations(formData.parentUnion), parentAssociationSearch).map((association) => (
                            <TouchableOpacity
                              key={association}
                              style={styles.filterOption}
                              onPress={() => setFormData({ ...formData, parentAssociation: association })}
                            >
                              <View style={styles.filterOptionContent}>
                                <MaterialCommunityIcons name="office-building" size={20} color={colors.textTertiary} />
                                <Text style={styles.filterOptionText}>{association}</Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}
                    </View>
                  )}
                </>
              )}

              {/* Name Input Section - AFTER parent selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{getTypeLabel(selectedType)} Information</Text>
                
                <StandardInput
                  label={`${getTypeLabel(selectedType)} Name`}
                  icon={getTypeIcon(selectedType)}
                  placeholder={`Enter ${getTypeLabel(selectedType).toLowerCase()} name`}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  required
                />
              </View>

              {/* Warning if no parents available */}
              {((selectedType === 'union' && getAvailableParents().length === 0) ||
                (selectedType === 'association' && getAvailableParents().length === 0) ||
                (selectedType === 'church' && getAvailableParents().length === 0)) && (
                <View style={styles.warningBanner}>
                  <MaterialCommunityIcons name="alert" size={20} color={colors.warning} />
                  <Text style={styles.warningText}>
                    No parent {selectedType === 'union' ? 'divisions' : selectedType === 'association' ? 'unions' : 'associations'} available. 
                    Please create a {selectedType === 'union' ? 'division' : selectedType === 'association' ? 'union' : 'association'} first.
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.textSecondary} />
                <Text style={styles.clearButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={handleSave}
                accessibilityRole="button"
                accessibilityLabel={editMode ? 'Save changes' : 'Create organization'}
              >
                <MaterialCommunityIcons
                  name={editMode ? 'content-save' : 'plus-circle'}
                  size={18}
                  color={colors.textInverse}
                />
                <Text style={styles.applyButtonText}>{editMode ? 'Save' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  typeSelectorContainer: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  typeSelector: {
    flexDirection: 'row',
    padding: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    gap: designTokens.spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 40,
  },
  typeButtonActive: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  typeButtonText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
  },
  typeButtonTextActive: {
    color: designTokens.colors.textInverse,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  searchContainer: {
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.xs,
    minHeight: 44,
  },
  createButtonText: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textInverse,
  },
  content: {
    flex: 1,
    padding: designTokens.spacing.lg,
  },
  loadingText: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    marginTop: designTokens.spacing.xl,
  },
  orgCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    ...designTokens.shadows.sm,
  },
  orgCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  orgCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: designTokens.spacing.sm,
  },
  orgCardInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
    marginBottom: 2,
  },
  orgParent: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
  },
  deleteButton: {
    padding: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.md,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  orgClubCount: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
  },
  modalOverlayMobile: {
    justifyContent: 'flex-end',
    padding: 0,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xxl,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalContentMobile: {
    maxWidth: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: designTokens.borderRadius.xxl,
    borderTopRightRadius: designTokens.borderRadius.xxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.full,
    alignSelf: 'center',
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  modalTitle: {
    fontSize: mobileFontSizes.xl,
    fontWeight: '700',
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  modalBody: {
    maxHeight: 500,
  },
  hierarchyInfoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: designTokens.colors.primaryLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.lg,
    marginBottom: 0,
    gap: designTokens.spacing.sm,
  },
  hierarchyInfoText: {
    flex: 1,
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    lineHeight: 18,
  },
  filterSection: {
    padding: designTokens.spacing.lg,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  filterSectionTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textPrimary,
  },
  resultsCount: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: '500',
  },
  hierarchyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  hierarchyInfo: {
    flex: 1,
  },
  hierarchyLabel: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  hierarchyValue: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textPrimary,
    fontWeight: '600',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 56,
  },
  filterOptionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: designTokens.spacing.md,
  },
  filterOptionText: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    flex: 1,
  },
  filterOptionTextActive: {
    color: designTokens.colors.primary,
    fontWeight: '600',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: designTokens.colors.warningLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    gap: designTokens.spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.warning,
    lineHeight: 20,
  },
  noResultsText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textTertiary,
    textAlign: 'center',
    padding: designTokens.spacing.lg,
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  clearButton: {
    flex: 1,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.spacing.xs,
    minHeight: 48,
  },
  clearButtonText: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.spacing.xs,
    minHeight: 48,
  },
  applyButtonText: {
    fontSize: mobileFontSizes.md,
    fontWeight: '600',
    color: designTokens.colors.textInverse,
  },
});

