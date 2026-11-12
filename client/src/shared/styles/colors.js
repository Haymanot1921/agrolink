// client/src/shared/styles/colors.js
// JS access to design tokens — for charts, canvas, inline styles.
// Keep in sync with variables.css. Single source for programmatic colors.
// SRS refs: §11.8, NFR-USE-007.

export const colors = Object.freeze({
  // Brand
  primary: '#2E7D32',
  primaryHover: '#1B5E20',
  primaryLight: '#E8F5E9',
  primaryDark: '#1B5E20',

  secondary: '#1565C0',
  secondaryHover: '#0D47A1',
  secondaryLight: '#E3F2FD',

  // Semantic
  danger: '#DC2626',
  dangerHover: '#B91C1C',
  dangerLight: '#FEE2E2',

  warning: '#F59E0B',
  warningHover: '#D97706',
  warningLight: '#FEF3C7',

  success: '#16A34A',
  successHover: '#15803D',
  successLight: '#DCFCE7',

  info: '#0EA5E9',
  infoHover: '#0284C7',
  infoLight: '#E0F2FE',

  // Surfaces
  bg: '#F5F7FA',
  card: '#FFFFFF',
  surface: '#F5F7FA',
  surface2: '#EEF1F5',
  border: '#E0E0E0',
  borderStrong: '#C4C4C4',

  // Text
  text: '#1B1B1B',
  textMuted: '#5F6368',
  textSubtle: '#9AA0A6',
  textOnPrimary: '#FFFFFF',

  // Statuses (used by StatusBadge + charts)
  status: {
    active: '#16A34A',
    pending: '#F59E0B',
    suspended: '#DC2626',
    published: '#16A34A',
    rejected: '#DC2626',
    completed: '#16A34A',
    cancelled: '#DC2626',
    disputed: '#F59E0B',
  },
});

/**
 * Chart color palette — 8-color accessible sequence.
 * Used by LineChart / BarChart / PieChart / AreaChart defaults.
 */
export const chartPalette = Object.freeze([
  '#2E7D32', // green
  '#1565C0', // blue
  '#F59E0B', // amber
  '#DC2626', // red
  '#7C3AED', // purple
  '#0891B2', // cyan
  '#EA580C', // orange
  '#4F46E5', // indigo
]);

/**
 * Category color palette for pie charts (moderation, disputes).
 */
export const categoryPalette = Object.freeze({
  draft: '#9AA0A6',
  pending_review: '#F59E0B',
  published: '#16A34A',
  rejected: '#DC2626',
  inactive: '#6B7280',
  sold_out: '#0EA5E9',
});

export default colors;