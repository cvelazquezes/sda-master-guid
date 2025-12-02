import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenHeader, MenuCard, SectionHeader } from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';

const MoreScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const activityItems = [
    {
      id: 'generate-matches',
      title: 'Generate Activities',
      description: 'Create new social activity rounds for your club',
      icon: 'account-heart',
      screen: 'GenerateMatches',
      color: colors.success,
    },
    {
      id: 'match-management',
      title: 'Activity Management',
      description: 'View and manage all social activities',
      icon: 'account-heart-outline',
      screen: 'ClubMatches',
      color: colors.primary,
    },
  ];

  const managementItems = [
    {
      id: 'directive',
      title: 'Club Directive',
      description: 'Assign leadership positions to members',
      icon: 'account-star',
      screen: 'ClubDirective',
      color: colors.warning,
    },
    {
      id: 'settings',
      title: 'Club Settings',
      description: 'Configure club preferences and hierarchy',
      icon: 'cog',
      screen: 'ClubSettings',
      color: colors.info,
    },
  ];

  const helpItems = [
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help using the app',
      icon: 'help-circle',
      screen: null,
      color: colors.textSecondary,
      disabled: true,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="More Options"
        subtitle="Additional club management features"
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <SectionHeader title="Activities" />
          {activityItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              color={item.color}
              onPress={() => navigation.navigate(item.screen as never)}
            />
          ))}
        </View>

        <View style={styles.content}>
          <SectionHeader title="Club Management" />
          {managementItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              color={item.color}
              onPress={() => navigation.navigate(item.screen as never)}
            />
          ))}
        </View>

        <View style={styles.content}>
          <SectionHeader title="Help" />
          {helpItems.map((item) => (
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

export default MoreScreen;

