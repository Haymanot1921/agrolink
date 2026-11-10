// client/src/pages/auth/RoleSelectionPage.jsx
// Actor selection — 5 roles + Service Provider subtype.
// SRS refs: §4.1, §4.1.3.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';

const ROLE_OPTIONS = [
  { key: 'farmer', icon: '🌾', labelKey: 'roleSelection.farmer', descKey: 'roleSelection.farmerDescription' },
  { key: 'buyer', icon: '🛒', labelKey: 'roleSelection.buyer', descKey: 'roleSelection.buyerDescription' },
  { key: 'service_provider', icon: '🚜', labelKey: 'roleSelection.serviceProvider', descKey: 'roleSelection.serviceProviderDescription' },
  { key: 'support_agent', icon: '🤝', labelKey: 'roleSelection.supportAgent', descKey: 'roleSelection.supportAgentDescription' },
  { key: 'administrator', icon: '🛡️', labelKey: 'roleSelection.administrator', descKey: 'roleSelection.administratorDescription' },
];

const PROVIDER_TYPES = [
  { key: 'input_supplier', icon: '🌱', labelKey: 'serviceProviderType.inputSupplier', descKey: 'serviceProviderType.inputSupplierDescription' },
  { key: 'agricultural_expert', icon: '👨‍🌾', labelKey: 'serviceProviderType.agriculturalExpert', descKey: 'serviceProviderType.agriculturalExpertDescription' },
];

export function RoleSelectionPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [step, setStep] = useState('role'); // 'role' | 'provider-type'

  const handleRoleSelect = (role) => {
    if (role === 'service_provider') {
      setStep('provider-type');
      return;
    }
    navigate('/auth/register', { state: { role } });
  };

  const handleProviderTypeSelect = (providerType) => {
    navigate('/auth/register', {
      state: { role: 'service_provider', providerType },
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('roleSelection.title')}</title>
      </Helmet>

      {step === 'role' ? (
        <>
          <header style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
              {t('roleSelection.title')}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
              {t('roleSelection.subtitle')}
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleRoleSelect(option.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: 16,
                  border: '1px solid var(--color-border, #E0E0E0)',
                  borderRadius: 12,
                  background: 'var(--color-card, #fff)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 28 }} aria-hidden>
                  {option.icon}
                </span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t(option.labelKey)}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', marginTop: 2 }}>
                    {t(option.descKey)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <header style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
              {t('serviceProviderType.title')}
            </h1>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROVIDER_TYPES.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleProviderTypeSelect(option.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: 16,
                  border: '1px solid var(--color-border, #E0E0E0)',
                  borderRadius: 12,
                  background: 'var(--color-card, #fff)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 28 }} aria-hidden>
                  {option.icon}
                </span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t(option.labelKey)}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', marginTop: 2 }}>
                    {t(option.descKey)}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStep('role')}
            style={{
              marginTop: 16,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary, #2E7D32)',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            ← Back
          </button>
        </>
      )}
    </>
  );
}