// client/src/pages/marketplace/PublicProductDetailsPage.jsx
// Product detail — guest-accessible.
// SRS refs: §5.4, FR-MARKET-010, FR-MARKET-015 (report).

import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/apiClient';
import { formatCurrency, formatDate } from '@i18n/utils/formatters';

export function PublicProductDetailsPage() {
  const { productId } = useParams();
  const { t } = useTranslation('buyer');
  const { t: tc } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-product', productId],
    queryFn: () => api.get(`/public/products/${productId}`),
    enabled: Boolean(productId),
  });

  const handleAuthAction = () => {
    navigate('/auth/login', { state: { from: `/marketplace/product/${productId}` } });
  };

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>{tc('messages.loading')}</div>;
  }
  if (error || !data) {
    return <div style={{ padding: 40, textAlign: 'center' }}>{tc('messages.serverError')}</div>;
  }

  return (
    <>
      <Helmet>
        <title>{`${tc('appName')} · ${data.name_en}`}</title>
      </Helmet>
      <article style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>
        <Link to="/marketplace" style={{ fontSize: 14, color: 'var(--color-primary, #2E7D32)', marginBottom: 24, display: 'inline-block' }}>
          ← {t('marketplace.title')}
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          <div>
            {data.images?.[0]?.url ? (
              <img src={data.images[0].url} alt="" style={{ width: '100%', borderRadius: 12 }} />
            ) : (
              <div style={{ width: '100%', aspectRatio: 1, background: '#F5F5F5', borderRadius: 12 }} aria-hidden />
            )}
          </div>

          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{data.name_en}</h1>
            {data.farmer_name && (
              <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', marginBottom: 4 }}>
                {t('marketplace.product.seller')}: <strong>{data.farmer_name}</strong>
              </p>
            )}
            {data.location_region && (
              <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)', marginBottom: 16 }}>
                📍 {data.location_region}
              </p>
            )}

            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary, #2E7D32)', marginBottom: 8 }}>
              {formatCurrency(data.price_etb)}
              <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--color-text-muted, #5F6368)' }}> / {data.unit}</span>
            </p>

            <p style={{ fontSize: 14, marginBottom: 24 }}>
              {t('marketplace.product.quantity')}: <strong>{data.quantity} {data.unit}</strong>
            </p>

            {data.description_en && (
              <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{data.description_en}</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(`/buyer/marketplace`)}
                    style={{ padding: 14, background: 'var(--color-primary, #2E7D32)', color: 'var(--color-text-on-primary)', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                  >
                    {t('marketplace.product.addToCart')}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/buyer/checkout`)}
                    style={{ padding: 14, background: 'transparent', color: 'var(--color-primary, #2E7D32)', border: '2px solid var(--color-primary, #2E7D32)', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                  >
                    {t('marketplace.product.buyNow')}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleAuthAction}
                  style={{ padding: 14, background: 'var(--color-primary, #2E7D32)', color: 'var(--color-text-on-primary)', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('marketplace.product.buyNow')} · Login required
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}