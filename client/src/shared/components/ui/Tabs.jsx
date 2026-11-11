// client/src/shared/components/ui/Tabs.jsx
// Accessible tabs with arrow-key navigation.
// SRS refs: §11.8, NFR-ACCESS-003.

import React, { useState } from 'react';

export function Tabs({ tabs = [], defaultIndex = 0, onChange, variant = 'underline' }) {
  const [active, setActive] = useState(defaultIndex);

  const select = (i) => {
    setActive(i);
    onChange?.(i, tabs[i]);
  };

  const onKey = (e, i) => {
    if (e.key === 'ArrowRight') select((i + 1) % tabs.length);
    if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length);
  };

  return (
    <div>
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: variant === 'underline' ? 0 : 4,
          borderBottom: variant === 'underline' ? '1px solid var(--color-border, #E0E0E0)' : 'none',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${i}`}
              id={`tab-${i}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
              style={{
                padding: variant === 'underline' ? '12px 16px' : '8px 16px',
                background: variant === 'pill' && isActive ? 'var(--color-primary, #2E7D32)' : 'none',
                color: variant === 'pill' && isActive ? '#fff' : isActive ? 'var(--color-primary, #2E7D32)' : 'var(--color-text-muted, #5F6368)',
                border: 'none',
                borderBottom: variant === 'underline' && isActive ? '2px solid var(--color-primary, #2E7D32)' : '2px solid transparent',
                borderRadius: variant === 'pill' ? 999 : 0,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`tabpanel-${active}`} aria-labelledby={`tab-${active}`} style={{ paddingTop: 16 }}>
        {tabs[active]?.content}
      </div>
    </div>
  );
}

export default Tabs;