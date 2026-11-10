// client/src/pages/public/FaqPage.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

const QUESTIONS = [1, 2, 3, 4, 5, 6];

export function FaqPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');
  const [open, setOpen] = useState(null);

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('faq.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>
          {tp('faq.title')}
        </h1>

        <div>
          {QUESTIONS.map((n) => {
            const isOpen = open === n;
            const q = tp(`faq.q${n}`);
            const a = tp(`faq.a${n}`);
            const panelId = `faq-panel-${n}`;
            const btnId = `faq-btn-${n}`;

            return (
              <div
                key={n}
                style={{
                  borderBottom: '1px solid var(--color-border, #E0E0E0)',
                  padding: '16px 0',
                }}
              >
                <button
                  id={btnId}
                  type="button"
                  onClick={() => setOpen(isOpen ? null : n)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--color-text, #1B1B1B)',
                  }}
                >
                  <span>{q}</span>
                  <span aria-hidden style={{ fontSize: 20, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    style={{
                      paddingTop: 12,
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: 'var(--color-text-muted, #5F6368)',
                    }}
                  >
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </article>
    </>
  );
}