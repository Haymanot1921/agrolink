// client/src/i18n/utils/formatters.ts
// Locale-aware formatters used across the entire web app.
// All formatters respect the currently active i18n language automatically.
//
// SRS refs:
//   FR-ACCESS-006  — EN + AM support
//   FR-PRICE-002   — market price: source + observation date
//   FR-PRICE-005   — date MUST be visible on prices
//   FR-ORDER-002   — order timestamps
//   FR-ORDER-003   — preserve agreed price
//   FR-ADMIN-013   — report date ranges
//   NFR-ACCESS-002 — readable text
//
// Usage:
//   import { formatCurrency, formatDate, formatRelative } from '@i18n/utils/formatters';
//   formatCurrency(1250.5);       // "ETB 1,250.50"  /  "ብር 1,250.50"
//   formatDate('2025-11-09');     // "Nov 9, 2025"   /  "9 ኖቬም 2025"
//   formatRelative(new Date());   // "just now"      /  "አሁን"

import {
  format as dfFormat,
  parseISO,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
} from 'date-fns';
import { enUS } from 'date-fns/locale';

import i18n from '../index';
import { DEFAULT_LANGUAGE, INTL_LOCALE, isSupportedLanguage, type SupportedLanguage } from '../config';

// ─────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────

type DateInput = string | number | Date;

function currentLanguage(): SupportedLanguage {
  const lng = i18n.language;
  return isSupportedLanguage(lng) ? lng : DEFAULT_LANGUAGE;
}

const amharicDateLocale = {
  ...enUS,
  code: 'am-ET',
  localize: {
    ...enUS.localize,
    month: (monthIndex: number, options?: { width?: string }) => {
      const width =
        options?.width === 'wide'
          ? 'long'
          : options?.width === 'narrow'
            ? 'narrow'
            : 'short';
      return new Intl.DateTimeFormat('am-ET-u-ca-gregory', { month: width }).format(
        new Date(Date.UTC(2020, monthIndex, 1)),
      );
    },
    day: (dayIndex: number, options?: { width?: string }) => {
      const width =
        options?.width === 'wide'
          ? 'long'
          : options?.width === 'narrow'
            ? 'narrow'
            : 'short';
      return new Intl.DateTimeFormat('am-ET-u-ca-gregory', {
        weekday: width,
      }).format(new Date(Date.UTC(2020, 0, 5 + dayIndex)));
    },
    dayPeriod: (period: string) =>
      period === 'am' ? 'ጠዋት' : period === 'pm' ? 'ከሰዓት' : period,
  },
};

function dateFnsLocale() {
  return currentLanguage() === 'am' ? amharicDateLocale : enUS;
}

function intlLocale(lang?: SupportedLanguage): string {
  const resolved = lang ?? currentLanguage();
  return INTL_LOCALE[resolved] ?? 'en-ET';
}

function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  // ISO 8601 (with or without time)
  return parseISO(input);
}

// ─────────────────────────────────────────────────────────────
// Currency (ETB)
// ─────────────────────────────────────────────────────────────

