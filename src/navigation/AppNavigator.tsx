import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { designTokens } from '../shared/theme/designTokens';
import { mobileFontSizes } from '../shared/theme/mobileTypography';
import { useTheme } from '../contexts/ThemeContext';

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
      onPress={() => navigation.navigate('Account')}
      accessibilityLabel="Open account settings"
      accessibilityRole="button"
    >
      <View style={[headerIconStyles.avatarCircle, { backgroundColor: colors.primaryAlpha20 }]}>
        <MaterialCommunityIcons name="account" size={22} color={colors.primary} />
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
      onPress={() => navigation.navigate('Notifications' as never)}
      accessibilityLabel="Open notifications"
      accessibilityRole="button"
    >
      <MaterialCommunityIcons name="bell" size={24} color={colors.textPrimary} />
      {unreadCount > 0 && (
        <View style={[headerIconStyles.badge, { backgroundColor: colors.error }]}>
          <Text style={headerIconStyles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.xs,
    fontWeight: 'bold',
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
      case 'Home':
        return 'home';
      case 'Members':
        return 'account-group';
      case 'Activities':
        return 'account-heart';
      case 'Users':
        return 'account-multiple';
      case 'Clubs':
        return 'office-building';
      case 'Meetings':
        return 'calendar-clock';
      case 'Finances':
        return 'cash-multiple';
      case 'More':
        return 'dots-horizontal';
      default:
        return 'help';
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
        name="Home" 
        options={{ title: 'Home' }}
      >
        {() => getDashboardScreen()}
      </Tab.Screen>

      {/* Admin-only tabs: Users and Clubs management */}
      {isAdmin && (
        <Tab.Screen name="Users" options={{ title: 'Users' }}>
          {() => <UsersManagementScreen />}
        </Tab.Screen>
      )}

      {isAdmin && (
        <Tab.Screen name="Clubs" options={{ title: 'Clubs' }}>
          {() => <ClubsManagementScreen />}
        </Tab.Screen>
      )}

      {/* Club Admin tabs: Members and Plan Meetings */}
      {isClubAdmin && (
        <Tab.Screen name="Members" options={{ title: 'Members' }}>
          {() => <ClubMembersScreen />}
        </Tab.Screen>
      )}

      {isClubAdmin && (
        <Tab.Screen name="Meetings" options={{ title: 'Meetings' }}>
          {() => <MeetingPlannerScreen />}
        </Tab.Screen>
      )}

      {isClubAdmin && (
        <Tab.Screen name="Finances" options={{ title: 'Finances' }}>
          {() => <ClubFeesScreen />}
        </Tab.Screen>
      )}

      {/* Regular User tabs: Members, Meetings, and Finances */}
      {isRegularUser && (
        <Tab.Screen name="Members" options={{ title: 'Members' }}>
          {() => <MembersScreen />}
        </Tab.Screen>
      )}

      {isRegularUser && (
        <Tab.Screen name="Meetings" options={{ title: 'Meetings' }}>
          {() => <ActivitiesScreen />}
        </Tab.Screen>
      )}

      {isRegularUser && (
        <Tab.Screen name="Finances" options={{ title: 'Finances' }}>
          {() => <MyFeesScreen />}
        </Tab.Screen>
      )}

      {/* Tab: More - Role-specific additional options */}
      <Tab.Screen name="More" options={{ title: 'More' }}>
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
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Login">{() => <LoginScreen />}</Stack.Screen>
      <Stack.Screen name="Register">{() => <RegisterScreen />}</Stack.Screen>
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      {/* Account - Available for all roles via header icon */}
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          headerShown: true,
          title: 'My Account',
          presentation: 'modal',
        }}
      />
      {/* Notifications - Available for all roles */}
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          headerShown: true,
          title: 'Notifications',
          presentation: 'modal',
        }}
      />
      {/* Admin-specific screens */}
      {user?.role === UserRole.ADMIN && (
        <>
          <Stack.Screen name="UsersManagement" options={{ headerShown: true, title: 'User Management' }}>
            {() => <UsersManagementScreen />}
          </Stack.Screen>
          <Stack.Screen name="ClubsManagement" options={{ headerShown: true, title: 'Club Management' }}>
            {() => <ClubsManagementScreen />}
          </Stack.Screen>
          <Stack.Screen name="OrganizationManagement" options={{ headerShown: true, title: 'Organization' }}>
            {() => <OrganizationManagementScreen />}
          </Stack.Screen>
        </>
      )}
      {/* Club Admin-specific screens */}
      {user?.role === UserRole.CLUB_ADMIN && (
        <>
          <Stack.Screen name="ClubSettings" options={{ headerShown: true, title: 'Club Settings' }}>
            {() => <ClubSettingsScreen />}
          </Stack.Screen>
          <Stack.Screen name="ClubMatches" options={{ headerShown: true, title: 'Activity Management' }}>
            {() => <ClubMatchesScreen />}
          </Stack.Screen>
          <Stack.Screen name="GenerateMatches" options={{ headerShown: true, title: 'Generate Activities' }}>
            {() => <GenerateMatchesScreen />}
          </Stack.Screen>
          <Stack.Screen name="ClubDirective" options={{ headerShown: true, title: 'Club Directive' }}>
            {() => <ClubDirectiveScreen />}
          </Stack.Screen>
        </>
      )}
      {/* User-specific screens (available to regular users and club admins) */}
      {(user?.role === UserRole.USER || user?.role === UserRole.CLUB_ADMIN) && (
        <Stack.Screen name="MyFees" options={{ headerShown: true, title: 'My Fees' }}>
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
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="PendingApproval" component={PendingApprovalScreen} />
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
    if (user.approvalStatus === 'pending') {
      return <PendingStack />;
    }

    // If user is rejected, redirect to auth (logout)
    if (user.approvalStatus === 'rejected') {
      return <AuthStack />;
    }

    // Otherwise show normal app
    return <AppStack />;
  };

  // Use a key based on user state to force remount when logging out
  // This ensures navigation state is completely reset
  const navigationKey = user ? `${user.id}-${user.approvalStatus}` : 'unauthenticated';

  return <NavigationContainer key={navigationKey}>{getNavigationStack()}</NavigationContainer>;
};

export default AppNavigator;
