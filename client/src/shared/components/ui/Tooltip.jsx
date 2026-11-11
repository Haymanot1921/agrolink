// client/src/shared/components/ui/Tooltip.jsx
// Hover/focus tooltip — accessible via aria-describedby.
// SRS refs: §11.8, NFR-ACCESS-003.

import React, { useState, useRef, useId, useEffect } from 'react';

export function Tooltip({ content, children, side = 'top', delay = 200 }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const tooltipId = useId();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  const positions = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={visible ? tooltipId : undefined}>{children}</span>
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 1000,
            padding: '6px 10px',
            background: 'var(--color-text, #1B1B1B)',
            color: '#fff',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            ...positions[side],
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export default Tooltip;