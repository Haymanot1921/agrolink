// mobile/src/i18n/utils/formatters.ts
// Locale-aware formatters: date, time, currency (ETB), number, relative time.

import i18n from '../index';
import { INTL_LOCALE, type SupportedLanguage } from '../config';

const getLocale = (lang?: string): string => {
  const l = (lang ?? i18n.language) as SupportedLanguage;
  return INTL_LOCALE[l] ?? 'en-ET';
};

export function formatCurrency(amount: number, lang?: string): string {
  return new Intl.NumberFormat(getLocale(lang), {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, lang?: string): string {
  return new Intl.NumberFormat(getLocale(lang)).format(value);
}

export function formatDecimal(value: number, decimals = 2, lang?: string): string {
  return new Intl.NumberFormat(getLocale(lang), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, lang?: string): string {
  return new Intl.NumberFormat(getLocale(lang), {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  lang?: string,
): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(getLocale(lang), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(d);
}

export function formatTime(date: Date | string | number, lang?: string): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(getLocale(lang), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDateTime(date: Date | string | number, lang?: string): string {
  return `${formatDate(date, undefined, lang)} · ${formatTime(date, lang)}`;
}

export function formatRelativeTime(date: Date | string | number, lang?: string): string {
  const d = date instanceof Date ? date : new Date(date);
  const diffSeconds = Math.round((d.getTime() - Date.now()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(getLocale(lang), { numeric: 'auto' });
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of ranges) {
    if (Math.abs(diffSeconds) >= secondsInUnit || unit === 'second') {
      return rtf.format(Math.round(diffSeconds / secondsInUnit), unit);
    }
  }
  return rtf.format(0, 'second');
}

export function formatWeight(kg: number, lang?: string): string {
  if (kg >= 1000) {
    return `${formatDecimal(kg / 1000, 2, lang)} t`;
  }
  return `${formatDecimal(kg, 0, lang)} kg`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('251') && cleaned.length >= 12) {
    return `+251 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`;
  }
  return phone;
}