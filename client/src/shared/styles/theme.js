// client/src/shared/styles/theme.js
// Theme object — merges tokens for consumption by ThemeProvider + styled helpers.
// SRS refs: §11.8.

import { colors, chartPalette, categoryPalette } from './colors';
import { fonts, fontSizes, fontWeights, lineHeights, headings, bodyText } from './typography';

const spacing = Object.freeze({
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
});

const radius = Object.freeze({
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
});

const shadow = Object.freeze({
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.07)',
  lg: '0 10px 24px rgba(0,0,0,0.08)',
  xl: '0 20px 60px rgba(0,0,0,0.15)',
});

const motion = Object.freeze({
  duration: { fast: 150, base: 200, slow: 300 },
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
});

const zIndex = Object.freeze({
  base: 1,
  dropdown: 100,
  sticky: 200,
  overlay: 500,
  modal: 1000,
  toast: 1500,
  tooltip: 2000,
});

export const theme = Object.freeze({
  colors,
  chartPalette,
  categoryPalette,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  headings,
  bodyText,
  spacing,
  radius,
  shadow,
  motion,
  zIndex,
  mode: 'light', // overwritten at runtime by ThemeProvider
});

export default theme;