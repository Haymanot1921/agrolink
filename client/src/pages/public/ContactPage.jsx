// client/src/pages/public/ContactPage.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { APP_INFO } from '@constants/platform';
import { api } from '@services/apiClient';

export function ContactPage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await api.post('/public/contact', form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.message || t('messages.tryAgain'));
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('contact.title')}`}</title>
      </Helmet>
      <article style={{ maxWidth: 640, margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
          {tp('contact.title')}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-muted, #5F6368)', marginBottom: 24 }}>
          {tp('contact.subtitle')}
        </p>

        {status === 'sent' && (
          <div role="status" style={{ padding: 12, background: '#E8F5E9', color: '#1B5E20', borderRadius: 8, marginBottom: 16 }}>
            ✓ {t('messages.saved')}
          </div>
        )}
        {status === 'error' && (
          <div role="alert" style={{ padding: 12, background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: 8, marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{tp('contact.name')}</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{tp('contact.email')}</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15 }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{tp('contact.message')}</span>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{ padding: 12, border: '1px solid var(--color-border, #E0E0E0)', borderRadius: 8, fontSize: 15, fontFamily: 'inherit' }}
            />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              padding: '14px 24px',
              background: 'var(--color-primary, #2E7D32)',
              color: 'var(--color-text-on-primary)',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: status === 'sending' ? 'wait' : 'pointer',
              opacity: status === 'sending' ? 0.7 : 1,
            }}
          >
            {status === 'sending' ? t('messages.loading') : tp('contact.send')}
          </button>
        </form>

        {(APP_INFO.SUPPORT_EMAIL || APP_INFO.SUPPORT_PHONE) && (
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-border, #E0E0E0)', fontSize: 14 }}>
            {APP_INFO.SUPPORT_EMAIL && (
              <p>✉ <a href={`mailto:${APP_INFO.SUPPORT_EMAIL}`}>{APP_INFO.SUPPORT_EMAIL}</a></p>
            )}
            {APP_INFO.SUPPORT_PHONE && (
              <p>☎ <a href={`tel:${APP_INFO.SUPPORT_PHONE}`}>{APP_INFO.SUPPORT_PHONE}</a></p>
            )}
          </div>
        )}
      </article>
    </>
  );
}