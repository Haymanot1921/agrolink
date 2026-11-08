// mobile/src/shared/utils/currencyFormatter.ts
// ETB currency formatting + numeric helpers.
// SRS refs: FR-ACCESS-006, §5.4 FR-MARKET-002, §5.7 FR-ORDER-003 (price lock),
//           FR-ORDER-011 (backend computes totals — client is display-only).

import i18n from '@i18n/index';

type Locale = 'en' | 'am';

function currentLocale(): Locale {
  return (i18n.language as Locale) ?? 'en';
}

export function formatCurrency(
  amount: number | string | null | undefined,
  options: { locale?: Locale; showCurrency?: boolean; decimals?: number } = {},
): string {
  const {
    locale = currentLocale(),
    showCurrency = true,
    decimals = 2,
  } = options;
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (value === null || value === undefined || Number.isNaN(value)) {
    return showCurrency ? (locale === 'am' ? 'ብር —' : 'ETB —') : '—';
  }

  const formatted = new Intl.NumberFormat(locale === 'am' ? 'am-ET' : 'en-ET', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  if (!showCurrency) return formatted;
  return locale === 'am' ? `ብር ${formatted}` : `ETB ${formatted}`;
}

/** Compact display: 1.2K, 3.4M. */
export function formatCompactCurrency(amount: number, locale: Locale = currentLocale()): string {
  const compact = new Intl.NumberFormat(locale === 'am' ? 'am-ET' : 'en-ET', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
  return locale === 'am' ? `ብር ${compact}` : `ETB ${compact}`;
}

/** Strip currency + separators back to a number (for input parsing). */
export function parseCurrency(input: string | null | undefined): number | null {
  if (!input) return null;
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const value = parseFloat(cleaned);
  return Number.isNaN(value) ? null : value;
}

/** Round to 2 decimal places (safe for currency). */
export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Clamp + validate an input price. Returns null if invalid. */
export function sanitizePrice(input: string): number | null {
  const n = parseCurrency(input);
  if (n === null || n <= 0) return null;
  return roundCurrency(n);
}