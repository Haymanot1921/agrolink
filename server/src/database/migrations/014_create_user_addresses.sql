-- User addresses shared by the profile API.
CREATE TABLE IF NOT EXISTS user_addresses (
  user_id     BIGINT UNSIGNED NOT NULL,
  region      VARCHAR(80)     NULL,
  zone        VARCHAR(80)     NULL,
  woreda      VARCHAR(80)     NULL,
  kebele      VARCHAR(80)     NULL,
  city        VARCHAR(80)     NULL,
  line1       VARCHAR(200)    NULL,
  line2       VARCHAR(200)    NULL,
  postal_code VARCHAR(30)     NULL,
  geo_lat     DECIMAL(9,6)    NULL,
  geo_lng     DECIMAL(9,6)    NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_user_addresses_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
