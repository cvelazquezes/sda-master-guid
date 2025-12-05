/**
 * Motion Design Tokens
 *
 * Consistent animation and transition values for the entire application.
 * Following Material Design motion guidelines and iOS HIG principles.
 *
 * USAGE:
 * import { motionTokens } from './tokens';
 * Animated.timing(value, { duration: motionTokens.duration.normal });
 */

import { Easing } from 'react-native';

// ============================================================================
// DURATION TOKENS
// ============================================================================

/**
 * Duration values in milliseconds
 *
 * Guidelines:
 * - instant: Immediate, no perceptible delay
 * - fast: Quick micro-interactions (toggles, hovers)
 * - normal: Standard transitions (modals, cards)
 * - slow: Complex animations (page transitions)
 * - slower: Elaborate animations (onboarding)
 */
export const durationTokens = {
  instant: 0,
  ultraFast: 50,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 700,

  // Semantic durations
  micro: 100, // Micro-interactions
  short: 200, // Quick transitions
  medium: 300, // Standard animations
  long: 450, // Complex animations

  // Component-specific
  fade: 200,
  scale: 250,
  slide: 300,
  modal: 300,
  drawer: 350,
  toast: 250,
  ripple: 400,

  // Spinner/Loading
  spinnerCycle: 1000,
  pulseInterval: 1500,
  skeletonShimmer: 1200,
} as const;

// ============================================================================
// EASING TOKENS
// ============================================================================

/**
 * Easing functions for natural motion
 *
 * Guidelines:
 * - easeOut: Elements entering the screen
 * - easeIn: Elements leaving the screen
 * - easeInOut: Elements moving within the screen
 * - sharp: Attention-grabbing transitions
 */
export const easingTokens = {
  // Standard easings
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),

  // Cubic easings (Material Design)
  standard: Easing.bezier(0.4, 0, 0.2, 1), // Standard curve
  decelerate: Easing.bezier(0, 0, 0.2, 1), // Deceleration curve
  accelerate: Easing.bezier(0.4, 0, 1, 1), // Acceleration curve
  sharp: Easing.bezier(0.4, 0, 0.6, 1), // Sharp curve

  // Expressive easings
  overshoot: Easing.back(1.5),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),

  // Spring-like
  spring: Easing.bezier(0.175, 0.885, 0.32, 1.275),

  // iOS-style
  iosSpring: Easing.bezier(0.25, 0.46, 0.45, 0.94),
} as const;

// ============================================================================
// SPRING CONFIG TOKENS
// ============================================================================

/**
 * Spring animation configurations
 * For use with Animated.spring() or react-native-reanimated
 */
export const springTokens = {
  // Gentle spring (subtle animations)
  gentle: {
    damping: 15,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },

  // Default spring (most interactions)
  default: {
    damping: 20,
    mass: 1,
    stiffness: 180,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },

  // Stiff spring (snappy interactions)
  stiff: {
    damping: 25,
    mass: 1,
    stiffness: 300,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },

  // Bouncy spring (playful animations)
  bouncy: {
    damping: 10,
    mass: 1,
    stiffness: 180,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },

  // Modal spring
  modal: {
    damping: 18,
    mass: 1,
    stiffness: 200,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },

  // Press feedback
  press: {
    damping: 25,
    mass: 0.8,
    stiffness: 400,
    overshootClamping: true,
    restSpeedThreshold: 0.01,
    restDisplacementThreshold: 0.01,
  },
} as const;

// ============================================================================
// SCALE TOKENS
// ============================================================================

/**
 * Scale values for transform animations
 */
export const scaleTokens = {
  // Press states
  pressed: 0.96,
  pressedSubtle: 0.98,
  pressedStrong: 0.92,

  // Hover states (web/tablet)
  hover: 1.02,
  hoverSubtle: 1.01,
  hoverStrong: 1.05,

  // Entrance animations
  enterFrom: 0.95,
  enterTo: 1,

  // Exit animations
  exitFrom: 1,
  exitTo: 0.95,

  // Modal
  modalEnterFrom: 0.9,
  modalExitTo: 0.9,

  // Alert/Toast
  alertEnter: 0.8,
  alertExit: 0.8,
} as const;

// ============================================================================
// OPACITY TOKENS (for animations)
// ============================================================================

