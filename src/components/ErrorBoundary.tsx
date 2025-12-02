/**
 * Error Boundary Component
 * Catches and handles React component errors gracefully
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { logger } from '../utils/logger';
import { designTokens } from '../shared/theme/designTokens';
import { mobileTypography, mobileFontSizes } from '../shared/theme/mobileTypography';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to logging service
    logger.error('Error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });

    // Send to error tracking service (Sentry, etc.)
    // this.sendToErrorTracking(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={64}
              color={designTokens.colors.error}
            />
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details (Dev Only):</Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleReset}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.xl,
  },
  content: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.xxl,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: mobileFontSizes['3xl'],
    fontWeight: 'bold',
    color: designTokens.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorDetails: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: designTokens.colors.inputBackground,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: mobileFontSizes.sm,
    fontWeight: '600',
    color: designTokens.colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textSecondary,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: designTokens.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: designTokens.borderRadius.md,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
  },
});

