-- 007_create_input_supplier.sql
-- Input categories, service-provider profiles, and input listings linkage.
-- Depends on 001, 002, 004.

-- ─── Input categories (from 005 seeder) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS input_categories (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(120)    NOT NULL,
  group_code    VARCHAR(32)     NOT NULL,
  name_en       VARCHAR(160)    NOT NULL,
  name_am       VARCHAR(160)    NOT NULL,
  is_restricted TINYINT(1)      NOT NULL DEFAULT 0,
  is_system     TINYINT(1)      NOT NULL DEFAULT 1,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order    INT             NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_input_cat_slug (slug),
  KEY idx_input_cat_group (group_code, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Service provider profile ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_provider_profiles (
  user_id            BIGINT UNSIGNED NOT NULL,
  provider_type_code VARCHAR(64)     NOT NULL,
  business_license_no VARCHAR(120)   NULL,
  tax_id             VARCHAR(60)     NULL,
  service_regions_json JSON          NULL,
  website            VARCHAR(300)    NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_sp_profiles_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;