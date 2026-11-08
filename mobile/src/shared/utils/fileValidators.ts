// mobile/src/shared/utils/fileValidators.ts
// Validate picked files (size, MIME, extension) before upload.
// SRS refs: §13.3, NFR-SEC-009 (file upload validation).

import mime from 'react-native-mime-types';

export interface FileLike {
  uri: string;
  name?: string;
  mimeType?: string;
  sizeBytes?: number;
  fileSize?: number;
}

export interface ValidateOptions {
  /** Max size in MB (default 10). */
  maxSizeMb?: number;
  /** Allowed MIME types, e.g. ['image/jpeg', 'image/png']. Empty = allow all. */
  allowedMimeTypes?: string[];
  /** Allowed extensions, e.g. ['.jpg', '.jpeg']. Empty = allow all. */
  allowedExtensions?: string[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const fileValidators = {
  validateImage(file: FileLike, opts: ValidateOptions = {}): ValidationResult {
    return this.validate(file, {
      maxSizeMb: opts.maxSizeMb ?? 5,
      allowedMimeTypes: opts.allowedMimeTypes ?? IMAGE_TYPES,
      allowedExtensions: opts.allowedExtensions ?? ['.jpg', '.jpeg', '.png', '.webp'],
    });
  },

  validateDocument(file: FileLike, opts: ValidateOptions = {}): ValidationResult {
    return this.validate(file, {
      maxSizeMb: opts.maxSizeMb ?? 10,
      allowedMimeTypes: opts.allowedMimeTypes ?? DOCUMENT_TYPES,
      allowedExtensions: opts.allowedExtensions ?? ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
    });
  },

  validate(file: FileLike, opts: ValidateOptions = {}): ValidationResult {
    const { maxSizeMb = 10, allowedMimeTypes = [], allowedExtensions = [] } = opts;

    const size = file.sizeBytes ?? file.fileSize;
    if (size !== undefined && size > maxSizeMb * 1024 * 1024) {
      return { valid: false, error: `File must be less than ${maxSizeMb}MB` };
    }

    const name = file.name ?? file.uri.split('/').pop() ?? '';
    const mimeType = file.mimeType ?? mime.lookup(name) ?? undefined;
    const ext = name.includes('.') ? `.${name.split('.').pop()!.toLowerCase()}` : undefined;

    if (allowedMimeTypes.length && mimeType && !allowedMimeTypes.includes(mimeType)) {
      return { valid: false, error: 'This file type is not allowed' };
    }

    if (allowedExtensions.length && ext && !allowedExtensions.includes(ext)) {
      return { valid: false, error: 'This file extension is not allowed' };
    }

    if (!mimeType && !ext) {
      return { valid: false, error: 'Could not determine file type' };
    }

    return { valid: true };
  },

  /** Sanitize a filename (strip path separators, unsafe chars). */
  sanitizeFileName(name: string): string {
    return name
      .replace(/[/\\:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 200);
  },
};