// client/src/pages/market-prices/PublicMarketPricesPage.jsx
// Guest-accessible market price browser.
// SRS refs: §5.9 FR-PRICE-003, 004, 005, 006, 007.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { useDebounce } from '@hooks/useDebounce';
import { api } from '@services/apiClient';
import { formatCurrency, formatDate } from '@i18n/utils/formatters';

const REGIONS = [
  { value: 'all', labelEn: 'All Regions', labelAm: 'ሁሉም ክልሎች' },
  { value: 'addis_ababa', labelEn: 'Addis Ababa', labelAm: 'አዲስ አበባ' },
  { value: 'oromia', labelEn: 'Oromia', labelAm: 'ኦሮሚያ' },
  { value: 'amhara', labelEn: 'Amhara', labelAm: 'አማራ' },
  { value: 'sidama', labelEn: 'Sidama', labelAm: 'ሲዳማ' },
  { value: 'tigray', labelEn: 'Tigray', labelAm: 'ትግራይ' },
  { value: 'somali', labelEn: 'Somali', labelAm: 'ሶማሌ' },
  { value: 'afar', labelEn: 'Afar', labelAm: 'አፋር' },
  { value: 'benishangul_gumuz', labelEn: 'Benishangul-Gumuz', labelAm: 'ቤንሻንጉል-ጉሙዝ' },
  { value: 'gambela', labelEn: 'Gambela', labelAm: 'ጋምቤላ' },
  { value: 'harari', labelEn: 'Harari', labelAm: 'ሐረሪ' },
  { value: 'snnpr', labelEn: 'SNNPR', labelAm: 'ደቡብ ብሔሮች' },
];

export function PublicMarketPricesPage() {
  const { t } = useTranslation('buyer');
  const { t: tc } = useTranslation('common');
  const { isAmharic } = useLanguage();

  const [productQuery, setProductQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const debouncedQuery = useDebounce(productQuery, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-market-prices', debouncedQuery, region, sortBy],
    queryFn: () =>
      api.get('/public/market-prices', {
        params: {
          q: debouncedQuery || undefined,
          region: region === 'all' ? undefined : region,
          sort: sortBy,
          page: 1,
          perPage: 30,
        },
      }),
  });

  const items = data?.items ?? [];

  return (
    <>
      <Helmet>
        <title>{`${tc('appName')} · ${t('marketPrices.title')}`}</title>
      </Helmet>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            {t('marketPrices.title')}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
            {t('marketPrices.subtitle')}
          </p>
        </header>

        {/* Info banner — FR-PRICE-006: distinguish from seller price */}
        <div
          style={{
            padding: 12,
            background: 'var(--color-info-light, #E3F2FD)',
            color: 'var(--color-info, #1565C0)',
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          ℹ️ {t('marketPrices.disclaimer')}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            type="search"
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            placeholder={t('marketPrices.searchPlaceholder')}
            style={{
              flex: '1 1 300px',
              padding: 12,
              border: '1px solid var(--color-border, #E0E0E0)',
              borderRadius: 8,
              fontSize: 15,
            }}
          />

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              padding: 12,
              border: '1px solid var(--color-border, #E0E0E0)',
              borderRadius: 8,
              fontSize: 15,
              minWidth: 180,
            }}
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {isAmharic ? r.labelAm : r.labelEn}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: 12,
              border: '1px solid var(--color-border, #E0E0E0)',
              borderRadius: 8,
              fontSize: 15,
            }}
          >
            <option value="newest">{t('marketPrices.sort.newest')}</option>
            <option value="price_asc">{t('marketPrices.sort.priceLowHigh')}</option>
            <option value="price_desc">{t('marketPrices.sort.priceHighLow')}</option>
            <option value="product">{t('marketPrices.sort.product')}</option>
          </select>
        </div>

        {/* States */}
        {isLoading && <p>{tc('messages.loading')}</p>}
        {error && (
          <p role="alert" style={{ color: '#991B1B' }}>
            {tc('messages.serverError')}
          </p>
        )}
        {!isLoading && !error && items.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted, #5F6368)', padding: 40 }}>
            {t('marketPrices.empty')}
          </p>
        )}

        {/* Table */}
        {items.length > 0 && (
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--color-border, #E0E0E0)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: 'var(--color-surface, #F5F7FA)', textAlign: 'left' }}>
                  <th style={thStyle}>{t('marketPrices.columns.product')}</th>
                  <th style={thStyle}>{t('marketPrices.columns.market')}</th>
                  <th style={thStyle}>{t('marketPrices.columns.region')}</th>
                  <th style={thStyle}>{t('marketPrices.columns.price')}</th>
                  <th style={thStyle}>{t('marketPrices.columns.unit')}</th>
                  <th style={thStyle}>{t('marketPrices.columns.date')}</th>
                  <th style={thStyle}>{t('marketPrices.columns.source')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} style={{ borderTop: '1px solid var(--color-border, #E0E0E0)' }}>
                    <td style={tdStyle}>
                      <Link
                        to={`/market-prices/${row.id}`}
                        style={{ color: 'var(--color-primary, #2E7D32)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {row.product_name}
                      </Link>
                    </td>
                    <td style={tdStyle}>{row.market_location}</td>
                    <td style={tdStyle}>{row.region}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--color-primary, #2E7D32)' }}>
                      {formatCurrency(row.price_etb)}
                    </td>
                    <td style={tdStyle}>{row.unit}</td>
                    <td style={tdStyle}>{formatDate(row.observation_date)}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: 'var(--color-text-muted, #5F6368)' }}>
                      {row.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

const thStyle = {
  padding: '12px 16px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text-muted, #5F6368)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: 14,
};