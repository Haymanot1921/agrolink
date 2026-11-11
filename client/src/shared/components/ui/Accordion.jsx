// client/src/shared/components/ui/Accordion.jsx
// Collapsible sections — single or multi open.
// SRS refs: §11.8.

import React, { useState } from 'react';

export function Accordion({ items = [], allowMultiple = false, defaultOpen = [] }) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = (i) => {
    if (allowMultiple) {
      setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
    } else {
      setOpen((prev) => (prev.includes(i) ? [] : [i]));
    }
  };

  return (
    <div style={{ border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, overflow: 'hidden' }}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={i} style={{ borderTop: i > 0 ? '1px solid var(--color-border, #E0E0E0)' : 'none' }}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`acc-${i}`}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'var(--color-card, #fff)',
                border: 'none',
                textAlign: 'left',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{item.title}</span>
              <span aria-hidden style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}>
                ▾
              </span>
            </button>
            {isOpen && (
              <div id={`acc-${i}`} style={{ padding: '0 16px 16px', fontSize: 14, color: 'var(--color-text-muted, #5F6368)', lineHeight: 1.6 }}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;