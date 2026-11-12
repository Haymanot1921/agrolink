// client/src/pages/marketplace/PublicMarketplacePage.jsx
// Guest-accessible marketplace — browse without login.
// SRS refs: §5.4, §5.6, FR-MARKET-007, FR-SEARCH-001..009.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useDebounce } from '@hooks/useDebounce';
import { api } from '@services/apiClient';
import { formatCurrency } from '@i18n/utils/formatters';

const PRODUCT_CATEGORIES = [
  { slug: 'all', labelKey: 'all' },
  { slug: 'cereals', labelKey: 'cereals' },
  { slug: 'vegetables', labelKey: 'vegetables' },
  { slug: 'fruits', labelKey: 'fruits' },
  { slug: 'pulses', labelKey: 'pulses' },
  { slug: 'oilseeds', labelKey: 'oilseeds' },
  { slug: 'livestock', labelKey: 'livestock' },
];

export function PublicMarketplacePage() {
  const { t } = useTranslation('buyer');
  const { t: tc } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-products', debouncedQuery, category, sort],
    queryFn: () =>
      api.get('/public/products', {
        params: {
          q: debouncedQuery || undefined,
          category: category === 'all' ? undefined : category,
          sort,
          page: 1,
          perPage: 24,
        },
      }),
  });

  const items = data?.items ?? [];

  return (
    <>
      <Helmet>
        <title>{`${tc('appName')} · ${t('marketplace.title')}`}</title>
      </Helmet>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>
          {t('marketplace.title')}
        </h1>

        {/* Search + sort */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('marketplace.searchPlaceholder')}
            style={{ flex: '1 1 300px', padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
            aria-label={t('marketplace.filters.sortBy')}
          >
            <option value="newest">{t('marketplace.sort.newest')}</option>
            <option value="price_asc">{t('marketplace.sort.priceLowHigh')}</option>
            <option value="price_desc">{t('marketplace.sort.priceHighLow')}</option>
            <option value="popular">{t('marketplace.sort.popular')}</option>
          </select>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setCategory(cat.slug)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: category === cat.slug ? '1.5px solid var(--color-primary, #2E7D32)' : '1px solid var(--color-border, #E0E0E0)',
                background: category === cat.slug ? 'var(--color-primary-light, #E8F5E9)' : 'transparent',
                color: category === cat.slug ? 'var(--color-primary, #2E7D32)' : 'var(--color-text, #1B1B1B)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.slug === 'all' ? tc('actions.viewAll') : cat.slug.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* States */}
        {isLoading && <p>{tc('messages.loading')}</p>}
        {error && <p role="alert" style={{ color: 'var(--color-danger)' }}>{tc('messages.serverError')}</p>}
        {!isLoading && !error && items.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted, #5F6368)', padding: 40 }}>
            {t('marketplace.empty')}
          </p>
        )}

        {/* Product grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {items.map((product) => (
            <Link
              key={product.id}
              to={`/marketplace/product/${product.id}`}
              style={{
                display: 'block',
                border: '1px solid var(--color-border, #E0E0E0)',
                borderRadius: 12,
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'var(--color-text, #1B1B1B)',
                background: 'var(--color-card, #fff)',
              }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt=""
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: 180, background: '#F5F5F5' }} aria-hidden />
              )}
              <div style={{ padding: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{product.name_en}</h3>
                {product.farmer_name && (
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)' }}>
                    {product.farmer_name} · {product.location_region ?? ''}
                  </p>
                )}
                <p style={{ fontSize: 16, fontWeight: 700, marginTop: 8, color: 'var(--color-primary, #2E7D32)' }}>
                  {formatCurrency(product.price_etb)}
                  <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--color-text-muted, #5F6368)' }}>
                    {' '}/ {product.unit}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}