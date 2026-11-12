// client/src/pages/public/CareersPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';

const ROLES = [
  { id: 'eng', title: 'Software Engineer (Full-stack)', location: 'Addis Ababa / Remote', type: 'Full-time' },
  { id: 'design', title: 'UI/UX Designer', location: 'Addis Ababa', type: 'Full-time' },
  { id: 'agent', title: 'Support Agent (Regional)', location: 'Multiple regions', type: 'Full-time' },
  { id: 'expert', title: 'Agricultural Expert (Consultant)', location: 'Remote', type: 'Contract' },
];

export function CareersPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');

  const apply = (roleTitle) => {
    const subject = encodeURIComponent(`Application: ${roleTitle}`);
    window.location.href = `mailto:careers@agrolink.et?subject=${subject}`;
  };

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('careers.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px', lineHeight: 1.7 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
          {tp('careers.heading')}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-muted, #5F6368)', marginBottom: 32 }}>
          {tp('careers.intro')}
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {tp('careers.valuesTitle')}
          </h2>
          <ul style={{ paddingLeft: 24 }}>
            {[1, 2, 3].map((n) => (
              <li key={n} style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)', marginBottom: 6 }}>
                {tp(`careers.value${n}`)}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {tp('careers.openRolesTitle')}
          </h2>
          {ROLES.map((role) => (
            <div
              key={role.id}
              style={{
                padding: 16,
                border: '1px solid var(--color-border, #E0E0E0)',
                borderRadius: 10,
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <strong style={{ fontSize: 15 }}>{role.title}</strong>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)' }}>
                  📍 {role.location} · {role.type}
                </div>
              </div>
              <button
                type="button"
                onClick={() => apply(role.title)}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-primary, #2E7D32)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {tp('careers.apply')} →
              </button>
            </div>
          ))}
        </section>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {tp('careers.howToApplyTitle')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)' }}>
            {tp('careers.howToApplyBody')}
          </p>
        </section>
      </article>
    </>
  );
}