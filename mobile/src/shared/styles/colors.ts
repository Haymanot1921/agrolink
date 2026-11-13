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
// LIGHT PALETTE (ATI-inspired agricultural green with harvest-gold accents)
// ─────────────────────────────────────────────────────────────

export const lightColors: ColorPalette = {
  // Brand
  primary: '#176B45',
  primaryLight: '#E8F2EB',
  primaryDark: '#124A32',
  primaryMuted: '#A6CCB2',
  secondary: '#E9951A',
  secondaryLight: '#FFF3DF',
  secondaryDark: '#B96A0A',

  // Semantic
  success: '#176B45',
  successLight: '#E8F2EB',
  successDark: '#124A32',
  warning: '#B66A08',
  warningLight: '#FFF3DF',
  warningDark: '#945407',
  danger: '#C62828',
  dangerLight: '#FFEBEE',
  dangerDark: '#8E0000',
  info: '#245D78',
  infoLight: '#EAF1F4',
  infoDark: '#1C4B62',

  // Surfaces
  background: '#FFFFFF',
  backgroundAlt: '#F7F8F4',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.45)',
  overlayHeavy: 'rgba(0,0,0,0.7)',

  // Text
  text: '#1D2B22',
  textMuted: '#667269',
  textSubtle: '#879188',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // Borders & dividers
  border: '#E1E7DE',
  borderStrong: '#C7D2C4',
  divider: '#EBEFE9',

  // Inputs
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  inputBorderFocused: '#176B45',
  inputBorderError: '#C62828',
  inputPlaceholder: '#9AA0A6',

  // Status
  statusPending: '#B66A08',
  statusActive: '#245D78',
  statusCompleted: '#176B45',
  statusCancelled: '#757575',
  statusDisputed: '#C62828',
  statusEscalated: '#6A1B9A',

  // Notification
  notification: '#C62828',
  notificationText: '#FFFFFF',

  // Chart series
  chart1: '#176B45',
  chart2: '#7B1FA2',
  chart3: '#E9951A',
  chart4: '#245D78',
  chart5: '#C2185B',
  chart6: '#3B8A72',

  // Shadows
  shadow: '#000000',

  // Actor accents
  actorFarmer: '#176B45',
  actorBuyer: '#245D78',
  actorInputSupplier: '#D78111',
  actorAgriculturalExpert: '#3B8A72',
  actorSupportAgent: '#7B1FA2',
  actorAdministrator: '#37474F',
};

// ─────────────────────────────────────────────────────────────
// DARK PALETTE
// ─────────────────────────────────────────────────────────────

export const darkColors: ColorPalette = {
  // Brand
  primary: '#70C091',
  primaryLight: '#1D392A',
  primaryDark: '#A4DEB8',
  primaryMuted: '#3A7953',
  secondary: '#F1B448',
  secondaryLight: '#3C301C',
  secondaryDark: '#F5C66D',

  // Semantic
  success: '#70C091',
  successLight: '#1D392A',
  successDark: '#A4DEB8',
  warning: '#F1B448',
  warningLight: '#3C301C',
  warningDark: '#F5C66D',
  danger: '#EF5350',
  dangerLight: '#8E0000',
  dangerDark: '#FFCDD2',
  info: '#74B5D0',
  infoLight: '#203642',
  infoDark: '#B8DCE9',

  // Surfaces
  background: '#121915',
  backgroundAlt: '#1B241E',
  card: '#1F2A22',
  cardElevated: '#27332B',
  overlay: 'rgba(0,0,0,0.7)',
  overlayHeavy: 'rgba(0,0,0,0.85)',

  // Text
  text: '#EDF3EE',
  textMuted: '#B1BDB3',
  textSubtle: '#89978C',
  textOnPrimary: '#102419',
  textOnDark: '#FFFFFF',

  // Borders & dividers
  border: '#314035',
  borderStrong: '#4B5A4D',
  divider: '#2A382E',

  // Inputs
  inputBackground: '#1F2A22',
  inputBorder: '#4B5A4D',
  inputBorderFocused: '#70C091',
  inputBorderError: '#EF5350',
  inputPlaceholder: '#757575',

  // Status
  statusPending: '#F1B448',
  statusActive: '#74B5D0',
  statusCompleted: '#70C091',
  statusCancelled: '#9E9E9E',
  statusDisputed: '#EF5350',
  statusEscalated: '#BA68C8',

  // Notification
  notification: '#EF5350',
  notificationText: '#FFFFFF',

  // Chart series
  chart1: '#70C091',
  chart2: '#BA68C8',
  chart3: '#F1B448',
  chart4: '#74B5D0',
  chart5: '#F06292',
  chart6: '#66B6A0',

  // Shadows
  shadow: '#000000',

  // Actor accents
  actorFarmer: '#70C091',
  actorBuyer: '#74B5D0',
  actorInputSupplier: '#F1B448',
  actorAgriculturalExpert: '#66B6A0',
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
export const PRIMARY_BRAND = '#176B45';