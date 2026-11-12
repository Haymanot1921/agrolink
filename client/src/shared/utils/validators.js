// client/src/shared/utils/validators.js
// Pure validation helpers — reusable across forms.
// SRS refs: §15.1 validation, NFR-SEC-005.

/* ─── Auth / Account ─────────────────────────────────── */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ETHIOPIAN_PHONE_RE = /^\+?251[79]\d{8}$/; // +251 followed by 9 digits starting 7 or 9
export const PASSWORD_MIN = 8;

export function isEmail(v) {
  return typeof v === 'string' && EMAIL_RE.test(v.trim());
}

export function isEthiopianPhone(v) {
  if (typeof v !== 'string') return false;
  const clean = v.replace(/[\s-]/g, '');
  return ETHIOPIAN_PHONE_RE.test(clean);
}

export function isStrongPassword(v) {
  if (typeof v !== 'string' || v.length < PASSWORD_MIN) return false;
  const hasLower = /[a-z]/.test(v);
  const hasUpper = /[A-Z]/.test(v);
  const hasDigit = /\d/.test(v);
  const hasSpecial = /[^A-Za-z0-9]/.test(v);
  return [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length >= 3;
}

/* ─── Products / Orders ──────────────────────────────── */

export function isPositiveNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0;
}

export function isNonNegativeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0;
}

export function inRange(v, min, max) {
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max;
}

/* ─── Location (Ethiopia) ────────────────────────────── */

export const ETHIOPIA_BOUNDS = { latMin: 3.4, latMax: 14.9, lngMin: 32.9, lngMax: 48.0 };

export function isEthiopianCoordinate({ lat, lng }) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return false;
  return (
    la >= ETHIOPIA_BOUNDS.latMin &&
    la <= ETHIOPIA_BOUNDS.latMax &&
    ln >= ETHIOPIA_BOUNDS.lngMin &&
    ln <= ETHIOPIA_BOUNDS.lngMax
  );
}

/* ─── Generic ────────────────────────────────────────── */

export function isRequired(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

export function withinLength(v, max) {
  return typeof v === 'string' ? v.length <= max : true;
}

/**
 * Compose validators — returns first error string or null.
 */
export function validate(value, rules = []) {
  for (const rule of rules) {
    if (typeof rule === 'function') {
      const result = rule(value);
      if (typeof result === 'string') return result;
      if (result === false) return 'Invalid value';
    }
  }
  return null;
}

/**
 * Validate an entire form object.
 * @param {object} values
 * @param {Record<string, (Function|Function[])[]>} schema
 * @returns {{ ok: boolean, errors: Record<string,string> }}
 */
export function validateForm(values, schema) {
  const errors = {};
  for (const field of Object.keys(schema)) {
    const rules = Array.isArray(schema[field]) ? schema[field] : [schema[field]];
    const err = validate(values[field], rules);
    if (err) errors[field] = err;
  }
  return { ok: Object.keys(errors).length === 0, errors };
}