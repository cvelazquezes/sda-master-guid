/**
 * Lazy Screen Loader
 * 
 * Wrapper for lazy-loaded screens with loading state and error boundary.
 * Improves initial bundle size and app startup time.
 */

import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';

/**
 * Loading fallback component
 */
function LoadingFallback() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.text, { color: theme.colors.onSurface }]}>
        Loading...
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
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
        Failed to load screen
      </Text>
      <Text style={[styles.errorMessage, { color: theme.colors.onSurfaceVariant }]}>
        {error.message}
      </Text>
      <Text 
        style={[styles.retryButton, { color: theme.colors.primary }]}
        onPress={retry}
      >
        Tap to retry
      </Text>
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
    console.error('Lazy load error:', error, errorInfo);
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
export function lazyScreen<P extends object>(
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
          <LazyComponent {...props} />
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
  // Force React to start loading the component
  Component._init(Component._payload);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
  },
});

