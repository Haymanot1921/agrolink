-- 004_create_farmer_profiles.sql
-- Farmer-specific profile, produce listings, categories, and crop joins.
-- Depends on 001, 002, 003.

-- ─── Farmer profile extension ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farmer_profiles (
  user_id                   BIGINT UNSIGNED NOT NULL,
  farm_size_hectares        DECIMAL(8,2)    NULL,
  farming_experience_years  SMALLINT UNSIGNED NULL,
  primary_crops_json        JSON            NULL,
  irrigation_available      TINYINT(1)      NOT NULL DEFAULT 0,
  livestock_types_json      JSON            NULL,
  cooperative_member        TINYINT(1)      NOT NULL DEFAULT 0,
  created_at                DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_farmer_profiles_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Product categories (from 004 seeder) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS product_categories (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(80)     NOT NULL,
  group_code VARCHAR(32)     NOT NULL,
  name_en    VARCHAR(120)    NOT NULL,
  name_am    VARCHAR(120)    NOT NULL,
  is_system  TINYINT(1)      NOT NULL DEFAULT 1,
  is_active  TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order INT             NOT NULL DEFAULT 0,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_prod_cat_slug (slug),
  KEY idx_prod_cat_group (group_code, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Listings (product OR input) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  farmer_id        BIGINT UNSIGNED NOT NULL,
  kind             ENUM('product','input') NOT NULL DEFAULT 'product',
  category_id      BIGINT UNSIGNED NULL,       -- product_categories.id OR input_categories.id
  title            VARCHAR(200)    NOT NULL,
  description      TEXT            NULL,
  quantity         DECIMAL(12,3)   NOT NULL DEFAULT 0,
  unit             VARCHAR(20)     NOT NULL DEFAULT 'kg',
  price_per_unit_minor BIGINT UNSIGNED NOT NULL DEFAULT 0,
  currency         CHAR(3)         NOT NULL DEFAULT 'ETB',
  status           ENUM('draft','pending_review','published','out_of_stock','reserved','sold','rejected','changes_requested','hidden','removed','expired','archived')
                    NOT NULL DEFAULT 'draft',
  creation_method  ENUM('self','assisted','imported') NOT NULL DEFAULT 'self',
  assisted_by      BIGINT UNSIGNED NULL,       -- support agent id
  primary_image_id VARCHAR(400)    NULL,
  region           VARCHAR(80)     NULL,
  city             VARCHAR(80)     NULL,
  geo_lat          DECIMAL(9,6)    NULL,
  geo_lng          DECIMAL(9,6)    NULL,
  rejection_reason VARCHAR(500)    NULL,
  expires_at       DATETIME        NULL,
  published_at     DATETIME        NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at       DATETIME        NULL,
  PRIMARY KEY (id),
  KEY idx_listings_farmer (farmer_id, status),
  KEY idx_listings_status (status, created_at),
  KEY idx_listings_category (category_id, kind, status),
  KEY idx_listings_geo (geo_lat, geo_lng),
  CONSTRAINT fk_listings_farmer
    FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listing_images (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id  BIGINT UNSIGNED NOT NULL,
  public_id   VARCHAR(400)    NOT NULL,
  url         VARCHAR(500)    NOT NULL,
  sort_order  INT             NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listing_images_listing (listing_id, sort_order),
  CONSTRAINT fk_listing_images_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Listing moderation ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_reports (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id   BIGINT UNSIGNED NOT NULL,
  reporter_id  BIGINT UNSIGNED NOT NULL,
  reason_code  VARCHAR(60)     NOT NULL,
  reason_text  VARCHAR(1000)   NULL,
  status       ENUM('open','under_review','resolved','dismissed','closed') NOT NULL DEFAULT 'open',
  resolved_by  BIGINT UNSIGNED NULL,
  resolved_at  DATETIME        NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listing_reports_status (status, created_at),
  CONSTRAINT fk_listing_reports_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_listing_reports_reporter
    FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listing_moderation_history (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id   BIGINT UNSIGNED NOT NULL,
  from_status  VARCHAR(40)     NULL,
  to_status    VARCHAR(40)     NOT NULL,
  actor_id     BIGINT UNSIGNED NULL,
  reason_code  VARCHAR(60)     NULL,
  reason_text  VARCHAR(1000)   NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_listing_mod_history (listing_id, created_at),
  CONSTRAINT fk_listing_mod_history_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;