export function formatCurrency(
  amount: number | string | null | undefined,
  options: {
    language?: SupportedLanguage;
    showCurrency?: boolean;
    decimals?: number;
  } = {},
): string {
  const {
    language = currentLanguage(),
    showCurrency = true,
    decimals = 2,
  } = options;

  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (value === null || value === undefined || Number.isNaN(value)) {
    return showCurrency ? (language === 'am' ? 'ብር —' : 'ETB —') : '—';
  }

  const formatted = new Intl.NumberFormat(intlLocale(language), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  if (!showCurrency) return formatted;
  return language === 'am' ? `ብር ${formatted}` : `ETB ${formatted}`;
}

/** Compact: 1.2K, 3.4M — used for dashboard stat cards. */
export function formatCompactCurrency(
  amount: number,
  language: SupportedLanguage = currentLanguage(),
): string {
  const formatted = new Intl.NumberFormat(intlLocale(language), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
  return language === 'am' ? `ብር ${formatted}` : `ETB ${formatted}`;
}

/** Parse a formatted currency string back to a number (for input parsing). */
export function parseCurrency(input: string | null | undefined): number | null {
  if (!input) return null;
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const value = parseFloat(cleaned);
  return Number.isNaN(value) ? null : value;
}

/** Safe rounding to 2 decimals. */
export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

// ─────────────────────────────────────────────────────────────
// Numbers
// ─────────────────────────────────────────────────────────────

export function formatNumber(
  value: number | string | null | undefined,
  language: SupportedLanguage = currentLanguage(),
): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat(intlLocale(language)).format(n);
}

export function formatDecimal(
  value: number,
  decimals = 2,
  language: SupportedLanguage = currentLanguage(),
): string {
  return new Intl.NumberFormat(intlLocale(language), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(
  value: number,
  language: SupportedLanguage = currentLanguage(),
): string {
  return new Intl.NumberFormat(intlLocale(language), {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatWeight(
  kg: number,
  language: SupportedLanguage = currentLanguage(),
): string {
  if (kg >= 1000) {
    return `${formatDecimal(kg / 1000, 2, language)} ${language === 'am' ? 'ቶን' : 't'}`;
  }
  return `${formatDecimal(kg, 0, language)} ${language === 'am' ? 'ኪግ' : 'kg'}`;
}

// ─────────────────────────────────────────────────────────────
// Dates (date-fns — locale aware)
// ─────────────────────────────────────────────────────────────

export function formatDate(
  input: DateInput,
  pattern = 'MMM d, yyyy',
): string {
  return dfFormat(toDate(input), pattern, { locale: dateFnsLocale() });
}

export function formatTime(input: DateInput): string {
  return dfFormat(toDate(input), 'h:mm a', { locale: dateFnsLocale() });
}

export function formatDateTime(input: DateInput): string {
  return dfFormat(toDate(input), 'MMM d, yyyy · h:mm a', {
    locale: dateFnsLocale(),
  });
}

export function formatShortDate(input: DateInput): string {
  return dfFormat(toDate(input), 'MMM d', { locale: dateFnsLocale() });
}

export function formatMonthYear(input: DateInput): string {
  return dfFormat(toDate(input), 'MMMM yyyy', { locale: dateFnsLocale() });
}

/** Date range for reports — "Nov 1 – Nov 9, 2025". */
export function formatDateRange(from: DateInput, to: DateInput): string {
  const a = toDate(from);
  const b = toDate(to);
  if (a.getFullYear() === b.getFullYear()) {
    return `${dfFormat(a, 'MMM d', { locale: dateFnsLocale() })} – ${dfFormat(
      b,
      'MMM d, yyyy',
      { locale: dateFnsLocale() },
    )}`;
  }
  return `${dfFormat(a, 'MMM d, yyyy', { locale: dateFnsLocale() })} – ${dfFormat(
    b,
    'MMM d, yyyy',
    { locale: dateFnsLocale() },
  )}`;
}

// ─────────────────────────────────────────────────────────────
// Relative time (chat, notifications, activity feed)
// ─────────────────────────────────────────────────────────────

export function formatRelative(input: DateInput): string {
  const d = toDate(input);
  if (isToday(d)) {
    return dfFormat(d, 'h:mm a', { locale: dateFnsLocale() });
  }
  if (isYesterday(d)) {
    return `${i18n.t('dates.yesterday', { ns: 'common' })} · ${dfFormat(d, 'h:mm a', {
      locale: dateFnsLocale(),
    })}`;
  }
  if (isThisWeek(d)) {
    return dfFormat(d, 'EEE · h:mm a', { locale: dateFnsLocale() });
  }
  if (isThisMonth(d)) {
    return dfFormat(d, 'MMM d · h:mm a', { locale: dateFnsLocale() });
  }
  if (isThisYear(d)) {
    return dfFormat(d, 'MMM d', { locale: dateFnsLocale() });
  }
  return dfFormat(d, 'MMM d, yyyy', { locale: dateFnsLocale() });
}

export function formatTimeAgo(input: DateInput): string {
  const differenceInSeconds = (toDate(input).getTime() - Date.now()) / 1000;
  const absoluteDifference = Math.abs(differenceInSeconds);
  const [unit, secondsPerUnit] =
    absoluteDifference < 60
      ? ['second', 1]
      : absoluteDifference < 3600
        ? ['minute', 60]
        : absoluteDifference < 86400
          ? ['hour', 3600]
          : absoluteDifference < 2_592_000
            ? ['day', 86400]
            : absoluteDifference < 31_536_000
              ? ['month', 2_592_000]
              : ['year', 31_536_000];

  return new Intl.RelativeTimeFormat(intlLocale(), { numeric: 'auto' }).format(
    Math.round(differenceInSeconds / secondsPerUnit),
    unit as Intl.RelativeTimeFormatUnit,
  );
}

// ─────────────────────────────────────────────────────────────
// Duration (consultations, calls)
// ─────────────────────────────────────────────────────────────

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

/** Countdown formatter for OTP resend (mm:ss). */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────
// Phone (Ethiopian +251 9XX XXX XXX)
// ─────────────────────────────────────────────────────────────

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '—';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('251') && cleaned.length >= 12) {
    return `+251 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`;
  }
  return phone;
}

// ─────────────────────────────────────────────────────────────
// Plurals helper — wraps i18next plural forms with the current count
// ─────────────────────────────────────────────────────────────

export function formatCount(
  count: number,
  singularKey: string,
  pluralKey: string,
  namespace: 'common' | 'buyer' | 'farmer' | 'input-supplier' | 'agricultural-expert' | 'support-agent' | 'administrator' = 'common',
): string {
  return i18n.t(count === 1 ? singularKey : pluralKey, {
    ns: namespace,
    count,
  });
}

// ─────────────────────────────────────────────────────────────
// Re-export for convenience
// ─────────────────────────────────────────────────────────────

export type { DateInput };