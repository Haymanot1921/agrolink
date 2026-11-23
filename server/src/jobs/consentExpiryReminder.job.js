// Reminds assisted-management participants when consent is nearing expiry.
'use strict';

const { execute } = require('./_runtime/jobRunner');
const logger = require('../config/logger');
const { CONSENT_STATUSES, CONSENT_DEFAULTS } = require('../shared/constants/consentStatuses');
const { NOTIFICATION_TYPES } = require('../shared/constants/notificationTypes');
const database = require('../config/database');

function loadAssistedSocket() {
  try {
    return require('../sockets/assistedFarmer.socket');
  } catch (err) {
    if (
      err.code === 'MODULE_NOT_FOUND'
      && err.message.includes('../sockets/assistedFarmer.socket')
    ) {
      return {};
    }
    throw err;
  }
}

const { emitAssistedEvent, ASSISTED_SOCKET_EVENTS = {} } = loadAssistedSocket();
const NAME = 'consentExpiryReminder';
const SCHEDULE = '0 6 * * *';

function safeEmit(event, params) {
  if (typeof emitAssistedEvent !== 'function') return;
  try {
    emitAssistedEvent(event, params);
  } catch (err) {
    logger.warn('[jobs:consent] socket emit failed', { message: err.message });
  }
}

async function run({ log, now }) {
  const notificationsService = require('../modules/notifications/notifications.service');
  const warn30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const warn7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  try {
    const [expired] = await database.query(
      `SELECT id AS _id, farmer_id AS farmerId, agent_id AS agentId
       FROM consent_records WHERE status = ? AND expires_at <= ?
       ORDER BY expires_at ASC LIMIT 1000`,
      [CONSENT_STATUSES.ACTIVE, now],
    );
    for (const consent of expired) {
      try {
        await database.query(
          `UPDATE consent_records SET status = ?, updated_at = NOW()
           WHERE id = ? AND status = ?`,
          [CONSENT_STATUSES.EXPIRED, consent._id, CONSENT_STATUSES.ACTIVE],
        );
        safeEmit(ASSISTED_SOCKET_EVENTS.CONSENT_REVOKED, {
          farmerId: consent.farmerId,
          agentId: consent.agentId,
          consentId: consent._id,
          reason: 'expired',
        });
        await notificationsService.dispatch({
          userId: String(consent.farmerId),
          type: NOTIFICATION_TYPES.CONSENT_EXPIRING,
          title: 'Consent expired',
          body: 'The consent you granted for assisted management has expired.',
          data: { consentId: String(consent._id), deepLink: '/profile/consent' },
          priority: 'high',
        });
        processed += 1;
      } catch (err) {
        failed += 1;
        log.error('expire consent failed', { id: String(consent._id), message: err.message });
      }
    }
  } catch (err) {
    failed += 1;
    log.error('expire query failed', { message: err.message });
  }

  const reminders = [
    {
      tier: '30d',
      cutoff: warn30,
      from: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      title: 'Consent expires soon',
      body: 'Your consent for assisted management expires within 30 days.',
      priority: 'normal',
    },
    {
      tier: '7d',
      cutoff: warn7,
      from: now,
      title: 'Consent expires in 7 days',
      body: 'Renew now to keep assisted management active.',
      priority: 'high',
    },
  ];

  for (const reminder of reminders) {
    try {
      const [consents] = await database.query(
        `SELECT id AS _id, farmer_id AS farmerId
         FROM consent_records
         WHERE status = ? AND expires_at > ? AND expires_at <= ?
           AND (last_reminder_at IS NULL OR last_reminder_at <= ?)
           AND (last_reminder_tier IS NULL OR last_reminder_tier <> ?)
         ORDER BY expires_at ASC LIMIT 500`,
        [
          CONSENT_STATUSES.ACTIVE,
          now,
          reminder.cutoff,
          reminder.from,
          reminder.tier,
        ],
      );

      for (const consent of consents) {
        try {
          const [result] = await database.query(
            `UPDATE consent_records
             SET last_reminder_at = NOW(), last_reminder_tier = ?
             WHERE id = ? AND status = ?`,
            [reminder.tier, consent._id, CONSENT_STATUSES.ACTIVE],
          );
          if (!result.affectedRows) {
            skipped += 1;
            continue;
          }
          await notificationsService.dispatch({
            userId: String(consent.farmerId),
            type: NOTIFICATION_TYPES.CONSENT_EXPIRING,
            title: reminder.title,
            body: reminder.body,
            data: { consentId: String(consent._id), deepLink: '/profile/consent' },
            priority: reminder.priority,
          });
          processed += 1;
        } catch (err) {
          failed += 1;
          log.error(`${reminder.tier} reminder failed`, {
            id: String(consent._id),
            message: err.message,
          });
        }
      }
    } catch (err) {
      failed += 1;
      log.error(`${reminder.tier} reminder query failed`, { message: err.message });
    }
  }

  return {
    processed,
    skipped,
    failed,
    notes: {
      warn30: warn30.toISOString(),
      warn7: warn7.toISOString(),
      defaultValidityDays: CONSENT_DEFAULTS.defaultValidityDays,
    },
  };
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };
