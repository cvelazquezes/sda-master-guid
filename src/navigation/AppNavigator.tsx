import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { UserRole, ApprovalStatus } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { mobileFontSizes, designTokens, layoutConstants } from '../shared/theme';
import { useTheme } from '../contexts/ThemeContext';
import { SCREENS, TABS, SCREEN_TITLES, ICONS, A11Y_ROLE, dimensionValues, PRESENTATION, BADGE, NAV_KEYS } from '../shared/constants';

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
const ProfileIcon = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={headerIconStyles.iconButton}
      onPress={() => navigation.navigate(SCREENS.ACCOUNT as never)}
      accessibilityLabel={SCREEN_TITLES.MY_ACCOUNT}
      accessibilityRole={A11Y_ROLE.BUTTON}
    >
      <View style={[headerIconStyles.avatarCircle, { backgroundColor: colors.primaryAlpha20 }]}>
        <MaterialCommunityIcons name={ICONS.ACCOUNT} size={designTokens.iconSize.md} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

// Notification Bell Component
const NotificationBell = () => {
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
      <MaterialCommunityIcons name={ICONS.BELL} size={designTokens.iconSize.lg} color={colors.textPrimary} />
      {unreadCount > 0 && (
        <View style={[headerIconStyles.badge, { backgroundColor: colors.error }]}>
          <Text style={headerIconStyles.badgeText}>{unreadCount > BADGE.MAX_COUNT ? BADGE.OVERFLOW_TEXT : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Combined Header Right Component
const HeaderRight = () => {
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

const MainTabs = () => {
  const { user } = useAuth();
  const { colors } = useTheme();

  const isAdmin = user?.role === UserRole.ADMIN;
  const isClubAdmin = user?.role === UserRole.CLUB_ADMIN;
  const isRegularUser = user?.role === UserRole.USER;

  // Tab icon mapping for navigation
  const getTabIcon = (routeName: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (routeName) {
      case SCREENS.HOME:
        return ICONS.HOME;
      case TABS.MEMBERS:
        return ICONS.ACCOUNT_GROUP;
      case SCREENS.ACTIVITIES:
        return ICONS.ACCOUNT_HEART;
      case TABS.USERS:
        return ICONS.ACCOUNT_MULTIPLE;
      case TABS.CLUBS:
        return ICONS.OFFICE_BUILDING;
      case TABS.MEETINGS:
        return ICONS.CALENDAR_CLOCK;
      case TABS.FINANCES:
        return ICONS.CASH_MULTIPLE;
      case TABS.MORE:
        return ICONS.DOTS_HORIZONTAL;
      default:
        return ICONS.HELP;
    }
  };

  // Get role-specific dashboard/home screen
  const getDashboardScreen = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return <AdminDashboardScreen />;
      case UserRole.CLUB_ADMIN:
        return <ClubAdminDashboardScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Get role-specific members screen
  const getMembersScreen = () => {
    switch (user?.role) {
      case UserRole.CLUB_ADMIN:
        return <ClubMembersScreen />;
      default:
        return <MembersScreen />;
    }
  };

  // Get role-specific more screen
  const getMoreScreen = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return <AdminMoreScreen />;
      case UserRole.CLUB_ADMIN:
        return <ClubAdminMoreScreen />;
      default:
        return <UserMoreScreen />;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = getTabIcon(route.name);
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerRight: () => <HeaderRight />,
        headerShown: true,
        headerStatusBarHeight: 0,
      })}
    >
      {/* Tab 1: Home - Role-specific home screen */}
      <Tab.Screen 
        name={SCREENS.HOME} 
        options={{ title: SCREEN_TITLES.HOME }}
      >
        {() => getDashboardScreen()}
      </Tab.Screen>

      {/* Admin-only tabs: Users and Clubs management */}
      {isAdmin && (
        <Tab.Screen name={TABS.USERS} options={{ title: SCREEN_TITLES.USERS }}>
          {() => <UsersManagementScreen />}
        </Tab.Screen>
      )}

      {isAdmin && (
        <Tab.Screen name={TABS.CLUBS} options={{ title: SCREEN_TITLES.CLUBS }}>
          {() => <ClubsManagementScreen />}
        </Tab.Screen>
      )}

      {/* Club Admin tabs: Members and Plan Meetings */}
      {isClubAdmin && (
        <Tab.Screen name={TABS.MEMBERS} options={{ title: SCREEN_TITLES.MEMBERS }}>
          {() => <ClubMembersScreen />}
        </Tab.Screen>
      )}

      {isClubAdmin && (
        <Tab.Screen name={TABS.MEETINGS} options={{ title: SCREEN_TITLES.MEETINGS }}>
          {() => <MeetingPlannerScreen />}
        </Tab.Screen>
      )}

      {isClubAdmin && (
        <Tab.Screen name={TABS.FINANCES} options={{ title: SCREEN_TITLES.FINANCES }}>
          {() => <ClubFeesScreen />}
        </Tab.Screen>
      )}

      {/* Regular User tabs: Members, Meetings, and Finances */}
      {isRegularUser && (
        <Tab.Screen name={TABS.MEMBERS} options={{ title: SCREEN_TITLES.MEMBERS }}>
          {() => <MembersScreen />}
        </Tab.Screen>
      )}

      {isRegularUser && (
        <Tab.Screen name={TABS.MEETINGS} options={{ title: SCREEN_TITLES.MEETINGS }}>
          {() => <ActivitiesScreen />}
        </Tab.Screen>
      )}

      {isRegularUser && (
        <Tab.Screen name={TABS.FINANCES} options={{ title: SCREEN_TITLES.FINANCES }}>
          {() => <MyFeesScreen />}
        </Tab.Screen>
      )}

      {/* Tab: More - Role-specific additional options */}
      <Tab.Screen name={TABS.MORE} options={{ title: SCREEN_TITLES.MORE }}>
        {() => getMoreScreen()}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: designTokens.colors.white },
      }}
    >
      <Stack.Screen name={SCREENS.LOGIN}>{() => <LoginScreen />}</Stack.Screen>
      <Stack.Screen name={SCREENS.REGISTER}>{() => <RegisterScreen />}</Stack.Screen>
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: designTokens.colors.white },
      }}
    >
      <Stack.Screen name={SCREENS.MAIN} component={MainTabs} />
      {/* Account - Available for all roles via header icon */}
      <Stack.Screen 
        name={SCREENS.ACCOUNT} 
        component={AccountScreen}
        options={{
          headerShown: true,
          title: SCREEN_TITLES.MY_ACCOUNT,
          presentation: PRESENTATION.MODAL,
        }}
      />
      {/* Notifications - Available for all roles */}
      <Stack.Screen 
        name={SCREENS.NOTIFICATIONS} 
        component={NotificationsScreen}
        options={{
          headerShown: true,
          title: SCREEN_TITLES.NOTIFICATIONS,
          presentation: PRESENTATION.MODAL,
        }}
      />
      {/* Admin-specific screens */}
      {user?.role === UserRole.ADMIN && (
        <>
          <Stack.Screen name={SCREENS.USERS_MANAGEMENT} options={{ headerShown: true, title: SCREEN_TITLES.USER_MANAGEMENT }}>
            {() => <UsersManagementScreen />}
          </Stack.Screen>
          <Stack.Screen name={SCREENS.CLUBS_MANAGEMENT} options={{ headerShown: true, title: SCREEN_TITLES.CLUB_MANAGEMENT }}>
            {() => <ClubsManagementScreen />}
          </Stack.Screen>
          <Stack.Screen name={SCREENS.ORGANIZATION_MANAGEMENT} options={{ headerShown: true, title: SCREEN_TITLES.ORGANIZATION }}>
            {() => <OrganizationManagementScreen />}
          </Stack.Screen>
        </>
      )}
      {/* Club Admin-specific screens */}
      {user?.role === UserRole.CLUB_ADMIN && (
        <>
          <Stack.Screen name={SCREENS.CLUB_SETTINGS} options={{ headerShown: true, title: SCREEN_TITLES.CLUB_SETTINGS }}>
            {() => <ClubSettingsScreen />}
          </Stack.Screen>
          <Stack.Screen name={SCREENS.CLUB_MATCHES} options={{ headerShown: true, title: SCREEN_TITLES.ACTIVITY_MANAGEMENT }}>
            {() => <ClubMatchesScreen />}
          </Stack.Screen>
          <Stack.Screen name={SCREENS.GENERATE_MATCHES} options={{ headerShown: true, title: SCREEN_TITLES.GENERATE_ACTIVITIES }}>
            {() => <GenerateMatchesScreen />}
          </Stack.Screen>
          <Stack.Screen name={SCREENS.CLUB_DIRECTIVE} options={{ headerShown: true, title: SCREEN_TITLES.CLUB_DIRECTIVE }}>
            {() => <ClubDirectiveScreen />}
          </Stack.Screen>
        </>
      )}
      {/* User-specific screens (available to regular users and club admins) */}
      {(user?.role === UserRole.USER || user?.role === UserRole.CLUB_ADMIN) && (
        <Stack.Screen name={SCREENS.MY_FEES} options={{ headerShown: true, title: SCREEN_TITLES.MY_FEES }}>
          {() => <MyFeesScreen />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const PendingStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: designTokens.colors.white },
      }}
    >
      <Stack.Screen name={SCREENS.PENDING_APPROVAL} component={PendingApprovalScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  // Determine which stack to show based on user state
  const getNavigationStack = () => {
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
