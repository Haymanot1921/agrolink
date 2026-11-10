// client/src/pages/articles/PublicArticlesPage.jsx
// Guest-accessible educational articles list.
// SRS refs: §5.10 FR-ARTICLE-004, FR-ARTICLE-006, FR-ARTICLE-007.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useDebounce } from '@hooks/useDebounce';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { api } from '@services/apiClient';
import { formatDate } from '@i18n/utils/formatters';

const CATEGORIES = [
  { slug: 'best-practices', labelEn: 'Best Practices', labelAm: 'ምርጥ ልምዶች' },
  { slug: 'pest-control', labelEn: 'Pest Control', labelAm: 'የተባይ ቁጥጥር' },
  { slug: 'market-trends', labelEn: 'Market Trends', labelAm: 'የገበያ አዝማሚያ' },
];

export function PublicArticlesPage() {
  const { t } = useTranslation('buyer');
  const { t: tc } = useTranslation('common');
  const { language, isAmharic } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-articles', debouncedQuery, category, language],
    queryFn: () =>
      api.get('/public/articles', {
        params: {
          q: debouncedQuery || undefined,
          category: category === 'all' ? undefined : category,
          lang: language,
          page: 1,
          perPage: 20,
        },
      }),
  });

  const items = data?.items ?? [];

  return (
    <>
      <Helmet>
        <title>{`${tc('appName')} · ${t('consultations.title')}`}</title>
      </Helmet>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>
          {isAmharic ? 'መጣጥፎች' : 'Articles'}
        </h1>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isAmharic ? 'መጣጥፎችን ፈልግ…' : 'Search articles…'}
          style={{ width: '100%', maxWidth: 480, padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15, marginBottom: 16 }}
        />

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
          <button
            type="button"
            onClick={() => setCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: category === 'all' ? '1.5px solid var(--color-primary, #2E7D32)' : '1px solid var(--color-border, #E0E0E0)',
              background: category === 'all' ? 'var(--color-primary-light, #E8F5E9)' : 'transparent',
              color: category === 'all' ? 'var(--color-primary, #2E7D32)' : 'var(--color-text, #1B1B1B)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {isAmharic ? 'ሁሉም' : 'All'}
          </button>
          {CATEGORIES.map((cat) => (
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
              {isAmharic ? cat.labelAm : cat.labelEn}
            </button>
          ))}
        </div>

        {isLoading && <p>{tc('messages.loading')}</p>}
        {error && <p role="alert">{tc('messages.serverError')}</p>}
        {!isLoading && !error && items.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted, #5F6368)', padding: 40 }}>
            {isAmharic ? 'ምንም መጣጥፍ የለም' : 'No articles yet'}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {items.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              style={{ display: 'block', border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 12, overflow: 'hidden', textDecoration: 'none', color: 'var(--color-text, #1B1B1B)' }}
            >
              {article.cover_image_url && (
                <img src={article.cover_image_url} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              )}
              <div style={{ padding: 16 }}>
                {article.category && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary, #2E7D32)', textTransform: 'uppercase', marginBottom: 6 }}>
                    {isAmharic ? article.category.name_am ?? article.category.name_en : article.category.name_en}
                  </p>
                )}
                <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                  {isAmharic ? article.title_am ?? article.title_en : article.title_en}
                </h2>
                {article.excerpt_en && (
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)', marginBottom: 8 }}>
                    {article.excerpt_en}
                  </p>
                )}
                {article.published_at && (
                  <p style={{ fontSize: 11, color: 'var(--color-text-subtle, #9AA0A6)' }}>
                    {formatDate(article.published_at)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}