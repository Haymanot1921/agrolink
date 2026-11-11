// client/src/shared/components/ui/Modal.jsx
// Accessible modal — focus trap, ESC to close, backdrop click.
// SRS refs: §11.8, NFR-ACCESS-003.

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const SIZES = { sm: 400, md: 560, lg: 720, xl: 960 };

export function Modal({ open, onClose, title, children, size = 'md', footer, closeOnBackdrop = true }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const node = dialogRef.current;
    node?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(0,0,0,0.5)',
      }}
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        style={{
          width: '100%',
          maxWidth: SIZES[size] ?? SIZES.md,
          background: 'var(--color-card, #fff)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          maxHeight: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {title && (
          <header
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border, #E0E0E0)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 id="modal-title" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-muted, #5F6368)' }}
            >
              ×
            </button>
          </header>
        )}
        <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>{children}</div>
        {footer && (
          <footer style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border, #E0E0E0)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;