// client/src/shared/styles/typography.js
// Typography scale — mirrored in variables.css. Use for programmatic rendering.
// SRS refs: §11.8, NFR-ACCESS-002.

export const fonts = Object.freeze({
  sans: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  ethiopic: "'Noto Sans Ethiopic', 'Noto Sans', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
});

export const fontSizes = Object.freeze({
  xs: 12,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 32,
});

export const fontWeights = Object.freeze({
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
});

export const lineHeights = Object.freeze({
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.7,
});

/**
 * Heading style presets — use in components that render dynamic headings.
 * @example <h1 style={headings.h1}>Title</h1>
 */
export const headings = Object.freeze({
  h1: { fontSize: fontSizes['3xl'], fontWeight: fontWeights.extrabold, lineHeight: lineHeights.tight, margin: 0 },
  h2: { fontSize: fontSizes['2xl'], fontWeight: fontWeights.bold, lineHeight: lineHeights.tight, margin: 0 },
  h3: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, lineHeight: lineHeights.tight, margin: 0 },
  h4: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, lineHeight: lineHeights.tight, margin: 0 },
  h5: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, lineHeight: lineHeights.normal, margin: 0 },
  h6: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, lineHeight: lineHeights.normal, margin: 0 },
});

/**
 * Body text presets.
 */
export const bodyText = Object.freeze({
  base: { fontSize: fontSizes.base, lineHeight: lineHeights.normal },
  sm: { fontSize: fontSizes.sm, lineHeight: lineHeights.normal },
  xs: { fontSize: fontSizes.xs, lineHeight: lineHeights.normal },
});

/**
 * Font family helper — returns correct font stack for a language.
 */
export function fontFor(lang) {
  return lang === 'am' ? fonts.ethiopic : fonts.sans;
}