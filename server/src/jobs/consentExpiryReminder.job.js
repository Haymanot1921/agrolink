// server/src/jobs/consentExpiryReminder.job.js
// SRS §6.8 — consent for assisted management must be renewed before expiry.
// Two reminders: 30 days before, 7 days before. On expiry, status flips
// to EXPIRED and the farmer + agent are notified.
// Schedule: daily at 06:00.

'use strict';

const { execute } = require('./_runtime/jobRunner');
const logger = require('../config/logger');
const { CONSENT_STATUSES, CONSENT_DEFAULTS } = require('../shared/constants/consentStatuses');
const { NOTIFICATION_TYPES } = require('../shared/constants/notificationTypes');
const { emitAssistedEvent, ASSISTED_SOCKET_EVENTS } = require('../sockets/assistedFarmer.socket') || {};

const NAME = 'consentExpiryReminder';
const SCHEDULE = '0 6 * * *';

// In case assistedFarmer.socket isn't present, fall back to notifications only.
function safeEmit(event, params) {
  try {
    if (typeof emitAssistedEvent === 'function') {
      emitAssistedEvent(event, params);
    }
  } catch {
    /* swallow — notifications still fire */
  }
}

async function run({ log, now }) {
  // eslint-disable-next-line global-require
  const ConsentRecord = require('../modules/administrator/assisted-farmer-monitoring/consentRecordReview.model');
  // eslint-disable-next-line global-require
  const notificationsService = require('../modules/administrator/notifications/notifications.service');

  const warn30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const warn7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expiryCutoff = now;

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  // 1. Expire overdue consents first (guarantee hard stop before reminders)
  try {
    const expired = await ConsentRecord.find({
      status: CONSENT_STATUSES.ACTIVE,
      expiresAt: { $lte: expiryCutoff },
    })
      .select('_id farmerId agentId expiresAt')
      .limit(1000)
      .lean();

    for (const c of expired) {
      try {
        await ConsentRecord.updateOne(
          { _id: c._id, status: CONSENT_STATUSES.ACTIVE },
          { $set: { status: CONSENT_STATUSES.EXPIRED, expiredAt: new Date() } },
        );
        safeEmit(ASSISTED_SOCKET_EVENTS.CONSENT_REVOKED, {
          farmerId: c.farmerId,
          agentId: c.agentId,
          consentId: c._id,
          reason: 'expired',
        });
        await notificationsService.dispatch({
          userId: String(c.farmerId),
          type: NOTIFICATION_TYPES.CONSENT_EXPIRING,
          title: 'Consent expired',
          body: 'The consent you granted for assisted management has expired.',
          data: { consentId: String(c._id), deepLink: '/profile/consent' },
          priority: 'high',
        });
        processed += 1;
      } catch (err) {
        failed += 1;
        log.error('expire consent failed', { id: String(c._id), message: err.message });
      }
    }
  } catch (err) {
    failed += 1;
    log.error('expire query failed', { message: err.message });
  }

  // 2. 30-day reminders
  try {
    const approaching = await ConsentRecord.find({
      status: CONSENT_STATUSES.ACTIVE,
      expiresAt: { $gt: now, $lte: warn30 },
      $or: [
        { lastReminderAt: { $exists: false } },
        { lastReminderAt: { $lt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000) } },
      ],
    })
      .select('_id farmerId agentId expiresAt')
      .limit(500)
      .lean();

    for (const c of approaching) {
      try {
        await ConsentRecord.updateOne(
          { _id: c._id },
          { $set: { lastReminderAt: new Date(), lastReminderTier: '30d' } },
        );
        await notificationsService.dispatch({
          userId: String(c.farmerId),
          type: NOTIFICATION_TYPES.CONSENT_EXPIRING,
          title: 'Consent expires soon',
          body: 'Your consent for assisted management expires within 30 days.',
          data: { consentId: String(c._id), deepLink: '/profile/consent' },
          priority: 'normal',
        });
        processed += 1;
      } catch (err) {
        failed += 1;
        log.error('30d reminder failed', { id: String(c._id), message: err.message });
      }
    }
  } catch (err) {
    failed += 1;
    log.error('30d query failed', { message: err.message });
  }

  // 3. 7-day reminders (higher priority)
  try {
    const urgent = await ConsentRecord.find({
      status: CONSENT_STATUSES.ACTIVE,
      expiresAt: { $gt: now, $lte: warn7 },
      lastReminderTier: { $ne: '7d' },
    })
      .select('_id farmerId agentId expiresAt')
      .limit(500)
      .lean();

    for (const c of urgent) {
      try {
        await ConsentRecord.updateOne(
          { _id: c._id },
          { $set: { lastReminderAt: new Date(), lastReminderTier: '7d' } },
        );
        await notificationsService.dispatch({
          userId: String(c.farmerId),
          type: NOTIFICATION_TYPES.CONSENT_EXPIRING,
          title: 'Consent expires in 7 days',
          body: 'Renew now to keep assisted management active.',
          data: { consentId: String(c._id), deepLink: '/profile/consent' },
          priority: 'high',
        });
        processed += 1;
      } catch (err) {
        failed += 1;
        log.error('7d reminder failed', { id: String(c._id), message: err.message });
      }
    }
  } catch (err) {
    failed += 1;
    log.error('7d query failed', { message: err.message });
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