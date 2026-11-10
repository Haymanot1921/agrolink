// client/src/pages/public/HelpCenterPage.jsx
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

const CATEGORIES = ['account', 'orders', 'payments', 'consultations', 'technical'];

export function HelpCenterPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');
  const [query, setQuery] = useState('');

  // Flatten all questions into a searchable list
  const allArticles = useMemo(() => {
    const list = [];
    CATEGORIES.forEach((cat) => {
      for (let i = 1; i <= 3; i++) {
        const q = tp(`helpCenter.${cat}Q${i}`);
        const a = tp(`helpCenter.${cat}A${i}`);
        if (q && !q.startsWith('helpCenter.')) {
          list.push({ id: `${cat}-${i}`, category: cat, question: q, answer: a });
        }
      }
    });
    return list;
  }, [tp]);

  const filtered = query
    ? allArticles.filter(
        (a) =>
          a.question.toLowerCase().includes(query.toLowerCase()) ||
          a.answer.toLowerCase().includes(query.toLowerCase()),
      )
    : allArticles;

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('helpCenter.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 900, margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>
          {tp('helpCenter.title')}
        </h1>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tp('helpCenter.searchPlaceholder')}
          aria-label={tp('helpCenter.searchPlaceholder')}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 15,
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 10,
            marginBottom: 32,
          }}
        />

        {CATEGORIES.map((cat) => {
          const catArticles = filtered.filter((a) => a.category === cat);
          if (!catArticles.length) return null;

          return (
            <section key={cat} style={{ marginBottom: 32 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '2px solid var(--color-primary, #2E7D32)',
                }}
              >
                {tp(`helpCenter.${cat}Title`)}
              </h2>
              {catArticles.map((a) => (
                <details
                  key={a.id}
                  style={{
                    borderBottom: '1px solid var(--color-border, #E0E0E0)',
                    padding: '12px 0',
                  }}
                >
                  <summary
                    style={{
                      cursor: 'pointer',
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--color-text, #1B1B1B)',
                    }}
                  >
                    {a.question}
                  </summary>
                  <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.7, color: 'var(--color-text-muted, #5F6368)' }}>
                    {a.answer}
                  </p>
                </details>
              ))}
            </section>
          );
        })}

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted, #5F6368)' }}>
            {t('messages.noResults')}
          </p>
        )}
      </article>
    </>
  );
}