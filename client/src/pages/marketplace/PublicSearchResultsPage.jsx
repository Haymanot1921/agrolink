// client/src/pages/marketplace/PublicSearchResultsPage.jsx
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { api } from '@services/apiClient';
import { formatCurrency } from '@i18n/utils/formatters';

export function PublicSearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const { t } = useTranslation('buyer');
  const { t: tc } = useTranslation('common');

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-search', query],
    queryFn: () => api.get('/public/products', { params: { q: query, perPage: 24 } }),
    enabled: query.length > 0,
  });

  const items = data?.items ?? [];

  return (
    <>
      <Helmet>
        <title>{`${tc('appName')} · ${tc('actions.search')}: ${query}`}</title>
      </Helmet>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
          {tc('actions.search')}: "{query}"
        </h1>

        {isLoading && <p>{tc('messages.loading')}</p>}
        {error && <p role="alert">{tc('messages.serverError')}</p>}
        {!isLoading && !error && items.length === 0 && (
          <p style={{ color: 'var(--color-text-muted, #5F6368)', textAlign: 'center', padding: 40 }}>
            {t('marketplace.empty')}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {items.map((product) => (
            <Link
              key={product.id}
              to={`/marketplace/product/${product.id}`}
              style={{ display: 'block', border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 12, overflow: 'hidden', textDecoration: 'none', color: 'var(--color-text, #1B1B1B)' }}
            >
              {product.image_url && <img src={product.image_url} alt="" style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
              <div style={{ padding: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{product.name_en}</h3>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary, #2E7D32)' }}>
                  {formatCurrency(product.price_etb)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}