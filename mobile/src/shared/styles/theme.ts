// mobile/src/shared/styles/theme.ts
// The unified theme object — combines colors, typography, spacing,
// shadows, layout, z-index, and actor accents into one contract.
//
// Every screen accesses theme via useTheme() — never imports tokens directly.

import type { ColorPalette } from './colors';
import { lightColors, darkColors } from './colors';
import {
  fontSize as fontSizeScale,
  lineHeight as lineHeightScale,
  fontWeight as fontWeightScale,
  letterSpacing as letterSpacingScale,
  textStyles,
  FONT_FAMILY,
  pickFontFamily,
} from './typography';
import { spacing as spacingScale, layout, zIndex as zIndexScale, screenPadding } from './spacing';
import { shadows as shadowScale, elevations as elevationScale, type ShadowKey } from './shadows';

export type ThemeMode = 'light' | 'dark';

export type ActorAccent =
  | 'farmer'
  | 'buyer'
  | 'inputSupplier'
  | 'agriculturalExpert'
  | 'supportAgent'
  | 'administrator';

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: ColorPalette;
  typography: {
    fontSize: typeof fontSizeScale;
    lineHeight: typeof lineHeightScale;
    fontWeight: typeof fontWeightScale;
    letterSpacing: typeof letterSpacingScale;
    textStyles: typeof textStyles;
    fontFamily: typeof FONT_FAMILY;
    pickFontFamily: typeof pickFontFamily;
  };
  spacing: typeof spacingScale;
  screenPadding: typeof screenPadding;
  layout: typeof layout;
  shadows: typeof shadowScale;
  elevations: typeof elevationScale;
  zIndex: typeof zIndexScale;
  /** Accent colors by actor (used in drawers, role selectors, dashboards). */
  actorAccents: Record<ActorAccent, string>;
  /** Current actor accent (only set when the user is logged in). */
  actorAccent: string;
}

// ─────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────

export function buildTheme(mode: ThemeMode, actor?: ActorAccent | null): Theme {
  const colors = mode === 'dark' ? darkColors : lightColors;
  const actorAccents: Record<ActorAccent, string> = {
    farmer: colors.actorFarmer,
    buyer: colors.actorBuyer,
    inputSupplier: colors.actorInputSupplier,
    agriculturalExpert: colors.actorAgriculturalExpert,
    supportAgent: colors.actorSupportAgent,
    administrator: colors.actorAdministrator,
  };

  return {
    mode,
    isDark: mode === 'dark',
    colors,
    typography: {
      fontSize: fontSizeScale,
      lineHeight: lineHeightScale,
      fontWeight: fontWeightScale,
      letterSpacing: letterSpacingScale,
      textStyles,
      fontFamily: FONT_FAMILY,
      pickFontFamily,
    },
    spacing: spacingScale,
    screenPadding,
    layout,
    shadows: shadowScale,
    elevations: elevationScale,
    zIndex: zIndexScale,
    actorAccents,
    actorAccent: actor ? actorAccents[actor] : colors.primary,
  };
}

// ─────────────────────────────────────────────────────────────
// Pre-built themes (for SSR / theme default)
// ─────────────────────────────────────────────────────────────

export const lightTheme: Theme = buildTheme('light');
export const darkTheme: Theme = buildTheme('dark');

/** Convenience: pick a theme by mode name. */
export function getTheme(mode: ThemeMode, actor?: ActorAccent | null): Theme {
  return buildTheme(mode, actor);
}

/** Map an AuthUser.role + providerType to an ActorAccent. */
export function actorAccentFor(
  role: string | undefined,
  providerType?: string | null,
): ActorAccent | null {
  if (role === 'farmer') return 'farmer';
  if (role === 'buyer') return 'buyer';
  if (role === 'service_provider') {
    return providerType === 'input_supplier' ? 'inputSupplier' : 'agriculturalExpert';
  }
  if (role === 'support_agent') return 'supportAgent';
  if (role === 'administrator') return 'administrator';
  return null;
}

// Re-export ShadowKey for consumers
export type { ShadowKey };