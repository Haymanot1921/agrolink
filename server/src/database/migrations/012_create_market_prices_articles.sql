-- 012_create_market_prices_articles.sql
-- Market prices, price sources, articles, article categories,
-- notifications inbox. Depends on 001, 002.

-- ─── Market price sources ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_price_sources (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(60)     NOT NULL,
  name         VARCHAR(160)    NOT NULL,
  description  VARCHAR(500)    NULL,
  url          VARCHAR(500)    NULL,
  is_active    TINYINT(1)      NOT NULL DEFAULT 1,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_market_price_sources_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Market prices ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_prices (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_slug     VARCHAR(80)     NOT NULL,   -- FK to product_categories.slug
  source_id        BIGINT UNSIGNED NOT NULL,
  region           VARCHAR(80)     NOT NULL,
  city             VARCHAR(80)     NULL,
  observation_date DATE            NOT NULL,
  price_minor      BIGINT UNSIGNED NOT NULL,
  currency         CHAR(3)         NOT NULL DEFAULT 'ETB',
  unit             VARCHAR(20)     NOT NULL DEFAULT 'kg',
  change_from_previous_minor BIGINT NULL,
  is_active        TINYINT(1)      NOT NULL DEFAULT 1,
  created_by       BIGINT UNSIGNED NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mp_lookup (product_slug, region, observation_date),
  KEY idx_mp_obs_date (observation_date, is_active),
  CONSTRAINT fk_mp_source
    FOREIGN KEY (source_id) REFERENCES market_price_sources (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Article categories ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_categories (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug           VARCHAR(80)     NOT NULL,
  name_en        VARCHAR(160)    NOT NULL,
  name_am        VARCHAR(160)    NOT NULL,
  description_en VARCHAR(500)    NULL,
  description_am VARCHAR(500)    NULL,
  is_system      TINYINT(1)      NOT NULL DEFAULT 1,
  is_active      TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order     INT             NOT NULL DEFAULT 0,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_knowledge_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Articles ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug             VARCHAR(120)    NOT NULL,
  category_id      BIGINT UNSIGNED NOT NULL,
  title_en         VARCHAR(300)    NOT NULL,
  title_am         VARCHAR(300)    NULL,
  excerpt_en       VARCHAR(1000)   NULL,
  excerpt_am       VARCHAR(1000)   NULL,
  body_en          LONGTEXT        NOT NULL,
  body_am          LONGTEXT        NULL,
  author_id        BIGINT UNSIGNED NOT NULL,
  cover_image_id   VARCHAR(400)    NULL,
  cover_image_url  VARCHAR(500)    NULL,
  status           ENUM('draft','pending','under_review','approved','published','rejected','changes_requested','hidden','removed','archived')
                   NOT NULL DEFAULT 'draft',
  published_at     DATETIME        NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_articles_slug (slug),
  KEY idx_articles_status (status, published_at),
  KEY idx_articles_category (category_id, status),
  CONSTRAINT fk_articles_category
    FOREIGN KEY (category_id) REFERENCES knowledge_categories (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_articles_author
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── In-app notification inbox ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED NOT NULL,
  type             VARCHAR(120)    NOT NULL,
  priority         ENUM('low','normal','high','critical') NOT NULL DEFAULT 'normal',
  title            VARCHAR(300)    NULL,
  body             TEXT            NULL,
  data_json        JSON            NULL,
  channels_json    JSON            NOT NULL,
  channel_status_json JSON         NULL,
  recipient_email  VARCHAR(254)    NULL,
  recipient_phone  VARCHAR(20)     NULL,
  is_mandatory     TINYINT(1)      NOT NULL DEFAULT 0,
  language         CHAR(2)         NOT NULL DEFAULT 'en',
  read_at          DATETIME        NULL,
  read_by          BIGINT UNSIGNED NULL,
  deleted_at       DATETIME        NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_user_unread (user_id, read_at, created_at),
  KEY idx_notif_user_type (user_id, type, created_at),
  KEY idx_notif_email_pending (
    (JSON_EXTRACT(channel_status_json, '$.email.state')),
    created_at
  ),
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;