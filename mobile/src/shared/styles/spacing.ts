// mobile/src/shared/styles/spacing.ts
// Spacing scale, layout constants, and touch-target minimums.
// SRS refs: NFR-ACCESS-004 (form labels), NFR-USE-005 (mobile-friendly).
//
// All spacing values are in dp. The scale follows a 4pt grid.

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
} as const;

export type SpacingKey = keyof typeof spacing;

// ─────────────────────────────────────────────────────────────
// Layout constants
// ─────────────────────────────────────────────────────────────

export const layout = {
  /** Minimum touch target — WCAG / NFR-ACCESS-004. */
  minTouchTarget: 44,
  /** Standard button height. */
  buttonHeight: 48,
  /** Small button height. */
  buttonHeightSm: 36,
  /** Large button height. */
  buttonHeightLg: 56,
  /** Standard input height. */
  inputHeight: 48,
  /** Tab bar height (excluding safe area). */
  tabBarHeight: 56,
  /** Header height (excluding safe area). */
  headerHeight: 52,
  /** Max content width on tablets. */
  maxContentWidth: 720,
  /** Modal max width (for tablets). */
  modalMaxWidth: 440,
  /** Card border radius. */
  cardRadius: 12,
  /** Button border radius. */
  buttonRadius: 10,
  /** Input border radius. */
  inputRadius: 10,
  /** Pill radius. */
  pillRadius: 999,
  /** Standard hairline. */
  hairline: 0.5,
  /** Standard border width. */
  borderWidth: 1,
  /** Focused border width. */
  focusedBorderWidth: 2,
} as const;

// ─────────────────────────────────────────────────────────────
// Screen padding variants
// ─────────────────────────────────────────────────────────────

export const screenPadding = {
  none: 0,
  compact: spacing.sm,
  normal: spacing.md,
  comfortable: spacing.lg,
  spacious: spacing.xl,
} as const;

// ─────────────────────────────────────────────────────────────
// Card & panel padding
// ─────────────────────────────────────────────────────────────

export const cardPadding = {
  compact: spacing.sm,
  normal: spacing.md,
  comfortable: spacing.lg,
} as const;

// ─────────────────────────────────────────────────────────────
// Gap presets
// ─────────────────────────────────────────────────────────────

export const gap = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
} as const;

// ─────────────────────────────────────────────────────────────
// Common paddings (ready-to-use)
// ─────────────────────────────────────────────────────────────

export const inset = {
  /** Standard content inset (horizontal + vertical). */
  content: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  /** Compact card inset. */
  cardCompact: { padding: spacing.sm },
  /** Standard card inset. */
  card: { padding: spacing.md },
  /** Comfortable card inset. */
  cardComfortable: { padding: spacing.lg },
  /** Section separator. */
  section: { marginVertical: spacing.md },
  /** Screen-level safe padding. */
  screen: { paddingHorizontal: spacing.md },
} as const;

// ─────────────────────────────────────────────────────────────
// Z-index layering (ensures modals, toasts, badges sit correctly)
// ─────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  card: 1,
  dropdown: 100,
  overlay: 500,
  modal: 1000,
  toast: 5000,
  floatingAction: 8000,
} as const;