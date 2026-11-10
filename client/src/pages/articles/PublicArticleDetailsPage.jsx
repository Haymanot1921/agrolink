// client/src/pages/articles/PublicArticleDetailsPage.jsx
// SRS refs: §5.10, FR-ARTICLE-004, FR-ARTICLE-007.

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { api } from '@services/apiClient';
import { formatDate } from '@i18n/utils/formatters';

export function PublicArticleDetailsPage() {
  const { articleId } = useParams();
  const { t } = useTranslation('common');
  const { language, isAmharic } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-article', articleId, language],
    queryFn: () => api.get(`/public/articles/${articleId}`, { params: { lang: language } }),
    enabled: Boolean(articleId),
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>{t('messages.loading')}</div>;
  if (error || !data) return <div style={{ padding: 40, textAlign: 'center' }}>{t('messages.serverError')}</div>;

  const title = isAmharic ? data.title_am ?? data.title_en : data.title_en;
  const content = isAmharic ? data.content_am ?? data.content_en : data.content_en;

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${title}`}</title>
      </Helmet>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '32px 16px', lineHeight: 1.75 }}>
        <Link to="/articles" style={{ fontSize: 14, color: 'var(--color-primary, #2E7D32)', marginBottom: 16, display: 'inline-block' }}>
          ← {isAmharic ? 'መጣጥፎች' : 'Articles'}
        </Link>

        {data.cover_image_url && (
          <img src={data.cover_image_url} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: 24 }} />
        )}

        {data.category && (
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary, #2E7D32)', textTransform: 'uppercase', marginBottom: 8 }}>
            {isAmharic ? data.category.name_am ?? data.category.name_en : data.category.name_en}
          </p>
        )}

        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{title}</h1>

        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--color-text-muted, #5F6368)', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--color-border, #E0E0E0)' }}>
          {data.author_name && <span>{data.author_name}</span>}
          {data.published_at && <span>· {formatDate(data.published_at)}</span>}
          {data.read_time_minutes && <span>· {data.read_time_minutes} min read</span>}
        </div>

        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </>
  );
}