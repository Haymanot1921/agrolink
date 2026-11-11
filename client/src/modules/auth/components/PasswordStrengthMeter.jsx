// client/src/modules/auth/components/PasswordStrengthMeter.jsx
// Visual feedback on password strength — improves usability (NFR-USE-006).
// SRS refs: §5.1, NFR-USE-006, NFR-ACCESS-003.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

const LEVELS = [
  { key: 'tooWeak', color: '#DC2626', width: '20%' },
  { key: 'weak', color: '#F59E0B', width: '40%' },
  { key: 'fair', color: '#EAB308', width: '60%' },
  { key: 'good', color: '#65A30D', width: '80%' },
  { key: 'strong', color: '#16A34A', width: '100%' },
];

export function PasswordStrengthMeter({ score = 0 }) {
  const { t } = useTranslation('auth');
  const level = LEVELS[Math.min(score, 4)] ?? LEVELS[0];

  return (
    <div style={{ marginTop: 6 }} aria-live="polite">
      <div
        style={{
          height: 4,
          background: 'var(--color-border, #E0E0E0)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: level.width,
            background: level.color,
            transition: 'all 0.2s ease',
          }}
        />
      </div>
      <p
        style={{
          fontSize: 11,
          marginTop: 4,
          color: level.color,
          fontWeight: 600,
          textAlign: 'right',
        }}
      >
        {t(`passwordStrength.${level.key}`)}
      </p>
    </div>
  );
}