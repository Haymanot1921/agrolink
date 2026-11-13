
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

  primary: '#176B45',
  primaryHover: '#125638',
  primaryActive: '#0D452D',
  primaryLight: '#E8F2EB',
  primarySubtle: '#F3F7F2',
  primaryDark: '#124A32',

  secondary: '#245D78',
  secondaryHover: '#1C4B62',
  secondaryLight: '#EAF1F4',

  accent: '#E9951A',
  accentHover: '#C7770D',
  accentLight: '#FFF3DF',


  /* Semantic: Danger */

  danger: '#DC4545',
  dangerHover: '#BE3434',
  dangerLight: '#FCEAEA',


  /* Semantic: Warning */

  warning: '#B66A08',
  warningHover: '#945407',
  warningLight: '#FFF3DF',


  /* Semantic: Success */

  success: '#25834A',
  successHover: '#1D693A',
  successLight: '#E5F4E9',


  /* Semantic: Information */

  info: '#2878C8',
  infoHover: '#1F65AA',
  infoLight: '#EAF3FC',


  /* Neutral surfaces */

  bg: '#F7F8F4',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  surface2: '#F1F4EF',

  border: '#E1E7DE',
  borderStrong: '#C7D2C4',

  /* Text */

  text: '#1D2B22',
  textMuted: '#667269',
  textSubtle: '#879188',

  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  textOnAccent: '#19251C',


  /* Status colors */

  status: Object.freeze({
    active: '#176B45',
    pending: '#B66A08',
    suspended: '#DC4545',

    published: '#176B45',
    rejected: '#DC4545',

    completed: '#176B45',
    cancelled: '#DC4545',

    disputed: '#B66A08',
    draft: '#879489',
    inactive: '#879489',
    processing: '#245D78',
  }),


  /* Interaction states */

  interaction: Object.freeze({
    focus: '#245D78',
    selected: '#E8F2EB',
    hover: '#F1F4EF',
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
  '#176B45', // Agricultural green
  '#245D78', // Technology blue
  '#E9951A', // Harvest gold
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

  primary: '#70C091',
  primaryHover: '#8BD2A7',
  primaryActive: '#A4DEB8',
  primaryLight: '#1D392A',
  primarySubtle: '#192C21',
  primaryDark: '#A4DEB8',

  secondary: '#74B5D0',
  secondaryHover: '#93C7DB',
  secondaryLight: '#203642',

  accent: '#F1B448',
  accentHover: '#F5C66D',
  accentLight: '#3C301C',


  /* Semantic */

  danger: '#F07878',
  dangerHover: '#F58C8C',
  dangerLight: '#492B2B',

  warning: '#F1B448',
  warningHover: '#F5C66D',
  warningLight: '#3C301C',

  success: '#70C091',
  successHover: '#8BD2A7',
  successLight: '#1D392A',

  info: '#74B5D0',
  infoHover: '#93C7DB',
  infoLight: '#203642',


  /* Surfaces */

  bg: '#121915',
  card: '#1B241E',
  surface: '#1F2A22',
  surface2: '#27332B',

  border: '#314035',
  borderStrong: '#4B5A4D',


  /* Text */

  text: '#EDF3EE',
  textMuted: '#B1BDB3',
  textSubtle: '#89978C',

  textOnPrimary: '#102416',
  textOnSecondary: '#102033',
  textOnAccent: '#29200E',


  /* Statuses */

  status: Object.freeze({
    active: '#70C091',
    pending: '#F1B448',
    suspended: '#F07878',

    published: '#70C091',
    rejected: '#F07878',

    completed: '#70C091',
    cancelled: '#F07878',

    disputed: '#F1B448',
    draft: '#89998D',
    inactive: '#89998D',
    processing: '#74B5D0',
  }),

  interaction: Object.freeze({
    focus: '#74B5D0',
    selected: '#1D392A',
    hover: '#27332B',
    disabled: '#657267',
  }),
});


/* =========================================================
   6. DEFAULT EXPORT
   ========================================================= */

export default colors;
