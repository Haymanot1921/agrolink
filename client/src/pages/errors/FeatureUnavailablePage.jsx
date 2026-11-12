import { Link, useLocation } from 'react-router-dom';

import { useTranslation } from '@i18n/hooks/useTranslation';

export function FeatureUnavailablePage() {
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const segments = pathname.split('/').filter(Boolean);
  const section = (segments.at(-1) || 'dashboard')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <section
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 24,
        borderRadius: 12,
        background: 'var(--color-card, #fff)',
        border: '1px solid var(--color-border, #E0E0E0)',
      }}
    >
      <h1 style={{ marginTop: 0 }}>{section}</h1>
      <p style={{ color: 'var(--color-text-muted, #5F6368)' }}>
        {t('messages.featureUnavailable', 'This section is not available yet.')}
      </p>
      <Link to={`/${segments[0]}/dashboard`}>
        {t('actions.back', 'Back to dashboard')}
      </Link>
    </section>
  );
}
