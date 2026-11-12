// client/src/pages/experts/PublicExpertsPage.jsx
// Guest-accessible agricultural expert directory.
// SRS refs: §5.8 FR-CONSULT-001, 002.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useDebounce } from '@hooks/useDebounce';
import { api } from '@services/apiClient';
import { formatCurrency } from '@i18n/utils/formatters';

const SPECIALIZATIONS = [
  { value: 'all', labelKey: 'specializations.all' },
  { value: 'crop_protection', labelKey: 'specializations.cropProtection' },
  { value: 'soil_fertility', labelKey: 'specializations.soilFertility' },
  { value: 'livestock', labelKey: 'specializations.livestock' },
  { value: 'irrigation', labelKey: 'specializations.irrigation' },
  { value: 'agronomy', labelKey: 'specializations.agronomy' },
  { value: 'post_harvest', labelKey: 'specializations.postHarvest' },
];

export function PublicExpertsPage() {
  const { t } = useTranslation('buyer');
  const { t: tc } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [specialization, setSpecialization] = useState('all');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-experts', debouncedQuery, specialization],
    queryFn: () =>
      api.get('/public/experts', {
        params: {
          q: debouncedQuery || undefined,
          specialization: specialization === 'all' ? undefined : specialization,
          page: 1,
          perPage: 24,
        },
      }),
  });

  const items = data?.items ?? [];

  return (
    <>
      <Helmet>
        <title>{`${tc('appName')} · ${t('experts.title')}`}</title>
      </Helmet>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            {t('experts.title')}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
            {t('experts.subtitle')}
          </p>
        </header>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('experts.searchPlaceholder')}
            style={{
              flex: '1 1 300px',
              padding: 12,
              border: '1px solid var(--color-border, #E0E0E0)',
              borderRadius: 8,
              fontSize: 15,
            }}
          />
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            style={{
              padding: 12,
              border: '1px solid var(--color-border, #E0E0E0)',
              borderRadius: 8,
              fontSize: 15,
              minWidth: 200,
            }}
          >
            {SPECIALIZATIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {t(s.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p>{tc('messages.loading')}</p>}
        {error && (
          <p role="alert" style={{ color: 'var(--color-danger)' }}>
            {tc('messages.serverError')}
          </p>
        )}
        {!isLoading && !error && items.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted, #5F6368)', padding: 40 }}>
            {t('experts.empty')}
          </p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {items.map((expert) => (
            <Link
              key={expert.id}
              to={`/experts/${expert.id}`}
              style={{
                display: 'block',
                border: '1px solid var(--color-border, #E0E0E0)',
                borderRadius: 12,
                padding: 20,
                textDecoration: 'none',
                color: 'var(--color-text, #1B1B1B)',
                background: 'var(--color-card, #fff)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {expert.profile_image_url ? (
                  <img
                    src={expert.profile_image_url}
                    alt=""
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'var(--color-primary-light, #E8F5E9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                    }}
                    aria-hidden
                  >
                    👨‍🌾
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                    {expert.full_name}
                  </h3>
                  {expert.verified && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: 'var(--color-success-light, #E8F5E9)',
                        color: 'var(--color-success, #2E7D32)',
                        fontWeight: 700,
                      }}
                    >
                      ✓ {t('experts.verified')}
                    </span>
                  )}
                </div>
              </div>

              {expert.specializations?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {expert.specializations.slice(0, 3).map((s, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        padding: '3px 8px',
                        borderRadius: 999,
                        background: 'var(--color-surface, #F5F7FA)',
                        color: 'var(--color-text-muted, #5F6368)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {expert.biography && (
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--color-text-muted, #5F6368)',
                    lineHeight: 1.5,
                    marginBottom: 12,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {expert.biography}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                  paddingTop: 12,
                  borderTop: '1px solid var(--color-border, #E0E0E0)',
                }}
              >
                {expert.experience_years != null && (
                  <span style={{ color: 'var(--color-text-muted, #5F6368)' }}>
                    {expert.experience_years} {t('experts.years')}
                  </span>
                )}
                {expert.consultation_fee_etb != null && (
                  <span style={{ fontWeight: 700, color: 'var(--color-primary, #2E7D32)' }}>
                    {formatCurrency(expert.consultation_fee_etb)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}