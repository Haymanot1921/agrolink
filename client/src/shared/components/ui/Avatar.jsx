// client/src/shared/components/ui/Avatar.jsx
// User avatar with graceful initial fallback.
// SRS refs: §11.8.

import React from 'react';

const SIZES = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };

export function Avatar({ src, name = '', size = 'md', alt }) {
  const px = SIZES[size] ?? SIZES.md;
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name}
        width={px}
        height={px}
        style={{ width: px, height: px, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt ?? name}
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        background: 'var(--color-primary-light, #E8F5E9)',
        color: 'var(--color-primary, #2E7D32)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: px * 0.4,
        flexShrink: 0,
      }}
    >
      {initials || '?'}
    </div>
  );
}

export default Avatar;