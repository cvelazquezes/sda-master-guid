/**
 * Lazy Screen Loader
 *
 * Wrapper for lazy-loaded screens with loading state and error boundary.
 * Improves initial bundle size and app startup time.
 */

import React, { Suspense, ComponentType, LazyExoticComponent, Component, lazy } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, layoutConstants } from '../theme';
import { designTokens } from '../theme/designTokens';
import { LOG_MESSAGES } from '../constants/logMessages';
import { logger } from '../utils/logger';
import { A11Y_ROLE, ACTIVITY_INDICATOR_SIZE, TOUCH_OPACITY, FLEX } from '../constants';
import { Text } from './Text';

/**
 * Loading fallback labels (passed via options or use defaults)
 */
interface LoadingLabels {
  loadingText?: string;
  errorTitle?: string;
  retryText?: string;
}

/**
 * Loading fallback component
 */
function LoadingFallback({ loadingText }: { loadingText?: string }): React.JSX.Element {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE.large} color={theme.colors.primary} />
      <Text variant="bodyLarge" style={styles.text}>
        {loadingText}
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
  errorTitle?: string;
  retryText?: string;
}

function ErrorFallback({
  error,
  retry,
  errorTitle,
  retryText,
}: ErrorFallbackProps): React.JSX.Element {
  const { theme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="h2" color="error" style={styles.errorTitle}>
        {errorTitle}
      </Text>
      <Text variant="bodySmall" color="secondary" align="center" style={styles.errorMessage}>
        {error.message}
      </Text>
      <TouchableOpacity
        onPress={retry}
        activeOpacity={TOUCH_OPACITY.default}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={retryText}
      >
        <Text
          variant="bodyLarge"
          weight="semibold"
          style={[styles.retryButton, { color: colors.primary }]}
        >
          {retryText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Error boundary for lazy-loaded screens
 */
class LazyErrorBoundary extends Component<
  { children: React.ReactNode; fallback: (error: Error, retry: () => void) => React.ReactNode },
  { error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback: (error: Error, retry: () => void) => React.ReactNode;
  }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error(LOG_MESSAGES.LAZY_SCREEN.LOAD_ERROR, error, { errorInfo });
  }

  retry = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
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
 * const LazyHomeScreen = lazyScreen(() => import('./screens/HomeScreen'), {
 *   labels: {
 *     loadingText: 'Loading...',
 *     errorTitle: 'Failed to load screen',
 *     retryText: 'Tap to retry',
 *   },
 * });
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
    /** Labels for loading/error states (pass translated strings) */
    labels?: LoadingLabels;
  } = {}
): ComponentType<P> {
  const LazyComponent = lazy(importFn);

  const fallback = options.fallback ?? (
    <LoadingFallback loadingText={options.labels?.loadingText} />
  );
  const errorFallback =
    options.errorFallback ??
    ((error, retry) => (
      <ErrorFallback
        error={error}
        retry={retry}
        errorTitle={options.labels?.errorTitle}
        retryText={options.labels?.retryText}
      />
    ));

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
    flex: FLEX.ONE,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
  },
  text: {
    marginTop: designTokens.spacing.lg,
  },
  errorTitle: {
    marginBottom: designTokens.spacing.sm,
  },
  errorMessage: {
    marginBottom: designTokens.spacing.lg,
  },
  retryButton: {
    padding: designTokens.spacing.md,
  },
});
