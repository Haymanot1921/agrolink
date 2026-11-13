// Landing page — hero, features, and a call to action.
// Guest-accessible. SRS §11.1, §11.7.

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useAuth } from '@hooks/useAuth';
import { defaultRouteFor } from '@app/routeGuards';

const FEATURES = [
  { icon: '🌾', titleKey: 'home.featureSell', bodyKey: 'home.featureSellBody' },
  { icon: '🛒', titleKey: 'home.featureBuy', bodyKey: 'home.featureBuyBody' },
  { icon: '👨‍🌾', titleKey: 'home.featureAdvice', bodyKey: 'home.featureAdviceBody' },
];

export function HomePage() {
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('public');
  const { user } = useAuth();
  const ctaHref = user ? defaultRouteFor(user) : '/auth/role';

  return (
    <>
      <Helmet>
        <title>{`${t('appName')} · ${tp('home.heroTitle')}`}</title>
        <meta name="description" content={tp('home.heroSubtitle')} />
      </Helmet>

      <section className="home-hero">
        <div className="home-hero__content">
          <span className="home-hero__eyebrow">{t('appName')}</span>
          <h1 className="home-hero__title">{tp('home.heroTitle')}</h1>
          <p className="home-hero__subtitle">{tp('home.heroSubtitle')}</p>
          <div className="home-hero__actions">
            <Link to="/marketplace" className="home-button home-button--light">
              {tp('home.ctaBrowse')}
              <span aria-hidden="true">→</span>
            </Link>
            <Link to={ctaHref} className="home-button home-button--outline">
              {tp('home.ctaSignUp')}
            </Link>
          </div>
        </div>
        <div className="home-hero__image-caption" aria-hidden="true">
          {t('appName')}
        </div>
      </section>

      <section className="home-features" aria-labelledby="home-features-title">
        <div className="home-section-heading">
          <span className="home-section-heading__eyebrow">{t('appName')}</span>
          <h2 id="home-features-title">{tp('home.featuresTitle')}</h2>
        </div>
        <div className="home-features__grid">
          {FEATURES.map((feature, index) => (
            <article className="home-feature-card" key={feature.titleKey}>
              <span className="home-feature-card__number" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="home-feature-card__icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{tp(feature.titleKey)}</h3>
              <p>{tp(feature.bodyKey)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-how">
        <div className="home-how__inner">
          <div>
            <span className="home-how__eyebrow">{t('appName')}</span>
            <h2>{tp('home.howItWorksTitle')}</h2>
          </div>
          <Link to="/how-it-works" className="home-button home-button--gold">
            {t('actions.learnMore')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
