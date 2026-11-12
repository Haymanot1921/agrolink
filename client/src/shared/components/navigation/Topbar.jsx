// client/src/shared/components/navigation/Topbar.jsx
// App topbar — menu toggle, title, notifications, user menu.
// SRS refs: §11.8.

import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';

export function Topbar({
  title,
  onToggleMenu,
  notificationsCount = 0,
  notificationsHref = '/notifications',
  userMenuItems = [],
}) {
  const { t } = useTranslation('common');
  const { user, signOut } = useAuth();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 20px',
        borderBottom: '1px solid var(--color-border, #E0E0E0)',
        background: 'var(--color-card, #fff)',
      }}
    >
      {onToggleMenu && (
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={t('navigation.openMenu')}
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: 4 }}
        >
          ☰
        </button>
      )}

      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, flex: 1 }}>{title}</h1>

      <Link
        to={notificationsHref}
        aria-label={t('navigation.notificationsWithCount', { count: notificationsCount })}
        style={{ position: 'relative', textDecoration: 'none', fontSize: 20, padding: 4 }}
      >
        🔔
        {notificationsCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'var(--color-danger, #DC2626)',
              color: '#fff',
              borderRadius: 999,
              padding: '0 5px',
              fontSize: 10,
              fontWeight: 700,
              minWidth: 16,
              textAlign: 'center',
            }}
          >
            {notificationsCount > 99 ? '99+' : notificationsCount}
          </span>
        )}
      </Link>

      {user && (
        <Dropdown
          align="right"
          trigger={<Avatar name={user.fullName} src={user.avatarUrl} size="sm" />}
          items={[
            ...userMenuItems,
            ...(userMenuItems.length > 0 ? [{ divider: true }] : []),
            { label: t('navigation.logout'), danger: true, onClick: signOut },
          ]}
        />
      )}
    </header>
  );
}

export default Topbar;