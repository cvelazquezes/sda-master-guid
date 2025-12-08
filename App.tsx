import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/presentation/state/AuthContext';
import { ThemeProvider } from './src/presentation/state/ThemeContext';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import { ErrorBoundary } from './src/presentation/components/features/ErrorBoundary';
import { initializeSentry } from './src/infrastructure/services/sentry';
import { featureFlagsService } from './src/infrastructure/services/featureFlags';
import { logger } from './src/shared/utils/logger';
import { LOG_MESSAGES, STATUS_BAR_STYLE } from './src/shared/constants';
import './src/shared/i18n'; // Initialize i18n

// Initialize Sentry for error tracking and performance monitoring
initializeSentry();

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
      <ThemeProvider>
        <ErrorBoundary>
          <AuthProvider>
            <StatusBar style={STATUS_BAR_STYLE.AUTO} translucent={false} />
            <AppNavigator />
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
