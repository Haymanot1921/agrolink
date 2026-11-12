// client/src/shared/utils/fileValidators.js
// Client-side file checks — mirrors backend validation.
// SRS refs: NFR-SEC-009, NFR-PERF-004, FR-MARKET-003.

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
export const DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx'];

/**
 * Returns { ok, error? } for a single file.
 */
export function validateFile(
  file,
  { allowedMime = IMAGE_MIME_TYPES, allowedExt = IMAGE_EXTENSIONS, maxMB = 5 } = {},
) {
  if (!file) return { ok: false, error: 'No file selected' };

  const mimeOk = allowedMime.includes(file.type);
  const name = file.name?.toLowerCase() ?? '';
  const extOk = allowedExt.some((ext) => name.endsWith(ext));

  if (!mimeOk && !extOk) {
    return { ok: false, error: 'This file type is not allowed' };
  }
  if (file.size > maxMB * 1024 * 1024) {
    return { ok: false, error: `File exceeds ${maxMB} MB` };
  }
  if (file.size === 0) {
    return { ok: false, error: 'File is empty' };
  }
  return { ok: true };
}

export function validateImage(file, { maxMB = 5 } = {}) {
  return validateFile(file, { allowedMime: IMAGE_MIME_TYPES, allowedExt: IMAGE_EXTENSIONS, maxMB });
}

export function validateDocument(file, { maxMB = 10 } = {}) {
  return validateFile(file, {
    allowedMime: [...IMAGE_MIME_TYPES, ...DOCUMENT_MIME_TYPES],
    allowedExt: [...IMAGE_EXTENSIONS, ...DOCUMENT_EXTENSIONS],
    maxMB,
  });
}

export function validateFilesArray(files = [], opts = {}) {
  const errors = [];
  for (const f of files) {
    const r = validateFile(f, opts);
    if (!r.ok) errors.push({ file: f.name, error: r.error });
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Human-readable file size: 0 B, 1.2 KB, 3.4 MB.
 */
export function formatFileSize(bytes) {
  const b = Number(bytes);
  if (!Number.isFinite(b) || b <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), units.length - 1);
  return `${(b / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Compresses an image client-side if > maxMB using canvas.
 * Only JPEG/PNG. Returns original on failure.
 */
export async function compressImage(file, { maxMB = 2, quality = 0.8 } = {}) {
  if (file.size <= maxMB * 1024 * 1024) return file;
  if (!['image/jpeg', 'image/png'].includes(file.type)) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const scale = Math.min(1, Math.sqrt((maxMB * 1024 * 1024) / file.size));
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressed = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
            resolve(compressed.size < file.size ? compressed : file);
          },
          'image/jpeg',
          quality,
        );
      };
      img.onerror = () => resolve(file);
      img.src = reader.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}