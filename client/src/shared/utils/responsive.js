// client/src/shared/utils/responsive.js
// Breakpoint constants + media-query helpers.
// SRS refs: NFR-USE-005 (mobile-friendly), NFR-ACCESS-002 (readable on mobile).

export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Simple media-query string builder.
 * @example mq('min', 'md') → '(min-width: 768px)'
 */
export function mq(direction, breakpoint) {
  const px = BREAKPOINTS[breakpoint];
  if (px == null) return '';
  return direction === 'max' ? `(max-width: ${px - 1}px)` : `(min-width: ${px}px)`;
}

/**
 * Return the current device bucket (client-only, SSR-safe).
 * @returns {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'}
 */
export function getDeviceBucket() {
  if (typeof window === 'undefined') return 'lg';
  const w = window.innerWidth;
  if (w >= BREAKPOINTS['2xl']) return '2xl';
  if (w >= BREAKPOINTS.xl) return 'xl';
  if (w >= BREAKPOINTS.lg) return 'lg';
  if (w >= BREAKPOINTS.md) return 'md';
  if (w >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

export function isMobile() {
  return ['xs', 'sm'].includes(getDeviceBucket());
}

export function isTablet() {
  return getDeviceBucket() === 'md';
}

export function isDesktop() {
  return ['lg', 'xl', '2xl'].includes(getDeviceBucket());
}

/**
 * Responsive value picker.
 * @example pickResponsive({ xs: 1, md: 2, lg: 3 }) → 2 (on md screen)
 */
export function pickResponsive(map) {
  const bucket = getDeviceBucket();
  const order = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const startIdx = order.indexOf(bucket);
  for (let i = startIdx; i < order.length; i++) {
    if (map[order[i]] !== undefined) return map[order[i]];
  }
  return undefined;
}

/**
 * Grid column count based on screen — used by product/card grids.
 */
export function autoColumns({ minWidth = 220, max = 5 } = {}) {
  if (typeof window === 'undefined') return 3;
  return Math.max(1, Math.min(max, Math.floor(window.innerWidth / minWidth)));
}