import { Link } from 'react-router-dom';

import { useAuth } from '@hooks/useAuth';
import { useTranslation } from '@i18n/hooks/useTranslation';

const QUICK_ACTIONS = [
  { to: '/farmer/products/new', key: 'addProduct', icon: '+' },
  { to: '/farmer/orders', key: 'viewOrders', icon: '📦' },
  { to: '/farmer/consultations', key: 'askExpert', icon: '🩺' },
];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation('farmer');
  const name = user?.fullName || user?.name || '';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, margin: '0 0 8px' }}>
          {t('dashboard.greeting', { name })}
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('dashboard.subGreeting')}
        </p>
      </header>

      <section aria-label={t('dashboard.quickActions.addProduct')}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 16,
          }}
        >
          {QUICK_ACTIONS.map(({ to, key, icon }) => (
            <Link
              key={key}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 18,
                borderRadius: 12,
                background: 'var(--color-card, #fff)',
                border: '1px solid var(--color-border, #E0E0E0)',
                color: 'var(--color-text, #1B1B1B)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 20 }}>{icon}</span>
              {t(`dashboard.quickActions.${key}`)}
            </Link>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: 28,
          padding: 20,
          borderRadius: 12,
          background: 'var(--color-card, #fff)',
          border: '1px solid var(--color-border, #E0E0E0)',
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>
          {t('dashboard.sections.recentOrders')}
        </h2>
        <p style={{ margin: 0, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('orders.empty')}
        </p>
      </section>
    </div>
  );
}
