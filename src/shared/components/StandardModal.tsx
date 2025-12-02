/**
 * StandardModal Component
 * Consistent modal wrapper used across all screens and roles
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileTypography, mobileIconSizes } from '../theme';
import { designTokens } from '../theme/designTokens';

interface StandardModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  children: React.ReactNode;
  maxHeight?: number | string;
  scrollable?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'none';
  fullScreen?: boolean;
  headerColor?: string;
}

export const StandardModal: React.FC<StandardModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  icon,
  iconColor,
  iconBackgroundColor,
  children,
  maxHeight = '90%',
  scrollable = true,
  showCloseButton = true,
  footer,
  animationType = 'slide',
  fullScreen = false,
  headerColor,
}) => {
  const { colors, isDark } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  
  const finalIconColor = iconColor || colors.primary;
  const finalIconBackgroundColor = iconBackgroundColor || colors.primaryAlpha10;
  
  // Determine if we should use bottom sheet (mobile) or centered modal (tablet/desktop)
  const isMobile = windowWidth < 768;
  
  // Calculate responsive modal width
  const getModalWidth = () => {
    if (windowWidth > 1200) {
      // Desktop large screens
      return Math.min(600, windowWidth * 0.45);
    } else if (windowWidth > 768) {
      // Tablets and small desktop
      return Math.min(500, windowWidth * 0.65);
    } else {
      // Mobile - full width for bottom sheet
      return '100%';
    }
  };

  // Calculate responsive max height
  const getMaxHeight = () => {
    if (typeof maxHeight === 'string' && maxHeight.includes('%')) {
      const percentage = parseFloat(maxHeight) / 100;
      return windowHeight * percentage;
    }
    if (typeof maxHeight === 'number') {
      return Math.min(maxHeight, windowHeight * 0.9);
    }
    return windowHeight * 0.9;
  };

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentWrapperProps = scrollable
    ? { contentContainerStyle: styles.scrollContentContainer }
    : { style: styles.contentWrapper };

  const modalWidth = getModalWidth();
  const modalMaxHeight = getMaxHeight();

  return (
    <Modal
      visible={visible}
      animationType={isMobile ? 'slide' : animationType}
      transparent={!fullScreen}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={[styles.backdrop, isMobile && styles.backdropMobile]}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.modalContent,
              { 
                backgroundColor: colors.surface,
                shadowOpacity: isDark ? 0.4 : 0.25,
              },
              isMobile ? styles.modalContentMobile : styles.modalContentDesktop,
              { width: modalWidth, maxHeight: modalMaxHeight },
            ]}
          >
            {/* Drag Handle - Mobile Only */}
            {isMobile && (
              <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
            )}

            {/* Header */}
            <View style={[
              styles.header, 
              { borderBottomColor: colors.border },
              headerColor ? { backgroundColor: headerColor } : undefined
            ]}>
              <View style={styles.headerLeft}>
                {icon && (
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: finalIconBackgroundColor },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={icon as any}
                      size={isMobile ? mobileIconSizes.large : mobileIconSizes.xlarge}
                      color={finalIconColor}
                    />
                  </View>
                )}
                <View style={styles.headerInfo}>
                  <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</Text>
                  {subtitle && (
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
                  )}
                </View>
              </View>
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Close modal"
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={mobileIconSizes.large}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            <ContentWrapper
              style={scrollable ? styles.scrollContent : styles.content}
              {...contentWrapperProps}
            >
              {children}
            </ContentWrapper>

            {/* Footer */}
            {footer && (
              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                {footer}
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  modalOverlayMobile: {
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: '100%',
  },
  backdropMobile: {
    justifyContent: 'flex-end',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  modalContent: {
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  modalContentDesktop: {
    borderRadius: designTokens.borderRadius.xxl,
  },
  modalContentMobile: {
    borderTopLeftRadius: designTokens.borderRadius.xxl,
    borderTopRightRadius: designTokens.borderRadius.xxl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: designTokens.borderRadius.full,
    alignSelf: 'center',
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...mobileTypography.label,
    marginTop: 4,
  },
  closeButton: {
    padding: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
  },
  content: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  footer: {
    padding: designTokens.spacing.lg,
    borderTopWidth: 1,
  },
});
