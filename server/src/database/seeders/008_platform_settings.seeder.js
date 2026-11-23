// server/src/database/seeders/008_platform_settings.seeder.js
// Table:
//   platform_settings (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     `key` VARCHAR(120) NOT NULL UNIQUE,
//     `value` LONGTEXT NOT NULL,                    -- JSON-encoded string
//     value_type ENUM('string','number','boolean','json') NOT NULL DEFAULT 'string',
//     category VARCHAR(64) NOT NULL,                -- 'general', 'marketplace', 'moderation', 'notifications', 'security'
//     description VARCHAR(500) NULL,
//     is_public TINYINT(1) NOT NULL DEFAULT 0,      -- safe to expose to clients
//     updated_by BIGINT UNSIGNED NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//   );
//
// IMPORTANT: values are seeded with ON DUPLICATE KEY UPDATE that only
// refreshes `description` / `category` / `is_public`. The operator-set `value`
// is never overwritten by a re-run — seeds are one-way for value changes.
'use strict';

const DEFAULTS = [
  // General
  { key: 'platform.name', value: 'AgroLink Ethiopia', type: 'string', category: 'general', isPublic: 1,
    description: 'Platform display name' },
  { key: 'platform.timezone', value: 'Africa/Addis_Ababa', type: 'string', category: 'general', isPublic: 1,
    description: 'Default timezone for date display' },
  { key: 'platform.currency', value: 'ETB', type: 'string', category: 'general', isPublic: 1,
    description: 'Currency code (never changes in this release)' },
  { key: 'platform.languages', value: ['en', 'am'], type: 'json', category: 'general', isPublic: 1,
    description: 'Supported languages' },
  { key: 'platform.maintenance_mode', value: false, type: 'boolean', category: 'general', isPublic: 1,
    description: 'When true, non-admin API calls return 503' },
  { key: 'platform.maintenance_message', value: 'We are performing scheduled maintenance. Please check back shortly.', type: 'string', category: 'general', isPublic: 1,
    description: 'Message shown during maintenance' },

  // Marketplace
  { key: 'marketplace.listing_expiry_days', value: 60, type: 'number', category: 'marketplace', isPublic: 0,
    description: 'Days a published listing remains visible before expiry' },
  { key: 'marketplace.max_images_per_listing', value: 8, type: 'number', category: 'marketplace', isPublic: 1,
    description: 'Maximum images per listing' },
  { key: 'marketplace.require_verification_to_publish', value: true, type: 'boolean', category: 'marketplace', isPublic: 0,
    description: 'If true, farmers must be verified to publish listings' },
  { key: 'marketplace.allow_guest_browsing', value: true, type: 'boolean', category: 'marketplace', isPublic: 1,
    description: 'Allow unauthenticated browsing of marketplace' },
  { key: 'marketplace.min_order_etb', value: 0, type: 'number', category: 'marketplace', isPublic: 1,
    description: 'Minimum order amount in ETB (0 = no minimum)' },

  // Moderation
  { key: 'moderation.auto_approve_trusted_farmers', value: false, type: 'boolean', category: 'moderation', isPublic: 0,
    description: 'Auto-approve listings from verified farmers' },
  { key: 'moderation.review_sla_hours', value: 24, type: 'number', category: 'moderation', isPublic: 0,
    description: 'SLA hours for first moderation review' },

  // Disputes
  { key: 'disputes.buyer_window_days', value: 7, type: 'number', category: 'disputes', isPublic: 1,
    description: 'Days after order completion in which a buyer may open a dispute' },
  { key: 'disputes.first_response_sla_hours', value: 24, type: 'number', category: 'disputes', isPublic: 0,
    description: 'SLA for first admin response to a dispute' },
  { key: 'disputes.resolution_sla_hours', value: 120, type: 'number', category: 'disputes', isPublic: 0,
    description: 'SLA for final dispute resolution' },

  // Notifications
  { key: 'notifications.email_enabled', value: true, type: 'boolean', category: 'notifications', isPublic: 0,
    description: 'Global toggle for email notifications' },
  { key: 'notifications.sms_enabled', value: true, type: 'boolean', category: 'notifications', isPublic: 0,
    description: 'Global toggle for SMS notifications' },
  { key: 'notifications.push_enabled', value: false, type: 'boolean', category: 'notifications', isPublic: 0,
    description: 'Global toggle for push notifications' },
  { key: 'notifications.daily_summary_hour', value: 8, type: 'number', category: 'notifications', isPublic: 0,
    description: 'Hour (0–23, local TZ) at which daily admin summaries are sent' },

  // Security
  { key: 'security.max_failed_logins', value: 5, type: 'number', category: 'security', isPublic: 0,
    description: 'Failed logins before lockout' },
  { key: 'security.lockout_minutes', value: 15, type: 'number', category: 'security', isPublic: 0,
    description: 'Lockout duration in minutes' },
  { key: 'security.session_idle_minutes', value: 60, type: 'number', category: 'security', isPublic: 0,
    description: 'Idle timeout for web sessions' },
  { key: 'security.mfa_required_for_admin', value: true, type: 'boolean', category: 'security', isPublic: 0,
    description: 'Require step-up MFA for high-risk admin actions' },

  // Assisted (SRS §6.8)
  { key: 'assisted.max_actions_per_hour', value: 20, type: 'number', category: 'assisted', isPublic: 0,
    description: 'Max assisted actions per agent per hour before flagging' },
  { key: 'assisted.consent_max_age_days', value: 365, type: 'number', category: 'assisted', isPublic: 0,
    description: 'Max age of consent before requiring renewal' },
];

function serialize(value, type) {
  if (type === 'json' || typeof value === 'object') return JSON.stringify(value);
  if (type === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

async function run({ pool }) {
  const rows = DEFAULTS.map((d) => [
    d.key,
    serialize(d.value, d.type),
    d.type,
    d.category,
    d.description || null,
    d.isPublic ? 1 : 0,
  ]);

  if (!rows.length) return;

  // Only refresh metadata on re-run — do NOT overwrite operator-set values.
  await pool.query(
    `INSERT INTO platform_settings
       (\`key\`, \`value\`, value_type, category, description, is_public)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       value_type = VALUES(value_type),
       category = VALUES(category),
       description = VALUES(description),
       is_public = VALUES(is_public)`,
    [rows],
  );
}

module.exports = { run };