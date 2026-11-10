// client/src/pages/articles/PublicArticleCategoryPage.jsx
// SRS refs: §5.10, FR-ARTICLE-006.

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { api } from '@services/apiClient';
import { formatDate } from '@i18n/utils/formatters';

export function PublicArticleCategoryPage() {
  const { slug } = useParams();
  const { t } = useTranslation('common');
  const { language, isAmharic } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-articles-category', slug, language],
    queryFn: () => api.get('/public/articles', { params: { category: slug, lang: language, perPage: 20 } }),
    enabled: Boolean(slug),
  });

  const items = data?.items ?? [];
  const title = slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? '';

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${title}`}</title>
      </Helmet>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
        <Link to="/articles" style={{ fontSize: 14, color: 'var(--color-primary, #2E7D32)', marginBottom: 16, display: 'inline-block' }}>
          ← {isAmharic ? 'መጣጥፎች' : 'Articles'}
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, textTransform: 'capitalize' }}>
          {title}
        </h1>

        {isLoading && <p>{t('messages.loading')}</p>}
        {error && <p role="alert">{t('messages.serverError')}</p>}
        {!isLoading && !error && items.length === 0 && (
          <p style={{ color: 'var(--color-text-muted, #5F6368)' }}>
            {isAmharic ? 'ምንም መጣ