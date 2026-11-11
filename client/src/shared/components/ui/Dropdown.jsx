// client/src/shared/components/ui/Dropdown.jsx
// Accessible menu — click to toggle, ESC to close, click-outside to dismiss.
// SRS refs: §11.8, NFR-ACCESS-003.

import React, { useEffect, useRef, useState } from 'react';

export function Dropdown({ trigger, items = [], align = 'right' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
      >
        {trigger}
      </button>
      {open && (
        <ul
          role="menu"
          style={{
            position: 'absolute',
            top: '100%',
            [align]: 0,
            marginTop: 4,
            minWidth: 180,
            padding: '4px 0',
            background: 'var(--color-card, #fff)',
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            listStyle: 'none',
            zIndex: 500,
          }}
        >
          {items.map((item, i) =>
            item.divider ? (
              <li key={`div-${i}`} role="separator" style={{ height: 1, background: 'var(--color-border, #E0E0E0)', margin: '4px 0' }} />
            ) : (
              <li key={i} role="none">
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 14,
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    color: item.danger ? '#DC2626' : 'var(--color-text, #1B1B1B)',
                    opacity: item.disabled ? 0.5 : 1,
                  }}
                >
                  {item.label}
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;