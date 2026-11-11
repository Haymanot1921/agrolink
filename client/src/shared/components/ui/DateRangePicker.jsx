// client/src/shared/components/ui/DateRangePicker.jsx
// Two date inputs with preset shortcuts.
// SRS refs: §11.8.

import React from 'react';
import { useTranslation } from '@i18n/hooks/useTranslation';

const PRESETS = [
  { key: 'today', days: 0 },
  { key: 'last7', days: 7 },
  { key: 'last30', days: 30 },
  { key: 'last90', days: 90 },
];

function toISO(d) {
  return d.toISOString().slice(0, 10);
}

export function DateRangePicker({ from, to, onChange, presets = true }) {
  const { t } = useTranslation('common');

  const applyPreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange?.({ from: toISO(start), to: toISO(end) });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('dateRange.from')}
        </span>
        <input
          type="date"
          value={from ?? ''}
          onChange={(e) => onChange?.({ from: e.target.value, to })}
          style={inputStyle}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted, #5F6368)' }}>
          {t('dateRange.to')}
        </span>
        <input
          type="date"
          value={to ?? ''}
          onChange={(e) => onChange?.({ from, to: e.target.value })}
          style={inputStyle}
        />
      </label>
      {presets && (
        <div style={{ display: 'flex', gap: 4 }}>
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => applyPreset(p.days)}
              style={{ padding: '6px 10px', fontSize: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}
            >
              {t(`dateRange.${p.key}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '8px 10px',
  fontSize: 14,
  border: '1px solid var(--color-border, #E0E0E0)',
  borderRadius: 6,
  fontFamily: 'inherit',
};

export default DateRangePicker;