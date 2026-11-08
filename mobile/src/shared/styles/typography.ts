// mobile/src/shared/styles/typography.ts
// Font sizes, line heights, weights, and font-family pickers.
// Supports English (NotoSans) and Amharic (NotoSansEthiopic) per FR-ACCESS-006.
//
// ⚠️ Font files must be loaded in app bootstrap (`loadAssets.ts`).
// If they aren't loaded, RN falls back to the system font — expect visual shifts.

import { Platform } from 'react-native';

// ─────────────────────────────────────────────────────────────
// Font families — loaded via expo-font in app bootstrap
// ─────────────────────────────────────────────────────────────

export const FONT_FAMILY = {
  regular: 'NotoSans-Regular',
  bold: 'NotoSans-Bold',
  ethiopicRegular: 'NotoSansEthiopic-Regular',
  ethiopicBold: 'NotoSansEthiopic-Bold',
  /** System fallbacks when custom fonts fail to load. */
  systemRegular: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'system-ui',
  }) as string,
  systemBold: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'system-ui',
  }) as string,
} as const;

/**
 * Pick the correct font family for a given language + weight.
 * English → NotoSans; Amharic → NotoSansEthiopic.
 */
export function pickFontFamily(
  language: 'en' | 'am' | string,
  weight: 'regular' | 'bold' = 'regular',
): string {
  if (language === 'am') {
    return weight === 'bold' ? FONT_FAMILY.ethiopicBold : FONT_FAMILY.ethiopicRegular;
  }
  return weight === 'bold' ? FONT_FAMILY.bold : FONT_FAMILY.regular;
}

// ─────────────────────────────────────────────────────────────
// Font sizes (in dp)
// ─────────────────────────────────────────────────────────────

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 40,
} as const;

// ─────────────────────────────────────────────────────────────
// Line heights — tuned for readability (NFR-ACCESS-002)
// ─────────────────────────────────────────────────────────────

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 22,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 42,
  '5xl': 48,
} as const;

// ─────────────────────────────────────────────────────────────
// Font weights
// ─────────────────────────────────────────────────────────────

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// ─────────────────────────────────────────────────────────────
// Letter spacing (tracking)
// ─────────────────────────────────────────────────────────────

export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// ─────────────────────────────────────────────────────────────
// Pre-built text styles (used by every screen)
// ─────────────────────────────────────────────────────────────

export interface TextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
  letterSpacing?: number;
}

export const textStyles = {
  displayLarge: {
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['5xl'],
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,
  display: {
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,
  h1: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    fontWeight: fontWeight.bold,
  } as TextStyle,
  h2: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    fontWeight: fontWeight.bold,
  } as TextStyle,
  h3: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: fontWeight.bold,
  } as TextStyle,
  h4: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  bodyLarge: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.regular,
  } as TextStyle,
  body: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.regular,
  } as TextStyle,
  bodySmall: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.regular,
  } as TextStyle,
  caption: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,
  label: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  button: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.bold,
  } as TextStyle,
  buttonSmall: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.bold,
  } as TextStyle,
} as const;

/**
 * Backward-compatible export for components that import `typography` directly.
 * Maps old keys to the new font-size scale.
 */
export const typography = fontSize;

/**
 * Text scaling helpers — respects user's accessibility font settings.
 * Uses RN's default font scaling unless the component opts out.
 */
export const textScaleConfig = {
  /** Components that show numbers or code should set allowFontScaling=false. */
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.5,
} as const;