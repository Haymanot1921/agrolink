// client/src/shared/utils/exportUtils.js
// CSV/JSON export helpers — used by every reports module.
// SRS refs: FR-ADMIN-013, §11.4 reports, BR-009 (audit exports must be logged server-side).

/**
 * Convert array of objects → CSV string.
 * Handles quoting, commas, newlines, and nulls.
 */
export function toCSV(rows = [], columns = null) {
  if (!rows.length) return '';

  const cols = columns ?? Object.keys(rows[0]);

  const escape = (val) => {
    if (val == null) return '';
    const str = String(val);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const header = cols.map(escape).join(',');
  const body = rows
    .map((row) => cols.map((c) => escape(typeof c === 'object' ? c.accessor?.(row) : row[c])).join(','))
    .join('\n');

  return `${header}\n${body}`;
}

/**
 * Trigger a browser download for a string.
 */
export function downloadString(content, filename, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Download an array of objects as CSV.
 */
export function downloadCSV(rows, filename = 'export.csv', columns = null) {
  downloadString(toCSV(rows, columns), filename, 'text/csv;charset=utf-8');
}

/**
 * Download an array of objects as JSON.
 */
export function downloadJSON(data, filename = 'export.json') {
  downloadString(JSON.stringify(data, null, 2), filename, 'application/json');
}

/**
 * Build a filename with a timestamp, e.g. "users_2025-01-15.csv".
 */
export function buildFilename(prefix, ext = 'csv') {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10);
  return `${prefix}_${stamp}.${ext}`;
}

/**
 * Print current page — used by invoice/receipt views.
 */
export function printPage() {
  window.print();
}