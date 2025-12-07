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
import { LOG_MESSAGES, STATUS_BAR_STYLE } from './src/shared/constants';
import './src/i18n'; // Initialize i18n

// Initialize Sentry for error tracking and performance monitoring
initSentry();

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize feature flags system
    const initializeFeatureFlags = async (): Promise<void> => {
      try {
        await featureFlagsService.initialize();
        logger.info(LOG_MESSAGES.APP.FEATURE_FLAGS_INITIALIZED);
      } catch (error) {
        logger.error(LOG_MESSAGES.APP.FEATURE_FLAGS_INIT_FAILED, error as Error);
      }
    };

    initializeFeatureFlags();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <StatusBar style={STATUS_BAR_STYLE.AUTO} translucent={false} />
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
