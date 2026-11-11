// client/src/shared/components/ui/FileUpload.jsx
// Drag-and-drop file upload with validation.
// SRS refs: NFR-SEC-009 file upload validation.

import React, { useState, useRef } from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

export function FileUpload({
  accept = '*',
  maxSizeMB = 5,
  multiple = false,
  onChange,
  helper,
}) {
  const { t } = useTranslation('common');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const processFiles = (files) => {
    const list = Array.from(files);
    const valid = [];
    for (const f of list) {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(t('fileUpload.tooLarge', { max: maxSizeMB, name: f.name }));
        return;
      }
      valid.push(f);
    }
    setError(null);
    onChange?.(multiple ? valid : valid[0] ?? null);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          processFiles(e.dataTransfer.files);
        }}
        style={{
          padding: 24,
          border: `2px dashed ${dragging ? 'var(--color-primary, #2E7D32)' : 'var(--color-border, #E0E0E0)'}`,
          borderRadius: 12,
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'var(--color-primary-light, #E8F5E9)' : 'var(--color-card, #fff)',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }} aria-hidden>📎</div>
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          {t('fileUpload.dropOrClick')}
        </p>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)' }}>
          {helper ?? t('fileUpload.maxSize', { max: maxSizeMB })}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => processFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      {error && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>{error}</p>}
    </div>
  );
}

export default FileUpload;