export const opacityAnimationTokens = {
  // Fade states
  visible: 1,
  hidden: 0,

  // Semi-transparent states
  semiVisible: 0.7,
  backdrop: 0.5,

  // Enter/Exit
  enterFrom: 0,
  enterTo: 1,
  exitFrom: 1,
  exitTo: 0,
} as const;

// ============================================================================
// TRANSLATE TOKENS
// ============================================================================

/**
 * Translation values for slide animations
 */
export const translateTokens = {
  // Slide directions (in pixels)
  slideUp: {
    from: 50,
    to: 0,
  },
  slideDown: {
    from: -50,
    to: 0,
  },
  slideLeft: {
    from: 50,
    to: 0,
  },
  slideRight: {
    from: -50,
    to: 0,
  },

  // Modal specific
  modalSlideUp: {
    from: 100,
    to: 0,
  },

  // Drawer specific
  drawerSlide: {
    from: -300,
    to: 0,
  },

  // Toast specific
  toastSlideUp: {
    from: 80,
    to: 0,
  },
  toastSlideDown: {
    from: -80,
    to: 0,
  },

  // Subtle movements
  subtle: {
    from: 10,
    to: 0,
  },
} as const;

// ============================================================================
// DELAY TOKENS
// ============================================================================

/**
 * Delay values for staggered animations
 */
export const delayTokens = {
  // Base delays
  none: 0,
  short: 50,
  medium: 100,
  long: 200,

  // Stagger intervals
  staggerFast: 30,
  staggerNormal: 50,
  staggerSlow: 80,

  // Component-specific
  modalContent: 150,
  listItem: 50,
  formField: 75,
} as const;

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Pre-composed animation configurations
 */
export const animationPresets = {
  // Fade animations
  fadeIn: {
    duration: durationTokens.fade,
    easing: easingTokens.easeOut,
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    duration: durationTokens.fade,
    easing: easingTokens.easeIn,
    from: { opacity: 1 },
    to: { opacity: 0 },
  },

  // Scale animations
  scaleIn: {
    duration: durationTokens.scale,
    easing: easingTokens.spring,
    from: { scale: scaleTokens.enterFrom, opacity: 0 },
    to: { scale: scaleTokens.enterTo, opacity: 1 },
  },
  scaleOut: {
    duration: durationTokens.scale,
    easing: easingTokens.easeIn,
    from: { scale: scaleTokens.exitFrom, opacity: 1 },
    to: { scale: scaleTokens.exitTo, opacity: 0 },
  },

  // Slide animations
  slideInUp: {
    duration: durationTokens.slide,
    easing: easingTokens.decelerate,
    from: { translateY: translateTokens.slideUp.from, opacity: 0 },
    to: { translateY: translateTokens.slideUp.to, opacity: 1 },
  },
  slideOutDown: {
    duration: durationTokens.slide,
    easing: easingTokens.accelerate,
    from: { translateY: 0, opacity: 1 },
    to: { translateY: translateTokens.slideUp.from, opacity: 0 },
  },

  // Modal animations
  modalEnter: {
    duration: durationTokens.modal,
    easing: easingTokens.spring,
    from: { scale: scaleTokens.modalEnterFrom, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  },
  modalExit: {
    duration: durationTokens.modal * 0.8,
    easing: easingTokens.easeIn,
    from: { scale: 1, opacity: 1 },
    to: { scale: scaleTokens.modalExitTo, opacity: 0 },
  },

  // Press feedback
  pressIn: {
    duration: durationTokens.ultraFast,
    easing: easingTokens.easeOut,
    scale: scaleTokens.pressed,
  },
  pressOut: {
    duration: durationTokens.fast,
    spring: springTokens.press,
    scale: 1,
  },

  // Skeleton shimmer
  shimmer: {
    duration: durationTokens.skeletonShimmer,
    easing: easingTokens.linear,
    iterationCount: 'infinite' as const,
  },
} as const;

// ============================================================================
// COMBINED MOTION TOKENS EXPORT
// ============================================================================

export const motionTokens = {
  duration: durationTokens,
  easing: easingTokens,
  spring: springTokens,
  scale: scaleTokens,
  opacity: opacityAnimationTokens,
  translate: translateTokens,
  delay: delayTokens,
  presets: animationPresets,
} as const;

export type MotionTokens = typeof motionTokens;
