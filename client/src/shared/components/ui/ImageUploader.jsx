// client/src/shared/components/ui/ImageUploader.jsx
// Image-specific upload with preview thumbnail.
// SRS refs: FR-MARKET-003, NFR-PERF-004 (image size limits).

import React, { useRef, useState } from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function ImageUploader({ value, onChange, maxSizeMB = 5, accept = 'image/*' }) {
  const { t } = useTranslation('common');
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value ?? null);
  const [error, setError] = useState(null);

  const handle = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('fileUpload.imageOnly'));
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(t('fileUpload.tooLarge', { max: maxSizeMB, name: file.name }));
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onChange?.(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          width: 120,
          height: 120,
          borderRadius: 12,
          border: '2px dashed var(--color-border, #E0E0E0)',
          background: preview ? 'none' : 'var(--color-surface, #F5F7FA)',
          cursor: 'pointer',
          overflow: 'hidden',
          padding: 0,
        }}
        aria-label={t('fileUpload.uploadImage')}
      >
        {preview ? (
          <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 28 }} aria-hidden>🖼️</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handle(e.target.files?.[0])}
        style={{ display: 'none' }}
      />
      {error && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>{error}</p>}
    </div>
  );
}

export default ImageUploader;