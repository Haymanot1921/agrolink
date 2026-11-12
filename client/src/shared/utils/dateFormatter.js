// client/src/shared/utils/dateFormatter.js
// Ethiopian-locale date helpers. Amharic uses Ethiopian calendar labels
// via Intl when available; falls back to Gregorian + Amharic month names.
// SRS refs: FR-PRICE-005 (observation date), FR-ORDER (timestamps), NFR-ACCESS-006.

const AMHARIC_MONTHS = [
  'ጃንዩወሪ', 'ፌብሩወሪ', 'ማርች', 'ኤፕሪል', 'ሜይ', 'ጁን',
  'ጁላይ', 'ኦገስት', 'ሴፕቴምበር', 'ኦክቶበር', 'ኖቬምበር', 'ዲሴምበር',
];

/**
 * Formats a date with locale awareness.
 * @param {Date|string|number} value
 * @param {'short'|'long'|'datetime'|'time'|'relative'} style
 * @param {'en'|'am'} locale
 */
export function formatDate(value, style = 'short', locale = 'en') {
  if (value == null || value === '') return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  if (style === 'relative') return formatRelativeDate(date, locale);

  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  if (style === 'datetime') {
    return locale === 'am'
      ? `${d} ${AMHARIC_MONTHS[m]} ${y} · ${hh}:${mm}`
      : `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')} ${hh}:${mm}`;
  }
  if (style === 'time') return `${hh}:${mm}`;
  if (style === 'long') {
    return locale === 'am'
      ? `${d} ${AMHARIC_MONTHS[m]} ${y}`
      : date.toLocaleDateString('en-ET', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  // short
  return locale === 'am'
    ? `${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}`
    : `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * Relative time: "just now", "5m ago", "3d ago".
 */
export function formatRelativeDate(value, locale = 'en') {
  if (value == null) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  const am = locale === 'am';

  if (diffSec < 30) return am ? 'አሁን' : 'just now';
  if (diffSec < 60) return am ? `${diffSec} ሰከንድ በፊት` : `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return am ? `${diffMin} ደቂቃ በፊት` : `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return am ? `${diffHr} ሰዓት በፊት` : `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return am ? `${diffDay} ቀን በፊት` : `${diffDay}d ago`;
  if (diffDay < 30) return am ? `${Math.floor(diffDay / 7)} ሳምንት በፊት` : `${Math.floor(diffDay / 7)}w ago`;
  return formatDate(date, 'short', locale);
}

/**
 * ISO date (yyyy-mm-dd) — for API query params.
 */
export function toISODate(value) {
  if (value == null) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

/**
 * Check if a date is within the last N days.
 */
export function isWithinDays(value, days) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() <= days * 86400000;
}

/**
 * Returns a range: { from, to } — ISO strings.
 */
export function presetRange(preset) {
  const end = new Date();
  const start = new Date();
  const daysMap = { today: 0, last7: 7, last30: 30, last90: 90 };
  start.setDate(start.getDate() - (daysMap[preset] ?? 0));
  return { from: toISODate(start), to: toISODate(end) };
}