// server/src/jobs/verificationReminder.job.js
// Reminds applicants and admins about pending identity verification
// applications (SRS §5.3, FR-ADMIN-003). Two passes:
//   1. Nudge admins if queue has items older than 48h (SLA).
//   2. Nudge applicants whose application is stale (>7 days, awaiting info).
// Schedule: every 6 hours.

'use strict';

const { execute } = require('./_runtime/jobRunner');
const { NOTIFICATION_TYPES } = require('../shared/constants/notificationTypes');
const { VERIFICATION_STATUSES } = require('../shared/constants/verificationStatuses');
const { emitAdminNotification } = require('../sockets/adminNotifications.socket');
const database = require('../config/database');

const NAME = 'verificationReminder';
const SCHEDULE = '0 */6 * * *'; // every 6 hours
const STALE_APPLICANT_DAYS = 7;
const SLA_ADMIN_HOURS = 48;

async function run({ log, now }) {
  // eslint-disable-next-line global-require
  const notificationsService = require('../modules/notifications/notifications.service');

  const slaCutoff = new Date(now.getTime() - SLA_ADMIN_HOURS * 60 * 60 * 1000);
  const staleCutoff = new Date(now.getTime() - STALE_APPLICANT_DAYS * 24 * 60 * 60 * 1000);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  // 1. Admin SLA nudge — count pending older than 48h
  try {
    const [[countRow]] = await database.query(
      `SELECT COUNT(*) AS total FROM verification_applications
       WHERE status IN (?, ?) AND created_at <= ?`,
      [VERIFICATION_STATUSES.PENDING, VERIFICATION_STATUSES.UNDER_REVIEW, slaCutoff],
    );
    const slaCount = Number(countRow.total);

    if (slaCount > 0) {
      // Notify all admins via role room (single event, not per-admin).
      emitAdminNotification({
        userId: 'role:admin', // role-targeted — notifications service will fan out
        type: NOTIFICATION_TYPES.ADMIN_SYSTEM_ALERT,
        title: 'Verification queue SLA breach',
        body: `${slaCount} application(s) waiting > ${SLA_ADMIN_HOURS}h`,
        data: { deepLink: '/administrator/identity-verification', count: slaCount },
        priority: 'high',
      });
      log.warn('verification SLA breach', { slaCount });
    }
  } catch (err) {
    failed += 1;
    log.error('SLA check failed', { message: err.message });
  }

  // 2. Applicant reminders — awaiting additional info
  let staleApplicants = [];
  try {
    const [rows] = await database.query(
      `SELECT id AS _id, applicant_id AS applicantId,
              info_requested_at AS infoRequestedAt, reminder_count AS reminderCount
       FROM verification_applications
       WHERE status = ? AND info_requested_at <= ?
       ORDER BY info_requested_at ASC LIMIT 500`,
      [VERIFICATION_STATUSES.ADDITIONAL_INFO_REQUESTED, staleCutoff],
    );
    staleApplicants = rows;
  } catch (err) {
    failed += 1;
    log.error('stale applicant query failed', { message: err.message });
    return { processed, skipped, failed };
  }

  for (const app of staleApplicants) {
    try {
      const reminderCount = (app.reminderCount || 0) + 1;

      // Cap reminders at 3 to avoid spam.
      if (reminderCount > 3) {
        skipped += 1;
        continue;
      }

      await database.query(
        `UPDATE verification_applications
         SET reminder_count = reminder_count + 1, last_reminder_at = NOW()
         WHERE id = ?`,
        [app._id],
      );

      await notificationsService.dispatch({
        userId: String(app.applicantId),
        type: NOTIFICATION_TYPES.VERIFICATION_INFO_NEEDED,
        title: 'Verification action required',
        body: 'Your identity verification needs more information',
        data: { deepLink: '/profile/verification', applicationId: String(app._id) },
        priority: 'high',
      });

      processed += 1;
    } catch (err) {
      failed += 1;
      log.error('applicant reminder failed', { applicationId: String(app._id), message: err.message });
    }
  }

  return { processed, skipped, failed, notes: { slaCount: staleApplicants.length } };
}

module.exports = { name: NAME, schedule: SCHEDULE, run: (ctx) => execute({ name: NAME, run }, ctx) };