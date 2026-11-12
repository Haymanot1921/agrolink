// client/src/pages/experts/PublicExpertDetailsPage.jsx
// Full professional profile + request consultation CTA.
// SRS refs: §5.8 FR-CONSULT-002 (permitted professional info only).

import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/apiClient';
import { formatCurrency } from '@i18n/utils/formatters';

export function PublicExpertDetailsPage() {
  const { expertId } = useParams();
  const { t } = useTranslation('buyer');
  const { t: tc } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-expert', expertId],
    queryFn: () => api.get(`/public/experts/${expertId}`),
    enabled: Boolean(expertId),
  });

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>{tc('messages.loading')}</div>;
  }
  if (error || !data) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }} role="alert">
        {tc('messages.serverError')}
      </div>
    );
  }

  const handleRequestConsultation = () => {
    if (!user) {
      navigate('/auth/login', { state: { from: `/experts/${expertId}` } });
      return;
    }
    navigate(`/farmer/consultations/new?expertId=${expertId}`);
  };

  return (
    <>
      <Helmet>
        <title>{`${tc('appName')} · ${data.full_name}`}</title>
      </Helmet>

      <article style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
        <Link
          to="/experts"
          style={{
            fontSize: 14,
            color: 'var(--color-primary, #2E7D32)',
            marginBottom: 24,
            display: 'inline-block',
          }}
        >
          ← {t('experts.title')}
        </Link>

        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 20,
            marginBottom: 32,
            paddingBottom: 24,
            borderBottom: '1px solid var(--color-border, #E0E0E0)',
          }}
        >
          {data.profile_image_url ? (
            <img
              src={data.profile_image_url}
              alt=""
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'var(--color-primary-light, #E8F5E9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
              }}
              aria-hidden
            >
              👨‍🌾
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
              {data.full_name}
            </h1>
            {data.verified && (
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: 'var(--color-success-light, #E8F5E9)',
                  color: 'var(--color-success, #2E7D32)',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                ✓ {t('experts.verified')}
              </span>
            )}
            {data.experience_years != null && (
              <p style={{ fontSize: 14, color: 'var(--color-text-muted, #5F6368)' }}>
                {data.experience_years} {t('experts.years')} {t('experts.experience')}
              </p>
            )}
          </div>

          {data.consultation_fee_etb != null && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', marginBottom: 4 }}>
                {t('experts.consultationFee')}
              </p>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary, #2E7D32)' }}>
                {formatCurrency(data.consultation_fee_etb)}
              </p>
            </div>
          )}
        </header>

        {/* Biography */}
        {data.biography && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={sectionHeading}>{t('experts.about')}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7 }}>{data.biography}</p>
          </section>
        )}

        {/* Specializations */}
        {data.specializations?.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={sectionHeading}>{t('experts.specializations')}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {data.specializations.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 13,
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: 'var(--color-primary-light, #E8F5E9)',
                    color: 'var(--color-primary, #2E7D32)',
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={sectionHeading}>{t('experts.education')}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {data.education.map((edu, i) => (
                <li
                  key={i}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    background: 'var(--color-surface, #F5F7FA)',
                    borderRadius: 8,
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{edu.degree}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted, #5F6368)' }}>
                    {edu.institution}
                    {edu.year ? ` · ${edu.year}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={sectionHeading}>{t('experts.certifications')}</h2>
            <ul style={{ paddingLeft: 20 }}>
              {data.certifications.map((cert, i) => (
                <li key={i} style={{ fontSize: 14, marginBottom: 6 }}>
                  {cert.name}
                  {cert.issued_by ? ` — ${cert.issued_by}` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={sectionHeading}>{t('experts.languages')}</h2>
            <p style={{ fontSize: 14 }}>{data.languages.join(', ')}</p>
          </section>
        )}

        {/* CTA */}
        <div
          style={{
            position: 'sticky',
            bottom: 16,
            padding: 20,
            background: 'var(--color-primary-light, #E8F5E9)',
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleRequestConsultation}
            style={{
              padding: '14px 40px',
              background: 'var(--color-primary, #2E7D32)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t('experts.requestConsultation')}
          </button>
          {!user && (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', marginTop: 8 }}>
              {t('experts.loginRequired')}
            </p>
          )}
        </div>
      </article>
    </>
  );
}

const sectionHeading = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 12,
};