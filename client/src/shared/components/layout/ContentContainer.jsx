// client/src/shared/components/layout/ContentContainer.jsx
// Constrains content width + paddings.
// SRS refs: §11.8 responsive layouts.

import React from 'react';

export function ContentContainer({ children, maxWidth = 1200, padding = '24px 16px', style }) {
  return (
    <div style={{ maxWidth, margin: '0 auto', padding, ...style }}>{children}</div>
  );
}

export default ContentContainer;