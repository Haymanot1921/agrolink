// mobile/src/shared/utils/validators.ts
// Reusable validators — email, phone (Ethiopia), password, numeric, URL.
// SRS refs: FR-AUTH-001, FR-AUTH-006, FR-MARKET-012/013, §15.1.

// ─────────────────────────────────────────────────────────────
// Basic primitives
// ─────────────────────────────────────────────────────────────

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email.trim());
};

/** Ethiopian phone number (+251 9/7xxxxxxxx or 09/07xxxxxxxx). */
export const isValidEthiopianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(\+251[79]\d{8}|0[79]\d{8})$/.test(cleaned);
};

/** Normalize to E.164 (+251xxxxxxxxx). */
export const normalizeEthiopianPhone = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+251')) return cleaned;
  if (cleaned.startsWith('0')) return `+251${cleaned.slice(1)}`;
  if (cleaned.startsWith('251')) return `+${cleaned}`;
  return cleaned;
};

export const isStrongPassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('min');
  if (!/[A-Z]/.test(password)) errors.push('upper');
  if (!/[a-z]/.test(password)) errors.push('lower');
  if (!/\d/.test(password)) errors.push('number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('special');
  return { valid: errors.length === 0, errors };
};

export const isPositiveNumber = (n: unknown): boolean => {
  const v = typeof n === 'string' ? parseFloat(n) : Number(n);
  return Number.isFinite(v) && v > 0;
};

export const isNonNegativeNumber = (n: unknown): boolean => {
  const v = typeof n === 'string' ? parseFloat(n) : Number(n);
  return Number.isFinite(v) && v >= 0;
};

export const isInteger = (n: unknown): boolean => {
  const v = typeof n === 'string' ? parseFloat(n) : Number(n);
  return Number.isInteger(v);
};

export const isValidUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

// ─────────────────────────────────────────────────────────────
// Form validators — return error keys from `validation` namespace
// ─────────────────────────────────────────────────────────────

export const required = (value: unknown, field: string): string | null =>
  value === null || value === undefined || value === '' ? `required:${field}` : null;

export const validateEmail = (value: string): string | null =>
  isValidEmail(value) ? null : 'email';

export const validatePhone = (value: string): string | null =>
  isValidEthiopianPhone(value) ? null : 'phone';

export const validatePassword = (value: string): string[] => {
  const result = isStrongPassword(value);
  return result.errors.map((e) => `password.${e}`);
};

export const validateConfirmPassword = (
  password: string,
  confirm: string,
): string | null => (password === confirm ? null : 'password.match');

export const validateMinLength = (value: string, min: number, field: string): string | null =>
  value.length < min ? `minLength:${field}:${min}` : null;

export const validateMaxLength = (value: string, max: number, field: string): string | null =>
  value.length > max ? `maxLength:${field}:${max}` : null;

export const validatePrice = (value: string): string | null => {
  const n = parseFloat(value);
  return isPositiveNumber(n) ? null : 'pricePositive';
};

export const validateQuantity = (value: string | number): string | null => {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return isPositiveNumber(n) ? null : 'quantityPositive';
};

/** Run a map of validators — returns first error per field. */
export function validateFields<T extends Record<string, unknown>>(
  values: T,
  rules: Partial<Record<keyof T, (value: unknown) => string | string[] | null>>,
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key in rules) {
    const rule = rules[key];
    if (!rule) continue;
    const result = rule(values[key]);
    if (Array.isArray(result) && result.length > 0) {
      errors[key] = result[0];
    } else if (typeof result === 'string') {
      errors[key] = result;
    }
  }
  return errors;
}