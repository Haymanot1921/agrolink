// mobile/src/shared/styles/shadows.ts
// Cross-platform shadow presets (iOS shadow + Android elevation).
// Also exports border presets for outlined cards.
//
// ⚠️ Shadows are theme-independent — they use rgba black regardless of mode.
// Dark mode still uses shadows (elevation layering is what users see).

import { Platform, ViewStyle } from 'react-native';

interface ShadowSpec {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

function build(spec: ShadowSpec): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: spec.shadowColor,
      shadowOffset: spec.shadowOffset,
      shadowOpacity: spec.shadowOpacity,
      shadowRadius: spec.shadowRadius,
    },
    android: {
      elevation: spec.elevation,
    },
    default: {
      shadowColor: spec.shadowColor,
      shadowOffset: spec.shadowOffset,
      shadowOpacity: spec.shadowOpacity,
      shadowRadius: spec.shadowRadius,
    },
  }) as ViewStyle;
}

export const shadows = {
  none: build({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  }),
  xs: build({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  }),
  sm: build({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  }),
  md: build({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  }),
  lg: build({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  }),
  xl: build({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  }),
  '2xl': build({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 16,
  }),
} as const;

export type ShadowKey = keyof typeof shadows;

// ─────────────────────────────────────────────────────────────
// Border presets
// ─────────────────────────────────────────────────────────────

export interface BorderPreset {
  borderWidth: number;
  borderColor: string;
}

export function buildBorderPreset(
  color: string,
  width = 1,
): BorderPreset {
  return { borderWidth: width, borderColor: color };
}

/**
 * Common component elevations — deliberately named for semantics.
 * Use these in cards, modals, sheets, FABs.
 */
export const elevations = {
  card: shadows.sm,
  cardElevated: shadows.md,
  floatingButton: shadows.lg,
  modal: shadows.xl,
  sheet: shadows['2xl'],
  dropdown: shadows.md,
  tooltip: shadows.sm,
} as const;