// server/src/jobs/notificationDispatch.job.js
// Flushes the notification outbox to external channels (email/SMS).
// Real-time (in_app) notifications are pushed immediately by
// sockets/adminNotifications.socket.js — this job only handles
// buffered channel delivery and retries.
//
// Uses the notification channel-status JSON field to track per-channel
// delivery. Picks up rows where a channel is `queued` or `retrying`.
// Schedule: every minute.

'use strict';

const { execute } = require('./_runtime/jobRunner');
const email = require('../config/email');
const sms = require('../config/smsProvider');
const { NOTIFICATION_CHANNELS } = require('../shared/constants/notificationTypes');
const notificationsRepository = require('../modules/notifications/notifications.repository');

const NAME = 'notificationDispatch';
const SCHEDULE = '* * * * *'; // every minute
const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 3;

async function run({ log }) {
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  // Find notifications with pending channels
  const pending = await notificationsRepository.findPendingChannelBatch(BATCH_SIZE);

  if (!pending.length) {
    return { processed: 0, skipped: 0, failed: 0, notes: 'no pending' };
  }

  for (const notif of pending) {
    try {
      // --- Email ---
      const emailState = notif.channelStatus && notif.channelStatus.email;
      if (emailState && ['queued', 'retrying'].includes(emailState.state)) {
        if ((emailState.attempts || 0) >= MAX_ATTEMPTS) {
          await markChannelFailed(notif._id, 'email', 'MAX_ATTEMPTS');
          skipped += 1;
        } else if (notif.channels.includes(NOTIFICATION_CHANNELS.EMAIL) && notif.recipientEmail) {
          try {
            await email.sendMail({
              to: notif.recipientEmail,
              subject: notif.title || 'AgroLink Ethiopia',
              html: renderEmail(notif),
              text: notif.body || '',
            });
            await markChannelSent(notif._id, 'email');
            processed += 1;
          } catch (err) {
            await markChannelRetry(notif._id, 'email', err.message);
            failed += 1;
            log.error('email send failed', { id: String(notif._id), message: err.message });
          }
        } else {
          await markChannelFailed(notif._id, 'email', 'MISSING_RECIPIENT');
          skipped += 1;
        }
      }

      // --- SMS ---
      const smsState = notif.channelStatus && notif.channelStatus.sms;
      if (smsState && ['queued', 'retrying'].includes(smsState.state)) {
        if ((smsState.attempts || 0) >= MAX_ATTEMPTS) {
          await markChannelFailed(notif._id, 'sms', 'MAX_ATTEMPTS');
          skipped += 1;
        } else if (notif.channels.includes(NOTIFICATION_CHANNELS.SMS) && notif.recipientPhone) {
          try {
            await sms.sendSms({
              to: notif.recipientPhone,
              message: buildSmsText(notif),
            });
            await markChannelSent(notif._id, 'sms');
            processed += 1;
          } catch (err) {
            await markChannelRetry(notif._id, 'sms', err.message);
            failed += 1;
            log.error('sms send failed', { id: String(notif._id), message: err.message });
          }
        } else {
          await markChannelFailed(notif._id, 'sms', 'MISSING_RECIPIENT');
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

async function markChannelSent(id, channel) {
  await notificationsRepository.updateChannelState(id, channel, 'sent', { lastError: null });
}

async function markChannelRetry(id, channel, error) {
  await notificationsRepository.updateChannelState(id, channel, 'retrying', {
    attempts: 1,
    lastError: String(error).slice(0, 500),
  });
}

async function markChannelFailed(id, channel, code) {
  await notificationsRepository.updateChannelState(id, channel, 'failed', { lastError: code });
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