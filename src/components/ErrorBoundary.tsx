/**
 * Error Boundary Component
 * Catches and handles React component errors gracefully
 */

import React, { Component, ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Text } from '../shared/components';
import { logger } from '../utils/logger';
import { designTokens, layoutConstants } from '../shared/theme';
import {
  ICONS,
  FLEX,
  DIMENSIONS,
  SHADOW_OFFSET,
  FONT_FAMILY,
  LOG_MESSAGES,
  TEXT_VARIANT,
  TEXT_COLOR,
  TEXT_WEIGHT,
  TEXT_ALIGN,
} from '../shared/constants';

interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
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
    logger.error(LOG_MESSAGES.ERROR_BOUNDARY.CAUGHT, error, {
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
    const { t } = this.props;

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
              name={ICONS.ALERT_CIRCLE_OUTLINE}
              size={designTokens.iconSize['3xl']}
              color={designTokens.colors.error}
            />
            <Text variant={TEXT_VARIANT.H1} style={styles.title}>
              {t('components.errorBoundary.title')}
            </Text>
            <Text
              variant={TEXT_VARIANT.BODY_LARGE}
              color={TEXT_COLOR.SECONDARY}
              align={TEXT_ALIGN.CENTER}
              style={styles.message}
            >
              {t('components.errorBoundary.message')}
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.errorDetails}>
                <Text
                  variant={TEXT_VARIANT.LABEL}
                  weight={TEXT_WEIGHT.SEMIBOLD}
                  color={TEXT_COLOR.ERROR}
                  style={styles.errorTitle}
                >
                  {t('components.errorBoundary.errorDetailsTitle')}
                </Text>
                <Text
                  variant={TEXT_VARIANT.CAPTION}
                  color={TEXT_COLOR.SECONDARY}
                  style={styles.errorText}
                >
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text
                    variant={TEXT_VARIANT.CAPTION}
                    color={TEXT_COLOR.SECONDARY}
                    style={styles.errorText}
                  >
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <Text
                variant={TEXT_VARIANT.BODY_LARGE}
                weight={TEXT_WEIGHT.SEMIBOLD}
                color={TEXT_COLOR.ON_PRIMARY}
              >
                {t('components.errorBoundary.tryAgain')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Wrap with withTranslation HOC for i18n support
const ErrorBoundaryWithTranslation = withTranslation()(ErrorBoundaryClass);

export { ErrorBoundaryWithTranslation as ErrorBoundary };

const styles = StyleSheet.create({
  container: {
    flex: FLEX.ONE,
    backgroundColor: designTokens.colors.backgroundSecondary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
  },
  content: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.xxl,
    maxWidth: DIMENSIONS.MAX_WIDTH.CARD,
    width: DIMENSIONS.WIDTH.FULL,
    alignItems: layoutConstants.alignItems.center,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: SHADOW_OFFSET.MD,
    shadowOpacity: designTokens.shadows.md.shadowOpacity,
    shadowRadius: designTokens.shadows.sm.shadowRadius,
    elevation: designTokens.shadows.md.elevation,
  },
  title: {
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.sm,
  },
  message: {
    marginBottom: designTokens.spacing.xxl,
  },
  errorDetails: {
    width: DIMENSIONS.WIDTH.FULL,
    maxHeight: DIMENSIONS.MAX_HEIGHT.ERROR_DETAILS,
    backgroundColor: designTokens.colors.inputBackground,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
  },
  errorTitle: {
    marginBottom: designTokens.spacing.sm,
  },
  errorText: {
    fontFamily: FONT_FAMILY.MONO,
  },
  button: {
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xxl,
    borderRadius: designTokens.borderRadius.md,
    minWidth: DIMENSIONS.MIN_WIDTH.BUTTON,
    alignItems: layoutConstants.alignItems.center,
  },
});
