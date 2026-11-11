// client/src/shared/components/ui/Toast.jsx
// Global toast system — provider + hook + rendering.
// SRS refs: §11.8, NFR-USE-006.

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, { type = 'info', duration = 4000 } = {}) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const api = {
    show,
    success: (msg, opts) => show(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => show(msg, { ...opts, type: 'error' }),
    warning: (msg, opts) => show(msg, { ...opts, type: 'warning' }),
    info: (msg, opts) => show(msg, { ...opts, type: 'info' }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxWidth: 360,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              ...TOAST_STYLES[t.type],
              padding: '12px 16px',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              fontSize: 14,
              animation: 'slideIn 0.2s ease',
            }}
          >
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Close"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 16 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const TOAST_STYLES = {
  success: { background: '#DCFCE7', color: '#166534' },
  error: { background: '#FEE2E2', color: '#991B1B' },
  warning: { background: '#FEF3C7', color: '#92400E' },
  info: { background: '#E3F2FD', color: '#1565C0' },
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export default Toast;