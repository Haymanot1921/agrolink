// client/src/layouts/common/LanguageSwitcher.jsx
// Language switcher used in PublicHeader, AuthLayout, Actor layouts.
// Two visual variants:
//   - 'compact'  → shows only current language + caret (for headers)
//   - 'menu'     → dropdown with all available languages
//   - 'inline'   → inline buttons (for settings page)
//
// Bilingual — uses `useLanguage` + `useTranslation`.

import React, { useState, useRef, useEffect } from 'react';

import { useLanguage } from '@i18n/hooks/useLanguage';
import { useTranslation } from '@i18n/hooks/useTranslation';

/**
 * @param {{ variant?: 'compact' | 'menu' | 'inline' }} props
 */
export function LanguageSwitcher({ variant = 'menu' }) {
  const { t } = useTranslation('common');
  const { language, availableLanguages, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Close dropdown on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const current = availableLanguages.find((l) => l.code === language);

  // ─────────── Inline variant ───────────
  if (variant === 'inline') {
    return (
      <div
        role="radiogroup"
        aria-label={t('labels.language')}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
      >
        {availableLanguages.map((lang) => {
          const selected = lang.code === language;
          return (
            <button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setLanguage(lang.code)}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: `1.5px solid ${
                  selected
                    ? 'var(--color-primary, #2E7D32)'
                    : 'var(--color-border, #E0E0E0)'
                }`,
                background: selected
                  ? 'var(--color-primary-light, #E8F5E9)'
                  : 'transparent',
                color: selected
                  ? 'var(--color-primary, #2E7D32)'
                  : 'var(--color-text, #1B1B1B)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              <span aria-hidden style={{ marginRight: 6 }}>
                {lang.flag}
              </span>
              {lang.native}
            </button>
          );
        })}
      </div>
    );
  }

  // ─────────── Compact + Menu variants ───────────
  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('labels.language')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid var(--color-border, #E0E0E0)',
          background: 'var(--color-card, #fff)',
          color: 'var(--color-text, #1B1B1B)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <span aria-hidden>{current?.flag}</span>
        {variant === 'menu' && <span>{current?.native}</span>}
        <span aria-hidden style={{ fontSize: 10 }}>
          ▼
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('labels.language')}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 180,
            margin: 0,
            padding: '6px 0',
            listStyle: 'none',
            background: 'var(--color-card, #fff)',
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 1000,
          }}
        >
          {availableLanguages.map((lang) => {
            const selected = lang.code === language;
            return (
              <li key={lang.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    background: selected
                      ? 'var(--color-primary-light, #E8F5E9)'
                      : 'transparent',
                    color: selected
                      ? 'var(--color-primary, #2E7D32)'
                      : 'var(--color-text, #1B1B1B)',
                    fontSize: 14,
                    fontWeight: selected ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>
                    <span aria-hidden style={{ marginRight: 8 }}>
                      {lang.flag}
                    </span>
                    {lang.native}
                  </span>
                  {selected && <span aria-hidden>✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}