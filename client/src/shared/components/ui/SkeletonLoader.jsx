// client/src/shared/components/ui/SkeletonLoader.jsx
// Content placeholder while loading.
// SRS refs: §11.8.

import React from 'react';

export function SkeletonLoader({ width = '100%', height = 16, radius = 4, variant = 'text' }) {
  const base = {
    display: 'block',
    width,
    height,
    borderRadius: variant === 'circle' ? '50%' : radius,
    background:
      'linear-gradient(90deg, var(--color-surface, #F5F7FA) 0%, var(--color-border, #E0E0E0) 50%, var(--color-surface, #F5F7FA) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s ease-in-out infinite',
  };
  return <span aria-hidden style={base} />;
}

export default SkeletonLoader;