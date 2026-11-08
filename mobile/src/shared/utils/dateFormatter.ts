// mobile/src/shared/utils/dateFormatter.ts
// Locale-aware date / time / duration formatting.
// SRS refs: FR-ACCESS-006 (EN + AM), §5.9 FR-PRICE-005 (date on price records),
//           FR-ORDER-002 (timestamps), FR-ADMIN-013 (report ranges).

import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';
import { enUS, amET } from 'date-fns/locale';
import i18n from '@i18n/index';

type DateInput = string | number | Date;

const LOCALES = {
  en: enUS,
  am: amET,
};

function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  return parseISO(input);
}

function currentLocale() {
  const lang = (i18n.language as 'en' | 'am') ?? 'en';
  return LOCALES[lang] ?? enUS;
}

export function formatDate(input: DateInput, pattern = 'MMM d, yyyy'): string {
  return format(toDate(input), pattern, { locale: currentLocale() });
}

export function formatTime(input: DateInput): string {
  return format(toDate(input), 'h:mm a', { locale: currentLocale() });
}

export function formatDateTime(input: DateInput): string {
  return format(toDate(input), 'MMM d, yyyy · h:mm a', { locale: currentLocale() });
}

export function formatShortDate(input: DateInput): string {
  return format(toDate(input), 'MMM d', { locale: currentLocale() });
}

export function formatMonthYear(input: DateInput): string {
  return format(toDate(input), 'MMMM yyyy', { locale: currentLocale() });
}

export function formatRelative(input: DateInput): string {
  const d = toDate(input);
  if (isToday(d)) {
    return format(d, 'h:mm a', { locale: currentLocale() });
  }
  if (isYesterday(d)) {
    return i18n.t('dates.yesterday', { ns: 'common' }) +
      ' · ' +
      format(d, 'h:mm a', { locale: currentLocale() });
  }
  if (isThisWeek(d)) {
    return format(d, 'EEE · h:mm a', { locale: currentLocale() });
  }
  if (isThisMonth(d)) {
    return format(d, 'MMM d · h:mm a', { locale: currentLocale() });
  }
  if (isThisYear(d)) {
    return format(d, 'MMM d', { locale: currentLocale() });
  }
  return format(d, 'MMM d, yyyy', { locale: currentLocale() });
}

export function formatTimeAgo(input: DateInput): string {
  return formatDistanceToNow(toDate(input), {
    locale: currentLocale(),
    addSuffix: true,
  });
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

/** Human duration between two times (e.g. consultation elapsed time). */
export function formatDurationBetween(start: DateInput, end: DateInput): string {
  const diffSec = Math.abs(differenceInSeconds(toDate(end), toDate(start)));
  return formatDuration(diffSec);
}

export function formatCountdown(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function isOlderThan(input: DateInput, seconds: number): boolean {
  const diff = differenceInSeconds(new Date(), toDate(input));
  return diff > seconds;
}

export { differenceInMinutes, differenceInHours, differenceInDays };