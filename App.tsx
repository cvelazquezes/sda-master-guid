import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { initSentry } from './src/shared/services/sentry';
import { featureFlagsService } from './src/shared/services/featureFlags';
import { logger } from './src/shared/utils/logger';
import './src/i18n'; // Initialize i18n

// Initialize Sentry for error tracking and performance monitoring
initSentry();

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize feature flags system
    const initializeFeatureFlags = async (): Promise<void> => {
      try {
        await featureFlagsService.initialize();
        logger.info('Feature flags initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize feature flags', error as Error);
      }
    };

    initializeFeatureFlags();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <StatusBar style="auto" translucent={false} />
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
