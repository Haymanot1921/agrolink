// mobile/src/shared/utils/responsive.ts
// Responsive design helpers — breakpoints, scaling, safe proportions.
// SRS refs: §11.7 mobile-friendly, NFR-USE-005, NFR-COMP-002.

import { Dimensions, PixelRatio, Platform } from 'react-native';

// Design reference (iPhone 11 baseline)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DeviceClass = 'small-phone' | 'phone' | 'large-phone' | 'tablet';

// ─────────────────────────────────────────────────────────────
// Breakpoints — mobile-first
// ─────────────────────────────────────────────────────────────

export const breakpoints = {
  xs: 0,
  sm: 360,   // small phones
  md: 400,   // standard phones
  lg: 768,   // tablets (portrait)
  xl: 1024,  // tablets (landscape)
} as const;

export function currentBreakpoint(width?: number): Breakpoint {
  const w = width ?? Dimensions.get('window').width;
  if (w >= breakpoints.xl) return 'xl';
  if (w >= breakpoints.lg) return 'lg';
  if (w >= breakpoints.md) return 'md';
  if (w >= breakpoints.sm) return 'sm';
  return 'xs';
}

export function currentDeviceClass(): DeviceClass {
  const { width } = Dimensions.get('window');
  if (width >= 768) return 'tablet';
  if (width >= 400) return 'large-phone';
  if (width >= 360) return 'phone';
  return 'small-phone';
}

export function isTablet(): boolean {
  return currentDeviceClass() === 'tablet';
}

export function isSmallPhone(): boolean {
  return currentDeviceClass() === 'small-phone';
}

// ─────────────────────────────────────────────────────────────
// Scaling helpers — respect user font-size preferences
// ─────────────────────────────────────────────────────────────

export function wp(percent: number): number {
  return (Dimensions.get('window').width * percent) / 100;
}

export function hp(percent: number): number {
  return (Dimensions.get('window').height * percent) / 100;
}

export function scale(size: number): number {
  const ratio = Dimensions.get('window').width / BASE_WIDTH;
  return Math.round(size * ratio);
}

export function verticalScale(size: number): number {
  const ratio = Dimensions.get('window').height / BASE_HEIGHT;
  return Math.round(size * ratio);
}

export function moderateScale(size: number, factor = 0.5): number {
  return Math.round(size + (scale(size) - size) * factor);
}

/** Font scaling that respects user accessibility preferences (max cap). */
export function fontScale(size: number, max = 1.4): number {
  const userScale = PixelRatio.getFontScale();
  const clamped = Math.min(userScale, max);
  return Math.round(size * clamped);
}

// ─────────────────────────────────────────────────────────────
// Value pickers per breakpoint
// ─────────────────────────────────────────────────────────────

export function pickByBreakpoint<T>(values: Partial<Record<Breakpoint, T>>, fallback: T): T {
  const bp = currentBreakpoint();
  const order: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
  const startIdx = order.indexOf(bp);
  for (let i = startIdx; i < order.length; i++) {
    const key = order[i]!;
    if (values[key] !== undefined) return values[key]!;
  }
  return fallback;
}

// ─────────────────────────────────────────────────────────────
// Layout helpers
// ─────────────────────────────────────────────────────────────

/** Ideal number of columns for a card grid. */
export function gridColumns(cardWidth = 160, gap = 12, padding = 16): number {
  const { width } = Dimensions.get('window');
  const usable = width - padding * 2 + gap;
  return Math.max(1, Math.floor(usable / (cardWidth + gap)));
}

/** Compute card width for a grid with given columns. */
export function gridCardWidth(columns: number, gap = 12, padding = 16): number {
  const { width } = Dimensions.get('window');
  const usable = width - padding * 2 - gap * (columns - 1);
  return Math.floor(usable / columns);
}

/** Safe top padding fallback (when safe-area-context not available). */
export function defaultTopInset(): number {
  return Platform.OS === 'ios' ? 44 : 24;
}

/** Listen for dimension changes — used by useResponsive hook. */
export function subscribeDimensions(
  callback: (dims: { width: number; height: number }) => void,
): () => void {
  const sub = Dimensions.addEventListener('change', ({ window }) => {
    callback({ width: window.width, height: window.height });
  });
  return () => sub.remove();
}

/** Convenience object for theme-level layouts. */
export const responsive = {
  breakpoints,
  currentBreakpoint,
  currentDeviceClass,
  isTablet,
  isSmallPhone,
  wp,
  hp,
  scale,
  verticalScale,
  moderateScale,
  fontScale,
  pickByBreakpoint,
  gridColumns,
  gridCardWidth,
  defaultTopInset,
  subscribeDimensions,
};