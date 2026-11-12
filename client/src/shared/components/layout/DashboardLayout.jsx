// client/src/shared/components/layout/DashboardLayout.jsx
// Composite shell: sidebar + topbar + main content.
// SRS refs: §11.2–§11.6 dashboards.

import React, { useState } from 'react';
import { Topbar } from '../navigation/Topbar';

export function DashboardLayout({ sidebar, topbar, children, sidebarWidth = 240, notificationsCount = 0, title }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface, #F5F7FA)' }}>
      {/* Desktop sidebar */}
      <aside
        aria-label="Sidebar"
        style={{
          width: sidebarWidth,
          minHeight: '100vh',
          background: 'var(--color-card, #fff)',
          borderRight: '1px solid var(--color-border, #E0E0E0)',
          flexShrink: 0,
          display: 'none',
        }}
        className="dashboard-sidebar-desktop"
      >
        {sidebar}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 500,
          }}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              width: sidebarWidth,
              minHeight: '100%',
              background: 'var(--color-card, #fff)',
              padding: '16px 0',
            }}
          >
            {sidebar}
          </aside>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar
          title={title}
          onToggleMenu={() => setMobileOpen(true)}
          notificationsCount={notificationsCount}
        />
        <main style={{ flex: 1, padding: '24px 16px' }}>{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;