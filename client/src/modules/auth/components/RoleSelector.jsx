// client/src/modules/auth/components/RoleSelector.jsx
// Reusable actor selector — 5 roles + optional Service Provider subtype step.
// SRS refs: §4.1, §4.1.3, §4.3.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

export const ROLES = [
  { key: 'farmer', icon: '🌾' },
  { key: 'buyer', icon: '🛒' },
  { key: 'service_provider', icon: '🚜' },
  { key: 'support_agent', icon: '🤝' },
  { key: 'administrator', icon: '🛡️' },
];

export const PROVIDER_TYPES = [
  { key: 'input_supplier', icon: '🌱' },
  { key: 'agricultural_expert', icon: '👨‍🌾' },
];

export function RoleSelector({ value, onChange, error }) {
  const { t } = useTranslation('auth');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {ROLES.map((role) => {
        const selected = value === role.key;
        return (
          <button
            key={role.key}
            type="button"
            onClick={() => onChange(role.key)}
            aria-pressed={selected}
            style={optionStyle(selected)}
          >
            <span style={{ fontSize: 28 }} aria-hidden>
              {role.icon}
            </span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                {t(`roleSelection.${camel(role.key)}`)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)' }}>
                {t(`roleSelection.${camel(role.key)}Description`)}
              </div>
            </div>
          </button>
        );
      })}

      {error && <span style={{ fontSize: 12, color: '#DC2626' }}>{error}</span>}
    </div>
  );
}

function camel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function optionStyle(selected) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 12,
    border: `2px solid ${
      selected ? 'var(--color-primary, #2E7D32)' : 'var(--color-border, #E0E0E0)'
    }`,
    background: selected ? 'var(--color-primary-light, #E8F5E9)' : 'var(--color-card, #fff)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  };
}