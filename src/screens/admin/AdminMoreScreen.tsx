/**
 * AdminMoreScreen
 * More options screen for platform administrators
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenHeader, MenuCard, SectionHeader } from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';

const AdminMoreScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const managementItems = [
    {
      id: 'organization',
      title: 'Organization Structure',
      description: 'Manage divisions, unions, and associations',
      icon: 'sitemap',
      screen: 'OrganizationManagement',
      color: colors.primary,
    },
  ];

  const systemItems = [
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'View platform statistics and reports',
      icon: 'chart-bar',
      screen: null, // Future feature
      color: colors.warning,
      disabled: true,
    },
    {
      id: 'notifications',
      title: 'Send Notifications',
      description: 'Broadcast messages to users',
      icon: 'bell-ring',
      screen: null, // Future feature
      color: colors.error,
      disabled: true,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="More Options"
        subtitle="Platform management tools"
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <SectionHeader title="Management" />
          {managementItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              color={item.color}
              onPress={() => item.screen && navigation.navigate(item.screen as never)}
            />
          ))}
        </View>

        <View style={styles.content}>
          <SectionHeader title="System" />
          {systemItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.disabled ? 'Coming soon' : item.description}
              icon={item.icon}
              color={item.disabled ? colors.textTertiary : item.color}
              onPress={() => {}}
              disabled={item.disabled}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.sm,
  },
});

export default AdminMoreScreen;

