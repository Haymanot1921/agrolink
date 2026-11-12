// client/src/shared/utils/currencyFormatter.js
// Ethiopian Birr (ETB) + Amharic number labels.
// SRS refs: FR-ORDER-011, FR-PRICE, §11.4.

const AMHARIC_NUMERALS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; // Gregorian; Amharic numerals unused for currency per UX guidance

/**
 * Formats an ETB amount. Never throws on null/undefined.
 */
export function formatCurrency(amount, { locale = 'en', showSymbol = true, decimals = 2 } = {}) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '—';
  const formatted = new Intl.NumberFormat(locale === 'am' ? 'am-ET' : 'en-ET', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
  if (!showSymbol) return formatted;
  return locale === 'am' ? `${formatted} ብር` : `${formatted} ETB`;
}

/**
 * Compact form for charts: 1,234 → 1.2K, 1,234,567 → 1.2M.
 */
export function formatCompactCurrency(amount, { locale = 'en' } = {}) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '—';
  const abs = Math.abs(num);
  const suffix = locale === 'am' ? { k: 'ሺ', m: 'ሚሊዮን' } : { k: 'K', m: 'M' };
  if (abs >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}${suffix.m}`;
  if (abs >= 1_000) return `${(num / 1_000).toFixed(1)}${suffix.k}`;
  return String(num);
}

/**
 * Computes line total: quantity × unitPrice, rounded to 2 decimals (safe).
 */
export function lineTotal(quantity, unitPrice) {
  const q = Number(quantity);
  const p = Number(unitPrice);
  if (!Number.isFinite(q) || !Number.isFinite(p)) return 0;
  return Math.round(q * p * 100) / 100;
}

/**
 * Sum an array of line items (each { quantity, unit_price_etb }).
 * Backend is authoritative — this is display-only (FR-ORDER-011).
 */
export function sumLines(items = []) {
  return items.reduce((sum, i) => sum + lineTotal(i.quantity, i.unit_price_etb ?? i.price), 0);
}

/**
 * Parse user-entered ETB input safely — accepts "1,234.56", "1234", "1234.5".
 */
export function parseAmount(input) {
  if (typeof input === 'number') return input;
  if (typeof input !== 'string') return 0;
  const clean = input.replace(/,/g, '').trim();
  const num = Number(clean);
  return Number.isFinite(num) ? num : 0;
}