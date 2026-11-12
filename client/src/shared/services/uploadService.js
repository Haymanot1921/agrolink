// client/src/shared/services/uploadService.js
// Single-file + chunked upload, validation, progress.
// SRS refs: §13.3 image storage, NFR-SEC-009 file upload validation,
//           NFR-PERF-004 (image size limits).

import { apiClient } from './apiClient';

const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_IMAGE_MB = 5;
const MAX_DOC_MB = 10;
const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB chunks for large files

export const uploadService = {
  /** Validate a file client-side before upload. Throws typed error. */
  validate(file, { kind = 'image', maxMB } = {}) {
    if (!file) {
      throw { code: 'NO_FILE', message: 'No file selected' };
    }

    const limit = maxMB ?? (kind === 'image' ? MAX_IMAGE_MB : MAX_DOC_MB);
    const allowed = kind === 'image' ? ALLOWED_IMAGE_MIME : [...ALLOWED_IMAGE_MIME, ...ALLOWED_DOC_MIME];

    if (!allowed.includes(file.type)) {
      throw {
        code: 'INVALID_TYPE',
        message: `File type "${file.type}" is not allowed`,
      };
    }
    if (file.size > limit * 1024 * 1024) {
      throw {
        code: 'FILE_TOO_LARGE',
        message: `File exceeds ${limit} MB`,
      };
    }
    return true;
  },

  /**
   * Upload a single file.
   * @param {File} file
   * @param {object} options { kind, folder, onProgress }
   * @returns {Promise<{ id, url, mimeType, size }>}
   */
  async uploadSingle(file, { kind = 'image', folder = 'general', onProgress } = {}) {
    this.validate(file, { kind });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('kind', kind);

    return apiClient.post('/uploads/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  },

  /**
   * Chunked upload for large files (e.g., verification documents).
   * @param {File} file
   * @param {object} options { kind, folder, onProgress }
   */
  async uploadChunked(file, { kind = 'document', folder = 'general', onProgress } = {}) {
    this.validate(file, { kind });

    // 1. Initiate upload session
    const { uploadId, chunkSize = CHUNK_SIZE } = await apiClient.post('/uploads/init', {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      folder,
      kind,
    });

    // 2. Upload chunks sequentially
    const totalChunks = Math.ceil(file.size / chunkSize);
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', String(i));
      formData.append('chunk', chunk);

      await apiClient.post('/uploads/chunk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (onProgress) {
        onProgress(Math.round(((i + 1) / totalChunks) * 100));
      }
    }

    // 3. Complete
    return apiClient.post('/uploads/complete', { uploadId });
  },

  /** Convenience: image only. */
  async uploadImage(file, { folder, onProgress } = {}) {
    return this.uploadSingle(file, { kind: 'image', folder, onProgress });
  },

  /** Convenience: document only (chunked if > 5 MB). */
  async uploadDocument(file, { folder, onProgress } = {}) {
    if (file.size > 5 * 1024 * 1024) {
      return this.uploadChunked(file, { kind: 'document', folder, onProgress });
    }
    return this.uploadSingle(file, { kind: 'document', folder, onProgress });
  },

  /** Delete a previously uploaded file. */
  async remove(fileId) {
    return apiClient.delete(`/uploads/${fileId}`);
  },
};

export default uploadService;