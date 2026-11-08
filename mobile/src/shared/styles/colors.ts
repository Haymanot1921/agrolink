// mobile/src/shared/styles/colors.ts
// Full color palette — brand + semantic + surface + text.
// Contrast ratios meet WCAG AA per NFR-ACCESS-001.
//
// ⚠️ Every UI element references tokens from here. No raw hex codes elsewhere.
// Dark mode palettes are pre-defined per token (theme.ts selects them).

export interface ColorPalette {
  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryMuted: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Semantic
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  danger: string;
  dangerLight: string;
  dangerDark: string;
  info: string;
  infoLight: string;
  infoDark: string;

  // Surfaces
  background: string;
  backgroundAlt: string;
  card: string;
  cardElevated: string;
  overlay: string;
  overlayHeavy: string;

  // Text
  text: string;
  textMuted: string;
  textSubtle: string;
  textOnPrimary: string;
  textOnDark: string;

  // Borders & dividers
  border: string;
  borderStrong: string;
  divider: string;

  // Inputs
  inputBackground: string;
  inputBorder: string;
  inputBorderFocused: string;
  inputBorderError: string;
  inputPlaceholder: string;

  // Status (used by StatusBadge)
  statusPending: string;
  statusActive: string;
  statusCompleted: string;
  statusCancelled: string;
  statusDisputed: string;
  statusEscalated: string;

  // Notification
  notification: string;
  notificationText: string;

  // Chart series (dashboard charts)
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;

  // Shadows
  shadow: string;

  // Actor accents (subtle per-actor theming)
  actorFarmer: string;
  actorBuyer: string;
  actorInputSupplier: string;
  actorAgriculturalExpert: string;
  actorSupportAgent: string;
  actorAdministrator: string;
}

// ─────────────────────────────────────────────────────────────
// LIGHT PALETTE (primary brand — AgroLink green)
// ─────────────────────────────────────────────────────────────

export const lightColors: ColorPalette = {
  // Brand
  primary: '#2E7D32',
  primaryLight: '#E8F5E9',
  primaryDark: '#1B5E20',
  primaryMuted: '#A5D6A7',
  secondary: '#F9A825',
  secondaryLight: '#FFF8E1',
  secondaryDark: '#F57F17',

  // Semantic
  success: '#2E7D32',
  successLight: '#E8F5E9',
  successDark: '#1B5E20',
  warning: '#F9A825',
  warningLight: '#FFF8E1',
  warningDark: '#F57F17',
  danger: '#C62828',
  dangerLight: '#FFEBEE',
  dangerDark: '#8E0000',
  info: '#1976D2',
  infoLight: '#E3F2FD',
  infoDark: '#0D47A1',

  // Surfaces
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F5',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.45)',
  overlayHeavy: 'rgba(0,0,0,0.7)',

  // Text
  text: '#1B1B1B',
  textMuted: '#5F6368',
  textSubtle: '#9AA0A6',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // Borders & dividers
  border: '#E0E0E0',
  borderStrong: '#BDBDBD',
  divider: '#EEEEEE',

  // Inputs
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputBorderFocused: '#2E7D32',
  inputBorderError: '#C62828',
  inputPlaceholder: '#9AA0A6',

  // Status
  statusPending: '#F9A825',
  statusActive: '#1976D2',
  statusCompleted: '#2E7D32',
  statusCancelled: '#757575',
  statusDisputed: '#C62828',
  statusEscalated: '#6A1B9A',

  // Notification
  notification: '#C62828',
  notificationText: '#FFFFFF',

  // Chart series
  chart1: '#2E7D32',
  chart2: '#7B1FA2',
  chart3: '#F9A825',
  chart4: '#1976D2',
  chart5: '#C2185B',
  chart6: '#00796B',

  // Shadows
  shadow: '#000000',

  // Actor accents
  actorFarmer: '#2E7D32',
  actorBuyer: '#1976D2',
  actorInputSupplier: '#F57C00',
  actorAgriculturalExpert: '#00796B',
  actorSupportAgent: '#7B1FA2',
  actorAdministrator: '#37474F',
};

// ─────────────────────────────────────────────────────────────
// DARK PALETTE
// ─────────────────────────────────────────────────────────────

export const darkColors: ColorPalette = {
  // Brand
  primary: '#66BB6A',
  primaryLight: '#1B5E20',
  primaryDark: '#A5D6A7',
  primaryMuted: '#2E7D32',
  secondary: '#FFCA28',
  secondaryLight: '#F57F17',
  secondaryDark: '#FFE082',

  // Semantic
  success: '#66BB6A',
  successLight: '#1B5E20',
  successDark: '#A5D6A7',
  warning: '#FFCA28',
  warningLight: '#F57F17',
  warningDark: '#FFE082',
  danger: '#EF5350',
  dangerLight: '#8E0000',
  dangerDark: '#FFCDD2',
  info: '#64B5F6',
  infoLight: '#0D47A1',
  infoDark: '#BBDEFB',

  // Surfaces
  background: '#121212',
  backgroundAlt: '#1E1E1E',
  card: '#1E1E1E',
  cardElevated: '#2C2C2C',
  overlay: 'rgba(0,0,0,0.7)',
  overlayHeavy: 'rgba(0,0,0,0.85)',

  // Text
  text: '#F5F5F5',
  textMuted: '#B0B0B0',
  textSubtle: '#757575',
  textOnPrimary: '#0D0D0D',
  textOnDark: '#FFFFFF',

  // Borders & dividers
  border: '#2C2C2C',
  borderStrong: '#424242',
  divider: '#1F1F1F',

  // Inputs
  inputBackground: '#1E1E1E',
  inputBorder: '#424242',
  inputBorderFocused: '#66BB6A',
  inputBorderError: '#EF5350',
  inputPlaceholder: '#757575',

  // Status
  statusPending: '#FFCA28',
  statusActive: '#64B5F6',
  statusCompleted: '#66BB6A',
  statusCancelled: '#9E9E9E',
  statusDisputed: '#EF5350',
  statusEscalated: '#BA68C8',

  // Notification
  notification: '#EF5350',
  notificationText: '#FFFFFF',

  // Chart series
  chart1: '#66BB6A',
  chart2: '#BA68C8',
  chart3: '#FFCA28',
  chart4: '#64B5F6',
  chart5: '#F06292',
  chart6: '#4DB6AC',

  // Shadows
  shadow: '#000000',

  // Actor accents
  actorFarmer: '#66BB6A',
  actorBuyer: '#64B5F6',
  actorInputSupplier: '#FFB74D',
  actorAgriculturalExpert: '#4DB6AC',
  actorSupportAgent: '#BA68C8',
  actorAdministrator: '#90A4AE',
};

/**
 * Backward-compatible export — some components import `colors` directly.
 * Defaults to the light palette. `useTheme()` should be preferred for
 * new code so dark mode works correctly.
 */
export const colors = lightColors;

/** Primary brand color for use in native contexts (map style, splash). */
export const PRIMARY_BRAND = '#2E7D32';