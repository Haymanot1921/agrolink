
/**
 * =========================================================
 * AgroLink Ethiopia
 * File: client/src/shared/styles/colors.js
 *
 * Purpose:
 * Central JavaScript color tokens for:
 * - Charts and data visualization
 * - Inline styles
 * - Status badges
 * - Shared UI components
 * - Marketplace categories
 *
 * Keep synchronized with:
 * client/src/shared/styles/variables.css
 *
 * SRS References:
 * - §11.8: User Interface Design
 * - NFR-USE-007: Consistent user interface
 * =========================================================
 */


/* =========================================================
   1. BRAND AND SEMANTIC COLORS
   ========================================================= */

export const colors = Object.freeze({

  /* Brand */

  primary: '#246B3A',
  primaryHover: '#1D572F',
  primaryActive: '#17452B',
  primaryLight: '#E8F3EA',
  primarySubtle: '#F2F8F3',
  primaryDark: '#17452B',

  secondary: '#2878C8',
  secondaryHover: '#1F65AA',
  secondaryLight: '#EAF3FC',

  accent: '#F2B544',
  accentHover: '#DFA02C',
  accentLight: '#FFF5DF',


  /* Semantic: Danger */

  danger: '#DC4545',
  dangerHover: '#BE3434',
  dangerLight: '#FCEAEA',


  /* Semantic: Warning */

  warning: '#D99520',
  warningHover: '#B97913',
  warningLight: '#FFF3D9',


  /* Semantic: Success */

  success: '#25834A',
  successHover: '#1D693A',
  successLight: '#E5F4E9',


  /* Semantic: Information */

  info: '#2878C8',
  infoHover: '#1F65AA',
  infoLight: '#EAF3FC',


  /* Neutral surfaces */

  bg: '#F5F8F4',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#F0F4EF',

  border: '#E1E8DF',
  borderStrong: '#C7D2C5',

  /* Text */

  text: '#19251C',
  textMuted: '#657267',
  textSubtle: '#879489',

  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  textOnAccent: '#19251C',


  /* Status colors */

  status: Object.freeze({
    active: '#25834A',
    pending: '#D99520',
    suspended: '#DC4545',

    published: '#25834A',
    rejected: '#DC4545',

    completed: '#25834A',
    cancelled: '#DC4545',

    disputed: '#D99520',
    draft: '#879489',
    inactive: '#879489',
    processing: '#2878C8',
  }),


  /* Interaction states */

  interaction: Object.freeze({
    focus: '#2878C8',
    selected: '#E8F3EA',
    hover: '#F0F4EF',
    disabled: '#A0AAA1',
  }),
});


/* =========================================================
   2. CHART COLOR PALETTE
   ========================================================= */

/**
 * Eight-color palette for:
 * - LineChart
 * - BarChart
 * - PieChart
 * - AreaChart
 * - Dashboard analytics
 *
 * The palette combines brand and supporting colors.
 */

export const chartPalette = Object.freeze([
  '#246B3A', // Agricultural green
  '#2878C8', // Technology blue
  '#F2B544', // Harvest gold
  '#DC4545', // Red
  '#7956A8', // Purple
  '#168A91', // Teal
  '#D97732', // Orange
  '#5268B5', // Indigo
]);


/* =========================================================
   3. PRODUCT CATEGORY COLORS
   ========================================================= */

/**
 * Used by:
 * - Marketplace category cards
 * - Product category charts
 * - Product analytics
 */

export const categoryPalette = Object.freeze({

  grains: '#D99520',
  vegetables: '#25834A',
  fruits: '#DC7045',

  legumes: '#8A6A3E',
  coffee: '#795548',
  livestock: '#8B5E83',

  dairy: '#2878C8',
  seeds: '#6B8E23',
  fertilizers: '#168A91',

  equipment: '#5268B5',
  other: '#879489',
});


/* =========================================================
   4. CONTENT AND MODERATION COLORS
   ========================================================= */

/**
 * Used by:
 * - Product moderation
 * - Content publishing
 * - Administrative dashboards
 */

export const moderationPalette = Object.freeze({

  draft: '#879489',
  pending_review: '#D99520',
  published: '#25834A',
  rejected: '#DC4545',

  inactive: '#879489',
  sold_out: '#2878C8',

  flagged: '#D97732',
  under_review: '#7956A8',
});


/* =========================================================
   5. DARK THEME COLORS
   ========================================================= */

/**
 * These are JavaScript equivalents of the dark-theme
 * values defined in variables.css.
 *
 * ThemeProvider can select this palette when dark mode
 * is active.
 */

export const darkColors = Object.freeze({

  /* Brand */

  primary: '#63B878',
  primaryHover: '#79C88C',
  primaryActive: '#4D9D64',
  primaryLight: '#243D2C',
  primarySubtle: '#1D3023',
  primaryDark: '#4D9D64',

  secondary: '#65A9ED',
  secondaryHover: '#85BBF2',
  secondaryLight: '#24384E',

  accent: '#F5C566',
  accentHover: '#F8D48A',
  accentLight: '#44371F',


  /* Semantic */

  danger: '#F07878',
  dangerHover: '#F58C8C',
  dangerLight: '#492B2B',

  warning: '#F0BD5D',
  warningHover: '#F5CC7D',
  warningLight: '#44391F',

  success: '#63B878',
  successHover: '#79C88C',
  successLight: '#243D2C',

  info: '#65A9ED',
  infoHover: '#85BBF2',
  infoLight: '#24384E',


  /* Surfaces */

  bg: '#111713',
  card: '#1A221C',
  surface: '#1E2821',
  surface2: '#263129',

  border: '#303D33',
  borderStrong: '#465649',


  /* Text */

  text: '#EDF4EE',
  textMuted: '#B0BDB2',
  textSubtle: '#89998D',

  textOnPrimary: '#102416',
  textOnSecondary: '#102033',
  textOnAccent: '#29200E',


  /* Statuses */

  status: Object.freeze({
    active: '#63B878',
    pending: '#F0BD5D',
    suspended: '#F07878',

    published: '#63B878',
    rejected: '#F07878',

    completed: '#63B878',
    cancelled: '#F07878',

    disputed: '#F0BD5D',
    draft: '#89998D',
    inactive: '#89998D',
    processing: '#65A9ED',
  }),

  interaction: Object.freeze({
    focus: '#65A9ED',
    selected: '#243D2C',
    hover: '#263129',
    disabled: '#657267',
  }),
});


/* =========================================================
   6. DEFAULT EXPORT
   ========================================================= */

export default colors;
