
/**
 * =========================================================
 * AgroLink Ethiopia
 * File: client/src/shared/styles/typography.js
 *
 * Purpose:
 * Central typography design system.
 *
 * Supports:
 * - English typography
 * - Amharic / Ethiopic typography
 * - Responsive headings
 * - Body text
 * - Dashboard labels
 * - Forms and tables
 * - Numeric and code typography
 *
 * Keep synchronized with:
 * client/src/shared/styles/variables.css
 *
 * SRS References:
 * - §11.8: User Interface Design
 * - NFR-ACCESS-002: Readable interface
 * - NFR-ACCESS-006: English and Amharic support
 * =========================================================
 */


/* =========================================================
   1. FONT FAMILIES
   ========================================================= */

export const fonts = Object.freeze({

  sans:
    "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  ethiopic:
    "'Noto Sans Ethiopic', 'Noto Sans', sans-serif",

  mono:
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",

  system:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
});


/* =========================================================
   2. FONT SIZES
   ========================================================= */

export const fontSizes = Object.freeze({

  xs: 12,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 22,

  '2xl': 28,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
});


/* =========================================================
   3. FONT WEIGHTS
   ========================================================= */

export const fontWeights = Object.freeze({

  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
});


/* =========================================================
   4. LINE HEIGHTS
   ========================================================= */

export const lineHeights = Object.freeze({

  none: 1,

  tight: 1.25,

  normal: 1.5,

  relaxed: 1.7,

  loose: 1.8,
});


/* =========================================================
   5. LETTER SPACING
   ========================================================= */

export const letterSpacing = Object.freeze({

  tighter: '-0.04em',
  tight: '-0.02em',
  normal: '0',
  wide: '0.02em',
  wider: '0.04em',
});


/* =========================================================
   6. HEADING PRESETS
   ========================================================= */

/**
 * Usage:
 *
 * <h1 style={headings.h1}>Dashboard</h1>
 */

export const headings = Object.freeze({

  h1: Object.freeze({
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.extrabold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    margin: 0,
  }),

  h2: Object.freeze({
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    margin: 0,
  }),

  h3: Object.freeze({
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    margin: 0,
  }),

  h4: Object.freeze({
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.normal,
    margin: 0,
  }),

  h5: Object.freeze({
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    margin: 0,
  }),

  h6: Object.freeze({
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    margin: 0,
  }),
});


/* =========================================================
   7. BODY TEXT PRESETS
   ========================================================= */

export const bodyText = Object.freeze({

  base: Object.freeze({
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  }),

  sm: Object.freeze({
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  }),

  xs: Object.freeze({
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  }),

  lg: Object.freeze({
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
  }),
});


/* =========================================================
   8. UI TYPOGRAPHY
   ========================================================= */

/**
 * Reusable typography for dashboard components.
 */

export const uiTypography = Object.freeze({

  button: Object.freeze({
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
  }),

  input: Object.freeze({
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  }),

  label: Object.freeze({
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  }),

  caption: Object.freeze({
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  }),

  tableHeader: Object.freeze({
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
  }),

  tableBody: Object.freeze({
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
  }),

  badge: Object.freeze({
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
  }),

  navigation: Object.freeze({
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  }),
});


/* =========================================================
   9. RESPONSIVE HEADING SIZES
   ========================================================= */

/**
 * These are JavaScript values.
 * For CSS responsiveness, use media queries in typography.css.
 */

export const responsiveHeadings = Object.freeze({

  mobile: Object.freeze({
    h1: 28,
    h2: 24,
    h3: 20,
  }),

  tablet: Object.freeze({
    h1: 32,
    h2: 26,
    h3: 21,
  }),

  desktop: Object.freeze({
    h1: 40,
    h2: 28,
    h3: 22,
  }),
});


/* =========================================================
   10. LANGUAGE FONT HELPER
   ========================================================= */

/**
 * Returns the correct font stack for a language.
 *
 * English:
 * Inter → Noto Sans → system fallback
 *
 * Amharic:
 * Noto Sans Ethiopic → Noto Sans → sans-serif
 */

export function fontFor(lang = 'en') {
  return lang === 'am'
    ? fonts.ethiopic
    : fonts.sans;
}


/* =========================================================
   11. LANGUAGE TYPOGRAPHY HELPER
   ========================================================= */

export function typographyFor(lang = 'en') {

  return Object.freeze({

    fontFamily: fontFor(lang),

    lineHeight:
      lang === 'am'
        ? lineHeights.relaxed
        : lineHeights.normal,

  });
}


/* =========================================================
   12. DEFAULT EXPORT
   ========================================================= */

const typography = Object.freeze({

  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,

  headings,
  bodyText,
  uiTypography,

  responsiveHeadings,

  fontFor,
  typographyFor,
});

export default typography;
