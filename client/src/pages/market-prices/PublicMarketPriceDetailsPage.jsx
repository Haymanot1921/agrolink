// client/src/pages/market-prices/PublicMarketPriceDetailsPage.jsx
// Detail view of a single market-price record.
// SRS refs: §5.9 FR-PRICE-005 (date), 007 (source verification).

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { api } from '@services/apiClient';
import { formatCurrency, formatDate, formatDateTime } from '@i18n/utils/formatters';

export function PublicMarketPriceDetailsPage() {
  const { priceId } = useParams();
  const { t } = useTranslation('buyer');
  const { t: tc } = useTranslation('common');

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-market-price', priceId],
    queryFn: () => api.get(`/public/market-prices/${priceId}`),
    enabled: Boolean(priceId),
  });

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>{tc('messages.loading')}</div>;
  }
  if (error || !data) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }} role="alert">
        {tc('messages.serverError')}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${tc('appName')} · ${data.product_name}`}</title>
      </Helmet>

      <article style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
        <Link
          to="/market-prices"
          style={{
            fontSize: 14,
            color: 'var(--color-primary, #2E7D32)',
            marginBottom: 24,
            display: 'inline-block',
          }}
        >
          ← {t('marketPrices.title')}
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          {data.product_name}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', marginBottom: 24 }}>
          {t('marketPrices.at')} <strong>{data.market_location}</strong> · {data.region}
        </p>

        <div
          style={{
            padding: 24,
            background: 'var(--color-primary-light, #E8F5E9)',
            borderRadius: 16,
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', marginBottom: 4 }}>
            {t('marketPrices.recordedPrice')}
          </p>
          <p style={{ fontSize: 40, fontWeight: 800, color: 'var(--color-primary, #2E7D32)' }}>
            {formatCurrency(data.price_etb)}
            <span style={{ fontSize: 18, fontWeight: 400, marginLeft: 8 }}>/ {data.unit}</span>
          </p>
        </div>

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            padding: 20,
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 12,
            background: 'var(--color-card, #fff)',
          }}
        >
          <div>
            <dt style={dtStyle}>{t('marketPrices.columns.date')}</dt>
            <dd style={ddStyle}>{formatDate(data.observation_date)}</dd>
          </div>
          <div>
            <dt style={dtStyle}>{t('marketPrices.columns.source')}</dt>
            <dd style={ddStyle}>{data.source}</dd>
          </div>
          <div>
            <dt style={dtStyle}>{t('marketPrices.recordedOn')}</dt>
            <dd style={ddStyle}>{formatDateTime(data.created_at)}</dd>
          </div>
          {data.category && (
            <div>
              <dt style={dtStyle}>{t('marketPrices.category')}</dt>
              <dd style={ddStyle}>{data.category.name_en}</dd>
            </div>
          )}
        </dl>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: 'var(--color-info-light, #E3F2FD)',
            color: 'var(--color-info, #1565C0)',
            borderRadius: 8,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <strong>{t('marketPrices.disclaimerTitle')}:</strong> {t('marketPrices.disclaimer')}
        </div>
      </article>
    </>
  );
}

const dtStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted, #5F6368)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 4,
};

const ddStyle = {
  fontSize: 15,
  fontWeight: 600,
};