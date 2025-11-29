import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Auth Screens - Direct imports (lazy loading disabled to fix Metro bundler issue)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PendingApprovalScreen from '../screens/auth/PendingApprovalScreen';

// Main Screens - Direct imports
import HomeScreen from '../screens/main/HomeScreen';
import MatchesScreen from '../screens/main/MatchesScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

// Admin Screens - Direct imports
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import ClubsManagementScreen from '../screens/admin/ClubsManagementScreen';

// Club Admin Screens - Direct imports
import ClubAdminDashboardScreen from '../screens/club-admin/ClubAdminDashboardScreen';
import ClubMembersScreen from '../screens/club-admin/ClubMembersScreen';
import ClubSettingsScreen from '../screens/club-admin/ClubSettingsScreen';
import GenerateMatchesScreen from '../screens/club-admin/GenerateMatchesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Matches') {
            iconName = 'coffee';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          } else if (route.name === 'Admin') {
            iconName = 'shield-account';
          } else if (route.name === 'ClubAdmin') {
            iconName = 'account-group';
          } else {
            iconName = 'help';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* Platform Admin: Only administrative functions, no match features */}
      {user?.role === UserRole.ADMIN ? (
        <>
          <Tab.Screen name="Admin" options={{ title: 'Dashboard' }}>
            {() => <AdminDashboardScreen />}
          </Tab.Screen>
          <Tab.Screen name="Settings">{() => <SettingsScreen />}</Tab.Screen>
        </>
      ) : (
        <>
          {/* Regular users and Club Admins: Full match functionality */}
          <Tab.Screen name="Home">{() => <HomeScreen />}</Tab.Screen>
          <Tab.Screen name="Matches">{() => <MatchesScreen />}</Tab.Screen>
          {user?.role === UserRole.CLUB_ADMIN && (
            <Tab.Screen name="ClubAdmin" options={{ title: 'Club Admin' }}>
              {() => <ClubAdminDashboardScreen />}
            </Tab.Screen>
          )}
          <Tab.Screen name="Settings">{() => <SettingsScreen />}</Tab.Screen>
        </>
      )}
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">{() => <LoginScreen />}</Stack.Screen>
      <Stack.Screen name="Register">{() => <RegisterScreen />}</Stack.Screen>
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      {user?.role === UserRole.ADMIN && (
        <>
          <Stack.Screen name="UsersManagement">{() => <UsersManagementScreen />}</Stack.Screen>
          <Stack.Screen name="ClubsManagement">{() => <ClubsManagementScreen />}</Stack.Screen>
        </>
      )}
      {user?.role === UserRole.CLUB_ADMIN && (
        <>
          <Stack.Screen name="ClubMembers">{() => <ClubMembersScreen />}</Stack.Screen>
          <Stack.Screen name="ClubSettings">{() => <ClubSettingsScreen />}</Stack.Screen>
          <Stack.Screen name="GenerateMatches">{() => <GenerateMatchesScreen />}</Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

const PendingStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
