// server/src/jobs/notificationDispatch.job.js
// Flushes the notification outbox to external channels (email/SMS).
// Real-time (in_app) notifications are pushed immediately by
// sockets/adminNotifications.socket.js — this job only handles
// buffered channel delivery and retries.
//
// Uses the notification.model's `channelStatus` field to track per-channel
// delivery. Picks up rows where a channel is `queued` or `retrying`.
// Schedule: every minute.

'use strict';

const { execute } = require('./_runtime/jobRunner');
const logger = require('../config/logger');
const email = require('../config/email');
const sms = require('../config/smsProvider');
const { NOTIFICATION_CHANNELS } = require('../shared/constants/notificationTypes');

const NAME = 'notificationDispatch';
const SCHEDULE = '* * * * *'; // every minute
const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 3;

async function run({ log, now }) {
  // eslint-disable-next-line global-require
  const Notification = require('../modules/administrator/notifications/notification.model');

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  // Find notifications with pending channels
  const pending = await Notification.find({
    $or: [
      { 'channelStatus.email.state': { $in: ['queued', 'retrying'] } },
      { 'channelStatus.sms.state': { $in: ['queued', 'retrying'] } },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(BATCH_SIZE)
    .lean()
    .catch((err) => {
      log.error('query failed', { message: err.message });
      return [];
    });

  if (!pending.length) {
    return { processed: 0, skipped: 0, failed: 0, notes: 'no pending' };
  }

  for (const notif of pending) {
    try {
      // --- Email ---
      const emailState = notif.channelStatus && notif.channelStatus.email;
      if (emailState && ['queued', 'retrying'].includes(emailState.state)) {
        if ((emailState.attempts || 0) >= MAX_ATTEMPTS) {
          await markChannelFailed(Notification, notif._id, 'email', 'MAX_ATTEMPTS');
          skipped += 1;
        } else if (notif.channels.includes(NOTIFICATION_CHANNELS.EMAIL) && notif.recipientEmail) {
          try {
            await email.sendMail({
              to: notif.recipientEmail,
              subject: notif.title || 'AgroLink Ethiopia',
              html: renderEmail(notif),
              text: notif.body || '',
            });
            await markChannelSent(Notification, notif._id, 'email');
            processed += 1;
          } catch (err) {
            await markChannelRetry(Notification, notif._id, 'email', err.message);
            failed += 1;
            log.error('email send failed', { id: String(notif._id), message: err.message });
          }
        } else {
          await markChannelFailed(Notification, notif._id, 'email', 'MISSING_RECIPIENT');
          skipped += 1;
        }
      }

      // --- SMS ---
      const smsState = notif.channelStatus && notif.channelStatus.sms;
      if (smsState && ['queued', 'retrying'].includes(smsState.state)) {
        if ((smsState.attempts || 0) >= MAX_ATTEMPTS) {
          await markChannelFailed(Notification, notif._id, 'sms', 'MAX_ATTEMPTS');
          skipped += 1;
        } else if (notif.channels.includes(NOTIFICATION_CHANNELS.SMS) && notif.recipientPhone) {
          try {
            await sms.sendSms({
              to: notif.recipientPhone,
              message: buildSmsText(notif),
            });
            await markChannelSent(Notification, notif._id, 'sms');
            processed += 1;
          } catch (err) {
            await markChannelRetry(Notification, notif._id, 'sms', err.message);
            failed += 1;
            log.error('sms send failed', { id: String(notif._id), message: err.message });
          }
        } else {
          await markChannelFailed(Notification, notif._id, 'sms', 'MISSING_RECIPIENT');
          skipped += 1;
        }
      }
    } catch (err) {
      failed += 1;
      log.error('dispatch failed', { id: String(notif._id), message: err.message });
    }
  }

  return { processed, skipped, failed, notes: { batchSize: pending.length } };
}

// --- Channel state helpers -------------------------------------------------

async function markChannelSent(Notification, id, channel) {
  await Notification.updateOne(
    { _id: id },
    {
      $set: {
        [`channelStatus.${channel}.state`]: 'sent',
        [`channelStatus.${channel}.sentAt`]: new Date(),
        [`channelStatus.${channel}.lastError`]: null,
      },
    },
  );
}

async function markChannelRetry(Notification, id, channel, error) {
  await Notification.updateOne(
    { _id: id },
    {
      $inc: { [`channelStatus.${channel}.attempts`]: 1 },
      $set: {
        [`channelStatus.${channel}.state`]: 'retrying',
        [`channelStatus.${channel}.lastError`]: String(error).slice(0, 500),
        [`channelStatus.${channel}.lastAttemptAt`]: new Date(),
      },
    },
  );
}

async function markChannelFailed(Notification, id, channel, code) {
  await Notification.updateOne(
    { _id: id },
    {
      $set: {
        [`channelStatus.${channel}.state`]: 'failed',
        [`channelStatus.${channel}.lastError`]: code,
      },
    },
  );
}

// --- Template helpers ------------------------------------------------------
// Kept minimal here — the notifications module owns full templates.

function renderEmail(notif) {
  const title = notif.title || 'AgroLink Ethiopia';
  const body = notif.body || '';
  const link = notif.data && notif.data.deepLink
    ? `<p><a href="${require('../config/environment').app.clientUrl}${notif.data.deepLink}">Open in AgroLink</a></p>`
    : '';
  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#2e7d32;">${title}</h2>
  <p>${body}</p>
  ${link}
  <hr><p style="font-size:12px;color:#888;">AgroLink Ethiopia</p>
</body></html>`;
}

function buildSmsText(notif) {
  const title = notif.title || 'AgroLink';
  const body = notif.body || '';
  return `AgroLink: ${title}. ${body}`.slice(0, 300);
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };