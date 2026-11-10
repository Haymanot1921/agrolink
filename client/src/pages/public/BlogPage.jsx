// client/src/pages/public/BlogPage.jsx
// Public blog index — reuses the article service.

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { api } from '@services/apiClient';
import { formatDate } from '@i18n/utils/formatters';

export function BlogPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-articles'],
    queryFn: () => api.get('/public/articles', { params: { page: 1, perPage: 20 } }),
  });

  const items = data?.items ?? [];

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('blog.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 900, margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>
          {tp('blog.title')}
        </h1>

        {isLoading && <p>{t('messages.loading')}</p>}
        {error && <p role="alert">{t('messages.serverError')}</p>}

        {!isLoading && !error && items.length === 0 && (
          <p style={{ color: 'var(--color-text-muted, #5F6368)' }}>{tp('blog.empty')}</p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {items.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              style={{
                display: 'block',
                border: '1px solid var(--color-border, #E0E0E0)',
                borderRadius: 12,
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'var(--color-text, #1B1B1B)',
              }}
            >
              {article.cover_image_url && (
                <img
                  src={article.cover_image_url}
                  alt=""
                  style={{ width: '100%', height: 160, objectFit: 'cover' }}
                />
              )}
              <div style={{ padding: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                  {article.title_en}
                </h2>
                {article.published_at && (
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)' }}>
                    {formatDate(article.published_at)}
                  </p>
                )}
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--color-primary, #2E7D32)',
                  }}
                >
                  {tp('blog.readMore')} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </article>
    </>
  );
}