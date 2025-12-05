/**
 * Lazy Screen Loader
 * 
 * Wrapper for lazy-loaded screens with loading state and error boundary.
 * Improves initial bundle size and app startup time.
 */

import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, layoutConstants } from '../theme';
import { mobileFontSizes } from '../theme/mobileTypography';
import { designTokens } from '../theme/designTokens';
import { flexValues } from '../constants/layoutConstants';
import { ACTIVITY_INDICATOR_SIZE, A11Y_ROLE, TOUCH_OPACITY } from '../constants';
import { LOG_MESSAGES } from '../constants/logMessages';
import { logger } from '../../services/logger';

/**
 * Loading fallback component
 */
function LoadingFallback() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE.large} color={theme.colors.primary} />
      <Text style={[styles.text, { color: theme.colors.onSurface }]}>
        {t('common.loading')}
      </Text>
    </View>
  );
}

/**
 * Error fallback component
 */
interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

function ErrorFallback({ error, retry }: ErrorFallbackProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
        {t('common.failedToLoadScreen')}
      </Text>
      <Text style={[styles.errorMessage, { color: theme.colors.onSurfaceVariant }]}>
        {error.message}
      </Text>
      <TouchableOpacity 
        onPress={retry}
        activeOpacity={TOUCH_OPACITY.default}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={t('common.tapToRetry')}
      >
        <Text style={[styles.retryButton, { color: theme.colors.primary }]}>
          {t('common.tapToRetry')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Error boundary for lazy-loaded screens
 */
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: (error: Error, retry: () => void) => React.ReactNode },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(LOG_MESSAGES.LAZY_SCREEN.LOAD_ERROR, error, { errorInfo });
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.retry);
    }
    return this.props.children;
  }
}

/**
 * Lazy screen wrapper with Suspense and error boundary
 * 
 * @param Component - Lazy-loaded component
 * @param options - Configuration options
 * @returns Wrapped component
 * 
 * @example
 * ```typescript
 * const LazyHomeScreen = lazyScreen(() => import('./screens/HomeScreen'));
 * 
 * // Use in navigation
 * <Stack.Screen name="Home" component={LazyHomeScreen} />
 * ```
 */
export function lazyScreen<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    fallback?: React.ReactNode;
    errorFallback?: (error: Error, retry: () => void) => React.ReactNode;
  } = {}
): ComponentType<P> {
  const LazyComponent = React.lazy(importFn);
  
  const fallback = options.fallback ?? <LoadingFallback />;
  const errorFallback = options.errorFallback ?? ((error, retry) => <ErrorFallback error={error} retry={retry} />);
  
  return function LazyScreenWrapper(props: P) {
    return (
      <LazyErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <LazyComponent {...(props as P & JSX.IntrinsicAttributes)} />
        </Suspense>
      </LazyErrorBoundary>
    );
  };
}

/**
 * Preload a lazy screen
 * 
 * @param Component - Lazy component to preload
 * 
 * @example
 * ```typescript
 * // Preload on mount
 * useEffect(() => {
 *   preloadScreen(LazyProfileScreen);
 * }, []);
 * ```
 */
export function preloadScreen<P extends object>(
  Component: LazyExoticComponent<ComponentType<P>>
): void {
  // Force React to start loading the component by accessing it
  // This triggers the lazy loading promise
  const lazyComp = Component as unknown as { _init?: () => void; _payload?: unknown };
  if (lazyComp._init && lazyComp._payload) {
    lazyComp._init();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
  },
  text: {
    marginTop: designTokens.spacing.lg,
    fontSize: mobileFontSizes.lg,
  },
  errorTitle: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.sm,
  },
  errorMessage: {
    fontSize: mobileFontSizes.sm,
    textAlign: layoutConstants.textAlign.center,
    marginBottom: designTokens.spacing.lg,
  },
  retryButton: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    padding: designTokens.spacing.md,
  },
});

