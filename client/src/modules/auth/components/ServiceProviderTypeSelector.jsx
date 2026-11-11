// client/src/modules/auth/components/ServiceProviderTypeSelector.jsx
// Enforces BR-026 — provider must pick input_supplier or agricultural_expert.
// SRS refs: §4.1.3 BR-026, BR-029.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

const PROVIDER_TYPES = [
  {
    key: 'input_supplier',
    icon: '🌱',
    titleKey: 'serviceProviderType.inputSupplier',
    descriptionKey: 'serviceProviderType.inputSupplierDescription',
  },
  {
    key: 'agricultural_expert',
    icon: '👨‍🌾',
    titleKey: 'serviceProviderType.agriculturalExpert',
    descriptionKey: 'serviceProviderType.agriculturalExpertDescription',
  },
];

export function ServiceProviderTypeSelector({ value, onChange, error }) {
  const { t } = useTranslation('auth');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
        {t('serviceProviderType.title')}
      </p>

      {PROVIDER_TYPES.map((type) => {
        const selected = value === type.key;
        return (
          <button
            key={type.key}
            type="button"
            onClick={() => onChange(type.key)}
            aria-pressed={selected}
            style={{
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
            }}
          >
            <span style={{ fontSize: 28 }} aria-hidden>
              {type.icon}
            </span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                {t(type.titleKey)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)' }}>
                {t(type.descriptionKey)}
              </div>
            </div>
          </button>
        );
      })}

      {error && <span style={{ fontSize: 12, color: '#DC2626' }}>{error}</span>}
    </div>
  );
}