// client/src/shared/components/navigation/SidebarItem.jsx
// Single nav link — auto-highlights on active route.
// SRS refs: §11.8.

import React from 'react';
import { NavLink } from 'react-router-dom';

export function SidebarItem({ to, icon, label, badge, disabled }) {
  if (disabled) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--color-text-muted, #5F6368)',
          opacity: 0.4,
          cursor: 'not-allowed',
        }}
      >
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <span style={{ flex: 1 }}>{label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: isActive ? 700 : 500,
        textDecoration: 'none',
        color: isActive ? 'var(--color-primary, #2E7D32)' : 'var(--color-text, #1B1B1B)',
        background: isActive ? 'var(--color-primary-light, #E8F5E9)' : 'transparent',
        transition: 'all 0.15s ease',
      })}
    >
      {icon && <span style={{ fontSize: 16, width: 20, textAlign: 'center' }} aria-hidden>{icon}</span>}
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && badge > 0 && (
        <span
          style={{
            background: 'var(--color-danger, #DC2626)',
            color: '#fff',
            borderRadius: 999,
            padding: '1px 8px',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  );
}

export default SidebarItem;