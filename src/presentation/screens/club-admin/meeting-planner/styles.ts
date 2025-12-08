/**
 * Meeting Planner Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet } from 'react-native';
import { FLEX, SHADOW_OFFSET, DIMENSIONS, TEXT_ALIGN_VERTICAL } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// MAIN STYLES FACTORY
// ============================================================================

export const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    container: { flex: FLEX.ONE, backgroundColor: colors.backgroundSecondary },
    content: { flex: FLEX.ONE },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing['7xl'],
      paddingHorizontal: spacing['4xl'],
    },
    emptyText: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textSecondary,
      marginTop: spacing.lg,
    },
    emptySubtext: {
      fontSize: typography.fontSizes.sm,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    footer: {
      padding: spacing.xl,
      backgroundColor: colors.backgroundPrimary,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: radii.xl,
      gap: spacing.md,
    },
    saveButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
    footerButtons: { flexDirection: 'row', gap: spacing.md },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.backgroundSecondary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radii.xl,
      gap: spacing.sm,
    },
    editButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.primary,
    },
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.success,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radii.xl,
      gap: spacing.md,
      flex: FLEX.ONE,
    },
    shareButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
  });

// ============================================================================
// MEETING INFO STYLES FACTORY
// ============================================================================

export const createMeetingInfoStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    section: {
      backgroundColor: colors.backgroundPrimary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      gap: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    label: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.textSecondary,
    },
    date: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      flex: FLEX.ONE,
    },
    quickDateButtons: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    quickDateButton: {
      flex: FLEX.ONE,
      backgroundColor: colors.primaryAlpha20,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.md,
      alignItems: 'center',
    },
    quickDateText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    titleInput: {
      fontSize: typography.fontSizes.md,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: radii.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: colors.inputBackground,
      color: colors.textPrimary,
    },
    totalTimeBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryAlpha20,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    totalTimeText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textPrimary,
    },
    totalTimeBold: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
  });

// ============================================================================
// AGENDA CARD STYLES FACTORY
// ============================================================================

export const createAgendaCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundPrimary,
      padding: spacing.lg,
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      borderRadius: radii.lg,
      shadowColor: colors.textPrimary,
      shadowOffset: SHADOW_OFFSET.MD,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    orderBadge: {
      width: DIMENSIONS.SIZE.ORDER_BADGE,
      height: DIMENSIONS.SIZE.ORDER_BADGE,
      borderRadius: radii.xl,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    orderText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
    content: { flex: FLEX.ONE },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    title: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      flex: FLEX.ONE,
      color: colors.textPrimary,
    },
    timeChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.lg,
      gap: spacing.xs,
    },
    timeText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      fontWeight: typography.fontWeights.semibold,
    },
    description: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    responsibleSection: { marginTop: spacing.sm },
    memberChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryAlpha20,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.xl,
      alignSelf: 'flex-start',
      gap: spacing.sm,
    },
    memberName: {
      fontSize: typography.fontSizes.sm,
      color: colors.textPrimary,
      fontWeight: typography.fontWeights.semibold,
      flex: FLEX.ONE,
    },
    actions: { marginLeft: spacing.md, gap: spacing.sm },
    moveButtons: { gap: spacing.xs },
    moveButton: { padding: spacing.xs },
    moveButtonDisabled: { opacity: 0.4 },
    actionButton: { padding: spacing.xs },
  });

// ============================================================================
// ASSIGN BUTTON STYLES FACTORY
// ============================================================================

export const createAssignButtonStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.primary,
      alignSelf: 'flex-start',
      gap: spacing.sm,
    },
    text: {
      fontSize: typography.fontSizes.sm,
      color: colors.primary,
      fontWeight: typography.fontWeights.semibold,
    },
  });

// ============================================================================
// MODAL STYLES FACTORY
// ============================================================================

export const createModalStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    overlay: {
      flex: FLEX.ONE,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    content: {
      backgroundColor: colors.backgroundPrimary,
      borderTopLeftRadius: radii.xl,
      borderTopRightRadius: radii.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    title: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    body: { padding: spacing.xl },
    inputLabel: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
    },
    input: {
      fontSize: typography.fontSizes.md,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: radii.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: colors.inputBackground,
      color: colors.textPrimary,
    },
    textArea: {
      minHeight: DIMENSIONS.MIN_HEIGHT.TEXTAREA,
      textAlignVertical: TEXT_ALIGN_VERTICAL.TOP,
    },
    footer: {
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    button: {
      flex: FLEX.ONE,
      paddingVertical: spacing.md,
      borderRadius: radii.md,
      alignItems: 'center',
    },
    cancelButton: { backgroundColor: colors.backgroundSecondary },
    cancelButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textSecondary,
    },
    confirmButton: { backgroundColor: colors.primary },
    confirmButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
    memberOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: radii.md,
      backgroundColor: colors.inputBackground,
      marginBottom: spacing.sm,
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: radii['2xl'],
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    memberAvatarText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
    memberInfo: { flex: FLEX.ONE },
    memberOptionName: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    memberOptionEmail: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
    noMembersText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textTertiary,
      textAlign: 'center',
      paddingVertical: spacing['4xl'],
    },
  });

// ============================================================================
// SHARE MODAL STYLES FACTORY
// ============================================================================

export const createShareModalStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii['2xl'],
      padding: spacing.xxl,
      alignSelf: 'center',
    },
    header: { alignItems: 'center', marginBottom: spacing.xxl },
    iconContainer: {
      width: DIMENSIONS.SIZE.SHARE_ICON_LARGE,
      height: DIMENSIONS.SIZE.SHARE_ICON_LARGE,
      borderRadius: radii.full,
      backgroundColor: colors.primaryAlpha20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold,
      textAlign: 'center',
      marginBottom: spacing.sm,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    info: {
      backgroundColor: colors.inputBackground,
      borderRadius: radii.lg,
      padding: spacing.lg,
      gap: spacing.lg,
      marginBottom: spacing.xxl,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    infoText: { flex: FLEX.ONE },
    infoLabel: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    infoValue: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    actions: { flexDirection: 'row', gap: spacing.md },
    confirmButton: {
      flex: 1.5,
      flexDirection: 'row',
      gap: spacing.sm,
      backgroundColor: colors.success,
    },
  });
