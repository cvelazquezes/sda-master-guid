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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { mobileTypography, mobileIconSizes, designTokens, layoutConstants } from '../theme';
import {
  A11Y_ROLE,
  ANIMATION,
  ICONS,
  KEYBOARD_BEHAVIOR,
  MODAL_CONFIG,
  PLATFORM_OS,
  borderValues,
  dimensionValues,
  flexValues,
} from '../constants';

// Type for animation
type AnimationType = typeof ANIMATION.FADE | typeof ANIMATION.SLIDE | typeof ANIMATION.NONE;

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
  animationType?: AnimationType;
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
  maxHeight = dimensionValues.maxHeightPercent.ninety,
  scrollable = true,
  showCloseButton = true,
  footer,
  animationType = ANIMATION.SLIDE,
  fullScreen = false,
  headerColor,
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const finalIconColor = iconColor || colors.primary;
  const finalIconBackgroundColor = iconBackgroundColor || colors.primaryAlpha10;

  // Determine if we should use bottom sheet (mobile) or centered modal (tablet/desktop)
  const isMobile = windowWidth < designTokens.breakpoints.tablet;

  // Calculate responsive modal width
  const getModalWidth = () => {
    if (windowWidth > designTokens.breakpoints.desktop) {
      // Desktop large screens
      return Math.min(
        designTokens.responsiveScale.maxWidth.modal,
        windowWidth * designTokens.responsiveScale.modal.desktop
      );
    } else if (windowWidth > designTokens.breakpoints.tablet) {
      // Tablets and small desktop
      return Math.min(
        designTokens.responsiveScale.maxWidth.modalSmall,
        windowWidth * designTokens.responsiveScale.modal.tablet
      );
    } else {
      // Mobile - full width for bottom sheet
      return dimensionValues.maxWidthPercent.full;
    }
  };

  // Calculate responsive max height
  const getMaxHeight = () => {
    if (typeof maxHeight === 'string' && maxHeight.includes(MODAL_CONFIG.PERCENTAGE_SYMBOL)) {
      const percentage = parseFloat(maxHeight) / MODAL_CONFIG.PERCENTAGE_DIVISOR;
      return windowHeight * percentage;
    }
    if (typeof maxHeight === 'number') {
      return Math.min(maxHeight, windowHeight * MODAL_CONFIG.MAX_HEIGHT_RATIO);
    }
    return windowHeight * MODAL_CONFIG.MAX_HEIGHT_RATIO;
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
      animationType={isMobile ? ANIMATION.SLIDE : animationType}
      transparent={!fullScreen}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}
        behavior={
          Platform.OS === PLATFORM_OS.IOS ? KEYBOARD_BEHAVIOR.PADDING : KEYBOARD_BEHAVIOR.HEIGHT
        }
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
                shadowOpacity: isDark
                  ? designTokens.shadowConfig.dark.opacity
                  : designTokens.shadowConfig.lightStrong.opacity,
              },
              isMobile ? styles.modalContentMobile : styles.modalContentDesktop,
              { width: modalWidth, maxHeight: modalMaxHeight },
            ]}
          >
            {/* Drag Handle - Mobile Only */}
            {isMobile && <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />}

            {/* Header */}
            <View
              style={[
                styles.header,
                { borderBottomColor: colors.border },
                headerColor ? { backgroundColor: headerColor } : undefined,
              ]}
            >
              <View style={styles.headerLeft}>
                {icon && (
                  <View
                    style={[styles.iconContainer, { backgroundColor: finalIconBackgroundColor }]}
                  >
                    <MaterialCommunityIcons
                      name={icon as typeof ICONS.CHECK}
                      size={isMobile ? mobileIconSizes.large : mobileIconSizes.xlarge}
                      color={finalIconColor}
                    />
                  </View>
                )}
                <View style={styles.headerInfo}>
                  <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</Text>
                  {subtitle && (
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                      {subtitle}
                    </Text>
                  )}
                </View>
              </View>
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  accessible={true}
                  accessibilityRole={A11Y_ROLE.BUTTON}
                  accessibilityLabel={t('accessibility.closeModal')}
                >
                  <MaterialCommunityIcons
                    name={ICONS.CLOSE}
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
              <View style={[styles.footer, { borderTopColor: colors.border }]}>{footer}</View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: flexValues.one,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    paddingTop:
      Platform.OS === PLATFORM_OS.ANDROID ? StatusBar.currentHeight : designTokens.spacing.xl,
  },
  modalOverlayMobile: {
    justifyContent: layoutConstants.justifyContent.flexEnd,
    paddingTop: designTokens.spacing.none,
  },
  backdrop: {
    flex: flexValues.one,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xl,
    paddingHorizontal: designTokens.spacing.lg,
    width: dimensionValues.width.full,
  },
  backdropMobile: {
    justifyContent: layoutConstants.justifyContent.flexEnd,
    paddingVertical: designTokens.spacing.none,
    paddingHorizontal: designTokens.spacing.none,
  },
  modalContent: {
    ...designTokens.shadow.xl,
  },
  modalContentDesktop: {
    borderRadius: designTokens.borderRadius.xxl,
  },
  modalContentMobile: {
    borderTopLeftRadius: designTokens.borderRadius.xxl,
    borderTopRightRadius: designTokens.borderRadius.xxl,
    borderBottomLeftRadius: borderValues.radius.none,
    borderBottomRightRadius: borderValues.radius.none,
  },
  dragHandle: {
    width: designTokens.spacing['4xl'],
    height: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    alignSelf: layoutConstants.alignSelf.center,
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  headerLeft: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
  },
  iconContainer: {
    width: designTokens.touchTarget.comfortable,
    height: designTokens.touchTarget.comfortable,
    borderRadius: designTokens.touchTarget.comfortable / 2,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  headerInfo: {
    flex: flexValues.one,
  },
  headerTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
  },
  headerSubtitle: {
    ...mobileTypography.label,
    marginTop: designTokens.spacing.xs,
  },
  closeButton: {
    padding: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
  },
  content: {
    flex: flexValues.one,
  },
  contentWrapper: {
    flex: flexValues.one,
  },
  scrollContent: {
    flex: flexValues.one,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  footer: {
    padding: designTokens.spacing.lg,
    borderTopWidth: designTokens.borderWidth.thin,
  },
});
