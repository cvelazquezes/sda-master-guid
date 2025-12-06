import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../shared/components';
import { useAuth } from '../context/AuthContext';
import { UserRole, ApprovalStatus } from '../types';
import { mobileFontSizes, designTokens, layoutConstants } from '../shared/theme';
import { useTheme } from '../contexts/ThemeContext';
import {
  SCREENS,
  TABS,
  SCREEN_TITLES,
  ICONS,
  A11Y_ROLE,
  dimensionValues,
  PRESENTATION,
  BADGE,
  NAV_KEYS,
} from '../shared/constants';
// Auth Screens - Direct imports (lazy loading disabled to fix Metro bundler issue)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PendingApprovalScreen from '../screens/auth/PendingApprovalScreen';
// Main Screens - Direct imports
import HomeScreen from '../screens/main/HomeScreen';
import ActivitiesScreen from '../screens/main/ActivitiesScreen';
import MembersScreen from '../screens/main/MembersScreen';
import MyFeesScreen from '../screens/main/MyFeesScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import UserMoreScreen from '../screens/main/UserMoreScreen';
// Shared Screens
import AccountScreen from '../screens/shared/AccountScreen';
// Admin Screens - Direct imports
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import ClubsManagementScreen from '../screens/admin/ClubsManagementScreen';
import { OrganizationManagementScreen } from '../screens/admin/OrganizationManagementScreen';
import AdminMoreScreen from '../screens/admin/AdminMoreScreen';
// Club Admin Screens - Direct imports
import ClubAdminDashboardScreen from '../screens/club-admin/ClubAdminDashboardScreen';
import ClubMembersScreen from '../screens/club-admin/ClubMembersScreen';
import ClubSettingsScreen from '../screens/club-admin/ClubSettingsScreen';
import ClubMatchesScreen from '../screens/club-admin/ClubMatchesScreen';
import GenerateMatchesScreen from '../screens/club-admin/GenerateMatchesScreen';
import ClubFeesScreen from '../screens/club-admin/ClubFeesScreen';
import MeetingPlannerScreen from '../screens/club-admin/MeetingPlannerScreen';
import ClubDirectiveScreen from '../screens/club-admin/ClubDirectiveScreen';
import ClubAdminMoreScreen from '../screens/club-admin/MoreScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Profile Icon Component - opens Account modal
const ProfileIcon = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={headerIconStyles.iconButton}
      onPress={() => navigation.navigate(SCREENS.ACCOUNT as never)}
      accessibilityLabel={SCREEN_TITLES.MY_ACCOUNT}
      accessibilityRole={A11Y_ROLE.BUTTON}
    >
      <View style={[headerIconStyles.avatarCircle, { backgroundColor: colors.primaryAlpha20 }]}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT}
          size={designTokens.iconSize.md}
          color={colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

// Notification Bell Component
const NotificationBell = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const unreadCount = 2; // This should come from context/state in a real app

  return (
    <TouchableOpacity
      style={headerIconStyles.iconButton}
      onPress={() => navigation.navigate(SCREENS.NOTIFICATIONS as never)}
      accessibilityLabel={SCREEN_TITLES.NOTIFICATIONS}
      accessibilityRole={A11Y_ROLE.BUTTON}
    >
      <MaterialCommunityIcons
        name={ICONS.BELL}
        size={designTokens.iconSize.lg}
        color={colors.textPrimary}
      />
      {unreadCount > 0 && (
        <View style={[headerIconStyles.badge, { backgroundColor: colors.error }]}>
          <Text style={headerIconStyles.badgeText}>
            {unreadCount > BADGE.MAX_COUNT ? BADGE.OVERFLOW_TEXT : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Combined Header Right Component
const HeaderRight = (): React.JSX.Element => {
  return (
    <View style={headerIconStyles.headerRightContainer}>
      <ProfileIcon />
      <NotificationBell />
    </View>
  );
};

const headerIconStyles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.sm,
  },
  iconButton: {
    padding: designTokens.spacing.sm,
    position: layoutConstants.position.relative,
  },
  avatarCircle: {
    width: dimensionValues.minWidth.iconButtonSmall,
    height: dimensionValues.minHeight.iconButtonSmall,
    borderRadius: designTokens.borderRadius['3xl'],
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  badge: {
    position: layoutConstants.position.absolute,
    top: designTokens.spacing.xs,
    right: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.xl,
    minWidth: dimensionValues.minWidth.badge,
    height: dimensionValues.minHeight.badge,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.xs,
  },
  badgeText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.bold,
  },
});

// Tab icon mapping for navigation
const getTabIcon = (routeName: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  const iconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    [SCREENS.HOME]: ICONS.HOME,
    [TABS.MEMBERS]: ICONS.ACCOUNT_GROUP,
    [SCREENS.ACTIVITIES]: ICONS.ACCOUNT_HEART,
    [TABS.USERS]: ICONS.ACCOUNT_MULTIPLE,
    [TABS.CLUBS]: ICONS.OFFICE_BUILDING,
    [TABS.MEETINGS]: ICONS.CALENDAR_CLOCK,
    [TABS.FINANCES]: ICONS.CASH_MULTIPLE,
    [TABS.MORE]: ICONS.DOTS_HORIZONTAL,
  };
  return iconMap[routeName] || ICONS.HELP;
};

// Admin-specific tabs
const AdminTabs = (): React.JSX.Element => (
  <>
    <Tab.Screen name={TABS.USERS} options={{ title: SCREEN_TITLES.USERS }}>
      {(): React.JSX.Element => <UsersManagementScreen />}
    </Tab.Screen>
    <Tab.Screen name={TABS.CLUBS} options={{ title: SCREEN_TITLES.CLUBS }}>
      {(): React.JSX.Element => <ClubsManagementScreen />}
    </Tab.Screen>
  </>
);

// Club Admin-specific tabs
const ClubAdminTabs = (): React.JSX.Element => (
  <>
    <Tab.Screen name={TABS.MEMBERS} options={{ title: SCREEN_TITLES.MEMBERS }}>
      {(): React.JSX.Element => <ClubMembersScreen />}
    </Tab.Screen>
    <Tab.Screen name={TABS.MEETINGS} options={{ title: SCREEN_TITLES.MEETINGS }}>
      {(): React.JSX.Element => <MeetingPlannerScreen />}
    </Tab.Screen>
    <Tab.Screen name={TABS.FINANCES} options={{ title: SCREEN_TITLES.FINANCES }}>
      {(): React.JSX.Element => <ClubFeesScreen />}
    </Tab.Screen>
  </>
);

// Regular User tabs
const UserTabs = (): React.JSX.Element => (
  <>
    <Tab.Screen name={TABS.MEMBERS} options={{ title: SCREEN_TITLES.MEMBERS }}>
      {(): React.JSX.Element => <MembersScreen />}
    </Tab.Screen>
    <Tab.Screen name={TABS.MEETINGS} options={{ title: SCREEN_TITLES.MEETINGS }}>
      {(): React.JSX.Element => <ActivitiesScreen />}
    </Tab.Screen>
    <Tab.Screen name={TABS.FINANCES} options={{ title: SCREEN_TITLES.FINANCES }}>
      {(): React.JSX.Element => <MyFeesScreen />}
    </Tab.Screen>
  </>
);

// Role-specific dashboard screens
const getDashboardScreen = (role?: UserRole): React.JSX.Element => {
  if (role === UserRole.ADMIN) {
    return <AdminDashboardScreen />;
  }
  if (role === UserRole.CLUB_ADMIN) {
    return <ClubAdminDashboardScreen />;
  }
  return <HomeScreen />;
};

// Role-specific more screens
const getMoreScreen = (role?: UserRole): React.JSX.Element => {
  if (role === UserRole.ADMIN) {
    return <AdminMoreScreen />;
  }
  if (role === UserRole.CLUB_ADMIN) {
    return <ClubAdminMoreScreen />;
  }
  return <UserMoreScreen />;
};

const MainTabs = (): React.JSX.Element => {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name={getTabIcon(route.name)} size={size} color={color} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerRight: () => <HeaderRight />,
        headerShown: true,
        headerStatusBarHeight: 0,
      })}
    >
      <Tab.Screen name={SCREENS.HOME} options={{ title: SCREEN_TITLES.HOME }}>
        {(): React.JSX.Element => getDashboardScreen(user?.role)}
      </Tab.Screen>
      {user?.role === UserRole.ADMIN && <AdminTabs />}
      {user?.role === UserRole.CLUB_ADMIN && <ClubAdminTabs />}
      {user?.role === UserRole.USER && <UserTabs />}
      <Tab.Screen name={TABS.MORE} options={{ title: SCREEN_TITLES.MORE }}>
        {(): React.JSX.Element => getMoreScreen(user?.role)}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AuthStack = (): React.JSX.Element => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={SCREENS.LOGIN}>{(): React.JSX.Element => <LoginScreen />}</Stack.Screen>
      <Stack.Screen name={SCREENS.REGISTER}>
        {(): React.JSX.Element => <RegisterScreen />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Admin-specific stack screens
const AdminStackScreens = (): React.JSX.Element => (
  <>
    <Stack.Screen
      name={SCREENS.USERS_MANAGEMENT}
      options={{ headerShown: true, title: SCREEN_TITLES.USER_MANAGEMENT }}
    >
      {(): React.JSX.Element => <UsersManagementScreen />}
    </Stack.Screen>
    <Stack.Screen
      name={SCREENS.CLUBS_MANAGEMENT}
      options={{ headerShown: true, title: SCREEN_TITLES.CLUB_MANAGEMENT }}
    >
      {(): React.JSX.Element => <ClubsManagementScreen />}
    </Stack.Screen>
    <Stack.Screen
      name={SCREENS.ORGANIZATION_MANAGEMENT}
      options={{ headerShown: true, title: SCREEN_TITLES.ORGANIZATION }}
    >
      {(): React.JSX.Element => <OrganizationManagementScreen />}
    </Stack.Screen>
  </>
);

// Club Admin-specific stack screens
const ClubAdminStackScreens = (): React.JSX.Element => (
  <>
    <Stack.Screen
      name={SCREENS.CLUB_SETTINGS}
      options={{ headerShown: true, title: SCREEN_TITLES.CLUB_SETTINGS }}
    >
      {(): React.JSX.Element => <ClubSettingsScreen />}
    </Stack.Screen>
    <Stack.Screen
      name={SCREENS.CLUB_MATCHES}
      options={{ headerShown: true, title: SCREEN_TITLES.ACTIVITY_MANAGEMENT }}
    >
      {(): React.JSX.Element => <ClubMatchesScreen />}
    </Stack.Screen>
    <Stack.Screen
      name={SCREENS.GENERATE_MATCHES}
      options={{ headerShown: true, title: SCREEN_TITLES.GENERATE_ACTIVITIES }}
    >
      {(): React.JSX.Element => <GenerateMatchesScreen />}
    </Stack.Screen>
    <Stack.Screen
      name={SCREENS.CLUB_DIRECTIVE}
      options={{ headerShown: true, title: SCREEN_TITLES.CLUB_DIRECTIVE }}
    >
      {(): React.JSX.Element => <ClubDirectiveScreen />}
    </Stack.Screen>
  </>
);

const AppStack = (): React.JSX.Element | null => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const showMyFees = user?.role === UserRole.USER || user?.role === UserRole.CLUB_ADMIN;

  const stackScreenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: colors.background },
  };

  const accountOptions = {
    headerShown: true,
    title: SCREEN_TITLES.MY_ACCOUNT,
    presentation: PRESENTATION.MODAL,
  };

  const notificationsOptions = {
    headerShown: true,
    title: SCREEN_TITLES.NOTIFICATIONS,
    presentation: PRESENTATION.MODAL,
  };

  const myFeesOptions = { headerShown: true, title: SCREEN_TITLES.MY_FEES };

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name={SCREENS.MAIN} component={MainTabs} />
      <Stack.Screen name={SCREENS.ACCOUNT} component={AccountScreen} options={accountOptions} />
      <Stack.Screen
        name={SCREENS.NOTIFICATIONS}
        component={NotificationsScreen}
        options={notificationsOptions}
      />
      {user?.role === UserRole.ADMIN && <AdminStackScreens />}
      {user?.role === UserRole.CLUB_ADMIN && <ClubAdminStackScreens />}
      {showMyFees && (
        <Stack.Screen name={SCREENS.MY_FEES} options={myFeesOptions}>
          {(): React.JSX.Element => <MyFeesScreen />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const PendingStack = (): React.JSX.Element => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={SCREENS.PENDING_APPROVAL} component={PendingApprovalScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = (): React.JSX.Element | null => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  // Determine which stack to show based on user state
  const getNavigationStack = (): React.JSX.Element => {
    if (!user) {
      return <AuthStack />;
    }

    // If user has pending approval status, show pending screen
    if (user.approvalStatus === ApprovalStatus.PENDING) {
      return <PendingStack />;
    }

    // If user is rejected, redirect to auth (logout)
    if (user.approvalStatus === ApprovalStatus.REJECTED) {
      return <AuthStack />;
    }

    // Otherwise show normal app
    return <AppStack />;
  };

  // Use a key based on user state to force remount when logging out
  // This ensures navigation state is completely reset
  const navigationKey = user ? `${user.id}-${user.approvalStatus}` : NAV_KEYS.UNAUTHENTICATED;

  return <NavigationContainer key={navigationKey}>{getNavigationStack()}</NavigationContainer>;
};

export default AppNavigator;
