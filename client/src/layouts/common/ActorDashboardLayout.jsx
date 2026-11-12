import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { SidebarItem } from '../../shared/components/navigation/SidebarItem';
import { Topbar } from '../../shared/components/navigation/Topbar';
import { useTranslation } from '../../i18n/hooks/useTranslation';

export function ActorDashboardLayout({ basePath, navigation }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const activeItem = navigation.find(
    ({ path }) => pathname === `${basePath}/${path}`,
  );
  const title = activeItem
    ? t(activeItem.labelKey, activeItem.label)
    : t('labels.dashboard', 'Dashboard');

  const sidebar = (
    <nav aria-label={t('accessibility.dashboardNavigation', 'Dashboard navigation')}>
      {navigation.map((item) => (
        <SidebarItem
          key={item.path}
          to={`${basePath}/${item.path}`}
          icon={item.icon}
          label={t(item.labelKey, item.label)}
        />
      ))}
    </nav>
  );

  return (
    <div className="actor-dashboard">
      <aside className="actor-dashboard__sidebar">{sidebar}</aside>
      {mobileOpen && (
        <div className="actor-dashboard__overlay">
          <aside className="actor-dashboard__mobile-sidebar">{sidebar}</aside>
        </div>
      )}
      <div className="actor-dashboard__content">
        <Topbar
          title={title}
          notificationsHref={`${basePath}/notifications`}
          onToggleMenu={() => setMobileOpen((open) => !open)}
        />
        <main className="actor-dashboard__main">
          <Outlet />
        </main>
      </div>
      <style>{`
        .actor-dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--color-surface, #F5F7FA);
        }
        .actor-dashboard__sidebar {
          display: none;
          width: 240px;
          flex-shrink: 0;
          padding: 16px;
          background: var(--color-card, #fff);
          border-right: 1px solid var(--color-border, #E0E0E0);
        }
        .actor-dashboard__content {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-width: 0;
        }
        .actor-dashboard__main {
          flex: 1;
          padding: 24px 16px;
        }
        .actor-dashboard__overlay {
          position: fixed;
          inset: 0;
          z-index: 500;
          background: rgba(0, 0, 0, 0.4);
        }
        .actor-dashboard__mobile-sidebar {
          width: 240px;
          min-height: 100%;
          padding: 16px;
          background: var(--color-card, #fff);
        }
        @media (min-width: 768px) {
          .actor-dashboard__sidebar {
            display: block;
          }
          .actor-dashboard__overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
